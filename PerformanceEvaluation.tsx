import React, { useState } from 'react';
import { Store, User, Plus, Trash2, History, ChevronRight, Upload, Download, Layers, BookOpen, Menu, X, HelpCircle, Info } from 'lucide-react';
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
}

export const TopPage: React.FC<TopPageProps> = ({ 
  staffList, onSelect, onCreate, onDelete, onBatchPrint, onActionPlan, 
  onVersionInfo, onOperationGuide, onBackup, onRestore 
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
      {/* Header with Hamburger */}
      <header className="bg-[#00205b] text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Store className="text-blue-400" size={28} />
            <h1 className="text-xl font-bold">QB総合ツール</h1>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-[#00205b] text-white flex justify-between items-center">
              <h2 className="font-bold">メニュー</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">ツール</div>
              <button onClick={() => { onActionPlan(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BookOpen size={18} className="text-indigo-600" /> アクションプラン作成
              </button>
              <button onClick={() => { onBatchPrint(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Layers size={18} className="text-blue-600" /> 全員分を一括印刷
              </button>

              <div className="px-3 py-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">データ管理</div>
              <button onClick={() => { onBackup(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={18} className="text-green-600" /> バックアップ保存
              </button>
              <label className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Upload size={18} className="text-orange-600" /> 復元 (JSON)
                <input type="file" accept=".json" className="hidden" onChange={(e) => { onRestore(e); setIsMenuOpen(false); }} />
              </label>

              <div className="px-3 py-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">情報</div>
              <button onClick={() => { onOperationGuide(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle size={18} className="text-blue-500" /> 総合操作説明
              </button>
              <button onClick={() => { onVersionInfo(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Info size={18} className="text-gray-500" /> バージョン情報
              </button>
            </div>

            <div className="p-4 border-t text-center text-[10px] text-gray-400">
              QB総合ツール v2.1.0
            </div>
          </div>
        </div>
      )}

      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">スタッフ評価一覧</h2>
            <p className="text-gray-500 mt-1">評価を入力するスタッフを選択、または新規作成してください。</p>
          </div>
          <button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
          >
            <Plus size={24} /> 新規評価を作成
          </button>
        </div>

        {uniqueStaffList.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">評価データがありません</h3>
            <p className="text-gray-500 mb-6">「新規評価を作成」ボタンから新しいスタッフの評価を開始してください。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {uniqueStaffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => onSelect(staff.id)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>

                <div className="flex justify-between items-start mb-3">
                  <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Store size={12} /> {staff.store || '店舗未入力'}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(staff.id); }}
                    className="text-gray-300 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {staff.name || '名称未設定'}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-3 mt-2">
                  <History size={12} />
                  <span>最終更新: {new Date(staff.updatedAt).toLocaleString('ja-JP')}</span>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
