import React from 'react';
import { Store, User, Plus, Trash2, History, ChevronRight, Upload, Download, Layers, BookOpen } from 'lucide-react';
import { StaffSummary } from '../types';

interface TopPageProps {
  staffList: StaffSummary[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onBatchPrint: () => void;
  onActionPlan: () => void;
}

export const TopPage: React.FC<TopPageProps> = ({ staffList, onSelect, onCreate, onDelete, onBatchPrint, onActionPlan }) => {
  const uniqueStaffList = React.useMemo(() => {
    const seen = new Set();
    return staffList.filter(staff => {
      const key = `${staff.store}_${staff.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [staffList]);

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const importedData = JSON.parse(ev.target.result as string);
          if (confirm('現在のデータを上書きしてデータを復元しますか？（この操作は取り消せません）')) {
            Object.keys(importedData).forEach(key => {
              if (key.startsWith('qb_')) {
                const value = importedData[key];
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
              }
            });
            alert('データの復元が完了しました。ページをリロードします。');
            window.location.reload();
          }
        } catch (err) {
          alert('ファイルの読み込みに失敗しました。');
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleBackup = () => {
    const dataToExport: Record<string, string> = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('qb_')) {
        dataToExport[key] = localStorage.getItem(key) || '';
      }
    });
    const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_qb_eval_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Store className="text-blue-600" size={32} />
              QB総合ツール
            </h1>
            <p className="text-gray-500 mt-1">評価画面: 各カテゴリのタブを切り替えて評価を入力します。「店長」タブはパスワードでロック解除されます。</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onActionPlan}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <BookOpen size={24} /> アクションプラン作成
            </button>
            <button
              onClick={onCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus size={24} /> 新規評価を作成
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap justify-end gap-2">
          <button
            onClick={onBatchPrint}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm transition-colors flex items-center gap-2 border border-blue-200"
          >
            <Layers size={16} /> 全員分を一括印刷
          </button>
          <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm cursor-pointer transition-colors flex items-center gap-2">
            <Upload size={16} /> 復元 (JSON)
            <input type="file" accept=".json" className="hidden" onChange={handleRestore} />
          </label>
          <button
            onClick={handleBackup}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
          >
            <Download size={16} /> バックアップ保存
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
      </div>
    </div>
  );
};
