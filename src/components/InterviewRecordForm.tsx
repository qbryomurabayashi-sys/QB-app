import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

interface InterviewRecordFormProps {
  onBack: () => void;
}

export const InterviewRecordForm: React.FC<InterviewRecordFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    importance: '中',
    date: new Date().toISOString().split('T')[0],
    store: '',
    name: '',
    employeeId: '',
    interviewer: '',
    type: '評価面談や個人キャリアプランについて',
    typeOtherDetails: '',
    status: '完了',
    mainContent: '',
    pendingIssues: '',
    nextAction: '',
    impression: ''
  });

  const [showToast, setShowToast] = useState(false);

  const INTERVIEW_TYPES = [
    '評価面談や個人キャリアプランについて',
    '店舗環境での改善について',
    '接客態度スキルについて',
    '仕事のモチベーションとやりがいについて',
    '業務進捗や目標設定や達成度',
    '技術力と研修の必要性について',
    'ワークバランスとストレス管理について',
    'チーム内コミュニケーションと協力について',
    'その他'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async () => {
    const typeDisplay = formData.type === 'その他' 
      ? `その他(${formData.typeOtherDetails})` 
      : formData.type;

    const textToCopy = `■面談記録
【重要度】${formData.importance}
【ステータス】${formData.status}
【面談日】${formData.date}
【所属店舗】${formData.store}
【氏名】${formData.name} (社員番号: ${formData.employeeId})
【対応者】${formData.interviewer}
【面談種類】${typeDisplay}

【内容】
▼主な内容
${formData.mainContent}

▼懸案事項/未解決事項
${formData.pendingIssues}

▼次回アクション
${formData.nextAction}

▼所感
${formData.impression}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('コピーに失敗しました。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-300">
      <header className="bg-[#00205b] text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">面談記録（1on1）</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 flex-grow w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">重要度</label>
              <select 
                name="importance" 
                value={formData.importance} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">ステータス</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="完了">完了</option>
                <option value="次回対応必要">次回対応必要</option>
                <option value="上長フォロー必要">上長フォロー必要</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">面談日</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">所属店舗</label>
              <input 
                type="text" 
                name="store" 
                value={formData.store} 
                onChange={handleChange}
                placeholder="例: 新宿店"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">氏名</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="例: 山田 太郎"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">社員番号</label>
              <input 
                type="text" 
                name="employeeId" 
                value={formData.employeeId} 
                onChange={handleChange}
                placeholder="例: 12345"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">対応者</label>
              <input 
                type="text" 
                name="interviewer" 
                value={formData.interviewer} 
                onChange={handleChange}
                placeholder="例: 佐藤 店長"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">面談種類</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-2"
              >
                {INTERVIEW_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              {formData.type === 'その他' && (
                <input 
                  type="text" 
                  name="typeOtherDetails" 
                  value={formData.typeOtherDetails} 
                  onChange={handleChange}
                  placeholder="具体的な内容を入力してください"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">内容</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">主な内容</label>
              <textarea 
                name="mainContent" 
                value={formData.mainContent} 
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder="面談で話した主な内容を記入してください"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">懸案事項/未解決事項</label>
              <textarea 
                name="pendingIssues" 
                value={formData.pendingIssues} 
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder="解決していない問題点や懸念事項があれば記入してください"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">次回アクション</label>
              <textarea 
                name="nextAction" 
                value={formData.nextAction} 
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder="次回までに誰が何をするか記入してください"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">所感</label>
              <textarea 
                name="impression" 
                value={formData.impression} 
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder="対応者の所感や気づきを記入してください"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Bar for Copy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button 
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Copy size={20} /> テキストとしてコピー
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="font-medium">クリップボードにコピーしました</span>
        </div>
      )}
    </div>
  );
};
