import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Feather from '@expo/vector-icons/Feather';
import Text from './Text';
import { colors, radius, spacing, shadow } from '../../theme/tokens';
import type { RootStackParamList } from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'home' | 'history';

const ITEMS: { key: Tab; label: string; icon: keyof typeof Feather.glyphMap; route: keyof RootStackParamList }[] = [
  { key: 'home', label: 'Home', icon: 'home', route: 'Home' },
  { key: 'history', label: 'History', icon: 'clock', route: 'History' },
];

export default function FloatingNavBar({ active }: { active: Tab }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + spacing.md }]}>
      <View style={styles.bar}>
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          const tint = isActive ? colors.ink : colors.inkTertiary;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => {
                if (!isActive) navigation.navigate(item.route as 'Home');
              }}
            >
              <Feather name={item.icon} size={20} color={tint} />
              <Text variant="meta" color={tint} weight={isActive ? '600' : '500'}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
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
