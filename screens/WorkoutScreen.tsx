import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import workouts from '../data/workouts';
import type { RootStackParamList } from '../types/navigation';
import RestTimer from '../components/RestTimer';

type Props = NativeStackScreenProps<RootStackParamList, 'Workout'>;
type Phase = 'exercise' | 'rest' | 'done';

export default function WorkoutScreen({ route, navigation }: Props) {
  const day = workouts[route.params.dayIndex];

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${day.name} · ${day.focus}` });
  }, [navigation, day]);

  // All state at the top — hooks must never come after conditional returns.
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('exercise');

  const totalExercises = day.exercises.length;
  const exercise = day.exercises[exerciseIndex] ?? null;

  const advanceAfterRest = useCallback(() => {
    if (!exercise) return;
    const isLastSet = setIndex + 1 >= exercise.sets;
    const isLastExercise = exerciseIndex + 1 >= totalExercises;

    if (isLastSet && isLastExercise) {
      setPhase('done');
    } else if (isLastSet) {
      setExerciseIndex((i) => i + 1);
      setSetIndex(0);
      setPhase('exercise');
    } else {
      setSetIndex((s) => s + 1);
      setPhase('exercise');
    }
  }, [setIndex, exerciseIndex, totalExercises, exercise]);

  const handleDoneSet = useCallback(() => {
    if (!exercise) return;
    if (exercise.restSeconds > 0) {
      setPhase('rest');
    } else {
      advanceAfterRest();
    }
  }, [exercise, advanceAfterRest]);

  // ── REST DAY ─────────────────────────────────────────────────────────────────
  if (day.restDay) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredCard}>
          <Text style={styles.bigEmoji}>🌿</Text>
          <Text style={styles.cardTitle}>{day.focus}</Text>
          {day.note ? <Text style={styles.cardNote}>{day.note}</Text> : null}
        </View>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>Back to schedule</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── WORKOUT COMPLETE ─────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredCard}>
          <Text style={styles.bigEmoji}>💪</Text>
          <Text style={styles.cardTitle}>Workout complete</Text>
          <Text style={styles.cardNote}>{day.name} — {day.focus}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.primaryBtnText}>Back to schedule</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!exercise) return null;

  const currentSet = setIndex + 1;

  // ── REST TIMER ───────────────────────────────────────────────────────────────
  if (phase === 'rest') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.restContext}>
          <Text style={styles.restContextName}>{exercise.name}</Text>
          <Text style={styles.restContextSub}>Set {currentSet} of {exercise.sets} done</Text>
        </View>
        <RestTimer
          seconds={exercise.restSeconds}
          onDone={advanceAfterRest}
          onSkip={advanceAfterRest}
        />
      </SafeAreaView>
    );
  }

  // ── EXERCISE VIEW ────────────────────────────────────────────────────────────
  // Progress as fraction of total set-slots completed.
  const slotsTotal = day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const slotsDone = day.exercises
    .slice(0, exerciseIndex)
    .reduce((acc, ex) => acc + ex.sets, 0) + setIndex;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* Progress indicator */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Exercise {exerciseIndex + 1} of {totalExercises}
            {'  ·  '}
            Set {currentSet} of {exercise.sets}
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round((slotsDone / slotsTotal) * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Exercise image / placeholder */}
        <View style={styles.imageBox}>
          {exercise.image ? (
            <Image
              source={{ uri: exercise.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>🏋️</Text>
            </View>
          )}
        </View>

        {/* Exercise info */}
        <View style={styles.infoCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.setsReps}>
            {exercise.sets} × {exercise.reps}
          </Text>
          {exercise.note ? (
            <View style={styles.noteDivider}>
              <Text style={styles.noteText}>{exercise.note}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Big "Done set" button — fixed at bottom */}
      <View style={styles.bottomBar}>
        <View style={styles.dotsRow}>
          {day.exercises.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < exerciseIndex && styles.dotDone,
                i === exerciseIndex && styles.dotCurrent,
              ]}
            />
          ))}
        </View>
        <View style={styles.bottomProgressTrack}>
          <View
            style={[
              styles.bottomProgressFill,
              { width: `${Math.round((slotsDone / slotsTotal) * 100)}%` },
            ]}
          />
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleDoneSet}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Done set</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  green: '#30d158',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // ── Shared ───────────────────────────────────────────────────────────────
  centeredCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  bigEmoji: { fontSize: 72 },
  cardTitle: { color: C.text, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  cardNote: { color: C.sub, fontSize: 16, textAlign: 'center', lineHeight: 24 },

  primaryBtn: {
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  primaryBtnText: { color: C.text, fontSize: 20, fontWeight: '700' },
  secondaryBtn: {
    margin: 20,
    marginBottom: 40,
    backgroundColor: C.card,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  secondaryBtnText: { color: C.sub, fontSize: 18, fontWeight: '600' },

  // ── Rest context (shown behind timer) ───────────────────────────────────
  restContext: {
    paddingTop: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 6,
  },
  restContextName: { color: C.text, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  restContextSub: { color: C.muted, fontSize: 14 },

  // ── Exercise scroll ──────────────────────────────────────────────────────
  scroll: { padding: 20, paddingBottom: 120, gap: 20 },

  progressRow: { gap: 8 },
  progressText: { color: C.sub, fontSize: 14, textAlign: 'center' },
  progressTrack: { height: 4, backgroundColor: C.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: C.blue, borderRadius: 2 },

  imageBox: { borderRadius: 16, overflow: 'hidden', height: 200 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
  },
  placeholderIcon: { fontSize: 60 },

  infoCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  exerciseName: { color: C.text, fontSize: 22, fontWeight: '700', lineHeight: 28 },
  setsReps: { color: C.blue, fontSize: 30, fontWeight: '700' },
  noteDivider: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
  noteText: { color: C.sub, fontSize: 15, lineHeight: 22 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 36,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.card,
    gap: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: 'transparent',
  },
  dotDone: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  dotCurrent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.text,
    borderColor: C.text,
  },
  bottomProgressTrack: {
    height: 6,
    backgroundColor: C.border,
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bottomProgressFill: {
    height: 6,
    backgroundColor: C.green,
    borderRadius: 3,
  },
});
