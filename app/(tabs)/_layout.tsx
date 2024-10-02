import { Tabs } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

// Define icon mapping
const getIconName = (routeName: string, isFocused: boolean) => {
  let iconName: keyof typeof Ionicons.glyphMap = "home";

  if (routeName === "current") {
    iconName = isFocused ? "today" : "today-outline";
  } else if (routeName === "explore") {
    iconName = isFocused ? "compass" : "compass-outline";
  } else if (routeName === "WeatherScreen") {
    iconName = isFocused ? "cloudy" : "cloudy-outline";
  } else if (routeName === "profile") {
    iconName = isFocused ? "person" : "person-outline";
  }

  return iconName;
};

// TabBarButton Component
const TabBarButton = ({
  isFocused,
  routeName,
  onPress,
  onLongPress,
}: {
  isFocused: boolean;
  routeName: string;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const translateY = interpolate(scale.value, [0, 1], [0, -8]);
    return {
      transform: [{ scale: scaleValue }, { translateY }],
    };
  });

  const iconName = getIconName(routeName, isFocused);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.buttonContainer}
    >
      <Animated.View style={animatedIconStyle}>
        <Ionicons
          name={iconName}
          size={24}
          color={isFocused ? "#0891b2" : "#737373"}
        />
      </Animated.View>
    </Pressable>
  );
};

// Custom TabBar Component
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            routeName={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

// Main Layout Component
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="current"
        options={{
          title: "Current",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Tabs.Screen
        name="WeatherScreen"
        options={{
          title: "Weather",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: "white",
    borderRadius: 15,
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
