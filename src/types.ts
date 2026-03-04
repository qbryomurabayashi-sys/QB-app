export type Category = '関係性' | '接客' | '技術' | '実績' | '店長';
export type Axis = 'マインド' | 'チームワーク' | '接客プロセス' | '提案・対応' | '技術力' | '実績' | '店長スキル' | '運営管理スキル' | '顧客サービススキル' | 'チームマネジメントスキル' | '戦略思考スキル' | '問題解決スキル' | '個人の属性' | '管理責任・コンプライアンス';

export interface Incident {
  id: string;
  date: string;
  description: string;
  deduction?: number;
  improvement?: number;
}

export interface EvaluationItem {
  no: number;
  category: Category;
  subCategory: string;
  item: string;
  axis: Axis;
  max: number;
  score: number | null;
  desc: string;
  pointDesc?: string;
  validScores?: number[];
  criteria: Record<number, string>;
  memo?: string;
  incidents?: Incident[];
}

export interface PerformanceData {
  monthlyCuts: number[];
  excludedFromAverage: boolean[];
  goalCuts: number;
  goalScore: number;
  monthlyHolidays: number;
}

export interface Metadata {
  id: string;
  store: string;
  name: string;
  employeeId: string;
  evaluator: string;
  date: string;
  updatedAt: number;
  performance: PerformanceData;
}

export interface StaffSummary {
  id: string;
  name: string;
  store: string;
  date: string;
  updatedAt: number;
}

