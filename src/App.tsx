import { useCallback, useEffect, useState } from 'react';
import { useSettings } from './hooks';
import { activeSession } from './actions';
import { TabBar, type Tab } from './components/TabBar';
import { TodayScreen } from './screens/Today';
import { HistoryScreen } from './screens/History';
import { ProgressScreen } from './screens/Progress';
import { PlansScreen } from './screens/Plans';
import { SettingsScreen } from './screens/Settings';
import { WorkoutScreen } from './screens/Workout';

export default function App() {
  const settings = useSettings();
  const [tab, setTab] = useState<Tab>('today');
  const [openSession, setOpenSession] = useState<number | null>(null);

  // Reopen an in-progress workout after the app is closed and relaunched.
  useEffect(() => {
    void activeSession().then((s) => { if (s?.id != null) setOpenSession(s.id); });
  }, []);

  const open = useCallback((id: number) => { setOpenSession(id); window.scrollTo(0, 0); }, []);
  const close = useCallback(() => { setOpenSession(null); window.scrollTo(0, 0); }, []);
  const switchTab = (t: Tab) => { setTab(t); window.scrollTo(0, 0); };

  if (!settings) return <div className="min-h-screen bg-black" />;

  if (openSession != null) return <WorkoutScreen sessionId={openSession} settings={settings} onClose={close} />;

  return (
    <div className="max-w-xl mx-auto">
      {tab === 'today' && <TodayScreen settings={settings} onOpenSession={open} />}
      {tab === 'history' && <HistoryScreen settings={settings} onOpenSession={open} />}
      {tab === 'progress' && <ProgressScreen settings={settings} />}
      {tab === 'plans' && <PlansScreen settings={settings} />}
      {tab === 'settings' && <SettingsScreen settings={settings} />}
      <TabBar tab={tab} onChange={switchTab} />
    </div>
  );
}
