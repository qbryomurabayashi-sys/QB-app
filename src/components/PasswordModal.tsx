import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onUnlock }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ammd') {
      onUnlock();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-serif">
          {/* Backdrop with Mist Effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          >
            <div className="mist-container opacity-30">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="mist-particle" style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  width: `${100 + Math.random() * 200}px`,
                  height: `${100 + Math.random() * 200}px`,
                }} />
              ))}
            </div>
          </motion.div>

          {/* Modal Window */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="ff-window p-10 w-full max-w-md relative z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10 border-b border-ff-silver/20 pb-6">
              <div className="flex items-center gap-4">
                <ShieldAlert className="text-ff-gold animate-pulse" size={28} />
                <h3 className="text-lg font-display font-bold text-ff-gold uppercase tracking-[0.2em]">指揮官権限の行使</h3>
              </div>
              <button onClick={onClose} className="text-ff-silver/40 hover:text-ff-gold transition-colors relative group">
                <span className="ff-cursor !-left-10 !top-0"></span>
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-display font-bold text-ff-silver/60 mb-4 uppercase tracking-widest">王家の紋章（合言葉）</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className={`w-full bg-black/60 border-2 p-5 text-center text-2xl font-display tracking-[0.5em] outline-none transition-all rounded-sm ${error ? 'border-ff-red text-ff-red shadow-[0_0_20px_rgba(255,51,51,0.4)]' : 'border-ff-silver/20 text-ff-gold focus:border-ff-gold'}`}
                    placeholder="••••"
                    autoFocus
                  />
                  {error && (
                    <motion.p 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-ff-red text-xs mt-4 uppercase font-display tracking-widest text-center italic"
                    >
                      「その紋章は、あなたの血筋を認めていません。」
                    </motion.p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="ff-button w-full py-5 text-lg uppercase tracking-[0.3em] font-display font-bold relative group"
              >
                <span className="ff-cursor !-left-14 !top-1/2 !-translate-y-1/2"></span>
                コマンドを実行
              </button>
            </form>

            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ff-gold/20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ff-gold/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ff-gold/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ff-gold/20 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
