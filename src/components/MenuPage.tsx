import React from 'react';
import { motion } from 'motion/react';
import { Store, User, Plus, History, ChevronRight, ArrowLeft } from 'lucide-react';
import { StaffSummary } from '../types';

interface MenuPageProps {
  staff: StaffSummary | null;
  onResume: () => void;
  onNew: () => void;
  onHistory: () => void;
  onBack: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ staff, onResume, onNew, onHistory, onBack }) => {
  if (!staff) return null;
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-serif relative overflow-hidden">
      {/* Mist Background */}
      <div className="mist-container">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mist-particle" style={{ width: '400px', height: '400px', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 3}s` }} />
        ))}
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ff-window max-w-md w-full overflow-hidden shadow-2xl z-10"
      >
        <div className="bg-gradient-to-b from-blue-800 to-black p-10 text-center relative border-b-2 border-ff-silver/30">
          <button onClick={onBack} className="absolute left-6 top-6 text-ff-silver hover:text-white p-2 transition-colors group">
            <span className="ff-cursor"></span>
            <ArrowLeft size={32} />
          </button>
          
          <div className="mt-6">
            <div className="ff-avatar-frame inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center text-ff-gold text-4xl font-display font-bold">
                {staff.name?.charAt(0) || '?'}
              </div>
            </div>
            <h2 className="text-4xl font-display font-bold mb-3 uppercase tracking-[0.2em] text-white">{staff.name}</h2>
            <p className="text-ff-gold text-lg flex items-center justify-center gap-3 uppercase tracking-widest italic">
              <Store size={20} /> {staff.store}
            </p>
          </div>
        </div>

        <div className="p-10 space-y-8 bg-black/40 backdrop-blur-md">
          <button onClick={onResume} className="w-full ff-button !p-6 flex items-center gap-8 group relative">
            <span className="ff-cursor"></span>
            <div className="bg-ff-gold/20 text-ff-gold p-4 rounded-full border border-ff-gold/30">
              <User size={36} />
            </div>
            <div className="text-left">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest text-white">記録を再開</h3>
              <p className="text-xs text-ff-silver/60 italic uppercase">現在の旅を続けます</p>
            </div>
            <ChevronRight className="ml-auto text-ff-gold" />
          </button>

          <button onClick={onNew} className="w-full ff-button !p-6 flex items-center gap-8 group relative !from-emerald-900 !to-black !border-ff-emerald">
            <span className="ff-cursor"></span>
            <div className="bg-ff-emerald/20 text-ff-emerald p-4 rounded-full border border-ff-emerald/30">
              <Plus size={36} />
            </div>
            <div className="text-left">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest text-ff-emerald">新規召喚</h3>
              <p className="text-xs text-ff-emerald/60 italic uppercase">新しい冒険を始めます</p>
            </div>
            <ChevronRight className="ml-auto text-ff-emerald" />
          </button>

          <button onClick={onHistory} className="w-full ff-button !p-6 flex items-center gap-8 group relative !from-blue-950 !to-black">
            <span className="ff-cursor"></span>
            <div className="bg-ff-sky/20 text-ff-sky p-4 rounded-full border border-ff-sky/30">
              <History size={36} />
            </div>
            <div className="text-left">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest text-ff-sky">過去の記録</h3>
              <p className="text-xs text-ff-sky/60 italic uppercase">過去の伝説を振り返ります</p>
            </div>
            <ChevronRight className="ml-auto text-ff-sky" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
