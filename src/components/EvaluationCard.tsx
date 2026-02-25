import React from 'react';
import { MinusCircle, PlusCircle, ChevronUp, ChevronDown, MessageSquare, X, PlusCircle as PlusIcon } from 'lucide-react';
import { EvaluationItem, Incident } from '../types';
import { CLAIM_DEDUCTIONS, IMPROVEMENT_OPTS } from '../constants';

interface EvaluationCardProps {
  item: EvaluationItem;
  onUpdate: (no: number, score: number) => void;
  onUpdateMemo: (no: number, memo: string) => void;
  onUpdateIncidents: (no: number, incidents: Incident[]) => void;
  readOnly: boolean;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ item, onUpdate, onUpdateMemo, onUpdateIncidents, readOnly }) => {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isMemoOpen, setIsMemoOpen] = React.useState(!!item.memo);

  // Incident State
  const [newIncidentDesc, setNewIncidentDesc] = React.useState('');
  const [newIncidentDate, setNewIncidentDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [newIncidentDeduction, setNewIncidentDeduction] = React.useState(0);
  const [newIncidentImprovement, setNewIncidentImprovement] = React.useState(0);
  const [isAddingIncident, setIsAddingIncident] = React.useState(false);

  const isNegative = item.max < 0 && !item.validScores;
  const isClaimOrAccident = item.subCategory === 'クレーム' || item.subCategory === '事故';

  const availableScores = item.validScores
    ? item.validScores
    : item.max < 0
      ? [0, -1, -2, -3, -4, -5, -10, -15].filter(s => s >= item.max)
      : Array.from({ length: item.max + 1 }, (_, n) => n).reverse();

  const handleAddIncident = () => {
    if (!newIncidentDesc.trim()) {
      alert("内容を入力してください");
      return;
    }
    const newInc: Incident = {
      id: Date.now().toString(),
      date: newIncidentDate,
      desc: newIncidentDesc,
      deduction: newIncidentDeduction,
      improvement: newIncidentImprovement
    };
    const updatedIncidents = [...(item.incidents || []), newInc];
    onUpdateIncidents(item.no, updatedIncidents);
    setNewIncidentDesc('');
    setNewIncidentDeduction(0);
    setNewIncidentImprovement(0);
    setNewIncidentDate(new Date().toISOString().split('T')[0]);
    setIsAddingIncident(false);
  };

  const handleDeleteIncident = (id: string) => {
    const updatedIncidents = (item.incidents || []).filter(inc => inc.id !== id);
    onUpdateIncidents(item.no, updatedIncidents);
  };

  const claimDeductionOpts = React.useMemo(() => {
    if (item.subCategory === 'クレーム' && item.category === '接客') return CLAIM_DEDUCTIONS.service;
    if (item.subCategory === 'クレーム' && item.category === '技術') return CLAIM_DEDUCTIONS.tech;
    if (item.subCategory === '事故') return CLAIM_DEDUCTIONS.accident;
    return [];
  }, [item]);

  const getDeductionLabel = (score: number, opts: any[]) => {
    if (score === 0) return opts.find(o => o.score === 0);
    for (const opt of opts) {
      if (opt.score === 0) continue;
      const match = opt.label.match(/\((-?\d+)~(-?\d+)\)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);
        const maxVal = Math.max(start, end);
        const minVal = Math.min(start, end);
        if (score <= maxVal && score >= minVal) return opt;
      } else {
        if (score === opt.score) return opt;
      }
    }
    return opts.reduce((prev, curr) => Math.abs(curr.score - score) < Math.abs(prev.score - score) ? curr : prev, opts[0]);
  };

  const currentDeductionOpt = React.useMemo(() => {
    return getDeductionLabel(newIncidentDeduction, claimDeductionOpts);
  }, [newIncidentDeduction, claimDeductionOpts]);

  return (
    <div className={`mb-6 p-4 bg-white border rounded-xl shadow-sm print-break-inside-avoid ${item.score === null && !isClaimOrAccident ? 'border-l-4 border-l-red-500 border-gray-200' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-1 rounded-full">
            No.{item.no}
          </span>
          <span className="text-xs font-medium text-gray-500 truncate">{item.subCategory}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMemoOpen(!isMemoOpen)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-all shadow-sm ${isMemoOpen ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400'}`}
        >
          <MessageSquare size={14} /> {isMemoOpen ? 'メモを隠す' : '一言メモ'}
        </button>
      </div>

      <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{item.item}</h3>

      <div className="text-sm text-gray-800 font-medium mb-3 bg-blue-50 p-2.5 rounded border border-blue-100 leading-relaxed">
        {item.desc}
      </div>

      {isMemoOpen && (
        <div className="mb-4">
          <textarea
            value={item.memo || ''}
            onChange={(e) => onUpdateMemo(item.no, e.target.value)}
            placeholder={readOnly ? "メモなし" : "メモを入力..."}
            className="w-full p-2 text-sm border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-indigo-50/30 disabled:bg-gray-100 disabled:text-gray-500"
            rows={2}
            disabled={readOnly}
          />
        </div>
      )}

      {item.pointDesc && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${isDetailOpen
              ? 'bg-blue-50 text-blue-900 border border-blue-200'
              : 'bg-white text-gray-500 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
          >
            <div className="flex items-center gap-2">
              {isDetailOpen ? <MinusCircle size={18} className="text-blue-500" /> : <PlusCircle size={18} />}
              <span>評価ポイントを{isDetailOpen ? '隠す' : '見る'}</span>
            </div>
            {isDetailOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isDetailOpen && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 leading-relaxed animate-in fade-in slide-in-from-top-1 shadow-inner">
              <div className="flex gap-2">
                <div className="shrink-0 w-1 bg-blue-400 rounded-full my-1"></div>
                <div>{item.pointDesc}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {isClaimOrAccident ? (
          <div className="w-full">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs text-red-600 font-bold">
                {item.item}の案件記録 (減点 + 改善点)
              </p>
              <p className="text-xl font-bold font-mono">
                合計: <span className={(item.score || 0) < 0 ? "text-red-600" : "text-gray-400"}>{item.score ?? 0}</span>
                <span className="text-xs text-gray-400 font-normal ml-1">点</span>
              </p>
            </div>

            {item.incidents && item.incidents.length > 0 ? (
              <div className="space-y-2 mb-3">
                {item.incidents.map((inc) => (
                  <div key={inc.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-bold text-gray-800 pr-6">
                        <span className="text-xs text-gray-500 font-normal mr-2 block sm:inline">{inc.date}</span>
                        {inc.desc}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-red-600 font-bold mr-2">{inc.deduction}点</span>
                        <span className="text-blue-600 font-bold">+{inc.improvement}点</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      計: {Math.min(0, inc.deduction + inc.improvement)}点
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => handleDeleteIncident(inc.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded text-gray-400 text-xs mb-3">
                案件なし (0点)
              </div>
            )}

            {isAddingIncident ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in zoom-in-95">
                <h4 className="text-xs font-bold text-blue-800 mb-2">新規案件の追加</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">発生日</label>
                    <input
                      type="date"
                      value={newIncidentDate}
                      onChange={(e) => setNewIncidentDate(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                    />
                    <label className="block text-xs font-bold text-gray-600 mb-1">内容メモ</label>
                    <input
                      type="text"
                      value={newIncidentDesc}
                      onChange={(e) => setNewIncidentDesc(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="例: カット手順の誤り、接客時の言葉遣いなど"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">減点対象 (スライダー調整)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={item.category === '技術' ? -10 : -15}
                        max={0}
                        step={1}
                        value={newIncidentDeduction}
                        onChange={(e) => setNewIncidentDeduction(parseInt(e.target.value, 10))}
                        className="w-full h-10 cursor-pointer accent-red-600 touch-pan-x"
                      />
                      <div className="text-right font-bold text-red-600 text-xl w-12 shrink-0 tabular-nums">
                        {newIncidentDeduction}
                      </div>
                    </div>
                    <div className="p-2 bg-red-50 border border-red-100 rounded text-gray-700 text-xs mt-1">
                      {currentDeductionOpt ? (
                        <div>
                          <span className="font-bold block mb-0.5">{currentDeductionOpt.label}</span>
                          <span className="text-gray-500">{currentDeductionOpt.desc}</span>
                        </div>
                      ) : "該当なし"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">改善点 (最大+5点)</label>
                    <div className="grid grid-cols-1 gap-1">
                      {IMPROVEMENT_OPTS.map(opt => (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => setNewIncidentImprovement(opt.score)}
                          className={`text-left text-xs p-2 rounded border flex justify-between items-center transition-colors ${newIncidentImprovement === opt.score ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[10px] text-gray-500 truncate ml-2">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-2">
                    <button onClick={() => setIsAddingIncident(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded">キャンセル</button>
                    <button onClick={handleAddIncident} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow-sm">確定</button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingIncident(true)}
                disabled={readOnly}
                className={`w-full py-2 bg-white border border-dashed border-gray-400 text-gray-500 rounded transition-all text-xs font-bold flex items-center justify-center gap-2 ${readOnly ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400'}`}
              >
                <PlusIcon size={16} /> 案件を追加する
              </button>
            )}
          </div>
        ) : isNegative ? (
          <div className="w-full">
            <p className="text-xs text-red-600 font-bold mb-2">
              減点項目 ({item.max} 〜 0)
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={item.max}
                max={0}
                step={1}
                value={item.score ?? 0}
                onChange={(e) => onUpdate(item.no, parseInt(e.target.value, 10))}
                className="w-full h-10 cursor-pointer accent-red-600 touch-pan-x disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={readOnly}
              />
              <div className="text-right font-bold text-red-600 text-2xl w-12 shrink-0 tabular-nums">
                {item.score ?? 0}
              </div>
            </div>
            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-gray-700 text-xs">
              {item.criteria && item.score !== null && item.criteria[item.score]
                ? item.criteria[item.score]
                : item.score === 0 || item.score === null ? "減点なし" : "減点対象"}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {availableScores.map((score) => {
                const isSelected = item.score === score;

                let colorClass = 'border-gray-200 hover:bg-gray-50';
                let selectedClass = 'bg-blue-50 border-blue-500 ring-1 ring-blue-500';
                let badgeClass = 'bg-gray-100 text-gray-600';

                if (score > 0) {
                  if (score >= 3) {
                    selectedClass = 'bg-blue-50 border-blue-600 ring-2 ring-blue-600';
                    badgeClass = isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800';
                  } else if (score === 2) {
                    selectedClass = 'bg-sky-50 border-sky-500 ring-2 ring-sky-500';
                    badgeClass = isSelected ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-800';
                  } else {
                    selectedClass = 'bg-orange-50 border-orange-500 ring-2 ring-orange-500';
                    badgeClass = isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800';
                  }
                } else if (score < 0 || (score === 0 && item.max > 0)) {
                  selectedClass = 'bg-red-50 border-red-500 ring-2 ring-red-500';
                  badgeClass = isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800';
                }

                return (
                  <button
                    type="button"
                    key={score}
                    onClick={() => !readOnly && onUpdate(item.no, score)}
                    disabled={readOnly}
                    className={`flex-1 min-w-[3.5rem] p-2 rounded-lg border-2 transition-all duration-100 flex flex-col items-center justify-center gap-1 ${!readOnly && 'active:scale-95'} ${isSelected ? selectedClass : colorClass} ${readOnly ? 'opacity-80 cursor-default' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${badgeClass}`}>
                      {score}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={`mt-2 p-2 rounded-lg border min-h-[2.5rem] transition-all duration-300 ${item.score !== null ? 'bg-gray-50 border-gray-200' : 'bg-gray-50/50 border-dashed border-gray-200'}`}>
              <p className={`text-xs leading-relaxed ${item.score !== null ? 'text-gray-800 font-medium' : 'text-gray-400 text-center italic'}`}>
                {item.score !== null
                  ? (item.criteria?.[item.score] || (item.score === 0 ? "不十分 / なし" : "評価基準なし"))
                  : "点数を選択してください"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
