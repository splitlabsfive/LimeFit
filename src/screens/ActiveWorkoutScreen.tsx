import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { ExercisePicker } from "../components/ExercisePicker";
import { Icon } from "../components/Icon";
import { exerciseById } from "../data/exercises";
import { useStore } from "../store";
import {
  doneSets,
  formatClock,
  formatDuration,
  sessionDurationMs,
  sessionVolume
} from "../stats";
import { colors, font, radius, spacing } from "../theme";
import { Exercise } from "../types";

const REST_SECONDS = 90;

type Props = {
  onClose: () => void;
};

const parseNum = (text: string): number => {
  const n = parseFloat(text.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export function ActiveWorkoutScreen({ onClose }: Props) {
  const {
    active,
    addExerciseToActive,
    removeExerciseFromActive,
    addSet,
    updateSet,
    toggleSet,
    finishActive,
    discardActive
  } = useStore();

  const [now, setNow] = useState(Date.now());
  const [restUntil, setRestUntil] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!active) return null;

  const elapsed = formatClock(sessionDurationMs(active, now));
  const completed = doneSets(active).length;
  const canFinish = completed > 0;
  const restRemaining =
    restUntil !== null ? Math.max(0, Math.ceil((restUntil - now) / 1000)) : 0;

  const handleToggleSet = (weId: string, setId: string, done: boolean) => {
    toggleSet(weId, setId);
    if (!done) {
      setRestUntil(Date.now() + REST_SECONDS * 1000);
    } else {
      setRestUntil(null);
    }
  };

  const handleFinish = () => {
    finishActive();
    setShowSummary(true);
  };

  const handleDiscard = () => {
    discardActive();
    onClose();
  };

  const handlePick = (exercise: Exercise) => {
    addExerciseToActive(exercise.id);
    setPickerOpen(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={handleDiscard} hitSlop={8} accessibilityRole="button" accessibilityLabel="Discard workout">
          <Icon name="x" size={20} color={colors.textDim} />
        </Pressable>
        <View style={styles.topCenter}>
          <Text style={styles.topTitle} numberOfLines={1}>{active.title}</Text>
          <Text style={styles.timer}>{elapsed}</Text>
        </View>
        <Pressable
          onPress={handleFinish}
          disabled={!canFinish}
          style={[styles.finishButton, !canFinish && styles.finishButtonDisabled]}
          accessibilityRole="button"
        >
          <Text style={[styles.finishText, !canFinish && styles.finishTextDisabled]}>Finish</Text>
        </Pressable>
      </View>

      {restUntil !== null && restRemaining > 0 ? (
        <Pressable style={styles.restBanner} onPress={() => setRestUntil(null)} accessibilityRole="button">
          <Icon name="clock" size={14} color={colors.onAccent} />
          <Text style={styles.restText}>Rest {formatClock(restRemaining * 1000)} — tap to skip</Text>
        </Pressable>
      ) : null}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {active.exercises.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="dumbbell" size={48} color={colors.textDim} />
              <Text style={styles.emptyText}>No exercises yet. Add one below.</Text>
            </View>
          ) : (
            active.exercises.map((we) => {
              const meta = exerciseById(we.exerciseId);
              return (
                <View key={we.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exerciseName}>{meta?.name ?? "Exercise"}</Text>
                      <Text style={styles.exerciseMeta}>{meta?.equipment}</Text>
                    </View>
                    <Pressable
                      onPress={() => removeExerciseFromActive(we.id)}
                      style={styles.remove}
                      accessibilityRole="button"
                      accessibilityLabel="Remove exercise"
                    >
                      <Icon name="trash" size={16} color={colors.danger} />
                    </Pressable>
                  </View>

                  <View style={styles.setHeaderRow}>
                    <Text style={[styles.setHeaderCell, styles.setIndex]}>Set</Text>
                    <Text style={[styles.setHeaderCell, styles.setInputCell]}>kg</Text>
                    <Text style={styles.setHeaderX}>x</Text>
                    <Text style={[styles.setHeaderCell, styles.setInputCell]}>Reps</Text>
                    <View style={styles.setCheckSpacer} />
                  </View>

                  {we.sets.map((set, i) => (
                    <View key={set.id} style={[styles.setRow, set.done && styles.setRowDone]}>
                      <Text style={styles.setRowIndex}>{i + 1}</Text>
                      <TextInput
                        style={styles.setInput}
                        value={String(set.kg)}
                        onChangeText={(t) => updateSet(we.id, set.id, { kg: parseNum(t) })}
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.setX}>x</Text>
                      <TextInput
                        style={styles.setInput}
                        value={String(set.reps)}
                        onChangeText={(t) => updateSet(we.id, set.id, { reps: parseNum(t) })}
                        keyboardType="decimal-pad"
                      />
                      <Pressable
                        style={[styles.check, set.done && styles.checkDone]}
                        onPress={() => handleToggleSet(we.id, set.id, set.done)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: set.done }}
                      >
                        {set.done ? <Icon name="check" size={14} color={colors.onAccent} /> : null}
                      </Pressable>
                    </View>
                  ))}

                  <Pressable
                    style={styles.addSet}
                    onPress={() => addSet(we.id)}
                    accessibilityRole="button"
                  >
                    <Icon name="plus" size={14} color={colors.accent} />
                    <Text style={styles.addSetText}>Add Set</Text>
                  </Pressable>
                </View>
              );
            })
          )}

          <Pressable
            style={styles.addButton}
            onPress={() => setPickerOpen(true)}
            accessibilityRole="button"
          >
            <Icon name="plus" size={18} color={colors.onAccent} />
            <Text style={styles.addButtonText}>Add exercise</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <ExercisePicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePick}
      />

      <Modal visible={showSummary} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.summaryCard}>
            <Icon name="check" size={28} color={colors.onAccent} />
            <Text style={styles.summaryTitle}>Workout complete</Text>
            <Text style={styles.summaryStats}>
              {active.title} · {formatDuration(sessionDurationMs(active))}
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{completed}</Text>
                <Text style={styles.summaryLabel}>Sets</Text>
              </View>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{Math.round(sessionVolume(active))}</Text>
                <Text style={styles.summaryLabel}>kg volume</Text>
              </View>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{active.exercises.length}</Text>
                <Text style={styles.summaryLabel}>Exercises</Text>
              </View>
            </View>
            <Pressable
              style={styles.doneButton}
              onPress={() => {
                setShowSummary(false);
                onClose();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  topCenter: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
  topTitle: { color: colors.text, fontSize: font.body, fontWeight: "700" },
  timer: { color: colors.accent, fontSize: font.tiny, fontWeight: "700", marginTop: 2 },
  finishButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8
  },
  finishButtonDisabled: { backgroundColor: colors.surface2 },
  finishText: { color: colors.onAccent, fontWeight: "800", fontSize: font.small },
  finishTextDisabled: { color: colors.textDim },
  restBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface2,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    paddingVertical: 8
  },
  restText: { color: colors.text, fontSize: font.small, fontWeight: "600" },
  body: { flex: 1 },
  bodyContent: { padding: spacing.md, paddingBottom: 48 },
  emptyState: { alignItems: "center", gap: 12, paddingVertical: 40 },
  emptyText: { color: colors.textDim, fontSize: font.body },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: 12
  },
  exerciseHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  exerciseName: { color: colors.text, fontSize: font.body, fontWeight: "700" },
  exerciseMeta: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
  remove: { padding: 6 },
  setHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  setHeaderCell: { color: colors.textDim, fontSize: font.tiny, fontWeight: "700", textTransform: "uppercase" },
  setIndex: { width: 34 },
  setInputCell: { flex: 1, textAlign: "center" },
  setHeaderX: { width: 20, textAlign: "center", color: colors.textDim, fontSize: font.tiny },
  setCheckSpacer: { width: 40 },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6
  },
  setRowDone: { backgroundColor: "rgba(200,255,61,0.12)" },
  setRowIndex: { width: 34, color: colors.textDim, fontSize: font.body, fontWeight: "600" },
  setInput: {
    flex: 1,
    color: colors.text,
    fontSize: font.body,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 6,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    marginHorizontal: 4
  },
  setX: { width: 20, textAlign: "center", color: colors.textDim, fontSize: font.small },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  checkDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  addSet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8
  },
  addSetText: { color: colors.accent, fontWeight: "700", fontSize: font.small },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14
  },
  addButtonText: { color: colors.onAccent, fontWeight: "800", fontSize: font.body },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    width: "100%",
    maxWidth: 340
  },
  summaryTitle: { color: colors.text, fontSize: font.heading, fontWeight: "800", marginTop: 10 },
  summaryStats: { color: colors.textDim, fontSize: font.small, marginTop: 4 },
  summaryRow: { flexDirection: "row", gap: 10, marginVertical: spacing.lg, width: "100%" },
  summaryCell: { flex: 1, alignItems: "center" },
  summaryValue: { color: colors.accent, fontSize: 24, fontWeight: "800" },
  summaryLabel: { color: colors.textDim, fontSize: font.tiny, marginTop: 2 },
  doneButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center"
  },
  doneButtonText: { color: colors.onAccent, fontWeight: "800", fontSize: font.body }
});
