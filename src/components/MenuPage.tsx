import React from 'react';
import { motion } from 'motion/react';
import { Store, User, Plus, History, ChevronRight, ArrowLeft, Share2 } from 'lucide-react';
import { StaffSummary } from '../types';

interface MenuPageProps {
  staff: StaffSummary | null;
  onResume: () => void;
  onNew: () => void;
  onHistory: () => void;
  onExport: () => void;
  onBack: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ staff, onResume, onNew, onHistory, onExport, onBack }) => {
  if (!staff) return null;
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-blue-900 p-8 text-center text-white relative">
          <button onClick={onBack} className="absolute left-4 top-4 hover:bg-blue-800 p-2 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">{staff.name}</h2>
          <p className="text-blue-200 text-sm flex items-center justify-center gap-1 mt-1 font-medium">
            <Store size={14} /> {staff.store}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <button onClick={onResume} className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 border border-gray-100 rounded-xl transition-all group active:scale-98">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">評価を再開する</h3>
              <p className="text-xs text-gray-500">保存された評価データを編集します</p>
            </div>
            <ChevronRight className="ml-auto text-gray-300" />
          </button>

          <button onClick={onNew} className="w-full flex items-center gap-4 p-4 hover:bg-green-50 border border-gray-100 rounded-xl transition-all group active:scale-98">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Plus size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">新しく評価を作成</h3>
              <p className="text-xs text-gray-500">新しい月の評価データを開始します</p>
            </div>
            <ChevronRight className="ml-auto text-gray-300" />
          </button>

          <button onClick={onHistory} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all group active:scale-98">
            <div className="bg-gray-100 text-gray-600 p-3 rounded-lg group-hover:bg-gray-800 group-hover:text-white transition-colors">
              <History size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">履歴を確認する</h3>
              <p className="text-xs text-gray-500">これまでの評価記録の一覧を表示します</p>
            </div>
            <ChevronRight className="ml-auto text-gray-300" />
          </button>

          <button onClick={onExport} className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 border border-dotted border-blue-200 rounded-xl transition-all group active:scale-98">
            <div className="bg-blue-50 text-blue-500 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Share2 size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-blue-600">共有コードを発行</h3>
              <p className="text-xs text-gray-500">このスタッフのデータを他の評価者に送る</p>
            </div>
            <ChevronRight className="ml-auto text-blue-300" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
