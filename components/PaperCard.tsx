import React, { useEffect, useState, useRef } from 'react';
import { CardData } from '../types';
import { X, GripHorizontal } from 'lucide-react';

interface PaperCardProps {
  card: CardData;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onDelete: (id: string) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ card, onPointerDown, onDelete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Typewriter effect logic
  useEffect(() => {
    if (!card.isTyping) {
      setDisplayedText(card.text);
      setIsComplete(true);
      return;
    }

    let currentIndex = 0;
    const typingSpeed = 50; // ms per char

    const interval = setInterval(() => {
      if (currentIndex <= card.text.length) {
        setDisplayedText(card.text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [card.text, card.isTyping]);

  return (
    <div
      className="absolute flex flex-col w-64 md:w-80 min-h-[200px] bg-[#fdfbf7] text-zinc-900 shadow-xl rounded-sm overflow-hidden select-none cursor-grab active:cursor-grabbing animate-slide-out"
      style={{
        left: card.position.x,
        top: card.position.y,
        zIndex: card.zIndex,
        // Rotate slightly for realism based on ID hash or similar (simulated here slightly random looking)
        transform: `rotate(${parseInt(card.id.slice(-2), 16) % 6 - 3}deg)`, 
      }}
      onPointerDown={(e) => onPointerDown(e, card.id)}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none mix-blend-multiply"></div>
      
      {/* Header / Meta data */}
      <div className="relative flex justify-between items-center p-3 border-b border-zinc-200/50">
        <div className="flex items-center gap-2 opacity-50">
           <GripHorizontal size={16} />
           <span className="text-[10px] font-typewriter tracking-widest uppercase">{card.timestamp}</span>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
            className="text-zinc-400 hover:text-red-500 transition-colors z-20"
        >
            <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="relative p-6 flex-grow">
        <p className="font-typewriter text-base md:text-lg leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {/* Typewriter caret */}
          {!isComplete && (
            <span className="inline-block w-2 h-5 bg-black ml-1 align-middle animate-cursor-blink"></span>
          )}
        </p>
      </div>

      {/* Footer Branding */}
      <div className="relative p-2 text-center opacity-20 border-t border-dashed border-zinc-300">
         <span className="text-[8px] font-sans font-bold tracking-[0.2em]">FIX-BEEPER OUTPUT</span>
      </div>
    </div>
  );
};
