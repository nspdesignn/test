import React, { useState } from 'react';
import { ExamState } from '../types';
import { getRank, formatCm, formatMm } from '../utils/measurement';
import { soundManager } from '../utils/audio';
import {
  Award,
  Download,
  Share2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface CertificateModalProps {
  examState: ExamState;
  onClose: () => void;
  onRestartExam: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  examState,
  onClose,
  onRestartExam,
}) => {
  const [userName, setUserName] = useState('王大測');
  const [copied, setCopied] = useState(false);

  // Compute average accuracy
  const validResults = examState.rounds
    .map((r) => r.result)
    .filter((res): res is NonNullable<typeof res> => !!res);

  const avgAccuracy =
    validResults.length > 0
      ? validResults.reduce((acc, curr) => acc + curr.accuracy, 0) /
        validResults.length
      : 0;

  const rank = getRank(avgAccuracy);

  const handleShare = () => {
    const roundDetails = validResults
      .map(
        (r, i) =>
          `・第${i + 1}關 (${
            i === 0 ? '水平' : i === 1 ? '垂直' : '自由傾斜'
          })：${formatCm(r.lengthCm)} cm (精準度 ${r.accuracy.toFixed(1)}%)`
      )
      .join('\n');

    const text = `📜【11月11日地政節・測量技師檢定合格證書】\n考生：${userName}\n總體精準度：${avgAccuracy.toFixed(
      1
    )}%\n考核稱號：${rank.title}\n測量成果明細：\n${roundDetails}\n慶祝地政節，向所有默默守護國土產權的測量師致敬！`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#262626]/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#F2EDE4] rounded-xl shadow-2xl border border-[#262626]/20 overflow-hidden my-6">
        {/* Certificate Card Canvas */}
        <div className="p-6 sm:p-10 bg-[#FAF9F6] text-[#262626] relative border-4 border-double border-[#BC4B21]/30 rounded-lg m-3 shadow-xs">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#BC4B21] pointer-events-none" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#BC4B21] pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#BC4B21] pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#BC4B21] pointer-events-none" />

          {/* Close button in top-right */}
          <button
            id="btn-close-certificate"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded text-[#262626]/50 hover:text-[#BC4B21] hover:bg-[#F2EDE4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider bg-[#F2EDE4] text-[#BC4B21] border border-[#BC4B21]/20 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BC4B21]" />
              中華民國 11.11 地政節紀念特頒
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-[#262626]">
              地政測量技師檢定證書
            </h2>
            <p className="text-xs text-[#262626]/60 tracking-widest font-mono">
              CERTIFICATE OF CADASTRAL PRECISION SURVEYING
            </p>
          </div>

          {/* Recipient Input */}
          <div className="text-center my-4">
            <p className="text-xs text-[#262626]/60 mb-1 font-mono">
              茲證明測繪人員
            </p>
            <div className="inline-flex items-center gap-2 border-b-2 border-[#BC4B21]/50 pb-1 px-4">
              <input
                id="input-certificate-user-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="點擊輸入你的姓名或稱號"
                className="text-center text-xl sm:text-2xl font-serif font-bold text-[#BC4B21] bg-transparent outline-hidden max-w-[240px]"
              />
            </div>
            <p className="text-xs text-[#262626]/75 mt-2 max-w-md mx-auto leading-relaxed font-sans">
              參加 11 月 11 日地政節「11
              公分界址神準測繪考驗」，經三階段嚴密驗收，手感沉穩、精準劃界，成績斐然，特頒此證以茲鼓勵。
            </p>
          </div>

          {/* Score & Rank Highlight */}
          <div className="my-6 p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#262626]/60 font-mono">
                核定檢定稱號
              </div>
              <div className="text-lg sm:text-xl font-serif font-bold text-[#262626]">
                {rank.title}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#262626]/60 font-mono">
                總平均精準率
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-[#BC4B21]">
                {avgAccuracy.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* 3 Rounds Table */}
          <div className="space-y-2 text-xs sm:text-sm my-5">
            <div className="font-mono font-semibold text-[#262626] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BC4B21]" />
              三階段檢定測量數據明細
            </div>
            <div className="grid grid-cols-3 gap-2">
              {examState.rounds.map((round, idx) => (
                <div
                  key={round.round}
                  className="p-2.5 rounded bg-[#FAF9F6] border border-[#262626]/10 text-center"
                >
                  <div className="text-[10px] text-[#262626]/60 font-mono">
                    第 {idx + 1} 關：{round.name}
                  </div>
                  <div className="font-mono font-bold text-base text-[#262626] mt-0.5">
                    {round.result ? formatCm(round.result.lengthCm) : '--'} cm
                  </div>
                  <div className="text-[10px] text-[#BC4B21] font-mono">
                    {round.result
                      ? `${round.result.accuracy.toFixed(1)}% 準度`
                      : '未測試'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Cadastral Red Stamp */}
          <div className="mt-8 pt-4 flex items-end justify-between border-t border-dashed border-[#262626]/20 text-xs text-[#262626]/60 font-mono">
            <div>
              <div>頒證日期：民國115年11月11日</div>
              <div className="text-[11px] mt-0.5">字號：地政節檢字第111101號</div>
            </div>

            {/* Red Cadastral Seal in Terracotta */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#BC4B21] rounded flex flex-col items-center justify-center text-[#BC4B21] font-serif font-black p-1 text-center rotate-[-3deg] select-none shadow-xs">
              <div className="border border-[#BC4B21]/50 w-full h-full flex flex-col items-center justify-center p-0.5">
                <span className="text-[9px] tracking-tighter">中華民國地政節</span>
                <span className="text-xs sm:text-sm my-0.5 tracking-wider">
                  檢定合格章
                </span>
                <span className="text-[8px] font-mono">11.11 CADASTRAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Toolbar */}
        <div className="p-4 bg-[#FAF9F6] border-t border-[#262626]/10 flex flex-wrap items-center justify-between gap-3 font-mono">
          <button
            id="btn-restart-exam"
            onClick={onRestartExam}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-[#262626] bg-[#F2EDE4] hover:bg-[#FAF9F6] border border-[#262626]/15 text-xs sm:text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新考核
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-share-certificate"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#BC4B21] hover:bg-[#A63D18] text-[#FAF9F6] text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已複製證書內容！
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  複製分享證書
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
