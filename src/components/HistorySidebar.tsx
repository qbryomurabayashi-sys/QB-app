import React from 'react';
import { History, X, Layers } from 'lucide-react';
import { Metadata } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: any[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCompare: (record: any) => void;
  metadata: Metadata;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  historyList,
  currentId,
  onSelect,
  onCompare,
  metadata
}) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose} />}
      <div className={`fixed inset-y-0 right-0 z-[70] w-80 sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <History size={20} /> 評価履歴
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          {metadata && (
            <div className="text-xs text-gray-600 bg-white p-2 rounded border border-blue-100 shadow-sm">
              <div className="flex justify-between border-b border-gray-100 pb-1 mb-1">
                <span className="font-bold">{metadata.store}</span>
                <span className="font-bold">{metadata.name}</span>
              </div>
              <div className="text-gray-400 text-[10px] text-right">ID: {metadata.employeeId}</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {historyList.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>履歴がありません</p>
            </div>
          ) : (
            historyList.map(record => (
              <div
                key={record.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${record.id === currentId ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                onClick={() => onSelect(record.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 text-lg">{record.date}</span>
                  {record.id === currentId && <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">表示中</span>}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  評価者: {record.evaluator || '未設定'}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100/50">
                  <div className="flex-1">
                    <span className="text-xs text-gray-400">評価合計</span>
                    <div className="text-xl font-bold text-blue-600">{record.totalScore || record.performanceScore || '-'}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCompare(record); }}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Layers size={14} /> 比較
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
