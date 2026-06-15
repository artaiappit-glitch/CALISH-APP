import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

// A simple 440 Hz beep encoded as a tiny WAV file (base64 data URI).
// This avoids needing a bundled asset file while still working in Expo Go.
// The wav is: 44-byte header + 4410 samples of a 440 Hz sine at 44100 Hz (0.1 s).
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
      player.play();
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
      <Text style={styles.label}>Rest</Text>
      <Text style={styles.countdown}>{mm}:{ss}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.addBtn} onPress={addTime}>
          <Text style={styles.addBtnText}>+15 s</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipBtnText}>Skip rest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  label: {
    color: '#a0a0a8',
    fontSize: 18,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  countdown: {
    color: '#ffffff',
    fontSize: 96,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  addBtn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: '#2c2c2e',
    minWidth: 100,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipBtn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#3a3a3c',
    minWidth: 100,
    alignItems: 'center',
  },
  skipBtnText: {
    color: '#a0a0a8',
    fontSize: 18,
    fontWeight: '600',
  },
});
