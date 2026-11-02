import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Exercise, type ExerciseType, type Region } from '../db/schema';
import { Button, Segmented, Sheet } from './ui';

const muscles = ['Chest', 'Shoulders', 'Triceps', 'Back', 'Biceps', 'Traps', 'Forearms', 'Quads', 'Hamstrings', 'Glutes', 'Adductors', 'Calves', 'Core', 'Cardio', 'Other'];

export function ExercisePicker({ open, title = 'Choose Exercise', onClose, onPick }: {
  open: boolean; title?: string; onClose: () => void; onPick: (ex: Exercise) => void;
}) {
  const all = useLiveQuery(() => db.exercises.orderBy('name').toArray(), []) ?? [];
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((e) => (!muscle || e.muscle === muscle) && (!needle || e.name.toLowerCase().includes(needle)));
  }, [all, q, muscle]);

  const close = () => { setQ(''); setMuscle(null); setCreating(false); onClose(); };

  return (
    <Sheet open={open} title={creating ? 'New Exercise' : title} onClose={close}>
      {creating ? (
        <NewExerciseForm
          initialName={q}
          onCancel={() => setCreating(false)}
          onCreated={(ex) => { onPick(ex); close(); }}
        />
      ) : (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises"
            className="w-full bg-card2 rounded-xl px-3 py-2.5 outline-none placeholder:text-label2"
          />
          <div className="flex gap-2 overflow-x-auto py-3 -mx-4 px-4 no-scrollbar">
            {[null, ...muscles].map((m) => (
              <button
                key={m ?? 'all'}
                type="button"
                onClick={() => setMuscle(m)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[13px] font-semibold ${muscle === m ? 'bg-accent text-white' : 'bg-card2 text-label2'}`}
              >
                {m ?? 'All'}
              </button>
            ))}
          </div>
          <div className="bg-card2/50 rounded-2xl overflow-hidden">
            {list.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => { onPick(e); close(); }}
                className="w-full text-left px-4 py-3 border-b border-sep/60 last:border-b-0 active:bg-card2"
              >
                <div className="font-medium">{e.name}</div>
                <div className="text-label2 text-[13px]">{e.muscle} · {e.equipment}</div>
              </button>
            ))}
            {list.length === 0 && <div className="text-label2 text-center py-6">No matches</div>}
          </div>
          <Button kind="secondary" className="w-full mt-4" onClick={() => setCreating(true)}>+ Create new exercise</Button>
        </>
      )}
    </Sheet>
  );
}

export function NewExerciseForm({ initialName = '', onCancel, onCreated }: {
  initialName?: string; onCancel: () => void; onCreated: (ex: Exercise) => void;
}) {
  const [name, setName] = useState(initialName);
  const [muscle, setMuscle] = useState('Chest');
  const [equipment, setEquipment] = useState('Barbell');
  const [type, setType] = useState<ExerciseType>('strength');
  const [region, setRegion] = useState<Region>('upper');

  const save = async () => {
    const ex: Exercise = { name: name.trim(), muscle, equipment, type, region };
    ex.id = await db.exercises.add(ex);
    onCreated(ex);
  };

  const field = 'w-full bg-card2 rounded-xl px-3 py-2.5 outline-none';
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-label2 text-[13px]">Name</span>
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cable Row" autoFocus />
      </label>
      <label className="block">
        <span className="text-label2 text-[13px]">Muscle group</span>
        <select className={field} value={muscle} onChange={(e) => setMuscle(e.target.value)}>
          {muscles.map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="text-label2 text-[13px]">Equipment</span>
        <select className={field} value={equipment} onChange={(e) => setEquipment(e.target.value)}>
          {['Barbell', 'Dumbbell', 'Cable', 'Machine', 'EZ Bar', 'Kettlebell', 'Bodyweight', 'Band', 'None'].map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>
      <div>
        <span className="text-label2 text-[13px]">Tracking</span>
        <Segmented value={type} onChange={setType} options={[
          { value: 'strength', label: 'Weight' }, { value: 'bodyweight', label: 'Body' }, { value: 'timed', label: 'Timed' }, { value: 'cardio', label: 'Cardio' },
        ]} />
      </div>
      <div>
        <span className="text-label2 text-[13px]">Body area (sets the weight jump: upper +5 lbs, lower +10 lbs)</span>
        <Segmented value={region} onChange={setRegion} options={[
          { value: 'upper', label: 'Upper' }, { value: 'lower', label: 'Lower' }, { value: 'core', label: 'Core' },
        ]} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button kind="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" disabled={!name.trim()} onClick={save}>Save</Button>
      </div>
    </div>
  );
}
