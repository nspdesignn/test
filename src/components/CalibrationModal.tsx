import React, { useState } from 'react';
import {
  DEFAULT_PX_PER_CM,
  STANDARD_CARD_WIDTH_CM,
  saveStoredPxPerCm,
} from '../utils/measurement';
import {
  CreditCard,
  RotateCcw,
  Check,
  X,
  Sliders,
  Maximize2,
  Info,
} from 'lucide-react';

interface CalibrationModalProps {
  currentPxPerCm: number;
  onSavePxPerCm: (val: number) => void;
  onClose: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  currentPxPerCm,
  onSavePxPerCm,
  onClose,
}) => {
  const [val, setVal] = useState(currentPxPerCm);
  const [mode, setMode] = useState<'card' | 'ruler'>('card');
  const [savedToast, setSavedToast] = useState(false);

  const cardWidthPx = val * STANDARD_CARD_WIDTH_CM;
  const cardHeightPx = val * 5.398; // ISO card height 53.98 mm

  const handleApply = () => {
    saveStoredPxPerCm(val);
    onSavePxPerCm(val);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setVal(DEFAULT_PX_PER_CM);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262626]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#262626]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F2EDE4] border-b border-[#262626]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF9F6] text-[#BC4B21] border border-[#262626]/10">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#262626]">
                螢幕像素長度基準校準
              </h3>
              <p className="text-xs text-[#262626]/60 font-mono">
                SCREEN HARDWARE CALIBRATION // 1.0 CM DATUM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#262626]/50 hover:text-[#BC4B21] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Method Tabs */}
          <div className="flex rounded-lg bg-[#F2EDE4] p-1 text-xs font-mono">
            <button
              onClick={() => setMode('card')}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                mode === 'card'
                  ? 'bg-[#FAF9F6] text-[#BC4B21] font-bold shadow-2xs border border-[#262626]/10'
                  : 'text-[#262626]/70 hover:text-[#262626]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              健保卡 / 信用卡比對 (85.6mm)
            </button>
            <button
              onClick={() => setMode('ruler')}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                mode === 'ruler'
                  ? 'bg-[#FAF9F6] text-[#BC4B21] font-bold shadow-2xs border border-[#262626]/10'
                  : 'text-[#262626]/70 hover:text-[#262626]'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              實體尺基準比對 (10.0cm)
            </button>
          </div>

          {/* Guide Note */}
          <div className="p-3.5 rounded-lg bg-[#F2EDE4] border-l-3 border-[#BC4B21] text-xs text-[#262626]/80 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#BC4B21]" />
            <div className="leading-relaxed">
              {mode === 'card' ? (
                <span>
                  將任意標準卡片（如<strong>身分證、健保卡、信用卡</strong>）平貼在螢幕虛線框上，拖曳下方滑桿調整大小，使螢幕方框與實體卡片完全吻合！
                </span>
              ) : (
                <span>
                  拿一把真實直尺貼在螢幕上，微調下方數值，讓測量條長度剛好等於直尺上的{' '}
                  <strong className="text-[#BC4B21]">10.0 公分</strong>。
                </span>
              )}
            </div>
          </div>

          {/* Visual Calibration Stage */}
          <div className="w-full flex flex-col items-center justify-center p-4 min-h-[170px] bg-[#FAF9F6] architectural-grid rounded-lg border border-[#262626]/15 overflow-hidden">
            {mode === 'card' ? (
              <div
                className="relative border-2 border-dashed border-[#BC4B21] rounded-lg flex flex-col items-center justify-center text-center p-2 bg-[#FAF9F6]/90 transition-all shadow-xs"
                style={{
                  width: `${cardWidthPx}px`,
                  height: `${cardHeightPx}px`,
                  maxWidth: '100%',
                }}
              >
                <CreditCard className="w-6 h-6 text-[#BC4B21] mb-1 opacity-80" />
                <span className="text-xs font-serif font-bold text-[#262626]">
                  標準卡片長度 (85.6 mm)
                </span>
                <span className="text-[10px] text-[#262626]/60 font-mono">
                  請將實體卡片放置於此處吻合
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div
                  className="h-9 bg-[#262626] rounded flex items-center justify-between px-3 text-[#E0FB41] font-mono text-xs font-bold shadow-xs transition-all border border-[#262626]"
                  style={{
                    width: `${val * 10}px`,
                    maxWidth: '100%',
                  }}
                >
                  <span>0.0 CM</span>
                  <span className="text-[#FAF9F6]">實體 10.0 公分標尺</span>
                  <span>10.0 CM</span>
                </div>
                <span className="text-xs text-[#262626]/60 mt-2 font-mono">
                  使用實體鋼尺丈量上方長度
                </span>
              </div>
            )}
          </div>

          {/* Slider Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#262626]/70">
                每公分螢幕像素密度 (Pixels per CM)
              </span>
              <span className="font-bold text-[#BC4B21] text-sm">
                {val.toFixed(1)} px/cm
              </span>
            </div>
            <input
              id="slider-calibration-px"
              type="range"
              min="20"
              max="70"
              step="0.2"
              value={val}
              onChange={(e) => setVal(parseFloat(e.target.value))}
              className="w-full accent-[#BC4B21] cursor-pointer h-2 bg-[#F2EDE4] rounded-lg"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EDE4] border-t border-[#262626]/10 flex items-center justify-between font-mono">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[#262626]/70 hover:text-[#BC4B21] text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            恢復預設值
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-[#262626] hover:bg-[#FAF9F6] text-xs sm:text-sm font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#BC4B21] hover:bg-[#A63D18] text-[#FAF9F6] text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              {savedToast ? <Check className="w-4 h-4" /> : null}
              確認套用校準
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
