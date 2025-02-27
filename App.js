import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, TextInput } from 'react-native';

export default function App() {

  const [keyword, setKeyword] = useState('');

  const [data, setData] = useState({
    place: 'City name',
    weatherDescription: "Clear Sky",
    temp: 0,
    backgroundUrl: require('./assets/clear.png')
  });

  const listWeatherData = [
    {
      weathercode: [0],
      weatherDescription: 'clear sky',
      color: '#000',
      backgroundUrl: require('./assets/clear.png'),
    },
    {
      weathercode: [1,2,3],
      weatherDescription: 'Partly cloudy',
      backgroundUrl: require('./assets/cloudy.jpg'),
      color: '#000'
    },
    {
      weathercode: [45,48],
      weatherDescription: 'Frog',
      backgroundUrl: require('./assets/sleet.png'),
      color: '#ff6600'
    },
    {
      weathercode: [],
      weatherDescription: 'Mainly clear',
      backgroundUrl: require('./assets/light-cloud.png'),
      color: '#000'
    },
    {
      weathercode: [],
      weatherDescription: 'Overcast',
      backgroundUrl: require('./assets/heavy-cloud.png'),
      color: '#000'
    },
    {
      weathercode: [],
      weatherDescription: 'Snow grains',
      backgroundUrl: require('./assets/sleet.png'),
      color: '#ff6600'
    },
    
  ]

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
  const location = await getLocation(keyword)
  const weatherResult = await getWeather(location)
  const weatherCodeData = listWeatherData.find(x => x.weathercode.includes(weatherResult.weathercode));
  setData({
    place: location.name,
    weatherDescription: weatherCodeData?.weatherDescription || 'unknown',
    temp: weatherResult.temp,
    backgroundUrl: weatherCodeData?.backgroundUrl || require('./assets/clear.png')
  })
}

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='height'>
      <StatusBar/>
      <ImageBackground
      source={data.backgroundUrl}
      resizeMode='cover'
      style={styles.imageBackground}
      >
        <View style={{paddingHorizontal: '20%'}}>
          <Text style={[styles.text, {fontSize: 36, fontWeight: 'bold'}]}>{data.place}</Text>
          <Text style={[styles.text, {fontSize: 30}]}>{data.weatherDescription}</Text>
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

