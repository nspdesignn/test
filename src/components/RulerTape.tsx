import React from 'react';

interface RulerTapeProps {
  drawnLengthCm: number;
  targetCm?: number;
  pxPerCm: number;
}

export const RulerTape: React.FC<RulerTapeProps> = ({
  drawnLengthCm,
  targetCm = 11,
  pxPerCm,
}) => {
  const maxCm = Math.max(15, Math.ceil(drawnLengthCm + 3));
  const ticks = [];

  for (let mm = 0; mm <= maxCm * 10; mm++) {
    const isCm = mm % 10 === 0;
    const isHalfCm = mm % 5 === 0 && !isCm;
    const cmValue = mm / 10;

    ticks.push(
      <div
        key={mm}
        className="absolute bottom-0 flex flex-col items-center"
        style={{ left: `${(mm / 10) * pxPerCm}px` }}
      >
        <div
          className={`w-[1px] transition-colors ${
            isCm
              ? 'h-6 bg-slate-800 dark:bg-slate-200'
              : isHalfCm
              ? 'h-4 bg-slate-500 dark:bg-slate-400'
              : 'h-2 bg-slate-300 dark:bg-slate-600'
          }`}
        />
        {isCm && (
          <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold select-none -translate-x-1/2 mt-1">
            {cmValue}
          </span>
        )}
      </div>
    );
  }

  const targetPx = targetCm * pxPerCm;
  const drawnPx = drawnLengthCm * pxPerCm;

  return (
    <div className="w-full overflow-x-auto py-4 px-2 select-none border border-[#262626]/15 rounded-lg bg-[#F2EDE4] shadow-xs">
      <div className="flex items-center justify-between text-xs font-mono text-[#262626] mb-2 px-1">
        <span className="font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#BC4B21]" />
          土地測量專用高精度鋼捲標尺 (Cadastral Standard Steel Scale)
        </span>
        <span className="text-[10px] opacity-70 tracking-widest">UNIT: CM // RES: 1.0 MM</span>
      </div>

      <div
        className="relative h-16 bg-[#FAF9F6] border-y border-[#262626]/20 rounded-sm"
        style={{ minWidth: `${maxCm * pxPerCm + 40}px` }}
      >
        {/* Millimeter & Centimeter Ticks */}
        {ticks}

        {/* 11cm Target Reference Flag */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-10 transition-all"
          style={{ left: `${targetPx}px` }}
        >
          <div className="w-[1.5px] h-full bg-[#BC4B21]" />
          <div className="absolute -top-3.5 bg-[#BC4B21] text-[#FAF9F6] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow-xs whitespace-nowrap -translate-x-1/2">
            基準標的 11.00 CM
          </div>
        </div>

        {/* Drawn User Marker */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-20 transition-all duration-500"
          style={{ left: `${drawnPx}px` }}
        >
          <div className="w-[1.5px] h-full bg-[#262626] border-l border-dashed border-[#E0FB41]" />
          <div className="absolute -bottom-3.5 bg-[#262626] text-[#E0FB41] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow-xs whitespace-nowrap -translate-x-1/2">
            實測長度 {drawnLengthCm.toFixed(2)} CM
          </div>
        </div>
      </div>
    </div>
  );
};
