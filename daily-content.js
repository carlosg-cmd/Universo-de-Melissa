// ===================================================================
//  UNIVERSO MELISSA - 30 Days of Content
//  Database of messages, game assignments, and configurations
// ===================================================================

const DailyContent = (function() {
    // Configuration
    const START_DATE = '2026-06-25'; // YYYY-MM-DD
    const TOTAL_DAYS = 30;

    // Helper to calculate current day
    function calculateCurrentDay() {
        // --- MODO DE PRUEBA (SOLO PARA TI) ---
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('dia')) {
            const testDay = parseInt(urlParams.get('dia'));
            if (!isNaN(testDay) && testDay >= 1 && testDay <= TOTAL_DAYS) {
                return testDay;
            }
        }
        // -------------------------------------

        const today = new Date();
        const start = new Date(START_DATE + 'T00:00:00'); // Force local midnight
        
        // Use a simple day difference based on local date
        const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        
        const d1 = new Date(START_DATE + 'T00:00:00');
        const d2 = new Date(todayStr + 'T00:00:00');
        
        const diffTime = d2.getTime() - d1.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // If before start date, return 0 (coming soon)
        if (diffDays < 1) return 0;
        // Cap at TOTAL_DAYS
        if (diffDays > TOTAL_DAYS) return TOTAL_DAYS;
        
        return diffDays;
    }

    // Days Database
    const days = [
        {
            day: 1,
            title: "Día 1 - El inicio",
            emoji: "✨",
            letter: "¡Hola mi amor preciosa!\n\nHoy empieza oficialmente tu recuperación. Sé que no es fácil y que quisieras estar haciendo mil cosas, pero recuerda que este es el momento de que tu cuerpo sane. Estoy muy orgulloso de lo valiente que has sido.\n\nHe creado este rincón especial para ti, para acompañarte cada día aunque estemos en ciudades diferentes. Quiero que sepas que cada segundo pienso en ti y que te amo con toda mi alma.\n\n¡Descansa y disfruta los juegos que te preparé!",
            funPhrase: "¡La más guerrera de todas! 💪",
            recoveryQuote: "El primer paso de un hermoso camino de sanación.",
            gameType: 'memory',
            gameConfig: {
                pairs: 6,
                emojiFallback: ['💕','💗','💖','💝','💘','💞']
            }
        },
        {
            day: 2,
            title: "Día 2 - Pensando en ti",
            emoji: "💭",
            letter: "Mi princesa,\n\n¿Cómo amaneciste hoy? Espero que el dolor vaya disminuyendo poco a poco. Te extraño muchísimo y desearía estar ahí para consentirte, prepararte algo rico de comer y abrazarte con mucho cuidado.\n\nHoy te dejé una sopa de letras con palabras que significan mucho para nosotros. ¡A ver qué tan rápido las encuentras!\n\nTe amo infinitamente.",
            funPhrase: "Por eso las operan 😂",
            recoveryQuote: "Un día a la vez, mi amor. Un día a la vez.",
            gameType: 'wordsearch',
            gameConfig: {
                words: [
                    'Melissa', 'Carlos', 'octubre', 'julio', 'mar', 'Tarazá', 'Medellín', 'Montería', 'colegio', 'sena', 'cumpleaños', 'Luffy', 'Mario galaxi', 'pizza', 'Santelmo', 'parque', 'rumba aerobica', 'la perra', 'la cauchera', 'hamburguesa', 'Michael Jackson', 'Home Center', 'Lupin', 'Bridgerton', 'Canadadry', 'Cola y Pola', 'Navidad', 'helado', 'chocoram', 'piedra', 'limonada', 'alcaldía', 'flores amarilla', 'girasoles', 'claveles', 'bus', 'viajes', 'rosas', 'velitas', 'alumbrados', 'masajes', 'desayunos', 'almuerzos', 'arroz chino', 'fresas con crema', 'arroz con leche', 'trabajo', 'rojo cine', 'éxito', 'moto', 'besos',
                    'amor', 'cariño', 'abrazos', 'sonrisas', 'caricias', 'confianza', 'paciencia', 'lealtad', 'destino', 'magia', 'promesa', 'juntos', 'siempre', 'te amo', 'mi vida', 'mi reina', 'ternura', 'pasion', 'detalles', 'felicidad'
                ],
                gridSize: 16
            }
        },
        {
            day: 3,
            title: "Día 3 - Conociéndonos",
            emoji: "🤔",
            letter: "¡Hola hermosa!\n\nYa vamos en el tercer día. Eres una campeona. Hoy estaba recordando algunos de nuestros momentos más especiales y quise poner a prueba tu memoria con una pequeña trivia.\n\nRecuerda tomar todos tus medicamentos a tiempo y descansar mucho. Eres mi prioridad número uno.\n\nTe adoro.",
            funPhrase: "Dolor temporal, amor eterno 💕",
            recoveryQuote: "Tu cuerpo es sabio y sabe cómo sanar.",
            gameType: 'trivia',
            gameConfig: {
                questions: [
                    { q: '¿Qué mes empezamos a hablar?', options: ['enero', 'febrero', 'marzo', 'abril'], correct: 1, explanation: 'Exacto, empezamos en febrero.' },
                    { q: '¿Qué día nos dimos nuestro primer beso?', options: ['5 de junio', '10 de mayo', '15 de julio', '20 de agosto'], correct: 0, explanation: 'Inolvidable 5 de junio.' },
                    { q: '¿A dónde fuimos en nuestra primera cita?', options: ['cine', 'restaurante', 'parque', 'heladería'], correct: 0, explanation: '¡Al cine!' },
                    { q: '¿A dónde fuimos en nuestro primer viaje?', options: ['montaña', 'río', 'mar', 'nevado'], correct: 2, explanation: 'Fuimos al mar.' },
                    { q: '¿Cuántos viajes hemos hecho juntos?', options: ['1', '3', 'más de 5', '2'], correct: 2, explanation: '¡Han sido más de 5!' },
                    { q: '¿Qué tomábamos con más frecuencia en la etapa de conocernos?', options: ['café', 'cerveza', 'gaseosa', 'limonada'], correct: 3, explanation: 'Limonada, ¡clásico!' },
                    { q: '¿Qué comimos cuando fuimos a 911?', options: ['pizza', 'hamburguesa', 'jugos y empanada', 'salchipapa'], correct: 2, explanation: 'Ricos jugos y empanada.' },
                    { q: '¿Nombre de la hamburguesa que nos gusta a ambos?', options: ['clásica', 'septiembre', 'tocineta', 'corral'], correct: 1, explanation: 'La septiembre, nuestra favorita.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['Elvis', 'Bohemian Rhapsody', 'Rocketman', 'Michael Jackson'], correct: 3, explanation: '¡La de Michael Jackson!' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['El diablo viste la moda 2', 'Chicas Pesadas', 'Barbie', 'Crepúsculo'], correct: 0, explanation: 'El diablo viste la moda 2.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['Fórmula 1', 'Rápidos y Furiosos', 'Need for Speed', 'Rush'], correct: 0, explanation: 'Fórmula 1.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['El teléfono negro 2', 'El conjuro', 'Annabelle', 'La monja'], correct: 0, explanation: 'El teléfono negro 2.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['¿Qué pasó ayer? 1', 'Son como niños', 'Proyecto X', 'Supercool'], correct: 0, explanation: '¿Qué pasó ayer? 1.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['¿Qué pasó ayer? 2', 'Ted', 'American Pie', 'Scary Movie'], correct: 0, explanation: '¿Qué pasó ayer? 2.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['¿Qué pasó ayer? 3', 'Guerra de papás', 'Nosotros los Nobles', '¿Qué culpa tiene el niño?'], correct: 0, explanation: '¿Qué pasó ayer? 3.' },
                    { q: '¿Cuál de estas películas nos hemos visto?', options: ['Mario Galaxy', 'Sonic', 'Zelda', 'Minecraft'], correct: 0, explanation: 'Mario Galaxy.' },
                    { q: '¿Cuál es mi jugo favorito?', options: ['Fresa', 'Mora', 'Milo', 'Lulo'], correct: 2, explanation: 'El Milo, ¡obvio!' },
                    { q: 'Canción que te dediqué junto con el ramo de rosas:', options: ['Flores Amarillas', '25 rosas', 'Perfecta', 'Mi Universo'], correct: 1, explanation: '25 rosas para ti.' },
                    { q: '¿Qué día nos hicimos novios?', options: ['5 de junio', '25 de diciembre', '14 de febrero', '19 de octubre'], correct: 3, explanation: 'El 19 de octubre.' },
                    { q: 'Yo siempre te he dicho que eres mi...', options: ['Reina', '2025', 'Princesa', 'Vida'], correct: 1, explanation: 'Eres mi 2025.' },
                    { q: '¿Qué serie nos hemos visto?', options: ['The Crown', 'Bridgerton', 'Elite', 'Stranger Things'], correct: 1, explanation: 'Bridgerton.' },
                    { q: '¿Qué serie nos hemos visto?', options: ['Lupin', 'La Casa de Papel', 'Dark', 'Peaky Blinders'], correct: 0, explanation: 'Lupin.' },
                    { q: '¿En dónde estaba escrita la nota que te dejé en tu oficina?', options: ['En un post-it', 'En una hoja de cuaderno', 'En tu mano', 'En una servilleta'], correct: 3, explanation: 'Fue en una servilleta.' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['Santelmo', 'París', 'Roma', 'Miami'], correct: 0, explanation: '¡A Santelmo!' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['Tarazá', 'Bogotá', 'Cartagena', 'San Andrés'], correct: 0, explanation: '¡A Tarazá!' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['Cali', 'Medellín', 'Barranquilla', 'Santa Marta'], correct: 1, explanation: '¡A Medellín!' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['Bucaramanga', 'Cúcuta', 'Montería', 'Pereira'], correct: 2, explanation: '¡A Montería!' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['La Perra', 'El Gato', 'El Pájaro', 'El Perro'], correct: 0, explanation: 'A La Perra.' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['Montaña', 'Piedra', 'Roca', 'Colina'], correct: 1, explanation: 'A Piedra.' },
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['La Cauchera', 'La Resortera', 'La Honda', 'El Tirachinas'], correct: 0, explanation: 'A La Cauchera.' },
                    { q: 'Yo tomé la iniciativa del primer beso.', options: ['Verdadero', 'Falso'], correct: 0, explanation: '¡Totalmente cierto!' },
                    { q: 'Tus jugos favoritos son los cítricos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Así es!' },
                    { q: 'Yo dije primero te amo.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Fui yo el primero.' },
                    { q: 'Me puedo dar el lujo de decir que te llevé a playa.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Y fue un viaje hermoso.' },
                    { q: 'Son más de 3 cm.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Es la verdad.' },
                    { q: 'La primera cita no demoró mucho.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Así fue.' },
                    { q: 'El arroz con leche del día de la mujer no tenía quéreme.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Cierto!' },
                    { q: 'Eres una niña consentida y mimosa.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Y me encanta que lo seas.' },
                    { q: 'Yo soy tu macho.', options: ['Verdadero', 'Falso'], correct: 0, explanation: '¡Claro que sí!' },
                    { q: 'A veces cuando nos vamos a ver eres muy puntual.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Sueles llegar tarde a veces jeje.' },
                    { q: 'La manillita que me diste me la diste en el éxito.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Falso, no fue ahí.' },
                    { q: 'Alquilé una sala de cine solo para los dos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Lo hice por ti!' },
                    { q: 'Por eso las operan.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nuestra frase.' },
                    { q: 'Morat es de nuestros cantantes favoritos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nos encantan.' },
                    { q: 'El primer ramo de flores que te di eran rojas.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Fueron amarillas.' },
                    { q: '¿En qué parque nos tomamos las fotos de los alumbrados navideños?', options: ['Parque Bolívar', 'El Palmar', 'Parque de la Vida', 'Parque Central'], correct: 1, explanation: '¡En El Palmar!' },
                    { q: 'Mi lady me estaba enseñando a bailar.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Así es jaja.' },
                    { q: 'Hemos desayunado juntos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Sí, deliciosos desayunos.' },
                    { q: 'Nos hemos bañado juntos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Sí lo hemos hecho.' },
                    { q: 'Hemos dormido juntos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'De los mejores momentos.' },
                    { q: 'Ambos tenemos pasaporte.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Listos para viajar.' },
                    { q: 'Lugar donde te entregué tu manillita.', options: ['En el parque', 'En tu casa', 'Heladería', 'Restaurante'], correct: 2, explanation: 'Fue en la heladería.' },
                    { q: 'Lugar donde nos comimos una ensalada de frutas.', options: ['Yireth', 'Cosechas', 'Frutera del Centro', 'Plaza'], correct: 0, explanation: 'En Yireth.' },
                    { q: '¿A cuál de mis hermanas conociste primero?', options: ['Ana', 'María', 'Isabel', 'Laura'], correct: 2, explanation: 'Fue a Isabel.' }
                ]
            }
        },
        {
            day: 4,
            title: "Día 4 - Nuestro rompecabezas",
            emoji: "🧩",
            letter: "Mi vida,\n\nMe haces mucha falta. Hoy te preparé un rompecabezas. Eres la pieza que faltaba en mi vida y juntos formamos algo hermoso.\n\nEspero que hoy te sientas un poquito mejor que ayer. Te mando mil besitos (con mucho cuidado).",
            funPhrase: "¡Tú puedes con todo! 🌟",
            recoveryQuote: "La paciencia es la mejor medicina.",
            gameType: 'puzzle',
            gameConfig: {
                images: [
                    'fotos/foto (7).jpeg', 'fotos/foto (31).jpeg', 'fotos/foto (32).jpeg',
                    'fotos/foto (33).jpeg', 'fotos/foto (34).jpeg', 'fotos/foto (35).jpeg',
                    'fotos/foto (36).jpeg', 'fotos/foto (49).jpeg', 'fotos/foto (76).jpeg',
                    'fotos/foto (129).jpeg', 'fotos/foto (130).jpeg', 'fotos/foto (131).jpeg',
                    'fotos/foto (132).jpeg', 'fotos/foto (27).jpeg', 'fotos/foto (162).jpeg',
                    'fotos/foto (72).jpeg', 'fotos/foto (2).jpeg', 'fotos/foto (143).jpeg',
                    'fotos/foto (61).jpeg', 'fotos/foto (145).jpeg', 'fotos/foto (98).jpeg',
                    'fotos/foto (79).jpeg', 'fotos/foto (118).jpeg', 'fotos/foto (71).jpeg',
                    'fotos/foto (128).jpeg', 'fotos/foto (53).jpeg', 'fotos/foto (122).jpeg',
                    'fotos/foto (63).jpeg', 'fotos/foto (58).jpeg', 'fotos/foto (110).jpeg',
                    'fotos/foto (91).jpeg', 'fotos/foto (46).jpeg', 'fotos/foto (65).jpeg',
                    'fotos/foto (51).jpeg', 'fotos/foto (109).jpeg', 'fotos/foto (112).jpeg',
                    'fotos/foto (125).jpeg', 'fotos/foto (59).jpeg', 'fotos/foto (78).jpeg',
                    'fotos/foto (184).jpeg', 'fotos/foto (195).jpeg', 'fotos/foto (183).jpeg',
                    'fotos/foto (174).jpeg', 'fotos/foto (19).jpeg', 'fotos/foto (85).jpeg',
                    'fotos/foto (156).jpeg', 'fotos/foto (185).jpeg', 'fotos/foto (30).jpeg',
                    'fotos/foto (89).jpeg', 'fotos/foto (138).jpeg', 'fotos/foto (191).jpeg',
                    'fotos/foto (24).jpeg', 'fotos/foto (116).jpeg', 'fotos/foto (38).jpeg',
                    'fotos/foto (55).jpeg', 'fotos/foto (41).jpeg', 'fotos/foto (166).jpeg',
                    'fotos/foto (179).jpeg', 'fotos/foto (165).jpeg', 'fotos/foto (103).jpeg',
                    'fotos/foto (67).jpeg'
                ],
                gridSize: 3,
                fallbackEmoji: '💕'
            }
        },
        {
            day: 5,
            title: "Día 5 - Festival de Juegos 🎪",
            emoji: "🎠",
            song: "musica/cancion1.mp3",
            letter: "Mi amor,\n\nHoy es una fecha especial, 5 de junio, el día en que nos dimos nuestro primer beso en la oficina, que fue un jueves y nos comimos un helado. Para celebrar esta fecha, he preparado un festival de juegos solo para ti.\n\nDisfruta de todos tus juegos favoritos y recuerda todos nuestros hermosos momentos.",
            funPhrase: "¡Gira la ruleta y prueba tu suerte! 🎡",
            recoveryQuote: "Cada día es una nueva oportunidad para sonreír.",
            games: [
                {
                    name: 'Memoria de Aniversario',
                    type: 'memory',
                    config: {
                        pairs: 8,
                        emojiFallback: ['💋', '💕', '🥰', '🌻', '🎬', '🍦', '🎡', '💌']
                    }
                },
                {
                    name: 'Sopa de Letras Especial',
                    type: 'wordsearch',
                    config: {
                        words: ['OFICINA', 'JUNIO', 'JUEVES', 'HELADO', 'BESO', 'CRISPETAS', 'DIEZDIECINUEVE', 'MARGARITAS', 'AMOR'],
                        gridSize: 12
                    }
                },
                {
                    name: 'Trivia del Primer Beso',
                    type: 'trivia',
                    config: {
                        questions: [
                            { q: '¿Cuál es mi jugo favorito?', options: ['Fresa', 'Mora', 'Milo', 'Lulo'], correct: 2, explanation: 'El Milo, ¡obvio!' },
                            { q: 'Canción que te dediqué junto con el ramo de rosas:', options: ['Flores Amarillas', '25 rosas', 'Perfecta', 'Mi Universo'], correct: 1, explanation: '25 rosas para ti.' },
                            { q: '¿Qué día nos hicimos novios?', options: ['5 de junio', '25 de diciembre', '14 de febrero', '19 de octubre'], correct: 3, explanation: 'El 19 de octubre.' },
                            { q: 'Yo siempre te he dicho que eres mi...', options: ['Reina', '2025', 'Princesa', 'Vida'], correct: 1, explanation: 'Eres mi 2025.' },
                            { q: '¿Qué serie nos hemos visto?', options: ['The Crown', 'Bridgerton', 'Elite', 'Stranger Things'], correct: 1, explanation: 'Bridgerton.' },
                            { q: '¿Qué serie nos hemos visto?', options: ['Lupin', 'La Casa de Papel', 'Dark', 'Peaky Blinders'], correct: 0, explanation: 'Lupin.' },
                            { q: '¿En dónde estaba escrita la nota que te dejé en tu oficina?', options: ['En un post-it', 'En una hoja de cuaderno', 'En tu mano', 'En una servilleta'], correct: 3, explanation: 'Fue en una servilleta.' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Santelmo', 'París', 'Roma', 'Miami'], correct: 0, explanation: '¡A Santelmo!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Tarazá', 'Bogotá', 'Cartagena', 'San Andrés'], correct: 0, explanation: '¡A Tarazá!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Cali', 'Medellín', 'Barranquilla', 'Santa Marta'], correct: 1, explanation: '¡A Medellín!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Bucaramanga', 'Cúcuta', 'Montería', 'Pereira'], correct: 2, explanation: '¡A Montería!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['La Perra', 'El Gato', 'El Pájaro', 'El Perro'], correct: 0, explanation: 'A La Perra.' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Montaña', 'Piedra', 'Roca', 'Colina'], correct: 1, explanation: 'A Piedra.' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['La Cauchera', 'La Resortera', 'La Honda', 'El Tirachinas'], correct: 0, explanation: 'A La Cauchera.' },
                            { q: 'Yo tomé la iniciativa del primer beso.', options: ['Verdadero', 'Falso'], correct: 0, explanation: '¡Totalmente cierto!' },
                            { q: 'Tus jugos favoritos son los cítricos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Así es!' },
                            { q: 'Yo dije primero te amo.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Fui yo el primero.' },
                            { q: 'Me puedo dar el lujo de decir que te llevé a playa.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Y fue un viaje hermoso.' },
                            { q: 'Son más de 3 cm.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Es la verdad.' },
                            { q: 'La primera cita no demoró mucho.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Así fue.' },
                            { q: 'El arroz con leche del día de la mujer no tenía quéreme.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Cierto!' },
                            { q: 'Eres una niña consentida y mimosa.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Y me encanta que lo seas.' },
                            { q: 'Yo soy tu macho.', options: ['Verdadero', 'Falso'], correct: 0, explanation: '¡Claro que sí!' },
                            { q: 'A veces cuando nos vamos a ver eres muy puntual.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Sueles llegar tarde a veces jeje.' },
                            { q: 'La manillita que me diste me la diste en el éxito.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Falso, no fue ahí.' },
                            { q: 'Alquilé una sala de cine solo para los dos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Lo hice por ti!' },
                            { q: 'Por eso las operan.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nuestra frase.' },
                            { q: 'Morat es de nuestros cantantes favoritos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nos encantan.' },
                            { q: 'El primer ramo de flores que te di eran rojas.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Fueron amarillas.' },
                            { q: '¿En qué parque nos tomamos las fotos de los alumbrados navideños?', options: ['Parque Bolívar', 'El Palmar', 'Parque de la Vida', 'Parque Central'], correct: 1, explanation: '¡En El Palmar!' },
                            { q: 'Mi lady me estaba enseñando a bailar.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Así es jaja.' },
                            { q: 'Hemos desayunado juntos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Sí, deliciosos desayunos.' },
                            { q: 'Nos hemos bañado juntos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Sí lo hemos hecho.' },
                            { q: 'Hemos dormido juntos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'De los mejores momentos.' },
                            { q: 'Ambos tenemos pasaporte.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Listos para viajar.' },
                            { q: 'Lugar donde te entregué tu manillita.', options: ['En el parque', 'En tu casa', 'Heladería', 'Restaurante'], correct: 2, explanation: 'Fue en la heladería.' },
                            { q: 'Lugar donde nos comimos una ensalada de frutas.', options: ['Yireth', 'Cosechas', 'Frutera del Centro', 'Plaza'], correct: 0, explanation: 'En Yireth.' },
                            { q: '¿A cuál de mis hermanas conociste primero?', options: ['Ana', 'María', 'Isabel', 'Laura'], correct: 2, explanation: 'Fue a Isabel.' },
                            { q: '¿En qué mes empezamos a hablar?', options: ['Enero', 'Febrero', 'Marzo', 'Abril'], correct: 1, explanation: 'En febrero comenzó todo.' },
                            { q: '¿Dónde fue nuestro primer beso?', options: ['Cine', 'Parque', 'Tu oficina', 'Mi casa'], correct: 2, explanation: 'Fue en tu oficina.' },
                            { q: '¿En qué mes fue nuestro primer beso?', options: ['Mayo', 'Junio', 'Julio', 'Agosto'], correct: 1, explanation: 'En junio.' },
                            { q: '¿Dónde fue nuestro segundo beso?', options: ['Cine', 'Tu oficina', 'Restaurante', 'Carro'], correct: 1, explanation: 'También fue en tu oficina.' },
                            { q: '¿Qué día de la semana fue nuestro primer beso?', options: ['Lunes', 'Miércoles', 'Jueves', 'Viernes'], correct: 2, explanation: 'Fue un hermoso jueves.' },
                            { q: '¿Con qué fue nuestro primer beso?', options: ['Crispetas', 'Helado', 'Jugo', 'Chocolate'], correct: 1, explanation: 'Con un rico helado.' }
                        ]
                    }
                },
                {
                    name: 'Rompecabezas del Recuerdo',
                    type: 'puzzle',
                    config: {
                        images: [
                            'fotos/foto (6).jpeg', 'fotos/foto (7).jpeg', 'fotos/foto (37).jpeg',
                            'fotos/foto (44).jpeg', 'fotos/foto (47).jpeg', 'fotos/foto (51).jpeg',
                            'fotos/foto (52).jpeg', 'fotos/foto (53).jpeg', 'fotos/foto (71).jpeg',
                            'fotos/foto (72).jpeg', 'fotos/foto (146).jpeg', 'fotos/foto_139.jpeg'
                        ],
                        gridSize: 3,
                        fallbackEmoji: '💕'
                    }
                },
                {
                    name: 'Descubre la Frase',
                    type: 'hangman',
                    config: {
                        phrases: [
                            'NUESTRO PRIMER BESO CINCO DE JUNIO',
                            'VIAJANDO EN MOTO A TARAZA UN FIN DE SEMANA JUNTOS',
                            'NUESTRA PRIMERA NAVIDAD JUNTOS',
                            'MARATON DE LA SERIE LUPIN',
                            'VIENDO ONE PIECE PERO DICES QUE SON MUCHOS CAPITULOS',
                            'VISTE YO TE DIJE POR ESO LAS OPERAN',
                            'CARLOS Y MELISSA VEINTE VEINTICINCO',
                            'VIAJANDO A MEDELLIN POR LA VIA VIEJA',
                            'VIAJANDO A MEDELLIN POR LA VIA NUEVA',
                            'VIAJANDO A PLAYA HASTA QUE TE CONQUISTE',
                            'VIENDO LA SAGA DE QUE PASO AYER',
                            'COCINANDO JUNTOS O BUENO YO COCINANDOTE A TI',
                            'ERES MUY BUENA ENFERMERA ME RECUPERE RAPIDO',
                            'PROMETEME TU Y YO POR UN LARGO RATO'
                        ]
                    }
                },
                {
                    name: 'Ruleta Sorpresa',
                    type: 'roulette',
                    config: {}
                }
            ]
        },
        {
            day: 6,
            title: "Día 6 - Conexión de Corazones 💖",
            emoji: "✨",
            song: "musica/cancion1.mp3",
            letter: "Mi amor,\n\n📢 **AVISO OFICIAL (Desde las 5:30 PM):**\n¡Hola hermosa! Los premios que habías ganado jugando anteriormente eran solamente de prueba para calentar motores 😉.\n\n¡Pero desde hoy a las 5:30 PM empiezan los **VERDADEROS PREMIOS SORPRESA**! 🎁\n\nEl nivel de dificultad ha aumentado: ahora sumas puntos de **2 en 2** y si te equivocas pierdes **1 punto**.\n\nPara ganar tu premio real y desbloquear el regalo, debes lograr una de dos cosas (lo que suceda primero):\n1️⃣ Llegar a la meta de **1000 puntos**.\n2️⃣ Demostrar tu perseverancia jugando al menos **15 veces**.\n\n¡Esfuérzate mucho mi reina, tú puedes ganar los verdaderos regalos! Te amo muchísimo 💖",
            funPhrase: "🚨 ¡Desde las 5:30 PM valen los premios reales! Juega 15 veces o llega a 1000 puntos 👑",
            recoveryQuote: "La constancia y el esfuerzo tienen su gran recompensa. ¡A jugar mi amor!",
            games: [
                {
                    name: 'Atrapa mi Corazón',
                    type: 'catchhearts',
                    config: {}
                },
                {
                    name: 'Simón Dice del Amor',
                    type: 'simonsays',
                    config: {}
                }
            ]
        },
        {
            day: 7,
            title: "Día 7 - Las Cajitas Mágicas de Carlos 🎁",
            emoji: "🗝️",
            song: "musica/cancion1.mp3",
            letter: "Mi hermosa princesa,\n\n¡Hemos llegado al Día 7 de nuestro Universo Melissa! 🎉 Siete días acompañándote en tu recuperación, viéndote ser cada día más fuerte y valiente.\n\nHoy te he preparado un minijuego nuevo y exclusivo: **Las Cajitas Mágicas de Carlos**. En cada cajita de regalo hay un mensaje escrito con todo mi amor.\n\nAbre cada una para descubrir lo mucho que te adoro, ¡y encuentra la **Llave Dorada del Amor** al final para desbloquear tu Premio Real del Día 7!\n\n¡Te amo infinito, mi reina hermosa! 💖",
            funPhrase: "¡Una semana de recuperación superada como una verdadera campeona! 👑",
            recoveryQuote: "Siete días menos de espera y siete días más de amor incondicional.",
            gameType: 'magicboxes',
            gameConfig: {}
        },
        {
            day: 8,
            title: "Día 8 - El Tragamonedas del Amor 🎰",
            emoji: "🎰",
            song: "musica/cancion1.mp3",
            letter: "¡Buenos días, mi reina hermosa!\n\n¡Bienvenida al Día 8! Hoy empezamos formalmente tu segunda semana de recuperación. Has demostrado ser una mujer extraordinaria, fuerte y perseverante.\n\nPara celebrar este día tan especial, te diseñé tu propio **Tragamonedas del Amor**. ¡Presiona el botón para girar los rodillos y descubrir todas las combinaciones románticas, piropos y hermosas dedicatorias que guardé para ti en cada giro!\n\n¡Hoy se juega por puro amor y celebración, porque tú ya te ganaste el premio mayor de mi corazón para toda la vida! 💖",
            funPhrase: "¡En el casino de la vida, ganarte a ti fue mi mayor Jackpot! 🎰👑",
            recoveryQuote: "Día 8: Segunda semana de amor, paciencia y consentimientos infinitos.",
            gameType: 'slots',
            gameConfig: {}
        },
        {
            day: 9,
            title: "Día 9 - ¡Festival Mundialista del Amor! 🏆⚽",
            emoji: "🏆",
            song: "musica/cancion1.mp3",
            letter: "¡Hola, campeona indiscutible de mi vida!\n\n¡Bienvenida al Día 9! Hoy tu recuperación se viste de gala y entra al **Mundial de Fútbol del Amor**. Has jugado cada día con una garra y una dulzura impresionantes.\n\nPara hoy te preparé no uno, sino **TRES MINIJUEGOS MUNDIALISTAS INFINITOS**:\n1️⃣ **Tanda de Penales del Amor:** ¡Métele golazos románticos al portero!\n2️⃣ **Álbum Panini de Carlos y Melissa:** ¡Abre sobres dorados infinitos y visualiza tu álbum con nuestras fotos reales!\n3️⃣ **Selecciones del Mundial 2026:** ¡Demuestra cuánto sabes de fútbol y escribe los nombres de los países clasificados!\n\n¡Juega todo lo que quieras hoy, mi estrella número 10! Te amo con toda mi alma 💖🇨🇴",
            funPhrase: "⚽ ¡En la selección de mi corazón, tú llevas la 10 y eres la capitana eterna! 🏆👑",
            recoveryQuote: "Día 9: Goleando a la recuperación como toda una campeona mundial.",
            games: [
                {
                    name: 'Tanda de Penales del Amor ⚽',
                    emoji: '⚽',
                    type: 'penalties',
                    config: {}
                },
                {
                    name: 'Álbum Panini de Carlos y Melissa 📖',
                    emoji: '📖',
                    type: 'album',
                    config: {}
                },
                {
                    name: 'Selecciones del Mundial 2026 🌍',
                    emoji: '🌍',
                    type: 'worldcupteams',
                    config: {}
                }
            ]
        },
        {
            day: 10,
            title: "Día 10 - ¡Festival Musical del Amor! 🎶🎤",
            emoji: "🎧",
            song: "musica/cancion10.mp3",
            letter: "¡Mi amor hermosa, mi reina y mi canción favorita!\n\n¡Llegamos al Día 10! Diez días de una valentía increíble, diez días donde me has demostrado la fuerza tan maravillosa que tienes en tu corazón y en tu espíritu.\n\nHoy quiero que celebremos al ritmo de nuestro amor. Porque si el universo fuera una sinfonía, tú serías la melodía perfecta que le da sentido a toda mi existencia. Cada latido de mi pecho canta tu nombre, y cada segundo que pasa es una nota más cerca de volver a tenerte entre mis brazos, bailando y sonriendo como tanto nos gusta.\n\nDiviértete con este festival musical que preparé para ti: canta nuestras canciones, toca el piano mágico y sintoniza las frecuencias de mi corazón.\n\n¡Te amo con toda mi alma hoy, mañana y siempre!",
            funPhrase: "¡Tú eres mi hit número 1 para toda la vida! 🎼🥰",
            recoveryQuote: "Diez días demostrando tu fuerza. ¡El ritmo de tu recuperación es imparable!",
            gameType: 'musicfestival',
            gameConfig: {}
        },
        {
            day: 11,
            title: "Día 11 - ¡Arcade Retro: Las Maquinitas del Amor! 🕹️👾",
            emoji: "🕹️",
            song: "musica/cancion1.mp3",
            letter: "¡INSERT COIN, MI AMOR! 🪙💖\n\nMi princesa Melissa, hoy cumplimos 11 días en este universo y 11 días de tu maravillosa recuperación. En el gran videojuego de mi vida, tú eres y serás por siempre mi Jugadora Número 1 (Player 1).\n\nAdmiro tanto la garra, la valentía y la energía con la que estás superando cada nivel de esta recuperación. No hay jefe final, ni tormenta, ni obstáculo que pueda con nosotros, porque juntos formamos el equipo más invencible de todo el cosmos.\n\nPara el día de hoy te preparé un salón de maquinitas retro especial, lleno de nostalgia, luces de neón y mucha diversión. Aquí no hay vidas limitadas: mi amor por ti tiene vidas infinitas y códigos secretos de felicidad eterna.\n\n¡Juega en las maquinitas, acumula Tickets Arcade y canjéalos por premios reales que te daré a besos y abrazos en cuanto te recuperes!\n\nTe amo infinito, tu rey y compañero de partida para toda la eternidad. 👑🎮",
            funPhrase: "¡Tú y yo: El equipo invencible con vidas infinitas! 🎮❤️",
            recoveryQuote: "¡Nivel 11 superado con éxito! Tu barra de energía se recarga al 100% cada día.",
            gameType: 'arcade',
            gameConfig: {}
        },
        {
            day: 12,
            title: "Día 12 - ¡Volando Juntos! 🕊️💖",
            emoji: "🕊️",
            song: "musica/cancion12.mp3",
            letter: "¡Mi reina hermosa, mi pajarita linda!\n\nYa llegamos al Día 12 de esta recuperación que has llevado con tanta fuerza y valentía. Quiero que sepas que cada día que pasa me siento más orgulloso de la mujer increíble que tengo a mi lado.\n\nSé que hay momentos donde todo parece un obstáculo o una enredadera difícil de pasar, pero quiero recordarte que nuestro amor nos da alas. No importa cuántas veces sintamos que caemos, siempre tomaremos impulso para volar más alto, superando cualquier rosa con espinas que se cruce en nuestro camino.\n\nHoy quiero que te relajes y juegues a 'Flappy Love'. Cada vez que toques la pantalla, recuerda que así de ligero se siente mi corazón cada vez que te veo sonreír. Eres el aire bajo mis alas y la razón por la que quiero volar siempre a tu lado.\n\n¡Te amo con todo mi ser, hoy y siempre! A volar mi amor. 💖✨",
            funPhrase: "¡Ni la gravedad puede con nuestro amor! 🌌🥰",
            recoveryQuote: "Con cada aleteo, más cerca de abrazarnos y no soltarnos nunca.",
            gameType: 'flappylove',
            gameConfig: {}
        },
        {
            day: 13,
            title: "Día 13 - ¡El Gran Repaso del Amor! 🎪✨",
            emoji: "🎪",
            song: "musica/cancion12.mp3",
            letter: "¡Mi amor, mi reina, mi vida entera!\n\n¡Llegamos al Día 13! Y qué mejor manera de celebrarlo que haciendo un repaso de todos los momentos mágicos que hemos vivido en estos días.\n\nEste universo que construí para ti es un reflejo de todo lo que eres para mí: la persona que ilumina cada rincón de mi corazón. Cada juego que hemos jugado juntos (aunque estemos separados por la distancia de tu recuperación) ha sido un recordatorio de lo mucho que te amo.\n\nHoy te abro las puertas del Gran Festival del Repaso: todos los juegos de nuestros días anteriores, reunidos en un solo lugar para que juegues lo que más te guste, las veces que quieras, sin límites.\n\nEres la aventura más hermosa de mi vida. ¡Te amo infinito! 💖🌟",
            funPhrase: "¡13 días de amor, risas y recuperación juntos! 🎉👑",
            recoveryQuote: "Cada día que pasa eres más fuerte. ¡13 días lo demuestran!",
            games: [
                {
                    name: 'Memoria del Amor 🧠',
                    emoji: '🧠',
                    type: 'memory',
                    config: {
                        pairs: 8,
                        emojiFallback: ['💋', '💕', '🥰', '🌻', '🎬', '🍦', '🎡', '💌']
                    }
                },
                {
                    name: 'Sopa de Letras 🔤',
                    emoji: '🔤',
                    type: 'wordsearch',
                    config: {
                        words: ['OFICINA', 'JUNIO', 'JUEVES', 'HELADO', 'BESO', 'CRISPETAS', 'MARGARITAS', 'AMOR', 'MELISSA', 'CARLOS'],
                        gridSize: 12
                    }
                },
                {
                    name: 'Trivia de los Dos ❓',
                    emoji: '❓',
                    type: 'trivia',
                    config: {
                        questions: [
                            { q: '¿Cuál es mi jugo favorito?', options: ['Fresa', 'Mora', 'Milo', 'Lulo'], correct: 2, explanation: 'El Milo, ¡obvio!' },
                            { q: 'Canción que te dediqué junto con el ramo de rosas:', options: ['Flores Amarillas', '25 rosas', 'Perfecta', 'Mi Universo'], correct: 1, explanation: '25 rosas para ti.' },
                            { q: '¿Qué día nos hicimos novios?', options: ['5 de junio', '25 de diciembre', '14 de febrero', '19 de octubre'], correct: 3, explanation: 'El 19 de octubre.' },
                            { q: 'Yo siempre te he dicho que eres mi...', options: ['Reina', '2025', 'Princesa', 'Vida'], correct: 1, explanation: 'Eres mi 2025.' },
                            { q: '¿Dónde fue nuestro primer beso?', options: ['Cine', 'Parque', 'Tu oficina', 'Mi casa'], correct: 2, explanation: 'Fue en tu oficina.' },
                            { q: '¿En qué mes fue nuestro primer beso?', options: ['Mayo', 'Junio', 'Julio', 'Agosto'], correct: 1, explanation: 'En junio.' },
                            { q: '¿Qué día de la semana fue nuestro primer beso?', options: ['Lunes', 'Miércoles', 'Jueves', 'Viernes'], correct: 2, explanation: 'Fue un hermoso jueves.' },
                            { q: 'El primer ramo de flores que te di eran rojas.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Fueron amarillas.' },
                            { q: 'Yo dije primero te amo.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Fui yo el primero.' },
                            { q: 'Alquilé una sala de cine solo para los dos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Lo hice por ti!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Tarazá', 'Bogotá', 'Cartagena', 'San Andrés'], correct: 0, explanation: '¡A Tarazá!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Cali', 'Medellín', 'Barranquilla', 'Santa Marta'], correct: 1, explanation: '¡A Medellín!' },
                            { q: 'Morat es de nuestros cantantes favoritos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nos encantan.' },
                            { q: 'Hemos dormido juntos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'De los mejores momentos.' },
                            { q: 'Ambos tenemos pasaporte.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Listos para viajar.' }
                        ]
                    }
                },
                {
                    name: 'Rompecabezas de Foto 🧩',
                    emoji: '🧩',
                    type: 'puzzle',
                    config: {
                        images: [
                            'fotos/foto (7).jpeg', 'fotos/foto (31).jpeg', 'fotos/foto (32).jpeg',
                            'fotos/foto (72).jpeg', 'fotos/foto (146).jpeg', 'fotos/foto_139.jpeg',
                            'fotos/foto (129).jpeg', 'fotos/foto (130).jpeg', 'fotos/foto (76).jpeg'
                        ],
                        gridSize: 3,
                        fallbackEmoji: '💕'
                    }
                },
                {
                    name: 'Descubre la Frase 🔡',
                    emoji: '🔡',
                    type: 'hangman',
                    config: {
                        phrases: [
                            'NUESTRO PRIMER BESO CINCO DE JUNIO',
                            'VIAJANDO EN MOTO A TARAZA UN FIN DE SEMANA JUNTOS',
                            'NUESTRA PRIMERA NAVIDAD JUNTOS',
                            'MARATON DE LA SERIE LUPIN',
                            'CARLOS Y MELISSA VEINTE VEINTICINCO',
                            'VIAJANDO A MEDELLIN POR LA VIA VIEJA',
                            'VIAJANDO A PLAYA HASTA QUE TE CONQUISTE',
                            'COCINANDO JUNTOS O BUENO YO COCINANDOTE A TI',
                            'PROMETEME TU Y YO POR UN LARGO RATO'
                        ]
                    }
                },
                {
                    name: 'Atrapa mi Corazón ❤️',
                    emoji: '❤️',
                    type: 'catchhearts',
                    config: {}
                },
                {
                    name: 'Simón Dice del Amor 🎵',
                    emoji: '🎵',
                    type: 'simonsays',
                    config: {}
                },
                {
                    name: 'Cajitas Mágicas de Carlos 🎁',
                    emoji: '🎁',
                    type: 'magicboxes',
                    config: {}
                },
                {
                    name: 'Tragamonedas del Amor 🎰',
                    emoji: '🎰',
                    type: 'slots',
                    config: {}
                },
                {
                    name: 'Penales del Amor ⚽',
                    emoji: '⚽',
                    type: 'penalties',
                    config: {}
                },
                {
                    name: 'Álbum Panini de Nosotros 📖',
                    emoji: '📖',
                    type: 'album',
                    config: {}
                },
                {
                    name: 'Selecciones del Mundial 🌍',
                    emoji: '🌍',
                    type: 'worldcupteams',
                    config: {}
                },
                {
                    name: 'Festival Musical 🎶',
                    emoji: '🎶',
                    type: 'musicfestival',
                    config: {}
                },
                {
                    name: 'Arcade Retro 🕹️',
                    emoji: '🕹️',
                    type: 'arcade',
                    config: {}
                },
                {
                    name: 'Flappy Love 🕊️',
                    emoji: '🕊️',
                    type: 'flappylove',
                    config: {}
                }
            ]
        },
        {
            day: 14,
            title: "Día 14 - El Buzón de tu Corazón 💌",
            emoji: "💌",
            song: "musica/cancio14.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nLlegamos al Día 14, ¡ya vas por la mitad del camino! Hoy quiero que imagines que tienes un buzón justo en el centro de tu corazón, y que cada día yo dejo ahí una cartita nueva para ti.\n\nHoy la carta dice esto: no importa la distancia, ni los días que faltan, mis mensajes de amor siempre van a encontrar el camino hasta ti, como si tu corazón tuviera su propio buzón esperando por mis palabras.\n\nQuise que disfrutaras de nuevo todos tus juegos favoritos, los mismos que tanto te han gustado, para que juegues las veces que quieras sin afán. Cada juego es un pedacito de nuestra historia, y quiero que hoy solo te relajes y disfrutes.\n\nRevisa tu buzón todos los días, mi amor, porque ahí siempre vas a encontrar una carta mía esperándote. Te amo infinito, mi cómplice de vida. 💖",
            funPhrase: "¡Tu corazón tiene buzón y yo tengo cartas de sobra! 💌👑",
            recoveryQuote: "Día 14: la mitad del camino recorrida con toda tu fuerza.",
            games: [
                {
                    name: 'Memoria del Amor 🧠',
                    emoji: '🧠',
                    type: 'memory',
                    config: {
                        pairs: 8,
                        emojiFallback: ['💋', '💕', '🥰', '🌻', '🎬', '🍦', '🎡', '💌']
                    }
                },
                {
                    name: 'Sopa de Letras 🔤',
                    emoji: '🔤',
                    type: 'wordsearch',
                    config: {
                        words: ['OFICINA', 'JUNIO', 'JUEVES', 'HELADO', 'BESO', 'CRISPETAS', 'MARGARITAS', 'AMOR', 'MELISSA', 'CARLOS'],
                        gridSize: 12
                    }
                },
                {
                    name: 'Trivia de los Dos ❓',
                    emoji: '❓',
                    type: 'trivia',
                    config: {
                        questions: [
                            { q: '¿Cuál es mi jugo favorito?', options: ['Fresa', 'Mora', 'Milo', 'Lulo'], correct: 2, explanation: 'El Milo, ¡obvio!' },
                            { q: 'Canción que te dediqué junto con el ramo de rosas:', options: ['Flores Amarillas', '25 rosas', 'Perfecta', 'Mi Universo'], correct: 1, explanation: '25 rosas para ti.' },
                            { q: '¿Qué día nos hicimos novios?', options: ['5 de junio', '25 de diciembre', '14 de febrero', '19 de octubre'], correct: 3, explanation: 'El 19 de octubre.' },
                            { q: 'Yo siempre te he dicho que eres mi...', options: ['Reina', '2025', 'Princesa', 'Vida'], correct: 1, explanation: 'Eres mi 2025.' },
                            { q: '¿Dónde fue nuestro primer beso?', options: ['Cine', 'Parque', 'Tu oficina', 'Mi casa'], correct: 2, explanation: 'Fue en tu oficina.' },
                            { q: '¿En qué mes fue nuestro primer beso?', options: ['Mayo', 'Junio', 'Julio', 'Agosto'], correct: 1, explanation: 'En junio.' },
                            { q: '¿Qué día de la semana fue nuestro primer beso?', options: ['Lunes', 'Miércoles', 'Jueves', 'Viernes'], correct: 2, explanation: 'Fue un hermoso jueves.' },
                            { q: 'El primer ramo de flores que te di eran rojas.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Fueron amarillas.' },
                            { q: 'Yo dije primero te amo.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Fui yo el primero.' },
                            { q: 'Alquilé una sala de cine solo para los dos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Lo hice por ti!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Tarazá', 'Bogotá', 'Cartagena', 'San Andrés'], correct: 0, explanation: '¡A Tarazá!' },
                            { q: '¿A cuál de estos lugares hemos ido?', options: ['Cali', 'Medellín', 'Barranquilla', 'Santa Marta'], correct: 1, explanation: '¡A Medellín!' },
                            { q: 'Morat es de nuestros cantantes favoritos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nos encantan.' },
                            { q: 'Hemos dormido juntos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'De los mejores momentos.' },
                            { q: 'Ambos tenemos pasaporte.', options: ['Falso', 'Verdadero'], correct: 1, explanation: 'Listos para viajar.' }
                        ]
                    }
                },
                {
                    name: 'Rompecabezas de Foto 🧩',
                    emoji: '🧩',
                    type: 'puzzle',
                    config: {
                        images: [
                            'fotos/foto (7).jpeg', 'fotos/foto (31).jpeg', 'fotos/foto (32).jpeg',
                            'fotos/foto (72).jpeg', 'fotos/foto (146).jpeg', 'fotos/foto_139.jpeg',
                            'fotos/foto (129).jpeg', 'fotos/foto (130).jpeg', 'fotos/foto (76).jpeg'
                        ],
                        gridSize: 3,
                        fallbackEmoji: '💕'
                    }
                },
                {
                    name: 'Descubre la Frase 🔡',
                    emoji: '🔡',
                    type: 'hangman',
                    config: {
                        phrases: [
                            'NUESTRO PRIMER BESO CINCO DE JUNIO',
                            'VIAJANDO EN MOTO A TARAZA UN FIN DE SEMANA JUNTOS',
                            'NUESTRA PRIMERA NAVIDAD JUNTOS',
                            'MARATON DE LA SERIE LUPIN',
                            'CARLOS Y MELISSA VEINTE VEINTICINCO',
                            'VIAJANDO A MEDELLIN POR LA VIA VIEJA',
                            'VIAJANDO A PLAYA HASTA QUE TE CONQUISTE',
                            'COCINANDO JUNTOS O BUENO YO COCINANDOTE A TI',
                            'PROMETEME TU Y YO POR UN LARGO RATO'
                        ]
                    }
                },
                {
                    name: 'Atrapa mi Corazón ❤️',
                    emoji: '❤️',
                    type: 'catchhearts',
                    config: {}
                },
                {
                    name: 'Simón Dice del Amor 🎵',
                    emoji: '🎵',
                    type: 'simonsays',
                    config: {}
                },
                {
                    name: 'Cajitas Mágicas de Carlos 🎁',
                    emoji: '🎁',
                    type: 'magicboxes',
                    config: {}
                },
                {
                    name: 'Tragamonedas del Amor 🎰',
                    emoji: '🎰',
                    type: 'slots',
                    config: {}
                },
                {
                    name: 'Penales del Amor ⚽',
                    emoji: '⚽',
                    type: 'penalties',
                    config: {}
                },
                {
                    name: 'Álbum Panini de Nosotros 📖',
                    emoji: '📖',
                    type: 'album',
                    config: {}
                },
                {
                    name: 'Selecciones del Mundial 🌍',
                    emoji: '🌍',
                    type: 'worldcupteams',
                    config: {}
                },
                {
                    name: 'Festival Musical 🎶',
                    emoji: '🎶',
                    type: 'musicfestival',
                    config: {}
                },
                {
                    name: 'Arcade Retro 🕹️',
                    emoji: '🕹️',
                    type: 'arcade',
                    config: {}
                },
                {
                    name: 'Flappy Love 🕊️',
                    emoji: '🕊️',
                    type: 'flappylove',
                    config: {}
                }
            ]
        },
        // Days 15-29 are placeholders for Carlos to customize
        ...Array.from({length: 15}, (_, i) => ({
            day: i + 15,
            title: `Día ${i + 15} - Sorpresa`,
            emoji: "💖",
            letter: "Mi amor,\n\nSigue recuperándote y descansando. Te extraño mucho y te amo con todo mi corazón.\n\n¡Disfruta el juego de hoy!",
            funPhrase: "¡Pronto estaremos juntos! 🥰",
            recoveryQuote: "Un día menos para abrazarnos.",
            gameType: ['memory', 'wordsearch', 'trivia', 'puzzle', 'riddle'][Math.floor(Math.random() * 5)],
            gameConfig: {} // Default configs will be handled by games.js
        })),
        {
            day: 30,
            title: "Día 30 - ¡Lo lograste!",
            emoji: "🎉",
            letter: "¡MI AMOR HERMOSA!\n\nLlegamos al día 30. ¡Lo lograste! Ha sido un mes lleno de retos, pero demostraste lo fuerte y valiente que eres. No sabes lo orgulloso que estoy de ti.\n\nEste universo fue solo una pequeña forma de decirte que estoy aquí para ti, siempre. Ya casi podemos volver a abrazarnos, salir y disfrutar juntos.\n\nTe amo hoy, mañana y siempre. Eres mi todo.",
            funPhrase: "¡Graduada de la recuperación! 🎓",
            recoveryQuote: "El final de este capítulo, el inicio de miles más juntos.",
            gameType: 'memory',
            gameConfig: {
                pairs: 8,
                emojiFallback: ['💕','💗','💖','💝','💘','💞','🌹','⭐']
            }
        }
    ];

    return {
        startDate: START_DATE,
        totalDays: TOTAL_DAYS,
        getDay: function(dayNumber) {
            return days.find(d => d.day === dayNumber) || days[0];
        },
        getCurrentDay: calculateCurrentDay,
        days: days
    };
})();
