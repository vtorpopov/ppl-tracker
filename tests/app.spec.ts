import { expect, test, type Page } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const shots = 'screenshots';
mkdirSync(shots, { recursive: true });
const snap = (page: Page, name: string) => page.screenshot({ path: `${shots}/${name}.png` });

test('full workout flow on an iPhone-sized screen', async ({ page }, info) => {
  page.on('dialog', (d) => d.accept());
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await expect(page.getByText('Next up · Push')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start Push A' })).toBeVisible();
  await snap(page, '01-today');

  // Start Push A and log the bench press.
  await page.getByRole('button', { name: 'Start Push A' }).click();
  await expect(page.getByText('Barbell Bench Press')).toBeVisible();
  const weights = page.getByLabel('Weight');
  const reps = page.getByLabel('Reps');
  const checks = page.getByRole('button', { name: 'Mark set done' });

  // Set 1 → warm-up.
  await page.getByRole('button', { name: 'Working set, tap to make warm-up' }).first().click();
  await weights.nth(0).fill('95');
  await reps.nth(0).fill('10');
  await checks.first().click();
  await expect(page.getByText('Rest', { exact: true })).toBeVisible();

  // Set 2: working set at 135 × 8, RPE 8.
  await weights.nth(1).fill('135');
  await reps.nth(1).fill('8');
  await page.getByLabel('RPE').nth(1).selectOption('8');
  await checks.first().click();
  // Set 3 accepts suggested values (135 carried from today, reps from target).
  await expect(weights.nth(2)).toHaveAttribute('placeholder', '135');
  await checks.first().click();
  await snap(page, '02-workout');

  // Plate calculator from the exercise menu.
  await page.getByText('Barbell Bench Press').click();
  await page.getByRole('button', { name: 'Plate calculator' }).click();
  await expect(page.getByText('45 + 0').or(page.getByText('45', { exact: true }))).toBeVisible();
  await snap(page, '03-plates');
  await page.getByRole('button', { name: 'Close', exact: true }).click();

  // Swap shows suggestions first; the full library is one level deeper.
  await page.getByText('Overhead Press', { exact: true }).click();
  await page.getByRole('button', { name: 'Swap exercise' }).click();
  await expect(page.getByText('Suggested')).toBeVisible();
  await page.getByRole('button', { name: 'Browse all exercises' }).click();
  await expect(page.getByPlaceholder('Search exercises')).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByPlaceholder('Search exercises')).toBeHidden();

  await page.getByText('Overhead Press', { exact: true }).click();
  await page.getByRole('button', { name: 'Swap exercise' }).click();
  const swapDialog = page.getByRole('dialog', { name: 'Swap Overhead Press' });
  const suggestion = swapDialog.getByRole('button', { name: /Seated Dumbbell Shoulder Press/ });
  await expect(suggestion).toBeVisible();
  await expect(suggestion).toContainText('Same movement');
  // Already in this workout, so not suggested.
  await expect(swapDialog.getByRole('button', { name: /Incline Dumbbell Press/ })).toHaveCount(0);
  await page.waitForTimeout(400); // let the sheet finish sliding up
  await snap(page, '03b-swap');
  await suggestion.click();
  await expect(page.getByText(/choose a default in Settings/)).toBeVisible();
  await page.getByRole('button', { name: 'Just this workout' }).click();
  await expect(page.getByText('Seated Dumbbell Shoulder Press')).toBeVisible();

  await page.getByPlaceholder(/Workout notes/).fill('Felt strong');
  await page.getByRole('button', { name: 'Finish' }).click();

  // Rotation advanced to Pull A; last workout shows.
  await expect(page.getByText('Next up · Pull')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start Pull A' })).toBeVisible();
  await expect(page.getByText('Last workout')).toBeVisible();
  // Warm-up excluded: two working sets of 135 × 8.
  await expect(page.getByText('Sets 2')).toBeVisible();
  await expect(page.getByText('Volume 2160 lbs')).toBeVisible();

  // Skip moves to Legs A.
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page.getByRole('button', { name: 'Start Legs A' })).toBeVisible();

  // Body weight.
  await page.getByLabel('Body weight').fill('182.4');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText(/^182\.4\s*lbs$/)).toBeVisible();
  await snap(page, '04-today-after');

  // Export a backup, add 8 weeks of fake history, import it back.
  await page.getByRole('button', { name: 'Settings' }).click();
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const file = await (await dl).path();
  const backup = JSON.parse(readFileSync(file, 'utf8'));
  expect(backup.sessions).toHaveLength(1);
  expect(backup.sessions[0].exercises[0].sets[1].weight).toBe(135);
  expect(backup.sessions[0].exercises[0].sets[0].warmup).toBe(true);
  expect(backup.sessions[0].exercises[0].sets[1].rpe).toBe(8);
  expect(backup.sessions[0].exercises[0].sets[2]).toMatchObject({ weight: 135, reps: 8, done: true });
  expect(backup.sessions[0].notes).toBe('Felt strong');
  expect(backup.sessions[0].exercises.map((e: { exerciseId: number }) => e.exerciseId)).toEqual([1]);
  const day = 86400000;
  const start = Date.now() - 56 * day;
  for (let w = 0; w < 8; w++) {
    const t = start + w * 7 * day;
    backup.sessions.push({
      templateId: 1, name: 'Push A', category: 'push', startedAt: t, endedAt: t + 55 * 60000, notes: '',
      exercises: [{ exerciseId: 1, repMin: 5, repMax: 8, restSec: 180, sets: [0, 1, 2].map(() => ({ weight: 115 + w * 5, reps: 8 - (w % 3), rpe: 8, warmup: false, done: true })) }],
    });
    backup.bodyWeight.push({ date: t, lbs: 188 - w * 0.8 });
  }
  const modified = info.outputPath('backup.json');
  writeFileSync(modified, JSON.stringify(backup));
  await page.locator('input[type=file]').setInputFiles(modified);
  await expect(page.getByText('Backup restored.')).toBeVisible();

  // Progress chart.
  await page.getByRole('button', { name: 'Progress' }).click();
  await expect(page.getByText('Barbell Bench Press')).toBeVisible();
  await expect(page.locator('.recharts-line').first()).toBeVisible();
  await snap(page, '05-progress');
  await page.mouse.wheel(0, 1200);
  await snap(page, '06-progress-bodyweight');

  // History list, then open and edit a session.
  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.getByText('Push A').first()).toBeVisible();
  await snap(page, '07-history');
  await page.getByText('Push A').first().click();
  await expect(page.getByRole('button', { name: 'Delete Workout' })).toBeVisible();
  await snap(page, '07b-history-edit');
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  // Plans and template editor.
  await page.getByRole('button', { name: 'Plans' }).click();
  await expect(page.getByText('Rotation')).toBeVisible();
  await snap(page, '08-plans');
  await page.getByText('Legs B').last().click();
  await expect(page.getByLabel('Workout name')).toHaveValue('Legs B');
  await snap(page, '09-template');
  await page.getByText('‹ Plans').click();

  // kg mode converts display only; switching back restores exact values.
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Kilograms (kg)' }).click();
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(page.getByText(/^82\.74\s*kg$/)).toBeVisible(); // 182.4 lbs
  await snap(page, '10-today-kg');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Pounds (lbs)' }).click();
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(page.getByText(/^182\.4\s*lbs$/)).toBeVisible();

  // Swap default "This workout": no question, saved plan unchanged.
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'This workout' }).click();
  await expect(page.getByText(/Swaps only change the current workout/)).toBeVisible();
  await snap(page, '11-settings-swap');
  await page.getByRole('button', { name: 'Today' }).click();
  await page.getByRole('button', { name: 'Start Legs A' }).click();
  await page.getByText('Back Squat', { exact: true }).click();
  await page.getByRole('button', { name: 'Swap exercise' }).click();
  await page.getByRole('dialog').getByRole('button', { name: /Hack Squat/ }).click();
  await expect(page.getByRole('button', { name: 'Just this workout' })).toHaveCount(0);
  await expect(page.getByText('Hack Squat', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Discard Workout' }).click();
  await page.getByRole('button', { name: 'Plans' }).click();
  await page.getByText('Legs A').last().click();
  await expect(page.getByText('Back Squat', { exact: true })).toBeVisible();
  await page.getByText('‹ Plans').click();

  // Swap default "Update plan": the saved plan changes too.
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Update plan' }).click();
  await page.getByRole('button', { name: 'Today' }).click();
  await page.getByRole('button', { name: 'Start Legs A' }).click();
  await page.getByText('Romanian Deadlift', { exact: true }).click();
  await page.getByRole('button', { name: 'Swap exercise' }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^Deadlift/ }).click();
  await expect(page.getByText('Deadlift', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Discard Workout' }).click();
  await page.getByRole('button', { name: 'Plans' }).click();
  await page.getByText('Legs A').last().click();
  await expect(page.getByText('Deadlift', { exact: true })).toBeVisible();
  await expect(page.getByText('Romanian Deadlift', { exact: true })).toHaveCount(0);

  expect(errors).toEqual([]);
});

test('works offline after first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start Push A' })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start Push A' })).toBeVisible();
});
