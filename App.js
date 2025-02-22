import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, TextInput } from 'react-native';
import { Alert } from 'react-native';


  const db = {
    0: ['clear sky', require('./assets/clear.png'), '#000'],
    1: ['mainly clear', require('./assets/light-cloud.png'),'#000'],
    2: ['partly cloudy', require('./assets/cloudy.jpg'),'#000'],
    3: ['overcast', require('./assets/heavy-cloud.png'),'#000'],
    4: ['snow grains', require('./assets/sleet.png'),'#ff6600'],
  };
  const getWeatherbg = (code) => {
    if(db['' + code]) {
      return db['' + code][1];
    }else{
      return require('./assets/light-cloud.png');
    }
  };
  const getLocation = async(placeName) => {
    const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + placeName;
    debugger;
    let res = null;
    let json = null;
    try {
      res = await fetch(geoUrl);
      json = await res.json();
    } catch(err) {
      throw Error('GeoCoding API problem' +err.message);
    } 
    if(json.results) {
      const finalResult = {
        name: json.results[0].name + ',' + json.result[0].admin1,
        ladtitude: json.results[0].ladtitude,
        longtitude: json.results[0].longtitude
      }
      return finalResult;
    } else {
      throw Error('place is not found')
    }
  }
  const getWeather = async(location) => {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude='+ location.ladtitude + '&longitude=' +location.longtitude +'current_weather=true';
    try {
      const json = await fetch(weatherUrl);
    } catch(err) {
      throw Error('Weather API problem:' +err.message);
    }
    return{
      temp: json.current_weather.temperature,
      weather: json.current_weather.weatherCode
    }
  }
export default function App() {
  const [data, setData] = useState({
    place: 'city name',
    weatherCode: 100,
    temp: 0
  });
  const [keyword, setKeyword] = useState('');
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='height'>
      <StatusBar/>
      <ImageBackground
      source={require('./assets/hail.png')}
      resizeMode='cover'
      style={{flex: 1, justifyContent: 'center'}}
      
      >
        <View style={{paddingHorizontal: '20%'}}>
          <Text style={[styles.text, {fontSize: 36, fontWeight: 'bold'}]}>{data.placeName}</Text>
          <Text style={[styles.text, {fontSize: 30}]}>{data.weatherCode}</Text>
          <Text style={[styles.text, {fontSize: 36, fontWeight: 'bold'}]}>{data.temp}°C</Text>
          <TextInput
            value={keyword}
            onChangeText={setKeyword} 
            style={{
              marginTop: 30,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#ccc',
              borderRadius: 10
            }}
            placeholder='search weather'
            placeholderTextColor='#ccc'
            onSubmitEditing={ async() => {
              try{
                debugger;
                const location = await getLocation(keyword)
                const weatherObj = await getWeather(location)

                setData({
                  place: location.name,
                  weatherCode: weatherObj.weather,
                  temp: weatherObj.temp
                })
              } catch(err) {
                Alert.alert(err.message);
              }
            }}
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
 text: {
  textAlign: 'center',
  color: '#333'
 }
})

