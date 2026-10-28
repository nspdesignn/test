export type GameMode = 'quick' | 'exam';

export type ExamRound = 'horizontal' | 'vertical' | 'free';

export interface DrawResult {
  id: string;
  timestamp: number;
  mode: GameMode;
  round?: ExamRound;
  lengthPx: number;
  lengthCm: number;
  targetCm: number;
  diffCm: number;
  accuracy: number; // 0 to 100
  title: string;
  points: { startX: number; startY: number; endX: number; endY: number };
}

export interface ExamState {
  currentRound: number; // 1, 2, 3
  rounds: {
    round: ExamRound;
    name: string;
    description: string;
    result?: DrawResult;
  }[];
  isFinished: boolean;
}

export interface CalibrationData {
  pxPerCm: number; // default ~37.795
  isCalibrated: boolean;
}

export interface SurveyorRank {
  minAccuracy: number;
  title: string;
  badge: string;
  color: string;
  comment: string;
}
