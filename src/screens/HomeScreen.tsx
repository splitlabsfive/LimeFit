import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
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
  totalVolume,
  weekStats
} from "../stats";
import { colors, font, radius, spacing } from "../theme";

type Props = {
  onGoWorkout: () => void;
  onOpenActive: () => void;
};

export function HomeScreen({ onGoWorkout, onOpenActive }: Props) {
  const { sessions, routines, active } = useStore();
  const week = weekStats(sessions);
  const streak = currentStreak(sessions);
  const last = sessions.find((s) => s.finishedAt !== null) ?? null;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>Ready to get stronger today?</Text>

      {active ? (
        <Pressable style={styles.activeCard} onPress={onOpenActive} accessibilityRole="button">
          <View style={styles.activeCardRow}>
            <Icon name="play" size={16} color={colors.onAccent} />
            <Text style={styles.activeCardTitle}>{active.title} in progress</Text>
          </View>
          <Text style={styles.activeCardHint}>Tap to continue logging sets</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.activeCard} onPress={onGoWorkout} accessibilityRole="button">
          <View style={styles.activeCardRow}>
            <Icon name="dumbbell" size={16} color={colors.onAccent} />
            <Text style={styles.activeCardTitle}>Start a workout</Text>
          </View>
          <Text style={styles.activeCardHint}>
            {routines.length > 0 ? `${routines.length} routines ready` : "Create a routine first"}
          </Text>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>This week</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{week.workouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{(week.volume / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>Volume (kg)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{week.sets}</Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Last workout</Text>
      {last ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{last.title}</Text>
            <Text style={styles.cardMeta}>{formatDate(last.finishedAt as number)}</Text>
          </View>
          <Text style={styles.cardMeta}>
            {formatDuration(sessionDurationMs(last))} · {sessionSetCount(last)} sets ·{" "}
            {Math.round(sessionVolume(last))} kg volume
          </Text>
          <Text style={styles.cardExercises} numberOfLines={2}>
            {last.exercises
              .map((e) => exerciseById(e.exerciseId)?.name ?? "Exercise")
              .join(", ")}
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardMeta}>No workouts logged yet.</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Lifetime</Text>
          <Icon name="chart" size={18} color={colors.accent} />
        </View>
        <Text style={styles.cardMeta}>
          {sessions.filter((s) => s.finishedAt !== null).length} workouts ·{" "}
          {Math.round(totalVolume(sessions))} kg total volume
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 32 },
  greeting: { color: colors.text, fontSize: font.title, fontWeight: "800" },
  subtitle: { color: colors.textDim, fontSize: font.body, marginTop: 4, marginBottom: spacing.lg },
  activeCard: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg
  },
  activeCardRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  activeCardTitle: { color: colors.onAccent, fontSize: font.heading, fontWeight: "800" },
  activeCardHint: { color: colors.onAccent, fontSize: font.small, marginTop: 4, opacity: 0.8 },
  sectionTitle: { color: colors.text, fontSize: font.heading, fontWeight: "700", marginBottom: spacing.sm },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 10,
    alignItems: "center"
  },
  statValue: { color: colors.accent, fontSize: 20, fontWeight: "800" },
  statLabel: { color: colors.textDim, fontSize: font.tiny, marginTop: 2, textAlign: "center" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: colors.text, fontSize: font.body, fontWeight: "700" },
  cardMeta: { color: colors.textDim, fontSize: font.small, marginTop: 4 },
  cardExercises: { color: colors.textDim, fontSize: font.small, marginTop: 6 }
});
