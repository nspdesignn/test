import React, { useState, useEffect } from 'react';
import { GameMode, ExamState, DrawResult, ExamRound } from './types';
import {
  DEFAULT_PX_PER_CM,
  getStoredPxPerCm,
  calculateAccuracy,
  getRank,
  formatCm,
  formatMm,
} from './utils/measurement';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { DrawingBoard } from './components/DrawingBoard';
import { ResultModal } from './components/ResultModal';
import { CertificateModal } from './components/CertificateModal';
import { CalibrationModal } from './components/CalibrationModal';
import { KnowledgeModal } from './components/KnowledgeModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import {
  Trophy,
  Compass,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  HeartHandshake,
} from 'lucide-react';

const INITIAL_EXAM_STATE: ExamState = {
  currentRound: 1,
  rounds: [
    {
      round: 'horizontal',
      name: '水平界址線',
      description: '平坦農地/市地分割！請徒手畫出水平 11.00 公分界線',
    },
    {
      round: 'vertical',
      name: '垂直標高樁',
      description: '垂直高程或界樁放樣！請徒手畫出垂直 11.00 公分界樁',
    },
    {
      round: 'free',
      name: '坡地傾斜界址',
      description: '任意方向！憑你的空間手感畫出 11.00 公分任意線',
    },
  ],
  isFinished: false,
};

const STORAGE_KEY_RECORDS = 'land_day_11cm_records';

export default function App() {
  const [mode, setMode] = useState<GameMode>('quick');
  const [pxPerCm, setPxPerCm] = useState<number>(DEFAULT_PX_PER_CM);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [examState, setExamState] = useState<ExamState>(INITIAL_EXAM_STATE);
  const [currentResult, setCurrentResult] = useState<DrawResult | null>(null);
  const [records, setRecords] = useState<DrawResult[]>([]);

  // Modals
  const [showCalibration, setShowCalibration] = useState<boolean>(false);
  const [showKnowledge, setShowKnowledge] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Initialize stored pxPerCm and records
  useEffect(() => {
    setPxPerCm(getStoredPxPerCm());
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (raw) {
        setRecords(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  const handleFinishLine = (
    lengthPx: number,
    lengthCm: number,
    points: { startX: number; startY: number; endX: number; endY: number }
  ) => {
    const targetCm = 11;
    const diffCm = lengthCm - targetCm;
    const accuracy = calculateAccuracy(lengthCm, targetCm);
    const rank = getRank(accuracy);

    const newResult: DrawResult = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      mode,
      round: mode === 'exam' ? examState.rounds[examState.currentRound - 1].round : undefined,
      lengthPx,
      lengthCm,
      targetCm,
      diffCm,
      accuracy,
      title: rank.title,
      points,
    };

    setCurrentResult(newResult);

    // Save to records
    const updated = [newResult, ...records].slice(0, 30);
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // If exam mode, update exam round result
    if (mode === 'exam') {
      const updatedRounds = [...examState.rounds];
      updatedRounds[examState.currentRound - 1].result = newResult;
      setExamState({
        ...examState,
        rounds: updatedRounds,
      });
    }
  };

  const handleNextExamRound = () => {
    setCurrentResult(null);
    if (examState.currentRound < 3) {
      setExamState((prev) => ({
        ...prev,
        currentRound: prev.currentRound + 1,
      }));
    } else {
      setExamState((prev) => ({
        ...prev,
        isFinished: true,
      }));
      setShowCertificate(true);
    }
  };

  const handleRestartExam = () => {
    setExamState({
      ...INITIAL_EXAM_STATE,
      rounds: INITIAL_EXAM_STATE.rounds.map((r) => ({ ...r, result: undefined })),
    });
    setCurrentResult(null);
    setShowCertificate(false);
  };

  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    setCurrentResult(null);
    if (newMode === 'exam') {
      handleRestartExam();
    }
  };

  const handleStartExamFromQuick = () => {
    setMode('exam');
    handleRestartExam();
  };

  const currentExamRound =
    mode === 'exam' ? examState.rounds[examState.currentRound - 1] : null;

  const currentConstrainedMode: ExamRound =
    mode === 'exam' && currentExamRound ? currentExamRound.round : 'free';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#262626] flex flex-col font-sans selection:bg-[#BC4B21] selection:text-[#FAF9F6]">
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        onSelectMode={handleSelectMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenCalibration={() => setShowCalibration(true)}
        onOpenKnowledge={() => setShowKnowledge(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
      />

      {/* Main Game Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 flex flex-col gap-5">
        {/* Celebration Banner & Theme Prompt */}
        <section className="bg-[#F2EDE4] rounded-xl p-5 sm:p-6 shadow-xs border border-[#262626]/15 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FAF9F6] text-[#BC4B21] border border-[#BC4B21]/20">
                  <Calendar className="w-3.5 h-3.5 text-[#BC4B21]" />
                  11月11日 地政節・特設測繪場
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#262626]">
                {mode === 'quick'
                  ? '徒手標定 11.00 公分！挑戰你的測量師直覺'
                  : `地政技師考驗：第 ${examState.currentRound} 關 / 共 3 關`}
              </h2>
              <p className="text-xs sm:text-sm text-[#262626]/80 leading-relaxed font-sans">
                {mode === 'quick'
                  ? '地政界標講求分毫不差！在下方建築圖紙上隨手拖曳一條線，看你能否精準命中 11.00 公分（110.0 公釐）！'
                  : currentExamRound?.description}
              </p>
            </div>

            {/* Quick Stats / Target Pill */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#262626]/10 shrink-0">
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-[#262626]/60 font-mono uppercase tracking-wider">
                  基準檢定標的 DATUM
                </div>
                <div className="font-mono text-2xl font-black text-[#BC4B21]">
                  11.00 <span className="text-sm font-normal">cm</span>
                </div>
              </div>
              {records.length > 0 && (
                <div className="text-right mt-1">
                  <span className="text-[11px] text-[#262626]/70 font-mono">
                    個人最佳紀錄：
                    <strong className="text-[#BC4B21]">
                      {Math.max(...records.map((r) => r.accuracy)).toFixed(1)}%
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Exam Mode Multi-Step Progress Tracker */}
          {mode === 'exam' && (
            <div className="mt-5 pt-4 border-t border-[#262626]/10 grid grid-cols-3 gap-2">
              {examState.rounds.map((round, idx) => {
                const isCurrent = examState.currentRound === idx + 1;
                const isDone = !!round.result;
                return (
                  <div
                    key={round.round}
                    className={`p-2.5 rounded-lg border transition-all text-xs ${
                      isCurrent
                        ? 'border-[#BC4B21] bg-[#FAF9F6] text-[#262626] font-semibold shadow-2xs'
                        : isDone
                        ? 'border-[#262626]/20 bg-[#FAF9F6]/60 text-[#262626]'
                        : 'border-dashed border-[#262626]/20 text-[#262626]/40 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] opacity-70">PHASE 0{idx + 1}</span>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#BC4B21]" />
                      ) : null}
                    </div>
                    <div className="mt-0.5 font-serif font-bold truncate">{round.name}</div>
                    <div className="text-[10px] font-mono mt-0.5 opacity-80">
                      {round.result
                        ? `${formatCm(round.result.lengthCm)} cm (${round.result.accuracy.toFixed(0)}%)`
                        : isCurrent
                        ? '進行中...'
                        : '等待測繪'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* The Interactive Drawing Board */}
        <section className="bg-[#FAF9F6] rounded-xl p-4 sm:p-6 shadow-xs border border-[#262626]/15 flex flex-col items-center">
          <DrawingBoard
            pxPerCm={pxPerCm}
            targetCm={11}
            constrainedMode={currentConstrainedMode}
            onFinishLine={handleFinishLine}
            disabled={!!currentResult}
          />
        </section>

        {/* Informational Cards & Fun Badges */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-[#262626]">
          <div
            onClick={() => setShowKnowledge(true)}
            className="p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/15 hover:border-[#BC4B21] transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5 text-[#BC4B21] font-mono font-bold">
              <Compass className="w-4 h-4" />
              <span>為什麼是 11 公分？</span>
            </div>
            <p className="text-[#262626]/75 leading-relaxed font-sans">
              11月11日地政節，剛好與 11 公分相呼應！在界標測量中，每一公釐都攸關寸土產權。
            </p>
          </div>

          <div
            onClick={() => setShowCalibration(true)}
            className="p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/15 hover:border-[#BC4B21] transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5 text-[#262626] font-mono font-bold">
              <ShieldCheck className="w-4 h-4 text-[#BC4B21]" />
              <span>螢幕物理校準</span>
            </div>
            <p className="text-[#262626]/75 leading-relaxed font-sans">
              目前基準為 {pxPerCm.toFixed(1)} px/cm。可使用真實健保卡或直尺貼齊螢幕校正極致公釐精度！
            </p>
          </div>

          <div
            onClick={() => setShowLeaderboard(true)}
            className="p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/15 hover:border-[#BC4B21] transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5 text-[#BC4B21] font-mono font-bold">
              <Trophy className="w-4 h-4" />
              <span>榮譽榜與測量手感</span>
            </div>
            <p className="text-[#262626]/75 leading-relaxed font-sans">
              目前已記錄 {records.length} 次測繪。誤差小於 1mm 即可榮登「特等測量技師」殿堂！
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#262626]/70 border-t border-[#262626]/10 bg-[#F2EDE4]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-[#BC4B21]" />
            <span>11月11日 地政節・向全體測量、登記、估價與地政同仁致敬</span>
          </div>
          <div className="text-[10px] opacity-75">
            TAIWAN CADASTRAL DAY // 11.00 CM CHALLENGE
          </div>
        </div>
      </footer>

      {/* Result Modal / Ruler Reveal */}
      {currentResult && (
        <ResultModal
          result={currentResult}
          pxPerCm={pxPerCm}
          mode={mode}
          examRoundNumber={mode === 'exam' ? examState.currentRound : undefined}
          onRetry={() => setCurrentResult(null)}
          onNextExamRound={handleNextExamRound}
          onViewCertificate={() => {
            setCurrentResult(null);
            setShowCertificate(true);
          }}
          onStartExam={handleStartExamFromQuick}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          examState={examState}
          onClose={() => setShowCertificate(false)}
          onRestartExam={handleRestartExam}
        />
      )}

      {/* Calibration Modal */}
      {showCalibration && (
        <CalibrationModal
          currentPxPerCm={pxPerCm}
          onSavePxPerCm={(newVal) => setPxPerCm(newVal)}
          onClose={() => setShowCalibration(false)}
        />
      )}

      {/* Knowledge Modal */}
      {showKnowledge && <KnowledgeModal onClose={() => setShowKnowledge(false)} />}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          records={records}
          onClear={() => {
            setRecords([]);
            localStorage.removeItem(STORAGE_KEY_RECORDS);
          }}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
