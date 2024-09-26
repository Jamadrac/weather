import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { picApi } from "@/config";

export default function App() {
  const [placeQuery, setPlaceQuery] = useState<string>("");
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [history, setHistory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPlaceDetails = async () => {
    setLoading(true);
    try {
      // Fetch place details from OpenStreetMap's Nominatim API
      const url = `https://nominatim.openstreetmap.org/search?q=${placeQuery}&format=json&limit=1`;
      const response = await axios.get(url);
      const place = response.data[0];

      if (place) {
        setPlaceDetails(place);
        await fetchImage(place.display_name);
        setHistory(`A brief history of ${place.display_name}.`);
      } else {
        setPlaceDetails(null);
        setPhotoUrl("");
        setHistory("Place not found. Try another search.");
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async (query: string) => {
    const pexelsKey = `${picApi}`; // Replace with your Pexels API key
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
        {
          headers: {
            Authorization: pexelsKey,
          },
        }
      );
      const photo = response.data.photos[0]?.src?.medium;
      setPhotoUrl(photo || "");
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a Place</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter place name (e.g., Lusaka)"
        value={placeQuery}
        onChangeText={setPlaceQuery}
      />
      <Button title="Search" onPress={fetchPlaceDetails} />

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : placeDetails ? (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.placeName}>{placeDetails.display_name}</Text>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.image} />
          ) : (
            <Text>No image found</Text>
          )}
          <Text style={styles.historyTitle}>History</Text>
          <Text style={styles.historyText}>{history}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.loadingText}>Enter a place to search</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  resultContainer: {
    alignItems: "center",
  },
  placeName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  historyText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
