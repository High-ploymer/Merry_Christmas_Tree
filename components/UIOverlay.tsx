// import React, { useState } from 'react';

// interface UIOverlayProps {
//   mode: unknown;
//   onToggle: () => void;
//   onPhotosUpload: (photos: string[]) => void;
//   hasPhotos: boolean;
//   uploadedPhotos: string[];
//   isSharedView: boolean;
//   isFireworksActive?: boolean;
// }

// export const UIOverlay: React.FC<UIOverlayProps> = ({ isFireworksActive = false }) => {
//   const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

//   return (
//     <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
//       <style>{`
//         @keyframes giftBoxEntrance {
//           0% {
//             transform: scale(0) rotate(-180deg);
//             opacity: 0;
//           }
//           50% {
//             transform: scale(1.2) rotate(-90deg);
//             opacity: 0.7;
//           }
//           100% {
//             transform: scale(1) rotate(0deg);
//             opacity: 1;
//           }
//         }
        
//         @keyframes gentleFloat {
//           0%, 100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }
//       `}</style>

//       {/* Header */}
//       <header className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
//         <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5E6BF] to-[#D4AF37] font-serif drop-shadow-lg tracking-wider text-center whitespace-nowrap transition-all duration-500">
//           {isFireworksActive ? ' Merry Christmas! ! !' : 'Merry Christmas! ! !'}
//         </h1>
//       </header>

//       {/* Right Bottom Action Area - Hidden */}
//       {/* Upload and share functionality disabled - photos are loaded from /public/photos directory */}

//       {/* Instructions - Collapsible */}
//       <div className="absolute bottom-8 left-8 pointer-events-auto">
//         {/* Toggle Button */}
//         <button
//           onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
//           className="group flex items-center gap-2 px-4 py-3 border-2 border-[#D4AF37] bg-black/70 backdrop-blur-md hover:bg-[#D4AF37]/20 transition-all duration-300 hover:shadow-[0_0_20px_#D4AF37]"
//           aria-label="通过网络摄像头交互"
//         >
//           <span className="text-2xl">💡</span>
//           <span className="font-serif text-sm text-[#D4AF37] group-hover:text-white transition-colors">
//             说明
//           </span>
//           <span className={`text-[#D4AF37] group-hover:text-white transition-all duration-300 ${isInstructionsOpen ? 'rotate-180' : ''}`}>
//             ▼
//           </span>
//         </button>

//         {/* Instructions Panel */}
//         <div className={`mt-2 max-w-md bg-black/80 backdrop-blur-md border-2 border-[#D4AF37]/50 overflow-hidden transition-all duration-300 ${isInstructionsOpen ? 'max-h-96 opacity-100 p-4' : 'max-h-0 opacity-0 p-0 border-0'}`}>
//           <h2 className="text-base font-serif text-[#D4AF37] mb-2 tracking-wide">网络摄像头交互说明</h2>
//           <div className="space-y-1.5 text-[#F5E6BF] font-serif text-xs leading-relaxed">
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>根据您的手部识别，将一只手放在摄像头前上下左右移动来相应移动视角</span>
//             </p>
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>张开手掌或握拳来切换模式：圣诞树 - 礼盒</span>
//             </p>
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>礼盒模式：将两只手都放在摄像头前查看最近的照片，此时一只手可以左右移动来查看下一张照片</span>
//             </p>
//           </div>

//           <h2 className="text-base font-serif text-[#D4AF37] mb-2 mt-4 tracking-wide">鼠标和触摸控制说明</h2>
//           <div className="space-y-1.5 text-[#F5E6BF] font-serif text-xs leading-relaxed">
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>使用鼠标拖拽或触摸滑动来旋转圣诞树视角</span>
//             </p>
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>点击照片查看大图显示</span>
//             </p>
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>点击右下角的礼物盒按钮开启惊喜模式</span>
//             </p>
//           </div>

//           <h2 className="text-base font-serif text-[#D4AF37] mb-2 mt-4 tracking-wide">烟花观看操作说明</h2>
//           <div className="space-y-1.5 text-[#F5E6BF] font-serif text-xs leading-relaxed">
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>观看烟花时，最好关闭摄像头以避免敏感效果</span>
//             </p>
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>建议缩小圣诞树以获得更宽敞的空间</span>
//             </p>
//             <p className="flex items-start gap-2">
//               <span className="text-[#D4AF37] shrink-0 text-sm">✦</span>
//               <span>点击屏幕右下角的烟花发射按钮观看。当烟花发射时，可以用鼠标上下移动圣诞树来从高处获得令人印象深刻的烟花视角</span>
//             </p>
//           </div>
//         </div>

//       </div>

//       {/* Gift Box Button - Bottom Right */}
//       <div className="absolute bottom-8 right-8 pointer-events-auto">
//         <button
//           className="group relative w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] border-2 border-[#F5E6BF] shadow-lg hover:shadow-[0_0_30px_#D4AF37] transition-all duration-500 hover:scale-110 animate-pulse"
//           style={{
//             animation: 'giftBoxEntrance 2s ease-out forwards, gentleFloat 3s ease-in-out infinite 2s'
//           }}
//           aria-label="打开礼物盒"
//         >
//           {/* Gift Box Icon */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-3xl transform group-hover:scale-125 transition-transform duration-300">🎁</span>
//           </div>
          
//           {/* Sparkle Effects */}
//           <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F5E6BF] rounded-full animate-ping opacity-75"></div>
//           <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse opacity-60"></div>
//         </button>
//       </div>
//     </div>
//   );
// };




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
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 font-serif">
      <style>{`
        @keyframes giftBoxEntrance {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-90deg); opacity: 0.7; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #D4AF37 0%, #FFF8DC 50%, #D4AF37 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .glass-panel {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {/* Header */}
      <header className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full px-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-center whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-shimmer">
            {isFireworksActive ? '✨ Merry Christmas ✨' : 'Merry Christmas'}
          </span>
        </h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-2 opacity-80"></div>
      </header>

      {/* Instructions - Bottom Left */}
      <div className="absolute bottom-8 left-8 pointer-events-auto flex flex-col items-start gap-3 max-w-[90vw] md:max-w-md">
        
        {/* Instructions Panel */}
        <div 
          className={`glass-panel overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-xl ${
            isInstructionsOpen ? 'max-h-[80vh] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'
          }`}
        >
          <div className="p-5 md:p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <h2 className="text-lg text-[#D4AF37] mb-4 flex items-center gap-2 border-b border-[#D4AF37]/30 pb-2">
              <span>📜</span> 交互操作指南
            </h2>
            
            <div className="space-y-5 text-[#F5E6BF] text-xs md:text-sm leading-relaxed">
              
              {/* Section 1: Mouse & Touch */}
              <section>
                <h3 className="text-[#FFF8DC] font-bold mb-2 flex items-center gap-2">
                  <span className="text-base">🖱️</span> 鼠标与触控
                </h3>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">▪</span>
                    <span><strong className="text-white/90">旋转视角：</strong>长按鼠标左键（或手指按住）并拖拽，即可360°滑动欣赏圣诞树细节。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">▪</span>
                    <span><strong className="text-white/90">查看大图：</strong>点击树上悬挂的照片，会进入大图预览模式（Lightbox），再次点击右上角“✕”即可关闭。</span>
                  </li>
                </ul>
              </section>

              {/* Section 2: Webcam & Gestures */}
              <section>
                <h3 className="text-[#FFF8DC] font-bold mb-2 flex items-center gap-2">
                  <span className="text-base">🖐️</span> 魔法手势交互
                </h3>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">▪</span>
                    <span><strong className="text-white/90">视角控制：</strong>单手在摄像头前上下左右移动，视角随之跟随。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">▪</span>
                    <span><strong className="text-white/90">模式切换：</strong>
                      <span className="block mt-1 text-white/70">
                        • 张开手掌 🖐️ → 切换回圣诞树模式<br/>
                        • 握拳 ✊ → 切换至礼盒模式（或稳定当前状态）
                      </span>
                    </span>
                  </li>
                  <li className="flex gap-2 bg-[#D4AF37]/10 p-2 rounded border border-[#D4AF37]/20">
                    <span className="text-[#D4AF37] mt-0.5">★</span>
                    <span><strong className="text-[#D4AF37]">照片切换秘籍：</strong>在查看大图或礼盒模式时，请<strong className="text-white">双手握拳</strong>放在镜头前。保持一只手静止，滑动另一只手即可切换下一张照片。</span>
                  </li>
                </ul>
              </section>

              {/* Section 3: Surprise & Gifts */}
              <section>
                <h3 className="text-[#FFF8DC] font-bold mb-2 flex items-center gap-2">
                  <span className="text-base">🎁</span> 惊喜与信件
                </h3>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">▪</span>
                    <span>点击右下角的 <span className="text-[#D4AF37]">礼物盒图标</span> 开启惊喜模式。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">▪</span>
                    <span>点击出现的 <strong className="text-white/90">信封</strong> 即可展开阅读其中的文字。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D4AF37] mt-0.5">💡</span>
                    <span className="text-white/60 italic">小贴士：为了获得最稳定的阅读体验，建议在点击信封前先做出“握拳”手势。</span>
                  </li>
                </ul>
              </section>

              {/* Section 4: Fireworks (Optional) */}
              {isFireworksActive && (
                <section className="pt-2 border-t border-[#D4AF37]/20">
                  <p className="flex gap-2">
                    <span className="text-[#D4AF37]">🎆</span>
                    <span>烟花绽放时，试着将视角移至高处，俯瞰这绚烂的一刻！</span>
                  </p>
                </section>
              )}

            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
          className="group glass-panel px-5 py-3 rounded-full flex items-center gap-3 hover:bg-[#D4AF37]/20 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="操作说明"
        >
          <span className="text-xl animate-pulse">💡</span>
          <span className="text-[#D4AF37] font-bold tracking-widest text-sm group-hover:text-white transition-colors">
            GUIDE
          </span>
          <span className={`text-[#D4AF37] transition-transform duration-500 ${isInstructionsOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Gift Box Button - Bottom Right */}
      <div className="absolute bottom-8 right-8 pointer-events-auto z-20">
        <button
          className="group relative w-20 h-20 transition-all duration-500 hover:-translate-y-2"
          style={{
            animation: 'giftBoxEntrance 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, gentleFloat 3s ease-in-out infinite 2s'
          }}
          aria-label="打开礼物盒"
        >
          {/* Main Box Shape */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#8a6e18] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-[#FFF8DC]/50 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] transition-shadow duration-300 flex items-center justify-center overflow-hidden">
            {/* Ribbon Horizontal */}
            <div className="absolute inset-x-0 h-4 bg-[#AA0000] opacity-90 shadow-sm"></div>
            {/* Ribbon Vertical */}
            <div className="absolute inset-y-0 w-4 bg-[#AA0000] opacity-90 shadow-sm"></div>
            
            <span className="relative z-10 text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              🎁
            </span>
            
            {/* Shiny overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#FFF8DC] rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></div>
        </button>
      </div>
    </div>
  );
};