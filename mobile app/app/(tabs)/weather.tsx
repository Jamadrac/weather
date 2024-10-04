import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
import { apix } from "../../config";
import { getSkyColor } from "./utils/getSkyColor"; // Assuming you have this utility function

const WeatherScreen = () => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>("#87CEEB");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const API_KEY = `${apix}`;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Permission to access location was denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        // Fetch weather data based on coordinates
        fetchWeatherDataByCoords(lat, lon);
      }
    })();
  }, []);

  useEffect(() => {
    // Change background color based on current weather
    if (currentWeather) {
      const skyColor = getSkyColor(currentWeather.weather.description); // Assuming you pass the weather description to getSkyColor
      setBackgroundColor(skyColor);
    }
  }, [currentWeather]);

  const fetchWeatherDataByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const currentResponse = await axios.get(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}`
      );
      const city = currentResponse.data.data[0].city_name;
      setCity(city); // Set the city name

      setCurrentWeather(currentResponse.data.data[0]);

      const forecastResponse = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${API_KEY}`
      );
      setForecast(forecastResponse.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch weather data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    if (!city) {
      Alert.alert("Error", "Please enter a city");
      return;
    }
    setLoading(true);
    try {
      const currentResponse = await axios.get(
        `https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY}`
      );
      setCurrentWeather(currentResponse.data.data[0]);

      const forecastResponse = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${API_KEY}`
      );
      setForecast(forecastResponse.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch weather data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <BlurView intensity={90} style={styles.blurBackground}>
        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            value={city}
            onChangeText={setCity}
          />
          <Button title="Get Weather" onPress={fetchWeatherData} />
        </View>

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Current Weather Display */}
        {currentWeather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherTitle}>Current Weather</Text>
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

        {/* 16-day Weather Forecast */}
        {forecast.length > 0 && (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {forecast.map((day: any, index: any): any => (
              <View key={index} style={styles.dayCard}>
                <Text style={styles.forecastDate}>{day.datetime}</Text>
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
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "absolute",
  },
  inputContainer: {
    marginBottom: 20,
    position: "absolute",
    top: 80, // Adjust this for better positioning
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
    width: "100%",
  },
  weatherContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  forecastDate: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default WeatherScreen;
