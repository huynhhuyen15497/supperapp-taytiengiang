import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { FlappyBirdGame } from './games/FlappyBirdGame';
import { SnakeGame } from './games/SnakeGame';
import { VoucherItem } from '../types';
import { Gamepad2, Gift, Play, Trophy, Sparkles, Flame, Check, Copy } from 'lucide-react';

interface GameZoneProps {
  onSaveVoucher: (voucher: VoucherItem) => void;
  vouchers: VoucherItem[];
}

export const GameZone: React.FC<GameZoneProps> = ({
  onSaveVoucher,
  vouchers,
}) => {
  const [activeGame, setActiveGame] = useState<'none' | 'flappy' | 'snake'>('none');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (activeGame === 'flappy') {
    return (
      <div className="py-6 px-4">
        <FlappyBirdGame
          onBackToMenu={() => setActiveGame('none')}
          onSaveVoucher={onSaveVoucher}
        />
      </div>
    );
  }

  if (activeGame === 'snake') {
    return (
      <div className="py-6 px-4">
        <SnakeGame
          onBackToMenu={() => setActiveGame('none')}
          onSaveVoucher={onSaveVoucher}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Game Zone Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3 uppercase tracking-wider">
          <Gamepad2 className="w-3.5 h-3.5 text-amber-600" /> Giải trí tại quầy giao dịch
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] tracking-tight">
          Thử Thách Game Săn Voucher Xăng
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Chơi vui trong lúc chờ phục vụ, vượt mốc điểm để nhận ngay voucher xăng 2 lít quà tặng từ VietinBank!
        </p>
      </div>

      {/* 2 Game Select Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Game 1: Flappy Bird */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-blue-400 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                Mini Game 1
              </span>
              <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Thưởng 2L Xăng
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#004b87] transition mb-2">
              {contentData.gameData.flappy.title}
            </h3>
            <p className="text-sm font-semibold text-blue-600 mb-2">
              {contentData.gameData.flappy.subtitle}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {contentData.gameData.flappy.rule}
            </p>
          </div>

          <button
            onClick={() => setActiveGame('flappy')}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#004b87] to-[#0068b3] hover:from-[#003b6b] hover:to-[#005594] text-white font-extrabold text-sm rounded-2xl shadow-md transition transform group-hover:scale-101 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Chơi Flappy Bird ngay</span>
          </button>
        </div>

        {/* Game 2: Snake */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-amber-400 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                Mini Game 2
              </span>
              <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Tối đa 2 Voucher (4L)
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-800 transition mb-2">
              {contentData.gameData.snake.title}
            </h3>
            <p className="text-sm font-semibold text-amber-600 mb-2">
              {contentData.gameData.snake.subtitle}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {contentData.gameData.snake.rule}
            </p>
          </div>

          <button
            onClick={() => setActiveGame('snake')}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition transform group-hover:scale-101 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Chơi Snake Challenge ngay</span>
          </button>
        </div>
      </div>

      {/* Won Vouchers History */}
      {vouchers.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Danh sách mã voucher bạn đã nhận</h3>
                <p className="text-xs text-slate-500">Đưa các mã này cho giao dịch viên tại quầy để nhận quà</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
              {vouchers.length} quà tặng
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vouchers.map((item) => (
              <div
                key={item.id}
                className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-[#004b87]">{item.gameName}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="text-lg font-black font-mono text-slate-900 tracking-wider">
                    {item.voucherCode}
                  </div>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    {item.reward}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Điểm số: <strong>{item.score}</strong></span>
                  <button
                    onClick={() => copyCode(item.voucherCode, item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-[#004b87] hover:underline"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Đã sao chép' : 'Sao chép mã'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules reminder footer */}
      <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
        Trò chơi giải trí tri ân khách hàng đến giao dịch tại Ngân hàng VietinBank. Không yêu cầu đăng nhập thông tin cá nhân.
      </div>
    </div>
  );
};
