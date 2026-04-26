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
    <div className="space-y-6 sm:space-y-8 print-break-inside-avoid">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border rounded-xl p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">📊</span> 実績データ入力
          </h3>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border tracking-tight">月別カット数</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-10 no-print">
          {MONTHS.map((m) => {
            const isExcluded = excludedFromAverage[m.index];
            const hasValue = monthlyCuts[m.index] > 0;

            return (
              <div key={m.index} className="flex flex-col bg-gray-50 p-3 border rounded-lg hover:border-blue-300 transition-colors">
                <label className="text-[10px] text-gray-500 text-center mb-2 font-bold uppercase tracking-tight">{m.label}</label>
                <input
                  type="number"
                  pattern="\d*"
                  value={monthlyCuts[m.index] || ''}
                  onChange={(e) => handleMonthlyChange(m.index, parseInt(e.target.value) || 0)}
                  placeholder={hasValue ? "" : `${Math.round(average)}`}
                  className={`w-full bg-white border border-gray-200 p-2 text-center text-sm focus:border-blue-500 outline-none rounded transition-all font-bold ${hasValue ? 'text-gray-800' : 'text-gray-300 italic'}`}
                  disabled={readOnly}
                />
                <button
                  type="button"
                  onClick={() => toggleExclusion(m.index)}
                  className={`mt-2 flex items-center justify-center gap-1.5 text-[10px] py-1 px-2 rounded-md transition-all font-bold ${!isExcluded ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-200 text-gray-500'}`}
                  disabled={readOnly}
                >
                  {!isExcluded ? <CheckSquare size={12} /> : <Square size={12} />}
                  <span>{isExcluded ? '除外' : '対象'}</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">年間目標カット数</label>
            <div className="relative">
              <input
                type="number"
                pattern="\d*"
                value={data.goalCuts || ''}
                onChange={(e) => handleInputChange('goalCuts', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border-2 border-gray-100 p-4 text-right text-2xl text-gray-800 font-bold focus:border-blue-500 outline-none rounded-xl"
                placeholder="7000"
                disabled={readOnly}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 text-2xl">🚩</div>
            </div>
            <div className="text-[10px] text-gray-400 text-right flex items-center justify-end gap-2 uppercase font-bold">
              <span>目標スコア:</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 border border-blue-100 rounded-lg text-sm">{goalScoreCalculated}</span>
              <span>PTS</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-gray-400 mb-1 uppercase font-bold">現在の累計合計</div>
              <div className="text-2xl font-bold text-gray-800 text-right">{currentTotal.toLocaleString()} <span className="text-xs text-gray-400 ml-1">人</span></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-[10px] text-gray-400 uppercase font-bold">月平均</span>
              <span className="text-base font-bold text-blue-600">{average.toLocaleString()} <span className="text-[10px] opacity-70">人/月</span></span>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-[10px] text-blue-600/70 mb-1 font-bold uppercase tracking-tight">予測年間合計</div>
              <div className="text-3xl font-bold text-blue-900 text-right">{Math.round(predictedTotal).toLocaleString()} <span className="text-xs text-blue-600/50 ml-1">人</span></div>
            </div>
            <div className="flex justify-between items-center mt-4 border-t border-blue-200 pt-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">着地予測スコア</span>
              <span className="text-2xl font-bold text-orange-600">{predictionScore} <span className="text-xs">PTS</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border rounded-xl p-8 shadow-sm no-print"
      >
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calculator size={20} className="text-blue-600" /> 出力シミュレーター
        </h3>
        <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
          <div className="w-full sm:w-1/2">
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tight">月間休日数設定</label>
            <div className="relative">
              <input
                type="number"
                pattern="\d*"
                value={data.monthlyHolidays || ''}
                onChange={(e) => handleInputChange('monthlyHolidays', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-right text-2xl text-blue-600 font-bold focus:border-blue-500 outline-none rounded-xl"
                placeholder="8"
                disabled={readOnly}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 text-xl">📅</div>
            </div>
          </div>
          <div className="pb-4 text-gray-400 text-[10px] font-medium italic">
            *計算ベース: 30.5 日 / 月
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t font-bold">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-[10px] text-gray-400 uppercase mb-1">実質稼働日数 (月平均)</div>
            <div className="text-2xl text-blue-800">{workDays} <span className="text-xs opacity-60 ml-0.5">日</span></div>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-700">
            <div className="text-[10px] text-blue-600 uppercase mb-1">1日あたり必要カット数</div>
            <div className="text-2xl">{cutsPerDay} <span className="text-xs opacity-60 ml-0.5">人</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
