import { useRef, useState } from 'react';
import { db, type Settings, type SwapMode, type Unit } from '../db/schema';
import { exportData, importData } from '../logic/backup';
import { fmtClock } from '../format';
import { Button, Card, NumInput, Page, Row, SectionTitle, Segmented } from '../components/ui';

export function SettingsScreen({ settings }: { settings: Settings }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const unit = settings.unit;
  const isKg = unit === 'kg';
  const plates = isKg ? settings.platesKg : settings.platesLbs;
  const [platesText, setPlatesText] = useState<string | null>(null);

  const update = (patch: Partial<Settings>) => db.settings.update('main', patch);

  const doExport = async () => {
    const data = await exportData(db);
    const name = `ppl-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([JSON.stringify(data)], name, { type: 'application/json' });
    // On iPhone the share sheet lets you "Save to Files" or AirDrop it.
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'PPL Tracker backup' });
        setMsg('Backup ready.');
        return;
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setMsg('Backup downloaded.');
  };

  const doImport = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (!confirm('Replace ALL data on this phone with this backup?')) return;
      await importData(db, data);
      setMsg('Backup restored.');
    } catch (e) {
      setMsg((e as Error).message || 'Could not read that file.');
    }
  };

  const eraseAll = async () => {
    if (!confirm('Erase every workout, plan, and setting? This cannot be undone.')) return;
    if (!confirm('Are you sure? Export a backup first if you might want this data.')) return;
    await db.delete();
    location.reload();
  };

  const commitPlates = () => {
    if (platesText == null) return;
    const list = platesText.split(/[\s,]+/).map(Number).filter((n) => n > 0);
    if (list.length) void update(isKg ? { platesKg: list } : { platesLbs: list });
    setPlatesText(null);
  };

  return (
    <Page title="Settings">
      <SectionTitle>Units</SectionTitle>
      <Card className="p-3">
        <Segmented<Unit> value={unit} onChange={(u) => void update({ unit: u })} options={[
          { value: 'lbs', label: 'Pounds (lbs)' }, { value: 'kg', label: 'Kilograms (kg)' },
        ]} />
        <p className="text-label2 text-[13px] mt-2 px-1">Switching converts everything you see. Your saved history is never changed.</p>
      </Card>

      <SectionTitle>Workout</SectionTitle>
      <Card className="overflow-hidden">
        <Row>
          <span className="flex-1">Default rest for new exercises</span>
          <select value={settings.restSec} onChange={(e) => void update({ restSec: Number(e.target.value) })}
            className="bg-card2 rounded-lg px-3 py-1.5 outline-none tabular">
            {[30, 45, 60, 75, 90, 120, 150, 180, 240, 300].map((s) => <option key={s} value={s}>{fmtClock(s)}</option>)}
          </select>
        </Row>
        <div className="px-4 py-3 border-b border-sep/60">
          <div className="mb-2">When swapping an exercise</div>
          <Segmented<SwapMode> value={settings.swapMode ?? 'ask'} onChange={(m) => void update({ swapMode: m })} options={[
            { value: 'ask', label: 'Ask me' }, { value: 'workout', label: 'This workout' }, { value: 'plan', label: 'Update plan' },
          ]} />
          <p className="text-label2 text-[13px] mt-1.5">
            {{
              ask: 'Each time, choose whether the swap is just for today or permanent.',
              workout: 'Swaps only change the current workout. Your saved plans stay the same.',
              plan: 'Swaps also replace the exercise in the saved plan (e.g. Push A) from now on.',
            }[settings.swapMode ?? 'ask']}
          </p>
        </div>
        <Row>
          <span className="flex-1">Bar weight ({unit})</span>
          <NumInput value={isKg ? settings.barKg : settings.barLbs} onCommit={(v) => v != null && v >= 0 && void update(isKg ? { barKg: v } : { barLbs: v })} className="w-20" ariaLabel="Bar weight" />
        </Row>
        <div className="px-4 py-3">
          <div className="mb-1.5">Plates you have ({unit})</div>
          <input
            value={platesText ?? plates.join(', ')}
            onChange={(e) => setPlatesText(e.target.value)}
            onBlur={commitPlates}
            inputMode="decimal"
            className="w-full bg-card2 rounded-lg px-3 py-2 outline-none tabular"
            aria-label="Available plates"
          />
          <p className="text-label2 text-[13px] mt-1.5">Comma-separated. Used by the plate calculator.</p>
        </div>
      </Card>

      <SectionTitle>Backup</SectionTitle>
      <Card className="p-4 space-y-2">
        <p className="text-label2 text-[14px]">Your data lives only on this phone. Export a backup now and then (for example to iCloud Drive via "Save to Files") so you don't lose it if you change phones or clear Safari data.</p>
        <Button className="w-full" onClick={doExport}>Export backup</Button>
        <Button kind="secondary" className="w-full" onClick={() => fileRef.current?.click()}>Restore from backup…</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ''; }} />
        {msg && <p className="text-[14px] text-[#30d158] pt-1" role="status">{msg}</p>}
      </Card>

      <SectionTitle>Install on iPhone</SectionTitle>
      <Card className="p-4 text-[14px] text-label2 space-y-1">
        <p>1. Open this page in <b className="text-white">Safari</b>.</p>
        <p>2. Tap the <b className="text-white">Share</b> button (square with an arrow).</p>
        <p>3. Choose <b className="text-white">Add to Home Screen</b>.</p>
        <p>It then opens full-screen and works without internet.</p>
      </Card>

      <Button kind="danger" className="w-full mt-8" onClick={eraseAll}>Erase all data</Button>
      <p className="text-center text-label2 text-[12px] mt-4">PPL Tracker · v1.0</p>
    </Page>
  );
}
