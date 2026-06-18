import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAudioModeAsync } from 'expo-audio';
import { NavigationContainer, DefaultTheme, type InitialState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import HomeScreen from './screens/HomeScreen';
import PreviewScreen from './screens/PreviewScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import HistoryScreen from './screens/HistoryScreen';
import FloatingNavBar from './src/components/ui/FloatingNavBar';
import type { RootStackParamList, TabParamList } from './types/navigation';
import { colors, fonts } from './src/theme/tokens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Persist where the user was so a background-kill / reload resumes the
// workout instead of dumping them back on Home.
const NAV_STATE_KEY = 'nav_state_v1';

// Home + History live as always-mounted tabs behind the custom floating bar.
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingNavBar {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
}

// Light, monochrome navigation theme so screen backgrounds and chrome stay white.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.ink,
    border: colors.hairline,
    primary: colors.ink,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Allow the rest-timer beep to sound even when the iOS silent switch is on.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Restore the saved navigation state on launch.
  const [navReady, setNavReady] = useState(false);
  const [initialNavState, setInitialNavState] = useState<InitialState | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(NAV_STATE_KEY);
        if (saved) setInitialNavState(JSON.parse(saved));
      } catch {
        // ignore — start at the default route
      } finally {
        setNavReady(true);
      }
    })();
  }, []);

  if (!fontsLoaded || !navReady) {
    // Quiet white gate — avoids a flash of fallback fonts / wrong screen.
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={navTheme}
        initialState={initialNavState}
        onStateChange={(state) => {
          AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(state)).catch(() => {});
        }}
      >
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.ink,
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Preview"
            component={PreviewScreen}
            options={{ title: '' }} // title set dynamically inside the screen
          />
          <Stack.Screen
            name="Workout"
            component={WorkoutScreen}
            options={{ title: '' }} // title set dynamically inside the screen
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
