import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Copy, Check, Play, Volume2, VolumeX, ArrowLeft, Gift } from 'lucide-react';
import { VoucherItem } from '../../types';

// Declare callbacks on window as requested in specification
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

// Config variables per specification
const WIN_SCORE = 20;
const GRAVITY = 0.28;
const JUMP_FORCE = -5.8;
const PIPE_SPEED = 2.4;
const PIPE_GAP = 160; // Generous gap for comfortable customer play
const PIPE_WIDTH = 56;
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

interface FlappyBirdGameProps {
  onBackToMenu: () => void;
  onSaveVoucher: (voucher: VoucherItem) => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({
  onBackToMenu,
  onSaveVoucher,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Game states: 'start' | 'playing' | 'lose' | 'win'
  const [gameState, setGameState] = useState<'start' | 'playing' | 'lose' | 'win'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_flappy_high_score') || '0', 10);
  });
  const [currentVoucher, setCurrentVoucher] = useState<string | null>(() => {
    return localStorage.getItem('vb_flappy_latest_voucher');
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [shaking, setShaking] = useState<boolean>(false);

  // Game physics refs
  const birdY = useRef<number>(200);
  const birdVelocity = useRef<number>(0);
  const pipesRef = useRef<Array<{ x: number; topHeight: number; passed: boolean }>>([]);
  const animationFrameId = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentScoreRef = useRef<number>(0);

  // Generate 6-digit voucher code: VB-XXXXXX
  const generateVoucherCode = useCallback((): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    return `VB-${randomDigits}`;
  }, []);

  const copyVoucherCode = () => {
    if (!currentVoucher) return;
    navigator.clipboard.writeText(currentVoucher);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playBeep = useCallback((freq = 440, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const winGame = useCallback((finalScore: number) => {
    isPlayingRef.current = false;
    setGameState('win');
    const voucher = generateVoucherCode();
    setCurrentVoucher(voucher);
    localStorage.setItem('vb_flappy_latest_voucher', voucher);

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#004b87', '#ed1b24', '#fdb913', '#ffffff']
      });
    } catch {
      // fallback
    }

    const payload = {
      score: finalScore,
      voucherCode: voucher,
      reward: VOUCHER_TEXT,
      timestamp: new Date().toISOString()
    };

    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin(payload);
    }

    onSaveVoucher({
      id: `flappy-${Date.now()}`,
      game: 'flappy',
      gameName: 'Flappy Bird VietinBank',
      voucherCode: voucher,
      reward: VOUCHER_TEXT,
      score: finalScore,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    });
  }, [generateVoucherCode, onSaveVoucher]);

  const endGame = useCallback((finalScore: number) => {
    isPlayingRef.current = false;
    setGameState('lose');
    setShaking(true);
    setTimeout(() => setShaking(false), 400);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_flappy_high_score', finalScore.toString());
    }

    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [highScore]);

  const jump = useCallback(() => {
    if (!isPlayingRef.current) return;
    birdVelocity.current = JUMP_FORCE;
    playBeep(580, 0.05);
  }, [playBeep]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    birdY.current = canvas.height / 2;
    birdVelocity.current = 0;
    currentScoreRef.current = 0;
    setScore(0);
    pipesRef.current = [
      { x: canvas.width + 100, topHeight: Math.floor(Math.random() * (canvas.height - PIPE_GAP - 120)) + 60, passed: false }
    ];
    isPlayingRef.current = true;
    setGameState('playing');
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrame: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear & Background
      const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
      skyGradient.addColorStop(0, '#e0f2fe');
      skyGradient.addColorStop(0.7, '#bae6fd');
      skyGradient.addColorStop(1, '#0284c7');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, w, h);

      // Cloud background decorations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(80, 70, 30, 0, Math.PI * 2);
      ctx.arc(115, 60, 40, 0, Math.PI * 2);
      ctx.arc(150, 70, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w - 100, 100, 25, 0, Math.PI * 2);
      ctx.arc(w - 70, 90, 35, 0, Math.PI * 2);
      ctx.arc(w - 40, 100, 25, 0, Math.PI * 2);
      ctx.fill();

      // Ground stripe
      const groundH = 40;
      ctx.fillStyle = '#004b87';
      ctx.fillRect(0, h - groundH, w, groundH);
      ctx.fillStyle = '#ed1b24';
      ctx.fillRect(0, h - groundH, w, 4);

      if (isPlayingRef.current) {
        // Physics update
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;

        // Ground/ceiling collisions
        if (birdY.current + 14 >= h - groundH) {
          birdY.current = h - groundH - 14;
          endGame(currentScoreRef.current);
        }
        if (birdY.current - 14 <= 0) {
          birdY.current = 14;
          birdVelocity.current = 0;
        }

        // Move pipes
        for (let i = 0; i < pipesRef.current.length; i++) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Check pass for scoring
          const birdX = 90;
          if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
            pipe.passed = true;
            currentScoreRef.current += 1;
            setScore(currentScoreRef.current);
            playBeep(750, 0.08);

            // Win check
            if (currentScoreRef.current >= WIN_SCORE) {
              winGame(WIN_SCORE);
              return;
            }
          }

          // Collision detection (AABB with circle approx for bird)
          const birdRadius = 14;
          const hitTopPipe =
            birdX + birdRadius > pipe.x &&
            birdX - birdRadius < pipe.x + PIPE_WIDTH &&
            birdY.current - birdRadius < pipe.topHeight;

          const bottomPipeY = pipe.topHeight + PIPE_GAP;
          const hitBottomPipe =
            birdX + birdRadius > pipe.x &&
            birdX - birdRadius < pipe.x + PIPE_WIDTH &&
            birdY.current + birdRadius > bottomPipeY;

          if (hitTopPipe || hitBottomPipe) {
            endGame(currentScoreRef.current);
            return;
          }
        }

        // Remove off-screen pipes and add new pipes
        if (pipesRef.current.length > 0 && pipesRef.current[0].x < -PIPE_WIDTH - 20) {
          pipesRef.current.shift();
        }

        const lastPipe = pipesRef.current[pipesRef.current.length - 1];
        if (lastPipe && lastPipe.x < w - 210) {
          const newTop = Math.floor(Math.random() * (h - PIPE_GAP - groundH - 100)) + 40;
          pipesRef.current.push({
            x: w + 20,
            topHeight: newTop,
            passed: false,
          });
        }
      }

      // 2. Draw Pipes (VietinBank themed pillars)
      pipesRef.current.forEach((pipe) => {
        // Top pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
        topGrad.addColorStop(0, '#004b87');
        topGrad.addColorStop(0.5, '#0068b3');
        topGrad.addColorStop(1, '#003366');

        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Top pipe cap
        ctx.fillStyle = '#fdb913';
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 12, PIPE_WIDTH + 8, 12);

        // Bottom pipe
        const bottomY = pipe.topHeight + PIPE_GAP;
        const bottomH = h - groundH - bottomY;
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomH);
        // Bottom pipe cap
        ctx.fillStyle = '#fdb913';
        ctx.fillRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 12);
      });

      // 3. Draw Player Mascot / Card
      const px = 90;
      const py = birdY.current;

      ctx.save();
      ctx.translate(px, py);
      // Slight tilt based on velocity
      const tilt = Math.min(Math.max(birdVelocity.current * 0.05, -0.4), 0.5);
      ctx.rotate(tilt);

      // Draw shiny VietinBank ATM Card / Mascot
      ctx.fillStyle = '#004b87';
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 6);
      ctx.fill();

      // Card chip
      ctx.fillStyle = '#fdb913';
      ctx.beginPath();
      ctx.roundRect(-16, -6, 9, 8, 2);
      ctx.fill();

      // Red accent line
      ctx.fillStyle = '#ed1b24';
      ctx.fillRect(-22, 5, 44, 3);

      // Card text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('VB', 6, -3);

      // Wings for flying feel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(-10, birdVelocity.current < 0 ? -12 : 2, 9, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      localFrame = requestAnimationFrame(render);
    };

    localFrame = requestAnimationFrame(render);
    animationFrameId.current = localFrame;

    return () => {
      cancelAnimationFrame(localFrame);
    };
  }, [endGame, playBeep, winGame]);

  // Key press listener (Space) & prevent default scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'lose') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame]);

  // Motivational quote based on score
  const getMotivationText = (s: number) => {
    if (s < 5) return 'Khởi động nhẹ nhàng!';
    if (s < 10) return 'Tốt lắm, tiếp tục nào!';
    if (s < 15) return 'Một nửa chặng đường rồi!';
    if (s < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  return (
    <div 
      id="flappy-voucher-game" 
      ref={containerRef}
      className={`relative max-w-lg mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 select-none ${
        shaking ? 'animate-bounce' : ''
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Header bar inside container */}
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
            <h3 className="font-bold text-sm tracking-tight">{BRAND_NAME} Flight</h3>
            <p className="text-[10px] text-blue-200">Mục tiêu: {WIN_SCORE} điểm nhận Voucher</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1 cursor-pointer"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-300" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
          </button>
          <span className="text-xs bg-red-600 px-2.5 py-0.5 rounded-full font-bold">
            2L Xăng
          </span>
        </div>
      </div>

      {/* Progress & Milestone bar when playing */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-400 text-sm">Điểm: {score}/{WIN_SCORE}</span>
          <span className="text-[11px] text-slate-300 hidden sm:inline">• {getMotivationText(score)}</span>
        </div>
        <div className="w-28 sm:w-36 bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-200"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        className="relative bg-sky-200 cursor-pointer overflow-hidden touch-none"
        onClick={() => {
          if (gameState === 'playing') jump();
        }}
      >
        <canvas
          ref={canvasRef}
          width={440}
          height={380}
          className="w-full h-[380px] block"
        />

        {/* Overlay: Start screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-4 shadow-lg animate-pulse">
              <Gift className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 mb-1">
              {GAME_TITLE}
            </h2>
            <p className="text-sm text-slate-200 mb-4 max-w-xs">
              Vượt qua 20 thử thách để nhận voucher 2 lít xăng
            </p>
            
            <p className="text-xs text-blue-200 bg-white/10 px-3 py-1.5 rounded-full mb-6">
              👆 Chạm màn hình hoặc nhấn phím Space để bay
            </p>

            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base rounded-2xl shadow-xl transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi ngay</span>
            </button>

            {currentVoucher && (
              <div className="mt-4 text-xs text-slate-300">
                Mã voucher gần nhất: <span className="font-mono font-bold text-amber-300">{currentVoucher}</span>
              </div>
            )}
          </div>
        )}

        {/* Overlay: Game Over Screen */}
        {gameState === 'lose' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200">
            <span className="text-xs font-bold text-red-400 bg-red-950/70 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Chưa đạt mốc
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
              Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Chỉ còn một chút nữa thôi, hãy thử lại nhé!
            </p>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-[#004b87] hover:bg-[#003b6b] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={onBackToMenu}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Overlay: Victory Screen */}
        {gameState === 'win' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#004b87]/90 to-slate-900/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mb-3 shadow-xl">
              <Trophy className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mb-1">
              Chúc mừng!
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 mb-4 max-w-sm">
              Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>voucher 2 lít xăng</strong>.
            </p>

            {/* Voucher Box */}
            <div className="w-full max-w-xs bg-white text-slate-900 rounded-2xl p-4 shadow-xl border-2 border-amber-300 mb-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mã nhận quà của Quý khách
              </p>
              <div className="text-2xl font-black font-mono text-[#004b87] tracking-wider my-1">
                {currentVoucher}
              </div>
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg leading-tight mt-2">
                📌 Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyVoucherCode}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch prompt for mobile / instructions */}
      <div className="bg-slate-50 p-3 text-center border-t border-slate-200">
        <p className="text-xs text-slate-600 font-medium">
          💡 Chạm ngón tay vào màn hình trên điện thoại hoặc nhấn phím Space để nhân vật bay.
        </p>
      </div>
    </div>
  );
};
