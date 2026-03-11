import React from 'react';
import { MinusCircle, PlusCircle, ChevronDown } from 'lucide-react';

export const CriteriaGuide = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mx-2 sm:mx-4 mb-6 overflow-hidden print-break-inside-avoid font-serif">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-5 flex justify-between items-center text-base sm:text-lg font-bold transition-all duration-300 border-2 rounded-sm relative group ${isOpen
          ? 'bg-ff-blue-top text-white border-ff-silver/40'
          : 'bg-black/40 text-ff-gold border-ff-silver/20 hover:border-ff-gold/50 hover:text-white'
          }`}
      >
        <span className="ff-cursor !-left-4"></span>
        <span className="flex items-center gap-3 uppercase tracking-[0.2em]">
          {isOpen ? <MinusCircle size={24} /> : <PlusCircle size={24} />}
          <span>評価基準の導き V2.300 {isOpen ? '（閉じる）' : '（開く）'}</span>
        </span>
        <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-6 text-sm sm:text-base text-ff-silver space-y-6 bg-black/60 border-x border-b border-ff-silver/20 rounded-b-sm backdrop-blur-md">
          <div className="flex gap-4 items-start">
            <span className="font-bold text-black bg-ff-sky px-3 py-1 shrink-0 h-fit uppercase rounded-sm text-xs">3_極めて優秀</span>
            <div className="text-ff-silver/90">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>期待を大きく上回る成果。高い共鳴率を維持。</li>
                <li>自発的な行動。周囲にポジティブな影響を与える。</li>
              </ul>
            </div>
          </div>
          <hr className="border-ff-silver/10" />
          <div className="flex gap-4 items-start">
            <span className="font-bold text-black bg-ff-silver px-3 py-1 shrink-0 h-fit uppercase rounded-sm text-xs">2_標準的</span>
            <div className="text-ff-silver/90">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>標準的な手順を遵守。安定した成果。</li>
                <li>現場での信頼性が高く、堅実な働き。</li>
              </ul>
            </div>
          </div>
          <hr className="border-ff-silver/10" />
          <div className="flex gap-4 items-start">
            <span className="font-bold text-black bg-ff-gold px-3 py-1 shrink-0 h-fit uppercase rounded-sm text-xs">1_要改善</span>
            <div className="text-ff-silver/90">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>基準を下回る。不安定なデータストリーム。</li>
                <li>システムの再調整（指導）が必要な状態。</li>
              </ul>
            </div>
          </div>
          <hr className="border-ff-silver/10" />
          <div className="flex gap-4 items-start">
            <span className="font-bold text-white bg-ff-red px-3 py-1 shrink-0 h-fit uppercase rounded-sm text-xs">0_重大な課題</span>
            <div className="text-ff-silver/90">
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
