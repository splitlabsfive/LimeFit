import { Exercise } from "../types";

export const EXERCISES: Exercise[] = [
  { id: "bench-barbell", name: "Bench Press", equipment: "Barbell", muscle: "Chest" },
  { id: "bench-dumbbell", name: "Dumbbell Bench Press", equipment: "Dumbbell", muscle: "Chest" },
  { id: "incline-dumbbell", name: "Incline Dumbbell Press", equipment: "Dumbbell", muscle: "Chest" },
  { id: "chest-fly-machine", name: "Pec Deck Fly", equipment: "Machine", muscle: "Chest" },
  { id: "push-up", name: "Push-Up", equipment: "Bodyweight", muscle: "Chest" },
  { id: "deadlift-barbell", name: "Deadlift", equipment: "Barbell", muscle: "Back" },
  { id: "row-barbell", name: "Bent Over Row", equipment: "Barbell", muscle: "Back" },
  { id: "lat-pulldown", name: "Lat Pulldown", equipment: "Cable", muscle: "Back" },
  { id: "seated-row", name: "Seated Cable Row", equipment: "Cable", muscle: "Back" },
  { id: "pull-up", name: "Pull-Up", equipment: "Bodyweight", muscle: "Back" },
  { id: "squat-barbell", name: "Back Squat", equipment: "Barbell", muscle: "Legs" },
  { id: "front-squat", name: "Front Squat", equipment: "Barbell", muscle: "Legs" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", equipment: "Barbell", muscle: "Legs" },
  { id: "leg-press", name: "Leg Press", equipment: "Machine", muscle: "Legs" },
  { id: "lunge-dumbbell", name: "Walking Lunge", equipment: "Dumbbell", muscle: "Legs" },
  { id: "goblet-squat", name: "Goblet Squat", equipment: "Dumbbell", muscle: "Legs" },
  { id: "calf-raise", name: "Standing Calf Raise", equipment: "Machine", muscle: "Legs" },
  { id: "leg-curl", name: "Lying Leg Curl", equipment: "Machine", muscle: "Legs" },
  { id: "overhead-press", name: "Overhead Press", equipment: "Barbell", muscle: "Shoulders" },
  { id: "dumbbell-shoulder-press", name: "Seated Dumbbell Press", equipment: "Dumbbell", muscle: "Shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", equipment: "Dumbbell", muscle: "Shoulders" },
  { id: "face-pull", name: "Face Pull", equipment: "Cable", muscle: "Shoulders" },
  { id: "barbell-curl", name: "Barbell Curl", equipment: "Barbell", muscle: "Arms" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", equipment: "Dumbbell", muscle: "Arms" },
  { id: "triceps-pushdown", name: "Triceps Pushdown", equipment: "Cable", muscle: "Arms" },
  { id: "hammer-curl", name: "Hammer Curl", equipment: "Dumbbell", muscle: "Arms" },
  { id: "dips", name: "Bench Dips", equipment: "Bodyweight", muscle: "Arms" },
  { id: "plank", name: "Plank", equipment: "Bodyweight", muscle: "Core" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", equipment: "Bodyweight", muscle: "Core" },
  { id: "cable-crunch", name: "Cable Crunch", equipment: "Cable", muscle: "Core" },
  { id: "kettlebell-swing", name: "Kettlebell Swing", equipment: "Kettlebell", muscle: "Legs" },
  { id: "thruster-kettlebell", name: "Kettlebell Thruster", equipment: "Kettlebell", muscle: "Shoulders" }
];

export const exerciseById = (id: string): Exercise | undefined =>
  EXERCISES.find((e) => e.id === id);

export const MUSCLE_ORDER: Exercise["muscle"][] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core"
];
