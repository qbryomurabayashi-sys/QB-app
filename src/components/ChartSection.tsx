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
    <div className={`grid grid-cols-1 ${hasManagerItems ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 w-full print-break-inside-avoid font-sans`}>
      <div className="bg-white border rounded-xl p-6 h-[400px] shadow-sm flex flex-col relative">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-4">
          バランスチャート
        </h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="最新" dataKey="A" stroke="#2563eb" strokeWidth={2} fill="#2563eb" fillOpacity={0.15} />
              {comparisonItems && <Radar name="比較用" dataKey="B" stroke="#f43f5e" strokeWidth={1} fill="#f43f5e" fillOpacity={0.05} strokeDasharray="4 4" />}
              <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', paddingTop: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {hasManagerItems && (
        <div className="bg-white border rounded-xl p-6 h-[400px] shadow-sm flex flex-col relative">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-4">
            店長スキル詳細
          </h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={managerRadarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#fb923c', fontSize: 9, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="店長評価" dataKey="A" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.15} />
                {comparisonItems && <Radar name="過去" dataKey="B" stroke="#64748b" strokeWidth={1} fill="#64748b" fillOpacity={0.05} strokeDasharray="4 4" />}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-xl p-6 h-[400px] shadow-sm flex flex-col relative">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-4">
          実績推移チャート
        </h3>
        <div className="flex-grow pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontWeight: 'bold' }} />
              <Line type="monotone" dataKey="cuts" name="月別実績" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} connectNulls activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="goal" name="目標ライン" stroke="#cbd5e1" strokeDasharray="4 4" dot={false} strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
