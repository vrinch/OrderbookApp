import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

// Importing necessary icons from Expo Vector Icons library
import {
  FontAwesome,
  MaterialIcons,
  Octicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Foundation,
  EvilIcons,
  Zocial,
  Feather,
  Fontisto,
} from '@expo/vector-icons';

// Importing font loading utilities from Expo
import { useFonts } from 'expo-font';

// Importing SplashScreen and NetInfo for handling splash screen and network status
import * as SplashScreen from 'expo-splash-screen';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';

// Importing fonts to be loaded up and used in the app
import BoingBold from './assets/fonts/Boing-Bold.ttf';
import BoingSemiBold from './assets/fonts/Boing-SemiBold.ttf';
import BoingMedium from './assets/fonts/Boing-Medium.ttf';
import BoingRegular from './assets/fonts/Boing-Regular.ttf';
import BoingLight from './assets/fonts/Boing-Light.ttf';

import App from './screen'; // main application screen component
import { AnimatedBottomSheet } from './components';
import { colors } from './constants/theme';
import { SCREEN_WIDTH } from './utils/config';

const { RED } = colors;

// Message to display when the app cannot connect to the internet
const connectionMessage =
  'Order book could not connect to the internet. Please check your internet connection and try again.';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Loading fonts using Expo's useFonts hook
    BoingBold,
    BoingSemiBold,
    BoingMedium,
    BoingRegular,
    BoingLight,
    ...FontAwesome.font,
    ...MaterialIcons.font,
    ...Octicons.font,
    ...MaterialCommunityIcons.font,
    ...SimpleLineIcons.font,
    ...Entypo.font,
    ...AntDesign.font,
    ...Ionicons.font,
    ...Foundation.font,
    ...EvilIcons.font,
    ...Zocial.font,
    ...Feather.font,
    ...Fontisto.font,
  });

  const networkInformation = useNetInfo(); // Hook to get real-time network information

  // Prevent the splash screen from auto-hiding before asset loading is complete.
  SplashScreen.preventAutoHideAsync();

  // Throw error if font loading fails
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Render a loading view if fonts are not yet loaded
  if (!loaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/* Render the main application screen */}
      <App />
      {/* AnimatedBottomSheet component displays a message when the app is not connected to the internet */}
      <AnimatedBottomSheet
        backgroundColor={RED}
        message={connectionMessage}
        closeable={false}
        visible={!networkInformation.isConnected}
        position={'top'}
        textStyle={{ paddingBottom: SCREEN_WIDTH / 13 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
