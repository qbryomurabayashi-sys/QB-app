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
    version: '2.3.0',
    date: '2026-03-11',
    title: '幻想の再構築：クリスタル・レコードへの昇華',
    type: 'major',
    changes: [
      'UIを「クリスタル・レコード」幻想テーマへ全面的に刷新。',
      'すべてのインターフェースを日本語に翻訳。',
      'シニアユーザーに配慮し、フォントサイズと視認性を大幅に向上。',
      '操作カーソルを「クリスタル」に変更。',
      '霧のパーティクル効果と幻想的なローディング画面を実装。'
    ]
  },
  {
    version: '2.2.1',
    date: '2026-03-06',
    title: '翻訳同期の修正 ＆ ロジック調整',
    type: 'patch',
    changes: [
      'ブラウザの自動翻訳による表示崩れを防止。',
      '一括出力時のインシデント減点同期エラーを修正。'
    ]
  },
  {
    version: '2.2.0',
    date: '2026-03-04',
    title: 'UI最適化 ＆ レーダー再調整',
    type: 'minor',
    changes: [
      'スコア選択時の評価基準ガイドの視認性を向上。',
      '非操作時のガイドを非表示にし、視覚的ノイズを軽減。',
      'レーダーチャートの軸を従来指標に戻し、同期性を改善。'
    ]
  },
  {
    version: '2.1.0',
    date: '2026-02-24',
    title: '行動計画の統合 ＆ システム刷新',
    type: 'major',
    changes: [
      '指揮官の行動計画管理モジュールを統合。',
      'ナビゲーション向上のためハンバーガーメニューを実装。',
      '更新履歴 ＆ 操作マニュアルのチャンネルを配備。'
    ]
  }
];

interface VersionInfoProps {
  onBack: () => void;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col font-serif relative overflow-hidden">
      <div className="mist-container opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mist-particle" style={{ width: '250px', height: '250px', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 2.5}s` }} />
        ))}
      </div>
      
      <header className="bg-ff-blue-top text-white p-6 sticky top-0 z-40 border-b-4 border-ff-silver/30 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-ff-silver hover:text-ff-gold transition-colors relative group">
            <span className="ff-cursor !-left-10"></span>
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-ff-gold">システム更新履歴</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 sm:p-8 flex-grow w-full relative z-10">
        <div className="space-y-8">
          {UPDATES.map((update, idx) => (
            <div key={update.version} className="ff-window overflow-hidden">
              <div className={`p-5 flex justify-between items-center border-b border-ff-silver/20 ${
                update.type === 'major' ? 'bg-ff-blue-top/20' : 'bg-black/40'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 border text-xs font-bold uppercase rounded-sm ${
                    update.type === 'major' ? 'bg-ff-gold text-black border-ff-gold' : 
                    update.type === 'minor' ? 'bg-ff-sky text-black border-ff-sky' : 'bg-black text-ff-silver border-ff-silver/40'
                  }`}>
                    v{update.version}
                  </span>
                  <h2 className="font-bold text-ff-gold text-base uppercase tracking-widest">{update.title}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-ff-silver/70 uppercase tracking-widest">
                  <Calendar size={14} />
                  {update.date}
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {update.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-3 text-sm sm:text-base text-ff-silver/90 leading-relaxed">
                      <Zap size={16} className="mt-1 text-ff-gold shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-ff-silver/30 text-xs uppercase tracking-[0.3em]">
          <p>© 2026 CRYSTAL_RECORDS_DEV_TEAM</p>
        </div>
      </main>
    </div>
  );
};
