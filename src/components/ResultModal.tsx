import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { DrawResult, GameMode } from '../types';
import { getRank, formatCm, formatMm } from '../utils/measurement';
import { RulerTape } from './RulerTape';
import { soundManager } from '../utils/audio';
import {
  Award,
  RotateCcw,
  Share2,
  ArrowRight,
  Check,
  Target,
  Sparkles,
  Scale,
} from 'lucide-react';

interface ResultModalProps {
  result: DrawResult;
  pxPerCm: number;
  mode: GameMode;
  examRoundNumber?: number; // 1, 2, 3
  onRetry: () => void;
  onNextExamRound?: () => void;
  onViewCertificate?: () => void;
  onStartExam?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  pxPerCm,
  mode,
  examRoundNumber,
  onRetry,
  onNextExamRound,
  onViewCertificate,
  onStartExam,
}) => {
  const [copied, setCopied] = useState(false);
  const rank = getRank(result.accuracy);
  const diffSign = result.diffCm > 0 ? '+' : '';

  useEffect(() => {
    if (result.accuracy >= 97.0) {
      soundManager.playSuccessFanfare();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
      });
    }
  }, [result.accuracy]);

  const handleShare = () => {
    const text = `📐【11月11日地政節・11公分測量挑戰】\n我徒手畫出了 ${formatCm(
      result.lengthCm
    )} 公分！\n誤差僅 ${diffSign}${formatMm(
      result.diffCm
    )} mm（準確度 ${result.accuracy.toFixed(1)}%）\n榮獲稱號：${
      rank.title
    }\n你也來挑戰你的測量師直覺吧！`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262626]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#262626]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#BC4B21] px-6 py-4 text-[#FAF9F6] flex items-center justify-between border-b border-[#262626]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF9F6]/15 border border-[#FAF9F6]/20">
              <Award className="w-5 h-5 text-[#E0FB41]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                {mode === 'exam'
                  ? `檢定成果：第 ${examRoundNumber} 關驗收`
                  : '11.00 公分界址測繪成果'}
              </h3>
              <p className="text-xs text-[#FAF9F6]/80 font-mono">
                11.11 CADASTRAL VERIFICATION // TAIWAN
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-2xl font-black text-[#E0FB41]">
              {result.accuracy.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-[#FAF9F6] ml-0.5">%</span>
            <div className="text-[10px] text-[#FAF9F6]/75 uppercase tracking-wider">
              精準率 ACCURACY
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Rank Badge & Commentary */}
          <div
            className={`p-4 rounded-lg border ${rank.color} transition-all shadow-xs`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-serif font-bold text-base tracking-tight">
                {rank.title}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded border border-[#262626]/15 bg-[#FAF9F6] font-semibold">
                {rank.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#262626]/80 leading-relaxed font-sans">
              {rank.comment}
            </p>
          </div>

          {/* Metrics Trio */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#F2EDE4] border border-[#262626]/10 text-center">
              <div className="text-[11px] text-[#262626]/60 font-mono mb-1">
                實繪長度 DRAWN
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold text-[#262626]">
                {formatCm(result.lengthCm)}
                <span className="text-xs ml-0.5 font-normal">cm</span>
              </div>
              <div className="text-[10px] text-[#262626]/50 font-mono">
                {formatMm(result.lengthCm)} mm
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F2EDE4] border border-[#262626]/10 text-center">
              <div className="text-[11px] text-[#262626]/60 font-mono mb-1">
                基準目標 DATUM
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold text-[#BC4B21]">
                11.00
                <span className="text-xs ml-0.5 font-normal">cm</span>
              </div>
              <div className="text-[10px] text-[#262626]/50 font-mono">
                110.0 mm
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F2EDE4] border border-[#262626]/10 text-center">
              <div className="text-[11px] text-[#262626]/60 font-mono mb-1">
                界址偏差 DELTA
              </div>
              <div
                className={`font-mono text-lg sm:text-xl font-bold ${
                  Math.abs(result.diffCm) <= 0.2
                    ? 'text-[#BC4B21]'
                    : 'text-[#262626]'
                }`}
              >
                {diffSign}
                {formatCm(result.diffCm)}
                <span className="text-xs ml-0.5 font-normal">cm</span>
              </div>
              <div className="text-[10px] text-[#262626]/50 font-mono">
                {diffSign}
                {formatMm(result.diffCm)} mm
              </div>
            </div>
          </div>

          {/* Interactive Ruler Reveal */}
          <div>
            <div className="text-xs font-mono text-[#262626] mb-2 flex items-center gap-1.5 font-semibold">
              <Scale className="w-3.5 h-3.5 text-[#BC4B21]" />
              實體標尺校對基準 (Steel Tape Alignment)
            </div>
            <RulerTape drawnLengthCm={result.lengthCm} targetCm={11} pxPerCm={pxPerCm} />
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-[#F2EDE4] border-t border-[#262626]/10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 font-mono">
            <button
              id="btn-result-retry"
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded text-[#262626] bg-[#FAF9F6] border border-[#262626]/15 hover:border-[#BC4B21] hover:text-[#BC4B21] font-medium text-xs sm:text-sm transition-all shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              重新校驗
            </button>

            <button
              id="btn-result-share"
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded text-[#262626] bg-[#FAF9F6] border border-[#262626]/15 hover:border-[#BC4B21] hover:text-[#BC4B21] font-medium text-xs sm:text-sm transition-all shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#BC4B21]" />
                  已複製！
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  分享成果
                </>
              )}
            </button>
          </div>

          <div>
            {mode === 'exam' && examRoundNumber && examRoundNumber < 3 && onNextExamRound && (
              <button
                id="btn-next-exam-round"
                type="button"
                onClick={onNextExamRound}
                className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#BC4B21] hover:bg-[#A63D18] text-[#FAF9F6] font-mono font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                進入第 {examRoundNumber + 1} 關
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {mode === 'exam' && examRoundNumber === 3 && onViewCertificate && (
              <button
                id="btn-view-certificate"
                type="button"
                onClick={onViewCertificate}
                className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#BC4B21] hover:bg-[#A63D18] text-[#FAF9F6] font-mono font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#E0FB41]" />
                頒發技師證書
              </button>
            )}

            {mode === 'quick' && onStartExam && (
              <button
                id="btn-quick-to-exam"
                type="button"
                onClick={onStartExam}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#BC4B21] hover:bg-[#A63D18] text-[#FAF9F6] font-mono font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                挑戰三關檢定
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
