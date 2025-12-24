import React, { useState } from 'react';

interface GiftBoxProps {
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
  isFireworksActive: boolean;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ onToggle, isOpen, isFireworksActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Only show gift box when fireworks are active
  if (!isFireworksActive) return null;

  const handleClick = () => {
    onToggle(!isOpen);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
      <div
        className={`relative cursor-pointer transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Gift box base - 45% of original size */}
        <div className="relative w-14 h-14">
          {/* Box body */}
          <div
            className={`absolute bottom-0 w-full h-11 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-md shadow-2xl transition-all duration-500 ${
              isOpen ? 'opacity-100' : 'opacity-100'
            }`}
            style={{
              boxShadow: '0 5px 20px rgba(220, 38, 38, 0.5), inset 0 -3px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Vertical ribbon */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 shadow-md"></div>

            {/* Horizontal ribbon */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-3 bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-400 shadow-md"></div>

            {/* Shine effect */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg pointer-events-none"
            ></div>

            {/* Box pattern - polka dots */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full"
                  style={{
                    left: `${(i % 3) * 35 + 10}%`,
                    top: `${Math.floor(i / 3) * 30 + 10}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Box lid */}
          <div
            className={`absolute w-full h-5 bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-md shadow-xl transition-all duration-700 ease-out ${
              isOpen
                ? 'bottom-[54px] rotate-[-15deg] translate-x-[-9px]'
                : 'bottom-[40px]'
            }`}
            style={{
              transformOrigin: 'bottom right',
              boxShadow: '0 3px 15px rgba(220, 38, 38, 0.6), inset 0 -2px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Vertical ribbon on lid */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 shadow-md"></div>

            {/* Bow on top of lid */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              {/* Bow center knot */}
              <div className="relative w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-md border border-yellow-300"></div>

              {/* Bow left loop */}
              <div
                className="absolute top-1/2 right-full transform -translate-y-1/2 translate-x-0.5 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-md"
                style={{ clipPath: 'ellipse(50% 50% at 30% 50%)' }}
              ></div>

              {/* Bow right loop */}
              <div
                className="absolute top-1/2 left-full transform -translate-y-1/2 -translate-x-0.5 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-md"
                style={{ clipPath: 'ellipse(50% 50% at 70% 50%)' }}
              ></div>

              {/* Bow ribbons hanging down */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div
                  className="w-1 h-3 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-sm"
                  style={{ transform: 'rotate(-20deg)', marginLeft: '-4px' }}
                ></div>
                <div
                  className="w-1 h-3 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-sm"
                  style={{ transform: 'rotate(20deg)', marginLeft: '4px', marginTop: '-12px' }}
                ></div>
              </div>
            </div>

            {/* Shine on lid */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-md pointer-events-none"></div>
          </div>

          {/* Sparkles around gift box */}
          {!isOpen && (
            <>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-1.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-0.5 -left-1.5 w-1 h-1 bg-yellow-200 rounded-full animate-ping delay-100"></div>
              <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-200"></div>
            </>
          )}

          {/* Magical glow particles when open */}
          {isOpen && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-float-up opacity-0"
                  style={{
                    left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 60}%`,
                    bottom: '80%',
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s',
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Instruction text */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="text-yellow-400 text-xs text-center drop-shadow-lg" style={{ fontFamily: "'Noto Serif', serif" }}>
            {isOpen ? '关闭礼盒' : '打开礼盒'}
          </div>
        </div>
      </div>
    </div>
  );
};
