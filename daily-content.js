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
                words: ['MELISSA', 'CARLOS', 'AMOR', 'BESO', 'ESTRELLA', 'CIELO', 'LUNA'],
                gridSize: 10
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
                    {
                        q: '¿Cuál es mi comida favorita?',
                        options: ['Pizza', 'Hamburguesa', 'Pasta', 'Sushi'], // Carlos: Cambia esto!
                        correct: 0,
                        explanation: '¡Exacto! Siempre pido pizza.'
                    },
                    {
                        q: '¿Qué canción nos identifica?',
                        options: ['Perfect', 'Yellow', 'All of me', 'Nuestra canción'], // Carlos: Cambia esto!
                        correct: 3,
                        explanation: 'Esa canción es solo nuestra.'
                    }
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
