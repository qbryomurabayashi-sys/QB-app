import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, User, Plus, Trash2, History, ChevronRight, Upload, Download, Layers, BookOpen, Menu, X, HelpCircle, Info, ArrowLeft } from 'lucide-react';
import { StaffSummary } from '../types';

interface TopPageProps {
  staffList: StaffSummary[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onBatchPrint: () => void;
  onActionPlan: () => void;
  onVersionInfo: () => void;
  onOperationGuide: () => void;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackToDashboard: () => void;
}

export const TopPage: React.FC<TopPageProps> = ({ 
  staffList, onSelect, onCreate, onDelete, onBatchPrint, onActionPlan, 
  onVersionInfo, onOperationGuide, onBackup, onRestore, onBackToDashboard
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const uniqueStaffList = React.useMemo(() => {
    const seen = new Set();
    return staffList.filter(staff => {
      const key = `${staff.store}_${staff.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [staffList]);

  return (
    <div className="min-h-screen bg-black flex flex-col font-serif relative overflow-hidden">
      {/* Mist Background */}
      <div className="mist-container">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="mist-particle" style={{ width: '400px', height: '400px', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 3}s` }} />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 p-4">
        <div className="ff-window max-w-5xl mx-auto flex justify-between items-center !py-3">
          <div className="flex items-center gap-4 group">
            <button onClick={onBackToDashboard} className="relative p-2 text-ff-silver hover:text-white transition-colors">
              <span className="ff-cursor"></span>
              <ArrowLeft size={28} />
            </button>
            <Store className="text-ff-gold" size={32} />
            <h1 className="text-2xl font-display font-bold tracking-[0.2em] text-ff-gold uppercase">ワールドマップ</h1>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="relative p-2 text-ff-silver hover:text-white transition-colors group"
          >
            <span className="ff-cursor"></span>
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-96 ff-window !border-r-0 !border-y-0 h-full flex flex-col ml-auto p-6"
            >
              <div className="p-4 border-b border-ff-silver/20 flex justify-between items-center mb-6">
                <h2 className="text-ff-gold font-display font-bold uppercase tracking-widest text-xl">コマンドメニュー</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-ff-silver hover:text-white group relative">
                  <span className="ff-cursor"></span>
                  <X size={32} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-ff-silver/50 uppercase tracking-widest px-2">戦略ツール</p>
                  <button onClick={() => { onActionPlan(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-ff-silver hover:text-white transition-all group relative text-lg">
                    <span className="ff-cursor"></span>
                    <BookOpen size={24} className="text-ff-gold" /> 
                    <span className="font-display tracking-wider">アクションプラン</span>
                  </button>
                  <button onClick={() => { onBatchPrint(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-ff-silver hover:text-white transition-all group relative text-lg">
                    <span className="ff-cursor"></span>
                    <Layers size={24} className="text-ff-gold" /> 
                    <span className="font-display tracking-wider">一括印刷</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-ff-silver/50 uppercase tracking-widest px-2">ギルドアーカイブ</p>
                  <button onClick={() => { onBackup(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-ff-silver hover:text-white transition-all group relative text-lg">
                    <span className="ff-cursor"></span>
                    <Download size={24} className="text-ff-gold" /> 
                    <span className="font-display tracking-wider">クリスタルへ保存</span>
                  </button>
                  <label className="w-full flex items-center gap-4 px-4 py-4 text-ff-silver hover:text-white transition-all group relative cursor-pointer text-lg">
                    <span className="ff-cursor"></span>
                    <Upload size={24} className="text-ff-gold" /> 
                    <span className="font-display tracking-wider">クリスタルから読込</span>
                    <input type="file" accept=".json" className="hidden" onChange={(e) => { onRestore(e); setIsMenuOpen(false); }} />
                  </label>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-ff-silver/50 uppercase tracking-widest px-2">知識の書</p>
                  <button onClick={() => { onOperationGuide(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-ff-silver hover:text-white transition-all group relative text-lg">
                    <span className="ff-cursor"></span>
                    <HelpCircle size={24} className="text-ff-gold" /> 
                    <span className="font-display tracking-wider">操作ガイド</span>
                  </button>
                  <button onClick={() => { onVersionInfo(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-ff-silver hover:text-white transition-all group relative text-lg">
                    <span className="ff-cursor"></span>
                    <Info size={24} className="text-ff-gold" /> 
                    <span className="font-display tracking-wider">バージョン情報</span>
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-ff-silver/20 text-center text-xs text-ff-silver/40 font-display tracking-widest">
                FINAL_EVALUATION_IX v9.0.0
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex-grow z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6 border-b-4 border-ff-gold/30 pb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-ff-gold tracking-[0.1em] uppercase">英雄の名簿</h2>
            <p className="text-ff-silver/60 text-lg mt-3 italic">仲間を選択してその軌跡を確認するか、新たな英雄を召喚してください。</p>
          </div>
          <button
            onClick={onCreate}
            className="ff-button !py-5 !px-10 flex items-center gap-4 group"
          >
            <span className="ff-cursor"></span>
            <Plus size={32} className="text-ff-gold" /> 
            <span className="text-xl">新たな英雄を召喚</span>
          </button>
        </div>

        {uniqueStaffList.length === 0 ? (
          <div className="ff-window p-20 text-center">
            <div className="w-32 h-32 rounded-full border-4 border-ff-gold flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-ff-gold/20 to-transparent">
              <User size={64} className="text-ff-gold/50" />
            </div>
            <h3 className="text-3xl font-display font-bold text-ff-gold mb-6 uppercase tracking-[0.2em]">名簿は空です</h3>
            <p className="text-ff-silver/60 text-xl italic">「クリスタルは、未来を切り拓く者たちの名を待っています。」</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {uniqueStaffList.map((staff) => (
              <motion.div
                key={staff.id}
                onClick={() => onSelect(staff.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ff-window group cursor-pointer transition-all !p-0 overflow-hidden"
              >
                <div className="p-5 bg-gradient-to-r from-ff-blue-top to-transparent flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="ff-avatar-frame !p-1">
                      <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-ff-gold font-display font-bold text-xl">
                        {staff.name?.charAt(0) || '?'}
                      </div>
                    </div>
                    <div className="text-ff-gold text-xs font-display font-bold tracking-widest uppercase">
                      LV. 99 {staff.store || '放浪者'}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(staff.id); }}
                    className="text-ff-silver/40 hover:text-ff-gold p-2 transition-colors relative group/btn"
                    title="解放"
                  >
                    <span className="ff-cursor !-left-8"></span>
                    <Trash2 size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-6 truncate uppercase tracking-widest flex items-center gap-4">
                    <span className="ff-cursor !static !opacity-100 !translate-y-0 group-hover:animate-pulse"></span>
                    {staff.name || '名もなき英雄'}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-display text-ff-silver/60 uppercase">
                      <span>HP</span>
                      <span className="text-ff-silver">9999 / 9999</span>
                    </div>
                    <div className="ff-gauge-bg h-4">
                      <div className="ff-gauge-fill w-full" />
                    </div>
                    <div className="flex justify-between text-xs font-display text-ff-silver/60 uppercase">
                      <span>MP</span>
                      <span className="text-ff-sky">999 / 999</span>
                    </div>
                    <div className="ff-gauge-bg h-4">
                      <div className="ff-gauge-fill w-full !bg-ff-sky" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border-t border-ff-silver/10 flex items-center gap-3 text-xs font-display text-ff-silver/40 uppercase tracking-tighter">
                  <History size={16} />
                  <span>最終記録: {new Date(staff.updatedAt).toLocaleString('ja-JP')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
