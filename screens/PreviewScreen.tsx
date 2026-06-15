import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import workouts, { type Exercise } from '../data/workouts';
import type { RootStackParamList } from '../types/navigation';

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

  useLayoutEffect(() => {
    navigation.setOptions({ title: day.name });
  }, [navigation, day.name]);

  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const estMins = estimateMins(day.exercises);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.focusTitle}>{day.name}</Text>
          <Text style={styles.focusSub}>{day.focus}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Stat value={String(day.exercises.length)} label="exercises" />
            <View style={styles.statDivider} />
            <Stat value={String(totalSets)} label="sets" />
            <View style={styles.statDivider} />
            <Stat value={`~${estMins} min`} label="est. duration" />
          </View>
        </View>

        {/* Exercise list */}
        <View style={styles.exerciseList}>
          {day.exercises.map((ex, i) => (
            <View key={i} style={styles.exerciseRow}>
              <View style={styles.exerciseIndex}>
                <Text style={styles.exerciseIndexText}>{i + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseSetsReps}>
                  {ex.sets} × {ex.reps}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Start button pinned at bottom */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Workout', { dayIndex: route.params.dayIndex })}
        >
          <Text style={styles.startBtnText}>Start workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const C = {
  bg: '#0f0f0f',
  card: '#1c1c1e',
  border: '#2c2c2e',
  text: '#ffffff',
  sub: '#a0a0a8',
  muted: '#636366',
  blue: '#0a84ff',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingBottom: 120, gap: 20 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  focusTitle: {
    color: C.text,
    fontSize: 30,
    fontWeight: '800',
  },
  focusSub: {
    color: C.sub,
    fontSize: 15,
    marginTop: -8,
  },

  // ── Stats ─────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 14,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: C.blue,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: C.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: C.border,
  },

  // ── Exercise list ─────────────────────────────────────────────────────────
  exerciseList: {
    gap: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  exerciseIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2c2c2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIndexText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  exerciseInfo: {
    flex: 1,
    gap: 2,
  },
  exerciseName: {
    color: C.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  exerciseSetsReps: {
    color: C.blue,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Bottom bar ────────────────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.card,
  },
  startBtn: {
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  startBtnText: {
    color: C.text,
    fontSize: 20,
    fontWeight: '700',
  },
});
