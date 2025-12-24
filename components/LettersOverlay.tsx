import React, { useEffect, useState } from 'react';
import { LetterEnvelope } from './LetterEnvelope';
import { LetterModal } from './LetterModal';

interface Letter {
  id: number;
  title: string;
  content: string;
  from: string;
  color: string;
}

interface LetterPosition {
  x: number;
  y: number;
  angle: number;
}

interface LettersOverlayProps {
  isActive: boolean;
  letterCount?: number; // Number of letters to display
  isGiftBoxOpen: boolean; // Whether gift box is open
}

export const LettersOverlay: React.FC<LettersOverlayProps> = ({ isActive, letterCount = 5, isGiftBoxOpen }) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [positions, setPositions] = useState<LetterPosition[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animationState, setAnimationState] = useState<'flying-out' | 'flying-in' | 'orbiting'>('orbiting');
  const [showLetters, setShowLetters] = useState(false);

  // Load letters from JSON file
  useEffect(() => {
    const loadLetters = async () => {
      try {
        const response = await fetch('/letter/letters.json');
        if (!response.ok) throw new Error('Failed to load letters');

        const data: Letter[] = await response.json();

        // Limit to letterCount, repeat if necessary
        const selectedLetters: Letter[] = [];
        for (let i = 0; i < letterCount; i++) {
          selectedLetters.push(data[i % data.length]);
        }
        setLetters(selectedLetters);

        // Generate positions around the tree (circular orbit)
        const newPositions: LetterPosition[] = selectedLetters.map((_, index) =>
          generatePositionAroundTree(index, letterCount)
        );
        setPositions(newPositions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading letters:', error);
        setIsLoading(false);
      }
    };

    if (isActive) {
      loadLetters();
    }
  }, [isActive, letterCount]);

  // Generate position around the tree in a circular pattern
  const generatePositionAroundTree = (index: number, total: number): LetterPosition => {
    // Tree is at center (50%, 50%)
    const centerX = 50;
    const centerY = 50;

    // Radius of orbit - keep letters close to tree (15-25% of screen)
    const radiusX = 15 + Math.random() * 10; // 15-25% horizontal
    const radiusY = 12 + Math.random() * 8;  // 12-20% vertical (slightly less for better visual)

    // Evenly distribute letters around the circle, with some randomness
    const baseAngle = (index / total) * 360;
    const randomOffset = (Math.random() - 0.5) * 30; // ±15 degrees randomness
    const angle = baseAngle + randomOffset;

    // Calculate position on ellipse
    const angleRad = (angle * Math.PI) / 180;
    const x = centerX + radiusX * Math.cos(angleRad);
    const y = centerY + radiusY * Math.sin(angleRad);

    return { x, y, angle };
  };

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter);
  };

  const handleCloseModal = () => {
    setSelectedLetter(null);
  };

  // Handle gift box open/close animation
  useEffect(() => {
    if (!isActive || isLoading) return;

    if (isGiftBoxOpen) {
      // Flying out animation
      setAnimationState('flying-out');
      setShowLetters(true);

      // After flying out, switch to orbiting
      const timer = setTimeout(() => {
        setAnimationState('orbiting');
      }, 1800); // Match flyOutFromGift duration

      return () => clearTimeout(timer);
    } else {
      // Flying in animation
      if (showLetters) {
        setAnimationState('flying-in');

        // After flying in, hide letters
        const timer = setTimeout(() => {
          setShowLetters(false);
        }, 1500); // Match flyIntoGift duration

        return () => clearTimeout(timer);
      }
    }
  }, [isGiftBoxOpen, isActive, isLoading, showLetters]);

  if (!isActive) return null;
  if (isLoading) return null;
  if (!showLetters) return null;

  return (
    <>
      {/* Letters overlay - only show when no modal is open */}
      {!selectedLetter && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="relative w-full h-full pointer-events-none">
            {letters.map((letter, index) => (
              <LetterEnvelope
                key={`letter-${index}`}
                color={letter.color}
                position={positions[index]}
                onClick={() => handleLetterClick(letter)}
                index={index}
                angle={positions[index].angle}
                animationState={animationState}
              />
            ))}
          </div>
        </div>
      )}

      {/* Letter modal */}
      {selectedLetter && (
        <LetterModal letter={selectedLetter} onClose={handleCloseModal} />
      )}
    </>
  );
};
