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
                    { q: '¿A cuál de estos lugares hemos ido?', options: ['Santa Elmo', 'París', 'Roma', 'Miami'], correct: 0, explanation: '¡A Santa Elmo!' },
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
                    { q: 'La maniguita que me diste me la diste en el éxito.', options: ['Verdadero', 'Falso'], correct: 1, explanation: 'Falso, no fue ahí.' },
                    { q: 'Alquilé una sala de cine solo para los dos.', options: ['Falso', 'Verdadero'], correct: 1, explanation: '¡Lo hice por ti!' },
                    { q: 'Por eso las operan.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nuestra frase.' },
                    { q: 'Morat es de nuestros cantantes favoritos.', options: ['Verdadero', 'Falso'], correct: 0, explanation: 'Nos encantan.' }
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
                image: 'nosotros.jpg',
                gridSize: 3,
                fallbackEmoji: '💕'
            }
        },
        {
            day: 5,
            title: "Día 5 - Un acertijo",
            emoji: "❓",
            letter: "Hola mi amor,\n\nHoy quise ponerme un poco misterioso y preparé una adivinanza para ti. Eres lo más bonito que me ha pasado y me encanta verte sonreír, incluso si es a través de una pantalla.\n\nYa falta menos para volver a vernos.\n\nTe amo con todo mi ser.",
            funPhrase: "Las cicatrices son tatuajes de valentía ⚡",
            recoveryQuote: "Cada día estás más fuerte.",
            gameType: 'riddle',
            gameConfig: {
                riddle: 'Soy invisible pero me sientes, no tengo forma pero lleno tu pecho. ¿Qué soy?',
                answer: 'amor',
                hint: 'Es lo que siento por ti.'
            }
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
