import React from 'react';
import { Bell } from 'lucide-react';

interface ScheduleAlertProps {
  date: string;
}

export const ScheduleAlert: React.FC<ScheduleAlertProps> = ({ date }) => {
  const month = new Date(date).getMonth() + 1;
  let alert: { title: string; text: string; type: 'info' | 'warn' } | null = null;

  if (month === 7) alert = { title: "期初", text: "第4四半期評価 / 期末評価", type: "info" };
  else if (month === 10) alert = { title: "第1四半期", text: "第1四半期評価", type: "info" };
  else if (month === 1) alert = { title: "第2四半期", text: "第2四半期評価", type: "info" };
  else if (month === 4) alert = { title: "第3四半期", text: "第3四半期評価", type: "info" };
  else if (month === 6) alert = { title: "期末", text: "次期目標設定", type: "warn" };

  if (!alert) return null;

  const bgClass = alert.type === 'warn' ? 'bg-terminal-red/10 border-terminal-red text-terminal-red' : 'bg-terminal-orange/10 border-terminal-orange text-terminal-orange';
  const iconClass = alert.type === 'warn' ? 'text-terminal-red' : 'text-terminal-orange';

  return (
    <div className={`mx-3 sm:mx-5 mt-4 p-3 border flex items-start gap-3 shadow-[0_0_10px_rgba(242,125,38,0.2)] ${bgClass} print:hidden font-mono`}>
      <Bell className={`shrink-0 mt-0.5 ${iconClass} animate-pulse`} size={20} />
      <div>
        <div className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
          <span>CYCLE_{month}: {alert.title}</span>
        </div>
        <div className="text-[10px] font-bold mt-1 uppercase">
          {alert.text} <span className="font-normal opacity-70">_REQUIRED. INITIALIZE_INTERVIEW_PROTOCOL.</span>
        </div>
      </div>
    </div>
  );
};
