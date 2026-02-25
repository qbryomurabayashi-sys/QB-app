import React, { useState, useEffect, useCallback } from 'react';
import { Check, Copy, BookOpen, AlertCircle, X, Trash2, Save, ChevronDown, ArrowLeft } from 'lucide-react';

interface ActionPlanData {
  storeName: string;
  managerName: string;
  visionBlock: string;
  visionArea: string;
  visionShop: string;
  currentAnalysis: string;
  issues: string;
  goal: string;
  planQ1: string;
  planQ2: string;
  planQ3: string;
  planQ4: string;
  finalResult1: string;
  finalResult2: string;
  finalResult3: string;
}

const INITIAL_DATA: ActionPlanData = {
  storeName: '',
  managerName: '',
  visionBlock: '',
  visionArea: '',
  visionShop: '',
  currentAnalysis: '',
  issues: '',
  goal: '',
  planQ1: '',
  planQ2: '',
  planQ3: '',
  planQ4: '',
  finalResult1: '',
  finalResult2: '',
  finalResult3: ''
};

const STORAGE_KEY = 'qb_action_plan_data_v2';

interface ActionPlanProps {
  onBack: () => void;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<ActionPlanData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_DATA, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
    return { ...INITIAL_DATA };
  });

  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Auto-save effect
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(handler);
  }, [formData]);

  const updateField = useCallback((field: keyof ActionPlanData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    if (window.confirm('入力内容をすべて消去しますか？\n（リセット後は元に戻せません）')) {
      const emptyData = { ...INITIAL_DATA };
      setFormData(emptyData);
      setSaveStatus('idle');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
    }
  }, []);

  const manualSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Save failed', e);
      alert('保存に失敗しました。');
    }
  }, [formData]);

  const generateReport = useCallback(() => {
    const f = formData;
    const today = new Date().toLocaleDateString('ja-JP');

    return `【店長】行動目標評価 アクションプラン管理シート
--------------------------------
店舗名：${f.storeName}
氏　名：${f.managerName}
--------------------------------
■ ビジョン共有
[ブロック] ${f.visionBlock}
[エリア　] ${f.visionArea}
[店　舗　] ${f.visionShop}

■ 現状分析・課題
[現状分析]
${f.currentAnalysis}

[課題]
${f.issues}

■ 達成ゴール (到達点)
${f.goal}

■ 課題解決・ゴール達成に向けたアクションプラン
[第1Q (7~9月)]
${f.planQ1}

[第2Q (10~12月)]
${f.planQ2}

[第3Q (1~3月)]
${f.planQ3}

[第4Q (4~6月)]
${f.planQ4}

■ 最終結果
1. ${f.finalResult1}
2. ${f.finalResult2}
3. ${f.finalResult3}
--------------------------------
作成日: ${today}`;
  }, [formData]);

  const copyToClipboard = useCallback(async () => {
    const text = generateReport();
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [generateReport]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#00205b] text-white p-4 shadow-md sticky top-0 z-40 no-print">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight flex items-center gap-2">
                <span>【店長】行動目標評価</span>
                <span className="hidden md:inline bg-white/20 text-xs px-2 py-0.5 rounded">Action Plan Tool</span>
              </h1>
              <p className="text-xs opacity-80 mt-0.5">アクションプラン管理シート作成</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={manualSave} 
              className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded border transition font-bold ${
                saveStatus === 'saved' 
                  ? 'bg-green-600 border-green-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
              }`}
            >
              <Save size={14} />
              {saveStatus === 'saved' ? '保存完了' : '一時保存'}
            </button>
            <button 
              onClick={resetForm} 
              className="text-xs flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded border border-gray-600 transition"
            >
              <Trash2 size={14} />
              リセット
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 space-y-6 flex-grow pb-32">
        {/* Guide Section */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden border border-gray-200 no-print">
          <button 
            onClick={() => setIsGuideOpen(!isGuideOpen)} 
            className="w-full flex justify-between items-center p-4 bg-yellow-50 hover:bg-yellow-100 transition text-left border-l-4 border-[#00205b]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#00205b]" />
              <div>
                <span className="text-xs font-bold text-gray-500 block mb-0.5">作成前に必ず確認</span>
                <h2 className="font-bold text-[#00205b] text-lg">作成ガイド・店長の職務定義（虎の巻）</h2>
              </div>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isGuideOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isGuideOpen && (
            <div className="p-6 border-t border-gray-200 bg-white space-y-8">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-sky-900 mb-3 border-b border-sky-200 pb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  実施ルール
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded mr-2 mt-0.5 shrink-0">1</span>
                    <div>
                      <span className="font-bold text-sky-900">アクションプラン設定</span>
                      <p className="text-sky-800">期初にAM（BM）と店長でアクションプランを立ててください。</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded mr-2 mt-0.5 shrink-0">2</span>
                    <div>
                      <span className="font-bold text-sky-900">振り返り</span>
                      <p className="text-sky-800">四半期ごとに進捗の振り返りと軌道修正を実施してください。</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded mr-2 mt-0.5 shrink-0">3</span>
                    <div>
                      <span className="font-bold text-sky-900">期末に提出</span>
                      <p className="text-sky-800">最終結果をご記入の上、AM→BM経由で人事部へご提出ください。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#00205b] pl-3 mb-4">店長の職務定義</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg shadow-sm">
                    <div className="font-bold text-xl text-gray-600 mb-3 text-center border-b border-gray-200 pb-2">目 標</div>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 font-medium">
                      <li>店舗売上の最大化</li>
                      <li>スタッフ育成とチーム結束力向上</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg shadow-sm">
                    <div className="font-bold text-xl text-blue-800 mb-3 text-center border-b border-blue-200 pb-2">役 割</div>
                    <ul className="list-disc list-inside space-y-2 text-sm text-blue-900 font-medium">
                      <li>1店舗の管理を担当する</li>
                      <li>スタッフの指導と育成を行い、チームのモチベーションを高める</li>
                      <li>顧客満足度向上と高品質なサービスの提供に尽力する</li>
                    </ul>
                  </div>
                  <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg shadow-sm">
                    <div className="font-bold text-xl text-indigo-800 mb-3 text-center border-b border-indigo-200 pb-2">責 任</div>
                    <ul className="list-disc list-inside space-y-2 text-sm text-indigo-900 font-medium">
                      <li>店舗の日常運営管理全般</li>
                      <li>スタッフの育成、評価</li>
                      <li>サービスレベルの維持と顧客満足度向上</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-t-8 border-[#00205b]">
          {/* Sheet Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 border-gray-100 pb-6 gap-4">
            <h2 className="text-2xl font-bold text-[#00205b]">
              【店長】行動目標評価<br/>
              <span className="text-lg text-gray-500 font-normal">アクションプラン管理シート</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-56">
                <label className="block text-xs font-bold text-gray-500 mb-1">担当店舗</label>
                <input 
                  type="text" 
                  value={formData.storeName}
                  onChange={(e) => updateField('storeName', e.target.value)}
                  placeholder="例：横浜店" 
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#00205b] focus:ring-1 focus:ring-[#00205b] focus:outline-none transition bg-gray-50"
                />
              </div>
              <div className="flex-1 md:w-56">
                <label className="block text-xs font-bold text-gray-500 mb-1">氏名</label>
                <input 
                  type="text" 
                  value={formData.managerName}
                  onChange={(e) => updateField('managerName', e.target.value)}
                  placeholder="例：山田 太郎" 
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#00205b] focus:ring-1 focus:ring-[#00205b] focus:outline-none transition bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#00205b] pl-3">ビジョン共有</h3>
              <div className="ml-3 text-xs bg-[#c8102e] text-white px-2 py-0.5 rounded font-bold shadow-sm">
                SMARTの法則
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'ブロックビジョン', field: 'visionBlock' as const },
                { label: 'エリアビジョン', field: 'visionArea' as const },
                { label: '店舗ビジョン', field: 'visionShop' as const }
              ].map((item) => (
                <div key={item.field} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded block text-center md:text-right">{item.label}</label>
                  </div>
                  <div className="md:col-span-10">
                    <input 
                      type="text" 
                      value={formData[item.field]}
                      onChange={(e) => updateField(item.field, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#00205b] focus:outline-none transition" 
                      placeholder={`${item.label}を入力`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Analysis & Issues */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#00205b] pl-3 mb-4">現状分析・課題</h3>
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <span className="bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">1</span>
                  現状分析
                </label>
                <textarea 
                  rows={4} 
                  value={formData.currentAnalysis}
                  onChange={(e) => updateField('currentAnalysis', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#00205b] focus:outline-none transition bg-gray-50/50" 
                  placeholder="現在の状態を記載してください。"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <span className="bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">2</span>
                  課題
                </label>
                <textarea 
                  rows={4} 
                  value={formData.issues}
                  onChange={(e) => updateField('issues', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#00205b] focus:outline-none transition bg-gray-50/50" 
                  placeholder="解決すべき課題を記載してください。"
                />
              </div>
            </div>
          </section>

          {/* Goal */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#00205b] pl-3 mb-4">達成ゴール (到達点)</h3>
            <textarea 
              rows={3} 
              value={formData.goal}
              onChange={(e) => updateField('goal', e.target.value)}
              className="w-full p-4 border-2 border-blue-50 rounded-lg focus:ring-2 focus:ring-[#00205b] focus:outline-none font-bold text-gray-800 bg-white" 
              placeholder="具体的な到達基準を記載してください。"
            />
          </section>

          {/* Quarterly Plan */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#00205b] pl-3 mb-4">アクションプラン</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {[
                { q: '第1Q', months: '7~9月', field: 'planQ1' as const },
                { q: '第2Q', months: '10~12月', field: 'planQ2' as const },
                { q: '第3Q', months: '1~3月', field: 'planQ3' as const },
                { q: '第4Q', months: '4~6月', field: 'planQ4' as const }
              ].map((item) => (
                <div key={item.field} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                  <div className="col-span-3 md:col-span-2 p-3 text-center border-r border-gray-200 bg-gray-50 flex flex-col justify-center items-center">
                    <span className="font-bold text-[#00205b] text-lg">{item.q}</span>
                    <span className="text-xs text-gray-500 font-bold">{item.months}</span>
                  </div>
                  <div className="col-span-9 md:col-span-10 p-3">
                    <textarea 
                      rows={3} 
                      value={formData[item.field]}
                      onChange={(e) => updateField(item.field, e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-[#00205b] focus:outline-none transition bg-white text-sm" 
                      placeholder="具体的な取り組みを記載してください。"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final Result */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#00205b] pl-3 mb-4">最終結果</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {(['finalResult1', 'finalResult2', 'finalResult3'] as const).map((field, idx) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">成果 {idx + 1}</label>
                  <textarea 
                    rows={2} 
                    value={formData[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="w-full p-3 border rounded focus:ring-1 focus:ring-[#00205b] focus:outline-none transition bg-white" 
                    placeholder="成果内容を記載"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50 no-print">
        <div className="max-w-5xl mx-auto flex gap-3">
          <button 
            onClick={() => setIsPreviewOpen(true)} 
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-lg transition text-center shadow-sm border border-gray-300 flex items-center justify-center gap-2"
          >
            <BookOpen size={20} className="text-gray-500"/>
            プレビュー
          </button>
          <button 
            onClick={copyToClipboard} 
            className={`flex-[2] text-white font-bold py-3.5 rounded-lg shadow-lg transition flex justify-center items-center gap-2 ${
              isCopied ? 'bg-green-600' : 'bg-[#c8102e] hover:bg-red-700'
            }`}
          >
            {isCopied ? (
              <><Check className="w-5 h-5" />コピー完了！</>
            ) : (
              <><Copy className="w-5 h-5" />レポートをコピーする</>
            )}
          </button>
        </div>
      </footer>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="font-bold text-lg text-gray-800 flex items-center">
                <Copy className="w-5 h-5 mr-2 text-[#00205b]"/>
                提出用レポートプレビュー
              </h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-gray-500 hover:text-gray-800 transition p-1 hover:bg-gray-200 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-0 overflow-hidden flex-1 relative bg-gray-50">
              <textarea 
                readOnly
                className="w-full h-full p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none text-gray-800 bg-white"
                value={generateReport()}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
            <div className="p-4 border-t flex justify-end bg-white rounded-b-lg gap-3">
              <button 
                onClick={() => setIsPreviewOpen(false)} 
                className="px-5 py-2 rounded text-gray-600 hover:bg-gray-100 transition font-bold"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
