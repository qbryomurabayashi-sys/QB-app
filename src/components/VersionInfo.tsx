import React from 'react';
import { ArrowLeft, Zap, Calendar } from 'lucide-react';

interface VersionUpdate {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

const UPDATES: VersionUpdate[] = [
  {
    version: '2.4.0',
    date: '2026-04-26',
    title: 'シェアリング & デザイン・アップデート',
    type: 'major',
    changes: [
      '個別スタッフデータの共有コード・ファイル共有機能を実装。',
      '起動時のプロフェッショナル・ローディング画面（3.5秒）を実装。',
      'モバイル端末用ホーム画面アイコンの設定。',
      '共有データ取込時の新規登録自動処理機能を実装。'
    ]
  },
  {
    version: '2.3.0',
    date: '2026-03-11',
    title: '評価システムの刷新とUIの強化',
    type: 'major',
    changes: [
      'ユーザーインターフェースの全面的な見直しと視認性の向上。',
      'すべてのラベルとテキストのローカライズ適正化。',
      'アクセシビリティに配慮し、フォントサイズとコントラストを調整。',
      'パフォーマンスの最適化と読み込み時間の短縮。'
    ]
  },
  {
    version: '2.2.1',
    date: '2026-03-06',
    title: '不具合修正と安定性の向上',
    type: 'patch',
    changes: [
      'ブラウザの自動翻訳機能によるレイアウト崩れの修正。',
      '一括データ出力時のスコアリング計算ロジックの不具合を解消。'
    ]
  },
  {
    version: '2.2.0',
    date: '2026-03-04',
    title: 'UI/UXの改善とレーダーチャートの調整',
    type: 'minor',
    changes: [
      '評価基準ガイドの操作性と視覚的フィードバックを改善。',
      '不要なUI要素を削減し、入力作業の効率を向上。',
      'レーダーチャートの各指標軸を調整し、正確なデータ表示を実現。'
    ]
  },
  {
    version: '2.1.0',
    date: '2026-02-24',
    title: '店長アクションプラン機能の統合',
    type: 'major',
    changes: [
      '管理者（店長）向けの四半期アクションプラン作成モジュールの新規追加。',
      'ナビゲーションメニューの刷新。',
      '更新履歴および操作マニュアルの追加。'
    ]
  }
];

interface VersionInfoProps {
  onBack: () => void;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-40 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">更新履歴 (Changelog)</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 sm:p-8 flex-grow w-full">
        <div className="space-y-6">
          {UPDATES.map((update) => (
            <div key={update.version} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className={`p-4 flex justify-between items-center border-b ${
                update.type === 'major' ? 'bg-blue-50/50' : 'bg-gray-50/50'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${
                    update.type === 'major' ? 'bg-blue-600 text-white border-blue-600' : 
                    update.type === 'minor' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    v{update.version}
                  </span>
                  <h2 className="font-bold text-sm text-gray-800">{update.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                  <Calendar size={12} />
                  {update.date}
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  {update.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
                      <Zap size={14} className="mt-0.5 text-blue-500 shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-300 text-[10px] font-bold uppercase tracking-widest pb-8">
          <p>© 2026 Developer Team</p>
        </footer>
      </main>
    </div>
  );
};
