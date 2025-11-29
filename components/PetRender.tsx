
import React, { useEffect, useState } from 'react';
import { PetState, PetAction } from '../types';

interface PetRenderProps {
  state: PetState;
  onClick: () => void;
}

export const PetRender: React.FC<PetRenderProps> = ({ state, onClick }) => {
  const isHappy = state.happiness > 70;
  const isHungry = state.hunger < 30;
  const isSick = state.health < 50;
  
  // Blink animation state
  const [isBlinking, setIsBlinking] = useState(false);
  
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000); // Blink every 4 seconds
    return () => clearInterval(blinkInterval);
  }, []);

  // Hand-drawn style colors
  const c = {
    stroke: '#4A403A', // Warm dark charcoal/brown
    base: '#FFFAF0',   // Warm cream white
    patchOrange: '#FFCB9A', // Soft pastel orange
    patchGrey: '#D1D5DB',   // Soft grey
    blush: '#FFB7B2',
  };

  // State Checks
  const isSleeping = state.action === PetAction.SLEEP || state.isSleeping;
  const isLyingDown = state.action === PetAction.LIE || isSleeping;
  const isWalking = state.action === PetAction.WALK;
  const isPlaying = state.action === PetAction.PLAY;
  const isYawning = state.action === PetAction.YAWN;

  const useLoafShape = isLyingDown; 

  // Perspective Scale Logic
  // As Y gets smaller (pet moves UP/Back), scale gets smaller.
  // Range: Y=1500 (Scale 1) -> Y=500 (Scale 0.7)
  const scale = 0.6 + (state.y / 1500) * 0.4;

  return (
    <div 
      className="absolute w-48 h-60 z-10 transition-transform duration-100 ease-linear"
      style={{ 
        left: state.x - 96, // Center anchor
        top: state.y - 200, // Anchor at feet approx
        transform: `scale(${scale})`,
        zIndex: Math.floor(state.y) // Draw order based on depth
      }} 
    >
      <div className="relative w-full h-full cursor-pointer">

        {/* --- Speech Bubble (Scale compensated) --- */}
        {state.thought && (
          <div 
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 bg-white border-[3px] border-[#4A403A] rounded-2xl p-3 text-center z-20 shadow-[4px_4px_0px_rgba(74,64,58,0.2)] animate-bounce-slow sketchy-box"
            style={{ transform: `scale(${1/scale})` }} 
          >
             <p className="text-sm font-bold text-[#4A403A] font-sans">{state.thought}</p>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-[3px] border-b-[3px] border-[#4A403A] rotate-45"></div>
          </div>
        )}

        {/* --- Visual Wrapper (Handles Flipping) --- */}
        <div 
          className={`w-full h-full transition-transform duration-300 ${isWalking ? 'animate-bounce' : ''}`}
          style={{ transform: state.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
          onClick={onClick}
        >
          <svg 
            viewBox="0 0 200 220" 
            className="w-full h-full drop-shadow-xl"
            style={{ filter: 'url(#pencil)' }}
          >
            <defs>
              <clipPath id="bodyClip">
                {useLoafShape ? (
                  <path d="M40 160 C 40 130, 70 120, 100 120 C 150 120, 180 140, 180 170 C 180 200, 150 215, 100 215 C 60 215, 40 200, 40 160" />
                ) : (
                  <path d="M100 60 C 130 60, 160 90, 160 140 C 160 200, 140 210, 100 210 C 60 210, 40 200, 40 140 C 40 90, 70 60, 100 60" />
                )}
              </clipPath>
            </defs>

            {/* --- Tail --- */}
            <g className={`origin-bottom-center ${isPlaying ? 'animate-[wiggle_0.5s_ease-in-out_infinite]' : 'animate-[wiggle_3s_ease-in-out_infinite]'}`}>
              {useLoafShape ? (
                <path d="M170 170 Q 200 160 190 140" fill="none" stroke={c.stroke} strokeWidth="8" strokeLinecap="round" />
              ) : (
                <path 
                  d="M140 180 Q 180 160 180 120 Q 180 90 160 100" 
                  fill="none" 
                  stroke={c.stroke} 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className={isSleeping ? '' : 'animate-[wiggle_2s_ease-in-out_infinite] origin-bottom'}
                />
              )}
            </g>

            {/* --- Body --- */}
            {useLoafShape ? (
              <path 
                d="M40 160 C 40 130, 70 120, 100 120 C 150 120, 180 140, 180 170 C 180 200, 150 215, 100 215 C 60 215, 40 200, 40 160" 
                fill={state.outfitId ? '#FFD1DC' : c.base} 
                stroke={c.stroke} 
                strokeWidth="5" 
              />
            ) : (
              <path 
                d="M100 70 C 135 70, 165 100, 165 160 C 165 205, 145 215, 100 215 C 55 215, 35 205, 35 160 C 35 100, 65 70, 100 70" 
                fill={state.outfitId ? '#FFD1DC' : c.base} 
                stroke={c.stroke} 
                strokeWidth="5" 
              />
            )}

            {/* --- Markings --- */}
            {!state.outfitId && (
              <g clipPath="url(#bodyClip)">
                <path d="M140 140 Q 170 140 170 180 L 140 220 Z" fill={c.patchOrange} opacity="0.9" />
                <path d="M40 160 Q 30 190 60 220 L 30 220 Z" fill={c.patchGrey} opacity="0.9" />
              </g>
            )}

            {/* Accessories */}
            {state.accessoryId === 'bow_red' && (
              <g transform={useLoafShape ? "translate(100, 145)" : "translate(100, 115)"}>
                <path d="M0 0 L-15 -10 L-15 10 Z M0 0 L15 -10 L15 10 Z" fill="#FF6961" stroke={c.stroke} strokeWidth="3" />
                <circle r="4" fill="#FF6961" stroke={c.stroke} strokeWidth="2" />
              </g>
            )}

            {/* --- Head --- */}
            <g transform={`translate(${useLoafShape ? 30 : 0}, ${useLoafShape ? 70 : 0})`}>
              <path 
                d="M50 60 Q 30 100 50 120 Q 100 145 150 120 Q 170 100 150 60 Q 100 30 50 60" 
                fill={c.base} 
                stroke={c.stroke} 
                strokeWidth="5" 
              />
              <path d="M55 65 L 45 25 Q 60 20 80 45" fill={c.patchOrange} stroke={c.stroke} strokeWidth="5" strokeLinejoin="round" />
              <path d="M145 65 L 155 25 Q 140 20 120 45" fill={c.patchGrey} stroke={c.stroke} strokeWidth="5" strokeLinejoin="round" />

              <g transform="translate(100, 95)">
                {isSleeping ? (
                    <g>
                      <path d="M-25 0 Q -15 5 -5 0" fill="none" stroke={c.stroke} strokeWidth="3" strokeLinecap="round" />
                      <path d="M5 0 Q 15 5 25 0" fill="none" stroke={c.stroke} strokeWidth="3" strokeLinecap="round" />
                      <text x="30" y="-30" className="text-2xl font-bold animate-pulse text-blue-400">z</text>
                    </g>
                ) : (
                    <g>
                      {isBlinking ? (
                        <>
                          <line x1="-30" y1="0" x2="-10" y2="0" stroke={c.stroke} strokeWidth="3" strokeLinecap="round" />
                          <line x1="10" y1="0" x2="30" y2="0" stroke={c.stroke} strokeWidth="3" strokeLinecap="round" />
                        </>
                      ) : (
                        <>
                          <circle cx="-20" cy="0" r={isSick ? 2 : 4} fill={c.stroke} />
                          <circle cx="20" cy="0" r={isSick ? 2 : 4} fill={c.stroke} />
                          {!isSick && <circle cx="-18" cy="-2" r="1.5" fill="white" />}
                          {!isSick && <circle cx="22" cy="-2" r="1.5" fill="white" />}
                        </>
                      )}
                      
                      {state.accessoryId === 'glasses' && (
                        <g transform="translate(0, 0)">
                          <circle cx="-20" cy="0" r="12" fill="rgba(255,255,255,0.3)" stroke={c.stroke} strokeWidth="2.5" />
                          <circle cx="20" cy="0" r="12" fill="rgba(255,255,255,0.3)" stroke={c.stroke} strokeWidth="2.5" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke={c.stroke} strokeWidth="2.5" />
                        </g>
                      )}
                    </g>
                )}

                <g transform="translate(0, 8)">
                    <path d="M-4 -2 L 4 -2 L 0 3 Z" fill="#FFB7B2" />
                    {isYawning ? (
                      <ellipse cx="0" cy="8" rx="6" ry="8" fill="#FFB7B2" stroke={c.stroke} strokeWidth="2" />
                    ) : (
                      <path d="M-4 3 Q -8 8 0 8 Q 8 8 4 3" fill="none" stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round" />
                    )}
                </g>

                <g stroke={c.stroke} strokeWidth="1.5" opacity="0.6">
                    <line x1="-35" y1="5" x2="-55" y2="2" />
                    <line x1="-35" y1="12" x2="-52" y2="15" />
                    <line x1="35" y1="5" x2="55" y2="2" />
                    <line x1="35" y1="12" x2="52" y2="15" />
                </g>
              </g>
              {state.accessoryId === 'hat_blue' && (
                <g transform="translate(100, 35)">
                  <path d="M-30 0 Q 0 -10 30 0" stroke={c.stroke} strokeWidth="3" fill="none"/>
                  <path d="M-30 0 L -25 -25 Q 0 -35 25 -25 L 30 0 Z" fill="#D4E1F5" stroke={c.stroke} strokeWidth="3" />
                </g>
              )}
            </g>

            {!useLoafShape ? (
              <g transform="translate(0, 0)">
                  <ellipse cx="85" cy="180" rx="12" ry="10" fill="white" stroke={c.stroke} strokeWidth="3" />
                  <ellipse cx="115" cy="180" rx="12" ry="10" fill="white" stroke={c.stroke} strokeWidth="3" />
              </g>
            ) : (
              <g transform="translate(0, 0)">
                  <ellipse cx="60" cy="200" rx="12" ry="8" fill="white" stroke={c.stroke} strokeWidth="3" />
              </g>
            )}

          </svg>
        </div>
        {isSick && <div className="absolute top-10 right-0 text-3xl animate-bounce">🤒</div>}
      </div>
    </div>
  );
};
