import React from 'react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AXES, MANAGER_AXES, MONTH_LABELS } from '../constants';
import { EvaluationItem, PerformanceData } from '../types';

interface ChartSectionProps {
  items: EvaluationItem[];
  performanceData: PerformanceData;
  performanceScore: number;
  comparisonItems?: EvaluationItem[];
  comparisonPerformanceScore?: number;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  items,
  performanceData,
  performanceScore,
  comparisonItems,
  comparisonPerformanceScore
}) => {
  const radarData = React.useMemo(() => {
    const staffAxes = AXES.filter(axis => !MANAGER_AXES.includes(axis) && axis !== '店長スキル');
    return staffAxes.map((axis) => {
      // Current Data (A)
      let percentageA = 0;
      if (axis === '実績') {
        percentageA = Math.min(100, Math.round((performanceScore / 50) * 100));
      } else {
        const axisItems = items.filter((i) => i.axis === axis && i.max > 0);
        if (axisItems.length > 0) {
          const currentSum = axisItems.reduce((sum, i) => sum + (i.score ?? 0), 0);
          const maxSum = axisItems.reduce((sum, i) => sum + i.max, 0);
          percentageA = maxSum === 0 ? 0 : Math.round((currentSum / maxSum) * 100);
        }
      }

      // Comparison Data (B)
      let percentageB = 0;
      if (comparisonItems) {
        if (axis === '実績') {
          percentageB = Math.min(100, Math.round(((comparisonPerformanceScore || 0) / 50) * 100));
        } else {
          const axisItems = comparisonItems.filter((i) => i.axis === axis && i.max > 0);
          if (axisItems.length > 0) {
            const currentSum = axisItems.reduce((sum, i) => sum + (i.score ?? 0), 0);
            const maxSum = axisItems.reduce((sum, i) => sum + i.max, 0);
            percentageB = maxSum === 0 ? 0 : Math.round((currentSum / maxSum) * 100);
          }
        }
      }

      return { subject: axis, A: percentageA, B: percentageB, fullMark: 100 };
    });
  }, [items, performanceScore, comparisonItems, comparisonPerformanceScore]);

  const lineChartData = React.useMemo(() => {
    const monthlyGoal = performanceData.goalCuts > 0 ? Math.round(performanceData.goalCuts / 12) : 0;
    return MONTH_LABELS.map((label, index) => ({
      name: label,
      cuts: performanceData.monthlyCuts[index] > 0 ? performanceData.monthlyCuts[index] : null,
      goal: monthlyGoal
    }));
  }, [performanceData]);

  const managerRadarData = React.useMemo(() => {
    return MANAGER_AXES.map((subCat) => {
      const subCatItems = items.filter((i) => i.category === '店長' && i.subCategory === subCat && i.max > 0);
      if (subCatItems.length === 0) {
        return { subject: subCat, A: 0, fullMark: 100 };
      }
      const currentSum = subCatItems.reduce((sum, i) => sum + (i.score ?? 0), 0);
      const maxSum = subCatItems.reduce((sum, i) => sum + i.max, 0);
      const percentage = maxSum === 0 ? 0 : Math.round((currentSum / maxSum) * 100);
      const data: any = { subject: subCat, A: percentage, fullMark: 100 };

      // Comparison Data
      if (comparisonItems) {
        const compSubCatItems = comparisonItems.filter((i) => i.category === '店長' && i.subCategory === subCat && i.max > 0);
        if (compSubCatItems.length === 0) data.B = 0;
        else {
          const compSum = compSubCatItems.reduce((sum, i) => sum + (i.score ?? 0), 0);
          const compMax = compSubCatItems.reduce((sum, i) => sum + i.max, 0);
          data.B = compMax === 0 ? 0 : Math.round((compSum / compMax) * 100);
        }
      }
      return data;
    });
  }, [items, comparisonItems]);

  const hasManagerItems = React.useMemo(() => items.some(i => i.category === '店長' && i.score !== null), [items]);

  return (
    <div className={`grid grid-cols-1 ${hasManagerItems ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-10 w-full print-break-inside-avoid font-serif relative z-10`}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ff-window !p-6 h-[450px] relative overflow-hidden group"
      >
        <h3 className="absolute top-6 left-8 text-sm font-display font-bold text-ff-gold uppercase tracking-[0.2em] z-20">
          <span className="animate-pulse mr-2">💠</span> 英雄の共鳴レーダー
        </h3>
        <div className="h-full pt-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="rgba(224, 224, 224, 0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#E0E0E0', fontSize: 12, fontWeight: 'bold', fontFamily: 'Cinzel' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="現在の伝説" dataKey="A" stroke="#50C878" strokeWidth={4} fill="#50C878" fillOpacity={0.3} />
              {comparisonItems && <Radar name="過去の伝説" dataKey="B" stroke="#FF4444" strokeWidth={2} fill="#FF4444" fillOpacity={0.1} strokeDasharray="4 4" />}
              <Legend wrapperStyle={{ fontSize: '12px', color: '#D4AF37', fontFamily: 'Cinzel', paddingTop: '15px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {hasManagerItems && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="ff-window !p-6 h-[450px] relative overflow-hidden group"
        >
          <h3 className="absolute top-6 left-8 text-sm font-display font-bold text-ff-gold uppercase tracking-[0.2em] z-20">
            <span className="animate-pulse mr-2">💠</span> 指揮官の練度レーダー
          </h3>
          <div className="h-full pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={managerRadarData}>
                <PolarGrid stroke="rgba(224, 224, 224, 0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#D4AF37', fontSize: 10, fontWeight: 'bold', fontFamily: 'Cinzel' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="指揮レベル" dataKey="A" stroke="#D4AF37" strokeWidth={4} fill="#D4AF37" fillOpacity={0.3} />
                {comparisonItems && <Radar name="過去の指揮" dataKey="B" stroke="#FF4444" strokeWidth={2} fill="#FF4444" fillOpacity={0.1} strokeDasharray="4 4" />}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="ff-window !p-6 h-[450px] relative overflow-hidden group"
      >
        <h3 className="absolute top-6 left-8 text-sm font-display font-bold text-ff-gold uppercase tracking-[0.2em] z-20">
          <span className="animate-pulse mr-2">💠</span> 年代記の流転チャート
        </h3>
        <div className="h-full pt-16 pr-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 5, right: 15, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(224, 224, 224, 0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#E0E0E0', fontFamily: 'Cinzel' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#E0E0E0', fontFamily: 'Cinzel' }} axisLine={false} tickLine={false} width={45} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '15px', color: '#D4AF37', fontFamily: 'Cinzel' }} />
              <Line type="stepAfter" dataKey="cuts" name="実績の記録" stroke="#50C878" strokeWidth={4} dot={{ r: 5, fill: '#50C878', strokeWidth: 0 }} connectNulls />
              <Line type="monotone" dataKey="goal" name="運命の目標" stroke="#D4AF37" strokeDasharray="8 4" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
