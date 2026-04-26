import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MinusCircle, PlusCircle, ChevronUp, ChevronDown, MessageSquare, X, PlusCircle as PlusIcon, Sparkles } from 'lucide-react';
import { EvaluationItem, Incident } from '../types';
import { CLAIM_DEDUCTIONS, IMPROVEMENT_OPTS } from '../constants';
import { generateEvaluationComment, AIPersona, isLocalAiReady } from '../services/aiService';
import { GemmaDownloadModal } from './GemmaDownloadModal';

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
  const [isGeneratingMemo, setIsGeneratingMemo] = React.useState(false);
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);
  const [pendingPersona, setPendingPersona] = React.useState<AIPersona | null>(null);

  const executeGeneration = async (persona: AIPersona) => {
    setIsGeneratingMemo(true);
    try {
      const criteriaStr = item.criteria ? item.criteria[item.score || 0] : undefined;
      const memo = await generateEvaluationComment(
        item.item,
        item.desc,
        item.score || 0,
        item.max,
        criteriaStr,
        persona
      );
      onUpdateMemo(item.no, memo);
    } catch (err: any) {
      alert(err.message || "AI生成に失敗しました。");
    } finally {
      setIsGeneratingMemo(false);
    }
  };

  const handleGenerateMemo = async (persona: AIPersona = 'normal') => {
    if (!isLocalAiReady()) {
      setPendingPersona(persona);
      setShowDownloadModal(true);
      return;
    }
    await executeGeneration(persona);
  };

  const handleDownloadComplete = () => {
    setShowDownloadModal(false);
    if (pendingPersona) {
      executeGeneration(pendingPersona);
      setPendingPersona(null);
    }
  };

  const handleDownloadCancel = () => {
    setShowDownloadModal(false);
    setPendingPersona(null);
  };


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
      description: newIncidentDesc,
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

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm mb-6 print-break-inside-avoid">
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded text-[10px]">
              No.{item.no}
            </span>
            <span className="text-[10px] text-gray-500 font-bold tracking-tight">
              {item.subCategory}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMemoOpen(!isMemoOpen)}
            className="text-[10px] font-bold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            <MessageSquare size={14} /> 
            <span>一言メモ</span>
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3">{item.item}</h3>

        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-700 text-sm mb-4">
          {item.desc}
        </div>

        {item.pointDesc && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setIsDetailOpen(!isDetailOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-all rounded shadow-sm border border-dashed border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {isDetailOpen ? <MinusCircle size={16} /> : <PlusCircle size={16} />}
                <span>評価ポイントを見る</span>
              </div>
              {isDetailOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isDetailOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-4 bg-gray-50 border border-gray-200 text-gray-600 text-xs leading-relaxed rounded-lg whitespace-pre-wrap">
                    {item.pointDesc}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {isMemoOpen && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="text-[10px] font-bold text-gray-500">コメント・フィードバック (任意)</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-purple-700/70 font-bold flex items-center gap-0.5">
                  <Sparkles size={10} className={isGeneratingMemo ? "animate-pulse" : ""} />
                  AI生成:
                </span>
                {(['normal', 'mild', 'strict', 'logical'] as const).map(p => {
                    const labels = { normal: '標準', mild: '甘口', strict: '辛口', logical: '論理的' };
                    return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleGenerateMemo(p)}
                          disabled={isGeneratingMemo || readOnly}
                          className="text-[9px] bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold px-2 py-0.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                        >
                          {labels[p]}
                        </button>
                    )
                })}
              </div>
            </div>
            <textarea
              value={item.memo || ''}
              onChange={(e) => onUpdateMemo(item.no, e.target.value)}
              placeholder="メモを入力..."
              className="w-full p-3 text-xs bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500 focus:bg-white outline-none transition-all rounded-lg"
              rows={2}
              disabled={readOnly || isGeneratingMemo}
            />
          </div>
        )}

        <div className="pt-4 border-t">
          {isClaimOrAccident ? (
            <div className="w-full">
              <div className="flex justify-between items-end mb-4">
                <p className="text-sm font-bold text-red-600 uppercase tracking-tight">インシデント記録</p>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold block mb-0.5">今回の合計減点</span>
                  <span className={`text-2xl font-bold ${(item.score || 0) < 0 ? "text-red-600" : "text-gray-400"}`}>
                    {item.score ?? 0}
                    <span className="text-[10px] ml-1 font-normal">PTS</span>
                  </span>
                </div>
              </div>

              {item.incidents && item.incidents.length > 0 && (
                <div className="space-y-3 mb-4">
                  {item.incidents.map((inc) => (
                    <div key={inc.id} className="p-3 bg-white border border-gray-100 rounded-lg relative group hover:border-red-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-gray-700 pr-8">
                          <span className="text-[10px] font-bold text-gray-400 mr-2">[{inc.date}]</span>
                          {inc.description}
                        </div>
                        <div className="text-right text-[10px] font-bold">
                          <div className="text-red-500">-{Math.abs(inc.deduction)}</div>
                          <div className="text-green-600">+{inc.improvement}</div>
                        </div>
                      </div>
                      {!readOnly && (
                        <button
                          onClick={() => handleDeleteIncident(inc.id)}
                          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isAddingIncident ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 border rounded-xl space-y-4 shadow-inner"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">発生日</label>
                      <input
                        type="date"
                        value={newIncidentDate}
                        onChange={(e) => setNewIncidentDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 p-2 text-xs outline-none rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">内容</label>
                      <input
                        type="text"
                        value={newIncidentDesc}
                        onChange={(e) => setNewIncidentDesc(e.target.value)}
                        className="w-full bg-white border border-gray-200 p-2 text-xs outline-none rounded"
                        placeholder="事故の概要..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">減点規模 ({item.category === '技術' ? '-10' : '-15'})</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={item.category === '技術' ? -10 : -15}
                        max={0}
                        step={1}
                        value={newIncidentDeduction}
                        onChange={(e) => setNewIncidentDeduction(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none accent-red-600"
                      />
                      <div className="text-lg font-bold text-red-600 w-8 text-right underline underline-offset-4">{newIncidentDeduction}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button onClick={() => setIsAddingIncident(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">キャンセル</button>
                    <button onClick={handleAddIncident} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">記録を確定</button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsAddingIncident(true)}
                  disabled={readOnly}
                  className="w-full py-3 bg-gray-50 border border-dashed border-gray-300 text-gray-400 text-xs font-bold flex items-center justify-center gap-2 rounded-xl hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all"
                >
                  <PlusIcon size={16} /> 記録を新規追加
                </button>
              )}
            </div>
          ) : isNegative ? (
            <div className="w-full">
              <p className="text-[10px] font-bold text-red-500 mb-2 uppercase">減点レベル設定 ({item.max} ~ 0)</p>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  type="range"
                  min={item.max}
                  max={0}
                  step={1}
                  value={item.score ?? 0}
                  onChange={(e) => onUpdate(item.no, parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-red-500"
                  disabled={readOnly}
                />
                <div className="text-2xl font-bold text-red-600 w-10 text-right underline underline-offset-4">
                  {item.score !== null ? item.score : "0"}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                {availableScores.map((score) => {
                  const isSelected = item.score === score;
                  const ratio = item.max > 0 ? score / item.max : 0;
                  
                  let boxClass = 'border-gray-200 bg-white hover:bg-gray-50';
                  let circleClass = '';
                  let textClass = 'text-gray-400';
                  
                  if (isSelected) {
                    boxClass = 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100 shadow-md';
                    circleClass = 'bg-blue-600';
                    textClass = 'text-white';
                  } else {
                    if (ratio >= 0.8) textClass = 'text-blue-600';
                    else if (ratio >= 0.5) textClass = 'text-cyan-600';
                    else if (ratio > 0) textClass = 'text-orange-600';
                    else textClass = 'text-red-700';
                    
                    circleClass = 'bg-gray-100';
                    // In screenshot: circle background is light and text is colored. 
                    // Let's make circle bg light corresponding to color:
                    if (ratio >= 0.8) circleClass = 'bg-blue-100';
                    else if (ratio >= 0.5) circleClass = 'bg-cyan-100';
                    else if (ratio > 0) circleClass = 'bg-orange-100';
                    else circleClass = 'bg-red-100';
                  }
                  
                  return (
                    <button
                      type="button"
                      key={score}
                      onClick={() => !readOnly && onUpdate(item.no, score)}
                      disabled={readOnly}
                      className={`flex-1 py-4 border rounded-xl transition-all font-bold text-lg flex items-center justify-center ${boxClass} ${readOnly && isSelected ? 'opacity-100' : readOnly ? 'opacity-50 grayscale cursor-not-allowed' : 'active:scale-95'}`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-bold ${circleClass} ${textClass}`}>
                        {score}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <AnimatePresence>
                {item.score !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-50/50 border border-gray-200 text-gray-600 text-[11px] leading-relaxed rounded-xl whitespace-pre-wrap"
                  >
                    {item.criteria?.[item.score] || (item.score === 0 ? "特筆すべき不備なし" : "評価未定")}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showDownloadModal && (
          <GemmaDownloadModal isOpen={showDownloadModal} onComplete={handleDownloadComplete} onCancel={handleDownloadCancel} />
        )}
      </AnimatePresence>
    </div>
  );
};
