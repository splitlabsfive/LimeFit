import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { seedRoutines, seedSessions } from "./data/seed";
import { loadJSON, saveJSON } from "./storage";
import { Routine, WorkoutSession, newId } from "./types";

type State = {
  ready: boolean;
  routines: Routine[];
  sessions: WorkoutSession[];
  active: WorkoutSession | null;
};

type Action =
  | { type: "hydrate"; routines: Routine[]; sessions: WorkoutSession[]; active: WorkoutSession | null }
  | { type: "saveRoutine"; routine: Routine }
  | { type: "deleteRoutine"; id: string }
  | { type: "startEmpty" }
  | { type: "startRoutine"; routine: Routine }
  | { type: "addExerciseToActive"; exerciseId: string }
  | { type: "removeExerciseFromActive"; workoutExerciseId: string }
  | { type: "addSet"; workoutExerciseId: string }
  | { type: "updateSet"; workoutExerciseId: string; setId: string; kg?: number; reps?: number }
  | { type: "toggleSet"; workoutExerciseId: string; setId: string }
  | { type: "finishActive" }
  | { type: "discardActive" };

const initialState: State = {
  ready: false,
  routines: [],
  sessions: [],
  active: null
};

const emptySession = (): WorkoutSession => ({
  id: newId(),
  title: "Workout",
  startedAt: Date.now(),
  finishedAt: null,
  exercises: []
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, ready: true, ...action };
    case "saveRoutine": {
      const exists = state.routines.some((r) => r.id === action.routine.id);
      return {
        ...state,
        routines: exists
          ? state.routines.map((r) => (r.id === action.routine.id ? action.routine : r))
          : [action.routine, ...state.routines]
      };
    }
    case "deleteRoutine":
      return { ...state, routines: state.routines.filter((r) => r.id !== action.id) };
    case "startEmpty":
      return { ...state, active: emptySession() };
    case "startRoutine": {
      const session = emptySession();
      session.title = action.routine.title;
      session.exercises = action.routine.exerciseIds.map((re) => ({
        id: newId(),
        exerciseId: re.exerciseId,
        sets: re.sets.map((s) => ({ id: newId(), kg: s.kg, reps: s.reps, done: false }))
      }));
      return { ...state, active: session };
    }
    case "addExerciseToActive": {
      if (!state.active) return state;
      return {
        ...state,
        active: {
          ...state.active,
          exercises: [
            ...state.active.exercises,
            {
              id: newId(),
              exerciseId: action.exerciseId,
              sets: [{ id: newId(), kg: 0, reps: 10, done: false }]
            }
          ]
        }
      };
    }
    case "removeExerciseFromActive": {
      if (!state.active) return state;
      return {
        ...state,
        active: {
          ...state.active,
          exercises: state.active.exercises.filter((e) => e.id !== action.workoutExerciseId)
        }
      };
    }
    case "addSet": {
      if (!state.active) return state;
      return {
        ...state,
        active: {
          ...state.active,
          exercises: state.active.exercises.map((e) =>
            e.id === action.workoutExerciseId
              ? {
                  ...e,
                  sets: [
                    ...e.sets,
                    {
                      id: newId(),
                      kg: e.sets[e.sets.length - 1]?.kg ?? 0,
                      reps: e.sets[e.sets.length - 1]?.reps ?? 10,
                      done: false
                    }
                  ]
                }
              : e
          )
        }
      };
    }
    case "updateSet": {
      if (!state.active) return state;
      return {
        ...state,
        active: {
          ...state.active,
          exercises: state.active.exercises.map((e) =>
            e.id === action.workoutExerciseId
              ? {
                  ...e,
                  sets: e.sets.map((s) =>
                    s.id === action.setId
                      ? {
                          ...s,
                          ...(action.kg !== undefined ? { kg: action.kg } : {}),
                          ...(action.reps !== undefined ? { reps: action.reps } : {})
                        }
                      : s
                  )
                }
              : e
          )
        }
      };
    }
    case "toggleSet": {
      if (!state.active) return state;
      return {
        ...state,
        active: {
          ...state.active,
          exercises: state.active.exercises.map((e) =>
            e.id === action.workoutExerciseId
              ? {
                  ...e,
                  sets: e.sets.map((s) =>
                    s.id === action.setId ? { ...s, done: !s.done } : s
                  )
                }
              : e
          )
        }
      };
    }
    case "finishActive": {
      if (!state.active) return state;
      const finished: WorkoutSession = {
        ...state.active,
        finishedAt: Date.now()
      };
      return {
        ...state,
        active: null,
        sessions: [finished, ...state.sessions]
      };
    }
    case "discardActive":
      return { ...state, active: null };
    default:
      return state;
  }
}

type StoreValue = {
  ready: boolean;
  routines: Routine[];
  sessions: WorkoutSession[];
  active: WorkoutSession | null;
  saveRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  startEmptyWorkout: () => void;
  startRoutine: (routine: Routine) => void;
  addExerciseToActive: (exerciseId: string) => void;
  removeExerciseFromActive: (workoutExerciseId: string) => void;
  addSet: (workoutExerciseId: string) => void;
  updateSet: (workoutExerciseId: string, setId: string, patch: { kg?: number; reps?: number }) => void;
  toggleSet: (workoutExerciseId: string, setId: string) => void;
  finishActive: () => void;
  discardActive: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [routines, sessions, active] = await Promise.all([
        loadJSON<Routine[] | null>("limefit.routines", null),
        loadJSON<WorkoutSession[] | null>("limefit.sessions", null),
        loadJSON<WorkoutSession | null>("limefit.active", null)
      ]);
      if (cancelled) return;
      dispatch({
        type: "hydrate",
        routines: routines ?? seedRoutines(),
        sessions: sessions ?? seedSessions(),
        active
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    saveJSON("limefit.routines", state.routines);
    saveJSON("limefit.sessions", state.sessions);
    saveJSON("limefit.active", state.active);
  }, [state.ready, state.routines, state.sessions, state.active]);

  const value = useMemo<StoreValue>(
    () => ({
      ready: state.ready,
      routines: state.routines,
      sessions: state.sessions,
      active: state.active,
      saveRoutine: (routine) => dispatch({ type: "saveRoutine", routine }),
      deleteRoutine: (id) => dispatch({ type: "deleteRoutine", id }),
      startEmptyWorkout: () => dispatch({ type: "startEmpty" }),
      startRoutine: (routine) => dispatch({ type: "startRoutine", routine }),
      addExerciseToActive: (exerciseId) =>
        dispatch({ type: "addExerciseToActive", exerciseId }),
      removeExerciseFromActive: (workoutExerciseId) =>
        dispatch({ type: "removeExerciseFromActive", workoutExerciseId }),
      addSet: (workoutExerciseId) => dispatch({ type: "addSet", workoutExerciseId }),
      updateSet: (workoutExerciseId, setId, patch) =>
        dispatch({ type: "updateSet", workoutExerciseId, setId, ...patch }),
      toggleSet: (workoutExerciseId, setId) =>
        dispatch({ type: "toggleSet", workoutExerciseId, setId }),
      finishActive: () => dispatch({ type: "finishActive" }),
      discardActive: () => dispatch({ type: "discardActive" })
    }),
    [state]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
