import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, MapPin } from 'lucide-react';
import { StaffSummary, EvaluationItem, PerformanceData } from '../types';
import { calculatePerformanceMetrics, calculateCutScore } from '../utils';
import { INITIAL_ITEMS } from '../constants';

interface RankingPageProps {
  staffList: StaffSummary[];
  onBack: () => void;
  onSelect: (id: string) => void;
}

type RankingCategory = 'total' | 'relation' | 'service' | 'tech' | 'cuts';

interface StaffRankData {
  id: string;
  name: string;
  store: string;
  itemTotalScore: number;
  relationScore: number;
  serviceScore: number;
  techScore: number;
  predictedCutCount: number;
  actualCutCount: number;
  updatedAt: number;
}

const DATA_PREFIX = 'qb_data_';

const getCategoryScore = (items: EvaluationItem[], categoryName: string) => {
  return items.filter(i => i.category === categoryName).reduce((sum, i) => sum + (i.score || 0), 0);
};

export const RankingPage: React.FC<RankingPageProps> = ({ staffList, onBack, onSelect }) => {
  const [activeTab, setActiveTab] = useState<RankingCategory>('total');
  const [cutMode, setCutMode] = useState<'predicted' | 'actual'>('predicted');
  const [rankingData, setRankingData] = useState<StaffRankData[]>([]);

  useEffect(() => {
    // データをロード
    const data: StaffRankData[] = staffList.map(staff => {
      let itemTotalScore = 0;
      let relationScore = 0;
      let serviceScore = 0;
      let techScore = 0;
      let predictedCutCount = 0;
      let actualCutCount = 0;

      try {
        const raw = localStorage.getItem(DATA_PREFIX + staff.id);
        if (raw) {
          const parsed = JSON.parse(raw);
          const items: EvaluationItem[] = parsed.items || INITIAL_ITEMS;
          const perf: PerformanceData = parsed.metadata?.performance || { monthlyCuts: [], excludedFromAverage: [], goalCuts: 0 };

          relationScore = getCategoryScore(items, '関係性');
          serviceScore = getCategoryScore(items, '接客');
          techScore = getCategoryScore(items, '技術');
          itemTotalScore = items.reduce((sum, i) => sum + (i.score || 0), 0);

          const { predictedTotal, currentTotal } = calculatePerformanceMetrics(
            perf.monthlyCuts || new Array(12).fill(0),
            perf.excludedFromAverage || new Array(12).fill(false)
          );
          predictedCutCount = predictedTotal;
          actualCutCount = currentTotal;
        }
      } catch (e) {
        console.error("Failed to load staff data for ranking", e);
      }

      return {
        id: staff.id,
        name: staff.name,
        store: staff.store,
        itemTotalScore,
        relationScore,
        serviceScore,
        techScore,
        predictedCutCount,
        actualCutCount,
        updatedAt: staff.updatedAt
      };
    });

    setRankingData(data);
  }, [staffList]);

  // 動的なスコア計算
  const getStaffTotalScore = (staff: StaffRankData, mode: 'predicted' | 'actual') => {
    const cutScore = calculateCutScore(mode === 'predicted' ? staff.predictedCutCount : staff.actualCutCount);
    return staff.itemTotalScore + cutScore;
  };

  // 最新のものを優先するため、updatedAtでも若干補助ソートする
  const sortedData = useMemo(() => {
    return [...rankingData].sort((a, b) => {
      let diff = 0;
      switch (activeTab) {
        case 'total': diff = getStaffTotalScore(b, cutMode) - getStaffTotalScore(a, cutMode); break;
        case 'relation': diff = b.relationScore - a.relationScore; break;
        case 'service': diff = b.serviceScore - a.serviceScore; break;
        case 'tech': diff = b.techScore - a.techScore; break;
        case 'cuts': diff = cutMode === 'predicted' ? b.predictedCutCount - a.predictedCutCount : b.actualCutCount - a.actualCutCount; break;
      }
      if (diff === 0) {
        return b.updatedAt - a.updatedAt;
      }
      return diff;
    });
  }, [rankingData, activeTab, cutMode]);

  const tabs: { key: RankingCategory; label: string }[] = [
    { key: 'total', label: '総合得点' },
    { key: 'relation', label: '関係性' },
    { key: 'service', label: '接客' },
    { key: 'tech', label: '技術' },
    { key: 'cuts', label: 'カット人数' }
  ];

  const getValueLabel = (item: StaffRankData) => {
    switch (activeTab) {
      case 'total': return `${getStaffTotalScore(item, cutMode)} Pt`;
      case 'relation': return `${item.relationScore} Pt`;
      case 'service': return `${item.serviceScore} Pt`;
      case 'tech': return `${item.techScore} Pt`;
      case 'cuts': return `${(cutMode === 'predicted' ? item.predictedCutCount : item.actualCutCount).toLocaleString()} 人`;
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-3 text-white">
          <button onClick={onBack} className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <Trophy size={24} className="text-yellow-400" />
          <h1 className="text-xl font-bold tracking-tight">スタッフランキング</h1>
        </div>
      </header>

      <div className="flex z-40 bg-white shadow-sm overflow-x-auto border-b sticky top-[72px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
              activeTab === tab.key ? 'border-blue-800 text-blue-900 bg-blue-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'cuts' || activeTab === 'total') && (
        <div className="bg-white border-b px-4 py-3 flex items-center justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full max-w-sm">
            <button
              onClick={() => setCutMode('predicted')}
              className={`flex-1 text-sm py-1.5 rounded-md font-bold transition-colors ${cutMode === 'predicted' ? 'bg-white shadow-sm text-blue-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              予想値
            </button>
            <button
              onClick={() => setCutMode('actual')}
              className={`flex-1 text-sm py-1.5 rounded-md font-bold transition-colors ${cutMode === 'actual' ? 'bg-white shadow-sm text-blue-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              実数値
            </button>
          </div>
        </div>
      )}

      <main className="p-4 sm:p-6 max-w-5xl mx-auto w-full flex-grow">
        {sortedData.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            データがありません。
          </div>
        ) : (
          <div className="space-y-3">
            {sortedData.map((staff, index) => {
              // Calculate actual rank (same value = same rank)
              let rank = index + 1;
              if (index > 0) {
                const prevStaff = sortedData[index - 1];
                let isSameScore = false;
                switch (activeTab) {
                  case 'total': isSameScore = getStaffTotalScore(staff, cutMode) === getStaffTotalScore(prevStaff, cutMode); break;
                  case 'relation': isSameScore = staff.relationScore === prevStaff.relationScore; break;
                  case 'service': isSameScore = staff.serviceScore === prevStaff.serviceScore; break;
                  case 'tech': isSameScore = staff.techScore === prevStaff.techScore; break;
                  case 'cuts': isSameScore = cutMode === 'predicted' ? staff.predictedCutCount === prevStaff.predictedCutCount : staff.actualCutCount === prevStaff.actualCutCount; break;
                }
                if (isSameScore) {
                  // Find the first index with this score
                  const firstIndex = sortedData.findIndex((s) => {
                    switch (activeTab) {
                      case 'total': return getStaffTotalScore(s, cutMode) === getStaffTotalScore(staff, cutMode);
                      case 'relation': return s.relationScore === staff.relationScore;
                      case 'service': return s.serviceScore === staff.serviceScore;
                      case 'tech': return s.techScore === staff.techScore;
                      case 'cuts': return cutMode === 'predicted' ? s.predictedCutCount === staff.predictedCutCount : s.actualCutCount === staff.actualCutCount;
                    }
                    return false;
                  });
                  rank = firstIndex + 1;
                }
              }

              return (
                <div
                  key={staff.id}
                  onClick={() => onSelect(staff.id)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                >
                  {/* 順位の表示 */}
                  <div className="w-12 flex-shrink-0 flex items-center justify-center">
                    {rank === 1 && <Medal size={32} className="text-yellow-500" />}
                    {rank === 2 && <Medal size={28} className="text-gray-400" />}
                    {rank === 3 && <Medal size={28} className="text-amber-600" />}
                    {rank > 3 && <span className="text-xl font-bold text-gray-400">{rank}</span>}
                  </div>

                  {/* スタッフ情報 */}
                  <div className="flex-grow ml-4 border-l pl-4 border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">{staff.name || '名称未設定'}</h3>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <MapPin size={12} />
                      <span>{staff.store || '店舗未設定'}</span>
                    </div>
                  </div>

                  {/* スコア表示 */}
                  <div className="text-right">
                    <div className="text-2xl font-black tracking-tight text-blue-900">
                      {getValueLabel(staff)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
