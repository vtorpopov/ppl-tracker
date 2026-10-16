import type { BodyWeight, Exercise, PplDb, Session, Settings, Template } from '../db/schema';

export interface Backup {
  app: 'ppl-tracker';
  version: 1;
  exportedAt: string;
  exercises: Exercise[];
  templates: Template[];
  sessions: Session[];
  bodyWeight: BodyWeight[];
  settings: Settings[];
}

export async function exportData(db: PplDb): Promise<Backup> {
  return {
    app: 'ppl-tracker',
    version: 1,
    exportedAt: new Date().toISOString(),
    exercises: await db.exercises.toArray(),
    templates: await db.templates.toArray(),
    sessions: await db.sessions.toArray(),
    bodyWeight: await db.bodyWeight.toArray(),
    settings: await db.settings.toArray(),
  };
}

export function isBackup(x: unknown): x is Backup {
  const b = x as Backup;
  return (
    !!b &&
    b.app === 'ppl-tracker' &&
    b.version === 1 &&
    [b.exercises, b.templates, b.sessions, b.bodyWeight, b.settings].every(Array.isArray)
  );
}

/** Replaces everything on this device with the backup's contents. */
export async function importData(db: PplDb, data: unknown): Promise<void> {
  if (!isBackup(data)) throw new Error('This file is not a PPL Tracker backup.');
  const tables = [db.exercises, db.templates, db.sessions, db.bodyWeight, db.settings];
  await db.transaction('rw', tables, async () => {
    await Promise.all(tables.map((t) => t.clear()));
    await db.exercises.bulkAdd(data.exercises);
    await db.templates.bulkAdd(data.templates);
    await db.sessions.bulkAdd(data.sessions);
    await db.bodyWeight.bulkAdd(data.bodyWeight);
    await db.settings.bulkAdd(data.settings);
  });
}
