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

  const Meter = ({ label, score, max, color = 'bg-ff-emerald' }: { label: string, score: number, max: number, color?: string }) => {
    const percentage = Math.max(0, Math.min(100, (score / max) * 100));
    return (
      <div className="mb-6 font-display">
        <div className="flex justify-between text-xs mb-2 uppercase tracking-widest">
          <span className="text-ff-silver/60 text-sm">{label}</span>
          <span className="text-ff-silver text-sm">{score} / {max}</span>
        </div>
        <div className="ff-gauge-bg h-4">
          <div 
            className={`ff-gauge-fill h-full ${color} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ff-window p-10 relative overflow-hidden"
      >
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ff-gold/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          {/* HERO_STATS */}
          <div>
            <div className="flex items-center gap-4 mb-8 border-b border-ff-silver/20 pb-4">
              <div className="w-3 h-3 bg-ff-emerald rounded-full animate-pulse" />
              <span className="text-lg font-display font-bold text-ff-gold uppercase tracking-[0.2em]">英雄の属性</span>
            </div>
            <div className="space-y-6">
              <Meter label="関係性・絆" score={relationshipScore} max={51} />
              <Meter label="接客の極み" score={customerServiceScore} max={49} color="bg-ff-sky" />
              <Meter label="技術の練度" score={technicalScore} max={50} color="bg-ff-gold" />
              <Meter label="戦いの成果" score={performanceScore} max={50} color="bg-ff-red" />
              
              <div className="pt-8 mt-8 border-t border-ff-silver/20">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <span className="text-xs text-ff-silver/40 uppercase font-display tracking-widest block">合計パワーレベル</span>
                    <span className="text-ff-gold font-display font-bold text-lg tracking-widest">クリスタル共鳴</span>
                  </div>
                  <div className="text-right">
                    <span className="text-6xl font-display font-bold text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{totalScore200}</span>
                    <span className="text-lg text-ff-silver/60 ml-3 font-display">/ 200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COMMANDER_STATS */}
          {isManagerUnlocked ? (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8 border-b border-ff-silver/20 pb-4">
                <div className="w-3 h-3 bg-ff-gold rounded-full animate-pulse" />
                <span className="text-lg font-display font-bold text-ff-gold uppercase tracking-[0.2em]">指揮官の資質</span>
              </div>
              <div className="space-y-6">
                <Meter label="統治と奉仕" score={mgrCol1} max={32} color="bg-ff-gold" />
                <Meter label="軍団と戦略" score={mgrCol2} max={28} color="bg-ff-gold" />
                <Meter label="賢者の知恵" score={mgrCol3} max={24} color="bg-ff-gold" />
                <Meter label="名誉と規律" score={mgrCol4} max={56} color="bg-ff-gold" />
                
                <div className="pt-8 mt-8 border-t border-ff-silver/20">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="text-xs text-ff-silver/40 uppercase font-display tracking-widest block">指導者ランク</span>
                      <span className="text-ff-gold font-display font-bold text-lg tracking-widest">指揮効率</span>
                    </div>
                    <div className="text-right">
                      <span className="text-6xl font-display font-bold text-ff-gold leading-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">{managerTotal}</span>
                      <span className="text-lg text-ff-silver/60 ml-3 font-display">/ 140</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-ff-silver/10 bg-black/20 p-16 text-center rounded-lg">
              <div className="w-20 h-20 rounded-full border-2 border-ff-silver/20 flex items-center justify-center mb-6">
                <span className="text-4xl text-ff-silver/20">🔒</span>
              </div>
              <div className="text-ff-silver/40 text-lg font-display font-bold uppercase tracking-[0.2em] mb-4">指揮官データ封印中</div>
              <div className="text-ff-silver/20 text-sm uppercase italic">「王家の紋章を持つ者のみが、この記録を閲覧できます。」</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
