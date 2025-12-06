import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal } from './components/Terminal';
import { PaperCard } from './components/PaperCard';
import { CardData, Position } from './types';

// Initial position for new cards (center of screen, slightly below terminal)
// Adjusted for the smaller terminal design (was 550)
const SPAWN_OFFSET_Y = 420; 

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  
  // Dragging State
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = (text: string) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.width / 2 - 160; // 160 is half of card width (w-80 = 320px)
    
    const newCard: CardData = {
      id: crypto.randomUUID(),
      text,
      position: { 
        x: centerX + (Math.random() * 40 - 20), // Slight randomness
        y: SPAWN_OFFSET_Y + (Math.random() * 20 - 10) 
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      zIndex: maxZIndex + 1,
      isTyping: true,
    };

    setMaxZIndex(prev => prev + 1);
    setCards(prev => [...prev, newCard]);
  };

  const handleDelete = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  // --- Drag & Drop Logic ---

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    // Bring to front
    const newMaxZ = maxZIndex + 1;
    setMaxZIndex(newMaxZ);
    setCards(prev => prev.map(c => c.id === id ? { ...c, zIndex: newMaxZ } : c));

    const card = cards.find(c => c.id === id);
    if (!card) return;

    setDraggingId(id);
    
    // Calculate click offset relative to card top-left
    dragOffset.current = {
      x: e.clientX - card.position.x,
      y: e.clientY - card.position.y
    };
    
    // Capture pointer to handle fast movements outside the element
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    setCards(prev => prev.map(c => 
      c.id === draggingId 
        ? { ...c, position: { x: newX, y: newY } } 
        : c
    ));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      setDraggingId(null);
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-zinc-900 overflow-hidden flex flex-col"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      {/* Background Hint */}
      {cards.length === 0 && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 mt-32">
             <h1 className="text-4xl md:text-6xl font-black text-zinc-500 uppercase tracking-tighter text-center">
                 Desk Empty<br/>
                 <span className="text-xl md:text-2xl font-normal tracking-normal">Type above to generate notes</span>
             </h1>
         </div>
      )}

      {/* Main Terminal Area (Fixed at top/center) */}
      <div className="mt-12 w-full px-4 z-50 transition-all duration-700 ease-out">
        <Terminal onPrint={handlePrint} />
      </div>

      {/* Cards Area */}
      <div className="absolute inset-0 pointer-events-none">
        {/* We need a container for cards that allows pointer events on children */}
        <div className="w-full h-full relative">
            {cards.map(card => (
            <div key={card.id} className="pointer-events-auto">
                <PaperCard 
                    card={card} 
                    onPointerDown={handlePointerDown}
                    onDelete={handleDelete}
                />
            </div>
            ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 right-4 text-zinc-600 text-xs font-mono pointer-events-none select-none">
        Fix-Beeper OS v2.1 | Drag cards to organize
      </div>
    </div>
  );
};

export default App;