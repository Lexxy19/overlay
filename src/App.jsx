import { useEffect, useState } from 'react';
import Foco from './components/Foco';
import socket from './services/socket';

const PARTICIPANTS = [
  // --- TUS USUARIOS ---
  { id: '993376547648057435', name: 'Lexxy', color: '#a855f7' },
  { id: '742532879120203806', name: 'GnediA', color: '#ecf755' },
  // --- MOCKS ---
  { id: 'mock-1', name: 'P3', color: '#55f7e8' },
  { id: 'mock-2', name: 'P4', color: '#55f76d' },
  { id: 'mock-3', name: 'P5', color: '#f75555' },
  { id: 'mock-4', name: 'P6', color: '#f7a855' },
  { id: 'mock-5', name: 'P7', color: '#f755e0' },
  { id: 'mock-6', name: 'P8', color: '#556df7' },
  { id: 'mock-7', name: 'P9', color: '#b0f755' },
  { id: 'mock-8', name: 'P10', color: '#f7f7f7' },
  { id: 'mock-9', name: 'P11', color: '#9155f7' },
];

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
      // 1. VOLVEMOS AL FLEX ORIGINAL CON PADDING TOP (pt-32 para bajarlo más si es necesario)
      className="min-h-screen w-full flex items-start justify-center pt-32 bg-cover bg-center overflow-hidden bg-black"
      style={{ backgroundImage: "url('/FOGATA.webp')" }}
    >

      {/* 2. WRAPPER RELATIVO
          Este div envuelve todo. Al ser 'relative', los hijos 'absolute'
          se posicionarán respecto a ÉL, no respecto a la pantalla.
      */}
      <div className="relative w-fit">

        {/* 3. CONTENEDOR DE FOCOS
            top-0: Se alinea al borde superior de la imagen.
            -translate-y-[80%]: Sube los focos hacia arriba para que no tapen la imagen.
            w-full: Ocupa el mismo ancho que la imagen.
        */}
        <div
          className="absolute top-0 left-15 w-full flex justify-between items-end px-[2%] transform -translate-y-[40%]"
          style={{ height: '600px' }} // Altura del área de los focos
        >
          {PARTICIPANTS.map((user) => (
            // flex-1 asegura que cada foco ocupe el mismo espacio disponible
            <div key={user.id} className="flex-1 flex justify-cente">
              <Foco
                name={user.name}
                color={user.color}
                active={!!speakingState[user.id]}
              />
            </div>
          ))}
        </div>

        {/* 4. IMAGEN DE PERSONAJES
            Es la base que define el tamaño del contenedor wrapper.
        */}
        <img
          src="/iconos.webp"
          alt="Personajes"
          className="block max-w-full h-auto opacity-90"
        />
      </div>
    </div>
  );
}

export default App;