export type Equipment =
  | "Barbell"
  | "Dumbbell"
  | "Kettlebell"
  | "Machine"
  | "Cable"
  | "Bodyweight";

export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core";

export type Exercise = {
  id: string;
  name: string;
  equipment: Equipment;
  muscle: MuscleGroup;
};

export type PlannedSet = {
  kg: number;
  reps: number;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  sets: PlannedSet[];
};

export type Routine = {
  id: string;
  title: string;
  exerciseIds: RoutineExercise[];
  createdAt: number;
};

export type WorkoutSet = {
  id: string;
  kg: number;
  reps: number;
  done: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
};

export type WorkoutSession = {
  id: string;
  title: string;
  startedAt: number;
  finishedAt: number | null;
  exercises: WorkoutExercise[];
};

export const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
