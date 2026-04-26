import React, { useState, useEffect, useCallback } from 'react';
import { Check, Copy, BookOpen, AlertCircle, X, Trash2, Save, ChevronDown } from 'lucide-react';

const INITIAL_DATA = {
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

const useActionPlan = () => {
    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if ('finalResult' in parsed) {
                    if (!parsed.finalResult1) parsed.finalResult1 = parsed.finalResult;
                    delete parsed.finalResult;
                }
                return { ...INITIAL_DATA, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load data', e);
        }
        return { ...INITIAL_DATA };
    });

    const [isCopied, setIsCopied] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');

    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(handler);
    }, [formData]);

    const updateField = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        if (window.confirm('入力内容をすべて消去しますか？\n（リセット後は元に戻せません）')) {
            const emptyData = { ...INITIAL_DATA };
            setFormData(emptyData);
            setSaveStatus('idle');
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
            } catch (e) {
                console.error('Failed to reset storage', e);
            }
        }
    }, []);

    const manualSave = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (e) {
            console.error('Save failed', e);
            alert('保存に失敗しました。ブラウザのストレージ容量を確認してください。');
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
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy', err);
            alert('コピーできませんでした。プレビュー画面から手動でコピーしてください。');
        }
    }, [generateReport]);

    return { formData, updateField, resetForm, manualSave, saveStatus, generateReport, copyToClipboard, isCopied };
};

const GuideSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden border border-gray-200 no-print">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center p-4 bg-yellow-50 hover:bg-yellow-100 transition text-left border-l-4 border-blue-900"
            >
                <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-900" />
                    <div>
                        <span className="text-xs font-bold text-gray-500 block mb-0.5">作成前に必ず確認</span>
                        <h2 className="font-bold text-blue-900 text-lg">作成ガイド・店長の職務定義（虎の巻）</h2>
                    </div>
                </div>
                <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            
            {isOpen && (
                <div className="p-6 border-t border-gray-200 bg-white animate-fadeIn space-y-8">
                    
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-sky-900 mb-3 border-b border-sky-200 pb-2 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            実施ルール
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded mr-2 mt-0.5 shrink-0">1</span>
                                <div>
                                    <span className="font-bold text-sky-900">アクションプラン設定</span>
                                    <p className="text-sm text-sky-800">期初にAM（BM）と店長でアクションプランを立ててください。</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded mr-2 mt-0.5 shrink-0">2</span>
                                <div>
                                    <span className="font-bold text-sky-900">振り返り</span>
                                    <p className="text-sm text-sky-800">四半期ごとに進捗の振り返りと軌道修正を実施してください。</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded mr-2 mt-0.5 shrink-0">3</span>
                                <div>
                                    <span className="font-bold text-sky-900">期末に提出</span>
                                    <p className="text-sm text-sky-800">最終結果をご記入の上、AM→BM経由で人事部へご提出ください。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3 mb-4">店長の職務定義</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg shadow-sm flex flex-col">
                                <div className="font-bold text-xl text-gray-600 mb-3 text-center border-b border-gray-200 pb-2">目 標</div>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 flex-grow font-medium">
                                    <li>店舗売上の最大化</li>
                                    <li>スタッフ育成とチーム結束力向上</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg shadow-sm flex flex-col">
                                <div className="font-bold text-xl text-blue-800 mb-3 text-center border-b border-blue-200 pb-2">役 割</div>
                                <ul className="list-disc list-inside space-y-2 text-sm text-blue-900 flex-grow font-medium">
                                    <li>1店舗の管理を担当する</li>
                                    <li>スタッフの指導と育成を行い、チームのモチベーションを高める</li>
                                    <li>顧客満足度向上と高品質なサービスの提供に尽力する</li>
                                    <li>メンバーと共に成果を上げることを重視する</li>
                                </ul>
                                <div className="mt-3 pt-2 border-t border-blue-200 text-xs text-center text-blue-700 font-bold">
                                    現場のリーダーとして模範となり牽引する
                                </div>
                            </div>
                            <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg shadow-sm flex flex-col">
                                <div className="font-bold text-xl text-indigo-800 mb-3 text-center border-b border-indigo-200 pb-2">責 任</div>
                                <ul className="list-disc list-inside space-y-2 text-sm text-indigo-900 flex-grow font-medium">
                                    <li>店舗の日常運営管理全般</li>
                                    <li>スタッフの育成、評価</li>
                                    <li>サービスレベルの維持と顧客満足度向上</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3 mb-4">店長の主なマネジメント任務</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex flex-col md:flex-row border border-indigo-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-blue-900 text-white p-3 md:w-24 flex items-center justify-center font-bold shrink-0">運 営</div>
                                <div className="bg-indigo-50 p-3 w-full">
                                    <p className="text-gray-700 text-xs leading-relaxed">
                                        ・開閉店作業 ・金銭管理 ・シフト及び勤怠管理 ・サービスオペレーション管理<br/>
                                        ・備品 / 設備管理 ・安全衛生管理 ・労務管理(36協定、ハラスメント防止)<br/>
                                        ・顧客対応(問い合わせ、クレーム) ・休憩時間管理<br/>
                                        ・売上 / 利益向上施策(販促実施協力、来店客数分析、予実管理)<br/>
                                        ・会議出席(社内会議、テナント会議) ・報告連絡相談 ・期日管理 ・帳票類管理
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row border border-cyan-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-cyan-500 text-white p-3 md:w-24 flex items-center justify-center font-bold shrink-0">育 成</div>
                                <div className="bg-cyan-50 p-3 w-full">
                                    <p className="text-gray-700 text-xs leading-relaxed">
                                        ・部下育成(オペレーション改善指導、技術指導、新人指導) ・後進育成 ・育成面談<br/>
                                        ・スタイリスト評価 ・フィードバック面談
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row border border-blue-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-blue-900 text-white p-3 md:w-24 flex items-center justify-center font-bold shrink-0">関 係</div>
                                <div className="bg-white p-3 w-full">
                                    <p className="text-gray-700 text-xs leading-relaxed">
                                        ・倫理保持 ・コンプライアンス ・定期面談 ・店舗ミーティング開催<br/>
                                        ・懇親会 ・情報共有
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-black text-white p-3 text-center font-bold text-lg mb-4 rounded-t">
                            SMARTの法則による5つの目標設定基準
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden">
                                <div className="bg-[#3498db] text-white w-12 h-12 flex items-center justify-center text-2xl font-bold shrink-0">S</div>
                                <div className="px-4 py-2 flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                    <div className="font-bold text-lg">Specific</div>
                                    <div className="text-sm text-gray-500 font-bold">(具体的な)</div>
                                    <div className="text-sm text-[#3498db] font-bold">目標に具体性があるか</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden">
                                <div className="bg-[#3498db] text-white w-12 h-12 flex items-center justify-center text-2xl font-bold shrink-0">M</div>
                                <div className="px-4 py-2 flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                    <div className="font-bold text-lg">Measurable</div>
                                    <div className="text-sm text-gray-500 font-bold">(測定可能な)</div>
                                    <div className="text-sm text-[#3498db] font-bold">目標が測定可能か</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden">
                                <div className="bg-[#3498db] text-white w-12 h-12 flex items-center justify-center text-2xl font-bold shrink-0">A</div>
                                <div className="px-4 py-2 flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                    <div className="font-bold text-lg">Assignable</div>
                                    <div className="text-sm text-gray-500 font-bold">(実現可能な)</div>
                                    <div className="text-sm text-[#3498db] font-bold">目標が達成可能か</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden">
                                <div className="bg-[#3498db] text-white w-12 h-12 flex items-center justify-center text-2xl font-bold shrink-0">R</div>
                                <div className="px-4 py-2 flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                    <div className="font-bold text-lg">Realistic</div>
                                    <div className="text-sm text-gray-500 font-bold">(関連性のある)</div>
                                    <div className="text-sm text-[#3498db] font-bold">ほかの目標との関連性があるか</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden">
                                <div className="bg-[#3498db] text-white w-12 h-12 flex items-center justify-center text-2xl font-bold shrink-0">T</div>
                                <div className="px-4 py-2 flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                    <div className="font-bold text-lg">Time-bound</div>
                                    <div className="text-sm text-gray-500 font-bold">(期限が明確な)</div>
                                    <div className="text-sm text-[#3498db] font-bold">いつまでに目標達成するか</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PreviewModal: React.FC<{ isOpen: boolean, onClose: () => void, reportText: string }> = ({ isOpen, onClose, reportText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity animate-fadeIn">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center">
                        <Copy className="w-5 h-5 mr-2 text-blue-900"/>
                        提出用レポートプレビュー
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition p-1 hover:bg-gray-200 rounded">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-0 overflow-hidden flex-1 relative bg-gray-50">
                     <textarea 
                        readOnly
                        className="w-full h-full p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none text-gray-800 bg-white"
                        value={reportText}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                </div>
                <div className="p-4 border-t flex justify-end bg-white rounded-b-lg gap-3">
                    <span className="text-xs text-gray-500 self-center mr-auto">※テキストを選択してコピー、または右のボタンを使用</span>
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2 rounded text-gray-600 hover:bg-gray-100 transition font-bold"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ActionPlan: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { 
        formData, 
        updateField, 
        resetForm, 
        manualSave,
        saveStatus,
        generateReport, 
        copyToClipboard, 
        isCopied 
    } = useActionPlan();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <div className="min-h-screen pb-32 bg-gray-100">
            <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-40 no-print">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold leading-tight flex items-center gap-2">
                            <span>【店長】行動目標評価</span>
                            <span className="hidden md:inline bg-white/20 text-xs px-2 py-0.5 rounded">Action Plan Tool</span>
                        </h1>
                        <p className="text-xs opacity-80 mt-0.5">アクションプラン管理シート作成</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onBack} className="text-xs flex items-center gap-1 bg-white hover:bg-gray-100 text-blue-900 px-3 py-1.5 rounded transition font-bold">
                            戻る
                        </button>
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

            <main className="max-w-5xl mx-auto p-4 space-y-6 mt-4">
                <GuideSection />

                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-t-8 border-blue-900 print:shadow-none print:border-none print:p-0">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 border-gray-100 pb-6 gap-4">
                        <h2 className="text-2xl font-bold text-blue-900">
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
                                    className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none transition bg-gray-50"
                                />
                            </div>
                            <div className="flex-1 md:w-56">
                                <label className="block text-xs font-bold text-gray-500 mb-1">氏名</label>
                                <input 
                                    type="text" 
                                    value={formData.managerName}
                                    onChange={(e) => updateField('managerName', e.target.value)}
                                    placeholder="例：山田 太郎" 
                                    className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none transition bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    <section className="mb-10">
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3">ビジョン共有</h3>
                                <div className="ml-3 text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold shadow-sm">
                                    SMARTの法則
                                </div>
                            </div>
                            <div className="bg-blue-50 text-xs text-blue-900 p-3 rounded border border-blue-100 leading-relaxed no-print">
                                ブロック全体のビジョンや定量的・定性的な目標に基づいて、店舗目標を記載してください。
                                また、店長の職務定義や重要業績評価の項目を目標に掲げることを推奨しています。
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded block text-center md:text-right">ブロックビジョン</label>
                                </div>
                                <div className="md:col-span-10">
                                    <input 
                                        type="text" 
                                        value={formData.visionBlock}
                                        onChange={(e) => updateField('visionBlock', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 focus:outline-none transition" 
                                        placeholder="ブロック全体のビジョンを入力"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded block text-center md:text-right">エリアビジョン</label>
                                </div>
                                <div className="md:col-span-10">
                                    <input 
                                        type="text" 
                                        value={formData.visionArea}
                                        onChange={(e) => updateField('visionArea', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
                                        placeholder="エリアのビジョンや目標を入力"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded block text-center md:text-right">店舗ビジョン</label>
                                </div>
                                <div className="md:col-span-10">
                                    <input 
                                        type="text" 
                                        value={formData.visionShop}
                                        onChange={(e) => updateField('visionShop', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 focus:outline-none transition font-bold text-gray-800" 
                                        placeholder="店舗のビジョンや目標を入力"
                                    />
                                </div>
                            </div>
                            
                            <div className="ml-0 md:ml-[16.6%] bg-gray-50 p-2 rounded border border-gray-200 text-xs text-gray-500 flex gap-4 no-print">
                                <div>
                                    <span className="font-bold text-green-700 mr-1">● 定量的</span>
                                    数値や数量として捉えること
                                </div>
                                <div>
                                    <span className="font-bold text-teal-600 mr-1">● 定性的</span>
                                    あり方や状態で捉えること
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3 mb-4">現状分析・課題</h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white">
                                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                                    <span className="bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">1</span>
                                    現状分析
                                </label>
                                <textarea 
                                    rows={4} 
                                    value={formData.currentAnalysis}
                                    onChange={(e) => updateField('currentAnalysis', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 focus:outline-none transition bg-gray-50/50" 
                                    placeholder="ビジョンや目標と比べて、現在の状態とどの様に差があるか。店舗の状態として捉えていることなどを記載してください。"
                                />
                            </div>

                            <div className="bg-white">
                                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                                    <span className="bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">2</span>
                                    課題
                                </label>
                                <textarea 
                                    rows={4} 
                                    value={formData.issues}
                                    onChange={(e) => updateField('issues', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 focus:outline-none transition bg-gray-50/50" 
                                    placeholder="現状分析で挙げた、ビジョンや目標との「差」を埋める為に何が必要か。問題がある場合は何を解決する必要があるかを記載してください。"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3 mb-4">達成ゴール (到達点)</h3>
                        <textarea 
                            rows={3} 
                            value={formData.goal}
                            onChange={(e) => updateField('goal', e.target.value)}
                            className="w-full p-4 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none font-bold text-gray-800 bg-white shadow-sm" 
                            placeholder="店舗目標を達成したと言える具体的な到達基準を記載してください。"
                        />
                    </section>

                    <section className="mb-10">
                        <div className="mb-4">
                            <div className="flex flex-wrap justify-between items-end mb-2">
                                <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3">課題解決・ゴール達成に向けたアクションプラン</h3>
                                <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded shrink-0 ml-2 mt-1 md:mt-0 no-print">
                                    <span className="font-bold">Q = クォーター</span> (3ヶ月毎にした期間)
                                </div>
                            </div>
                            <div className="bg-blue-50 text-xs text-blue-900 p-3 rounded border border-blue-100 leading-relaxed no-print">
                                店舗目標・達成ゴールに向けて第1Q～第4Qの各期間で具体的にどのような取り組みを行うか記載してください。
                                各Qが終わったタイミングで取り組みに対しての振り返りを行い、必要な場合は軌道修正をしてください。
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-200 text-sm font-bold text-gray-700">
                                <div className="col-span-3 md:col-span-2 p-3 text-center border-r border-gray-200 flex items-center justify-center">期間</div>
                                <div className="col-span-9 md:col-span-10 p-3 text-center">達成に向けた具体的な取組み</div>
                            </div>

                            <div className="grid grid-cols-12 border-b border-gray-200 group hover:bg-gray-50 transition">
                                <div className="col-span-3 md:col-span-2 p-3 text-center border-r border-gray-200 bg-gray-50 flex flex-col justify-center items-center">
                                    <span className="font-bold text-blue-900 text-lg">第1Q</span>
                                    <span className="text-xs text-gray-500 font-bold">7~9月</span>
                                </div>
                                <div className="col-span-9 md:col-span-10 p-3">
                                    <textarea 
                                        rows={4} 
                                        value={formData.planQ1}
                                        onChange={(e) => updateField('planQ1', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white text-sm" 
                                        placeholder="具体的な取り組みを記載してください。"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 border-b border-gray-200 group hover:bg-gray-50 transition">
                                <div className="col-span-3 md:col-span-2 p-3 text-center border-r border-gray-200 bg-gray-50 flex flex-col justify-center items-center">
                                    <span className="font-bold text-blue-900 text-lg">第2Q</span>
                                    <span className="text-xs text-gray-500 font-bold">10~12月</span>
                                </div>
                                <div className="col-span-9 md:col-span-10 p-3">
                                    <textarea 
                                        rows={4} 
                                        value={formData.planQ2}
                                        onChange={(e) => updateField('planQ2', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white text-sm" 
                                        placeholder="具体的な取り組みを記載してください。"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 border-b border-gray-200 group hover:bg-gray-50 transition">
                                <div className="col-span-3 md:col-span-2 p-3 text-center border-r border-gray-200 bg-gray-50 flex flex-col justify-center items-center">
                                    <span className="font-bold text-blue-900 text-lg">第3Q</span>
                                    <span className="text-xs text-gray-500 font-bold">1~3月</span>
                                </div>
                                <div className="col-span-9 md:col-span-10 p-3">
                                    <textarea 
                                        rows={4} 
                                        value={formData.planQ3}
                                        onChange={(e) => updateField('planQ3', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white text-sm"
                                        placeholder="具体的な取り組みを記載してください。"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 group hover:bg-gray-50 transition">
                                <div className="col-span-3 md:col-span-2 p-3 text-center border-r border-gray-200 bg-gray-50 flex flex-col justify-center items-center">
                                    <span className="font-bold text-blue-900 text-lg">第4Q</span>
                                    <span className="text-xs text-gray-500 font-bold">4~6月</span>
                                </div>
                                <div className="col-span-9 md:col-span-10 p-3">
                                    <textarea 
                                        rows={4} 
                                        value={formData.planQ4}
                                        onChange={(e) => updateField('planQ4', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white text-sm"
                                        placeholder="具体的な取り組みを記載してください。"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-900 pl-3">最終結果</h3>
                            <p className="text-xs text-gray-500 mt-1 pl-3">最終的な結果がどうなったか、何を達成できたかを期末に記載してください。</p>
                        </div>
                        
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">成果 1</label>
                                <textarea 
                                    rows={2} 
                                    value={formData.finalResult1}
                                    onChange={(e) => updateField('finalResult1', e.target.value)}
                                    className="w-full p-3 border rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white" 
                                    placeholder="成果内容を記載"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">成果 2</label>
                                <textarea 
                                    rows={2} 
                                    value={formData.finalResult2}
                                    onChange={(e) => updateField('finalResult2', e.target.value)}
                                    className="w-full p-3 border rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white" 
                                    placeholder="成果内容を記載"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">成果 3</label>
                                <textarea 
                                    rows={2} 
                                    value={formData.finalResult3}
                                    onChange={(e) => updateField('finalResult3', e.target.value)}
                                    className="w-full p-3 border rounded focus:ring-1 focus:ring-blue-900 focus:border-blue-900 focus:outline-none transition bg-white" 
                                    placeholder="成果内容を記載"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

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
                            isCopied ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-5 h-5" />
                                コピー完了！
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                レポートをコピーする
                            </>
                        )}
                    </button>
                </div>
            </footer>

            <PreviewModal 
                isOpen={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)} 
                reportText={generateReport()} 
            />
        </div>
    );
};
