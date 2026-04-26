import React from 'react';
import { X, Lock } from 'lucide-react';
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white p-8 w-full max-w-sm relative z-10 rounded-2xl shadow-2xl border"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Lock className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800">権限ロックの解除</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tight">パスワードを入力してください</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  className={`w-full bg-gray-50 border-2 p-3 text-center text-xl font-bold tracking-widest outline-none transition-all rounded-xl ${error ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-blue-500'}`}
                  placeholder="••••"
                  autoFocus
                />
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-[10px] mt-2 font-bold text-center"
                  >
                    パスワードが正しくありません。
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
              >
                解除する
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
