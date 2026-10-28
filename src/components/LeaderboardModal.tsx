import React from 'react';
import { DrawResult } from '../types';
import { formatCm, formatMm, getRank } from '../utils/measurement';
import { History, Trash2, X, Trophy, Sparkles } from 'lucide-react';

interface LeaderboardModalProps {
  records: DrawResult[];
  onClear: () => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  records,
  onClear,
  onClose,
}) => {
  // Sort by highest accuracy first
  const sorted = [...records].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262626]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#262626]/20 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F2EDE4] border-b border-[#262626]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF9F6] text-[#BC4B21] border border-[#262626]/10">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#262626]">
                個人測繪精度榮譽榜
              </h3>
              <p className="text-xs text-[#262626]/60 font-mono">
                PRECISION SURVEY HALL OF FAME // 11.00 CM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#262626]/50 hover:text-[#BC4B21] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-2.5">
          {sorted.length === 0 ? (
            <div className="py-12 text-center text-[#262626]/40 font-mono">
              <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">尚無任何測量紀錄，請在圖紙上畫下第一條 11 公分界線！</p>
            </div>
          ) : (
            sorted.slice(0, 15).map((rec, index) => {
              const rank = getRank(rec.accuracy);
              const diffSign = rec.diffCm > 0 ? '+' : '';
              return (
                <div
                  key={rec.id || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F2EDE4] border border-[#262626]/10 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs ${
                        index === 0
                          ? 'bg-[#BC4B21] text-[#E0FB41] shadow-2xs'
                          : index === 1
                          ? 'bg-[#262626] text-[#FAF9F6]'
                          : index === 2
                          ? 'bg-[#262626]/70 text-[#FAF9F6]'
                          : 'bg-[#FAF9F6] text-[#262626]/70 border border-[#262626]/15'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[#262626] flex items-center gap-1.5">
                        <span>{formatCm(rec.lengthCm)} cm</span>
                        <span className="text-[10px] font-normal text-[#262626]/50">
                          ({diffSign}
                          {formatMm(rec.diffCm)} mm)
                        </span>
                      </div>
                      <div className="text-[10px] text-[#262626]/60 font-mono">
                        {new Date(rec.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        ・{rank.badge}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-[#BC4B21] text-base">
                      {rec.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-[9px] text-[#262626]/50 font-mono uppercase tracking-wider">
                      精準度
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EDE4] border-t border-[#262626]/10 flex items-center justify-between font-mono">
          {sorted.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-[#BC4B21] hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清空測量歷史
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded bg-[#262626] hover:bg-[#BC4B21] text-[#FAF9F6] text-xs sm:text-sm font-bold transition-colors shadow-2xs"
            >
              返回圖紙
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
