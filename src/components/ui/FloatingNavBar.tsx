import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import Text from './Text';
import { colors, radius, spacing, shadow } from '../../theme/tokens';

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  History: 'clock',
};

/**
 * Custom floating tab bar for the bottom-tab navigator. Renders one pill with
 * an item per tab; switching tabs keeps both screens mounted.
 */
export default function FloatingNavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + spacing.md }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const tint = isActive ? colors.ink : colors.inkTertiary;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isActive && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.item}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isActive ? { selected: true } : {}}
              onPress={onPress}
            >
              <Feather name={ICONS[route.name] ?? 'circle'} size={20} color={tint} />
              <Text variant="meta" color={tint} weight={isActive ? '600' : '500'}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadow.floating,
  },
  item: {
    minWidth: 96,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
  },
});
