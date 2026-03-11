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
      {isOpen && <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose} />}
      <div className={`fixed inset-y-0 right-0 z-[70] w-80 sm:w-96 bg-black border-l-4 border-ff-silver/30 shadow-[-10px_0_50px_rgba(0,0,0,0.8)] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col font-serif`}>
        <div className="mist-container opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mist-particle" style={{ width: '200px', height: '200px', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 3}s` }} />
          ))}
        </div>
        
        <div className="p-6 bg-ff-blue-top/20 border-b border-ff-silver/20 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-ff-gold flex items-center gap-3 uppercase tracking-[0.2em] text-lg">
              <History size={24} /> 記録の書庫
            </h3>
            <button onClick={onClose} className="p-2 text-ff-silver hover:text-ff-gold transition-colors relative group">
              <span className="ff-cursor !-left-10 !top-0"></span>
              <X size={28} />
            </button>
          </div>
          {metadata && (
            <div className="text-xs text-ff-silver bg-black/40 p-4 border border-ff-silver/20 shadow-inner uppercase tracking-widest rounded-sm">
              <div className="flex justify-between border-b border-ff-silver/10 pb-2 mb-2">
                <span className="font-bold text-ff-gold">{metadata.store}</span>
                <span className="font-bold text-white">{metadata.name}</span>
              </div>
              <div className="text-ff-silver/50 text-[10px] text-right">個体識別番号: {metadata.employeeId}</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
          {historyList.length === 0 ? (
            <div className="text-center text-ff-silver/30 py-16 uppercase tracking-widest text-sm italic">
              <p>記録が見つかりません</p>
            </div>
          ) : (
            historyList.map(record => (
              <div
                key={record.id}
                className={`p-5 border-2 transition-all cursor-pointer relative overflow-hidden group rounded-sm ${record.id === currentId ? 'border-ff-gold bg-blue-900/30' : 'border-ff-silver/10 bg-black/40 hover:border-ff-silver/40'}`}
                onClick={() => onSelect(record.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-ff-gold text-base uppercase tracking-widest">{record.date}</span>
                  {record.id === currentId && (
                    <span className="bg-ff-gold text-black text-[10px] px-2 py-1 font-bold uppercase animate-pulse rounded-sm">
                      編集中
                    </span>
                  )}
                </div>
                <div className="text-xs text-ff-silver/70 mb-3 uppercase tracking-widest">
                  記録者: {record.evaluator || '不明'}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ff-silver/10">
                  <div className="flex-1">
                    <span className="text-[10px] text-ff-silver/50 uppercase tracking-widest">総合共鳴率</span>
                    <div className="text-2xl font-bold text-ff-sky">{record.totalScore || record.performanceScore || '0'}%</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCompare(record); }}
                    className="ff-button !px-4 !py-2 text-xs flex items-center gap-2 group"
                  >
                    <span className="ff-cursor !-left-4"></span>
                    <Layers size={16} /> 比較
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
