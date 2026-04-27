import React, { useState, useEffect } from 'react';
import { UPDATES } from './VersionInfo';
import { X, Zap, Calendar, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LAST_SEEN_VERSION_KEY = 'last_seen_update_version';

export const UpdatePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const latestUpdate = UPDATES[0];
    if (!latestUpdate) return;

    // Check if 1 month has passed since the update date
    const updateDate = new Date(latestUpdate.date);
    const oneMonthLater = new Date(updateDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const now = new Date();
    if (now > oneMonthLater) {
      // 1 month has passed, don't show
      return;
    }

    const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    if (lastSeenVersion !== latestUpdate.version) {
      // Small delay to prevent sudden popup flicker
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDoNotShowAgain = () => {
    const latestUpdate = UPDATES[0];
    localStorage.setItem(LAST_SEEN_VERSION_KEY, latestUpdate.version);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  // 今回（v2.6.0）のみ過去3バージョンを表示、次回以降は最新のみ表示
  const updatesToShow = UPDATES[0]?.version === '2.6.0' ? UPDATES.slice(0, 3) : UPDATES.slice(0, 1);
  const latestUpdate = updatesToShow[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 font-bold">
              <Bell size={20} />
              <span>アップデート情報</span>
            </div>
            <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-0 overflow-y-auto w-full">
            {updatesToShow.map((update, idx) => (
              <div key={update.version} className={`p-6 ${idx > 0 ? 'border-t border-gray-100 bg-gray-50/30' : ''}`}>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-bold">
                  v{update.version}
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {update.title}
                  {idx === 0 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">最新</span>}
                </h2>
                <ul className="space-y-4">
                  {update.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <Zap size={16} className="mt-0.5 text-blue-500 shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t bg-gray-50 p-4 flex gap-3 shrink-0">
            <button
              onClick={handleDoNotShowAgain}
              className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              今後は表示しない
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
