import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import Text from '../src/components/ui/Text';
import { colors, radius, spacing, fonts } from '../src/theme/tokens';

// A simple beep encoded as a tiny WAV file. Works in Expo Go without extra setup.
const BEEP_URI = require('../assets/beep.wav');

type Props = {
  seconds: number;         // starting countdown value
  onDone: () => void;      // called when the timer reaches 0
  onSkip: () => void;      // called when user taps "Skip rest"
};

export default function RestTimer({ seconds, onDone, onSkip }: Props) {
  // endTime lets us stay accurate when the screen is backgrounded briefly.
  const endTimeRef = useRef<number>(Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneCalledRef = useRef(false);

  const player = useAudioPlayer(BEEP_URI);

  const tick = useCallback(() => {
    const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
    setRemaining(left);
    if (left === 0 && !doneCalledRef.current) {
      doneCalledRef.current = true;
      try {
        player.seekTo(0);
        player.play();
      } catch {
        // ignore playback errors — advancing matters more than the beep
      }
      clearInterval(intervalRef.current!);
      // Give the sound a moment to play before advancing.
      setTimeout(onDone, 800);
    }
  }, [onDone, player]);

  // Re-sync when the app returns from background.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') tick();
    });
    return () => sub.remove();
  }, [tick]);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 500); // poll twice/sec for smoothness
    return () => clearInterval(intervalRef.current!);
  }, [tick]);

  const addTime = () => {
    endTimeRef.current += 15_000;
    tick(); // refresh display immediately
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text variant="meta" color={colors.inkSecondary} style={styles.label}>REST</Text>
      <Text style={styles.countdown}>{mm}:{ss}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.addBtn} onPress={addTime} activeOpacity={0.7}>
          <Text variant="cardTitle" color={colors.ink}>+15 s</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.7}>
          <Text variant="cardTitle" color={colors.inkSecondary}>Skip rest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  label: { letterSpacing: 2 },
  countdown: {
    color: colors.ink,
    fontSize: 96,
    lineHeight: 104,
    fontFamily: fonts.light,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  buttons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  addBtn: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    minWidth: 110,
    alignItems: 'center',
  },
  skipBtn: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.hairline,
    minWidth: 110,
    alignItems: 'center',
  },
});
