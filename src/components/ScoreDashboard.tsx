import React from 'react';
import { motion } from 'motion/react';
import { EvaluationItem, PerformanceData } from '../types';

interface ScoreDashboardProps {
  items: EvaluationItem[];
  performanceScore: number;
  performanceData: PerformanceData;
  isManagerUnlocked: boolean;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ items, performanceScore, isManagerUnlocked }) => {
  const getScore = (i: EvaluationItem) => i.score ?? 0;

  // Calculate category scores
  const relationshipScore = items.filter(i => i.category === '関係性').reduce((sum, i) => sum + getScore(i), 0);
  const customerServiceScore = items.filter(i => i.category === '接客').reduce((sum, i) => sum + getScore(i), 0);
  const technicalScore = items.filter(i => i.category === '技術').reduce((sum, i) => sum + getScore(i), 0);

  // Total score calculation (stylist only)
  const totalScore200 = relationshipScore + customerServiceScore + technicalScore + performanceScore;

  const managerItems = items.filter(i => i.category === '店長');
  const managerTotal = managerItems.reduce((sum, i) => sum + getScore(i), 0);

  // Group manager scores for display
  const mgrOps = managerItems.filter(i => i.subCategory === '運営管理スキル').reduce((sum, i) => sum + getScore(i), 0);
  const mgrCust = managerItems.filter(i => i.subCategory === '顧客サービススキル').reduce((sum, i) => sum + getScore(i), 0);
  const mgrTeam = managerItems.filter(i => i.subCategory === 'チームマネジメントスキル').reduce((sum, i) => sum + getScore(i), 0);
  const mgrStrat = managerItems.filter(i => i.subCategory === '戦略思考スキル').reduce((sum, i) => sum + getScore(i), 0);
  const mgrProb = managerItems.filter(i => i.subCategory === '問題解決スキル').reduce((sum, i) => sum + getScore(i), 0);
  const mgrPersonal = managerItems.filter(i => i.subCategory === '個人の属性').reduce((sum, i) => sum + getScore(i), 0);
  const mgrComp = managerItems.filter(i => i.subCategory === '管理責任・コンプライアンス').reduce((sum, i) => sum + getScore(i), 0);

  const mgrCol1 = mgrOps + mgrCust; // 運営・顧客
  const mgrCol2 = mgrTeam + mgrStrat; // チーム・戦略
  const mgrCol3 = mgrProb; // 問題解決
  const mgrCol4 = mgrPersonal + mgrComp; // その他(行動・コンプラ)

  const Meter = ({ label, score, max, color = 'bg-blue-600' }: { label: string, score: number, max: number, color?: string }) => {
    const percentage = Math.max(0, Math.min(100, (score / max) * 100));
    return (
      <div className="mb-4">
        <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400">
          <span className="uppercase">{label}</span>
          <span>{score} / {max}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Staff Stats */}
          <div>
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span className="text-sm font-bold text-gray-800 uppercase tracking-tight">スタッフ評価詳細</span>
            </div>
            <div className="space-y-4">
              <Meter label="関係性" score={relationshipScore} max={51} color="bg-blue-500" />
              <Meter label="接客" score={customerServiceScore} max={49} color="bg-cyan-500" />
              <Meter label="技術" score={technicalScore} max={50} color="bg-indigo-500" />
              <Meter label="実績" score={performanceScore} max={50} color="bg-blue-700" />
              
              <div className="pt-6 mt-6 border-t">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">合計スコア</span>
                    <span className="text-gray-800 font-bold text-sm tracking-tight text-xl">総合評価点</span>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-bold text-blue-900 leading-none">{totalScore200}</span>
                    <span className="text-sm text-gray-400 ml-2">/ 200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manager Stats */}
          {isManagerUnlocked ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm font-bold text-gray-800 uppercase tracking-tight">店長評価詳細</span>
              </div>
              <div className="space-y-4">
                <Meter label="運営・顧客" score={mgrCol1} max={32} color="bg-orange-400" />
                <Meter label="チーム・戦略" score={mgrCol2} max={28} color="bg-orange-500" />
                <Meter label="問題解決" score={mgrCol3} max={24} color="bg-orange-600" />
                <Meter label="その他(行動・コンプラ)" score={mgrCol4} max={56} color="bg-orange-700" />
                
                <div className="pt-6 mt-6 border-t">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">マネジメントスコア</span>
                      <span className="text-gray-800 font-bold text-sm tracking-tight text-xl">店長評価点</span>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-bold text-orange-600 leading-none">{managerTotal}</span>
                      <span className="text-sm text-gray-400 ml-2">/ 140</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 border-2 border-dashed border-gray-200 p-12 text-center rounded-xl">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <span className="text-2xl text-gray-300">🔒</span>
              </div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-tight mb-2">店長評価データ非表示</div>
              <div className="text-gray-400 text-[10px]">パスワードを入力して閲覧を許可してください。</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
