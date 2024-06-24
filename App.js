import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';

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
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';

import { useColorScheme } from './hooks/useColorScheme';
import BoingBold from './assets/fonts/Boing-Bold.ttf';
import BoingSemiBold from './assets/fonts/Boing-SemiBold.ttf';
import BoingMedium from './assets/fonts/Boing-Medium.ttf';
import BoingRegular from './assets/fonts/Boing-Regular.ttf';
import BoingLight from './assets/fonts/Boing-Light.ttf';
import App from './screen';
import { StyleSheet } from 'react-native';
import { AnimatedBottomSheet } from './components';
import { colors } from './constants/theme';
import { SCREEN_WIDTH } from './utils/config';

const { RED } = colors;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const connectionMessage =
  'Order book could not connect to the internet. Please check your internet connection and try again.';

export default function RootLayout() {
  const [networkStatus, setNetworkStatus] = useState(true);
  const [loaded, error] = useFonts({
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

  const neworkInformation = useNetInfo();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <View style={styles.container} />;
  }

  console.log('networkStatus: ', neworkInformation.isConnected);

  return (
    <View style={styles.container}>
      <App />
      <AnimatedBottomSheet
        backgroundColor={RED}
        message={connectionMessage}
        closeable={false}
        visible={!neworkInformation.isConnected}
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
