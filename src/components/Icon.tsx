import { View } from "react-native";

export type IconName =
  | "plus"
  | "minus"
  | "check"
  | "x"
  | "chevronDown"
  | "search"
  | "doc"
  | "dumbbell"
  | "home"
  | "user"
  | "clock"
  | "chart"
  | "play"
  | "dots"
  | "trash";

type Props = {
  name: IconName;
  size?: number;
  color: string;
};

export function Icon({ name, size = 20, color }: Props) {
  const s = size;
  const bar = Math.max(2, Math.round(s * 0.09));
  const B = (style: object) => (
    <View
      style={[
        { position: "absolute", backgroundColor: color, borderRadius: bar / 2 },
        style
      ]}
    />
  );
  const C = (style: object) => (
    <View
      style={[{ position: "absolute", backgroundColor: color, borderRadius: s }, style]}
    />
  );

  switch (name) {
    case "plus":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: (s - bar) / 2, top: (s - s * 0.6) / 2, width: bar, height: s * 0.6 })}
          {B({ left: (s - s * 0.6) / 2, top: (s - bar) / 2, width: s * 0.6, height: bar })}
        </View>
      );
    case "minus":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: (s - s * 0.6) / 2, top: (s - bar) / 2, width: s * 0.6, height: bar })}
        </View>
      );
    case "check":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.13, top: s * 0.62, width: s * 0.34, height: bar, transform: [{ rotate: "45deg" }] })}
          {B({ left: s * 0.3, top: s * 0.5, width: s * 0.62, height: bar, transform: [{ rotate: "-45deg" }] })}
        </View>
      );
    case "x":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.22, top: (s - bar) / 2, width: s * 0.6, height: bar, transform: [{ rotate: "45deg" }] })}
          {B({ left: s * 0.22, top: (s - bar) / 2, width: s * 0.6, height: bar, transform: [{ rotate: "-45deg" }] })}
        </View>
      );
    case "chevronDown":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.16, top: s * 0.42, width: s * 0.42, height: bar, transform: [{ rotate: "45deg" }] })}
          {B({ left: s * 0.44, top: s * 0.42, width: s * 0.42, height: bar, transform: [{ rotate: "-45deg" }] })}
        </View>
      );
    case "search":
      return (
        <View style={{ width: s, height: s }}>
          <View
            style={{
              position: "absolute",
              left: s * 0.1,
              top: s * 0.1,
              width: s * 0.52,
              height: s * 0.52,
              borderWidth: Math.max(2, bar),
              borderColor: color,
              borderRadius: s * 0.26
            }}
          />
          {B({ left: s * 0.55, top: s * 0.58, width: s * 0.32, height: bar, transform: [{ rotate: "45deg" }] })}
        </View>
      );
    case "doc":
      return (
        <View style={{ width: s, height: s }}>
          <View
            style={{
              position: "absolute",
              left: s * 0.24,
              top: s * 0.08,
              width: s * 0.52,
              height: s * 0.84,
              borderWidth: Math.max(2, bar),
              borderColor: color,
              borderRadius: s * 0.08
            }}
          />
          {B({ left: s * 0.36, top: s * 0.3, width: s * 0.28, height: bar })}
          {B({ left: s * 0.36, top: s * 0.48, width: s * 0.28, height: bar })}
          {B({ left: s * 0.36, top: s * 0.66, width: s * 0.18, height: bar })}
        </View>
      );
    case "dumbbell":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.2, top: (s - bar) / 2, width: s * 0.6, height: bar })}
          {B({ left: s * 0.26, top: s * 0.24, width: s * 0.07, height: s * 0.52, borderRadius: 2 })}
          {B({ left: s * 0.67, top: s * 0.24, width: s * 0.07, height: s * 0.52, borderRadius: 2 })}
          {B({ left: s * 0.14, top: s * 0.13, width: s * 0.08, height: s * 0.74, borderRadius: 2 })}
          {B({ left: s * 0.78, top: s * 0.13, width: s * 0.08, height: s * 0.74, borderRadius: 2 })}
        </View>
      );
    case "home":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.07, top: s * 0.32, width: s * 0.5, height: bar * 1.7, transform: [{ rotate: "-45deg" }] })}
          {B({ left: s * 0.43, top: s * 0.32, width: s * 0.5, height: bar * 1.7, transform: [{ rotate: "45deg" }] })}
          {B({ left: s * 0.24, top: s * 0.5, width: s * 0.52, height: s * 0.4, borderRadius: 2 })}
        </View>
      );
    case "user":
      return (
        <View style={{ width: s, height: s }}>
          {C({ left: s * 0.32, top: s * 0.1, width: s * 0.36, height: s * 0.36, borderRadius: s * 0.18 })}
          <View
            style={{
              position: "absolute",
              left: s * 0.16,
              top: s * 0.54,
              width: s * 0.68,
              height: s * 0.36,
              backgroundColor: color,
              borderTopLeftRadius: s * 0.3,
              borderTopRightRadius: s * 0.3
            }}
          />
        </View>
      );
    case "clock":
      return (
        <View style={{ width: s, height: s }}>
          <View
            style={{
              position: "absolute",
              left: s * 0.1,
              top: s * 0.1,
              width: s * 0.8,
              height: s * 0.8,
              borderWidth: Math.max(2, bar),
              borderColor: color,
              borderRadius: s * 0.4
            }}
          />
          {B({ left: (s - bar) / 2, top: s * 0.24, width: bar, height: s * 0.28 })}
          {B({ left: s * 0.5, top: (s - bar) / 2, width: s * 0.24, height: bar })}
        </View>
      );
    case "chart":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.16, bottom: s * 0.12, width: s * 0.16, height: s * 0.34, borderRadius: 2 })}
          {B({ left: s * 0.42, bottom: s * 0.12, width: s * 0.16, height: s * 0.62, borderRadius: 2 })}
          {B({ left: s * 0.68, bottom: s * 0.12, width: s * 0.16, height: s * 0.46, borderRadius: 2 })}
        </View>
      );
    case "play":
      return (
        <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: s * 0.3,
              borderBottomWidth: s * 0.3,
              borderLeftWidth: s * 0.5,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: color
            }}
          />
        </View>
      );
    case "dots":
      return (
        <View style={{ width: s, height: s }}>
          {C({ left: s * 0.12, top: s * 0.44, width: s * 0.12, height: s * 0.12, borderRadius: s * 0.06 })}
          {C({ left: s * 0.44, top: s * 0.44, width: s * 0.12, height: s * 0.12, borderRadius: s * 0.06 })}
          {C({ left: s * 0.76, top: s * 0.44, width: s * 0.12, height: s * 0.12, borderRadius: s * 0.06 })}
        </View>
      );
    case "trash":
      return (
        <View style={{ width: s, height: s }}>
          {B({ left: s * 0.38, top: s * 0.08, width: s * 0.24, height: bar })}
          {B({ left: s * 0.18, top: s * 0.18, width: s * 0.64, height: bar })}
          <View
            style={{
              position: "absolute",
              left: s * 0.28,
              top: s * 0.32,
              width: s * 0.44,
              height: s * 0.56,
              borderWidth: Math.max(2, bar),
              borderColor: color,
              borderRadius: s * 0.08
            }}
          />
        </View>
      );
    default:
      return null;
  }
}
