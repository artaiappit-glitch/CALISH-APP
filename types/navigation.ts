import type { NavigatorScreenParams } from '@react-navigation/native';

// Bottom tabs: the always-mounted destinations.
export type TabParamList = {
  Home: undefined;
  History: undefined;
};

// Root stack: the tab shell plus the workout flow pushed on top.
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Preview: { dayIndex: number };
  Workout: { dayIndex: number };
};
