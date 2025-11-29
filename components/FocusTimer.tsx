
import React, { useState, useEffect } from 'react';
import { Play, Square, Timer, X } from 'lucide-react';

interface FocusTimerProps {
  onStart: () => void;
  onComplete: (minutes: number) => void;
  onCancel: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onStart, onComplete, onCancel }) => {
  const [duration, setDuration] = useState(25); // Minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete(duration);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration, onComplete]);

  const handleStart = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    onStart();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render Mode: ACTIVE (Fullscreen Immersive) ---
  if (isActive) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-12 pointer-events-none">
        
        {/* Floating Timer */}
        <div className="sketchy-box bg-white/40 backdrop-blur-sm border-2 border-[#4A403A] px-6 py-2 rounded-full animate-bounce-slow">
           <h1 className="text-6xl font-black text-[#4A403A] font-sans drop-shadow-sm tracking-wider">
             {formatTime(timeLeft)}
           </h1>
        </div>

        <p className="mt-4 text-[#4A403A] font-bold text-lg drop-shadow-md animate-pulse">
           Mochi is accompanying you...
        </p>
        
        {/* Give Up Button (Bottom Right) */}
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <button 
            onClick={() => { setIsActive(false); onCancel(); }}
            className="group flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-red-100 border-2 border-[#4A403A] rounded-full transition-all"
          >
             <span className="text-sm font-bold text-[#4A403A] opacity-0 group-hover:opacity-100 transition-opacity">Give Up</span>
             <div className="w-8 h-8 flex items-center justify-center bg-red-400 rounded-full text-white">
                <Square size={14} fill="currentColor" />
             </div>
          </button>
        </div>
      </div>
    );
  }

  // --- Render Mode: SETUP (Modal) ---
  return (
    <div className="absolute inset-0 z-50 bg-black/40 flex flex-col items-center justify-center p-6 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-md sketchy-box p-8 text-center shadow-2xl relative overflow-hidden rounded-[20px]">
        
        <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
            <X size={24} />
        </button>

        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-pastel-purple rounded-full flex items-center justify-center border-4 border-black sketchy-box">
               <Timer size={40} className="text-black" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Ready to Focus?</h2>
          <p className="text-gray-500 mb-8">Mochi will keep you company while you work.</p>
          
          <div className="mb-8 bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300">
              <label className="block text-gray-500 mb-2 font-bold text-sm uppercase tracking-wide">Duration</label>
              <input
                type="range"
                min="1"
                max="120"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black accent-pastel-purple"
              />
              <p className="text-5xl font-black mt-4 text-pastel-dark">{duration} <span className="text-xl font-bold text-gray-400">min</span></p>
          </div>

          <button 
            onClick={handleStart}
            className="w-full py-4 bg-pastel-green sketchy-btn border-2 border-black font-bold text-black text-xl hover:scale-[1.02] flex items-center justify-center gap-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Play fill="black" size={24} /> Start Session
          </button>
        </div>
      </div>
    </div>
  );
};
