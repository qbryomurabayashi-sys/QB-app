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
  onImportRequest: () => void;
  onBackToDashboard: () => void;
}

export const TopPage: React.FC<TopPageProps> = ({ 
  staffList, onSelect, onCreate, onDelete, onBatchPrint, onActionPlan, 
  onVersionInfo, onOperationGuide, onBackup, onRestore, onImportRequest, onBackToDashboard
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Store size={28} />
            <h1 className="text-xl font-bold tracking-tight">QB評価システム</h1>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 w-80 h-full z-[101] bg-white shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-gray-700">メニュー</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 space-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 px-2 mb-2">評価ツール</p>
                  <button onClick={() => { onActionPlan(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                    <BookOpen size={20} /> 
                    <span>店長アクションプラン</span>
                  </button>
                  <button onClick={() => { onBatchPrint(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                    <Layers size={20} /> 
                    <span>一括印刷</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 px-2 mb-2">データ管理</p>
                  <button onClick={() => { onImportRequest(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                    <Upload size={20} className="text-green-600" /> 
                    <span>共有コードから読込</span>
                  </button>
                  <button onClick={() => { onBackup(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                    <Download size={20} /> 
                    <span>バックアップ出力</span>
                  </button>
                  <label className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all cursor-pointer">
                    <Upload size={20} /> 
                    <span>バックアップ読込</span>
                    <input type="file" accept=".json" className="hidden" onChange={(e) => { onRestore(e); setIsMenuOpen(false); }} />
                  </label>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 px-2 mb-2">サポート</p>
                  <button onClick={() => { onOperationGuide(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                    <HelpCircle size={20} /> 
                    <span>操作マニュアル</span>
                  </button>
                  <button onClick={() => { onVersionInfo(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                    <Info size={20} /> 
                    <span>バージョン情報</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border-t text-center text-xs text-gray-400">
                &copy; QB Evaluation Tool v9.0.0
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">スタッフ一覧</h2>
            <p className="text-gray-500 text-sm mt-1">評価を行うスタッフを選択してください。</p>
          </div>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Plus size={20} /> 
            <span>新規スタッフ登録</span>
          </button>
        </div>

        {uniqueStaffList.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">データが見つかりません</h3>
            <p className="text-gray-500">右上のボタンから新規記録を作成してください。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueStaffList.map((staff) => (
              <motion.div
                key={staff.id}
                onClick={() => onSelect(staff.id)}
                whileHover={{ y: -4 }}
                className="bg-white border rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {staff.name?.charAt(0) || '?'}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(staff.id); }}
                    className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {staff.name || '名称未設定'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{staff.store || '店舗未設定'}</p>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                  <History size={14} />
                  <span>最終更新: {new Date(staff.updatedAt).toLocaleDateString()}</span>
                  <div className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[8px]">
                    記録を見る
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
