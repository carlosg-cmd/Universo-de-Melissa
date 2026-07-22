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
        {
            day: 15,
            title: "Día 15 - Caza Corazones 💘",
            emoji: "💘",
            song: "musica/cancion15.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\n¿Quién te espera cada día con un juego nuevo? Yo.\n¿Quién te escribe cartitas mientras te recuperas? Yo.\n¿Quién te manda flores amarillas antes de siquiera ser tu novio? Yo.\n¿Quién te sube fotos y recuerdos para que sonrías en tus días de descanso? Yo.\n¿Quién respeta tu espacio y tus tiempos, y aun así piensa en ti a cada rato? Yo.\n¿Quién entiende tus días difíciles y sigue ahí, sin irse a ningún lado? Yo.\n\nYa vamos por el Día 15, más de la mitad del camino, y hoy te traigo un juego nuevo: corazones que aparecen y se esconden, y tú tienes que atraparlos antes de que se vayan. Entre más rápido reacciones, más puntos ganas, y puedes jugarlo las veces que quieras tratando de superar tu propio récord.\n\nPor favor no lo olvides, mi amor: nadie te va a querer, cuidar y consentir como yo. Te amo infinito, mi cómplice de vida. 💖",
            funPhrase: "¡A cazar corazones, mi campeona! 💘🏆",
            recoveryQuote: "Día 15: más de la mitad recorrida, ¡qué orgulloso estoy de ti!",
            gameType: 'whackhearts',
            gameConfig: {
                duration: 45,
                holeCount: 9,
                emojis: ['💖', '💗', '💕']
            }
        },
        {
            day: 16,
            title: "Día 16 - Serpiente del Amor 🐍💗",
            emoji: "🐍",
            song: "musica/cancion16.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nDía 16, y hoy te traigo otro juego completamente nuevo: una serpiente que va comiendo corazones y creciendo cada vez más, igual que este amor que sentimos el uno por el otro, que entre más pasa el tiempo más grande se vuelve.\n\nGuíala con las flechas o los botones, come todos los corazones que puedas, y ten cuidado de no chocar contigo misma ni con el borde. Juega las veces que quieras, ¡a ver hasta dónde puedes hacerla crecer!\n\nTe amo infinito, mi cómplice de vida. 💖",
            funPhrase: "¡Que nuestro amor crezca como esta serpiente, sin parar! 🐍💕",
            recoveryQuote: "Día 16: cada día que pasa, este amor se hace más grande.",
            gameType: 'snakelove',
            gameConfig: {
                gridSize: 15,
                tickMs: 160
            }
        },
        {
            day: 17,
            title: "Día 17 - Sabrás 🧩💛",
            emoji: "🧩",
            song: "musica/cancion17.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nHoy quiero que sepas algo: pase lo que pase, en cualquier situación, este corazón siempre te va a querer. No importa si un día amanezco cansado, triste, o hasta viejo, mi forma de amarte no va a cambiar. Vas a saber siempre, sin ninguna duda, que nadie te va a querer como yo.\n\nPor eso hoy te dejo un rompecabezas deslizante: una foto nuestra hecha pedacitos que tienes que ir acomodando, ficha por ficha, hasta que la imagen vuelva a estar completa. Así como esta foto, nuestro amor también se va armando poquito a poco, con paciencia y con ganas.\n\nJuega las veces que quieras, a ver en cuántos movimientos logras armarla. Te amo infinito, mi cómplice de vida. 💖",
            funPhrase: "Sabrás que, como sea, siempre te voy a amar 💛🧩",
            recoveryQuote: "Día 17: pieza a pieza, este amor se sigue armando.",
            gameType: 'slidepuzzle',
            gameConfig: {
                gridSize: 3,
                images: [
                    'fotos/foto (7).jpeg', 'fotos/foto (31).jpeg', 'fotos/foto (32).jpeg',
                    'fotos/foto (72).jpeg', 'fotos/foto (146).jpeg', 'fotos/foto_139.jpeg'
                ]
            }
        },
        {
            day: 18,
            title: "Día 18 - Qué Bendición 🙏💗",
            emoji: "🙏",
            song: "musica/cancion18.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nHoy quiero darle gracias a Dios por la oportunidad de tenerte a mi lado, mi ángel. Qué bendición más grande es poder amarte, cuidarte y compartir mi vida contigo. No hay palabras suficientes para agradecer todo lo que eres para mí.\n\nEres un regalo del cielo, y aunque estés lejos recuperándote, mi forma de amarte y cuidarte no cambia ni un poquito. Verte cada mañana, aunque sea en una foto o una videollamada, es el premio más valioso que tengo.\n\nHoy te traigo un juego para encestar corazones: toca la pantalla para lanzarlos hacia la canasta, que se mueve de un lado a otro. Entre más rápido apuntes, más corazones puedes encestar. Juega las veces que quieras.\n\nTe amo infinito, mi bendición, mi cómplice de vida. 💖",
            funPhrase: "Qué bendición más grande es tenerte, mi ángel 🙏💕",
            recoveryQuote: "Día 18: agradeciendo a Dios por tenerte en mi vida.",
            gameType: 'basketlove',
            gameConfig: {
                attempts: 10
            }
        },
        {
            day: 19,
            title: "Día 19 - Bendita Mujercita 🙏💗",
            emoji: "🙏",
            song: "musica/cancion19.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nBendita seas tú, bendita tu sonrisa. Eres un regalo del cielo, y cuando el día se acaba, siempre terminas en mis pensamientos. Quisiera darte mi vida entera, un día a la vez, y ser tu refugio cuando el mundo pese demasiado.\n\nLe pido a Dios que nos cuide y nos acompañe, que nunca falte la ternura entre nosotros, pase lo que pase. Y aunque a veces la vida se ponga difícil, sé que vamos a volver a mirarnos, a abrazarnos fuerte, cuantas veces haga falta.\n\nHoy te dejo un juego distinto: detrás de estos ladrillos hay una foto nuestra escondida. Mueve la paleta, rebota la pelotita y rómpelos todos para descubrirla completa.\n\nTe amo infinito, mi bendita mujercita, mi cómplice de vida. 💖",
            funPhrase: "Bendita tú, bendita tu sonrisa, bendito este amor 🙏💕",
            recoveryQuote: "Día 19: pidiendo al cielo que cuide siempre este amor.",
            gameType: 'brickreveal',
            gameConfig: {
                rows: 5,
                cols: 6,
                lives: 3,
                images: ['fotos/foto (76).jpeg', 'fotos/foto (129).jpeg', 'fotos/foto (130).jpeg']
            }
        },
        {
            day: 20,
            title: "Día 20 - Esa Muchachita 🌹💗",
            emoji: "🌹",
            song: "musica/cancion20.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nEsa muchachita linda que me ama, con la frescura de una rosa recién abierta y un ángel que se refleja en su mirada, esa eres tú. La que siempre me acompaña, la que me llena de calma, la que llevo en el alma sin importar la distancia.\n\nMe encanta cuando bailas, cuando cantas, cuando me regalas un abrazo y te vas caminando, para después volver con esa sonrisita que me deja sin palabras. Eres el amor que a mí me llama, hoy y siempre.\n\nHoy te dejo un juego de observación: dos fotos nuestras que parecen iguales, pero una esconde corazones invisibles. Encuéntralos todos antes de que se acabe el tiempo, ¡y trata de superar tu propio récord!\n\nTe amo infinito, esa muchachita mía, mi cómplice de vida. 💖",
            funPhrase: "Esa muchachita, como nadie, es la que llevo en el alma 🌹💕",
            recoveryQuote: "Día 20: dos tercios del camino, ¡vas increíble, mi amor!",
            gameType: 'finddifferences',
            gameConfig: {
                differenceCount: 5,
                images: ['fotos/foto (31).jpeg', 'fotos/foto (32).jpeg', 'fotos/foto (72).jpeg']
            }
        },
        {
            day: 21,
            title: "Día 21 - La Maravilla 💛🎶",
            emoji: "💛",
            song: "musica/cancion21.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nEn esta canción, el que canta describe a una mujer sencilla, trabajadora, que valora a la gente por encima del dinero, y que es igual de amable con cualquiera. Y pensé en ti, porque así eres tú: mi orientadora escolar, la que cuida y guía a tantos estudiantes con el mismo cariño con el que me cuidas a mí, sin importarte nada más que hacer el bien.\n\nEres la dueña de mis amores, la reina de corazones que todos quieren, y para mí, sin duda, eres la maravilla. No importa que ahora mismo estés lejos, en Medellín, recuperándote de la cirugía. Lo único que de verdad cuenta es que seas tú, mi persona favorita en este mundo, y que pronto vamos a estar juntos otra vez.\n\nCada día que pasa te extraño un poquito más y cuento las horas para volver a verte, para que sigas recuperándote tranquila sabiendo que aquí sigo, esperándote con todo mi corazón.\n\nHoy te dejo un juego distinto, uno de pura lógica: hay un código secreto hecho de corazones de colores, y tienes que ir descifrándolo con pistas después de cada intento. A ver cuántos intentos necesitas para descubrirlo.\n\nTe amo infinito, mi maravilla, mi profesora favorita, mi cómplice de vida. 💖",
            funPhrase: "Para mí, sin duda, tú eres la maravilla 💛🎶",
            recoveryQuote: "Día 21: cada día pienso más en volver a verte.",
            gameType: 'mastermind',
            gameConfig: {
                codeLength: 4,
                maxAttempts: 8,
                colors: ['💗', '💛', '💙', '💚', '🧡']
            }
        },
        {
            day: 22,
            title: "Día 22 - Matilde 🌾💛",
            emoji: "🌾",
            song: "musica/cancion22.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nUn mediodía estuve pensando en ti, en la mujer que me hace soñar despierto. Cuando tú caminas, hasta el lugar más gris se llena de luz, así como en esta canción hasta la sabana sonríe cuando Matilde pasa. Eres elegante, admirada, y para mí, la más popular de todas, mi Matilde.\n\nEste sentimiento se hace cada día más grande, palpita fuerte mi corazón solo de pensarte. No importa la distancia ni que estés en Medellín recuperándote; mi cariño y mis ganas de cuidarte no cambian ni un poquito.\n\nHoy te dejo un juego nuevo para armar palabras de nuestra historia: te van a aparecer las letras revueltas, y tienes que tocarlas en el orden correcto para formar la palabra completa. Arma cuantas puedas antes de que se acabe el tiempo, ¡y trata de superar tu propio récord!\n\nTe amo infinito, mi Matilde, mi cómplice de vida. 💖",
            funPhrase: "Cuando tú caminas, hasta mi mundo entero sonríe 🌾💕",
            recoveryQuote: "Día 22: cada día este sentimiento se hace más grande.",
            gameType: 'letterorder',
            gameConfig: {
                duration: 60,
                words: ['AMOR', 'BESO', 'MOTO', 'MILO', 'FLORES', 'TARAZA', 'MEDELLIN', 'MELISSA', 'CARLOS', 'REINA']
            }
        },
        // Days 23-24 are placeholders for Carlos to customize
        ...Array.from({length: 2}, (_, i) => ({
            day: i + 23,
            title: `Día ${i + 23} - Sorpresa`,
            emoji: "💖",
            letter: "Mi amor,\n\nSigue recuperándote y descansando. Te extraño mucho y te amo con todo mi corazón.\n\n¡Disfruta el juego de hoy!",
            funPhrase: "¡Pronto estaremos juntos! 🥰",
            recoveryQuote: "Un día menos para abrazarnos.",
            gameType: ['memory', 'wordsearch', 'trivia', 'puzzle', 'riddle'][Math.floor(Math.random() * 5)],
            gameConfig: {} // Default configs will be handled by games.js
        })),
        {
            day: 25,
            title: "Día 25 - 25 Rosas 🌹💐",
            emoji: "🌹",
            song: "musica/cancion25.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nSoy el último de todos tus amores, el que nunca te olvidó. Hoy te mando, aunque sea en este universo digital, veinticinco rosas, una por cada día que hemos compartido este camino juntos. Recíbelas, mi amor, no digas que no.\n\nSi algún día sientes frío en el corazón, recuerda que alguien te ama, que aquí sigo pensando en ti a cada hora del día. Este ramo es apenas una forma pequeña de decirte todo lo que siento.\n\nHoy te dejo un juego distinto: entre un jardín lleno de flores hay 25 rosas escondidas, y tienes que encontrarlas todas antes de que se acabe el tiempo, sin distraerte con las demás flores.\n\nTe amo infinito, mi amor, mi cómplice de vida. 💖",
            funPhrase: "Veinticinco rosas, veinticinco días, un solo amor 🌹💕",
            recoveryQuote: "Día 25: cinco días para el reencuentro, ¡ya casi!",
            gameType: 'rosehunt',
            gameConfig: {
                cols: 8,
                rows: 8,
                targetCount: 25,
                duration: 45
            }
        },
        {
            day: 26,
            title: "Día 26 - Andas en Mi Cabeza 🌀💗",
            emoji: "🌀",
            song: "musica/cancion26.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nAndas en mi cabeza a todas horas, cada segundo, cada minuto. El mundo me da vueltas, tú me descontrolas, y aunque intente hacerme el fuerte, no puedo fingir que no pienso en ti todo el tiempo.\n\nMe la paso imaginando que ya estamos juntos, que nos casamos y que te amé para siempre. Si un día te fueras, quedaría como arena en el viento, sin rumbo. Por eso te cuido, te espero y te amo con todo lo que tengo.\n\nHoy te dejo un juego de puntería y de tiempo: una cañita que se mueve sola de un lado a otro, y tienes que presionar justo en el momento en que esté sobre el corazón para atraparlo. Entre más rápidos sean tus reflejos, más corazones pescas.\n\nTe amo infinito, mi amor, mi cómplice de vida. 💖",
            funPhrase: "Andas en mi cabeza, nena, a todas horas 🌀💕",
            recoveryQuote: "Día 26: cada minuto pensando en volver a verte.",
            gameType: 'fishing',
            gameConfig: {
                columns: 6,
                duration: 45
            }
        },
        {
            day: 27,
            title: "Día 27 - Vivo Pensando en Ti 💭💗",
            emoji: "💭",
            song: "musica/cancion27.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nVivo pensando en ti, y sé que no es normal pensar tanto en una sola persona, pero no lo puedo controlar. Ya te sueño, ya te extraño, y todo lo que siento por ti no cabe en palabras.\n\nEres mi princesa, mi locura, mi refugio, lo que anhelo, mi mundo entero. Me gustas tú, te gusto yo, y solo falta que sigamos construyendo esto juntos, por siempre.\n\nHoy te dejo un juego de saltos: un corazón que corre solo y tiene que esquivar obstáculos saltando en el momento justo. Entre más lejos llegues, más rápido se pone, así que afina esos reflejos.\n\nTe amo infinito, mi amor, mi cómplice de vida. 💖",
            funPhrase: "Vivo pensando en ti, y no me importa que no sea normal 💭💕",
            recoveryQuote: "Día 27: tres días para el reencuentro, ¡ya casi, mi amor!",
            gameType: 'runnerjump',
            gameConfig: {}
        },
        // Day 28 is a placeholder for Carlos to customize
        ...Array.from({length: 1}, (_, i) => ({
            day: i + 28,
            title: `Día ${i + 28} - Sorpresa`,
            emoji: "💖",
            letter: "Mi amor,\n\nSigue recuperándote y descansando. Te extraño mucho y te amo con todo mi corazón.\n\n¡Disfruta el juego de hoy!",
            funPhrase: "¡Pronto estaremos juntos! 🥰",
            recoveryQuote: "Un día menos para abrazarnos.",
            gameType: ['memory', 'wordsearch', 'trivia', 'puzzle', 'riddle'][Math.floor(Math.random() * 5)],
            gameConfig: {} // Default configs will be handled by games.js
        })),
        {
            day: 29,
            title: "Día 29 - Balas Perdidas 💘",
            emoji: "💘",
            song: "musica/cancion29.mp3",
            letter: "¡Mi amor, mi reina hermosa!\n\nDicen que uno nunca ve venir una bala perdida, que llega sin avisar y ya no hay cómo escapar de ella. Así me pasó contigo: no la vi venir, y desde entonces no hay forma de sacarte de mi cuerpo, de mi mente, de mi vida entera.\n\nY qué bueno que así fue, porque prefiero mil veces quedar herido de este amor que nunca haberte conocido. Que sigan llegando esas balas perdidas, mi amor, que yo no pienso esquivarlas.\n\nMañana es el último día de este universo que armé para ti, y aunque este capítulo se termine, lo nuestro apenas está comenzando. Hoy te dejo un juego de esquivar: un corazón que tienes que mover para sobrevivir el mayor tiempo posible entre las balas que van cayendo. Entre más tiempo aguantes, más rápido se ponen.\n\nTe amo infinito, mi amor, mi cómplice de vida. 💖",
            funPhrase: "No pienso esquivar esta bala perdida llamada amor 💘",
            recoveryQuote: "Día 29: un día más para volver a abrazarte, ¡ya casi!",
            gameType: 'dodgebullets',
            gameConfig: {}
        },
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
