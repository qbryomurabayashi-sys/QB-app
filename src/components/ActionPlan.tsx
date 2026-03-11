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

    return `【指揮官の行動計画】クリスタル・レコード V2.300
--------------------------------
所属店舗: ${f.storeName}
店長氏名: ${f.managerName}
--------------------------------
■ ビジョン共鳴 (VISION_SYNC)
[ブロック] ${f.visionBlock}
[エリア  ] ${f.visionArea}
[店舗    ] ${f.visionShop}

■ 現状分析 (STATUS_ANALYSIS)
[現状データ]
${f.currentAnalysis}

[重要課題]
${f.issues}

■ 目標地点 (TARGET_GOAL)
${f.goal}

■ 行動計画プロトコル (ACTION_PLAN)
[第1期 (7-9月)]
${f.planQ1}

[第2期 (10-12月)]
${f.planQ2}

[第3期 (1-3月)]
${f.planQ3}

[第4期 (4-6月)]
${f.planQ4}

■ 最終出力ログ (FINAL_OUTPUT)
1. ${f.finalResult1}
2. ${f.finalResult2}
3. ${f.finalResult3}
--------------------------------
生成日時: ${today}`;
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
    <div className="min-h-screen bg-black flex flex-col font-serif relative overflow-hidden">
      <div className="mist-container opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="mist-particle" style={{ width: '300px', height: '300px', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 2}s` }} />
        ))}
      </div>
      
      {/* Header */}
      <header className="bg-ff-blue-top text-white p-5 sticky top-0 z-40 no-print border-b-4 border-ff-silver/30 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 text-ff-silver hover:text-ff-gold transition-colors relative group">
              <span className="ff-cursor !-left-10"></span>
              <ArrowLeft size={32} />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold leading-tight flex items-center gap-3 uppercase tracking-[0.2em] text-ff-gold">
                <span>指揮官の行動計画書</span>
                <span className="hidden md:inline bg-black/40 text-xs px-3 py-1 border border-ff-silver/30 rounded-sm">V2.300</span>
              </h1>
              <p className="text-xs text-ff-silver/70 mt-1 uppercase tracking-widest">戦略的プロトコル管理</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={manualSave} 
              className={`ff-button !px-6 !py-2 text-xs flex items-center gap-2 group ${
                saveStatus === 'saved' ? 'bg-ff-sky text-black' : ''
              }`}
            >
              <span className="ff-cursor !-left-4"></span>
              <Save size={18} />
              {saveStatus === 'saved' ? '同期完了' : '一時保存'}
            </button>
            <button 
              onClick={resetForm} 
              className="ff-button !px-6 !py-2 text-xs flex items-center gap-2 group !bg-ff-red/20 !border-ff-red/40 hover:!bg-ff-red/40"
            >
              <span className="ff-cursor !-left-4"></span>
              <Trash2 size={18} />
              初期化
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 space-y-8 flex-grow pb-32 w-full relative z-10">
        {/* Guide Section */}
        <div className="ff-window mb-8 overflow-hidden no-print">
          <button 
            onClick={() => setIsGuideOpen(!isGuideOpen)} 
            className="w-full flex justify-between items-center p-6 bg-ff-blue-top/10 hover:bg-ff-blue-top/20 transition text-left relative group"
          >
            <span className="ff-cursor !-left-4"></span>
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-ff-gold" />
              <div>
                <span className="text-xs font-bold text-ff-silver/50 block mb-1 uppercase tracking-widest">初期化の前に一読ください</span>
                <h2 className="font-bold text-ff-gold text-lg uppercase tracking-[0.2em]">指揮官の責務定義（聖典）</h2>
              </div>
            </div>
            <ChevronDown 
              className={`w-6 h-6 text-ff-silver transform transition-transform duration-300 ${isGuideOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isGuideOpen && (
            <div className="p-8 border-t border-ff-silver/20 bg-black/40 space-y-10">
              <div className="bg-blue-900/20 border border-ff-silver/30 p-6 rounded-sm">
                <h3 className="text-base font-bold text-ff-gold mb-4 border-b border-ff-silver/20 pb-3 flex items-center uppercase tracking-widest">
                  <AlertCircle className="w-5 h-5 mr-3" />
                  執行ルール
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <span className="bg-ff-gold text-black font-bold px-3 py-1 mr-3 mt-0.5 shrink-0 rounded-sm text-xs">01</span>
                    <div>
                      <span className="font-bold text-ff-gold uppercase tracking-widest">計画の策定</span>
                      <p className="text-ff-silver/80 mt-1">各期の開始時にAMと共に行動計画を確立せよ。</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-ff-gold text-black font-bold px-3 py-1 mr-3 mt-0.5 shrink-0 rounded-sm text-xs">02</span>
                    <div>
                      <span className="font-bold text-ff-gold uppercase tracking-widest">振り返りと修正</span>
                      <p className="text-ff-silver/80 mt-1">四半期ごとにレビューを行い、必要に応じて軌道修正を行え。</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-ff-gold text-black font-bold px-3 py-1 mr-3 mt-0.5 shrink-0 rounded-sm text-xs">03</span>
                    <div>
                      <span className="font-bold text-ff-gold uppercase tracking-widest">最終報告</span>
                      <p className="text-ff-silver/80 mt-1">AM/BMを通じて、最終的なログを本部に提出せよ。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-ff-gold border-l-4 border-ff-gold pl-4 mb-6 uppercase tracking-widest">指揮官の役割</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/40 border border-ff-silver/20 p-6 rounded-sm shadow-inner">
                    <div className="font-bold text-base text-ff-silver mb-4 text-center border-b border-ff-silver/10 pb-3 uppercase tracking-widest">目的</div>
                    <ul className="list-disc list-inside space-y-3 text-sm text-ff-silver/80">
                      <li>店舗収益の最大化</li>
                      <li>スタッフの成長とチームの共鳴</li>
                    </ul>
                  </div>
                  <div className="bg-black/40 border border-ff-silver/20 p-6 rounded-sm shadow-inner">
                    <div className="font-bold text-base text-ff-silver mb-4 text-center border-b border-ff-silver/10 pb-3 uppercase tracking-widest">役割</div>
                    <ul className="list-disc list-inside space-y-3 text-sm text-ff-silver/80">
                      <li>単一店舗ユニットの管理</li>
                      <li>スタッフの指導と士気の向上</li>
                      <li>高品質なサービスの維持</li>
                    </ul>
                  </div>
                  <div className="bg-black/40 border border-ff-silver/20 p-6 rounded-sm shadow-inner">
                    <div className="font-bold text-base text-ff-silver mb-4 text-center border-b border-ff-silver/10 pb-3 uppercase tracking-widest">責任</div>
                    <ul className="list-disc list-inside space-y-3 text-sm text-ff-silver/80">
                      <li>日々の店舗運営</li>
                      <li>スタッフの評価とトレーニング</li>
                      <li>サービスレベルの閾値維持</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="ff-window p-8 md:p-12 !border-t-8 !border-ff-gold relative">
          <div className="mist-container opacity-10">
            <div className="mist-particle" style={{ width: '400px', height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>
          
          {/* Sheet Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-2 border-ff-silver/20 pb-8 gap-6 relative z-10">
            <h2 className="text-2xl font-bold text-ff-gold uppercase tracking-[0.2em]">
              行動計画プロトコル<br/>
              <span className="text-sm text-ff-silver/50 font-normal tracking-widest">戦略的管理ログ</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
              <div className="flex-1 md:w-64">
                <label className="block text-xs font-bold text-ff-silver/70 mb-2 uppercase tracking-widest">所属店舗</label>
                <input 
                  type="text" 
                  value={formData.storeName}
                  onChange={(e) => updateField('storeName', e.target.value)}
                  placeholder="店舗名を入力..." 
                  className="ff-input w-full p-4 text-base"
                />
              </div>
              <div className="flex-1 md:w-64">
                <label className="block text-xs font-bold text-ff-silver/70 mb-2 uppercase tracking-widest">店長氏名</label>
                <input 
                  type="text" 
                  value={formData.managerName}
                  onChange={(e) => updateField('managerName', e.target.value)}
                  placeholder="氏名を入力..." 
                  className="ff-input w-full p-4 text-base"
                />
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <section className="mb-12 relative z-10">
            <div className="flex items-center mb-6">
              <h3 className="text-base font-bold text-ff-gold border-l-4 border-ff-gold pl-4 uppercase tracking-widest">ビジョン共鳴</h3>
              <div className="ml-4 text-[10px] bg-ff-red text-white px-3 py-1 font-bold shadow-[0_0_15px_rgba(255,51,51,0.4)] uppercase tracking-widest rounded-sm">
                戦略ロジック
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: 'ブロックビジョン', field: 'visionBlock' as const },
                { label: 'エリアビジョン', field: 'visionArea' as const },
                { label: '店舗ビジョン', field: 'visionShop' as const }
              ].map((item) => (
                <div key={item.field} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3">
                    <label className="text-xs font-bold text-ff-silver/70 bg-ff-blue-top/20 px-4 py-2 border border-ff-silver/20 block text-center md:text-right uppercase tracking-widest rounded-sm">{item.label}</label>
                  </div>
                  <div className="md:col-span-9">
                    <input 
                      type="text" 
                      value={formData[item.field]}
                      onChange={(e) => updateField(item.field, e.target.value)}
                      className="ff-input w-full p-4 text-base" 
                      placeholder={`${item.label}を入力...`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Analysis & Issues */}
          <section className="mb-12 relative z-10">
            <h3 className="text-base font-bold text-ff-gold border-l-4 border-ff-gold pl-4 mb-6 uppercase tracking-widest">現状分析</h3>
            <div className="space-y-8">
              <div>
                <label className="flex items-center text-xs font-bold text-ff-silver/70 mb-3 uppercase tracking-widest">
                  <span className="bg-ff-gold text-black w-6 h-6 flex items-center justify-center mr-3 text-xs rounded-sm">01</span>
                  現状データ分析
                </label>
                <textarea 
                  rows={4} 
                  value={formData.currentAnalysis}
                  onChange={(e) => updateField('currentAnalysis', e.target.value)}
                  className="ff-input w-full p-4 text-base" 
                  placeholder="現在の店舗状況を詳細に記述してください..."
                />
              </div>
              <div>
                <label className="flex items-center text-xs font-bold text-ff-silver/70 mb-3 uppercase tracking-widest">
                  <span className="bg-ff-gold text-black w-6 h-6 flex items-center justify-center mr-3 text-xs rounded-sm">02</span>
                  重要課題の特定
                </label>
                <textarea 
                  rows={4} 
                  value={formData.issues}
                  onChange={(e) => updateField('issues', e.target.value)}
                  className="ff-input w-full p-4 text-base" 
                  placeholder="解決すべき重要課題を記述してください..."
                />
              </div>
            </div>
          </section>

          {/* Goal */}
          <section className="mb-12 relative z-10">
            <h3 className="text-base font-bold text-ff-gold border-l-4 border-ff-gold pl-4 mb-6 uppercase tracking-widest">目標地点 (到達点)</h3>
            <textarea 
              rows={3} 
              value={formData.goal}
              onChange={(e) => updateField('goal', e.target.value)}
              className="ff-input w-full p-5 font-bold text-ff-sky text-lg" 
              placeholder="具体的な成功指標を定義してください..."
            />
          </section>

          {/* Quarterly Plan */}
          <section className="mb-12 relative z-10">
            <h3 className="text-base font-bold text-ff-gold border-l-4 border-ff-gold pl-4 mb-6 uppercase tracking-widest">行動計画プロトコル</h3>
            <div className="border border-ff-silver/20 overflow-hidden rounded-sm">
              {[
                { q: '第1期', months: '7月-9月', field: 'planQ1' as const },
                { q: '第2期', months: '10月-12月', field: 'planQ2' as const },
                { q: '第3期', months: '1月-3月', field: 'planQ3' as const },
                { q: '第4期', months: '4月-6月', field: 'planQ4' as const }
              ].map((item) => (
                <div key={item.field} className="grid grid-cols-12 border-b border-ff-silver/20 last:border-b-0">
                  <div className="col-span-3 md:col-span-2 p-4 text-center border-r border-ff-silver/20 bg-ff-blue-top/10 flex flex-col justify-center items-center">
                    <span className="font-bold text-ff-gold text-base uppercase tracking-widest">{item.q}</span>
                    <span className="text-[10px] text-ff-silver/50 font-bold uppercase tracking-widest mt-1">{item.months}</span>
                  </div>
                  <div className="col-span-9 md:col-span-10 p-4">
                    <textarea 
                      rows={3} 
                      value={formData[item.field]}
                      onChange={(e) => updateField(item.field, e.target.value)}
                      className="ff-input w-full p-3 text-sm" 
                      placeholder="具体的なアクションを入力..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final Result */}
          <section className="relative z-10">
            <h3 className="text-base font-bold text-ff-gold border-l-4 border-ff-gold pl-4 mb-6 uppercase tracking-widest">最終出力ログ</h3>
            <div className="space-y-6 bg-ff-blue-top/5 p-6 border border-ff-silver/20 rounded-sm">
              {(['finalResult1', 'finalResult2', 'finalResult3'] as const).map((field, idx) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-ff-silver/50 mb-2 uppercase tracking-widest">結果ログ_{idx + 1}</label>
                  <textarea 
                    rows={2} 
                    value={formData[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="ff-input w-full p-4 text-sm" 
                    placeholder="達成データや成果を記録..."
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-ff-blue-top/90 border-t-4 border-ff-silver/30 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 no-print backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex gap-4">
          <button 
            onClick={() => setIsPreviewOpen(true)} 
            className="flex-1 ff-button py-4 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
          >
            <span className="ff-cursor !-left-4"></span>
            <BookOpen size={20}/>
            プレビュー
          </button>
          <button 
            onClick={copyToClipboard} 
            className={`flex-[2] ff-button py-4 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 group ${
              isCopied ? 'bg-ff-sky text-black' : ''
            }`}
          >
            <span className="ff-cursor !-left-4"></span>
            {isCopied ? (
              <><Check className="w-6 h-6" />同期完了</>
            ) : (
              <><Copy className="w-6 h-6" />レポート生成</>
            )}
          </button>
        </div>
      </footer>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="ff-window w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_0_60px_rgba(0,0,0,1)]">
            <div className="p-6 border-b border-ff-silver/20 flex justify-between items-center bg-ff-blue-top/20">
              <h3 className="font-bold text-lg text-ff-gold flex items-center uppercase tracking-[0.2em]">
                <Copy className="w-6 h-6 mr-3"/>
                レポート・プレビュー
              </h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-ff-silver hover:text-ff-gold transition-colors p-2 relative group">
                <span className="ff-cursor !-left-10"></span>
                <X size={32} />
              </button>
            </div>
            <div className="p-0 overflow-hidden flex-1 relative bg-black/40">
              <textarea 
                readOnly
                className="w-full h-full p-8 font-mono text-sm leading-relaxed resize-none focus:outline-none text-ff-sky bg-transparent border-none custom-scrollbar"
                value={generateReport()}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
            <div className="p-6 border-t border-ff-silver/20 flex justify-end bg-ff-blue-top/10 gap-4">
              <button 
                onClick={() => setIsPreviewOpen(false)} 
                className="ff-button !px-8 !py-3 text-sm group"
              >
                <span className="ff-cursor !-left-4"></span>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
