import React from 'react';

interface LetterEnvelopeProps {
  color: string;
  position: { x: number; y: number };
  onClick: () => void;
  index: number;
  angle: number; // Angle for circular orbit animation
  animationState?: 'flying-out' | 'flying-in' | 'orbiting'; // Animation state
}

export const LetterEnvelope: React.FC<LetterEnvelopeProps> = ({
  color,
  position,
  onClick,
  index,
  angle,
  animationState = 'orbiting'
}) => {
  // Stagger animation delay based on index
  const animationDelay = `${index * 0.15}s`;
  const orbitDuration = `${8 + (index % 4) * 2}s`; // Varying orbit speed (8-14s)

  // Determine animation class based on state
  const animationClass =
    animationState === 'flying-out'
      ? 'animate-fly-out-from-gift'
      : animationState === 'flying-in'
      ? 'animate-fly-into-gift'
      : 'animate-orbit-around-tree';

  // Set initial position based on animation state
  const getInitialPosition = () => {
    if (animationState === 'flying-out') {
      // Start from gift box position
      return {
        left: '50%',
        top: 'calc(100% - 32px)',
      };
    } else {
      // Use orbit position
      return {
        left: `${position.x}%`,
        top: `${position.y}%`,
      };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <div
      className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-125 hover:rotate-6 ${animationClass} pointer-events-auto`}
      style={{
        ...initialPos,
        animationDelay,
        animationDuration: animationState === 'orbiting' ? orbitDuration : undefined,
        '--orbit-angle': `${angle}deg`,
        '--final-left': `${position.x}%`,
        '--final-top': `${position.y}%`,
      } as React.CSSProperties & { '--orbit-angle': string; '--final-left': string; '--final-top': string }}
      onClick={onClick}
    >
      {/* Envelope shadow */}
      <div className="absolute inset-0 blur-sm opacity-30 bg-black rounded-lg transform translate-y-1"></div>

      {/* Envelope body - 85% of previous size (15% smaller) */}
      <div
        className="relative w-14 h-9 rounded-md shadow-2xl transform-gpu"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 100%)`,
        }}
      >
        {/* Envelope flap */}
        <div
          className="absolute top-0 left-0 right-0 h-5 rounded-t-md"
          style={{
            background: `linear-gradient(180deg, ${adjustBrightness(color, 10)} 0%, ${color} 100%)`,
            clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
          }}
        >
          {/* Flap highlight */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(180deg, white 0%, transparent 100%)',
              clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
            }}
          ></div>
        </div>

        {/* Wax seal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960C] shadow-lg flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full border border-white/30 flex items-center justify-center">
            <div className="text-white text-[5px] font-bold">✉</div>
          </div>
        </div>

        {/* Sparkle effect */}
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-yellow-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
