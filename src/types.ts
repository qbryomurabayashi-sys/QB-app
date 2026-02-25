export type Category = '関係性' | '接客' | '技術' | '実績' | '店長';
export type Axis = 'マインド' | 'チームワーク' | '接客プロセス' | '提案・対応' | '技術力' | '実績' | '店長スキル';

export interface Incident {
  id: string;
  date: string;
  desc: string;
  deduction: number;
  improvement: number;
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
  criteria?: Record<number, string>;
  validScores?: number[];
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
