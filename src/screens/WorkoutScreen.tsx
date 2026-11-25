import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { RoutineCard } from "../components/RoutineCard";
import { Icon } from "../components/Icon";
import { useStore } from "../store";
import { colors, font, radius, spacing } from "../theme";
import { Routine } from "../types";

type Props = {
  onNewRoutine: () => void;
  onEditRoutine: (routineId: string) => void;
  onOpenActive: () => void;
};

export function WorkoutScreen({ onNewRoutine, onEditRoutine, onOpenActive }: Props) {
  const { routines, active, startEmptyWorkout, startRoutine, deleteRoutine } = useStore();

  const handleStart = (routine: Routine) => {
    startRoutine(routine);
    onOpenActive();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Workout</Text>
          <Icon name="chevronDown" size={16} color={colors.text} />
        </View>
        <Pressable style={styles.headerIcon} accessibilityRole="button" accessibilityLabel="History">
          <Icon name="clock" size={20} color={colors.text} />
        </Pressable>
      </View>

      {active ? (
        <Pressable style={styles.resumeBanner} onPress={onOpenActive} accessibilityRole="button">
          <Icon name="play" size={14} color={colors.onAccent} />
          <Text style={styles.resumeText}>Workout in progress — tap to resume</Text>
        </Pressable>
      ) : null}

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          startEmptyWorkout();
          onOpenActive();
        }}
        accessibilityRole="button"
      >
        <Icon name="plus" size={18} color={colors.onAccent} />
        <Text style={styles.primaryText}>Start Empty Workout</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Routines</Text>
        <Pressable onPress={onNewRoutine} hitSlop={8} accessibilityRole="button" accessibilityLabel="New routine">
          <Icon name="plus" size={20} color={colors.accent} />
        </Pressable>
      </View>

      <View style={styles.rowButtons}>
        <Pressable style={styles.secondaryButton} onPress={onNewRoutine} accessibilityRole="button">
          <Icon name="doc" size={16} color={colors.text} />
          <Text style={styles.secondaryText}>New Routine</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} accessibilityRole="button">
          <Icon name="search" size={16} color={colors.text} />
          <Text style={styles.secondaryText}>Explore</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Routines ({routines.length})</Text>
        <Icon name="chevronDown" size={18} color={colors.textDim} />
      </View>

      {routines.length === 0 ? (
        <View style={styles.emptyCard}>
          <Icon name="dumbbell" size={36} color={colors.textDim} />
          <Text style={styles.emptyText}>No routines yet. Create one to get started.</Text>
        </View>
      ) : (
        routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onStart={() => handleStart(routine)}
            onEdit={() => onEditRoutine(routine.id)}
            onDelete={() => deleteRoutine(routine.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  headerTitleWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTitle: { color: colors.text, fontSize: font.title, fontWeight: "800" },
  headerIcon: { padding: 6 },
  resumeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 10,
    marginBottom: spacing.md
  },
  resumeText: { color: colors.onAccent, fontWeight: "700", fontSize: font.small },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: spacing.lg
  },
  primaryText: { color: colors.onAccent, fontWeight: "800", fontSize: font.body },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  sectionTitle: { color: colors.text, fontSize: font.heading, fontWeight: "700" },
  rowButtons: { flexDirection: "row", gap: 10, marginBottom: spacing.lg },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingVertical: 12
  },
  secondaryText: { color: colors.text, fontWeight: "600", fontSize: font.small },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    gap: 10,
    padding: spacing.xl
  },
  emptyText: { color: colors.textDim, fontSize: font.small, textAlign: "center" }
});
