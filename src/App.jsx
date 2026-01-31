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
    '/Gxterne/GX_8AS.gif',
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrc, setCurrentGifSrc] = useState(gxterneGifs[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseState, setIsBaseState] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRef = useRef(null);

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
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000;  // 2 o 3 segundos aleatorio

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
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrc(gxterneGifs[0]); // Volver a la base (índice 0)
        setIsBaseState(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseState, gxterneGifs]); // Dependencias: se ejecuta cuando cambia isBaseState



  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsZhergal = useMemo(() => [
    '/Zhergal/ZH_0B.gif',       // Índice 0: BASE
    '/Zhergal/ZH_1A.gif',       // Índice 1: Acción
    '/Zhergal/ZH_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Zhergal/ZH_3A.gif',       // Índice 3...
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcZhergal, setCurrentGifSrcZhergal] = useState(gxterneGifsZhergal[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateZhergal, setIsBaseStateZhergal] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefZhergal = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsZhergal.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsZhergal]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseStateZhergal) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000;  // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsZhergal.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefZhergal.current &&
          gxterneGifsZhergal.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefZhergal.current = randomIndex;

        setCurrentGifSrcZhergal(gxterneGifsZhergal[randomIndex]);
        setIsBaseStateZhergal(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcZhergal(gxterneGifsZhergal[0]); // Volver a la base (índice 0)
        setIsBaseStateZhergal(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateZhergal, gxterneGifsZhergal]); // Dependencias: se ejecuta cuando cambia isBaseState




  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsKaotik = useMemo(() => [
    '/Kaotik/KA_0B.gif',       // Índice 0: BASE
    '/Kaotik/KA_1A.gif',       // Índice 1: Acción
    '/Kaotik/KA_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Kaotik/KA_3A.gif',       // Índice 3...
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcKaotik, setCurrentGifSrcKaotik] = useState(gxterneGifsKaotik[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateKaotik, setIsBaseStateKaotik] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefKaotik = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsKaotik.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsKaotik]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseStateKaotik) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000;  // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsKaotik.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefKaotik.current &&
          gxterneGifsKaotik.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefKaotik.current = randomIndex;

        setCurrentGifSrcKaotik(gxterneGifsKaotik[randomIndex]);
        setIsBaseStateKaotik(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcKaotik(gxterneGifsKaotik[0]); // Volver a la base (índice 0)
        setIsBaseStateKaotik(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateKaotik, gxterneGifsKaotik]); // Dependencias: se ejecuta cuando cambia isBaseState



  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsBluespace = useMemo(() => [
    '/Bluespace/BL_0B.gif',       // Índice 0: BASE
    '/Bluespace/BL_1A.gif',       // Índice 1: Acción
    '/Bluespace/BL_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Bluespace/BL_3A.gif',       // Índice 3...
    '/Bluespace/BL_4AS.gif'
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcBluespace, setCurrentGifSrcBluespace] = useState(gxterneGifsBluespace[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateBluespace, setIsBaseStateBluespace] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefBluespace = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsBluespace.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsBluespace]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseStateBluespace) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000; // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsBluespace.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefBluespace.current &&
          gxterneGifsBluespace.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefBluespace.current = randomIndex;

        setCurrentGifSrcBluespace(gxterneGifsBluespace[randomIndex]);
        setIsBaseStateBluespace(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcBluespace(gxterneGifsBluespace[0]); // Volver a la base (índice 0)
        setIsBaseStateBluespace(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateBluespace, gxterneGifsBluespace]); // Dependencias: se ejecuta cuando cambia isBaseState



  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsVerttier = useMemo(() => [
    '/Verttier/VE_0B.gif',       // Índice 0: BASE
    '/Verttier/VE_1A.gif',       // Índice 1: Acción
    '/Verttier/VE_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Verttier/VE_3A.gif',       // Índice 3...
    '/Verttier/VE_4A.gif',       // Índice 4...
    '/Verttier/VE_5A.gif',       // Índice 5...
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcVerttier, setCurrentGifSrcVerttier] = useState(gxterneGifsVerttier[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateVerttier, setIsBaseStateVerttier] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefVerttier = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsVerttier.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsVerttier]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseStateVerttier) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000;  // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsVerttier.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefVerttier.current &&
          gxterneGifsVerttier.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefVerttier.current = randomIndex;

        setCurrentGifSrcVerttier(gxterneGifsVerttier[randomIndex]);
        setIsBaseStateVerttier(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcVerttier(gxterneGifsVerttier[0]); // Volver a la base (índice 0)
        setIsBaseStateVerttier(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateVerttier, gxterneGifsVerttier]); // Dependencias: se ejecuta cuando cambia isBaseState


  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsJuan = useMemo(() => [
    '/Juan/JU_0B.gif',       // Índice 0: BASE
    '/Juan/JU_1A.gif',       // Índice 1: Acción
    '/Juan/JU_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Juan/JU_3A.gif',       // Índice 3...
    '/Juan/JU_4A.gif',       // Índice 4...
    '/Juan/JU_5A.gif',       // Índice 5...
    '/Juan/JU_6A.gif',
    '/Juan/JU_7A.gif',
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcJuan, setCurrentGifSrcJuan] = useState(gxterneGifsJuan[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateJuan, setIsBaseStateJuan] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefJuan = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsJuan.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsJuan]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseStateJuan) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000;  // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsJuan.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefJuan.current &&
          gxterneGifsJuan.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefJuan.current = randomIndex;

        setCurrentGifSrcJuan(gxterneGifsJuan[randomIndex]);
        setIsBaseStateJuan(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcJuan(gxterneGifsJuan[0]); // Volver a la base (índice 0)
        setIsBaseStateJuan(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateJuan, gxterneGifsJuan]); // Dependencias: se ejecuta cuando cambia isBaseState


  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsGnediA = useMemo(() => [
    '/GnediA/GN_0B.gif',       // Índice 0: BASE
    '/GnediA/GN_1A.gif',       // Índice 1: Acción
    '/GnediA/GN_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/GnediA/GN_3A.gif',       // Índice 3...
    '/GnediA/GN_4A.gif',       // Índice 4...
    '/GnediA/GN_5A.gif',       // Índice 5...
    '/GnediA/GN_6A.gif',
    '/GnediA/GN_7A.gif',
    '/GnediA/GN_8A.gif',
    '/GnediA/GN_9A.gif',
    '/GnediA/GN_10A.gif',
    '/GnediA/GN_11A.gif',
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcGnediA, setCurrentGifSrcGnediA] = useState(gxterneGifsGnediA[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateGnediA, setIsBaseStateGnediA] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefGnediA = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsGnediA.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsGnediA]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseStateGnediA) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000;  // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsGnediA.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefGnediA.current &&
          gxterneGifsGnediA.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefGnediA.current = randomIndex;

        setCurrentGifSrcGnediA(gxterneGifsGnediA[randomIndex]);
        setIsBaseStateGnediA(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcGnediA(gxterneGifsGnediA[0]); // Volver a la base (índice 0)
        setIsBaseStateGnediA(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateGnediA, gxterneGifsGnediA]); // Dependencias: se ejecuta cuando cambia isBaseState


  // --- NUEVO ESTADO (ANIMACIONES DEL PERSONAJE) ---

  // 1. Definimos la lista de GIFs. Usamos useMemo para que no se recree en cada render.
  // IMPORTANTE: REVISA QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE CON TUS ARCHIVOS.
  const gxterneGifsBurgada = useMemo(() => [
    '/Burgada/BU_0B.gif',       // Índice 0: BASE
    '/Burgada/BU_1A.gif',       // Índice 1: Acción
    '/Burgada/BU_2A.gif',      // Índice 2: Acción (Noté el guion bajo en tu ejemplo)
    '/Burgada/BU_3AS.gif',       // Índice 3...
    '/Burgada/BU_4AS.gif',       // Índice 4...
  ], []);

  // 2. Estado para guardar cuál GIF se está mostrando actualmente. Empieza con la base (índice 0).
  const [currentGifSrcBurgada, setCurrentGifSrcBurgada] = useState(gxterneGifsBurgada[0]);

  // 3. Estado lógico para saber si estamos en modo "base" o modo "acción".
  const [isBaseStateBurgada, setIsBaseStateBurgada] = useState(true);

  // 4. Ref para recordar el último GIF de acción reproducido y evitar repetición inmediata
  const lastActionIndexRefBurgada = useRef(null);

  // Efecto A: PRECARGA (Opcional pero recomendado).
  // Carga las imágenes en caché del navegador al iniciar para evitar parpadeos.
  useEffect(() => {
    gxterneGifsBurgada.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gxterneGifsBurgada]);


  // Efecto B: LÓGICA DEL LOOP
  // Este efecto se dispara cada vez que cambia 'isBaseState'.
  useEffect(() => {
    let timeoutId;

    if (isBaseState) {
      // --- MODO BASE ---
      // Estamos mostrando la base. Esperamos unos segundos y luego cambiamos a una acción aleatoria.
      const baseDuration = Math.random() < 0.5 ? 2000 : 3000; // 2 o 3 segundos aleatorio

      timeoutId = setTimeout(() => {
        // Elegir un índice aleatorio entre 1 y 7 (excluyendo el 0 que es la base)
        // Math.random() * (total - 1) + 1
        let randomIndex;

        // Intentamos encontrar un ndice diferente al anterior si es posible
        do {
          randomIndex = Math.floor(Math.random() * (gxterneGifsBurgada.length - 1)) + 1;
        } while (
          randomIndex === lastActionIndexRefBurgada.current &&
          gxterneGifsBurgada.length > 2 // Solo evitamos repetir si hay más de 1 opción de acción
        );

        // Guardamos el índice actual como el último usado
        lastActionIndexRefBurgada.current = randomIndex;

        setCurrentGifSrcBurgada(gxterneGifsBurgada[randomIndex]);
        setIsBaseStateBurgada(false); // Cambiamos el estado a "acción"
      }, baseDuration);

    } else {
      // --- MODO ACCIÓN ---
      // Estamos mostrando una acción. Esperamos lo que dure la animación y volvemos a la base.
      // NOTA: Si tus GIFs de acción duran distinto, pon un tiempo promedio aquí (ej. 3000ms).
      const actionDuration = 4000; // Ej: 3.5 segundos para la acción

      timeoutId = setTimeout(() => {
        setCurrentGifSrcBurgada(gxterneGifsBurgada[0]); // Volver a la base (índice 0)
        setIsBaseStateBurgada(true); // Cambiamos el estado a "base"
      }, actionDuration);
    }

    // Limpieza: Si el componente se desmonta o el estado cambia rápido, limpiamos el timer.
    return () => clearTimeout(timeoutId);

  }, [isBaseStateBurgada, gxterneGifsBurgada]); // Dependencias: se ejecuta cuando cambia isBaseState


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
        backgroundImage: "url('/FONDOOOOO.webp')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        aspectRatio: "16 / 9" // Obligamos a mantener la proporción 1920x1080
      }}
    >
      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-47">
        <img
          src={currentGifSrc}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <img
          src={currentGifSrcZhergal}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-49">
        <img
          src={currentGifSrcKaotik}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-48">
        <img
          src={currentGifSrcBluespace}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-47">
        <img
          src={currentGifSrcVerttier}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-46">
        <img
          src={'/Nacho/NA_0B.gif'}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-45">
        <img
          src={currentGifSrcGnediA}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-48">
        <img
          src={currentGifSrcJuan}
          alt="Personaje"
          className="w-full h-full object-contain"
        /* Eliminamos márgenes y tamaños fijos en px que rompen la relación */
        />
      </div>

      {/* 2. Capa del Personaje: Absoluta y cubriendo todo el fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-49">
        <img
          src={'/Leroz/leroz.webp'}
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
                marginLeft: `${horizontalSpacingsLeft[index]}px`,
                marginRight: `${horizontalSpacingsRight[index]}px`,
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