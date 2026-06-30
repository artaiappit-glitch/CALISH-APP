import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import workouts from '../data/workouts';
import type { RootStackParamList } from '../types/navigation';
import RestTimer from '../components/RestTimer';
import Text from '../src/components/ui/Text';
import { colors, radius, spacing, shadow } from '../src/theme/tokens';
import { addRecord } from '../src/storage/history';
import { loadSession, saveSession, clearSession } from '../src/storage/session';
import { exerciseImage } from '../src/data/exerciseImages';

type Props = NativeStackScreenProps<RootStackParamList, 'Workout'>;
type Phase = 'exercise' | 'rest' | 'done';

export default function WorkoutScreen({ route, navigation }: Props) {
  const day = workouts[route.params.dayIndex];
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${day.name} · ${day.focus}` });
  }, [navigation, day]);

  // All state at the top — hooks must never come after conditional returns.
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('exercise');
  // Absolute time the current rest ends — persisted so the countdown survives
  // a reload instead of restarting from full.
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null);

  // Workout starts when the screen mounts; guard so we record exactly once.
  const startedAtRef = useRef(Date.now());
  const savedRef = useRef(false);
  // Wait until we've checked storage before persisting, so we don't clobber a
  // saved session with the initial defaults.
  const [hydrated, setHydrated] = useState(false);

  const totalExercises = day.exercises.length;
  const exercise = day.exercises[exerciseIndex] ?? null;

  // On mount: resume an in-progress session for this day if one was saved
  // (survives backgrounding / app reload), otherwise begin a fresh one.
  useEffect(() => {
    if (day.restDay) {
      setHydrated(true);
      return;
    }
    let active = true;
    loadSession().then((s) => {
      if (!active) return;
      if (s && s.dayIndex === route.params.dayIndex) {
        const exIdx = Math.min(s.exerciseIndex, day.exercises.length - 1);
        setExerciseIndex(exIdx);
        setSetIndex(s.setIndex);
        setPhase(s.phase);
        startedAtRef.current = s.startedAt;
        if (s.phase === 'rest') {
          // Resume the exact remaining rest (or fall back to a fresh one).
          setRestEndsAt(s.restEndsAt ?? Date.now() + day.exercises[exIdx].restSeconds * 1000);
        }
      } else {
        startedAtRef.current = Date.now();
      }
      setHydrated(true);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress whenever it changes; clear it once the workout is done.
  useEffect(() => {
    if (!hydrated || day.restDay) return;
    if (phase === 'done') {
      clearSession();
      return;
    }
    saveSession({
      dayIndex: route.params.dayIndex,
      exerciseIndex,
      setIndex,
      phase,
      startedAt: startedAtRef.current,
      restEndsAt: phase === 'rest' && restEndsAt != null ? restEndsAt : undefined,
    });
  }, [hydrated, phase, exerciseIndex, setIndex, restEndsAt, day.restDay, route.params.dayIndex]);

  // Persist a history record the moment the workout is completed.
  useEffect(() => {
    if (phase !== 'done' || day.restDay || savedRef.current) return;
    savedRef.current = true;
    const completedAt = Date.now();
    addRecord({
      dayName: day.name,
      focus: day.focus,
      completedAt,
      durationSec: Math.round((completedAt - startedAtRef.current) / 1000),
      exercises: day.exercises.length,
      sets: day.exercises.reduce((acc, ex) => acc + ex.sets, 0),
    });
  }, [phase, day]);

  const advanceAfterRest = useCallback(() => {
    if (!exercise) return;
    setRestEndsAt(null);
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
      setRestEndsAt(Date.now() + exercise.restSeconds * 1000);
      setPhase('rest');
    } else {
      advanceAfterRest();
    }
  }, [exercise, advanceAfterRest]);

  // ── REST DAY ─────────────────────────────────────────────────────────────────
  if (day.restDay) {
    return (
      <View style={styles.container}>
        <View style={styles.centeredCard}>
          <Text style={styles.bigEmoji}>🌿</Text>
          <Text variant="display" style={styles.centerText}>{day.focus}</Text>
          {day.note ? (
            <Text variant="body" color={colors.inkSecondary} style={styles.centerText}>{day.note}</Text>
          ) : null}
        </View>
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Text variant="cardTitle" color={colors.ink}>Back to schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Blank while we read any saved session, to avoid flashing set 1 first.
  if (!hydrated) return <View style={styles.container} />;

  // ── WORKOUT COMPLETE ─────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <View style={styles.container}>
        <View style={styles.centeredCard}>
          <Text style={styles.bigEmoji}>💪</Text>
          <Text variant="display" style={styles.centerText}>Workout complete</Text>
          <Text variant="body" color={colors.inkSecondary} style={styles.centerText}>
            {day.name} — {day.focus}
          </Text>
        </View>
        <View style={[styles.bottomBar, styles.bottomBarStack, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}>
            <Text variant="cardTitle" color={colors.onDark}>Back to schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={() => navigation.navigate('MainTabs', { screen: 'History' })}>
            <Text variant="cardTitle" color={colors.ink}>View history</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!exercise) return null;

  const currentSet = setIndex + 1;

  // ── REST TIMER ───────────────────────────────────────────────────────────────
  if (phase === 'rest') {
    return (
      <View style={styles.container}>
        <View style={styles.restContext}>
          <Text variant="cardTitle" style={styles.centerText}>{exercise.name}</Text>
          <Text variant="meta" color={colors.inkTertiary}>Set {currentSet} of {exercise.sets} done</Text>
        </View>
        <RestTimer
          endsAt={restEndsAt ?? Date.now() + exercise.restSeconds * 1000}
          onDone={advanceAfterRest}
          onSkip={advanceAfterRest}
          onExtend={(ms) => setRestEndsAt((e) => (e ?? Date.now()) + ms)}
        />
      </View>
    );
  }

  // ── EXERCISE VIEW ────────────────────────────────────────────────────────────
  // Progress as fraction of total set-slots completed.
  const slotsTotal = day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const slotsDone = day.exercises
    .slice(0, exerciseIndex)
    .reduce((acc, ex) => acc + ex.sets, 0) + setIndex;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Progress indicator */}
        <View style={styles.progressRow}>
          <Text variant="meta" color={colors.inkSecondary} style={styles.centerText}>
            Exercise {exerciseIndex + 1} of {totalExercises}
            {'   ·   '}
            Set {currentSet} of {exercise.sets}
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${Math.round((slotsDone / slotsTotal) * 100)}%` }]}
            />
          </View>
        </View>

        {/* Exercise image / placeholder */}
        <View style={styles.imageBox}>
          {exerciseImage(exercise.image) ? (
            <Image source={exerciseImage(exercise.image)} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={32} color={colors.inkTertiary} />
            </View>
          )}
        </View>

        {/* Exercise info */}
        <View style={styles.infoCard}>
          <Text variant="title">{exercise.name}</Text>
          <Text variant="display" style={styles.setsReps}>{exercise.sets} × {exercise.reps}</Text>
          {exercise.note ? (
            <View style={styles.noteDivider}>
              <Text variant="body" color={colors.inkSecondary}>{exercise.note}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom bar: dots → progress → action */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
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
            style={[styles.bottomProgressFill, { width: `${Math.round((slotsDone / slotsTotal) * 100)}%` }]}
          />
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleDoneSet} activeOpacity={0.85}>
          <Text variant="cardTitle" color={colors.onDark}>Done set</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // ── Shared ───────────────────────────────────────────────────────────────
  centeredCard: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl, gap: spacing.lg },
  bigEmoji: { fontSize: 64 },
  centerText: { textAlign: 'center' },

  primaryBtn: {
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.floating,
  },
  secondaryBtn: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },

  // ── Rest context (shown above timer) ───────────────────────────────────────
  restContext: { paddingTop: spacing.xxxl, paddingHorizontal: spacing.xxl, alignItems: 'center', gap: spacing.xs },

  // ── Exercise scroll ──────────────────────────────────────────────────────
  scroll: { padding: spacing.xl, paddingBottom: 180, gap: spacing.xl },

  progressRow: { gap: spacing.sm },
  progressTrack: { height: 4, backgroundColor: colors.surfaceMuted, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },

  // Square to match the source art (1:1), so the full figure shows uncropped.
  imageBox: { borderRadius: radius.lg, overflow: 'hidden', aspectRatio: 1, backgroundColor: colors.surfaceMuted },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },

  infoCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  setsReps: { marginTop: spacing.xs },
  noteDivider: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingTop: spacing.md, marginTop: spacing.xs },

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
    gap: spacing.md,
  },
  bottomBarStack: { gap: spacing.sm },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.inkTertiary,
    backgroundColor: 'transparent',
  },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotCurrent: { width: 10, height: 10, borderRadius: radius.pill, backgroundColor: colors.ink, borderColor: colors.ink },

  bottomProgressTrack: { height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, overflow: 'hidden' },
  bottomProgressFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
});
