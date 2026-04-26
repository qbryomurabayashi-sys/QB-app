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
        <RadarChart width={400} height={250} cx="50%" cy="50%" outerRadius="60%" data={radarData}>
          <PolarGrid stroke="#cbd5e1" strokeOpacity={0.5} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 10, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="現在の評価" dataKey="A" stroke="#2563eb" strokeWidth={2} fill="#3b82f6" fillOpacity={0.2} isAnimationActive={false} />
          {comparisonItems && <Radar name="過去の評価" dataKey="B" stroke="#94a3b8" strokeWidth={1} fill="#e2e8f0" fillOpacity={0.3} strokeDasharray="3 3" isAnimationActive={false} />}
        </RadarChart>
      );
    }
  
    if (type === 'manager-radar') {
      return (
        <RadarChart width={400} height={250} cx="50%" cy="50%" outerRadius="55%" data={managerRadarData}>
          <PolarGrid stroke="#cbd5e1" strokeOpacity={0.5} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 9, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="店長スキル" dataKey="A" stroke="#059669" strokeWidth={2} fill="#10b981" fillOpacity={0.2} isAnimationActive={false} />
          {comparisonItems && <Radar name="過去のスキル" dataKey="B" stroke="#94a3b8" strokeWidth={1} fill="#e2e8f0" fillOpacity={0.3} strokeDasharray="3 3" isAnimationActive={false} />}
        </RadarChart>
      );
    }
  
    return (
      <LineChart width={400} height={250} data={lineChartData} margin={{ top: 5, right: 15, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.5} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={35} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '0px' }} />
        <Line type="stepAfter" dataKey="cuts" name="実績" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} connectNulls isAnimationActive={false} />
        <Line type="monotone" dataKey="goal" name="目標" stroke="#94a3b8" strokeDasharray="4 4" dot={false} strokeWidth={1} isAnimationActive={false} />
      </LineChart>
    );
};
