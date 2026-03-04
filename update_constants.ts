import fs from 'fs';
import { evaluationData } from './src/data';
import { INITIAL_ITEMS } from './src/constants';

const updatedItems = INITIAL_ITEMS.map(item => {
  if (item.category === '接客') {
    // Find matching item in evaluationData
    for (const cat of evaluationData.evaluations) {
      for (const dataItem of cat.items) {
        // Remove [cite: X] from minorCategory and evaluationPoint
        const cleanMinorCategory = dataItem.minorCategory.replace(/\s*\[cite:\s*\d+\]\s*/g, '').trim();
        if (item.item === cleanMinorCategory) {
          // Update desc, pointDesc, and criteria
          const cleanEvaluationPoint = dataItem.evaluationPoint.replace(/\s*\[cite:\s*\d+\]\s*/g, '').trim();
          
          const newCriteria: Record<number, string> = {};
          for (const [scoreStr, texts] of Object.entries(dataItem.criteria)) {
            const score = parseInt(scoreStr, 10);
            const cleanTexts = texts.map(t => t.replace(/\s*\[cite:\s*\d+\]\s*/g, '').trim());
            newCriteria[score] = cleanTexts.join('\n');
          }
          
          return {
            ...item,
            desc: cleanEvaluationPoint,
            pointDesc: cleanEvaluationPoint,
            criteria: newCriteria
          };
        }
      }
    }
  }
  return item;
});

const output = `import { Category, Axis, EvaluationItem } from './types';

export const CATEGORIES: Category[] = ['関係性', '接客', '技術', '実績', '店長'];
export const AXES: Axis[] = ['マインド', 'チームワーク', '接客プロセス', '提案・対応', '技術力', '実績', '店長スキル', '運営管理スキル', '顧客サービススキル', 'チームマネジメントスキル', '戦略思考スキル', '問題解決スキル', '個人の属性', '管理責任・コンプライアンス'];
export const MANAGER_AXES = ['運営管理スキル', '顧客サービススキル', 'チームマネジメントスキル', '戦略思考スキル', '問題解決スキル', '個人の属性', '管理責任・コンプライアンス'];
export const MONTH_LABELS = ['7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月'];
export const MONTHS = MONTH_LABELS.map((label, index) => ({ label, index }));

export const CLAIM_DEDUCTIONS = {
  tech: [
    { score: 0, label: "なし", desc: "技術クレームが発生しなかった、または発生しても適切に対応" },
    { score: -3, label: "軽微 (-1~-3)", desc: "軽微な技術的問題（切り直し可能、一時的な品質低下など）" },
    { score: -6, label: "中程度 (-4~-6)", desc: "日常に一定の影響を与える技術的問題（短期間完了の切り直しレベル）" },
    { score: -9, label: "重大 (-7~-9)", desc: "重大な不便を引き起こす技術的失敗（切り直し不可）" },
    { score: -10, label: "違反/事故 (-10)", desc: "重大な違反（禁止された施術方法、重大な切りすぎ）" }
  ],
  accident: [
    { score: 0, label: "なし", desc: "事故発生なし" },
    { score: -10, label: "事故発生 (-10)", desc: "事故内容、改善度合いにより精査" }
  ],
  service: [
    { score: 0, label: "なし", desc: "クレーム発生なし" },
    { score: -4, label: "軽微 (-1~-4)", desc: "軽微な接客ミス（対応の遅れ、些細な態度の問題など）" },
    { score: -9, label: "不十分 (-5~-9)", desc: "極めて不十分な対応（不快感を与える態度など）" },
    { score: -14, label: "不適切 (-10~-14)", desc: "明らかに不適切な態度を取った場合" },
    { score: -15, label: "重大違反 (-15)", desc: "重大なルール違反行為があった場合" }
  ]
};

export const IMPROVEMENT_OPTS = [
  { score: 5, label: "+5点", desc: "積極的な改善行動（自ら改善策を提案し実施）" },
  { score: 3, label: "+3点", desc: "改善へ取り組み（意志を示し、一定の行動を起こした）" },
  { score: 1, label: "+1点", desc: "反省の態度（問題を認識し、謝罪や反省の意を示した）" },
  { score: 0, label: "0点", desc: "特になし" }
];

export const INITIAL_ITEMS: EvaluationItem[] = ${JSON.stringify(updatedItems, null, 2)};
`;

fs.writeFileSync('./src/constants.ts', output);
console.log('Done');
