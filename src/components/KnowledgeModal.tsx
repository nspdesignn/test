import React from 'react';
import { BookOpen, X, MapPin, Compass, Shield, Heart } from 'lucide-react';

interface KnowledgeModalProps {
  onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262626]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#262626]/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#BC4B21] px-6 py-4 text-[#FAF9F6] flex items-center justify-between border-b border-[#262626]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF9F6]/15 border border-[#FAF9F6]/20">
              <BookOpen className="w-5 h-5 text-[#E0FB41]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                地政節小百科・11.11 的歷史淵源
              </h3>
              <p className="text-xs text-[#FAF9F6]/80 font-mono">
                CADASTRAL SURVEY ARCHIVES // EST. 1954
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#FAF9F6]/70 hover:text-[#FAF9F6] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-[#262626] text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/10">
            <div className="p-2 rounded bg-[#BC4B21] text-[#FAF9F6] shrink-0 mt-0.5 shadow-2xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#262626] text-base mb-1">
                為什麼 11 月 11 日是地政節？
              </h4>
              <p className="text-xs sm:text-sm text-[#262626]/80 leading-relaxed font-sans">
                民國 43 年（西元 1954 年），內政部為表彰地政從業人員的辛勞與土地改革對社會穩定的深遠貢獻，特別訂定每年的
                <strong className="text-[#BC4B21]"> 11 月 11 日為「地政節」</strong>。
                「十一」兩字上下疊合即為「<strong>士</strong>」字，意寓地政人員恪盡職守、經緯萬端的崇高專業精神。
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/10">
            <div className="p-2 rounded bg-[#262626] text-[#FAF9F6] shrink-0 mt-0.5 shadow-2xs">
              <MapPin className="w-4 h-4 text-[#E0FB41]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#262626] text-base mb-1">
                寸土寸金：什麼是「土地界標」？
              </h4>
              <p className="text-xs sm:text-sm text-[#262626]/80 leading-relaxed font-sans">
                在日常街道或田埂交界處，常看見地面打設刻有「地政」、「界址」字樣的<strong>鋼釘、塑膠樁或水泥界樁</strong>。
                在土地買賣、分割或鑑界時，地政測量員必須精確釘定界標。哪怕差了幾公釐，都攸關地主鄰里權益，因此測量技師被譽為「分毫不差的國土法官」。
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#F2EDE4] border border-[#262626]/10">
            <div className="p-2 rounded bg-[#262626] text-[#FAF9F6] shrink-0 mt-0.5 shadow-2xs">
              <Shield className="w-4 h-4 text-[#FAF9F6]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#262626] text-base mb-1">
                從平板儀到衛星 GNSS、無人機航測
              </h4>
              <p className="text-xs sm:text-sm text-[#262626]/80 leading-relaxed font-sans">
                早期的地政測量依賴平板儀、花桿與皮尺翻山越嶺；現代地政則導入了毫米級電子測距儀（全測站）、GNSS 衛星即時動態定位（RTK）以及無人機航拍 3D 實景數位化建模，使地籍資料臻於極致精密！
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="text-center p-3 rounded-lg bg-[#FAF9F6] border border-dashed border-[#BC4B21]/40 text-xs text-[#BC4B21] flex items-center justify-center gap-2 font-mono">
            <Heart className="w-4 h-4 text-[#BC4B21] fill-[#BC4B21]" />
            向全台灣默默守護每一寸國土界址與登記產權的地政夥伴致敬！
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EDE4] border-t border-[#262626]/10 text-right font-mono">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#262626] hover:bg-[#BC4B21] text-[#FAF9F6] text-xs sm:text-sm font-bold transition-colors shadow-2xs"
          >
            了解歷史，回檢定畫線！
          </button>
        </div>
      </div>
    </div>
  );
};
