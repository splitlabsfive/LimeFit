import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { EXERCISES, MUSCLE_ORDER } from "../data/exercises";
import { colors, font, radius, spacing } from "../theme";
import { Exercise } from "../types";
import { Icon } from "./Icon";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (exercise: Exercise) => void;
};

export function ExercisePicker({ visible, onClose, onPick }: Props) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? EXERCISES.filter((e) => e.name.toLowerCase().includes(q) || e.equipment.toLowerCase().includes(q))
      : EXERCISES;
    return MUSCLE_ORDER.map((muscle) => ({
      muscle,
      data: filtered.filter((e) => e.muscle === muscle)
    })).filter((g) => g.data.length > 0);
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Add exercise</Text>
            <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
              <Icon name="x" size={18} color={colors.textDim} />
            </Pressable>
          </View>
          <View style={styles.searchWrap}>
            <Icon name="search" size={16} color={colors.textDim} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises"
              placeholderTextColor={colors.textDim}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
          <FlatList
            data={grouped}
            keyExtractor={(g) => g.muscle}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: group }) => (
              <View>
                <Text style={styles.groupLabel}>{group.muscle}</Text>
                {group.data.map((ex) => (
                  <Pressable
                    key={ex.id}
                    style={styles.row}
                    onPress={() => {
                      setQuery("");
                      onPick(ex);
                    }}
                    accessibilityRole="button"
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowName}>{ex.name}</Text>
                      <Text style={styles.rowMeta}>{ex.equipment}</Text>
                    </View>
                    <Icon name="plus" size={16} color={colors.accent} />
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    height: "82%",
    padding: spacing.md
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { color: colors.text, fontSize: font.heading, fontWeight: "700" },
  close: { padding: 6 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  searchInput: { flex: 1, color: colors.text, fontSize: font.body, padding: 0 },
  groupLabel: {
    color: colors.accent,
    fontSize: font.tiny,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 4
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  rowName: { color: colors.text, fontSize: font.body, fontWeight: "600" },
  rowMeta: { color: colors.textDim, fontSize: font.small, marginTop: 2 }
});
