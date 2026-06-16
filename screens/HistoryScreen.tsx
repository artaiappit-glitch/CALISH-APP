import React, { useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Text from '../src/components/ui/Text';
import FloatingNavBar from '../src/components/ui/FloatingNavBar';
import { colors, radius, spacing, shadow } from '../src/theme/tokens';
import {
  getHistory,
  deleteRecord,
  clearHistory,
  formatDuration,
  formatWhen,
  type WorkoutRecord,
} from '../src/storage/history';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const [records, setRecords] = useState<WorkoutRecord[] | null>(null);

  const load = useCallback(() => {
    getHistory().then(setRecords);
  }, []);

  // Reload every time the screen comes into focus (e.g. after finishing a workout).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const confirmClear = () => {
    Alert.alert('Clear history', 'Remove all saved workouts? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => clearHistory().then(load),
      },
    ]);
  };

  const removeOne = (rec: WorkoutRecord) => {
    Alert.alert(rec.dayName, 'Remove this workout from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteRecord(rec.id).then(load) },
    ]);
  };

  const totalSessions = records?.length ?? 0;
  const totalMin = records ? Math.round(records.reduce((s, r) => s + r.durationSec, 0) / 60) : 0;

  // ── Empty state (loaded, nothing saved) ──────────────────────────────────────
  if (records !== null && records.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <Feather name="clock" size={28} color={colors.inkTertiary} />
        </View>
        <Text variant="title" style={styles.center}>No workouts yet</Text>
        <Text variant="body" color={colors.inkSecondary} style={styles.center}>
          Finish a session and it’ll show up here with the date and how long it took.
        </Text>
        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={() => navigation.navigate('Home')}>
          <Text variant="cardTitle" color={colors.onDark}>Pick a workout</Text>
        </TouchableOpacity>
        <FloatingNavBar active="history" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <FlatList
      style={styles.container}
      data={records ?? []}
      keyExtractor={(r) => r.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        records && records.length > 0 ? (
          <View style={styles.summary}>
            <View style={styles.summaryStat}>
              <Text variant="title">{totalSessions}</Text>
              <Text variant="meta" color={colors.inkTertiary}>workouts</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text variant="title">{totalMin}</Text>
              <Text variant="meta" color={colors.inkTertiary}>total minutes</Text>
            </View>
            <TouchableOpacity style={styles.clearBtn} onPress={confirmClear} hitSlop={8}>
              <Text variant="meta" color={colors.inkSecondary} weight="600">Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onLongPress={() => removeOne(item)}
        >
          <View style={styles.rowIcon}>
            <Feather name="check" size={18} color={colors.ink} />
          </View>
          <View style={styles.rowInner}>
            <Text variant="cardTitle">{item.dayName}</Text>
            <Text variant="meta" color={colors.inkSecondary}>{formatWhen(item.completedAt)}</Text>
          </View>
          <View style={styles.rowMeta}>
            <Text variant="cardTitle">{formatDuration(item.durationSec)}</Text>
            <Text variant="meta" color={colors.inkTertiary}>{item.sets} sets</Text>
          </View>
        </TouchableOpacity>
      )}
    />
      <FloatingNavBar active="history" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 112, gap: spacing.md },
  center: { textAlign: 'center' },

  // ── Summary ──────────────────────────────────────────────────────────────
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  summaryStat: { alignItems: 'center', gap: 2, paddingHorizontal: spacing.lg },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.hairline },
  clearBtn: { marginLeft: 'auto', paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },

  // ── Row ──────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInner: { flex: 1, gap: 2 },
  rowMeta: { alignItems: 'flex-end', gap: 2 },

  // ── Empty state ──────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  cta: {
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadow.floating,
  },
});
