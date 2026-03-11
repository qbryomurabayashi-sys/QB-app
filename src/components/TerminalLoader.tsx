import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const TerminalLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const systemLogs = [
    "A.D. 2300 SYSTEM BOOT...",
    "CHECKING POWER CELLS... 12%",
    "WARNING: LOW ENERGY DETECTED",
    "INITIALIZING MOTHER BRAIN INTERFACE...",
    "LOADING DOME_DATA.DAT...",
    "RESTORING BACKUP_PROTOCOLS...",
    "BYPASSING SECURITY LOCKS...",
    "SYSTEM READY. WELCOME TO THE FUTURE."
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(newProgress);

      const logIndex = Math.floor((newProgress / 100) * systemLogs.length);
      if (logIndex < systemLogs.length) {
        setLogs(systemLogs.slice(0, logIndex + 1));
      }

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // CRT Collapse transition
  const crtVariants = {
    initial: { scaleY: 1, scaleX: 1, opacity: 1 },
    exit: { 
      scaleY: [1, 0.01, 0], 
      scaleX: [1, 1.2, 0],
      opacity: [1, 1, 0],
      transition: { 
        duration: 0.4, 
        times: [0, 0.8, 1],
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-mono p-8"
      variants={crtVariants}
      initial="initial"
      exit="exit"
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <div className="w-full max-w-xl border-2 border-terminal-rust p-6 bg-black relative">
        <div className="absolute -top-3 left-4 bg-terminal-rust px-2 text-[10px] text-terminal-orange">
          SYSTEM_BOOT_SEQUENCE
        </div>

        {/* Logs */}
        <div className="h-48 overflow-hidden mb-6 text-sm text-terminal-green">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className="mb-1"
            >
              {"> "} {log}
            </motion.div>
          ))}
          <motion.span 
            animate={{ opacity: [1, 0] }} 
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-terminal-green ml-1"
          />
        </div>

        {/* ASCII Progress Bar */}
        <div className="mb-2 flex justify-between text-xs text-terminal-orange">
          <span>LOADING_CORE_MODULES</span>
          <span>{progress}%</span>
        </div>
        <div className="border border-terminal-rust p-1">
          <div className="flex gap-1">
            {Array.from({ length: 20 }).map((_, i) => {
              const isActive = i < (progress / 5);
              return (
                <div 
                  key={i} 
                  className={`h-4 flex-1 ${isActive ? 'bg-terminal-green shadow-[0_0_10px_#39FF14]' : 'bg-terminal-rust/20'}`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-[10px] text-terminal-rust flex justify-between italic">
          <span>SECTOR_7_DOME_OS</span>
          <span>EST_TIME: 00:0{Math.max(0, 3 - Math.floor(progress/33))}S</span>
        </div>
      </div>

      {/* CRT Flicker Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-40 bg-white/5"
        animate={{ opacity: [0, 0.05, 0, 0.1, 0] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />
    </motion.div>
  );
};
