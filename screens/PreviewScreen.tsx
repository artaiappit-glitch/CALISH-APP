import React, { useLayoutEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import workouts, { type Exercise } from '../data/workouts';
import type { RootStackParamList } from '../types/navigation';
import Text from '../src/components/ui/Text';
import { clearSession } from '../src/storage/session';
import { colors, radius, spacing, shadow } from '../src/theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

// ~45 s of work per set + rest between sets.
function estimateMins(exercises: Exercise[]): number {
  let total = 0;
  for (const ex of exercises) {
    total += ex.sets * 45;
    total += (ex.sets - 1) * ex.restSeconds;
  }
  return Math.max(5, Math.round(total / 60 / 5) * 5);
}

export default function PreviewScreen({ route, navigation }: Props) {
  const day = workouts[route.params.dayIndex];
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({ title: day.name });
  }, [navigation, day.name]);

  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const estMins = estimateMins(day.exercises);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="display">{day.name}</Text>
          <Text variant="body" color={colors.inkSecondary}>{day.focus}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Stat value={String(day.exercises.length)} label="exercises" />
          <View style={styles.statDivider} />
          <Stat value={String(totalSets)} label="sets" />
          <View style={styles.statDivider} />
          <Stat value={`~${estMins}`} label="minutes" />
        </View>

        {/* Exercise list */}
        <View style={styles.exerciseList}>
          {day.exercises.map((ex, i) => (
            <View key={i} style={styles.exerciseRow}>
              <View style={styles.exerciseIndex}>
                <Text variant="meta" color={colors.inkSecondary} weight="600">{i + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text variant="cardTitle">{ex.name}</Text>
                <Text variant="meta" color={colors.inkSecondary} style={styles.setsReps}>
                  {ex.sets} × {ex.reps}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Start button pinned at bottom */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.85}
          onPress={async () => {
            // Start fresh — drop any previously-saved progress for an old session.
            await clearSession();
            navigation.navigate('Workout', { dayIndex: route.params.dayIndex });
          }}
        >
          <Text variant="cardTitle" color={colors.onDark}>Start workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="title">{value}</Text>
      <Text variant="meta" color={colors.inkTertiary} style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 120, gap: spacing.xl },

  header: { gap: spacing.xs, paddingTop: spacing.xs },

  // ── Stats ─────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statLabel: { textTransform: 'lowercase' },
  statDivider: { width: 1, height: 32, backgroundColor: colors.hairline },

  // ── Exercise list ─────────────────────────────────────────────────────────
  exerciseList: { gap: spacing.sm },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  exerciseIndex: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: { flex: 1, gap: 2 },
  setsReps: { marginTop: spacing.xs },

  // ── Bottom bar ────────────────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  startBtn: {
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.floating,
  },
});
