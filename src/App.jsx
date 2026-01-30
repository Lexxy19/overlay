import { useEffect, useState } from 'react';
import Foco from './components/Foco';
import socket from './services/socket';

const PARTICIPANTS = [
  // --- TUS USUARIOS ---
  { id: '993376547648057435', name: 'Lexxy', color: '#a855f7' },
  { id: '742532879120203806', name: 'GnediA', color: '#ecf755' },
  // --- MOCKS (Total 9 participantes para coincidir con la imagen) ---
  { id: 'mock-1', name: 'P3', color: '#55f7e8' },
  { id: 'mock-2', name: 'P4', color: '#55f76d' },
  { id: 'mock-3', name: 'P5', color: '#f75555' },
  { id: 'mock-4', name: 'P6', color: '#f7a855' },
  { id: 'mock-5', name: 'P7', color: '#f755e0' },
  { id: 'mock-6', name: 'P8', color: '#556df7' },
  { id: 'mock-7', name: 'P9', color: '#b0f755' },
  
];

// Ajuste manual de altura para crear el "Arco" (en píxeles).
// Los extremos (0) están más arriba, el centro (40) más abajo.
const verticalOffsets = [0, 15, 25, 32, 38, 40, 38, 32, 25];

// Ajuste manual del espaciado horizontal (en píxeles).
// Define el margen derecho para cada elemento (excepto el último, o puedes usar margin-x).
// Valores más grandes = más separación.
const horizontalSpacings = [70, 40, 50, 40, 50, 60, 60, 60, 60];


function App() {
  const [speakingState, setSpeakingState] = useState({});

  useEffect(() => {
    socket.on('voiceUpdate', (data) => {
      setSpeakingState((prev) => ({
        ...prev,
        [data.userId]: data.isSpeaking
      }));
    });
    return () => {
      socket.off('voiceUpdate');
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center bg-cover bg-center overflow-hidden bg-black"
      // Asegúrate de que la ruta de la imagen sea correcta
      style={{ backgroundImage: "url('/FOGATA.webp')" }}
    >
      <div className="relative w-fit mt-10"> {/* Agregué un pequeño margen superior global */}

        {/* CONTENEDOR DE FOCOS */}
        <div
          className="absolute top-0 left-0 w-full flex justify-center items-end px-[5%] z-10"
          style={{
            height: '600px',
            transform: 'translateY(-42%)' // Ajuste fino vertical global
          }}
        >
          {PARTICIPANTS.map((user, index) => (
            <div
              key={user.id}
              className="flex-none flex justify-center"
              style={{
                // Aquí aplicamos la curva para que coincida con los pedestales
                transform: `translateY(${verticalOffsets[index] || 0}px)`,
                marginLeft: `${horizontalSpacings[index] || 10}px`,
                marginRight: `${horizontalSpacings[index] || 10}px`,
              }}
            >
              <Foco
                name={user.name}
                color={user.color}
                active={!!speakingState[user.id]}
              />
            </div>
          ))}
        </div>

        {/* IMAGEN DE PERSONAJES (Referencia de posición) */}
        <img
          src="/iconos.webp"
          alt="Personajes"
          className="block max-w-full h-auto relative z-0"
          style={{ minWidth: '1200px' }} // Asegura que no se haga muy pequeña en pantallas chicas
        />
      </div>
    </div>
  );
}

export default App;