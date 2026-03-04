import React from 'react';
import { ArrowLeft, Zap, Calendar, Tag } from 'lucide-react';

interface VersionUpdate {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

const UPDATES: VersionUpdate[] = [
  {
    version: '2.1.0',
    date: '2026-02-24',
    title: 'アクションプラン統合とUI刷新',
    type: 'major',
    changes: [
      '店長向けアクションプラン作成ツールを統合しました。',
      'TOPページにハンバーガーメニューを搭載し、操作性を向上させました。',
      'バージョンアップ情報ページと操作説明ページを新設しました。',
      'アプリ名称を「QB総合ツール」に変更しました。'
    ]
  },
  {
    version: '2.0.1',
    date: '2026-02-24',
    title: '印刷機能の強化',
    type: 'patch',
    changes: [
      '全員分の一括印刷機能を追加しました。',
      '印刷用レイアウトの微調整を行い、視認性を向上させました。'
    ]
  },
  {
    version: '2.0.0',
    date: '2026-02-20',
    title: '評価システム正式リリース',
    type: 'major',
    changes: [
      'スタッフ評価システムの基本機能をリリースしました。',
      '関係性、接客、技術、実績、店長の5カテゴリ評価に対応。',
      'レーダーチャートによる分析機能の実装。',
      '履歴管理とCSV出力機能の搭載。'
    ]
  }
];

interface VersionInfoProps {
  onBack: () => void;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#00205b] text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">バージョンアップ情報</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 flex-grow w-full">
        <div className="space-y-6">
          {UPDATES.map((update, idx) => (
            <div key={update.version} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`p-4 flex justify-between items-center ${
                update.type === 'major' ? 'bg-blue-50 border-b border-blue-100' : 'bg-gray-50 border-b border-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    update.type === 'major' ? 'bg-blue-600 text-white' : 
                    update.type === 'minor' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    v{update.version}
                  </span>
                  <h2 className="font-bold text-gray-900">{update.title}</h2>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={14} />
                  {update.date}
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {update.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Zap size={14} className="mt-1 text-yellow-500 shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400 text-xs">
          <p>© 2026 QB総合ツール Development Team</p>
        </div>
      </main>
    </div>
  );
};
