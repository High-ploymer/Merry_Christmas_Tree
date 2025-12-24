import React from 'react';
import './ZoomControls.css';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  onZoomChange,
  minZoom = 8,
  maxZoom = 50,
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.max(minZoom, zoomLevel - 3);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.min(maxZoom, zoomLevel + 3);
    onZoomChange(newZoom);
  };

  const isZoomedIn = zoomLevel <= minZoom;
  const isZoomedOut = zoomLevel >= maxZoom;

  return (
    <div className="zoom-controls">
      <button
        onClick={handleZoomIn}
        className="zoom-button"
        disabled={isZoomedIn}
        title="Phóng to"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        onClick={handleZoomOut}
        className="zoom-button"
        disabled={isZoomedOut}
        title="Thu nhỏ"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Zoom level indicator */}
      <div className="zoom-indicator">
        <div className="zoom-level-dots">
          {[minZoom, (minZoom + maxZoom) / 2, maxZoom].map((level, index) => (
            <div
              key={index}
              className={`zoom-dot ${
                Math.abs(zoomLevel - level) < 5 ? 'active' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
