import React from 'react';
import { MinusCircle, PlusCircle, ChevronDown } from 'lucide-react';

export const CriteriaGuide = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mx-2 sm:mx-4 mb-6 overflow-hidden print-break-inside-avoid font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 flex justify-between items-center text-sm sm:text-base font-bold transition-all duration-300 border rounded-md relative group ${isOpen ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
      >
        <span className="flex items-center gap-3">
          {isOpen ? <MinusCircle size={20} /> : <PlusCircle size={20} />}
          <span>4段階評価基準ガイド {isOpen ? '（閉じる）' : '（開く）'}</span>
        </span>
        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 text-sm sm:text-base text-gray-700 space-y-4 bg-white border-x border-b border-gray-200 rounded-b-md">
          <div className="flex gap-4 items-start">
            <span className="font-bold text-blue-800 bg-blue-100 px-3 py-1 shrink-0 h-fit rounded-full text-xs">3_極めて優秀</span>
            <div className="text-gray-600">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>期待を大きく上回る成果。高い質を維持。</li>
                <li>自発的な行動。周囲にポジティブな影響を与える。</li>
              </ul>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="flex gap-4 items-start">
            <span className="font-bold text-blue-800 bg-blue-100 px-3 py-1 shrink-0 h-fit rounded-full text-xs">2_標準的</span>
            <div className="text-gray-600">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>標準的な手順を遵守。安定した成果。</li>
                <li>現場での信頼性が高く、堅実な働き。</li>
              </ul>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="flex gap-4 items-start">
            <span className="font-bold text-orange-800 bg-orange-100 px-3 py-1 shrink-0 h-fit rounded-full text-xs">1_要改善</span>
            <div className="text-gray-600">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>基準を下回る。成果にばらつきがある。</li>
                <li>改善に向けた指導が必要な状態。</li>
              </ul>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="flex gap-4 items-start">
            <span className="font-bold text-red-800 bg-red-100 px-3 py-1 shrink-0 h-fit rounded-full text-xs">0_重大な課題</span>
            <div className="text-gray-600">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>最低限の基準に達しない。努力が認められない。</li>
                <li>継続的な能力の低下が見られる。</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
