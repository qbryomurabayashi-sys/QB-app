import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CyberLoading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING SYSTEM...');
  
  const statusMessages = [
    'CONNECTING TO DATABASE...',
    'LOADING STAFF PROFILES...',
    'CALIBRATING ANALYTICS ENGINE...',
    'DECRYPTING SECURITY PROTOCOLS...',
    'OPTIMIZING NEURAL INTERFACE...',
    'SYSTEM READY.'
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(newProgress);

      const messageIndex = Math.floor((newProgress / 100) * statusMessages.length);
      if (messageIndex < statusMessages.length) {
        setStatus(statusMessages[messageIndex]);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-mono"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #00f2ff 1px, transparent 1px), linear-gradient(to bottom, #00f2ff 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Scanning Line */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-20 w-full z-10"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Container */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-8">
        {/* Logo/Icon Animation */}
        <motion.div 
          className="mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 border-4 border-cyan-500 rounded-lg flex items-center justify-center relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-cyan-500/20"
              animate={{ height: [`${progress}%`, `${progress}%`] }}
            />
            <span className="text-4xl font-black text-cyan-500 z-10">QB</span>
          </div>
          {/* Glitch circles */}
          <motion.div 
            className="absolute -top-2 -left-2 w-28 h-28 border border-magenta-500 rounded-lg opacity-50"
            animate={{ x: [-2, 2, -2], y: [2, -2, 2] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            style={{ borderColor: '#ff00ff' }}
          />
        </motion.div>

        {/* Progress Text */}
        <div className="w-full mb-2 flex justify-between items-end">
          <motion.span 
            className="text-cyan-400 text-xs tracking-widest uppercase"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {status}
          </motion.span>
          <span className="text-cyan-500 text-2xl font-bold italic">
            {progress}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-4 bg-gray-900 border border-cyan-900 rounded-sm overflow-hidden relative">
          {/* Segments */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-black/50" />
            ))}
          </div>
          
          {/* Active Progress */}
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 grid grid-cols-3 gap-4 w-full opacity-50">
          <div className="h-1 bg-cyan-900 rounded-full overflow-hidden">
            <motion.div className="h-full bg-cyan-500" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
          <div className="h-1 bg-cyan-900 rounded-full overflow-hidden">
            <motion.div className="h-full bg-cyan-500" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
          </div>
          <div className="h-1 bg-cyan-900 rounded-full overflow-hidden">
            <motion.div className="h-full bg-cyan-500" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
          </div>
        </div>

        {/* Random Data Stream */}
        <div className="mt-12 text-[8px] text-cyan-800 w-full overflow-hidden h-12 flex flex-wrap gap-1">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
            >
              {Math.random().toString(16).substring(2, 8).toUpperCase()}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </motion.div>
  );
};
