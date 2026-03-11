import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store, History, Download, Printer, RefreshCw, Lock,
  ArrowUp, Save, BarChart3, ChevronDown, ChevronUp, Layers, Users
} from 'lucide-react';
import { CATEGORIES, INITIAL_ITEMS, AXES, MONTH_LABELS } from './constants';
import { Metadata, EvaluationItem, StaffSummary, Category, Incident, PerformanceData } from './types';
import { calculatePerformanceMetrics } from './utils';
import { TopPage } from './components/TopPage';
import { MenuPage } from './components/MenuPage';
import { HistorySidebar } from './components/HistorySidebar';
import { PasswordModal } from './components/PasswordModal';
import { ScoreDashboard } from './components/ScoreDashboard';
import { ChartSection } from './components/ChartSection';
import { PrintChartSection } from './components/PrintChartSection';
import { EvaluationCard } from './components/EvaluationCard';
import { PerformanceEvaluation } from './components/PerformanceEvaluation';
import { CriteriaGuide } from './components/CriteriaGuide';
import { ScheduleAlert } from './components/ScheduleAlert';

import { ActionPlan } from './components/ActionPlan';
import { VersionInfo } from './components/VersionInfo';
import { OperationGuide } from './components/OperationGuide';
import { FantasyLoader } from './components/FantasyLoader';

const STAFF_INDEX_KEY = 'qb_staff_index_v1';
const DATA_PREFIX = 'qb_data_';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};

const mergeWithInitialItems = (savedItems: any[]) => {
  if (!savedItems || !Array.isArray(savedItems)) return INITIAL_ITEMS;
  return INITIAL_ITEMS.map(initialItem => {
    const savedItem = savedItems.find(i => i.no === initialItem.no);
    if (savedItem) {
      return {
        ...initialItem,
        score: savedItem.score,
        memo: savedItem.memo,
        incidents: savedItem.incidents
      };
    }
    return initialItem;
  });
};

const ScrollToTopButton = () => {
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <button onClick={scrollToTop} className="fixed bottom-6 right-4 ff-window !p-4 text-ff-gold shadow-2xl hover:scale-110 transition-all z-40 no-print active:scale-95 group">
      <span className="ff-cursor"></span>
      <ArrowUp size={24} />
    </button>
  );
};

export default function App() {
  const [staffList, setStaffList] = useState<StaffSummary[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'TOP' | 'MENU' | 'FORM' | 'ACTION_PLAN' | 'VERSION_INFO' | 'OPERATION_GUIDE'>('TOP');
  const [selectedStaffSummary, setSelectedStaffSummary] = useState<StaffSummary | null>(null);

  const [items, setItems] = useState<EvaluationItem[]>(INITIAL_ITEMS);
  const [metadata, setMetadata] = useState<Metadata>({
    id: '', store: '', name: '', employeeId: '', evaluator: '',
    date: new Date().toISOString().split('T')[0],
    updatedAt: Date.now(),
    performance: { monthlyCuts: new Array(12).fill(0), excludedFromAverage: new Array(12).fill(false), goalCuts: 0, goalScore: 0, monthlyHolidays: 0 }
  });
  const [performanceScore, setPerformanceScore] = useState(0);

  const [activeTab, setActiveTab] = useState<Category>('関係性');
  const [isStoreManagerUnlocked, setIsStoreManagerUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(true);
  const [isChartCollapsed, setIsChartCollapsed] = useState(false);

  const [isBatchPrinting, setIsBatchPrinting] = useState(false);
  const [batchPrintData, setBatchPrintData] = useState<any[]>([]);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const rawIndex = localStorage.getItem(STAFF_INDEX_KEY);
      let index = rawIndex ? JSON.parse(rawIndex) : [];
      index.sort((a: any, b: any) => b.updatedAt - a.updatedAt);
      setStaffList(index);
    } catch (e) {
      console.error("Init failed", e);
    }
  }, []);

  const historyList = useMemo(() => {
    if (!metadata.name || !metadata.store) return [];
    const matches = staffList.filter(s => s.name === metadata.name && s.store === metadata.store);
    return matches.map(s => {
      try {
        const raw = localStorage.getItem(DATA_PREFIX + s.id);
        if (raw) {
          const d = JSON.parse(raw);
          const itemTotal = d.items ? d.items.reduce((sum: number, i: any) => sum + (i.score ?? 0), 0) : 0;
          const pScore = d.performanceScore || 0;
          return {
            ...s,
            performanceScore: pScore,
            evaluator: d.metadata?.evaluator,
            employeeId: d.metadata?.employeeId,
            totalScore: itemTotal + pScore
          };
        }
      } catch (e) {
        console.error("History detail load failed", e);
      }
      return s;
    });
  }, [staffList, metadata.name, metadata.store]);

  const saveToStorage = useCallback((id: string, meta: Metadata, currentItems: EvaluationItem[], pScore: number) => {
    const dataToSave = {
      metadata: { ...meta, updatedAt: Date.now() },
      items: currentItems,
      performanceScore: pScore
    };
    localStorage.setItem(DATA_PREFIX + id, JSON.stringify(dataToSave));
    setStaffList(prev => {
      const newList = prev.map(s => s.id === id ? {
        ...s, name: meta.name, store: meta.store, date: meta.date, updatedAt: Date.now()
      } : s).sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(STAFF_INDEX_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  useEffect(() => {
    if (currentId && !isReadOnly) {
      const timer = setTimeout(() => {
        saveToStorage(currentId, metadata, items, performanceScore);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [items, metadata, performanceScore, currentId, isReadOnly, saveToStorage]);

  useEffect(() => {
    if (isBatchPrinting && batchPrintData.length > 0) {
      const timer = setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.error("Print failed", e);
        } finally {
          setIsBatchPrinting(false);
          setBatchPrintData([]);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBatchPrinting, batchPrintData]);

  const createNewStaff = () => {
    const newId = generateId();
    const newMeta: Metadata = {
      id: newId, store: '', name: '', employeeId: '', evaluator: '',
      date: new Date().toISOString().split('T')[0],
      updatedAt: Date.now(),
      performance: { monthlyCuts: new Array(12).fill(0), excludedFromAverage: new Array(12).fill(false), goalCuts: 0, goalScore: 0, monthlyHolidays: 0 }
    };
    const newItems = JSON.parse(JSON.stringify(INITIAL_ITEMS));
    setMetadata(newMeta);
    setItems(newItems);
    setPerformanceScore(5);
    setCurrentId(newId);
    setViewMode('FORM');
    setIsReadOnly(false);
    setIsStoreManagerUnlocked(false);
    setActiveTab('関係性');
    const newSummary = { id: newId, name: '', store: '', date: newMeta.date, updatedAt: Date.now() };
    const newList = [newSummary, ...staffList];
    setStaffList(newList);
    localStorage.setItem(STAFF_INDEX_KEY, JSON.stringify(newList));
    saveToStorage(newId, newMeta, newItems, 5);
  };

  const createNewFromSummary = (summary: StaffSummary) => {
    const prevRaw = localStorage.getItem(DATA_PREFIX + summary.id);
    let prevMeta: any = {};
    if (prevRaw) {
      try {
        const prevData = JSON.parse(prevRaw);
        prevMeta = prevData.metadata || {};
      } catch (e) {
        console.error('Failed to load previous data for new', e);
      }
    }

    const newId = generateId();
    const newMeta: Metadata = {
      id: newId, store: summary.store, name: summary.name,
      employeeId: prevMeta.employeeId || '',
      evaluator: prevMeta.evaluator || '',
      date: new Date().toISOString().split('T')[0],
      updatedAt: Date.now(),
      performance: { monthlyCuts: new Array(12).fill(0), excludedFromAverage: new Array(12).fill(false), goalCuts: 0, goalScore: 0, monthlyHolidays: 0 }
    };
    const newItems = JSON.parse(JSON.stringify(INITIAL_ITEMS));
    setMetadata(newMeta);
    setItems(newItems);
    setPerformanceScore(5);
    setCurrentId(newId);
    setViewMode('FORM');
    setIsReadOnly(false);
    setIsStoreManagerUnlocked(false);
    setActiveTab('関係性');
    const newSummary = { id: newId, name: summary.name, store: summary.store, date: newMeta.date, updatedAt: Date.now() };
    const newList = [newSummary, ...staffList];
    setStaffList(newList);
    localStorage.setItem(STAFF_INDEX_KEY, JSON.stringify(newList));
    saveToStorage(newId, newMeta, newItems, 5);
  };

  const loadStaffData = (id: string) => {
    try {
      const raw = localStorage.getItem(DATA_PREFIX + id);
      if (raw) {
        const data = JSON.parse(raw);
        setMetadata({
          ...data.metadata,
          performance: {
            monthlyCuts: new Array(12).fill(0),
            excludedFromAverage: new Array(12).fill(false),
            goalCuts: 0,
            goalScore: 0,
            monthlyHolidays: 0,
            ...data.metadata?.performance
          }
        });
        const mergedItems = mergeWithInitialItems(data.items);
        setItems(mergedItems);
        setPerformanceScore(data.performanceScore || 5);
        setCurrentId(id);
        setIsStoreManagerUnlocked(mergedItems.some((i: any) => i.category === '店長' && i.score !== null));
        setViewMode('FORM');
        setIsReadOnly(false);
      }
    } catch (e) {
      console.error("Load failed", e);
    }
  };

  const deleteStaff = (id: string) => {
    if (!window.confirm("本当にこのスタッフのデータを削除しますか？")) return;
    const newList = staffList.filter(s => s.id !== id);
    setStaffList(newList);
    localStorage.setItem(STAFF_INDEX_KEY, JSON.stringify(newList));
    localStorage.removeItem(DATA_PREFIX + id);
    if (currentId === id) {
      setCurrentId(null);
      setViewMode('TOP');
    }
  };

  const handleUpdateScore = useCallback((no: number, newScore: number) => {
    setItems((prev) =>
      prev.map((item) => (item.no === no ? { ...item, score: newScore } : item))
    );
  }, []);

  const handleUpdateMemo = useCallback((no: number, newMemoString: string) => {
    setItems((prev) =>
      prev.map((item) => (item.no === no ? { ...item, memo: newMemoString } : item))
    );
  }, []);

  const handleUpdateIncidents = useCallback((no: number, newIncidents: Incident[]) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.no !== no) return item;
        let total = 0;
        if (newIncidents && newIncidents.length > 0) {
          total = newIncidents.reduce((sum, inc) => sum + (inc.deduction || 0) + (inc.improvement || 0), 0);
        }
        const finalScore = Math.min(0, total);
        return { ...item, incidents: newIncidents, score: finalScore };
      })
    );
  }, []);

  const handlePerformanceUpdate = useCallback((newData: PerformanceData) => {
    setMetadata(prev => ({ ...prev, performance: newData }));
  }, []);

  const handleTabChange = (cat: Category) => {
    if (cat === '店長' && !isStoreManagerUnlocked) {
      setShowPasswordModal(true);
    } else {
      setActiveTab(cat);
    }
  };

  const handleDownloadCSV = useCallback(() => {
    let csvContent = '\uFEFF';
    csvContent += `店舗名: ${metadata.store}, スタッフ氏名: ${metadata.name}, 社員番号: ${metadata.employeeId}, 日付: ${metadata.date}\n\n`;
    csvContent += 'No,大項目,小項目,評価内容,点数,最大点,メモ\n';
    items.forEach((row) => {
      const scoreDisplay = row.score !== null ? row.score : "未記入";
      const memoText = row.memo ? `"${row.memo.replace(/"/g, '""')}"` : "";
      csvContent += `${row.no},${row.category},${row.subCategory} - ${row.item},"${row.desc.replace(/"/g, '""')}",${scoreDisplay},${row.max},${memoText}\n`;
    });
    const totalScore = items.reduce((sum, item) => sum + (item.score ?? 0), 0) + performanceScore;
    csvContent += `,,,,,,合計スコア: ${totalScore}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${metadata.name || 'スタッフ'}_評価_${metadata.date}.csv`;
    link.click();
  }, [items, metadata, performanceScore]);

  const handleDownloadAllCSV = useCallback(() => {
    let csvContent = '\uFEFF';
    let headerRow = '"項目/スタッフ"';
    staffList.forEach(staff => {
      headerRow += `,"${staff.store} ${staff.name}"`;
    });
    csvContent += headerRow + '\n';

    const allStaffData = staffList.map(staff => {
      const rawData = localStorage.getItem(DATA_PREFIX + staff.id);
      if (!rawData) return null;
      const data = JSON.parse(rawData);
      data.items = mergeWithInitialItems(data.items);
      return data;
    }).filter(d => d !== null);

    const basicRows = [
      { label: '店舗名', key: 'store' },
      { label: '氏名', key: 'name' },
      { label: '社員番号', key: 'employeeId' },
      { label: '評価日', key: 'date' },
      { label: '評価者', key: 'evaluator' }
    ];

    basicRows.forEach(rowInfo => {
      let rowStr = `"${rowInfo.label}"`;
      allStaffData.forEach(d => {
        rowStr += `,"${d.metadata[rowInfo.key] || ''}"`;
      });
      csvContent += rowStr + '\n';
    });

    let totalRow = '"総合スコア"';
    let perfRow = '"実績評価点"';
    let mgrRow = '"店長評価点"';

    allStaffData.forEach(d => {
      const items = d.items;
      const pScore = d.performanceScore || 0;
      const itemTotal = items.reduce((sum: number, i: any) => sum + (i.score ?? 0), 0);
      const total = itemTotal + pScore;
      const mgrTotal = items.filter((i: any) => i.category === '店長').reduce((sum: number, i: any) => sum + (i.score ?? 0), 0);
      totalRow += `,${total}`;
      perfRow += `,${pScore}`;
      mgrRow += `,${mgrTotal}`;
    });

    csvContent += totalRow + '\n';
    csvContent += perfRow + '\n';
    csvContent += mgrRow + '\n\n';

    INITIAL_ITEMS.forEach(initItem => {
      let itemRow = `"No.${initItem.no} ${initItem.category}-${initItem.item}"`;
      allStaffData.forEach(d => {
        const target = d.items.find((i: any) => i.no === initItem.no);
        const score = target && target.score !== null ? target.score : '';
        itemRow += `,${score}`;
      });
      csvContent += itemRow + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `QB_全スタッフ評価一覧_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [staffList]);

  const handlePrint = useCallback(() => {
    const currentData = {
      metadata: { ...metadata, updatedAt: Date.now() },
      items: items,
      performanceScore: performanceScore,
      comparison: comparisonData
    };
    setBatchPrintData([currentData]);
    setIsBatchPrinting(true);
  }, [metadata, items, performanceScore, comparisonData]);

  const handleBatchPrint = useCallback(() => {
    // Ensure we have the latest list from storage if state is empty
    let currentList = staffList;
    if (currentList.length === 0) {
      try {
        const rawIndex = localStorage.getItem(STAFF_INDEX_KEY);
        if (rawIndex) currentList = JSON.parse(rawIndex);
      } catch (e) {}
    }

    if (currentList.length === 0) {
      alert("印刷するデータがありません。まずはスタッフの評価を作成して保存してください。");
      return;
    }
    
    const count = currentList.length;
    if (!confirm(`登録されている全${count}名分のデータを一括印刷しますか？`)) return;

    const allData = currentList.map(staff => {
      try {
        const rawData = localStorage.getItem(DATA_PREFIX + staff.id);
        if (!rawData) return null;
        const data = JSON.parse(rawData);
        data.items = mergeWithInitialItems(data.items);
        return data;
      } catch (e) {
        return null;
      }
    }).filter(d => d !== null);

    if (allData.length === 0) {
      alert("有効な印刷データが見つかりませんでした。");
      setIsBatchPrinting(false);
      return;
    }

    setBatchPrintData(allData);
    setIsBatchPrinting(true);
  }, [staffList]);

  const handleHistorySelect = (id: string) => {
    const raw = localStorage.getItem(DATA_PREFIX + id);
    if (raw) {
      const data = JSON.parse(raw);
      setMetadata({ ...data.metadata });
      const mergedItems = mergeWithInitialItems(data.items);
      setItems(mergedItems);
      setPerformanceScore(data.performanceScore || 5);
      setCurrentId(id);
      setIsStoreManagerUnlocked(mergedItems.some((i: any) => i.category === '店長' && i.score !== null));
      setIsReadOnly(true);
      setViewMode('FORM');
      setIsHistoryOpen(false);
    }
  };

  const handleCompare = (record: any) => {
    const raw = localStorage.getItem(DATA_PREFIX + record.id);
    if (raw) {
      const data = JSON.parse(raw);
      data.items = mergeWithInitialItems(data.items);
      setComparisonData(data);
      alert("比較データをロードしました。チャート上に前回のデータが赤色で表示されます。");
    }
  };

  const handleEditMode = () => {
    if (confirm('閲覧専用モードを解除して編集しますか？')) {
      setIsReadOnly(false);
    }
  };

  if (isLoading) {
    return <FantasyLoader />;
  }

  if (viewMode === 'TOP') {
    return (
      <TopPage
        staffList={staffList}
        onSelect={(id) => {
          const staff = staffList.find(s => s.id === id);
          if (staff) {
            setSelectedStaffSummary(staff);
            setViewMode('MENU');
          }
        }}
        onCreate={createNewStaff}
        onDelete={deleteStaff}
        onBatchPrint={handleBatchPrint}
        onActionPlan={() => setViewMode('ACTION_PLAN')}
        onVersionInfo={() => setViewMode('VERSION_INFO')}
        onOperationGuide={() => setViewMode('OPERATION_GUIDE')}
        onBackup={() => {
          const dataToExport: Record<string, string> = {};
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('qb_')) {
              dataToExport[key] = localStorage.getItem(key) || '';
            }
          });
          const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `backup_qb_eval_${new Date().toISOString().split('T')[0]}.json`;
          link.click();
        }}
        onRestore={(e) => {
          if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              try {
                const importedData = JSON.parse(ev.target.result as string);
                if (confirm('現在のデータを上書きしてデータを復元しますか？（この操作は取り消せません）')) {
                  Object.keys(importedData).forEach(key => {
                    if (key.startsWith('qb_')) {
                      const value = importedData[key];
                      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                    }
                  });
                  alert('データの復元が完了しました。ページをリロードします。');
                  window.location.reload();
                }
              } catch (err) {
                alert('ファイルの読み込みに失敗しました。');
              }
            };
            reader.readAsText(e.target.files[0]);
          }
        }}
      />
    );
  }

  if (viewMode === 'MENU') {
    return (
      <MenuPage
        staff={selectedStaffSummary}
        onResume={() => loadStaffData(selectedStaffSummary!.id)}
        onNew={() => createNewFromSummary(selectedStaffSummary!)}
        onHistory={() => {
          loadStaffData(selectedStaffSummary!.id);
          setIsHistoryOpen(true);
        }}
        onBack={() => setViewMode('TOP')}
      />
    );
  }

  if (viewMode === 'ACTION_PLAN') {
    return <ActionPlan onBack={() => setViewMode('TOP')} />;
  }

  if (viewMode === 'VERSION_INFO') {
    return <VersionInfo onBack={() => setViewMode('TOP')} />;
  }

  if (viewMode === 'OPERATION_GUIDE') {
    return <OperationGuide onBack={() => setViewMode('TOP')} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <FantasyLoader key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <div className="max-w-md mx-auto min-h-screen border-x-[6px] border-ff-gold/30 bg-gradient-to-b from-blue-900 to-black sm:max-w-2xl flex flex-col relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          <div className="mist-container">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mist-particle" style={{ width: '300px', height: '300px', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 2}s` }} />
            ))}
          </div>
          <ScrollToTopButton />

      <div className="sticky top-0 z-50 print:hidden">
        <div className="ff-window !p-4 !border-t-0 !border-x-0 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 overflow-hidden group">
            <button onClick={() => setViewMode('TOP')} className="relative flex flex-col sm:flex-row items-center gap-2 p-2 hover:text-white transition-colors flex-shrink-0">
              <span className="ff-cursor"></span>
              <Store size={28} className="text-ff-gold" />
              <span className="text-xs sm:text-sm font-display font-bold leading-tight uppercase text-ff-silver">ワールドマップ</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-display font-bold truncate tracking-widest uppercase text-ff-gold">クリスタル・レコード</h1>
          </div>
          <div className="flex items-center gap-3">
            {isReadOnly && (
              <button onClick={handleEditMode} className="bg-ff-parchment text-gray-900 px-4 py-2 border-2 border-[#8B4513] text-sm font-bold flex items-center gap-2 shadow-md">
                <Lock size={16} /> 封印中
              </button>
            )}
            <button onClick={() => setIsHistoryOpen(true)} className="p-2 text-ff-silver hover:text-white transition-colors group" title="履歴">
              <History size={24} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 p-3 overflow-x-auto bg-black/40 border-b border-ff-silver/20 backdrop-blur-md">
          <button onClick={() => { if (currentId) saveToStorage(currentId, metadata, items, performanceScore); alert("記録を保存しました"); }} className="ff-button !px-4 !py-2 text-xs flex flex-col items-center min-w-[60px]">
            <Save size={20} />
            <span>保存</span>
          </button>
          <button onClick={() => { if (confirm("記録を初期化しますか？")) { setItems(INITIAL_ITEMS); setPerformanceScore(0); } }} className="ff-button !px-4 !py-2 text-xs flex flex-col items-center min-w-[60px]">
            <RefreshCw size={20} />
            <span>初期化</span>
          </button>
          <button onClick={handleDownloadCSV} className="ff-button !px-4 !py-2 text-xs flex flex-col items-center min-w-[60px]">
            <Download size={20} />
            <span>CSV</span>
          </button>
          <button onClick={() => window.print()} className="ff-button !px-4 !py-2 text-xs flex flex-col items-center min-w-[60px]">
            <Printer size={20} />
            <span>印刷</span>
          </button>
          <button onClick={() => setIsBatchPrinting(true)} className="ff-button !px-4 !py-2 text-xs flex flex-col items-center min-w-[60px]">
            <Layers size={20} />
            <span>一括</span>
          </button>
        </div>
      </div>

      <ScheduleAlert date={metadata.date} />

      <div className="print:hidden">
        <div className={`overflow-hidden transition-all duration-500 ${isDashboardCollapsed ? 'max-h-0' : 'max-h-[800px]'}`}>
          <div className="p-2 sm:p-4 bg-black/40 backdrop-blur-sm">
            <ScoreDashboard items={items} performanceScore={performanceScore} performanceData={metadata.performance} isManagerUnlocked={isStoreManagerUnlocked} />
          </div>
        </div>
        <button onClick={() => setIsDashboardCollapsed(!isDashboardCollapsed)} className="w-full flex justify-center items-center py-3 bg-gradient-to-r from-transparent via-ff-silver/10 to-transparent hover:via-ff-silver/20 text-ff-gold font-display font-bold text-sm transition-all uppercase tracking-widest border-y border-ff-silver/20">
          {isDashboardCollapsed ? "▼ ステータス画面を表示" : "▲ ステータス画面を隠す"}
        </button>
      </div>

      <section className="p-4 sm:p-6 border-b border-ff-silver/20 print:hidden">
        <div className="ff-parchment grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 !p-6">
          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            <div className="relative">
              <label className="block text-xs font-bold text-[#8B4513] mb-2 uppercase tracking-wider">所属王国（店舗名）</label>
              <input type="text" value={metadata.store} onChange={(e) => setMetadata({ ...metadata, store: e.target.value })} className="w-full bg-transparent border-b-2 border-[#8B4513]/30 focus:border-[#8B4513] outline-none text-base uppercase px-1 py-2" placeholder="店舗名を入力" disabled={isReadOnly} />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-[#8B4513] mb-2 uppercase tracking-wider">英雄の姓名（スタッフ氏名）</label>
              <input type="text" value={metadata.name} onChange={(e) => setMetadata({ ...metadata, name: e.target.value })} className="w-full bg-transparent border-b-2 border-[#8B4513]/30 focus:border-[#8B4513] outline-none text-lg font-bold uppercase px-1 py-2" placeholder="氏名を入力" disabled={isReadOnly} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-[#8B4513] mb-2 uppercase tracking-wider">ギルド階級（社員番号）</label>
              <input type="text" value={metadata.employeeId} onChange={(e) => { const v = e.target.value; if (/^[a-zA-Z0-9]*$/.test(v)) setMetadata({ ...metadata, employeeId: v }); }} className="w-full bg-transparent border-b-2 border-[#8B4513]/30 focus:border-[#8B4513] outline-none text-base uppercase px-1 py-2" placeholder="番号を入力" disabled={isReadOnly} />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-[#8B4513] mb-2 uppercase tracking-wider">賢者の姓名（評価者）</label>
              <input type="text" value={metadata.evaluator} onChange={(e) => setMetadata({ ...metadata, evaluator: e.target.value })} className="w-full bg-transparent border-b-2 border-[#8B4513]/30 focus:border-[#8B4513] outline-none text-base uppercase px-1 py-2" placeholder="評価者名を入力" disabled={isReadOnly} />
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-[#8B4513] mb-2 uppercase tracking-wider">年代記の日付（評価日）</label>
            <input type="date" value={metadata.date} onChange={(e) => setMetadata({ ...metadata, date: e.target.value })} className="w-full bg-transparent border-b-2 border-[#8B4513]/30 focus:border-[#8B4513] outline-none text-base px-1 py-2" disabled={isReadOnly} />
          </div>
        </div>
      </section>

      <section className="print:hidden">
        <button onClick={() => setIsChartCollapsed(!isChartCollapsed)} className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-ff-blue-top to-transparent text-ff-gold font-display font-bold text-sm hover:from-blue-800 transition-colors uppercase tracking-widest border-b border-ff-silver/20">
          <span className="flex items-center gap-3"><BarChart3 size={24} /> クリスタル共鳴レーダー</span>
          {isChartCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isChartCollapsed ? 'max-h-0' : 'max-h-[800px]'}`}>
          <div className="p-2 sm:p-4">
            <ChartSection
              items={items}
              performanceData={metadata.performance}
              performanceScore={performanceScore}
              comparisonItems={comparisonData?.items}
              comparisonPerformanceScore={comparisonData?.performanceScore}
            />
          </div>
        </div>
      </section>

      <div className="flex z-40 bg-black/60 backdrop-blur-md shadow-sm overflow-x-auto no-print border-y border-ff-silver/20">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => handleTabChange(cat)} className={`flex-1 py-5 px-6 text-xs font-display font-bold border-b-4 transition-all whitespace-nowrap flex items-center justify-center gap-2 uppercase tracking-widest group relative ${activeTab === cat ? 'border-ff-gold text-white bg-blue-900/40' : 'border-transparent text-ff-silver hover:text-white'}`}>
            <span className="ff-cursor !-left-4"></span>
            {cat}{cat === '店長' && !isStoreManagerUnlocked && <Lock size={12} />}
          </button>
        ))}
      </div>

      <main className="p-2 sm:p-4 pb-4 flex-grow print:bg-white print:p-0">
        <div className="print:hidden">
          <CriteriaGuide />
          <div className="flex justify-end mb-6">
            <button onClick={() => {
              if (window.confirm(`${activeTab}のデータを浄化（リセット）しますか？`)) {
                if (activeTab === '実績') {
                  setMetadata(p => ({ ...p, performance: { ...p.performance, monthlyCuts: new Array(12).fill(0) } })); setPerformanceScore(5);
                } else {
                  setItems(p => p.map(i => i.category === activeTab ? { ...i, score: [34, 58, 59].includes(i.no) ? 0 : null, memo: '', incidents: [] } : i));
                }
              }
            }} className="ff-button !px-4 !py-2 text-xs flex items-center gap-2 group">
              <span className="ff-cursor !-left-4"></span>
              <RefreshCw size={14} /> カテゴリを浄化
            </button>
          </div>
          {activeTab === '実績' ? (
            <PerformanceEvaluation data={metadata.performance} onChange={handlePerformanceUpdate} onScoreUpdate={setPerformanceScore} readOnly={isReadOnly} />
          ) : (
            items.filter(i => i.category === activeTab).map((item) => (
              <EvaluationCard key={item.no} item={item} onUpdate={handleUpdateScore} onUpdateMemo={handleUpdateMemo} onUpdateIncidents={handleUpdateIncidents} readOnly={isReadOnly} />
            ))
          )}
        </div>

        {isBatchPrinting && batchPrintData.length > 0 && (
          <div className="batch-print-container">
            {batchPrintData.map((data, idx) => {
              const m = data.metadata;
              const its = data.items;
              const pScore = data.performanceScore || 0;
              const comp = data.comparison;
              const relScore = its.filter((i: any) => i.category === '関係性').reduce((sum: number, i: any) => sum + (i.score !== null ? i.score : 0), 0);
              const csScore = its.filter((i: any) => i.category === '接客').reduce((sum: number, i: any) => sum + (i.score !== null ? i.score : 0), 0);
              const techScore = its.filter((i: any) => i.category === '技術').reduce((sum: number, i: any) => sum + (i.score !== null ? i.score : 0), 0);
              const totScore = relScore + csScore + techScore + pScore;
              const mgrUnlocked = its.some((i: any) => i.category === '店長' && i.score !== null);
              const pf = m.performance || { monthlyCuts: [], excludedFromAverage: [], goalCuts: 0 };
              const { currentTotal, predictedTotal } = calculatePerformanceMetrics(pf.monthlyCuts, pf.excludedFromAverage);

              return (
                <div key={idx} className="page-break">
                  <div className="border-b-2 border-gray-800 pb-2 mb-2 flex justify-between items-end">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">評価フィードバックシート</h1>
                      <p className="text-gray-500 text-xs uppercase">クリスタル・レコード V2.300</p>
                    </div>
                    <div className="text-right text-xs uppercase">
                      <p>所属: <span className="font-bold border-b border-gray-400 px-2">{m.store}</span> / 氏名: <span className="font-bold border-b border-gray-400 px-2">{m.name}</span></p>
                      <p>記録日: {m.date}</p>
                    </div>
                  </div>

                  <div className="mb-6 border border-gray-300 rounded p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="text-center px-8 border-r border-gray-300 min-w-[180px]">
                        <p className="text-sm text-gray-500 font-bold uppercase">総合共鳴率</p>
                        <p className="text-5xl font-bold text-gray-900 leading-none mt-2">{totScore}<span className="text-lg font-normal ml-1">%</span></p>
                        {comp && (
                          <div className="mt-2 text-xs text-gray-500 uppercase">
                            (前回: <span className="font-bold text-gray-700">{comp.performanceScore + (comp.items?.reduce((s: number, i: any) => s + (i.score ?? 0), 0) || 0)}</span>%)
                          </div>
                        )}
                      </div>
                      <div className="text-center px-6 flex-grow">
                        <div className="flex justify-around items-center h-full">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">累計カット数</p>
                            <p className="text-2xl font-bold">{currentTotal.toLocaleString()}</p>
                          </div>
                          <div className="border-l border-gray-200 pl-8">
                            <p className="text-xs text-gray-500 uppercase">年間予測</p>
                            <p className="text-2xl font-bold text-blue-700">{predictedTotal.toLocaleString()}</p>
                          </div>
                          <div className="border-l border-gray-200 pl-8">
                            <p className="text-xs text-gray-500 uppercase">目標達成率</p>
                            <p className="text-2xl font-bold text-gray-700">
                              {pf.goalCuts > 0 ? Math.round((predictedTotal / pf.goalCuts) * 100) : 0}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-0 text-xs border-t border-l border-gray-300 mb-6">
                    {MONTH_LABELS.map((mon) => (
                      <div key={mon} className="col-span-1 border-r border-b border-gray-300 text-center bg-gray-100 font-bold py-2 uppercase">{mon}</div>
                    ))}
                    {(pf.monthlyCuts || new Array(12).fill(0)).map((c: number, i: number) => (
                      <div key={i} className="col-span-1 border-r border-b border-gray-300 text-center py-2">{c || '-'}</div>
                    ))}
                  </div>

                  <div className={`grid ${mgrUnlocked ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6 mt-6`}>
                    <div className="border border-gray-300 rounded p-4 bg-white flex flex-col items-center print-chart-box">
                      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase tracking-widest">英雄の共鳴レーダー</h3>
                      <div className="print-chart-container">
                        <PrintChartSection items={its} performanceData={pf} performanceScore={pScore} type="radar" comparisonItems={comp?.items} comparisonPerformanceScore={comp?.performanceScore} />
                      </div>
                    </div>
                    {mgrUnlocked && (
                      <div className="border border-gray-300 rounded p-4 bg-white flex flex-col items-center print-chart-box">
                        <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase tracking-widest">指揮官の練度</h3>
                        <div className="print-chart-container">
                          <PrintChartSection items={its} performanceData={pf} performanceScore={pScore} type="manager-radar" comparisonItems={comp?.items} />
                        </div>
                      </div>
                    )}
                    <div className="border border-gray-300 rounded p-4 bg-white flex flex-col items-center print-chart-box">
                      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase tracking-widest">月間カット推移</h3>
                      <div className="print-chart-container">
                        <PrintChartSection items={its} performanceData={pf} performanceScore={pScore} type="line" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 border-b border-gray-800 pb-2 mb-4 uppercase tracking-widest">評価ログ ＆ メモ</h2>
                    <div className="print-grid-cols-3 text-xs">
                      {its.filter((item: any) => item.score !== null).map((item: any) => (
                        <div key={item.no} className="detail-item-box">
                          <div className="flex justify-between items-start">
                            <div className="w-[85%] detail-item-text">
                              <span className="font-bold text-gray-500 mr-1 text-xs">{item.no}.</span>
                              <span className="font-bold text-gray-800 uppercase">{item.item}</span>
                              <span className="text-[10px] text-gray-500 ml-1 uppercase">({item.subCategory})</span>
                            </div>
                            <div className="font-bold text-blue-800 detail-item-score">{item.score}/{item.max}</div>
                          </div>
                          {item.memo && (
                            <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-800 break-words">
                              <span className="font-bold mr-1 text-gray-600 uppercase tracking-tighter">メモ:</span>{item.memo}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 break-inside-avoid">
                    <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">指揮官の最終総評</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        currentId={currentId}
        onSelect={handleHistorySelect}
        onCompare={handleCompare}
        metadata={metadata}
      />
      <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} onUnlock={() => { setIsStoreManagerUnlocked(true); setActiveTab('店長'); }} />
        </div>
      )}
    </>
  );
}
