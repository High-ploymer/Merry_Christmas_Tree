import React, { useState } from 'react';

interface UIOverlayProps {
  mode: unknown;
  onToggle: () => void;
  onPhotosUpload: (photos: string[]) => void;
  hasPhotos: boolean;
  uploadedPhotos: string[];
  isSharedView: boolean;
  isFireworksActive?: boolean;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ isFireworksActive = false }) => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <style>{`
        @keyframes giftBoxEntrance {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-90deg);
            opacity: 0.7;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      {/* Header */}
      <header className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5E6BF] to-[#D4AF37] font-serif drop-shadow-lg tracking-wider text-center whitespace-nowrap transition-all duration-500">
          {isFireworksActive ? ' Merry Christmas! ! !' : 'Merry Christmas! ! !'}
        </h1>
      </header>

      {/* Right Bottom Action Area - Hidden */}
      {/* Upload and share functionality disabled - photos are loaded from /public/photos directory */}

      {/* Instructions - Collapsible */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        {/* Toggle Button */}
        <button
          onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
          className="group flex items-center gap-2 px-4 py-3 border-2 border-[#D4AF37] bg-black/70 backdrop-blur-md hover:bg-[#D4AF37]/20 transition-all duration-300 hover:shadow-[0_0_20px_#D4AF37]"
          aria-label="通过网络摄像头交互"
        >
          <span className="text-2xl">💡</span>
          <span className="font-serif text-sm text-[#D4AF37] group-hover:text-white transition-colors">
            说明
          </span>
          <span className={`text-[#D4AF37] group-hover:text-white transition-all duration-300 ${isInstructionsOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Instructions Panel */}
        <div className={`mt-2 max-w-md bg-black/80 backdrop-blur-md border-2 border-[#D4AF37]/50 overflow-hidden transition-all duration-300 ${isInstructionsOpen ? 'max-h-96 opacity-100 p-4' : 'max-h-0 opacity-0 p-0 border-0'}`}>
          <h2 className="text-base font-serif text-[#D4AF37] mb-2 tracking-wide">网络摄像头交互说明</h2>
          <div className="space-y-1.5 text-[#F5E6BF] font-serif text-xs leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>根据您的手部识别，将一只手放在摄像头前上下左右移动来相应移动视角</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>张开手掌或握拳来切换模式：圣诞树 - 礼盒</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>礼盒模式：将两只手都放在摄像头前查看最近的照片，此时一只手可以左右移动来查看下一张照片</span>
            </p>
          </div>

          <h2 className="text-base font-serif text-[#D4AF37] mb-2 mt-4 tracking-wide">鼠标和触摸控制说明</h2>
          <div className="space-y-1.5 text-[#F5E6BF] font-serif text-xs leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>使用鼠标拖拽或触摸滑动来旋转圣诞树视角</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>点击照片查看大图显示</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>点击右下角的礼物盒按钮开启惊喜模式</span>
            </p>
          </div>

          <h2 className="text-base font-serif text-[#D4AF37] mb-2 mt-4 tracking-wide">烟花观看操作说明</h2>
          <div className="space-y-1.5 text-[#F5E6BF] font-serif text-xs leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>观看烟花时，最好关闭摄像头以避免敏感效果</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>建议缩小圣诞树以获得更宽敞的空间</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
              <span>点击屏幕右下角的烟花发射按钮观看。当烟花发射时，可以用鼠标上下移动圣诞树来从高处获得令人印象深刻的烟花视角</span>
            </p>
          </div>
        </div>

      </div>

      {/* Gift Box Button - Bottom Right */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <button
          className="group relative w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] border-2 border-[#F5E6BF] shadow-lg hover:shadow-[0_0_30px_#D4AF37] transition-all duration-500 hover:scale-110 animate-pulse"
          style={{
            animation: 'giftBoxEntrance 2s ease-out forwards, gentleFloat 3s ease-in-out infinite 2s'
          }}
          aria-label="打开礼物盒"
        >
          {/* Gift Box Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl transform group-hover:scale-125 transition-transform duration-300">🎁</span>
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F5E6BF] rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse opacity-60"></div>
        </button>
      </div>
    </div>
  );
};