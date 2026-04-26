import React from 'react';
import { ArrowLeft, HelpCircle, BookOpen, Printer, Save, Lock, Zap } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const SECTIONS: GuideSection[] = [
  {
    title: '基本操作',
    icon: <BookOpen className="text-blue-600" size={20} />,
    content: [
      '新規評価の作成：トップページのボタンから新しく記録を開始します。',
      '既存データの編集：一覧からスタッフを選択し、履歴または再開ボタンで編集に入ります。',
      'カテゴリー切替：上部のタブ（関係性、接客、技術など）で評価項目を切り替えます。'
    ]
  },
  {
    title: 'データの保存と復元',
    icon: <Save className="text-blue-600" size={20} />,
    content: [
      '自動保存：入力内容は自動的にブラウザ内に保存されます。一時保存ボタンで明示的に保存も可能です。',
      'バックアップ：設定メニューから全データをJSONファイルとしてエクスポートできます。',
      'データの復元：エクスポートしたJSONファイルを読み込むことでデータを一括復元できます。'
    ]
  },
  {
    title: '店長評価のロック',
    icon: <Lock className="text-blue-600" size={20} />,
    content: [
      '店長カテゴリーの閲覧にはパスワード認証が必要です。',
      '第三者による意図しない店長評価データの閲覧を防ぎます。',
      'パスワードは共通のアクセスキーを用いて解除してください。'
    ]
  },
  {
    title: '出力と印刷',
    icon: <Printer className="text-blue-600" size={20} />,
    content: [
      'フィードバックシート：A4サイズに最適化された評価シートを印刷できます。',
      '一括印刷：登録されている全スタッフの評価データを一括でプリンターへ送信可能です。',
      'CSV出力：エクセル等で編集可能なCSV形式で評価データをダウンロードできます。'
    ]
  },
  {
    title: '個別データの共有',
    icon: <Zap className="text-green-600" size={20} />,
    content: [
      '共有コードの発行：スタッフメニューから「共有コードを発行」を選択すると、そのスタッフ限定のデータを書き出せます。',
      '共有コードの読込：トップ画面右上のメニューから「共有コードから読込」を選択します。',
      'ファイル共有：JSONファイルを直接送受信するか、コードをコピー＆ペーストして共有可能です。'
    ]
  }
];

interface OperationGuideProps {
  onBack: () => void;
}

export const OperationGuide: React.FC<OperationGuideProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-40 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">操作マニュアル</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 sm:p-8 flex-grow w-full">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 mb-8">
          <HelpCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h2 className="font-bold text-blue-800 text-sm mb-1">システム概要</h2>
            <p className="text-xs text-blue-700 leading-relaxed">
              このツールは、スタッフの定期評価および管理者（店長）の店長アクションプランを効率的に管理するためのアプリケーションです。
              ブラウザにデータが保存されるため、オフラインでも利用可能ですが、データのバックアップを定期的に行うことを推奨します。
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section, idx) => (
            <section key={idx} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-gray-50 flex items-center gap-3 border-b">
                {section.icon}
                <h3 className="text-sm font-bold text-gray-800">{section.title}</h3>
              </div>
              <ul className="p-4 space-y-3">
                {section.content.map((text, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 font-bold rounded flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {tIdx + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-xl text-center">
          <h3 className="font-bold text-red-800 mb-2 text-sm uppercase tracking-tight">⚠️ データの取り扱いに関する注意</h3>
          <p className="text-[10px] text-red-700 leading-relaxed font-bold">
            データはブラウザの「ローカルストレージ」に保存されています。<br />
            ブラウザの「キャッシュ削除」を行うとすべてのデータが消去されます。<br />
            定期的にバックアップファイル（JSON）を出力し、大切に保管してください。
          </p>
        </div>
      </main>
    </div>
  );
};
