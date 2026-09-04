'use client';

import { useEffect, useState } from 'react';

interface DropCountdownProps {
  endsAt: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO_TIME: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function calculateTimeLeft(endsAt: string): TimeLeft {
  const difference = new Date(endsAt).getTime() - Date.now();

  if (difference <= 0) {
    return ZERO_TIME;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function DropCountdown({ endsAt }: DropCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(endsAt));

    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(endsAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [endsAt]);

  const items = [
    { value: timeLeft.days, label: 'DIAS' },
    { value: timeLeft.hours, label: 'HORAS' },
    { value: timeLeft.minutes, label: 'MINUTOS' },
    { value: timeLeft.seconds, label: 'SEGUNDOS' },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-6 sm:px-8">
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
        Edição 01 termina em
      </p>

      <div className="flex items-start justify-center gap-3 sm:gap-6">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-start gap-3 sm:gap-6">
            <div className="min-w-[54px] text-center sm:min-w-[72px]">
              <div className="text-3xl font-bold tabular-nums text-white sm:text-5xl">
                {mounted ? String(item.value).padStart(2, '0') : '--'}
              </div>

              <div className="mt-2 text-[9px] font-medium tracking-[0.16em] text-white/45 sm:text-[10px]">
                {item.label}
              </div>
            </div>

            {index < items.length - 1 && (
              <span className="mt-1 text-2xl font-light text-white/25 sm:text-4xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}