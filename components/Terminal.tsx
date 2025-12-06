import React, { useState, useRef } from 'react';
import { Send, Wifi, Power, BatteryCharging, Radio } from 'lucide-react';

interface TerminalProps {
  onPrint: (text: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onPrint }) => {
  const [input, setInput] = useState('');
  const [isPowered, setIsPowered] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || !isPowered) return;
    onPrint(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50 flex flex-col items-center">
        {/* Main Chassis */}
        <div className="relative w-full bg-[#252525] rounded-t-lg rounded-b-xl shadow-2xl p-3 md:p-4 border-t border-white/10 border-b-[6px] border-b-[#111] border-r-[6px] border-r-[#151515] transition-transform active:translate-y-[1px]">
            
            {/* Top Info Bar / Vents */}
            <div className="flex justify-between items-start mb-3 border-b border-black/20 pb-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse' : 'bg-red-900'}`}></div>
                        <h1 className="text-zinc-400 font-bold text-xs tracking-widest uppercase font-sans">
                            Motorola <span className="text-zinc-500 font-normal">Fix-Beeper</span>
                        </h1>
                    </div>
                    <div className="text-[8px] text-zinc-600 font-mono">MODEL: 808-MK2 // SERIAL: 4921-X</div>
                </div>
                
                {/* Vents */}
                <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-6 bg-[#151515] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"></div>
                    ))}
                </div>
            </div>

            {/* Screen Bezel */}
            <div className="bg-[#1a1a1a] p-3 rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-b border-white/5 relative">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-600 font-bold tracking-[0.3em] uppercase">Visual Output Display</div>
                
                {/* CRT Screen */}
                <div className={`
                    mt-3 relative bg-[#080808] rounded overflow-hidden h-[160px] transition-all duration-500
                    border-[2px] border-[#333] shadow-[inset_0_0_20px_rgba(0,0,0,1)]
                    ${isPowered ? 'opacity-100' : 'opacity-40 grayscale'}
                `}>
                    {/* CRT Effects */}
                    <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%] opacity-40"></div>
                    <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>

                    {/* Digital Interface */}
                    <div className="relative z-0 p-3 h-full flex flex-col font-terminal text-retro-green">
                        <div className="flex justify-between items-center text-[10px] opacity-60 mb-2 border-b border-retro-green/20 pb-1">
                            <div className="flex gap-3">
                                <span className="flex items-center gap-1"><Radio size={10}/> 5G-UWB</span>
                                <span className="flex items-center gap-1"><BatteryCharging size={10}/> 98%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-retro-green rounded-full animate-ping"></span>
                                LIVE
                            </div>
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full flex-grow bg-transparent outline-none resize-none terminal-scroll text-base md:text-lg leading-relaxed tracking-wider placeholder-retro-green/20"
                            style={{ 
                                textShadow: isPowered ? '0 0 4px rgba(51, 255, 0, 0.5), 0 0 10px rgba(51, 255, 0, 0.3)' : 'none',
                                caretColor: '#33ff00'
                            }}
                            placeholder={isPowered ? "READY TO TRANSMIT..." : ""}
                            disabled={!isPowered}
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            {/* Keyboard Deck */}
            <div className="mt-3 bg-[#1f1f1f] p-2 rounded border border-white/5 grid grid-cols-12 gap-2">
                {/* Power Section */}
                <div className="col-span-2 flex flex-col justify-center items-center border-r border-white/5 pr-2">
                     <button 
                        onClick={() => setIsPowered(!isPowered)}
                        className={`
                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                            ${isPowered 
                                ? 'bg-zinc-800 border-green-900 text-green-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]' 
                                : 'bg-zinc-700 border-zinc-600 text-red-500 shadow-[0_3px_0_#27272a] active:translate-y-[2px] active:shadow-none'}
                        `}
                    >
                        <Power size={16} />
                    </button>
                    <span className="text-[8px] text-zinc-500 mt-1 font-bold tracking-wider">PWR</span>
                </div>

                {/* Decoration Keys */}
                <div className="col-span-6 grid grid-cols-4 gap-1 px-2">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-6 bg-[#2a2a2a] rounded shadow-[0_2px_0_#111] border-t border-white/5"></div>
                    ))}
                    <div className="col-span-4 h-5 bg-[#151515] rounded mt-0.5 flex items-center justify-center">
                        <span className="text-[7px] text-zinc-700 font-bold tracking-[0.4em]">MOTOROLA SYSTEMS</span>
                    </div>
                </div>

                {/* Action Section */}
                <div className="col-span-4 flex items-center pl-2 border-l border-white/5">
                    <button 
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        className={`
                            w-full h-10 rounded bg-[#eab308] border-b-[3px] border-[#854d0e] 
                            flex items-center justify-center gap-2
                            text-[#422006] font-black tracking-widest uppercase text-xs
                            transition-all hover:bg-[#ca8a04] active:border-b-0 active:translate-y-[3px]
                            disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
                        `}
                    >
                        Print <Send size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>

        </div>
        
        {/* Paper Exit Shadow */}
        <div className="w-[90%] mx-auto h-4 bg-black/60 blur-md -mt-1 rounded-full"></div>
    </div>
  );
};