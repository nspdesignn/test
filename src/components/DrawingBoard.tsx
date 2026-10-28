import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundManager } from '../utils/audio';
import { ExamRound } from '../types';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Navigation,
  Crosshair,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface DrawingBoardProps {
  pxPerCm: number;
  targetCm?: number;
  constrainedMode?: ExamRound; // 'horizontal' | 'vertical' | 'free'
  onFinishLine: (lengthPx: number, lengthCm: number, points: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) => void;
  disabled?: boolean;
}

export const DrawingBoard: React.FC<DrawingBoardProps> = ({
  pxPerCm,
  targetCm = 11,
  constrainedMode = 'free',
  onFinishLine,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [showRealtimeLength, setShowRealtimeLength] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 600, height: 400 });

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute constrained end point
  const getConstrainedPoint = useCallback(
    (start: { x: number; y: number }, current: { x: number; y: number }) => {
      if (constrainedMode === 'horizontal') {
        return { x: current.x, y: start.y };
      }
      if (constrainedMode === 'vertical') {
        return { x: start.x, y: current.y };
      }
      return current;
    },
    [constrainedMode]
  );

  // Calculate length
  const computeLength = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const px = Math.sqrt(dx * dx + dy * dy);
    const cm = px / pxPerCm;
    return { px, cm };
  };

  const getPointerPos = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const pos = getPointerPos(e);
    setIsDrawing(true);
    setStartPoint(pos);
    setCurrentPoint(pos);
    soundManager.playDrawStart();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPoint || disabled) return;
    const pos = getPointerPos(e);
    const constrained = getConstrainedPoint(startPoint, pos);
    setCurrentPoint(constrained);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPoint || !currentPoint || disabled) return;
    setIsDrawing(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const constrained = getConstrainedPoint(startPoint, currentPoint);
    const { px, cm } = computeLength(startPoint, constrained);

    // Minimum line length threshold: at least 1cm to avoid accidental taps
    if (cm < 0.5) {
      setStartPoint(null);
      setCurrentPoint(null);
      return;
    }

    soundManager.playMeasureBeep();
    onFinishLine(px, cm, {
      startX: startPoint.x,
      startY: startPoint.y,
      endX: constrained.x,
      endY: constrained.y,
    });
  };

  const handleReset = () => {
    setStartPoint(null);
    setCurrentPoint(null);
    setIsDrawing(false);
  };

  // Compute live measurement for preview
  const activeLength =
    startPoint && currentPoint
      ? computeLength(startPoint, getConstrainedPoint(startPoint, currentPoint))
      : null;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Action Toolbar above canvas */}
      <div className="w-full flex items-center justify-between py-2 px-1 text-xs text-[#262626]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono font-bold text-[#BC4B21] bg-[#F2EDE4] px-3 py-1 rounded border border-[#BC4B21]/20">
            <Crosshair className="w-3.5 h-3.5 text-[#BC4B21]" />
            SPEC: {targetCm}.00 CM // 110.0 MM
          </span>
          {constrainedMode !== 'free' && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-[#262626]/70 bg-[#F2EDE4] px-2.5 py-1 rounded border border-[#262626]/10">
              <Navigation className="w-3 h-3 text-[#BC4B21]" />
              {constrainedMode === 'horizontal' ? 'AXIS: 水平檢定' : 'AXIS: 垂直檢定'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono">
          {/* Realtime Length Peek Toggle (Practice Mode) */}
          <button
            id="toggle-practice-peek"
            type="button"
            onClick={() => setShowRealtimeLength((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border transition-all ${
              showRealtimeLength
                ? 'bg-[#E0FB41] text-[#262626] border-[#262626]/20 font-bold shadow-2xs'
                : 'bg-[#F2EDE4] text-[#262626]/80 border-[#262626]/10 hover:bg-[#FAF9F6]'
            }`}
          >
            {showRealtimeLength ? (
              <>
                <Eye className="w-3.5 h-3.5 text-[#262626]" />
                即時尺標開
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 opacity-60" />
                盲繪手感測驗
              </>
            )}
          </button>

          {startPoint && (
            <button
              id="btn-reset-board"
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1 rounded bg-[#F2EDE4] text-[#262626] hover:text-[#BC4B21] border border-[#262626]/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重新定位
            </button>
          )}
        </div>
      </div>

      {/* Cadastral Blueprint Canvas Box */}
      <div
        ref={containerRef}
        id="cadastral-drawing-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[360px] sm:h-[420px] rounded-lg overflow-hidden border select-none touch-none cursor-crosshair transition-all ${
          disabled
            ? 'opacity-80 pointer-events-none'
            : isDrawing
            ? 'border-[#BC4B21] shadow-lg shadow-[#BC4B21]/10 ring-1 ring-[#BC4B21]/30'
            : 'border-[#262626]/15 hover:border-[#BC4B21]/60'
        } bg-[#FAF9F6]`}
        style={{
          // Cadastral Blueprint Millimeter Grid pattern
          backgroundImage: `
            linear-gradient(to right, rgba(38, 38, 38, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38, 38, 38, 0.04) 1px, transparent 1px),
            linear-gradient(to right, rgba(188, 75, 33, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(188, 75, 33, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px, 10px 10px, 50px 50px, 50px 50px',
        }}
      >
        {/* Architectural Corner Registration Marks */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#BC4B21]/50 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#BC4B21]/50 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#BC4B21]/50 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#BC4B21]/50 pointer-events-none" />

        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.05] select-none">
          <div className="font-mono text-7xl sm:text-9xl font-black tracking-widest text-[#262626]">
            11.11
          </div>
          <div className="font-serif text-xl sm:text-2xl font-bold tracking-widest mt-2 text-[#BC4B21]">
            地政節・國家土地基準測量
          </div>
          <div className="font-mono text-xs tracking-widest mt-1 text-[#262626]">
            CADASTRAL REFERENCE DATUM // SCALE 1:1
          </div>
        </div>

        {/* Empty state invitation hint if not drawing yet */}
        {!startPoint && !isDrawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#F2EDE4] text-[#BC4B21] flex items-center justify-center mb-3 shadow-xs border border-[#BC4B21]/30">
              <Crosshair className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-serif font-bold text-[#262626] text-base sm:text-lg mb-1">
              按住並拖曳，劃下你感應的「11.00 公分」
            </h3>
            <p className="text-xs sm:text-sm text-[#262626]/70 max-w-sm font-sans leading-relaxed">
              寸土寸金，毫釐攸關產權。憑你的手眼直覺拉出線條，放開手指或滑鼠即刻驗收精度！
            </p>
          </div>
        )}

        {/* Live SVG Vector Rendering */}
        {startPoint && currentPoint && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ width: containerSize.width, height: containerSize.height }}
          >
            <defs>
              <linearGradient id="laserLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BC4B21" />
                <stop offset="100%" stopColor="#A63D18" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#BC4B21" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Guide hairline trace */}
            <line
              x1={startPoint.x}
              y1={startPoint.y}
              x2={currentPoint.x}
              y2={currentPoint.y}
              stroke="rgba(38, 38, 38, 0.12)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Main Drawn Cadastral Line in Terracotta */}
            <line
              x1={startPoint.x}
              y1={startPoint.y}
              x2={currentPoint.x}
              y2={currentPoint.y}
              stroke="url(#laserLine)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Start Boundary Marker (土地界標/鋼釘標) */}
            <g transform={`translate(${startPoint.x}, ${startPoint.y})`}>
              <circle r="9" fill="#BC4B21" fillOpacity="0.15" />
              <circle r="5" fill="#BC4B21" stroke="#FAF9F6" strokeWidth="2" />
            </g>

            {/* End Point Survey Target */}
            <g transform={`translate(${currentPoint.x}, ${currentPoint.y})`}>
              <circle r="10" fill="#E0FB41" fillOpacity="0.4" className="animate-ping" />
              <circle r="5" fill="#262626" stroke="#E0FB41" strokeWidth="2" />
            </g>
          </svg>
        )}

        {/* Start Point Label Badge */}
        {startPoint && (
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-9 flex items-center gap-1 px-2 py-0.5 rounded bg-[#262626] text-[#FAF9F6] text-[10px] font-mono font-medium shadow-md border border-[#FAF9F6]/20"
            style={{ left: `${startPoint.x}px`, top: `${startPoint.y}px` }}
          >
            <MapPin className="w-3 h-3 text-[#BC4B21]" />
            基準界標 PT-01
          </div>
        )}

        {/* Current Endpoint Info Tooltip */}
        {startPoint && currentPoint && (
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-10 flex items-center gap-1.5 px-3 py-1 rounded bg-[#262626] text-[#FAF9F6] text-xs font-mono shadow-xl border border-[#FAF9F6]/10 z-20"
            style={{ left: `${currentPoint.x}px`, top: `${currentPoint.y}px` }}
          >
            {showRealtimeLength && activeLength ? (
              <span className="text-[#E0FB41] font-bold text-sm">
                {activeLength.cm.toFixed(2)} cm
              </span>
            ) : (
              <span className="text-[#FAF9F6]/90 font-medium">
                {isDrawing ? '測繪中...放開評定' : '測量完成'}
              </span>
            )}
          </div>
        )}

        {/* Bottom Banner inside canvas */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] text-[#262626]/60 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#BC4B21]" />
            <span>CALIBRATION RATIO: 1.0 CM ≈ {pxPerCm.toFixed(1)} PX</span>
          </div>
          <div className="hidden sm:block">11.11 TAIWAN CADASTRAL SURVEY STANDARDS</div>
        </div>
      </div>
    </div>
  );
};
