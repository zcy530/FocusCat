
import React from 'react';

export const RoomBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-[1200px] h-[1600px] bg-[#F3E5F5] overflow-hidden pointer-events-none"> 
      <svg 
        className="w-full h-full" 
        preserveAspectRatio="none" 
        viewBox="0 0 1200 1600" 
        style={{ filter: 'url(#pencil)' }}
      >
        <defs>
           <pattern id="floorWood" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#F5F5DC" /> {/* Beige base */}
              <path d="M0 0 L40 0" stroke="#E0E0E0" strokeWidth="1" />
              <path d="M0 20 L40 20" stroke="#E0E0E0" strokeWidth="1" />
              <path d="M20 0 L20 20" stroke="#E0E0E0" strokeWidth="1" />
              <path d="M0 20 L0 40" stroke="#E0E0E0" strokeWidth="1" />
           </pattern>
           <linearGradient id="wallGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#D1C4E9" /> {/* Darker Purple top */}
              <stop offset="100%" stopColor="#F3E5F5" /> {/* Light Purple bottom */}
           </linearGradient>
           <linearGradient id="tvGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#424242" />
              <stop offset="100%" stopColor="#212121" />
           </linearGradient>
        </defs>

        {/* --- BACKGROUND SHELL --- */}
        {/* Back Wall */}
        <rect x="0" y="0" width="1200" height="1200" fill="url(#wallGradient)" />
        
        {/* Side Walls (Perspective) */}
        <path d="M0 0 L0 1600 L 150 1200 L 150 0 Z" fill="#E1BEE7" opacity="0.3" />
        <path d="M1200 0 L1200 1600 L 1050 1200 L 1050 0 Z" fill="#E1BEE7" opacity="0.3" />

        {/* --- GROUND FLOOR (Level 1) --- */}
        {/* Floor Plane: Spans from x=50 to x=1150 */}
        <path d="M 50 1600 L 50 1000 L 1150 1000 L 1150 1600 Z" fill="url(#floorWood)" />
        <path d="M 50 1000 L 1150 1000" stroke="#B0BEC5" strokeWidth="2" /> {/* Floor/Wall trim */}

        {/* --- LOFT FLOOR (Level 2) --- */}
        {/* Platform on the RIGHT side: x=500 to x=1150 */}
        <path d="M 500 800 L 500 500 L 1150 500 L 1150 800 Z" fill="#FFE0B2" stroke="#D7CCC8" strokeWidth="2" /> 
        {/* Loft Thickness */}
        <path d="M 500 800 L 1150 800 L 1150 850 L 500 850 Z" fill="#D7CCC8" />
        {/* Support Pillar */}
        <rect x="1050" y="850" width="40" height="150" fill="#D7CCC8" />

        {/* --- STAIRS --- */}
        <g>
            {/* Base ramp from x=150, y=1050 to loft edge x=500, y=850 */}
            <path d="M 150 1000 L 500 800 L 500 850 L 150 1050 Z" fill="#BCAAA4" />
            {[0, 1, 2, 3, 4, 5].map(i => (
                <path key={i} d={`M ${150 + i*60} ${1000 - i*30} L ${210 + i*60} ${980 - i*30} L ${210 + i*60} ${1000 - i*30} L ${150 + i*60} ${1020 - i*30} Z`} fill="#D7CCC8" stroke="#8D6E63" />
            ))}
        </g>

        {/* --- FURNITURE: GROUND FLOOR --- */}
        
        {/* Rug */}
        <ellipse cx="600" cy="1200" rx="300" ry="100" fill="#FAFAFA" stroke="#EEE" strokeWidth="2" strokeDasharray="5,5" />

        {/* TV Unit (Under Loft) -> Moved left to x=650 */}
        <g transform="translate(650, 920)">
            {/* Cabinet Body */}
            <rect x="0" y="0" width="400" height="60" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" rx="2" />
            {/* Drawers */}
            <rect x="20" y="10" width="110" height="40" fill="#A1887F" />
            <circle cx="120" cy="30" r="4" fill="#5D4037" />
            <rect x="145" y="10" width="110" height="40" fill="#A1887F" />
            <circle cx="245" cy="30" r="4" fill="#5D4037" />
            <rect x="270" y="10" width="110" height="40" fill="#A1887F" />
            <circle cx="370" cy="30" r="4" fill="#5D4037" />
            {/* Legs */}
            <path d="M 30 60 L 20 80" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
            <path d="M 370 60 L 380 80" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
            {/* Objects on unit */}
            <rect x="330" y="-15" width="40" height="15" fill="#333" /> {/* Console */}
        </g>

        {/* TV -> Relative to unit */}
        <g transform="translate(730, 780)">
             {/* Stand */}
             <path d="M 85 140 L 115 140 L 110 120 L 90 120 Z" fill="#333" />
             <rect x="60" y="140" width="80" height="5" fill="#333" rx="2" />
             {/* Screen */}
             <rect x="0" y="0" width="200" height="120" rx="4" fill="url(#tvGradient)" stroke="#333" strokeWidth="4" />
             {/* Glare */}
             <path d="M 10 10 L 190 10 L 190 110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
             <path d="M 20 20 L 60 20 L 30 50 Z" fill="rgba(255,255,255,0.05)" />
             {/* Power LED */}
             <circle cx="190" cy="110" r="2" fill="red" opacity="0.8" />
        </g>

        {/* Nordic Sofa (L-Shape) -> Moved left to x=200 */}
        <g transform="translate(200, 1000)">
            {/* Back part */}
            <path d="M 0 50 L 450 50 L 450 150 L 400 150 L 400 100 L 0 100 Z" fill="#90A4AE" stroke="#546E7A" strokeWidth="2" />
            {/* Main Seat */}
            <rect x="0" y="100" width="400" height="50" fill="#B0BEC5" />
            <rect x="400" y="100" width="50" height="150" fill="#B0BEC5" /> {/* Chaise Lounge Part */}
            
            {/* Legs */}
            <line x1="20" y1="150" x2="20" y2="170" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round"/>
            <line x1="380" y1="150" x2="380" y2="170" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="250" x2="440" y2="270" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round"/>
            
            {/* Throw Blanket */}
            <path d="M 350 50 Q 370 80 360 120 L 430 120 Q 450 80 430 50 Z" fill="#FFCCBC" />
            
            {/* Pillows */}
            <circle cx="50" cy="80" r="22" fill="#FFAB91" stroke="#FF8A65" strokeWidth="1" />
            <circle cx="300" cy="80" r="22" fill="#FFE082" stroke="#FFD54F" strokeWidth="1" />
        </g>

        {/* Coffee Table -> Moved to x=550 */}
        <g transform="translate(550, 1250)">
            <ellipse cx="0" cy="0" rx="80" ry="40" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
            <line x1="-50" y1="20" x2="-50" y2="60" stroke="#5D4037" strokeWidth="3" />
            <line x1="50" y1="20" x2="50" y2="60" stroke="#5D4037" strokeWidth="3" />
            {/* Mug */}
            <g transform="translate(20, -10)">
               <rect x="0" y="0" width="10" height="12" fill="white" stroke="#ccc" />
               <path d="M 10 2 Q 15 2 15 6 Q 15 10 10 10" fill="none" stroke="white" strokeWidth="2" />
               <path d="M 2 -5 Q 5 -10 8 -5" fill="none" stroke="#ddd" strokeWidth="1" opacity="0.6" className="animate-[wiggle_2s_infinite]" />
            </g>
        </g>

        {/* Large Plant -> Moved to x=100 */}
        <g transform="translate(100, 1100)">
            <path d="M0 80 L 40 80 L 30 140 L 10 140 Z" fill="#E6EE9C" stroke="#827717" />
            <g transform="translate(20, 80)">
                <path d="M0 0 Q -20 -50 -40 -40 Q -10 -80 0 0" fill="#66BB6A" stroke="#33691E" />
                <path d="M0 0 Q 20 -60 40 -30 Q 10 -90 0 0" fill="#81C784" stroke="#33691E" />
                <path d="M0 0 Q 0 -70 -10 -90" fill="none" stroke="#33691E" strokeWidth="2" />
            </g>
        </g>

        {/* Floor Lamp -> Moved to x=1050 */}
        <g transform="translate(1050, 1050)">
            <path d="M0 0 L 0 250" stroke="#424242" strokeWidth="3" />
            <path d="M-20 250 L 20 250" stroke="#424242" strokeWidth="3" />
            <path d="M-30 50 L 30 50 L 20 0 L -20 0 Z" fill="#FFF176" opacity="0.8" />
        </g>

        {/* --- FURNITURE: LOFT FLOOR --- */}
        
        {/* Loft Bed -> Moved to x=900 */}
        <g transform="translate(900, 550)">
             <path d="M 0 20 L 200 20 L 220 150 L -20 150 Z" fill="#FFFFFF" stroke="#CFD8DC" />
             <path d="M 0 20 L 200 20 L 180 100 L 20 100 Z" fill="#E1BEE7" opacity="0.5" /> {/* Blanket */}
             <ellipse cx="100" cy="40" rx="30" ry="15" fill="#FFF" stroke="#CFD8DC" /> {/* Pillow */}
        </g>

        {/* Railing (Glass) */}
        <path d="M 500 800 L 1150 800" stroke="#90A4AE" strokeWidth="2" />
        <path d="M 500 800 L 500 750" stroke="#90A4AE" strokeWidth="2" />
        <path d="M 1150 800 L 1150 750" stroke="#90A4AE" strokeWidth="2" />
        <rect x="500" y="750" width="650" height="50" fill="#E0F7FA" opacity="0.3" stroke="#B2EBF2" />


        {/* --- DECOR --- */}
        <rect x="700" y="200" width="100" height="120" fill="#FFF" stroke="#333" strokeWidth="2" transform="rotate(2 750 260)" />
        <rect x="850" y="250" width="80" height="80" fill="#FFF" stroke="#333" strokeWidth="2" transform="rotate(-3 890 290)" />

      </svg>
    </div>
  );
};
