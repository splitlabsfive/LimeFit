import { useMemo, useState } from "react";
import {
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
import { colors, font, radius, spacing } from "../theme";
import { Exercise, PlannedSet, Routine, newId } from "../types";

type Props = {
  routineId?: string;
  onClose: () => void;
};

type DraftExercise = {
  id: string;
  exerciseId: string;
  sets: PlannedSet[];
};

export function RoutineEditorScreen({ routineId, onClose }: Props) {
  const { routines, saveRoutine } = useStore();
  const existing = useMemo(
    () => routines.find((r) => r.id === routineId),
    [routines, routineId]
  );

  const [title, setTitle] = useState(existing?.title ?? "");
  const [exercises, setExercises] = useState<DraftExercise[]>(
    () =>
      existing?.exerciseIds.map((re) => ({
        id: re.id,
        exerciseId: re.exerciseId,
        sets: re.sets.map((s) => ({ ...s }))
      })) ?? []
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSave = title.trim().length > 0;

  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        id: newId(),
        exerciseId: exercise.id,
        sets: [
          { kg: 0, reps: 10 },
          { kg: 0, reps: 10 },
          { kg: 0, reps: 10 }
        ]
      }
    ]);
    setPickerOpen(false);
  };

  const removeExercise = (id: string) =>
    setExercises((prev) => prev.filter((e) => e.id !== id));

  const changeSetCount = (id: string, delta: number) =>
    setExercises((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next = [...e.sets];
        if (delta > 0) {
          const last = next[next.length - 1] ?? { kg: 0, reps: 10 };
          next.push({ ...last });
        } else if (next.length > 1) {
          next.pop();
        }
        return { ...e, sets: next };
      })
    );

  const save = () => {
    if (!canSave) return;
    const routine: Routine = {
      id: existing?.id ?? newId(),
      title: title.trim(),
      createdAt: existing?.createdAt ?? Date.now(),
      exerciseIds: exercises
    };
    saveRoutine(routine);
    onClose();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button">
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.topTitle}>{existing ? "Edit Routine" : "New Routine"}</Text>
        <Pressable
          onPress={save}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          accessibilityRole="button"
        >
          <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.fieldLabel}>Routine title</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="e.g. Push Day"
          placeholderTextColor={colors.textDim}
          value={title}
          onChangeText={setTitle}
        />

        {exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="dumbbell" size={56} color={colors.textDim} />
            <Text style={styles.emptyText}>
              Add your first exercise to build this routine.
            </Text>
          </View>
        ) : (
          exercises.map((ex) => {
            const meta = exerciseById(ex.exerciseId);
            return (
              <View key={ex.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{meta?.name ?? "Exercise"}</Text>
                    <Text style={styles.exerciseMeta}>{meta?.equipment}</Text>
                  </View>
                  <Pressable
                    onPress={() => removeExercise(ex.id)}
                    style={styles.remove}
                    accessibilityRole="button"
                    accessibilityLabel="Remove exercise"
                  >
                    <Icon name="trash" size={16} color={colors.danger} />
                  </Pressable>
                </View>
                <View style={styles.setStepper}>
                  <Text style={styles.setCount}>{ex.sets.length} sets</Text>
                  <Pressable
                    style={styles.stepButton}
                    onPress={() => changeSetCount(ex.id, -1)}
                    accessibilityRole="button"
                    accessibilityLabel="Remove set"
                  >
                    <Icon name="minus" size={14} color={colors.text} />
                  </Pressable>
                  <Pressable
                    style={styles.stepButton}
                    onPress={() => changeSetCount(ex.id, 1)}
                    accessibilityRole="button"
                    accessibilityLabel="Add set"
                  >
                    <Icon name="plus" size={14} color={colors.text} />
                  </Pressable>
                </View>
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

      <ExercisePicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={addExercise}
      />
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
  cancel: { color: colors.accent, fontSize: font.body, fontWeight: "600" },
  topTitle: { color: colors.text, fontSize: font.body, fontWeight: "700" },
  saveButton: {
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 7
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveText: { color: colors.text, fontWeight: "700", fontSize: font.small },
  saveTextDisabled: { color: colors.textDim },
  body: { flex: 1 },
  bodyContent: { padding: spacing.md, paddingBottom: 48 },
  fieldLabel: { color: colors.textDim, fontSize: font.small, marginBottom: 6 },
  titleInput: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: "700",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.accent,
    paddingVertical: 8,
    marginBottom: spacing.lg
  },
  emptyState: { alignItems: "center", gap: 12, paddingVertical: 48 },
  emptyText: { color: colors.textDim, fontSize: font.body, textAlign: "center", maxWidth: 260 },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: 10
  },
  exerciseHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  exerciseName: { color: colors.text, fontSize: font.body, fontWeight: "700" },
  exerciseMeta: { color: colors.textDim, fontSize: font.small, marginTop: 2 },
  remove: { padding: 6 },
  setStepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10
  },
  setCount: { color: colors.textDim, fontSize: font.small, marginRight: 4 },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center"
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginTop: spacing.sm
  },
  addButtonText: { color: colors.onAccent, fontWeight: "800", fontSize: font.body }
});
