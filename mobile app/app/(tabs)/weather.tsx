import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { apix } from "../../config";

const WeatherScreen = () => {
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = `${apix}`; //i was on rapid speed env erros didnt time captain thanks for understanding ;

  const fetchWeatherData = () => {
    // Fetch current weather
    axios
      .get(
        `https://api.weatherbit.io/v2.0/current?city=${city}&country=${countryCode}&key=${API_KEY}`
      )
      .then((response) => setCurrentWeather(response.data.data[0]))
      .catch((error) => console.log(error));

    // Fetch 16-day forecast
    axios
      .get(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&country=${countryCode}&key=${API_KEY}`
      )
      .then((response) => setForecast(response.data.data))
      .catch((error) => console.log(error));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Country Code"
          value={countryCode}
          onChangeText={setCountryCode}
        />
        <Button title="Get Weather" onPress={fetchWeatherData} />
      </View>

      {/* Current Weather Display */}
      {currentWeather && (
        <View style={styles.weatherContainer}>
          <Text>City: {currentWeather.city_name}</Text>
          <Text>Country: {currentWeather.country_code}</Text>
          <Text>Temperature: {currentWeather.temp}°C</Text>
          <Text>Feels Like: {currentWeather.app_temp}°C</Text>
          <Text>Weather: {currentWeather.weather.description}</Text>
          <Text>Wind Speed: {currentWeather.wind_spd} m/s</Text>
          <Text>Humidity: {currentWeather.rh}%</Text>
          <Text>Air Quality Index: {currentWeather.aqi}</Text>
          <Text>Observation Time: {currentWeather.ob_time}</Text>
        </View>
      )}

      {forecast.length > 0 && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {forecast.map((day: any, index: any): any => (
            <View key={index} style={styles.dayCard}>
              <Text>Date: {day.datetime}</Text>
              <Text>Max Temp: {day.max_temp}°C</Text>
              <Text>Min Temp: {day.min_temp}°C</Text>
              <Text>Weather: {day.weather.description}</Text>
              <Text>Precip: {day.precip}mm</Text>
              <Text>UV Index: {day.uv}</Text>
              <Text>
                Wind: {day.wind_spd} m/s ({day.wind_cdir_full})
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  weatherContainer: {
    marginBottom: 20,
  },
  dayCard: {
    width: 150,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default WeatherScreen;
