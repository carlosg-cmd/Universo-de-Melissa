// ===================================================================
//  UNIVERSO MELISA - 30 Days of Content
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
            song: "musica/cancion5.mp3",
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
        // Days 6-29 are placeholders for Carlos to customize
        ...Array.from({length: 24}, (_, i) => ({
            day: i + 6,
            title: `Día ${i + 6} - Sorpresa`,
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
