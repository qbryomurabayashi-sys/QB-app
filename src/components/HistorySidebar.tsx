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
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div className={`fixed inset-y-0 right-0 z-[70] w-80 sm:w-96 bg-white border-l shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col font-sans`}>
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
              <History size={20} className="text-blue-600" /> 履歴アーカイブ
            </h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          {metadata && (
            <div className="text-[10px] text-gray-500 bg-white p-4 border rounded-xl shadow-sm uppercase font-bold tracking-tight">
              <div className="flex justify-between border-b pb-2 mb-2">
                <span className="text-blue-600">{metadata.store}</span>
                <span className="text-gray-800">{metadata.name}</span>
              </div>
              <div className="text-right tabular-nums">社員番号: {metadata.employeeId}</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {historyList.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-sm font-bold uppercase tracking-tight">
              <p>過去の記録がありません</p>
            </div>
          ) : (
            historyList.map(record => (
              <div
                key={record.id}
                className={`p-4 border rounded-xl transition-all cursor-pointer relative group ${record.id === currentId ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                onClick={() => onSelect(record.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 text-sm tabular-nums">{record.date}</span>
                  {record.id === currentId && (
                    <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 font-bold uppercase rounded-md tracking-tighter">
                      編集中のレコード
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-4">
                  作成者: {record.evaluator || '-'}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">総合点</span>
                    <div className="text-xl font-bold text-blue-900 tabular-nums">{record.totalScore || record.performanceScore || '0'} <span className="text-[10px] text-blue-400 ml-0.5 uppercase">pts</span></div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCompare(record); }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                    title="比較対象に設定"
                  >
                    <Layers size={16} />
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
