import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight as ArrowRightIcon, 
  Check, 
  Copy, 
  Sparkles,
  Gift,
  Clock
} from 'lucide-react';
import { VoucherItem } from '../../types';

interface SnakeGameProps {
  onBackToMenu: () => void;
  onSaveVoucher: (voucher: VoucherItem) => void;
}

const GRID_SIZE = 20; // 20x20 grid

export const SnakeGame: React.FC<SnakeGameProps> = ({
  onBackToMenu,
  onSaveVoucher,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game states: 'idle' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_snake_high_score') || '0', 10);
  });
  
  // Highest milestone reached in current run
  const [currentTier, setCurrentTier] = useState<0 | 1 | 2>(0); // 0: <20, 1: 20-39 (1 voucher), 2: >=40 (2 vouchers)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // End game gift slip data
  const [finalGiftSlip, setFinalGiftSlip] = useState<{
    score: number;
    reward: string;
    vouchersCount: number;
    completionTime: string;
    voucherCode: string;
  } | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  // Snake coordinates & direction
  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const gameIntervalRef = useRef<number | null>(null);
  const scoreRef = useRef<number>(0);

  // Spawn food on empty cell
  const spawnFood = useCallback(() => {
    let newX: number;
    let newY: number;
    let collision = true;
    while (collision) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      collision = snakeRef.current.some(part => part.x === newX && part.y === newY);
    }
    foodRef.current = { x: newX!, y: newY! };
  }, []);

  const showMilestoneToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleGameOver = useCallback(() => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }

    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_snake_high_score', finalScore.toString());
    }

    const now = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let reward = '';
    let vouchersCount = 0;

    if (finalScore >= 40) {
      reward = '02 voucher xăng (mỗi voucher trị giá 2 lít)';
      vouchersCount = 2;
    } else if (finalScore >= 20) {
      reward = '01 voucher xăng trị giá 2 lít';
      vouchersCount = 1;
    } else {
      reward = 'Chưa đạt mốc nhận voucher (cần tối thiểu 20 điểm)';
      vouchersCount = 0;
    }

    const code = `VB-SNAKE-${Math.floor(100000 + Math.random() * 900000)}`;

    const slip = {
      score: finalScore,
      reward,
      vouchersCount,
      completionTime: now,
      voucherCode: code,
    };

    setFinalGiftSlip(slip);
    setGameState('gameover');

    if (vouchersCount > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#004b87', '#ed1b24', '#fdb913']
        });
      } catch {
        // Confetti fallback
      }

      onSaveVoucher({
        id: `snake-${Date.now()}`,
        game: 'snake',
        gameName: 'VietinBank Snake Challenge',
        voucherCode: code,
        reward,
        score: finalScore,
        timestamp: now
      });
    }
  }, [highScore, onSaveVoucher]);

  // Main game tick
  const gameTick = useCallback(() => {
    directionRef.current = nextDirectionRef.current;
    const head = { ...snakeRef.current[0] };
    head.x += directionRef.current.x;
    head.y += directionRef.current.y;

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      handleGameOver();
      return;
    }

    // Check self bite
    for (let i = 0; i < snakeRef.current.length; i++) {
      if (snakeRef.current[i].x === head.x && snakeRef.current[i].y === head.y) {
        handleGameOver();
        return;
      }
    }

    snakeRef.current.unshift(head);

    // Check eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 1;
      const newScore = scoreRef.current;
      setScore(newScore);
      spawnFood();

      // Check milestones without repeating
      if (newScore === 20) {
        setCurrentTier(1);
        showMilestoneToast('🎉 Chúc mừng Quý khách đã đạt 20 điểm! Nhận 01 voucher xăng 2 lít.');
      } else if (newScore === 40) {
        setCurrentTier(2);
        showMilestoneToast('🌟 Xuất sắc! Quý khách đã đạt 40 điểm! Nhận 02 voucher xăng (2x 2 lít).');
      }
    } else {
      snakeRef.current.pop();
    }

    // Render Canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Background grid
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines subtle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food (Golden Coin with VietinBank red star)
    const fx = foodRef.current.x * cellSize + cellSize / 2;
    const fy = foodRef.current.y * cellSize + cellSize / 2;
    ctx.fillStyle = '#fdb913';
    ctx.beginPath();
    ctx.arc(fx, fy, cellSize * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ed1b24';
    ctx.font = `bold ${Math.round(cellSize * 0.45)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', fx, fy);

    // Snake Body
    snakeRef.current.forEach((part, index) => {
      const px = part.x * cellSize;
      const py = part.y * cellSize;

      if (index === 0) {
        // Head (VietinBank Blue)
        ctx.fillStyle = '#004b87';
        ctx.beginPath();
        ctx.roundRect(px + 1, py + 1, cellSize - 2, cellSize - 2, 5);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px + cellSize * 0.35, py + cellSize * 0.35, 2.5, 0, Math.PI * 2);
        ctx.arc(px + cellSize * 0.65, py + cellSize * 0.35, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body (Alternating Blue and Cyan gradient)
        ctx.fillStyle = index % 2 === 0 ? '#0068b3' : '#0284c7';
        ctx.beginPath();
        ctx.roundRect(px + 1.5, py + 1.5, cellSize - 3, cellSize - 3, 4);
        ctx.fill();
      }
    });
  }, [handleGameOver, spawnFood]);

  const startGame = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    setCurrentTier(0);
    setToastMessage(null);
    setFinalGiftSlip(null);
    spawnFood();
    setGameState('playing');

    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    // Moderate speed for comfortable customer play (115ms per step)
    gameIntervalRef.current = window.setInterval(gameTick, 115);
  }, [gameTick, spawnFood]);

  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState !== 'playing') {
        if (e.code === 'Space' || e.code === 'Enter') {
          startGame();
        }
        return;
      }

      const { x, y } = directionRef.current;
      if (e.key === 'ArrowUp' && y === 0) {
        nextDirectionRef.current = { x: 0, y: -1 };
      } else if (e.key === 'ArrowDown' && y === 0) {
        nextDirectionRef.current = { x: 0, y: 1 };
      } else if (e.key === 'ArrowLeft' && x === 0) {
        nextDirectionRef.current = { x: -1, y: 0 };
      } else if (e.key === 'ArrowRight' && x === 0) {
        nextDirectionRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [gameState, startGame]);

  // Mobile virtual D-pad handler
  const handleVirtualDir = (dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    const { x, y } = directionRef.current;
    if (dx !== 0 && x === 0) nextDirectionRef.current = { x: dx, y: 0 };
    if (dy !== 0 && y === 0) nextDirectionRef.current = { x: 0, y: dy };
  };

  const copySlipCode = () => {
    if (!finalGiftSlip) return;
    navigator.clipboard.writeText(finalGiftSlip.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 select-none">
      {/* Header bar */}
      <div className="bg-[#004b87] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Quay lại danh sách game"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-bold text-sm tracking-tight">VietinBank Snake Challenge</h3>
            <p className="text-[10px] text-blue-200">Chơi vui tại quầy – Săn voucher xăng hấp dẫn</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full font-bold">
            Mốc 20 & 40đ
          </span>
        </div>
      </div>

      {/* Score info & Milestones bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-amber-400 text-sm">Điểm: {score}</span>
          <span className="text-slate-400 text-[11px]">Cao nhất: {highScore}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
            currentTier >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            Mốc 20: 1 Voucher
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
            currentTier >= 2 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
          }`}>
            Mốc 40: 2 Voucher
          </span>
        </div>
      </div>

      {/* Floating Milestone Toast (Does NOT interrupt gameplay!) */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 text-xs font-bold text-center shadow-lg animate-in slide-in-from-top duration-200 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Canvas Area */}
      <div className="relative bg-slate-50 flex items-center justify-center p-3">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="border border-slate-300 rounded-2xl shadow-inner max-w-full block bg-slate-100"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#004b87] border-2 border-amber-300 text-white flex items-center justify-center mb-3 shadow-xl">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 mb-1">
              VietinBank Snake Challenge
            </h2>
            <p className="text-xs text-slate-300 mb-4 max-w-xs">
              Chơi vui tại quầy – Săn voucher xăng hấp dẫn
            </p>

            <div className="bg-white/10 rounded-xl p-3 text-xs text-left max-w-xs space-y-1.5 mb-5 border border-white/10">
              <p className="font-bold text-amber-300">Quy tắc nhận quà:</p>
              <p>• Dùng phím mũi tên hoặc nút ảo để điều khiển rắn ăn tiền vàng</p>
              <p>• <strong className="text-emerald-300">Đạt 20 điểm:</strong> Nhận 01 voucher 2 lít xăng</p>
              <p>• <strong className="text-amber-300">Đạt 40 điểm:</strong> Nhận 02 voucher 2 lít xăng</p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-extrabold text-base rounded-2xl shadow-xl transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi ngay</span>
            </button>
          </div>
        )}

        {/* Game Over Screen & Gift Slip */}
        {gameState === 'gameover' && finalGiftSlip && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white overflow-y-auto animate-in zoom-in-95 duration-200">
            {finalGiftSlip.vouchersCount > 0 ? (
              <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-amber-400 relative">
                <div className="flex items-center justify-center gap-2 text-red-600 font-extrabold text-xs uppercase tracking-wider mb-2">
                  <Gift className="w-4 h-4" /> Phiếu xác nhận quà tặng
                </div>

                <div className="text-xs text-slate-500 font-medium">VietinBank Chi nhánh Tây Tiền Giang</div>
                
                <div className="my-3 py-3 border-y border-dashed border-slate-300 bg-amber-50/60 rounded-xl px-3">
                  <div className="text-3xl font-black text-[#004b87]">{finalGiftSlip.score} điểm</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">
                    {finalGiftSlip.vouchersCount === 2
                      ? 'Chúc mừng Quý khách! Đủ điều kiện nhận 02 voucher xăng (2x 2L)'
                      : 'Chúc mừng Quý khách! Đủ điều kiện nhận 01 voucher xăng 2 lít'}
                  </div>
                  <div className="mt-2 text-xs font-mono font-bold text-red-600 bg-white border border-red-200 p-1.5 rounded-lg">
                    Mã xác nhận: {finalGiftSlip.voucherCode}
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 mb-4 text-left px-1">
                  <div className="flex items-center justify-between">
                    <span>Thời gian hoàn thành:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {finalGiftSlip.completionTime}
                    </span>
                  </div>
                  <p className="text-amber-900 font-semibold bg-amber-100/70 p-2 rounded-lg mt-2 text-center">
                    📌 Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copySlipCode}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
                  </button>
                  <button
                    onClick={startGame}
                    className="flex-1 py-2.5 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Chơi lại</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                  Kết thúc lượt chơi
                </span>
                <div className="text-3xl font-black text-slate-800 my-3">{finalGiftSlip.score} điểm</div>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Rất tiếc, Quý khách chưa đạt mốc nhận voucher. Hãy thử lại để chinh phục mốc 20 điểm!
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={startGame}
                    className="flex-1 py-3 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Thử lại ngay</span>
                  </button>
                  <button
                    onClick={onBackToMenu}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Về menu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Virtual D-pad for mobile/tablet customers */}
      <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col items-center">
        <p className="text-[11px] text-slate-500 mb-2 font-medium">
          Dùng phím mũi tên trên bàn phím hoặc chạm các nút điều hướng bên dưới:
        </p>

        <div className="grid grid-cols-3 gap-2 w-48 max-w-full">
          <div />
          <button
            onClick={() => handleVirtualDir(0, -1)}
            className="h-12 rounded-xl bg-white active:bg-blue-100 border border-slate-300 text-slate-700 flex items-center justify-center shadow-xs transition cursor-pointer"
            aria-label="Lên"
          >
            <ArrowUp className="w-5 h-5 text-[#004b87]" />
          </button>
          <div />

          <button
            onClick={() => handleVirtualDir(-1, 0)}
            className="h-12 rounded-xl bg-white active:bg-blue-100 border border-slate-300 text-slate-700 flex items-center justify-center shadow-xs transition cursor-pointer"
            aria-label="Trái"
          >
            <ArrowLeft className="w-5 h-5 text-[#004b87]" />
          </button>
          <button
            onClick={() => handleVirtualDir(0, 1)}
            className="h-12 rounded-xl bg-white active:bg-blue-100 border border-slate-300 text-slate-700 flex items-center justify-center shadow-xs transition cursor-pointer"
            aria-label="Xuống"
          >
            <ArrowDown className="w-5 h-5 text-[#004b87]" />
          </button>
          <button
            onClick={() => handleVirtualDir(1, 0)}
            className="h-12 rounded-xl bg-white active:bg-blue-100 border border-slate-300 text-slate-700 flex items-center justify-center shadow-xs transition cursor-pointer"
            aria-label="Phải"
          >
            <ArrowRightIcon className="w-5 h-5 text-[#004b87]" />
          </button>
        </div>
      </div>
    </div>
  );
};
