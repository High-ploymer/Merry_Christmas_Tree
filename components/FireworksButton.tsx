import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TreeMode } from '../types';
import './FireworksButton.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

const COLORS = [
  '#ff0000', '#ff6600', '#ffff00', '#00ff00', '#00ffff',
  '#0066ff', '#9933ff', '#ff00ff', '#ff3399', '#ffcc00',
];

interface FireworksButtonProps {
  mode: TreeMode;
  durationMinutes?: number; // 烟花发射时间（分钟）
  onActiveChange?: (isActive: boolean) => void; // 状态改变时的回调
}

export const FireworksButton: React.FC<FireworksButtonProps> = ({
  mode,
  durationMinutes = 2, // Mặc định 2 phút
  onActiveChange
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // Thời gian còn lại (giây)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const fireworkIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const createFirework = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newFirework: Firework = {
      x: Math.random() * canvas.width,
      y: canvas.height,
      targetY: 100 + Math.random() * (canvas.height * 0.3),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      exploded: false,
    };

    fireworksRef.current.push(newFirework);
  }, []);

  const explodeFirework = useCallback((firework: Firework) => {
    const particleCount = 80; // Tăng lên 80 để đẹp hơn

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
      const velocity = 2 + Math.random() * 4;
      const life = 50 + Math.random() * 40;

      particlesRef.current.push({
        x: firework.x,
        y: firework.targetY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: firework.color,
        size: 2 + Math.random() * 3,
        life: life,
        maxLife: life,
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw fireworks
    fireworksRef.current = fireworksRef.current.filter(fw => {
      if (fw.exploded) return false;

      fw.y -= 8;
      if (fw.y <= fw.targetY) {
        explodeFirework(fw);
        return false;
      }

      // Draw firework trail
      ctx.fillStyle = fw.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = fw.color;
      ctx.fillRect(fw.x - 2, fw.y - 4, 4, 8);

      return true;
    });

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravity
      p.vx *= 0.98; // Air resistance
      p.life -= 1;

      if (p.life <= 0) return false;

      // Draw particle
      const opacity = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = opacity;
      ctx.shadowBlur = p.size * 2;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      return true;
    });

    // Continue animation if there are active elements
    if (isActive || fireworksRef.current.length > 0 || particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Đảm bảo canvas được clear khi không còn gì để vẽ
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [isActive, explodeFirework]);

  const stopFireworks = useCallback(() => {
    setIsActive(false);
    setTimeRemaining(0);

    // Notify parent
    onActiveChange?.(false);

    // Clear all timeouts
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    // Clear intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (fireworkIntervalRef.current) {
      clearInterval(fireworkIntervalRef.current);
      fireworkIntervalRef.current = undefined;
    }

    // Clear animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Clear refs
    fireworksRef.current = [];
    particlesRef.current = [];

    // Clear canvas immediately
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [onActiveChange]);

  const handleClick = useCallback(() => {
    console.log('[FireworksButton] Click event triggered');
    console.log('[FireworksButton] Current state:', { mode, isActive, TreeMode: TreeMode.FORMED });

    if (mode !== TreeMode.FORMED) {
      console.log('[FireworksButton] Mode is not FORMED, exiting');
      return;
    }

    if (isActive) {
      // Nếu đang bắn, dừng lại
      console.log('[FireworksButton] Stopping fireworks');
      stopFireworks();
    } else {
      // Bắt đầu bắn
      console.log('[FireworksButton] Starting fireworks');
      setIsActive(true);
      const totalSeconds = durationMinutes * 60;
      setTimeRemaining(totalSeconds);
      console.log('[FireworksButton] Set duration:', totalSeconds, 'seconds');

      // Notify parent
      console.log('[FireworksButton] Notifying parent onActiveChange(true)');
      onActiveChange?.(true);

      // Đếm ngược
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopFireworks();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 连续发射烟花
      const launchFirework = () => {
        if (Math.random() > 0.3) { // 70% chance to launch
          createFirework();
        }
      };

      // Launch immediately
      launchFirework();

      // Launch periodically (tăng tần suất bắn)
      fireworkIntervalRef.current = setInterval(() => {
        const burstCount = 1 + Math.floor(Math.random() * 3); // 每次1-3个烟花
        for (let i = 0; i < burstCount; i++) {
          setTimeout(() => launchFirework(), i * 100);
        }
      }, 600); // Mỗi 600ms bắn 1 đợt
    }
  }, [mode, isActive, durationMinutes, createFirework, stopFireworks, onActiveChange]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, animate]);

  // Cleanup on unmount ONLY (not on every render)
  useEffect(() => {
    return () => {
      // Only cleanup when component actually unmounts
      setIsActive(false);
      setTimeRemaining(0);

      // Clear all timeouts
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];

      // Clear intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (fireworkIntervalRef.current) {
        clearInterval(fireworkIntervalRef.current);
      }

      // Clear animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clear refs
      fireworksRef.current = [];
      particlesRef.current = [];
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 当不在FORMED模式时隐藏按钮
  if (mode !== TreeMode.FORMED) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`fireworks-button ${isActive ? 'active' : ''}`}
        title={isActive ? '停止烟花' : '发射烟花'}
      >
        {isActive ? (
          // Pause icon with countdown
          <div className="button-content">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pause-icon"
            >
              <rect x="6" y="4" width="4" height="16" fill="currentColor" rx="1" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" rx="1" />
            </svg>
            <div className="countdown-text">{formatTime(timeRemaining)}</div>
          </div>
        ) : (
          // Play/Fireworks icon
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fireworks-icon"
          >
            <path
              d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12M5.63604 5.63604L8.46447 8.46447M15.5355 15.5355L18.364 18.364M5.63604 18.364L8.46447 15.5355M15.5355 8.46447L18.364 5.63604"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Canvas-based fireworks rendering */}
      <canvas
        ref={canvasRef}
        className="fireworks-canvas"
      />
    </>
  );
};
