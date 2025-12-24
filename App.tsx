
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { GestureController } from './components/GestureController';
import { FireworksButton } from './components/FireworksButton';
import { ZoomControls } from './components/ZoomControls';
import { LettersOverlay } from './components/LettersOverlay';
import { GiftBox } from './components/GiftBox';
import { TreeMode } from './types';

// Simple Error Boundary to catch 3D resource loading errors (like textures)
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error loading 3D scene:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can customize this fallback UI
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-[#D4AF37] font-serif p-8 text-center">
          <div>
            <h2 className="text-2xl mb-2">出错了</h2>
            <p className="opacity-70">资源加载失败（可能是缺少图片）。请检查控制台获取详细信息。</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [mode, setMode] = useState<TreeMode>(TreeMode.FORMED);
  const [handPosition, setHandPosition] = useState<{ x: number; y: number; detected: boolean }>({ x: 0.5, y: 0.5, detected: false });
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [twoHandsDetected, setTwoHandsDetected] = useState(false);
  const [closestPhoto, setClosestPhoto] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(28); // Default zoom level - xa hơn để cây nhỏ hơn ban đầu
  const [isFireworksActive, setIsFireworksActive] = useState(false);
  const [lockMode, setLockMode] = useState(false); // Lock mode during fireworks
  const [isGiftBoxOpen, setIsGiftBoxOpen] = useState(false); // Gift box state

  // Load photos from public/photos directory on mount
  useEffect(() => {
    const loadPhotosFromDirectory = async () => {
      setIsLoadingShare(true);

      try {
        // Try to load photos from public/photos directory
        // We'll try common photo names: photo1.jpg, photo2.jpg, etc.
        const photoUrls: string[] = [];
        const maxPhotos = 22; // Maximum number of photos to try loading

        for (let i = 1; i <= maxPhotos; i++) {
          // Try different extensions
          const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];

          for (const ext of extensions) {
            const photoPath = `/photos/photo${i}.${ext}`;

            try {
              // Check if the photo exists by trying to fetch it
              const response = await fetch(photoPath, { method: 'HEAD' });
              if (response.ok) {
                photoUrls.push(photoPath);
                break; // Found the photo, move to next number
              }
            } catch {
              // Photo doesn't exist, continue to next extension
            }
          }
        }

        if (photoUrls.length > 0) {
          console.log(`Loaded ${photoUrls.length} photos from directory`);
          setUploadedPhotos(photoUrls);
        } else {
          console.log('No photos found in /photos directory');
        }
      } catch (error) {
        console.error('Error loading photos from directory:', error);
      } finally {
        setIsLoadingShare(false);
      }
    };

    loadPhotosFromDirectory();
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === TreeMode.FORMED ? TreeMode.CHAOS : TreeMode.FORMED));
  };

  const handleHandPosition = (x: number, y: number, detected: boolean) => {
    setHandPosition({ x, y, detected });
  };

  const handleTwoHandsDetected = (detected: boolean) => {
    setTwoHandsDetected(detected);
  };

  const handleClosestPhotoChange = (photoUrl: string | null) => {
    setClosestPhoto(photoUrl);
  };

  const handlePhotosUpload = (photos: string[]) => {
    setUploadedPhotos(photos);
  };

  const handleFireworksActiveChange = (isActive: boolean) => {
    console.log('[App] Fireworks active change:', isActive);
    setIsFireworksActive(isActive);
    setLockMode(isActive); // Lock mode when fireworks are active, unlock when stopped
  };

  const handleZoomChange = (level: number) => {
    setZoomLevel(level);
  };

  const handleGiftBoxToggle = (isOpen: boolean) => {
    setIsGiftBoxOpen(isOpen);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-black via-[#001a0d] to-[#0a2f1e]">
      <ErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 4, 20], fov: 45 }}
          gl={{ antialias: false, stencil: false, alpha: false }}
          shadows
        >
          <Suspense fallback={null}>
            <Experience
              mode={mode}
              handPosition={handPosition}
              uploadedPhotos={uploadedPhotos}
              twoHandsDetected={twoHandsDetected}
              onClosestPhotoChange={handleClosestPhotoChange}
              zoomLevel={zoomLevel}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <Loader
        containerStyles={{ background: '#000' }}
        innerStyles={{ width: '300px', height: '10px', background: '#333' }}
        barStyles={{ background: '#D4AF37', height: '10px' }}
        dataStyles={{ color: '#D4AF37', fontFamily: 'Noto Serif' }}
      />

      <UIOverlay
        mode={mode}
        onToggle={toggleMode}
        onPhotosUpload={handlePhotosUpload}
        hasPhotos={uploadedPhotos.length > 0}
        uploadedPhotos={uploadedPhotos}
        isSharedView={false}
        isFireworksActive={isFireworksActive}
      />
      
      {/* Loading indicator for shared photos */}
      {isLoadingShare && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-[#D4AF37] font-serif text-xl">
            正在加载照片...
          </div>
        </div>
      )}
      
      {/* Gesture Control Module */}
      <GestureController
        currentMode={mode}
        onModeChange={setMode}
        onHandPosition={handleHandPosition}
        onTwoHandsDetected={handleTwoHandsDetected}
        lockMode={lockMode}
      />

      {/* Zoom Controls */}
      <ZoomControls zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />

      {/* Fireworks Button - Only shows in FORMED mode */}
      <FireworksButton mode={mode} durationMinutes={5} onActiveChange={handleFireworksActiveChange} />

      {/* Gift Box - Shows when fireworks are active */}
      <GiftBox
        onToggle={handleGiftBoxToggle}
        isOpen={isGiftBoxOpen}
        isFireworksActive={isFireworksActive}
      />

      {/* Letters Overlay - Shows when fireworks are active */}
      <LettersOverlay
        isActive={isFireworksActive}
        letterCount={6}
        isGiftBoxOpen={isGiftBoxOpen}
      />

      {/* Photo Overlay - Shows when two hands detected */}
      {closestPhoto && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
          {/* Semi-transparent backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          {/* Polaroid frame with photo */}
          <div className="relative z-50 transform transition-all duration-500 ease-out animate-scale-in">
            {/* Polaroid container */}
            <div className="bg-white p-4 pb-8 shadow-2xl" style={{ width: '60vmin', maxWidth: '600px' }}>
              {/* Gold clip at top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-6 bg-gradient-to-b from-[#D4AF37] to-[#C5A028] rounded-sm shadow-lg"></div>
              
              {/* Photo */}
              <img 
                src={closestPhoto} 
                alt="Selected Memory" 
                className="w-full aspect-square object-cover"
              />
              
              {/* Text label */}
              <div className="text-center mt-4 font-serif text-gray-700 text-lg">
                回忆萦绕心头
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
