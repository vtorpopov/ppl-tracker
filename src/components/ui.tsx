import { useEffect, useState, type ReactNode } from 'react';

export function Page({ title, subtitle, right, children }: {
  title: string; subtitle?: string; right?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="pt-safe px-4 pb-32 min-h-screen">
      <header className="flex items-end justify-between pt-6 pb-4">
        <div>
          {subtitle && <div className="text-label2 text-[13px] font-semibold uppercase tracking-wide">{subtitle}</div>}
          <h1 className="text-[34px] font-bold leading-tight tracking-tight">{title}</h1>
        </div>
        {right}
      </header>
      {children}
    </div>
  );
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const cls = `bg-card rounded-2xl ${className}`;
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} block w-full text-left active:opacity-70 transition-opacity`}>
      {children}
    </button>
  ) : (
    <div className={cls}>{children}</div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mt-7 mb-2 px-1">
      <h2 className="text-[20px] font-bold">{children}</h2>
      {right}
    </div>
  );
}

export function Row({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const cls = `flex items-center gap-3 px-4 min-h-[48px] py-2.5 border-b border-sep/60 last:border-b-0 ${className}`;
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} w-full text-left active:bg-card2`}>{children}</button>
  ) : (
    <div className={cls}>{children}</div>
  );
}

export function Chevron() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" className="text-label2 shrink-0" aria-hidden>
      <path d="M1.5 1.5 6.5 6.5 1.5 11.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type BtnKind = 'primary' | 'secondary' | 'danger' | 'plain';
const btnKinds: Record<BtnKind, string> = {
  primary: 'bg-accent text-white',
  secondary: 'bg-card2 text-white',
  danger: 'bg-card2 text-[#ff453a]',
  plain: 'text-accent',
};

export function Button({ children, onClick, kind = 'primary', className = '', disabled, type = 'button' }: {
  children: ReactNode; onClick?: () => void; kind?: BtnKind; className?: string; disabled?: boolean; type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl font-semibold px-4 py-3 active:opacity-70 transition-opacity disabled:opacity-40 ${btnKinds[kind]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 anim-fade" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative bg-[#1c1c1e] rounded-t-3xl max-h-[88vh] flex flex-col anim-sheet pb-safe">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-sep/60">
          <h3 className="text-[17px] font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-accent font-semibold px-1 py-1" aria-label="Close">Done</button>
        </div>
        <div className="overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex bg-card2 rounded-[9px] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-[7px] py-1.5 text-[14px] font-semibold transition-colors ${value === o.value ? 'bg-[#636366] text-white' : 'text-label2'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Number input that keeps its own text while focused, so typing "102." or
 * clearing the field isn't fought by re-formatting. Empty commits as null.
 */
export function NumInput({ value, onCommit, placeholder, className = '', step = 'any', ariaLabel }: {
  value: number | null; onCommit: (v: number | null) => void; placeholder?: string; className?: string; step?: string; ariaLabel?: string;
}) {
  const [text, setText] = useState(value == null ? '' : String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(value == null ? '' : String(value));
  }, [value, focused]);
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      aria-label={ariaLabel}
      value={text}
      placeholder={placeholder}
      onFocus={(e) => { setFocused(true); e.currentTarget.select(); }}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        setText(e.target.value);
        const n = parseFloat(e.target.value);
        onCommit(e.target.value.trim() === '' || Number.isNaN(n) ? null : n);
      }}
      className={`min-w-0 bg-card2 rounded-lg text-center py-2 outline-none focus:ring-2 focus:ring-accent tabular placeholder:text-[#636366] ${className}`}
    />
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="text-label2 text-center py-10 px-6 text-[15px]">{children}</div>;
}
