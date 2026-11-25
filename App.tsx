import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Tab, TabBar } from "./src/components/TabBar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { WorkoutScreen } from "./src/screens/WorkoutScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { RoutineEditorScreen } from "./src/screens/RoutineEditorScreen";
import { ActiveWorkoutScreen } from "./src/screens/ActiveWorkoutScreen";
import { StoreProvider, useStore } from "./src/store";
import { colors } from "./src/theme";

type Route =
  | { name: "tabs" }
  | { name: "editor"; routineId?: string }
  | { name: "active" };

function Shell() {
  const { active } = useStore();
  const [tab, setTab] = useState<Tab>("workout");
  const [route, setRoute] = useState<Route>({ name: "tabs" });

  const closeToTabs = () => setRoute({ name: "tabs" });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.body}>
        {route.name === "editor" ? (
          <RoutineEditorScreen
            routineId={route.routineId}
            onClose={closeToTabs}
          />
        ) : route.name === "active" ? (
          <ActiveWorkoutScreen onClose={closeToTabs} />
        ) : tab === "home" ? (
          <HomeScreen
            onGoWorkout={() => setTab("workout")}
            onOpenActive={() => setRoute({ name: "active" })}
          />
        ) : tab === "workout" ? (
          <WorkoutScreen
            onNewRoutine={() => setRoute({ name: "editor" })}
            onEditRoutine={(routineId) => setRoute({ name: "editor", routineId })}
            onOpenActive={() => setRoute({ name: "active" })}
          />
        ) : (
          <ProfileScreen />
        )}
      </View>
      {route.name === "tabs" ? (
        <TabBar tab={tab} onChange={setTab} hasActive={active !== null} />
      ) : null}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1 }
});
