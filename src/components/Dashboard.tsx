import React, { useState } from 'react';
import { ClipboardList, MessageSquare, Users, AlertCircle, CheckCircle2, Clock, ChevronRight, Store, Menu, X, BookOpen, HelpCircle, Info, Download, Upload } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: 'EVALUATION_LIST' | 'INTERVIEW_RECORD' | 'STAFF_LIST' | 'ACTION_PLAN' | 'VERSION_INFO' | 'OPERATION_GUIDE') => void;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onBackup, onRestore }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tasks = [
    { id: 1, title: '次回対応が必要な面談', count: 2, type: 'warning', icon: Clock },
    { id: 2, title: '上長フォローが必要な案件', count: 1, type: 'alert', icon: AlertCircle },
  ];

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
              <button onClick={() => { onNavigate('ACTION_PLAN'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BookOpen size={18} className="text-indigo-600" /> アクションプラン作成
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
              <button onClick={() => { onNavigate('OPERATION_GUIDE'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle size={18} className="text-blue-500" /> 総合操作説明
              </button>
              <button onClick={() => { onNavigate('VERSION_INFO'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Info size={18} className="text-gray-500" /> バージョン情報
              </button>
            </div>

            <div className="p-4 border-t text-center text-[10px] text-gray-400">
              QB総合ツール v2.2.0
            </div>
          </div>
        </div>
      )}

      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex-grow animate-in fade-in duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">ダッシュボード</h2>
        
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">クイックアクセス</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <button 
              onClick={() => onNavigate('EVALUATION_LIST')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <ClipboardList size={32} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">スタッフ評価</h4>
              <p className="text-sm text-gray-500">接客・技術の評価やクレーム記録を入力</p>
            </button>

            <button 
              onClick={() => onNavigate('INTERVIEW_RECORD')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-300 transition-all transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
                <MessageSquare size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">面談記録（1on1）</h4>
              <p className="text-sm text-gray-500">スタッフとの面談記録の入力・共有</p>
            </button>

            <button 
              onClick={() => onNavigate('STAFF_LIST')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="bg-purple-50 p-4 rounded-full mb-4 group-hover:bg-purple-100 transition-colors">
                <Users size={32} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">スタッフ一覧</h4>
              <p className="text-sm text-gray-500">スタッフ情報の確認や新規登録</p>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">今やるべきこと</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {tasks.map(task => (
                <li key={task.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      task.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                      task.type === 'alert' ? 'bg-red-50 text-red-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      <task.icon size={20} />
                    </div>
                    <span className="font-medium text-gray-800">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${
                      task.type === 'warning' ? 'text-yellow-600' :
                      task.type === 'alert' ? 'text-red-600' :
                      'text-green-600'
                    }`}>
                      {task.count}件
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};
