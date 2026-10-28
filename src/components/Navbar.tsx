import React from 'react';
import { GameMode } from '../types';
import {
  Volume2,
  VolumeX,
  Sliders,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  History,
} from 'lucide-react';

interface NavbarProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCalibration: () => void;
  onOpenKnowledge: () => void;
  onOpenLeaderboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  onOpenCalibration,
  onOpenKnowledge,
  onOpenLeaderboard,
}) => {
  return (
    <header className="w-full bg-[#FAF9F6] border-b border-[#262626]/10 sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Date Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#BC4B21] flex items-center justify-center text-[#FAF9F6] shadow-sm shadow-[#BC4B21]/20">
            <span className="font-mono font-bold text-xs tracking-tighter">11.11</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-[#262626] text-base sm:text-lg tracking-tight">
                地政節 11公分測量大挑戰
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F2EDE4] text-[#BC4B21] border border-[#BC4B21]/20">
                11月11日・地政日
              </span>
            </div>
            <p className="text-xs text-[#262626]/60 font-serif italic">
              精準與土地的藝術：徒手劃出分毫不差之 11.00 公分界址
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs & Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Game Modes */}
          <div className="flex items-center p-1 bg-[#F2EDE4] rounded-lg border border-[#262626]/10 text-xs font-mono">
            <button
              id="tab-mode-quick"
              onClick={() => onSelectMode('quick')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                mode === 'quick'
                  ? 'bg-[#262626] text-[#FAF9F6] shadow-sm'
                  : 'text-[#262626]/70 hover:text-[#262626]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E0FB41]" />
              單次挑戰
            </button>
            <button
              id="tab-mode-exam"
              onClick={() => onSelectMode('exam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                mode === 'exam'
                  ? 'bg-[#BC4B21] text-[#FAF9F6] shadow-sm'
                  : 'text-[#262626]/70 hover:text-[#262626]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FAF9F6]" />
              三關技師檢定
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              id="btn-open-knowledge"
              onClick={onOpenKnowledge}
              title="地政節由來與知識"
              className="p-2 text-[#262626]/70 hover:text-[#BC4B21] hover:bg-[#F2EDE4] rounded-md transition-colors border border-transparent hover:border-[#262626]/10"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              id="btn-open-leaderboard"
              onClick={onOpenLeaderboard}
              title="歷史測量紀錄"
              className="p-2 text-[#262626]/70 hover:text-[#BC4B21] hover:bg-[#F2EDE4] rounded-md transition-colors border border-transparent hover:border-[#262626]/10"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              id="btn-open-calibration"
              onClick={onOpenCalibration}
              title="螢幕公分校準"
              className="p-2 text-[#262626]/70 hover:text-[#BC4B21] hover:bg-[#F2EDE4] rounded-md transition-colors border border-transparent hover:border-[#262626]/10"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              title={soundEnabled ? '關閉音效' : '開啟音效'}
              className="p-2 text-[#262626]/70 hover:text-[#BC4B21] hover:bg-[#F2EDE4] rounded-md transition-colors border border-transparent hover:border-[#262626]/10"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#BC4B21]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#262626]/40" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
