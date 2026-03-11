import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FANTASY_PHRASES = [
  "クリスタルの導きを待っています...",
  "物語のページをめくっています...",
  "霧の向こう側へ進んでいます...",
  "飛空艇のエンジンを調整中...",
  "モーグリが手紙を運んでいます...",
  "古の記憶を呼び覚ましています...",
];

export const FantasyLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);

    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % FANTASY_PHRASES.length);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-serif"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: 1.5, ease: "easeInOut" }
      }}
    >
      {/* Mist Particles */}
      <div className="mist-container">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="mist-particle"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating Crystal */}
      <div className="relative mb-12">
        <motion.div
          className="w-32 h-48 bg-ff-sky/30 relative"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            boxShadow: "0 0 50px rgba(135, 206, 235, 0.5)",
          }}
          animate={{
            rotateY: 360,
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-ff-sky/50 to-transparent" />
        </motion.div>
        
        {/* Crystal Glow */}
        <motion.div
          className="absolute inset-0 bg-ff-sky/20 blur-2xl rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Airship Progress */}
      <div className="w-full max-w-md px-8 relative">
        <div className="h-1 bg-ff-silver/20 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-ff-gold shadow-[0_0_10px_#D4AF37]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Airship Icon */}
        <motion.div
          className="absolute -top-6 text-2xl"
          style={{ left: `calc(${progress}% - 12px)` }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🚢
        </motion.div>
      </div>

      {/* Loading Text */}
      <div className="mt-16 text-center">
        <motion.h2
          className="text-4xl font-display text-ff-silver mb-6 tracking-[0.2em]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          NOW LOADING...
        </motion.h2>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIndex}
            className="text-ff-gold italic text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {FANTASY_PHRASES[phraseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Percentage */}
      <div className="mt-6 text-ff-silver/50 text-lg font-display">
        {progress}%
      </div>
    </motion.div>
  );
};
