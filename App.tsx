import React, { useCallback, useEffect, useState } from "react";
import Root from "./src/root";
import { AthContextProvider } from "./src/Servise/Ath/athContaxt";
import { EventContextProvider } from "./src/Servise/Events/eventContaxt";
import { SignalRProvider } from "./src/Servise/Sinal/SignalRContext";
import { RootSiblingParent } from 'react-native-root-siblings';
import { useKeepAwake } from "expo-keep-awake";

import { Vibration, View } from "react-native";
import AppLoading from 'expo-app-loading';
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { Text } from "react-native";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Prevent rendering before fonts load
  }

  return (
    <RootSiblingParent>  
      <Root />
    </RootSiblingParent>
  );
}