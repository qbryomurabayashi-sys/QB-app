import React from 'react';
import { ArrowLeft, HelpCircle, BookOpen, Printer, Save, Database, Lock, Users, Zap } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const SECTIONS: GuideSection[] = [
  {
    title: '基本操作',
    icon: <BookOpen className="text-blue-600" size={24} />,
    content: [
      'TOP画面の「新規評価を作成」から新しいスタッフの評価を開始できます。',
      '既存のスタッフを選択すると、前回の続きから入力するか、新しく評価を作成するか選べます。',
      '各カテゴリ（関係性、接客など）のタブを切り替えて評価を入力してください。'
    ]
  },
  {
    title: '保存と復元',
    icon: <Save className="text-green-600" size={24} />,
    content: [
      '入力内容は自動的に保存されますが、手動で「保存」ボタンを押すことも可能です。',
      '「バックアップ保存」を行うと、すべてのデータをJSONファイルとしてPCに保存できます。',
      '「復元」機能を使うと、保存したJSONファイルからデータを元に戻せます。'
    ]
  },
  {
    title: '店長評価のロック',
    icon: <Lock className="text-red-600" size={24} />,
    content: [
      '「店長」カテゴリの評価はパスワードで保護されています。',
      '店長以外のスタッフが誤って入力・閲覧することを防ぐための機能です。',
      'パスワードを入力してロックを解除すると、店長スキルの評価が可能になります。'
    ]
  },
  {
    title: '印刷と出力',
    icon: <Printer className="text-purple-600" size={24} />,
    content: [
      '「印刷」ボタンで、現在の評価内容をA4サイズのフィードバックシートとして出力できます。',
      '「一括印刷」機能を使うと、登録されている全スタッフのシートをまとめて印刷用ダイアログに送ります。',
      '「CSV出力」でデータをExcelなどで管理可能な形式でダウンロードできます。'
    ]
  },
  {
    title: 'アクションプラン',
    icon: <Zap className="text-yellow-600" size={24} />,
    content: [
      '店長向けの「アクションプラン作成ツール」が統合されています。',
      '期初に目標を立て、四半期ごとに進捗を管理するためのツールです。',
      '作成したプランはテキストとしてコピーし、報告書などに貼り付けて利用できます。'
    ]
  }
];

interface OperationGuideProps {
  onBack: () => void;
}

export const OperationGuide: React.FC<OperationGuideProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#00205b] text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">総合操作説明</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 flex-grow w-full">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
          <HelpCircle className="text-blue-600 shrink-0 mt-1" size={20} />
          <div>
            <h2 className="font-bold text-blue-900 mb-1">お困りですか？</h2>
            <p className="text-sm text-blue-800 leading-relaxed">
              このツールは、QB Houseのスタッフ評価と店長の行動目標管理を一元化するためのものです。
              各機能の使い方は以下のセクションをご確認ください。
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section, idx) => (
            <section key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.content.map((text, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="w-5 h-5 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {tIdx + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-800 rounded-xl text-white text-center">
          <h3 className="font-bold mb-2">データの取り扱いについて</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            本アプリのデータはブラウザのローカルストレージに保存されます。<br />
            ブラウザのキャッシュを削除するとデータが消える可能性があるため、<br />
            定期的な「バックアップ保存」を強く推奨します。
          </p>
        </div>
      </main>
    </div>
  );
};
