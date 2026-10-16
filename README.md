# PPL Tracker

A Push / Pull / Legs workout tracker for iPhone. It's a web app you add to your
home screen. It works offline and keeps all data on your phone.

## Features
- **Rotation:** Push A → Pull A → Legs A → Push B → Pull B → Legs B. The Today tab always shows what's next. You can skip a workout or choose another.
- **Logging:** weight, reps, effort rating (RPE), warm-up sets, notes, and cardio (minutes and miles).
- **Rest timer** starts on its own when you check off a set.
- **"Last time" numbers** and **next-weight hints** (add weight when you hit every rep).
- **Swap exercises** mid-workout, or update the plan permanently.
- **Plate calculator**, an **exercise library**, and editable workouts.
- **Progress charts** (heaviest set, estimated 1-rep max, volume) and a **body weight** log.
- **lbs by default**, with kg available in Settings.
- **Backup:** export and import a JSON file in Settings.

## Install on iPhone
1. Open the site in **Safari**.
2. Tap **Share**, then **Add to Home Screen**.

## Development
```bash
npm install
npm run dev        # local dev server
npm test           # logic unit tests
npm run build      # production build in dist/
npx playwright test  # iPhone-size walkthrough; screenshots go to screenshots/
```

Pushing to `main` builds the app and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). In the repo, go to **Settings → Pages** and set
**Source** to **GitHub Actions**.

## Going native later
The app is plain React plus IndexedDB, so it can be wrapped with Capacitor
(`npx cap add ios`) on a Mac without a rewrite.
