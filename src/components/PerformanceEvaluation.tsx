import React from 'react';
import { motion } from 'motion/react';
import { Calculator, CheckSquare, Square } from 'lucide-react';
import { PerformanceData } from '../types';
import { MONTH_LABELS, MONTHS } from '../constants';
import { calculatePerformanceMetrics, calculateCutScore } from '../utils';

interface PerformanceEvaluationProps {
  data: PerformanceData;
  onChange: (newData: PerformanceData) => void;
  onScoreUpdate: (score: number) => void;
  readOnly: boolean;
}

export const PerformanceEvaluation: React.FC<PerformanceEvaluationProps> = ({ data, onChange, onScoreUpdate, readOnly }) => {
  const monthlyCuts = data.monthlyCuts && data.monthlyCuts.length === 12
    ? data.monthlyCuts
    : new Array(12).fill(0);

  const excludedFromAverage = data.excludedFromAverage && data.excludedFromAverage.length === 12
    ? data.excludedFromAverage
    : new Array(12).fill(false);

  const { currentTotal, average, predictedTotal } = calculatePerformanceMetrics(monthlyCuts, excludedFromAverage);

  const predictionScore = calculateCutScore(predictedTotal);
  const goalScoreCalculated = calculateCutScore(data.goalCuts);

  React.useEffect(() => {
    onScoreUpdate(predictionScore);
  }, [predictionScore, onScoreUpdate]);

  const handleMonthlyChange = (index: number, val: number) => {
    const newCuts = [...monthlyCuts];
    newCuts[index] = val;
    onChange({ ...data, monthlyCuts: newCuts });
  };

  const toggleExclusion = (index: number) => {
    const newExcluded = [...excludedFromAverage];
    newExcluded[index] = !newExcluded[index];
    onChange({ ...data, excludedFromAverage: newExcluded });
  };

  const handleInputChange = (field: keyof PerformanceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const monthDays = 30.5;
  const workDays = Math.max(0, monthDays - (data.monthlyHolidays || 0));
  const monthlyAvgCuts = average > 0 ? average : (data.goalCuts / 12);
  const cutsPerDay = workDays > 0 ? (monthlyAvgCuts / workDays).toFixed(1) : "0";

  return (
    <div className="space-y-6 sm:space-y-8 print-break-inside-avoid font-serif relative z-10">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ff-window p-8 sm:p-10"
      >
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-ff-gold mb-10 flex items-center gap-4 uppercase tracking-[0.2em]">
          <span className="animate-pulse">💠</span> 年間戦績メトリクス
          <span className="text-xs font-bold text-ff-silver/40 bg-black/40 px-4 py-2 border border-ff-silver/20 rounded-full ml-auto">戦歴ログ</span>
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 mb-12 no-print">
          {MONTHS.map((m) => {
            const isExcluded = excludedFromAverage[m.index];
            const hasValue = monthlyCuts[m.index] > 0;

            return (
              <div key={m.index} className="flex flex-col bg-black/40 p-4 border border-ff-silver/10 rounded-sm group hover:border-ff-gold/50 transition-colors">
                <label className="text-xs text-ff-silver/60 text-center mb-3 font-display font-bold uppercase tracking-widest">{m.label}</label>
                <div className="relative mb-3">
                  <input
                    type="number"
                    pattern="\d*"
                    value={monthlyCuts[m.index] || ''}
                    onChange={(e) => handleMonthlyChange(m.index, parseInt(e.target.value) || 0)}
                    placeholder={hasValue ? "" : `${Math.round(average)}`}
                    className={`w-full bg-black/60 border border-ff-silver/20 p-3 text-center text-lg focus:border-ff-gold outline-none transition-all font-display ${hasValue ? 'text-white' : 'text-ff-silver/30 italic'}`}
                    disabled={readOnly}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => toggleExclusion(m.index)}
                  className={`flex items-center justify-center gap-3 text-xs py-2 px-3 transition-all uppercase font-display tracking-tighter relative group/btn ${!isExcluded ? 'bg-ff-emerald/20 text-ff-emerald border border-ff-emerald/30' : 'bg-black/60 text-ff-silver/40 border border-ff-silver/10 hover:border-ff-gold hover:text-ff-gold'}`}
                  disabled={readOnly}
                >
                  <span className="ff-cursor !-top-8 !left-1/2 !-translate-x-1/2 !rotate-90"></span>
                  {!isExcluded ? <CheckSquare size={16} /> : <Square size={16} />}
                  {isExcluded ? '除外中' : '同期済み'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-ff-silver/20">
          <div className="space-y-6">
            <label className="block text-xs font-display font-bold text-ff-silver/60 mb-2 uppercase tracking-[0.2em]">年間目標ボリューム</label>
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <input
                  type="number"
                  pattern="\d*"
                  value={data.goalCuts || ''}
                  onChange={(e) => handleInputChange('goalCuts', parseInt(e.target.value) || 0)}
                  className="w-full bg-black/40 border-2 border-ff-gold/30 p-4 text-right text-3xl text-white font-display focus:border-ff-gold outline-none rounded-sm shadow-inner"
                  placeholder="7000"
                  disabled={readOnly}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ff-gold/20 text-2xl">⚔️</div>
              </div>
              <span className="text-ff-silver/40 text-xs font-display uppercase tracking-widest">単位</span>
            </div>
            <div className="text-xs text-ff-silver/60 mt-3 text-right flex items-center justify-end gap-4 uppercase font-display tracking-widest">
              <span>目標ランク:</span>
              <span className="font-bold text-ff-gold bg-ff-gold/10 px-4 py-2 border border-ff-gold/30 min-w-[4rem] text-center inline-block text-lg rounded-sm">{goalScoreCalculated}</span>
              <span>PTS</span>
            </div>
          </div>

          <div className="ff-window !bg-black/40 !p-6 !border-ff-silver/10">
            <div className="text-xs text-ff-silver/40 mb-3 uppercase font-display tracking-widest">現在の同期合計</div>
            <div className="text-3xl font-display font-bold text-white text-right drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{currentTotal.toLocaleString()} <span className="text-sm text-ff-silver/40">単位</span></div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-ff-silver/10">
              <span className="text-xs text-ff-silver/40 uppercase font-display tracking-widest">平均共鳴度</span>
              <span className="text-lg font-display font-bold text-ff-emerald">{average.toLocaleString()} <span className="text-xs opacity-50">U/月</span></span>
            </div>
          </div>

          <div className="ff-window !bg-ff-gold/5 !p-6 !border-ff-gold/30">
            <div className="text-xs text-ff-gold mb-3 font-display font-bold uppercase tracking-widest">予測年間同期</div>
            <div className="text-4xl font-display font-bold text-ff-gold text-right drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">{Math.round(predictedTotal).toLocaleString()} <span className="text-sm text-ff-gold/40">単位</span></div>
            <div className="flex justify-between items-center mt-6 border-t border-ff-gold/20 pt-6">
              <span className="text-xs font-display font-bold text-ff-gold uppercase tracking-widest">推定ランク</span>
              <span className="text-3xl font-display font-bold text-ff-red drop-shadow-[0_0_10px_rgba(255,51,51,0.4)]">{predictionScore} <span className="text-sm">PTS</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="ff-window p-8 sm:p-10 no-print"
      >
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-ff-gold mb-10 flex items-center gap-4 uppercase tracking-[0.2em]">
          <Calculator size={28} className="text-ff-gold" /> 効率シミュレーター
        </h3>
        <div className="flex flex-col sm:flex-row items-end gap-8 mb-10">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs font-display font-bold text-ff-silver/60 mb-4 uppercase tracking-widest">月間休息サイクル</label>
            <div className="relative">
              <input
                type="number"
                pattern="\d*"
                value={data.monthlyHolidays || ''}
                onChange={(e) => handleInputChange('monthlyHolidays', parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-ff-silver/30 p-5 text-right text-3xl text-ff-emerald font-display focus:border-ff-emerald outline-none rounded-sm shadow-inner"
                placeholder="8"
                disabled={readOnly}
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-ff-emerald/20 text-2xl">🌙</div>
            </div>
          </div>
          <div className="pb-5 text-ff-silver/30 text-xs uppercase font-display tracking-widest italic">
            *計算ベース: 30.5 太陽日
          </div>
        </div>

        <div className="pt-8 border-t border-ff-silver/10 grid grid-cols-2 gap-8">
          <div className="bg-black/40 p-6 border border-ff-silver/10 rounded-sm">
            <div className="text-xs text-ff-silver/40 uppercase font-display tracking-widest mb-2">稼働サイクル (月)</div>
            <div className="text-3xl font-display font-bold text-ff-emerald">{workDays} <span className="text-sm opacity-50">日</span></div>
          </div>
          <div className="bg-ff-emerald/5 p-6 border border-ff-emerald/20 rounded-sm">
            <div className="text-xs text-ff-emerald/60 uppercase font-display tracking-widest mb-2">推定デイリー出力</div>
            <div className="text-3xl font-display font-bold text-ff-emerald">{cutsPerDay} <span className="text-sm opacity-50">U/日</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
