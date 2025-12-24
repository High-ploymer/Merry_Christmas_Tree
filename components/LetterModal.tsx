import React, { useEffect } from 'react';

interface Letter {
  id: number;
  title: string;
  content: string;
  from: string;
  color: string;
}

interface LetterModalProps {
  letter: Letter;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ letter, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* Modal content */}
      <div
        className="relative max-w-2xl w-full animate-scale-in transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960C] text-white shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center group"
          aria-label="关闭信件"
        >
          <svg
            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Letter paper */}
        <div
          className="relative bg-gradient-to-br from-[#FFFEF7] to-[#FFF8E7] rounded-lg shadow-2xl overflow-hidden"
          style={{
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(212, 175, 55, 0.1)`,
          }}
        >
          {/* Decorative top border with color accent */}
          <div
            className="h-3 w-full"
            style={{
              background: `linear-gradient(90deg, ${letter.color} 0%, ${adjustBrightness(letter.color, 30)} 50%, ${letter.color} 100%)`,
            }}
          ></div>

          {/* Letter content container */}
          <div className="p-8 md:p-12 relative">
            {/* Decorative corner ornaments */}
            <div className="absolute top-8 left-8 w-12 h-12 opacity-10">
              <svg viewBox="0 0 100 100" fill={letter.color}>
                <path d="M50 0 Q70 30 100 50 Q70 70 50 100 Q30 70 0 50 Q30 30 50 0" />
              </svg>
            </div>
            <div className="absolute bottom-8 right-8 w-12 h-12 opacity-10 transform rotate-180">
              <svg viewBox="0 0 100 100" fill={letter.color}>
                <path d="M50 0 Q70 30 100 50 Q70 70 50 100 Q30 70 0 50 Q30 30 50 0" />
              </svg>
            </div>

            {/* Title */}
            <div className="mb-8 text-center">
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-3"
                style={{
                  fontFamily: "'Crimson Text', 'Noto Serif', serif",
                  color: letter.color,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {letter.title}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="text-yellow-600">✦</div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div
              className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-line"
              style={{
                fontFamily: "'Noto Serif', serif",
                textAlign: 'justify',
                textIndent: '2em',
              }}
            >
              {letter.content}
            </div>

            {/* Signature */}
            <div className="mt-12 text-right">
              <div
                className="inline-block text-xl md:text-2xl italic"
                style={{
                  fontFamily: "'Dancing Script', 'Noto Serif', cursive",
                  color: letter.color,
                }}
              >
                {letter.from}
              </div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <div
                  className="h-px w-24 bg-gradient-to-l from-gray-400 to-transparent"
                ></div>
                <div className="text-yellow-600 text-2xl">❤</div>
              </div>
            </div>
          </div>

          {/* Decorative bottom border */}
          <div className="h-2 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        ></div>
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
