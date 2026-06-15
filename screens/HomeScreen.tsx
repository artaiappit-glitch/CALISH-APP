import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import workouts from '../data/workouts';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Static map so Metro can resolve require() at build time.
// Drop your real PNGs into assets/icons/ and they'll show up automatically.
const ICON_MAP: Record<string, number> = {
  pull:   require('../assets/icons/pull.png'),
  push:   require('../assets/icons/push.png'),
  core:   require('../assets/icons/core.png'),
  pull2:  require('../assets/icons/pull2.png'),
  push2:  require('../assets/icons/push2.png'),
  warmup: require('../assets/icons/warmup.png'),
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const iconSource = item.icon ? ICON_MAP[item.icon] : undefined;
          return (
            <TouchableOpacity
              style={[styles.card, item.restDay && styles.cardRest]}
              onPress={() => navigation.navigate('Preview', { dayIndex: index })}
              activeOpacity={0.7}
            >
              {/* Day icon */}
              {iconSource ? (
                <Image source={iconSource} style={styles.icon} />
              ) : (
                <View style={styles.iconPlaceholder} />
              )}

              <View style={styles.cardInner}>
                <Text style={styles.dayName}>{item.name}</Text>
                <Text style={styles.focus}>{item.focus}</Text>
                {item.restDay ? (
                  <Text style={styles.restBadge}>Rest day</Text>
                ) : (
                  <Text style={styles.exerciseCount}>
                    {item.exercises.length} exercises
                  </Text>
                )}
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
    gap: 14,
  },
  cardRest: {
    opacity: 0.65,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2c2c2e',
  },
  cardInner: {
    flex: 1,
    gap: 3,
  },
  dayName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  focus: {
    color: '#a0a0a8',
    fontSize: 14,
  },
  exerciseCount: {
    color: '#636366',
    fontSize: 13,
    marginTop: 1,
  },
  restBadge: {
    color: '#636366',
    fontSize: 13,
    marginTop: 1,
    fontStyle: 'italic',
  },
  chevron: {
    color: '#636366',
    fontSize: 28,
    lineHeight: 32,
  },
});
