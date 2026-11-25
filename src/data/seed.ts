import { Routine, WorkoutSession, newId } from "../types";

const planned = (exerciseId: string, sets: [number, number][]): Routine["exerciseIds"][number] => ({
  id: newId(),
  exerciseId,
  sets: sets.map(([kg, reps]) => ({ kg, reps }))
});

export const seedRoutines = (): Routine[] => [
  {
    id: "routine-push",
    title: "Push Day",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
    exerciseIds: [
      planned("bench-barbell", [[60, 8], [70, 6], [70, 6]]),
      planned("overhead-press", [[40, 8], [40, 8], [40, 8]]),
      planned("incline-dumbbell", [[24, 10], [24, 10], [22, 10]]),
      planned("lateral-raise", [[10, 12], [10, 12], [10, 12]]),
      planned("triceps-pushdown", [[30, 12], [30, 12], [30, 12]])
    ]
  },
  {
    id: "routine-pull",
    title: "Pull Day",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    exerciseIds: [
      planned("deadlift-barbell", [[100, 5], [100, 5], [100, 5]]),
      planned("row-barbell", [[60, 8], [60, 8], [60, 8]]),
      planned("lat-pulldown", [[55, 10], [55, 10], [55, 10]]),
      planned("face-pull", [[25, 15], [25, 15], [25, 15]]),
      planned("barbell-curl", [[30, 10], [30, 10], [30, 10]])
    ]
  },
  {
    id: "routine-legs",
    title: "Legs",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    exerciseIds: [
      planned("squat-barbell", [[80, 8], [90, 6], [90, 6]]),
      planned("romanian-deadlift", [[70, 10], [70, 10], [70, 10]]),
      planned("leg-press", [[120, 12], [120, 12], [120, 12]]),
      planned("lunge-dumbbell", [[16, 10], [16, 10], [16, 10]]),
      planned("calf-raise", [[40, 15], [40, 15], [40, 15]])
    ]
  },
  {
    id: "routine-upper",
    title: "Upper Body",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    exerciseIds: [
      planned("bench-dumbbell", [[28, 10], [28, 10], [28, 10]]),
      planned("seated-row", [[50, 10], [50, 10], [50, 10]]),
      planned("dumbbell-shoulder-press", [[20, 10], [20, 10], [20, 10]]),
      planned("dumbbell-curl", [[14, 12], [14, 12], [14, 12]])
    ]
  },
  {
    id: "routine-full",
    title: "Full Body",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    exerciseIds: [
      planned("goblet-squat", [[24, 10], [24, 10], [24, 10]]),
      planned("push-up", [[0, 12], [0, 10], [0, 8]]),
      planned("kettlebell-swing", [[16, 15], [16, 15], [16, 15]]),
      planned("plank", [[0, 45], [0, 45], [0, 30]])
    ]
  }
];

const sessionSet = (kg: number, reps: number) => ({
  id: newId(),
  kg,
  reps,
  done: true
});

export const seedSessions = (): WorkoutSession[] => {
  const twoDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 2;
  return [
    {
      id: "session-1",
      title: "Push Day",
      startedAt: twoDaysAgo,
      finishedAt: twoDaysAgo + 1000 * 60 * 52,
      exercises: [
        {
          id: newId(),
          exerciseId: "bench-barbell",
          sets: [sessionSet(60, 8), sessionSet(70, 6), sessionSet(70, 6), sessionSet(75, 4)]
        },
        {
          id: newId(),
          exerciseId: "overhead-press",
          sets: [sessionSet(40, 8), sessionSet(40, 8), sessionSet(42.5, 6)]
        },
        {
          id: newId(),
          exerciseId: "triceps-pushdown",
          sets: [sessionSet(30, 12), sessionSet(30, 12), sessionSet(35, 10)]
        }
      ]
    },
    {
      id: "session-2",
      title: "Full Body",
      startedAt: twoDaysAgo - 1000 * 60 * 60 * 24 * 3,
      finishedAt: twoDaysAgo - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 41,
      exercises: [
        {
          id: newId(),
          exerciseId: "goblet-squat",
          sets: [sessionSet(24, 10), sessionSet(24, 10), sessionSet(24, 10)]
        },
        {
          id: newId(),
          exerciseId: "kettlebell-swing",
          sets: [sessionSet(16, 15), sessionSet(16, 15), sessionSet(16, 15)]
        }
      ]
    }
  ];
};
