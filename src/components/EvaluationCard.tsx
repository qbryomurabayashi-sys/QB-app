import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`ff-window mb-8 print-break-inside-avoid relative overflow-hidden ${item.score === null && !isClaimOrAccident ? 'ring-2 ring-ff-gold/50' : ''}`}
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ff-gold/30 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ff-gold/30 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ff-gold/30 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ff-gold/30 rounded-br-sm pointer-events-none" />

      <div className="flex justify-between items-center mb-4 border-b border-ff-silver/20 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-ff-gold font-display font-bold tracking-widest text-xs">
            NO.{item.no}
          </span>
          <span className="text-[10px] text-ff-silver/60 uppercase tracking-tighter italic">[{item.subCategory}]</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMemoOpen(!isMemoOpen)}
          className="text-xs text-ff-silver hover:text-ff-gold transition-colors flex items-center gap-2 group relative"
        >
          <span className="ff-cursor !-left-8"></span>
          <MessageSquare size={18} className="text-ff-gold" /> 
          <span className="font-display tracking-widest">{isMemoOpen ? '巻物を閉じる' : '巻物を開く'}</span>
        </button>
      </div>

      <h3 className="font-display font-bold text-white text-2xl mb-6 leading-tight uppercase tracking-[0.1em]">{item.item}</h3>

      <div className="ff-parchment text-lg text-stone-800 mb-8 p-6 leading-relaxed italic shadow-inner">
        {item.desc}
      </div>

      {isMemoOpen && (
        <div className="mb-8 animate-in slide-in-from-top duration-300">
          <div className="relative">
            <textarea
              value={item.memo || ''}
              onChange={(e) => onUpdateMemo(item.no, e.target.value)}
              placeholder={readOnly ? "巻物は白紙です..." : "ここに記録を記してください..."}
              className="w-full p-6 text-lg bg-ff-parchment border-2 border-ff-gold/30 text-stone-900 focus:border-ff-gold outline-none transition-all font-serif italic shadow-md rounded-sm"
              rows={4}
              disabled={readOnly}
            />
            <div className="absolute top-3 right-3 opacity-20 text-2xl">📜</div>
          </div>
        </div>
      )}

      {item.pointDesc && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className={`w-full flex items-center justify-between px-6 py-4 text-lg font-display font-bold transition-all group relative ${isDetailOpen
              ? 'bg-ff-gold/20 text-ff-gold border border-ff-gold'
              : 'bg-black/20 text-ff-silver border border-ff-silver/30 hover:border-ff-gold hover:text-ff-gold'
              }`}
          >
            <span className="ff-cursor"></span>
            <div className="flex items-center gap-4">
              {isDetailOpen ? <MinusCircle size={24} /> : <PlusCircle size={24} />}
              <span className="tracking-widest">{isDetailOpen ? '知恵を隠す' : '知恵を授かる'}</span>
            </div>
            {isDetailOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          <AnimatePresence>
            {isDetailOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-6 bg-gradient-to-br from-ff-blue-top/40 to-black/40 border border-ff-gold/20 text-lg text-ff-silver leading-relaxed font-serif italic">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-1.5 bg-ff-gold/50 rounded-full"></div>
                    <div>{item.pointDesc}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="space-y-6">
        {isClaimOrAccident ? (
          <div className="w-full">
            <div className="flex justify-between items-end mb-6">
              <p className="text-lg text-ff-red font-display font-bold uppercase tracking-widest">
                重大インシデント記録
              </p>
              <div className="text-right">
                <span className="text-xs text-ff-silver/60 uppercase block">合計影響度</span>
                <span className={`text-4xl font-display font-bold ${(item.score || 0) < 0 ? "text-ff-red" : "text-ff-silver"}`}>
                  {item.score ?? 0}
                  <span className="text-lg ml-2">PTS</span>
                </span>
              </div>
            </div>

            {item.incidents && item.incidents.length > 0 ? (
              <div className="space-y-4 mb-6">
                {item.incidents.map((inc) => (
                  <div key={inc.id} className="p-6 bg-black/40 border border-ff-silver/20 relative group hover:border-ff-gold/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-lg text-white pr-10 font-serif italic">
                        <span className="text-ff-gold mr-4 font-display not-italic">[{inc.date}]</span>
                        {inc.description}
                      </div>
                      <div className="text-right shrink-0 font-display text-sm">
                        <div className="text-ff-red">-{Math.abs(inc.deduction)}P</div>
                        <div className="text-ff-emerald">+{inc.improvement}P</div>
                      </div>
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => handleDeleteIncident(inc.id)}
                        className="absolute top-3 right-3 p-2 text-ff-silver/40 hover:text-ff-red opacity-0 group-hover:opacity-100 transition-opacity group/del"
                      >
                        <span className="ff-cursor !-left-8"></span>
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/20 border-2 border-dashed border-ff-silver/10 text-ff-silver/40 text-lg italic mb-6 rounded-lg">
                記録されているインシデントはありません。
              </div>
            )}

            {isAddingIncident ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 bg-gradient-to-b from-ff-blue-top to-black border-2 border-ff-gold/50 shadow-2xl rounded-sm"
              >
                <h4 className="text-xl font-display font-bold text-ff-gold mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="animate-pulse">💠</span> 新たな記録を追加
                </h4>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-display font-bold text-ff-silver/60 mb-3 uppercase tracking-widest">発生日</label>
                      <input
                        type="date"
                        value={newIncidentDate}
                        onChange={(e) => setNewIncidentDate(e.target.value)}
                        className="w-full bg-black/40 border border-ff-silver/30 text-ff-silver p-3 text-lg focus:border-ff-gold outline-none rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-bold text-ff-silver/60 mb-3 uppercase tracking-widest">内容</label>
                      <input
                        type="text"
                        value={newIncidentDesc}
                        onChange={(e) => setNewIncidentDesc(e.target.value)}
                        className="w-full bg-black/40 border border-ff-silver/30 text-ff-silver p-3 text-lg focus:border-ff-gold outline-none rounded-sm"
                        placeholder="出来事を記述してください..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-ff-silver/60 mb-3 uppercase tracking-widest">減点規模</label>
                    <div className="flex items-center gap-6 bg-black/20 p-6 rounded-sm border border-ff-silver/10">
                      <input
                        type="range"
                        min={item.category === '技術' ? -10 : -15}
                        max={0}
                        step={1}
                        value={newIncidentDeduction}
                        onChange={(e) => setNewIncidentDeduction(parseInt(e.target.value, 10))}
                        className="w-full h-3 cursor-pointer accent-ff-red bg-ff-silver/20 rounded-lg appearance-none"
                      />
                      <div className="text-right font-display font-bold text-ff-red text-4xl w-16 shrink-0 tabular-nums">
                        {newIncidentDeduction}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold text-ff-silver/60 mb-4 uppercase tracking-widest">改善要素</label>
                    <div className="grid grid-cols-1 gap-3">
                      {IMPROVEMENT_OPTS.map(opt => (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => setNewIncidentImprovement(opt.score)}
                          className={`text-left text-sm p-4 border-2 flex justify-between items-center transition-all group relative ${newIncidentImprovement === opt.score 
                            ? 'bg-ff-emerald/20 border-ff-emerald text-white font-bold' 
                            : 'bg-black/40 border-ff-silver/10 text-ff-silver/60 hover:border-ff-emerald/50 hover:text-ff-emerald'}`}
                        >
                          <span className="ff-cursor"></span>
                          <span className="font-display tracking-widest text-lg">{opt.label}</span>
                          <span className="text-xs opacity-50 italic ml-6 uppercase">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 justify-end mt-8">
                    <button onClick={() => setIsAddingIncident(false)} className="px-6 py-3 text-lg text-ff-silver hover:text-white uppercase tracking-widest transition-colors">キャンセル</button>
                    <button onClick={handleAddIncident} className="ff-button !py-3 !px-8 text-lg uppercase tracking-widest">記録を確定</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsAddingIncident(true)}
                disabled={readOnly}
                className={`w-full py-6 bg-black/40 border-2 border-dashed border-ff-silver/20 text-ff-silver/60 transition-all text-lg font-display font-bold flex items-center justify-center gap-4 uppercase rounded-sm group relative ${readOnly ? 'opacity-50 cursor-not-allowed' : 'hover:border-ff-gold hover:text-ff-gold hover:bg-ff-gold/5'}`}
              >
                <span className="ff-cursor"></span>
                <PlusIcon size={24} /> インシデント記録を開始
              </button>
            )}
          </div>
        ) : isNegative ? (
          <div className="w-full">
            <p className="text-xs text-ff-red font-display font-bold mb-4 uppercase tracking-[0.2em]">
              減点レベル ({item.max} ~ 0)
            </p>
            <div className="flex items-center gap-8 bg-black/20 p-6 rounded-sm border border-ff-silver/10">
              <input
                type="range"
                min={item.max}
                max={0}
                step={1}
                value={item.score ?? 0}
                onChange={(e) => onUpdate(item.no, parseInt(e.target.value, 10))}
                className="w-full h-3 cursor-pointer accent-ff-red bg-ff-silver/20 rounded-lg appearance-none disabled:opacity-50"
                disabled={readOnly}
              />
              <div className="text-right font-display font-bold text-ff-red text-4xl w-20 shrink-0 tabular-nums">
                {item.score !== null ? item.score : "0"}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs text-ff-gold font-display font-bold mb-2 uppercase tracking-[0.2em]">
              コマンド選択
            </p>
            <div className="flex gap-3">
              {availableScores.map((score) => {
                const isSelected = item.score === score;
                
                let selectedClass = 'border-ff-silver/30 text-ff-silver/60';
                if (isSelected) {
                  if (score > 0) {
                    selectedClass = 'bg-gradient-to-b from-ff-emerald to-emerald-900 text-white border-ff-emerald shadow-[0_0_20px_rgba(80,200,120,0.5)]';
                  } else if (score < 0 || (score === 0 && item.max > 0)) {
                    selectedClass = 'bg-gradient-to-b from-ff-red to-red-900 text-white border-ff-red shadow-[0_0_20px_rgba(255,51,51,0.5)]';
                  } else {
                    selectedClass = 'bg-gradient-to-b from-ff-silver to-stone-600 text-black border-ff-silver shadow-[0_0_20px_rgba(224,224,224,0.5)]';
                  }
                } else {
                  selectedClass = 'bg-black/40 border-ff-silver/20 text-ff-silver/40 hover:border-ff-gold hover:text-ff-gold hover:bg-ff-gold/5';
                }

                return (
                  <button
                    type="button"
                    key={score}
                    onClick={() => !readOnly && onUpdate(item.no, score)}
                    disabled={readOnly}
                    className={`flex-1 py-4 border-2 transition-all duration-150 flex items-center justify-center font-display font-bold text-2xl group relative ${isSelected ? 'scale-110 z-10' : ''} ${selectedClass} ${readOnly ? 'opacity-80 cursor-default' : ''}`}
                  >
                    <span className="ff-cursor !-top-8 !left-1/2 !-translate-x-1/2 !rotate-90"></span>
                    {score}
                  </button>
                );
              })}
            </div>
            
            <AnimatePresence>
              {item.score !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-r from-ff-blue-top/30 to-transparent border-l-4 border-ff-gold text-lg text-white leading-relaxed font-serif italic shadow-lg"
                >
                  <span className="text-ff-gold font-display not-italic mr-4">結果:</span>
                  {item.criteria?.[item.score] || (item.score === 0 ? "クリスタルは特に影響を示していません。" : "その結末はまだ謎に包まれています。")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
