import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font } from "../theme";
import { Icon, IconName } from "./Icon";

export type Tab = "home" | "workout" | "profile";

const TABS: { key: Tab; label: string; icon: IconName }[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "workout", label: "Workout", icon: "dumbbell" },
  { key: "profile", label: "Profile", icon: "user" }
];

export function TabBar({ tab, onChange, hasActive }: { tab: Tab; onChange: (t: Tab) => void; hasActive: boolean }) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const active = tab === t.key;
        return (
          <Pressable
            key={t.key}
            style={styles.tab}
            onPress={() => onChange(t.key)}
            accessibilityRole="button"
          >
            <View style={styles.iconWrap}>
              <Icon name={t.icon} size={22} color={active ? colors.accent : colors.textDim} />
              {t.key === "workout" && hasActive ? <View style={styles.dot} /> : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8
  },
  tab: { flex: 1, alignItems: "center", gap: 3 },
  iconWrap: { position: "relative" },
  dot: {
    position: "absolute",
    right: -4,
    top: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent
  },
  label: { color: colors.textDim, fontSize: font.tiny, fontWeight: "600" },
  labelActive: { color: colors.accent }
});
