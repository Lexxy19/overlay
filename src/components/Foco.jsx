import React from 'react';

const Foco = ({ name, active, color = "#ffffff" }) => {
  return (
    <div className="flex flex-col items-center relative transition-all duration-500">


      {/* CABLE: Ajustado largo proporcionalmente */}
      <div className="w-0.5 h-[55px] bg-black/80 absolute -top-[55px] shadow-sm"></div>

      {/* SOCKET / BASE: Ajustado a aprox 15% más grande */}
      <div className="w-[28px] h-[14px] bg-gray-800 rounded-t-sm z-20"></div>

      {/* LA BOMBILLA: w-[65px] es aprox 15% más que w-14 (56px) */}
      <div
        className={`w-[65px] h-[65px] rounded-full border-2 z-20 transition-all duration-300 flex items-center justify-center transform-gpu ${active ? 'border-white/20' : 'border-gray-800'
          }`}
        style={{
          background: active
            ? `radial-gradient(circle at 35% 35%, white 0%, ${color} 40%, #000 100%)`
            : 'radial-gradient(circle at 35% 35%, #374151 0%, #111827 100%)',
          boxShadow: active
            ? `0 0 50px 8px ${color}66, inset 0 0 15px rgba(255,255,255,0.5)`
            : 'inset 0 0 12px rgba(0,0,0,0.8)'
        }}
      >
        
      </div>

      {/* HAZ DE LUZ: Dimensiones aumentadas y blur suavizado para evitar pixelado */}
      <div
        className={`absolute top-8 w-[345px] h-[460px] pointer-events-none transition-opacity duration-700 ease-in-out transform-gpu will-change-transform ${active ? 'opacity-60 animate-flicker' : 'opacity-0'
          }`}
        style={{
          background: `radial-gradient(circle at top, ${color}cc 0%, ${color}33 35%, transparent 75%)`,
          maskImage: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          WebkitMaskImage: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(35px)', // Aumentado para mezclar mejor los bordes
          transformOrigin: 'top center',
          transform: 'scaleY(1.2) translateZ(0)' // translateZ fuerza renderizado GPU
        }}
      ></div>

      {/* NOMBRE */}
      <span
        className={`mt-5 text-[13px] font-black tracking-[0.2em] z-30 uppercase transition-colors duration-300 ${active ? 'text-white' : 'text-gray-500'
          }`}
        style={{
          textShadow: active ? `0 0 12px ${color}` : 'none'
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default Foco;