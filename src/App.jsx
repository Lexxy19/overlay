import { useEffect, useState, useMemo, useRef } from 'react'; // Importamos useMemo y useRef
import Foco from './components/Foco';
import socket from './services/socket';
import { ROLES_CONFIG } from './roles';

const verticalOffsets = [0, 15, 25, 32, 38, 40, 38, 32, 25];
const horizontalSpacingsRight = [70, 50, 70, 90, 100, 80, 80, 80, 120];
const horizontalSpacingsLeft = [110, 20, 0, 0, 60, 60, 10, 0, 0];

function App() {
  // --- ESTADO EXISTENTE (SOCKETS) ---
  const [activeUsers, setActiveUsers] = useState({});

  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifs = useMemo(() => [
    '/Gxterne/GX_0B.gif',       // Índice 0: BASE
    '/Gxterne/GX_1A.gif',       // Índice 1: Acción
    '/Gxterne/GX_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Gxterne/GX_3A.gif',       // Índice 3...
    '/Gxterne/GX_4A.gif',
    '/Gxterne/GX_5A.gif',
    '/Gxterne/GX_6A.gif',
    '/Gxterne/GX_7A.gif',
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrc, setCurrentGifSrc] = useState(gxterneGifs[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseState, setIsBaseState] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRef = useRef(null);


  // --- EFECTOS (SOCKETS) ---
  useEffect(() => {
    socket.on('voiceUpdate', (data) => {
      setActiveUsers((prev) => {
        const newState = { ...prev };
        if (data.isSpeaking) {
          newState[data.userId] = {
            isSpeaking: true,
            roles: data.roles || []
          };
        } else {
          delete newState[data.userId];
        }
        return newState;
      });
    });

    return () => {
      socket.off('voiceUpdate');
    };
  }, []);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifs]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseState) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = 2000; // Ej: 6 segundos en la base

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifs.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRef.current &&
          gxterneGifs.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRef.current = randomIndex;

        setCurrentGifSrc(gxterneGifs[randomIndex]);
        setIsBaseState(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 5000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrc(gxterneGifs[0]); // Volver a la base (índice 0)
        setIsBaseState(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseState, gxterneGifs]); // Dependencias: se ejecuta cuando cambia isBaseState


  // --- FUNCIÓN HELPER (EXISTENTE) ---
  const isRoleActive = (targetRole) => {
    const users = Object.values(activeUsers);
    return users.some(user => user.roles.includes(targetRole));
  };

  return (
    /* 1. Contenedor Principal: Ahora es el que manda el tamaño */
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden z-30"
      style={{
        backgroundImage: "url('/ejemplo.webp')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        aspectRatio: "16 / 9" // Obligamos a mantener la proporción 1920x1080
      }}
    >
      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={currentGifSrc}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 3. Contenedor de Focos: Ajustado proporcionalmente */}
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px]">
        <div
          className="absolute top-0 left-0 w-full flex justify-center items-end px-[5%] z-10"
          style={{
            height: '40%', // Ajusta este % según dónde deban colgar los focos
            transform: 'translateY(10%)' // Ajuste fino para la altura de los focos
          }}
        >
          {ROLES_CONFIG.map((config, index) => (
            <div
              key={index}
              className="flex-none flex justify-center"
              style={{
                transform: `translateY(${verticalOffsets[index] || 0}px)`,
                marginLeft: `${horizontalSpacingsLeft[index] }px`,
                marginRight: `${horizontalSpacingsRight[index] }px`,
              }}
            >
              <Foco
                name={config.label}
                color={config.color}
                active={isRoleActive(config.role)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* 4. Capa MAGUA: Se muestra cuando Juanxflid habla */}
      {isRoleActive('Juanxflid') && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <img
            src="/MAGUA.png"
            alt="MAGUA"
            className="w-full h-full object-cover"
          />
        </div>
      )}

    </div>
  );
}

export default App;