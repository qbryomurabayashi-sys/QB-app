import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AXES, MONTH_LABELS, MANAGER_AXES } from '../constants';
import { EvaluationItem, PerformanceData } from '../types';

interface PrintChartSectionProps {
  items: EvaluationItem[];
  performanceData: PerformanceData;
  performanceScore: number;
  type: 'radar' | 'manager-radar' | 'line';
  comparisonItems?: EvaluationItem[];
  comparisonPerformanceScore?: number;
}

export const PrintChartSection: React.FC<PrintChartSectionProps> = ({
  items,
  performanceData,
  performanceScore,
  type,
  comparisonItems,
  comparisonPerformanceScore
}) => {
  const radarData = React.useMemo(() => {
    return AXES.map((axis) => {
      const data: any = { subject: axis, fullMark: 100 };

      // Current Data (A)
      if (axis === '実績') {
        data.A = Math.min(100, Math.round((performanceScore / 50) * 100));
      } else {
        const axisItems = items.filter((i) => i.axis === axis && i.max > 0);
        if (axisItems.length === 0) data.A = 0;
        else {
          const currentSum = axisItems.reduce((sum, i) => sum + (i.score ?? 0), 0);
          const maxSum = axisItems.reduce((sum, i) => sum + i.max, 0);
          data.A = maxSum === 0 ? 0 : Math.round((currentSum / maxSum) * 100);
        }
      }

      // Comparison Data (B)
      if (comparisonItems) {
        if (axis === '実績') {
          data.B = Math.min(100, Math.round(((comparisonPerformanceScore || 0) / 50) * 100));
        } else {
          const compAxisItems = comparisonItems.filter((i) => i.axis === axis && i.max > 0);
          if (compAxisItems.length === 0) data.B = 0;
          else {
            const compSum = compAxisItems.reduce((sum, i) => sum + (i.score ?? 0), 0);
            const maxSum = compAxisItems.reduce((sum, i) => sum + i.max, 0);
            data.B = maxSum === 0 ? 0 : Math.round((compSum / maxSum) * 100);
          }
        }
      }
      return data;
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

  if (type === 'radar') {
    return (
      <RadarChart width={300} height={180} cx="50%" cy="50%" outerRadius="60%" data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 8, fontWeight: 'bold' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="今回" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} isAnimationActive={false} />
        {comparisonItems && <Radar name="前回" dataKey="B" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.1} strokeDasharray="3 3" isAnimationActive={false} />}
      </RadarChart>
    );
  }

  if (type === 'manager-radar') {
    return (
      <RadarChart width={300} height={180} cx="50%" cy="50%" outerRadius="55%" data={managerRadarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 7, fontWeight: 'bold' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="店長スキル" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} isAnimationActive={false} />
        {comparisonItems && <Radar name="前回" dataKey="B" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.1} strokeDasharray="3 3" isAnimationActive={false} />}
      </RadarChart>
    );
  }

  return (
    <LineChart width={300} height={180} data={lineChartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
      <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
      <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '8px', paddingTop: '0px' }} />
      <Line type="monotone" dataKey="cuts" name="実績" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} connectNulls isAnimationActive={false} />
      <Line type="monotone" dataKey="goal" name="目標" stroke="#9ca3af" strokeDasharray="4 4" dot={false} strokeWidth={1} isAnimationActive={false} />
    </LineChart>
  );
};
