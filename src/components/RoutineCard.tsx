import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { exerciseById } from "../data/exercises";
import { colors, font, radius } from "../theme";
import { Routine } from "../types";
import { Icon } from "./Icon";

type Props = {
  routine: Routine;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function RoutineCard({ routine, onStart, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const names = routine.exerciseIds
    .map((re) => exerciseById(re.exerciseId)?.name ?? "Exercise")
    .join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{routine.title}</Text>
        <Pressable
          style={styles.dots}
          onPress={() => setMenuOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel="Routine options"
        >
          <Icon name="dots" size={18} color={colors.textDim} />
        </Pressable>
      </View>
      {menuOpen ? (
        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); onEdit(); }}>
            <Icon name="doc" size={14} color={colors.text} />
            <Text style={styles.menuText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); onDelete(); }}>
            <Icon name="trash" size={14} color={colors.danger} />
            <Text style={[styles.menuText, { color: colors.danger }]}>Delete</Text>
          </Pressable>
        </View>
      ) : null}
      <Text style={styles.exercises} numberOfLines={1}>{names}</Text>
      <Pressable style={styles.startButton} onPress={onStart} accessibilityRole="button">
        <Text style={styles.startText}>Start Routine</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: colors.text, fontSize: font.heading, fontWeight: "700", flex: 1 },
  dots: { padding: 6 },
  menu: {
    position: "absolute",
    right: 10,
    top: 40,
    zIndex: 10,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 6,
    gap: 2,
    minWidth: 120
  },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, paddingHorizontal: 8 },
  menuText: { color: colors.text, fontSize: font.small, fontWeight: "600" },
  exercises: { color: colors.textDim, fontSize: font.small, marginTop: 6, marginBottom: 12 },
  startButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: "center"
  },
  startText: { color: colors.onAccent, fontWeight: "700", fontSize: font.body }
});
