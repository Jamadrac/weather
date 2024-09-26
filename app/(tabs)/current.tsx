import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { apix } from "@/config";

const current = () => {
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [weather, setWeather] = useState<any>(null);

  const API_KEY = `${apix}`; //i was on rapid speed env erros didnt time captain thanks for understanding ;

  const fetchWeather = () => {
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&country=${countryCode}&key=${API_KEY}`;

    axios
      .get(url)
      .then((response) => {
        setWeather(response.data.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Weather</Text>
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
      <Button title="Get Weather" onPress={fetchWeather} />

      {weather && (
        <View style={styles.weatherContainer}>
          <Text>City: {weather.city_name}</Text>
          <Text>Country: {weather.country_code}</Text>
          <Text>Temperature: {weather.temp}°C</Text>
          <Text>Feels Like: {weather.app_temp}°C</Text>
          <Text>Description: {weather.weather.description}</Text>
          <Text>Wind Speed: {weather.wind_spd} m/s</Text>
          <Text>Humidity: {weather.rh}%</Text>
          <Text>Air Quality Index: {weather.aqi}</Text>
          <Text>Observation Time: {weather.ob_time}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  weatherContainer: {
    marginTop: 20,
  },
});

export default current;
