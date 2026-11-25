# LimeFit Mobile (Expo MVP)

A dark-themed workout tracker for iOS / Android / web with a strong lime accent. Log sets (kg x reps), build routines, start empty workouts or routine-based sessions, and track weekly stats and history.

## Features

- **Workout tab** — start an empty workout or pick from your routines, resume an in-progress session.
- **Routines** — create / edit / delete routines with an exercise picker (30 exercises, grouped by muscle) and per-exercise set counts.
- **Live logging** — per-set kg and reps inputs, check sets off, automatic 90s rest timer, add sets/exercises on the fly, finish with a summary.
- **Home & Profile** — weekly stats (workouts, volume, sets, streak), last workout, full history.
- State persists via `localStorage` on web (in-memory fallback on native).

## Run locally

```bash
npm install
npm start          # then press w for web, or a for Android
npm run web
npm run typecheck
```

## Structure

```
App.tsx                     root + tab/navigation state
src/store.tsx               reducer store with persistence
src/theme.ts                colors (lime accent), spacing, type scale
src/types.ts                domain types
src/stats.ts                volume / streak / formatting helpers
src/data/                   exercise library + seed routines/sessions
src/components/             Icon (vector, no deps), TabBar, RoutineCard, ExercisePicker
src/screens/                Home, Workout, Profile, RoutineEditor, ActiveWorkout
```
