import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import PreviewScreen from './screens/PreviewScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f0f0f' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0f0f0f' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Training Week' }}
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
  );
}
