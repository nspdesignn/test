import { SurveyorRank } from '../types';

// Standard CSS physical cm (96 DPI / 2.54 cm per inch)
export const DEFAULT_PX_PER_CM = 96 / 2.54; // ~37.79527559 px

// Standard ID/Credit card width in mm and cm
export const STANDARD_CARD_WIDTH_CM = 8.56; // 85.6 mm (ISO/IEC 7810 ID-1)

export const RANKS: SurveyorRank[] = [
  {
    minAccuracy: 99.0,
    title: '國寶級特等測量技師 🏆',
    badge: '特等測量技師',
    color: 'text-[#BC4B21] border-[#BC4B21] bg-[#F2EDE4]',
    comment: '神之手！達到公釐級極限精度，分毫不差，足以主持國家重大地籍基準測繪！',
  },
  {
    minAccuracy: 97.0,
    title: '資深地籍調查大師 📐',
    badge: '地籍調查大師',
    color: 'text-[#262626] border-[#262626] bg-[#F2EDE4]',
    comment: '精準俐落！手感宛如高階光波測距儀，界標清晰穩固，深獲地主信賴！',
  },
  {
    minAccuracy: 94.0,
    title: '合格土地測量員 🧭',
    badge: '合格土地測量員',
    color: 'text-[#8A4A28] border-[#8A4A28]/50 bg-[#FAF9F6]',
    comment: '表現優異！手眼協調絕佳，具備地政人嚴謹敏銳的空間直覺。',
  },
  {
    minAccuracy: 88.0,
    title: '見習地政查驗生 📋',
    badge: '見習查驗生',
    color: 'text-[#5C554E] border-[#5C554E]/40 bg-[#FAF9F6]',
    comment: '直覺良好！多累積肌肉記憶與捲尺手感，很快就能晉身資深測量員！',
  },
  {
    minAccuracy: 0,
    title: '界標校準中 🚧',
    badge: '待覆核查驗',
    color: 'text-[#7D756C] border-[#7D756C]/30 bg-[#FAF9F6]',
    comment: '界址線稍有偏差！放輕鬆調整呼吸，重新挑戰畫出完美的11公分！',
  },
];

export function calculateAccuracy(lengthCm: number, targetCm = 11): number {
  const diff = Math.abs(lengthCm - targetCm);
  // Max penalty: if diff >= 11, accuracy is 0.
  const raw = 100 - (diff / targetCm) * 100;
  return Math.max(0, Math.min(100, Math.round(raw * 10) / 10));
}

export function getRank(accuracy: number): SurveyorRank {
  for (const rank of RANKS) {
    if (accuracy >= rank.minAccuracy) {
      return rank;
    }
  }
  return RANKS[RANKS.length - 1];
}

export function formatCm(cm: number): string {
  return cm.toFixed(2);
}

export function formatMm(cm: number): string {
  return (cm * 10).toFixed(1);
}

// Calibration storage helper
const STORAGE_KEY_PX_PER_CM = 'land_day_11cm_px_per_cm';

export function getStoredPxPerCm(): number {
  if (typeof window === 'undefined') return DEFAULT_PX_PER_CM;
  const val = localStorage.getItem(STORAGE_KEY_PX_PER_CM);
  if (!val) return DEFAULT_PX_PER_CM;
  const parsed = parseFloat(val);
  return isNaN(parsed) || parsed < 15 || parsed > 200 ? DEFAULT_PX_PER_CM : parsed;
}

export function saveStoredPxPerCm(val: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PX_PER_CM, val.toString());
}
