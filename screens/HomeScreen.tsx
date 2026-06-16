import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import workouts from '../data/workouts';
import type { RootStackParamList } from '../types/navigation';
import Text from '../src/components/ui/Text';
import { colors, radius, spacing, shadow } from '../src/theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Thin line icon per training day — monochrome, scannable as a set.
const ICON_MAP: Record<string, keyof typeof Feather.glyphMap> = {
  pull: 'chevron-up',
  push: 'chevron-down',
  core: 'target',
  pull2: 'chevrons-up',
  push2: 'chevrons-down',
  warmup: 'wind',
};

export default function HomeScreen({ navigation }: Props) {
  const activeDays = workouts.filter((d) => !d.restDay).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={workouts}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="display">Training week</Text>
            <Text variant="meta" color={colors.inkSecondary} style={styles.subtitle}>
              {activeDays} sessions · pick a day to start
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const iconName = item.icon ? ICON_MAP[item.icon] : undefined;
          return (
            <TouchableOpacity
              style={[styles.card, item.restDay && styles.cardRest]}
              onPress={() => navigation.navigate('Preview', { dayIndex: index })}
              activeOpacity={0.6}
            >
              <View style={styles.iconChip}>
                <Feather
                  name={iconName ?? 'circle'}
                  size={20}
                  color={item.restDay ? colors.inkTertiary : colors.ink}
                />
              </View>

              <View style={styles.cardInner}>
                <Text variant="cardTitle">{item.name}</Text>
                <Text variant="meta" color={colors.inkSecondary}>
                  {item.focus}
                </Text>
                <Text variant="meta" color={colors.inkTertiary} style={styles.count}>
                  {item.restDay ? 'Rest day' : `${item.exercises.length} exercises`}
                </Text>
              </View>

              <Feather name="chevron-right" size={20} color={colors.inkTertiary} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  subtitle: { marginTop: spacing.xs },

  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
    gap: spacing.lg,
    minHeight: 76,
    ...shadow.card,
  },
  cardRest: {
    backgroundColor: colors.surfaceMuted,
    ...shadow.pill,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInner: { flex: 1, gap: 2 },
  count: { marginTop: spacing.xs },
});
