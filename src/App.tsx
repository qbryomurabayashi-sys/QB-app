import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

const STAFF_INDEX_KEY = 'qb_staff_index_v1';
const DATA_PREFIX = 'qb_data_';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};

const ScrollToTopButton = () => {
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <button onClick={scrollToTop} className="fixed bottom-6 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40 no-print opacity-80">
      <ArrowUp size={20} />
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
        setItems(data.items);
        setPerformanceScore(data.performanceScore || 5);
        setCurrentId(id);
        setIsStoreManagerUnlocked(data.items.some((i: any) => i.category === '店長' && i.score !== null));
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
      return JSON.parse(rawData);
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
        return JSON.parse(rawData);
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
      setItems(data.items);
      setPerformanceScore(data.performanceScore || 5);
      setCurrentId(id);
      setIsStoreManagerUnlocked(data.items.some((i: any) => i.category === '店長' && i.score !== null));
      setIsReadOnly(true);
      setViewMode('FORM');
      setIsHistoryOpen(false);
    }
  };

  const handleCompare = (record: any) => {
    const raw = localStorage.getItem(DATA_PREFIX + record.id);
    if (raw) {
      const data = JSON.parse(raw);
      setComparisonData(data);
      alert("比較データをロードしました。チャート上に前回のデータが赤色で表示されます。");
    }
  };

  const handleEditMode = () => {
    if (confirm('閲覧専用モードを解除して編集しますか？')) {
      setIsReadOnly(false);
    }
  };

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
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg sm:max-w-2xl flex flex-col relative">
      <ScrollToTopButton />

      <div className="bg-white sticky top-0 z-50 shadow-md print:hidden">
        <div className="p-3 flex justify-between items-center bg-blue-900 text-white gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <button onClick={() => setViewMode('TOP')} className="flex flex-col sm:flex-row items-center gap-1 p-2 hover:bg-blue-800 rounded-lg transition-colors flex-shrink-0">
              <Store size={24} />
              <span className="text-[10px] sm:text-xs font-bold leading-tight">TOPへ<br className="sm:hidden" />戻る</span>
            </button>
            <h1 className="text-sm sm:text-lg font-bold truncate">QB総合ツール</h1>          </div>
          <div className="flex items-center gap-2">
            {isReadOnly && (
              <button onClick={handleEditMode} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1">
                <Lock size={14} /> 閲覧中(解除)
              </button>
            )}
            <button onClick={() => setIsHistoryOpen(true)} className="p-2 hover:bg-blue-800 rounded transition-colors" title="履歴">
              <History size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 p-2 overflow-x-auto">
          <button onClick={() => { if (currentId) saveToStorage(currentId, metadata, items, performanceScore); alert("保存しました"); }} className="flex flex-col items-center justify-center text-[10px] hover:bg-gray-100 p-1.5 rounded min-w-[40px] transition-colors">
            <Save size={18} className="text-blue-600" />
            <span className="text-gray-600">保存</span>
          </button>
          <button onClick={handleDownloadCSV} className="flex flex-col items-center justify-center text-[10px] hover:bg-gray-100 p-1.5 rounded min-w-[40px] transition-colors">
            <Download size={18} className="text-blue-600" />
            <span className="text-gray-600">CSV</span>
          </button>
          <button onClick={handleDownloadAllCSV} className="flex flex-col items-center justify-center text-[10px] hover:bg-gray-100 p-1.5 rounded min-w-[40px] transition-colors">
            <Users size={18} className="text-blue-600" />
            <span className="text-gray-600">一覧CSV</span>
          </button>
          <button onClick={handleBatchPrint} className="flex flex-col items-center justify-center text-[10px] hover:bg-gray-100 p-1.5 rounded min-w-[40px] transition-colors">
            <Layers size={18} className="text-blue-600" />
            <span className="text-gray-600">一括印刷</span>
          </button>
          <button onClick={handlePrint} className="flex flex-col items-center justify-center text-[10px] hover:bg-gray-100 p-1.5 rounded min-w-[40px] transition-colors">
            <Printer size={18} className="text-blue-600" />
            <span className="text-gray-600">印刷</span>
          </button>
        </div>
      </div>

      <ScheduleAlert date={metadata.date} />

      <div className="bg-gray-50 border-b print:hidden">
        <div className={`overflow-hidden transition-all duration-300 ${isDashboardCollapsed ? 'max-h-0' : 'max-h-[500px]'}`}>
          <div className="p-2 sm:p-4">
            <ScoreDashboard items={items} performanceScore={performanceScore} performanceData={metadata.performance} isManagerUnlocked={isStoreManagerUnlocked} />
          </div>
        </div>
        <button onClick={() => setIsDashboardCollapsed(!isDashboardCollapsed)} className="w-full flex justify-center items-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border-t border-b border-gray-300 font-bold text-xs transition-all">
          {isDashboardCollapsed ? "スコア内訳・詳細を表示 ↓" : "閉じる ↑"}
        </button>
      </div>

      <section className="p-3 sm:p-5 border-b bg-white print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="grid grid-cols-2 gap-3 sm:col-span-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">店舗名</label>
              <input type="text" value={metadata.store} onChange={(e) => setMetadata({ ...metadata, store: e.target.value })} className="w-full border-b-2 border-gray-100 p-1 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100" placeholder="店舗名" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">スタッフ氏名</label>
              <input type="text" value={metadata.name} onChange={(e) => setMetadata({ ...metadata, name: e.target.value })} className="w-full border-b-2 border-gray-100 p-1 text-sm font-bold outline-none focus:border-blue-500 disabled:bg-gray-100" placeholder="氏名" disabled={isReadOnly} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">社員番号 (半角英数)</label>
              <input type="text" value={metadata.employeeId} onChange={(e) => { const v = e.target.value; if (/^[a-zA-Z0-9]*$/.test(v)) setMetadata({ ...metadata, employeeId: v }); }} className="w-full border-b-2 border-gray-100 p-1 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">評価者</label>
              <input type="text" value={metadata.evaluator} onChange={(e) => setMetadata({ ...metadata, evaluator: e.target.value })} className="w-full border-b-2 border-gray-100 p-1 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100" disabled={isReadOnly} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1">日付</label>
            <input type="date" value={metadata.date} onChange={(e) => setMetadata({ ...metadata, date: e.target.value })} className="w-full border-b-2 border-gray-100 p-1 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100" disabled={isReadOnly} />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b print:hidden">
        <button onClick={() => setIsChartCollapsed(!isChartCollapsed)} className="w-full flex justify-between items-center p-3 bg-white border-b border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
          <span className="flex items-center gap-2"><BarChart3 size={20} className="text-blue-600" />評価分析チャート</span>
          {isChartCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isChartCollapsed ? 'max-h-0' : 'max-h-[800px]'}`}>
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

      <div className="flex z-40 bg-white shadow-sm overflow-x-auto no-print border-b">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => handleTabChange(cat)} className={`flex-1 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${activeTab === cat ? 'border-blue-800 text-blue-900 bg-blue-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {cat}{cat === '店長' && !isStoreManagerUnlocked && <Lock size={12} />}
          </button>
        ))}
      </div>

      <main className="p-2 sm:p-4 pb-4 flex-grow bg-gray-50 print:bg-white print:p-0">
        <div className="print:hidden">
          <CriteriaGuide />
          <div className="flex justify-end mb-4">
            <button onClick={() => {
              if (window.confirm(`${activeTab}評価をリセットしますか？`)) {
                if (activeTab === '実績') {
                  setMetadata(p => ({ ...p, performance: { ...p.performance, monthlyCuts: new Array(12).fill(0) } })); setPerformanceScore(5);
                } else {
                  setItems(p => p.map(i => i.category === activeTab ? { ...i, score: [34, 58, 59].includes(i.no) ? 0 : null, memo: '', incidents: [] } : i));
                }
              }
            }} className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm border"><RefreshCw size={12} /> この項目をリセット</button>
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
              const relScore = its.filter((i: any) => i.category === '関係性').reduce((sum: number, i: any) => sum + (i.score || 0), 0);
              const csScore = its.filter((i: any) => i.category === '接客').reduce((sum: number, i: any) => sum + (i.score || 0), 0);
              const techScore = its.filter((i: any) => i.category === '技術').reduce((sum: number, i: any) => sum + (i.score || 0), 0);
              const totScore = relScore + csScore + techScore + pScore;
              const mgrUnlocked = its.some((i: any) => i.category === '店長' && i.score !== null);
              const pf = m.performance || { monthlyCuts: [], excludedFromAverage: [], goalCuts: 0 };
              const { currentTotal, predictedTotal } = calculatePerformanceMetrics(pf.monthlyCuts, pf.excludedFromAverage);

              return (
                <div key={idx} className="page-break">
                  <div className="border-b-2 border-gray-800 pb-2 mb-2 flex justify-between items-end">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">評価フィードバックシート</h1>
                      <p className="text-gray-500 text-xs">QB総合ツール</p>                    </div>
                    <div className="text-right text-xs">
                      <p>店舗: <span className="font-bold border-b border-gray-400 px-2">{m.store}</span> / 氏名: <span className="font-bold border-b border-gray-400 px-2">{m.name}</span></p>
                      <p>評価日: {m.date}</p>
                    </div>
                  </div>

                  <div className="mb-4 border border-gray-300 rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="text-center px-6 border-r border-gray-300 min-w-[140px]">
                        <p className="text-[9pt] text-gray-500 font-bold">総合スコア</p>
                        <p className="text-4xl font-bold text-gray-900 leading-none mt-1">{totScore}<span className="text-sm font-normal ml-1">点</span></p>
                        {comp && (
                          <div className="mt-1 text-xs text-gray-500">
                            (前回: <span className="font-bold text-gray-700">{comp.performanceScore + (comp.items?.reduce((s: number, i: any) => s + (i.score ?? 0), 0) || 0)}</span>点)
                          </div>
                        )}
                      </div>
                      <div className="text-center px-4 flex-grow">
                        <div className="flex justify-around items-center h-full">
                          <div>
                            <p className="text-[8pt] text-gray-500">カット実績累計</p>
                            <p className="text-xl font-bold">{currentTotal.toLocaleString()}名</p>
                          </div>
                          <div className="border-l border-gray-200 pl-6">
                            <p className="text-[8pt] text-gray-500">年間着地予想</p>
                            <p className="text-xl font-bold text-blue-700">{predictedTotal.toLocaleString()}名</p>
                          </div>
                          <div className="border-l border-gray-200 pl-6">
                            <p className="text-[8pt] text-gray-500">目標達成率(予)</p>
                            <p className="text-xl font-bold text-gray-700">
                              {pf.goalCuts > 0 ? Math.round((predictedTotal / pf.goalCuts) * 100) : 0}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-0 text-[8pt] border-t border-l border-gray-300 mb-4">
                    {MONTH_LABELS.map((mon) => (
                      <div key={mon} className="col-span-1 border-r border-b border-gray-300 text-center bg-gray-100 font-bold py-1">{mon}</div>
                    ))}
                    {(pf.monthlyCuts || new Array(12).fill(0)).map((c: number, i: number) => (
                      <div key={i} className="col-span-1 border-r border-b border-gray-300 text-center py-1">{c || '-'}</div>
                    ))}
                  </div>

                  <div className={`grid ${mgrUnlocked ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-4 mt-4`}>
                    <div className="border border-gray-300 rounded p-2 bg-white flex flex-col items-center print-chart-box">
                      <h3 className="text-[9pt] font-bold text-gray-600 text-center mb-1">スタッフ評価</h3>
                      <div className="print-chart-container">
                        <PrintChartSection items={its} performanceData={pf} performanceScore={pScore} type="radar" comparisonItems={comp?.items} comparisonPerformanceScore={comp?.performanceScore} />
                      </div>
                    </div>
                    {mgrUnlocked && (
                      <div className="border border-gray-300 rounded p-2 bg-white flex flex-col items-center print-chart-box">
                        <h3 className="text-[9pt] font-bold text-gray-600 text-center mb-1">店長スキル</h3>
                        <div className="print-chart-container">
                          <PrintChartSection items={its} performanceData={pf} performanceScore={pScore} type="manager-radar" comparisonItems={comp?.items} />
                        </div>
                      </div>
                    )}
                    <div className="border border-gray-300 rounded p-2 bg-white flex flex-col items-center print-chart-box">
                      <h3 className="text-[9pt] font-bold text-gray-600 text-center mb-1">月別カット推移</h3>
                      <div className="print-chart-container">
                        <PrintChartSection items={its} performanceData={pf} performanceScore={pScore} type="line" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-2">
                    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-800 pb-1 mb-2">評価詳細 & メモ</h2>
                    <div className="print-grid-cols-3 text-[7pt]">
                      {its.filter((item: any) => item.score !== null).map((item: any) => (
                        <div key={item.no} className="detail-item-box">
                          <div className="flex justify-between items-start">
                            <div className="w-[85%] detail-item-text">
                              <span className="font-bold text-gray-500 mr-1 text-[7pt]">{item.no}.</span>
                              <span className="font-bold text-gray-800">{item.item}</span>
                              <span className="text-[6pt] text-gray-500 ml-1">({item.subCategory})</span>
                            </div>
                            <div className="font-bold text-blue-800 detail-item-score">{item.score}/{item.max}</div>
                          </div>
                          {item.memo && (
                            <div className="mt-1 p-1 bg-gray-50 border border-gray-200 rounded text-[6pt] text-gray-800 break-words">
                              <span className="font-bold mr-1 text-gray-600">Memo:</span>{item.memo}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-3 h-32 break-inside-avoid">
                    <p className="text-[8pt] font-bold text-gray-500 mb-1">メモ・総評</p>
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
  );
}
