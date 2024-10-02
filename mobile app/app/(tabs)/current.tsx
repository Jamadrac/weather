import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";
import axios from "axios";
import { apix } from "@/config";
import { getSkyColor } from "./utils/getSkyColor";

interface Weather {
  city_name: string;
  temp: number;
  weather: {
    description: string;
  };
  wind_spd: number;
  rh: number;
  sunrise: string;
}

const current: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#87CEEB");

  const API_KEY = apix;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Fetch weather for current location
      if (location) {
        fetchWeatherDataByCoords(
          location.coords.latitude,
          location.coords.longitude
        );
      }
    })();
  }, []);

  useEffect(() => {
    const skyColor = getSkyColor();
    setBackgroundColor(skyColor);
  }, [currentWeather]);

  const fetchWeatherData = () => {
    axios
      .get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY}`)
      .then((response) => setCurrentWeather(response.data.data[0]))
      .catch((error) => console.log(error));
  };

  const fetchWeatherDataByCoords = (lat: number, lon: number) => {
    axios
      .get(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}`
      )
      .then((response) => setCurrentWeather(response.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getWeatherIcon = (): any => {
    if (!currentWeather) return require("./assets/default.png");
    if (currentWeather.weather.description.includes("Sunny")) {
      return require("./assets/sunny.png");
    } else if (currentWeather.weather.description.includes("Cloudy")) {
      return require("./assets/cloudy.png");
    }
    return require("./assets/default.png");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <BlurView intensity={90} style={styles.blurBackground}>
        {/* Search input on top */}
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
        />
        <Button title="Get Weather" onPress={fetchWeatherData} />

        {/* Weather Details */}
        {currentWeather && (
          <View style={styles.weatherContainer}>
            <Image source={getWeatherIcon()} style={styles.weatherIcon} />
            <Text style={styles.city}>{currentWeather.city_name}</Text>
            <Text style={styles.temperature}>{currentWeather.temp}°C</Text>
            <Text style={styles.weatherDescription}>
              {currentWeather.weather.description}
            </Text>

            <View style={styles.weatherDetails}>
              <Text>Wind: {currentWeather.wind_spd} m/s</Text>
              <Text>Humidity: {currentWeather.rh}%</Text>
              <Text>Sunrise: {currentWeather.sunrise}</Text>
            </View>
          </View>
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
  weatherIcon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  blurBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "absolute",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: "80%",
    textAlign: "center",
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 80, // Adjust for iOS/Android
  },
  weatherContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  weatherDescription: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default current;
