import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from "../components/Icon";
import { exerciseById } from "../data/exercises";
import { useStore } from "../store";
import {
  currentStreak,
  formatDate,
  formatDuration,
  sessionDurationMs,
  sessionSetCount,
  sessionVolume,
  totalVolume
} from "../stats";
import { colors, font, radius, spacing } from "../theme";

export function ProfileScreen() {
  const { sessions } = useStore();
  const finished = sessions
    .filter((s) => s.finishedAt !== null)
    .sort((a, b) => (b.finishedAt as number) - (a.finishedAt as number));
  const totalSets = finished.reduce((acc, s) => acc + sessionSetCount(s), 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="user" size={30} color={colors.onAccent} />
        </View>
        <Text style={styles.name}>Athlete</Text>
        <Text style={styles.meta}>Units: kg</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{finished.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{(totalVolume(sessions) / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>Volume kg</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{currentStreak(sessions)}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>History</Text>
      {finished.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.emptyText}>Finish a workout to see it here.</Text>
        </View>
      ) : (
        finished.map((s) => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.cardDate}>{formatDate(s.finishedAt as number)}</Text>
            </View>
            <Text style={styles.cardMeta}>
              {formatDuration(sessionDurationMs(s))} · {sessionSetCount(s)} sets ·{" "}
              {Math.round(sessionVolume(s))} kg
            </Text>
            <Text style={styles.cardExercises} numberOfLines={2}>
              {s.exercises.map((e) => exerciseById(e.exerciseId)?.name ?? "Exercise").join(", ")}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 32 },
  header: { alignItems: "center", marginBottom: spacing.lg, marginTop: spacing.sm },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  name: { color: colors.text, fontSize: font.heading, fontWeight: "800" },
  meta: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
  statsGrid: { flexDirection: "row", gap: 8, marginBottom: spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 12,
    alignItems: "center"
  },
  statValue: { color: colors.accent, fontSize: 22, fontWeight: "800" },
  statLabel: { color: colors.textDim, fontSize: font.tiny, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: font.heading, fontWeight: "700", marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: 10
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: colors.text, fontSize: font.body, fontWeight: "700" },
  cardDate: { color: colors.textDim, fontSize: font.small },
  cardMeta: { color: colors.textDim, fontSize: font.small, marginTop: 4 },
  cardExercises: { color: colors.textDim, fontSize: font.small, marginTop: 6 },
  emptyText: { color: colors.textDim, fontSize: font.small }
});
