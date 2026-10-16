export type Tab = 'today' | 'history' | 'progress' | 'plans' | 'settings';

const icons: Record<Tab, JSX.Element> = {
  today: <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />,
  history: <path d="M4 7h16M4 12h16M4 17h10" />,
  progress: <path d="M4 19 9.5 12l4 3.5L20 6M15 6h5v5" />,
  plans: <path d="M6.5 7.5v9m11-9v9M3 10v4m18-4v4M6.5 12h11" />,
  settings: <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7.4 3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 3h-4L10 5.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z" />,
};

const labels: Record<Tab, string> = {
  today: 'Today', history: 'History', progress: 'Progress', plans: 'Plans', settings: 'Settings',
};

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#121212]/90 backdrop-blur-xl border-t border-sep/70 pb-safe">
      <div className="flex max-w-xl mx-auto">
        {(Object.keys(labels) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1 text-[10px] font-medium ${tab === t ? 'text-accent' : 'text-label2'}`}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {icons[t]}
            </svg>
            {labels[t]}
          </button>
        ))}
      </div>
    </nav>
  );
}
