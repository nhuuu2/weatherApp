import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, TextInput, Alert } from 'react-native';

export default function App() {

  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState({
    place: 'city name',
    weathercode: 100,
    temp: 0
  });

  const appInformations = {
    0: ['clear sky', require('./assets/clear.png'), '#000'],
    1: ['mainly clear', require('./assets/light-cloud.png'),'#000'],
    2: ['partly cloudy', require('./assets/cloudy.jpg'),'#000'],
    3: ['overcast', require('./assets/heavy-cloud.png'),'#000'],
    4: ['snow grains', require('./assets/sleet.png'),'#ff6600'],
  };

  const interpretWeather = (code) =>{
    if(code <= 1){
      return 'Clear Sky';
    }
    if(code > 1 && code <= 3){
      return 'Partly cloudy';
    }else if(code == 45 || code == 48){
      return 'Fog';
    }else{
      return 'Unknown: ' + code;
    }
  }

  const getLocation = async(cityName) => {
    const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + cityName;
    try {
      const res = await fetch(geoUrl);
      const data = await res.json();
      if(data.results && (data.results.length > 0)) {
        const locationResult = {
          name: data.results[0].name + ',' + data.results[0].admin1,
          latitude: data.results[0].latitude,
          longitude: data.results[0].longitude
        }
        return locationResult;
      }else{
        throw Error('Geo location could not be found or empty!')
      }
    } catch(err) {
      throw Error('GeoCoding API has encounted an error' + err.message);
    }
  }

  const getWeather = async(location) => {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude='+ location.latitude + '&longitude=' +location.longitude +'&current_weather=true';
    
    try {
      const res = await fetch(weatherUrl);
      console.log(weatherUrl);
      const data = await res.json();
      if(data){
        const weatherResult = {
          temp: data.current_weather.temperature,
          weathercode: data.current_weather.weathercode
        }
        return weatherResult;
      }else{
        throw Error('Weather information could not be found or empty!' + err.message);
      }
    } catch(err) {
      throw Error('Weather API has encounted an error:' + err.message);
    }
  }

const getWeatherInformation = async(keyword) => {
  debugger;
  const location = await getLocation(keyword)
  const weatherResult = await getWeather(location)
  if(location && weatherResult){
    setData({
      place: location.name,
      weathercode: weatherResult.weathercode,
      temp: weatherResult.temp
    })
  }else{
    Alert.alert("Location and weather information could not be found")
  }
}

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='height'>
      <StatusBar/>
      <ImageBackground
      source={require('./assets/hail.png')}
      resizeMode='cover'
      style={styles.imageBackground}
      >
        <View style={{paddingHorizontal: '20%'}}>
          <Text style={[styles.text, {fontSize: 36, fontWeight: 'bold'}]}>{data.place}</Text>
          <Text style={[styles.text, {fontSize: 30}]}>{interpretWeather(data.weathercode)}</Text>
          <Text style={[styles.text, {fontSize: 36, fontWeight: 'bold'}]}>{data.temp}°C</Text>
          <TextInput
            value={keyword}
            onChangeText={setKeyword} 
            style={styles.searchBar}
            placeholder='search weather'
            placeholderTextColor='#ccc'
            onSubmitEditing={async() => await getWeatherInformation(keyword)}
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
 text: {
  textAlign: 'center',
  color: '#FFF'
 },
 searchBar:{
  marginTop: 30,
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: '#ccc',
  borderRadius: 10
 },
 imageBackground:{
  flex: 1, 
  justifyContent: 'center'
 }
})

