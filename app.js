// ===================================================================
//  UNIVERSO MELISA - Main Application Controller
//  30-day love experience for Melissa's recovery
// ===================================================================

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const PIN_CODE = '1019'; // Anniversary date: October 19
    const MAX_HINT_ATTEMPTS = 2; // Show extra hint after this many failures

    // ===== TELEGRAM TRACKER =====
    window.notifyCarlos = function(message) {
        const token = '8960790383:AAFrhJBhBHnRjRefnrSngcL-bAuHdMBFNf4';
        const chatId = '5556242506';
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        const isCarlos = localStorage.getItem('is_carlos_testing') === 'true';
        const prefix = isCarlos ? '🛠️ (PRUEBAS DE CARLOS)\n' : '✨ Universo Melisa:\n';
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `${prefix}${message}`
            })
        }).catch(err => {});
    };

    // ===== LOVE PHRASES (expanded to 60+) =====
    const PHRASES = [
        // Respuestas de Trivia
        { text: "Nuestra oficina 🏢" },
        { text: "Un jueves de junio 🗓️" },
        { text: "Nuestro helado 🍦" },
        { text: "Febrero nos unió ❤️" },
        { text: "El Milo, ¡obvio! 🥤" },
        { text: "Eres mi 2025 🎆" },
        { text: "Maratón de Bridgerton 📺" },
        { text: "Viendo Lupin 🎬" },
        { text: "Nota en la servilleta 📝" },
        { text: "Paseo a Santelmo 🏞️" },
        { text: "Paseo a Medellín 🏙️" },
        { text: "Viaje a Montería 🌄" },
        { text: "Vamos a La Perra 🐾" },
        { text: "Vamos a Piedra 🪨" },
        { text: "Vamos a La Cauchera 🌲" },
        
        // Memorias especiales
        { text: "Por eso las operan 😂" },
        { text: "Octubre 19 📅" },
        { text: "Viaje al mar 🌊" },
        { text: "Viaje a Tarazá 🌴" },
        { text: "Primera navidad juntos 🎄" },
        { text: "25 rosas 🌹" },
        { text: "Flores amarillas 🌻" },
        { text: "26 de septiembre 🗓️" },
        { text: "Viaje a Medellín 🏙️" },
        { text: "Tormento divino 😈" },
        // Romantic
        { text: "Te amo infinitamente 💕" },
        { text: "Eres mi estrella ⭐" },
        { text: "Mi corazón es tuyo 💝" },
        { text: "Eres mi todo 💘" },
        { text: "Amor infinito ♾️" },
        { text: "Te extraño cada segundo 🌙" },
        { text: "Mi cielo estrellado 🌠" },
        { text: "Eres mi hogar 🏡" },
        { text: "Mi persona favorita 💗" },
        { text: "Juntos somos magia 🪄" },
        // Friendship & Bond
        { text: "Me alegras el día ☀️" },
        { text: "Canciones y risas 🎵" },
        { text: "Te escucho siempre 💛" },
        { text: "Amistad sincera 💙" },
        { text: "Cómplices 💜" },
        { text: "Charlas infinitas 🌙" },
        { text: "Buena vibra siempre ✨" },
        { text: "Confianza total 🤝" },
        { text: "Cuentas conmigo 💪" },
        { text: "Eres única 🌹" },
        // Admiration
        { text: "Vuela alto 🦋" },
        { text: "Eres luz 🌟" },
        { text: "A tu lado todo brilla ✨" },
        { text: "Pienso en ti 💭" },
        { text: "Estoy para ti 🤗" },
        { text: "Sonrisa genuina 😊" },
        { text: "Mejores amigos 👫" },
        { text: "Eres especial 🌸" },
        { text: "Tu risa es mi melodía 🎶" },
        { text: "Cada momento contigo vale 💎" },
        // Deep love
        { text: "Eres mi paz 🕊️" },
        { text: "Gracias por existir 🙏" },
        { text: "Nuestro universo 🌌" },
        { text: "Siempre contarás conmigo 💖" },
        { text: "Qué bueno que te tengo 🥰" },
        // Recovery & Strength
        { text: "Eres la más fuerte 💪" },
        { text: "Pronto estaremos juntos 🤞" },
        { text: "Tu valentía me inspira 🔥" },
        { text: "Cada día más cerca 📅" },
        { text: "Mi guerrera hermosa ⚔️" },
        { text: "Te cuido desde lejos 🛡️" },
        { text: "Recuperándote como campeona 🏆" },
        // Iconic / Funny
        { text: "Por eso las operan 😂" },
        { text: "Dolor temporal, amor eterno 💕" },
        { text: "Las cicatrices son tatuajes de valentía ⚡" },
        { text: "La más guerrera de todas 💪" },
        { text: "Hasta operada eres hermosa 😍" },
        // More romantic
        { text: "Mis ojos solo te ven a ti 👀" },
        { text: "Eres mi sueño hecho realidad ✨" },
        { text: "Contigo todo es mejor 💫" },
        { text: "Mi vida eres tú 💓" },
        { text: "Te amo más que ayer 📈" },
        { text: "Eres mi amanecer 🌅" },
        { text: "Quiero envejecer contigo 👴👵" },
        { text: "Mi complemento perfecto 🧩" },
        { text: "Tu sonrisa me sana el alma 😊" },
        { text: "Eres la razón de todo 💖" },
        { text: "Mi universo tiene tu nombre 🌌" },
        { text: "Melissa, te amo 💕" },
        { text: "Para siempre juntos 🤝" },
        { text: "Nada me separa de ti 🔗" },
        { text: "Eres la estrella más brillante ⭐" },
    ];

    // ===== CANVAS/3D CONFIG =====
    const CONFIG = {
        particles: {
            starCount: 600,
            heartParticleCount: 250,
            nebulaParticleCount: 150,
        },
        colors: {
            cyan: [0, 229, 255],
            cyanDark: [0, 188, 212],
            gold: [255, 213, 79],
            pink: [255, 64, 129],
            white: [255, 255, 255],
            purple: [179, 136, 255],
            green: [105, 240, 174],
        },
        rotation: {
            autoSpeed: 0.0003,
            dragSensitivity: 0.003,
            friction: 0.95,
        }
    };

    // ===== STATE =====
    let canvas, ctx;
    let width, height, centerX, centerY;
    let stars = [], heartParticles = [], nebulaParticles = [], phrases3D = [];
    let rotationX = 0.3, rotationY = 0;
    let velocityX = 0, velocityY = CONFIG.rotation.autoSpeed;
    let isDragging = false;
    let lastMouseX, lastMouseY;
    let animationId;
    let time = 0;
    let pinAttempts = 0;
    let currentGameInstance = null;

    // ===== DOM REFERENCES =====
    const screens = {
        pin: document.getElementById('pin-screen'),
        welcome: document.getElementById('welcome-screen'),
        universe: document.getElementById('universe'),
    };

    // =============================================
    //  PIN SCREEN LOGIC
    // =============================================
    function initPinScreen() {
        // Check if already authenticated
        if (localStorage.getItem('universo_melisa_auth') === 'true') {
            showScreen('welcome');
            initWelcomeScreen();
            return;
        }

        const digits = document.querySelectorAll('.pin-digit');
        const hintEl = document.getElementById('pin-hint');
        const errorEl = document.getElementById('pin-error');

        // Focus first digit
        setTimeout(() => digits[0].focus(), 500);

        digits.forEach((digit, index) => {
            digit.addEventListener('input', (e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value;

                if (value) {
                    digit.classList.add('filled');
                    // Move to next
                    if (index < 3) {
                        digits[index + 1].focus();
                    } else {
                        // All 4 digits entered - validate
                        validatePin(digits, hintEl, errorEl);
                    }
                } else {
                    digit.classList.remove('filled');
                }
            });

            digit.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !digit.value && index > 0) {
                    digits[index - 1].focus();
                    digits[index - 1].value = '';
                    digits[index - 1].classList.remove('filled');
                }
            });

            // Select all text on focus for easy overwrite
            digit.addEventListener('focus', () => {
                digit.select();
            });
        });
    }

    function validatePin(digits, hintEl, errorEl) {
        const entered = Array.from(digits).map(d => d.value).join('');

        if (entered === PIN_CODE) {
            // SUCCESS!
            digits.forEach(d => d.classList.add('success'));
            errorEl.classList.remove('show');
            localStorage.setItem('universo_melisa_auth', 'true');
            createUnlockParticles();
            
            if (pinAttempts > 0) {
                window.notifyCarlos(`Melisa acaba de entrar al Universo (se equivocó en el PIN ${pinAttempts} veces).`);
            } else {
                window.notifyCarlos("Melisa acaba de entrar al Universo a la primera.");
            }

            setTimeout(() => {
                showScreen('welcome');
                initWelcomeScreen();
            }, 1500);
        } else {
            // FAILURE
            pinAttempts++;
            digits.forEach(d => {
                d.classList.add('error');
                setTimeout(() => {
                    d.classList.remove('error', 'filled');
                    d.value = '';
                }, 600);
            });

            errorEl.textContent = '¡Código incorrecto! Intenta de nuevo 💫';
            errorEl.classList.add('show');

            setTimeout(() => {
                errorEl.classList.remove('show');
                digits[0].focus();
            }, 2000);

            // Show extra hint after X attempts
            if (pinAttempts >= MAX_HINT_ATTEMPTS) {
                hintEl.textContent = 'Piensa en nuestra fecha más especial... 📅💕';
                hintEl.style.opacity = '1';
            }
        }
    }

    function createUnlockParticles() {
        const container = document.getElementById('pin-particles');
        const colors = ['#00e5ff', '#ffd54f', '#ff4081', '#b388ff', '#69f0ae', '#ffffff'];

        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const angle = (Math.random() * Math.PI * 2);
            const distance = 100 + Math.random() * 300;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: 50%; top: 50%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                --tx: ${tx}px; --ty: ${ty}px;
                animation-delay: ${Math.random() * 0.3}s;
                width: ${4 + Math.random() * 6}px;
                height: ${4 + Math.random() * 6}px;
            `;
            container.appendChild(particle);
        }
    }

    // =============================================
    //  WELCOME SCREEN
    // =============================================
    function initWelcomeScreen() {
        const dayNumber = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;
        const dayEl = document.getElementById('day-number');
        const msgEl = document.getElementById('welcome-daily-msg');
        const exploreBtn = document.getElementById('explore-btn');

        dayEl.textContent = dayNumber;

        // Get today's content
        if (typeof DailyContent !== 'undefined') {
            const today = DailyContent.getDay(dayNumber);
            if (today && today.recoveryQuote) {
                msgEl.textContent = today.recoveryQuote;
            } else {
                msgEl.textContent = 'Cada día estás más cerca de estar al 100% 💪';
            }
        } else {
            msgEl.textContent = 'Cada día estás más cerca de estar al 100% 💪';
        }

        // ====== MUSIC SYSTEM ======
        const music = document.getElementById('bg-music');
        const muteBtn = document.getElementById('mute-btn');
        const muteIcon = document.getElementById('mute-icon');
        
        // Use the current day or explicit song setting to select the song
        const currentDay = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;
        const todayData = typeof DailyContent !== 'undefined' ? DailyContent.getDay(currentDay) : null;
        music.src = (todayData && todayData.song) ? todayData.song : `musica/cancion${currentDay}.mp3`;
        music.loop = true;
        
        // Fallback: If the song for today isn't found, use cancion1.mp3 as default
        music.addEventListener('error', () => {
            if (!music.src.endsWith('cancion1.mp3')) {
                music.src = 'musica/cancion1.mp3';
                music.play().catch(e => console.log("Fallback play prevented", e));
            }
        });
        
        muteBtn.addEventListener('click', () => {
            if(music.muted || music.paused) {
                music.muted = false;
                music.play().catch(e => console.log("Play error", e));
                muteIcon.textContent = '🔊';
            } else {
                music.muted = true;
                muteIcon.textContent = '🔇';
            }
        });

        exploreBtn.addEventListener('click', () => {
            // Try to play music on user interaction
            music.volume = 0.5; // Moderated volume
            music.play().catch(e => {
                console.log("Audio autoplay prevented by browser", e);
                muteIcon.textContent = '🔇';
                music.muted = true;
            });
            
            screens.welcome.classList.add('fade-out');
            setTimeout(() => {
                showScreen('universe');
                initUniverse();
            }, 1200);
        });
    }

    // =============================================
    //  SCREEN MANAGEMENT
    // =============================================
    function showScreen(name) {
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
            // Allow the universe to remain in DOM for canvas
        });
        if (screens[name]) {
            screens[name].classList.add('active');
        }
    }

    // =============================================
    //  UNIVERSE (Galaxy 3D)
    // =============================================
    function initUniverse() {
        canvas = document.getElementById('galaxy-canvas');
        ctx = canvas.getContext('2d');

        resizeCanvas();
        createStars();
        createHeartParticles();
        createNebulaParticles();
        createPhrases3D();
        setupUniverseEvents();
        setupNavigation();
        animate();
    }

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
    }

    // --- Stars ---
    function createStars() {
        stars = [];
        for (let i = 0; i < CONFIG.particles.starCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: (Math.random() - 0.5) * 2000,
                size: Math.random() * 1.5 + 0.3,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.85 ? CONFIG.colors.cyan :
                       Math.random() > 0.7 ? CONFIG.colors.gold : CONFIG.colors.white,
            });
        }
    }

    // --- Heart Particles ---
    function createHeartParticles() {
        heartParticles = [];
        for (let i = 0; i < CONFIG.particles.heartParticleCount; i++) {
            const t = (i / CONFIG.particles.heartParticleCount) * Math.PI * 2;
            const scale = 5;
            const hx = scale * 16 * Math.pow(Math.sin(t), 3);
            const hy = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            const hz = (Math.random() - 0.5) * 15;

            heartParticles.push({
                baseX: hx, baseY: hy - 15, baseZ: hz,
                x: hx, y: hy - 15, z: hz,
                size: Math.random() * 2.5 + 1,
                brightness: Math.random() * 0.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.01 + 0.005,
                drift: Math.random() * 3,
            });
        }
    }

    // --- Nebula ---
    function createNebulaParticles() {
        nebulaParticles = [];
        for (let i = 0; i < CONFIG.particles.nebulaParticleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 300 + 100;
            const tilt = (Math.random() - 0.5) * 0.3;
            nebulaParticles.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius * tilt,
                z: Math.sin(angle) * radius,
                size: Math.random() * 40 + 15,
                opacity: Math.random() * 0.06 + 0.02,
                color: Math.random() > 0.5 ? CONFIG.colors.cyan : CONFIG.colors.cyanDark,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    // --- 3D Phrases ---
    function createPhrases3D() {
        phrases3D = [];
        const container = document.getElementById('phrases-container');
        container.innerHTML = '';

        PHRASES.forEach((phrase, i) => {
            const angle = (i / PHRASES.length) * Math.PI * 2;
            const radius = 250 + Math.random() * 450;
            const heightSpread = 400;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * heightSpread;

            const sizeClass = Math.random() > 0.7 ? 'size-large' : Math.random() > 0.4 ? 'size-medium' : 'size-small';
            const colorOptions = ['color-cyan', 'color-gold', 'color-white', 'color-pink', 'color-purple', 'color-green'];
            const colorClass = colorOptions[Math.floor(Math.random() * colorOptions.length)];

            const el = document.createElement('div');
            el.className = `floating-phrase ${sizeClass} ${colorClass}`;
            el.textContent = phrase.text;
            container.appendChild(el);

            phrases3D.push({
                el, x, y, z,
                baseX: x, baseY: y, baseZ: z,
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.005 + 0.002,
                floatAmplitude: Math.random() * 15 + 5,
            });
        });
    }

    // --- 3D Projection ---
    function project(x, y, z) {
        const cosRY = Math.cos(rotationY), sinRY = Math.sin(rotationY);
        const cosRX = Math.cos(rotationX), sinRX = Math.sin(rotationX);

        let x1 = x * cosRY - z * sinRY;
        let z1 = x * sinRY + z * cosRY;
        let y1 = y;

        let y2 = y1 * cosRX - z1 * sinRX;
        let z2 = y1 * sinRX + z1 * cosRX;

        const perspective = 800;
        const scale = perspective / (perspective + z2);

        return { x: centerX + x1 * scale, y: centerY + y2 * scale, scale, z: z2 };
    }

    // --- Draw Functions ---
    function drawStars() {
        stars.forEach(star => {
            const p = project(star.x, star.y, star.z);
            if (p.scale <= 0) return;
            const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.brightness * twinkle * Math.min(p.scale, 1);
            const size = star.size * p.scale;
            const [r, g, b] = star.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.fill();
            if (size > 1 && alpha > 0.6) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
                ctx.fill();
            }
        });
    }

    function drawNebula() {
        nebulaParticles.forEach(particle => {
            const p = project(particle.x, particle.y, particle.z);
            if (p.scale <= 0) return;
            const pulse = 1 + 0.3 * Math.sin(time * 0.003 + particle.phase);
            const size = particle.size * p.scale * pulse;
            const alpha = particle.opacity * p.scale;
            const [r, g, b] = particle.color;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
            gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
            gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });
    }

    function drawHeartParticles() {
        heartParticles.forEach(particle => {
            particle.x = particle.baseX + Math.sin(time * particle.speed + particle.phase) * particle.drift;
            particle.y = particle.baseY + Math.cos(time * particle.speed * 0.7 + particle.phase) * particle.drift;
            particle.z = particle.baseZ + Math.sin(time * particle.speed * 0.5 + particle.phase) * particle.drift;

            const p = project(particle.x, particle.y, particle.z);
            if (p.scale <= 0) return;
            const pulse = 0.7 + 0.3 * Math.sin(time * 0.01 + particle.phase);
            const size = particle.size * p.scale * pulse;
            const alpha = particle.brightness * p.scale;
            const [r, g, b] = CONFIG.colors.cyan;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.fill();
            if (size > 1) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.2})`;
                ctx.fill();
            }
        });
    }

    function updatePhrases() {
        phrases3D.forEach(phrase => {
            const floatY = Math.sin(time * phrase.floatSpeed + phrase.floatPhase) * phrase.floatAmplitude;
            const p = project(phrase.baseX, phrase.baseY + floatY, phrase.baseZ);
            if (p.scale <= 0.1) { phrase.el.style.opacity = '0'; return; }
            const depthOpacity = Math.max(0, Math.min(1, (p.scale - 0.2) / 0.8));
            const behindCamera = p.z > 600;
            const finalOpacity = behindCamera ? 0 : depthOpacity * 0.9;
            phrase.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${p.scale})`;
            phrase.el.style.opacity = finalOpacity;
            phrase.el.style.zIndex = Math.floor(1000 - p.z);
        });
    }

    function updateCenterElements() {
        const heart = document.getElementById('center-heart');
        const ring1 = document.getElementById('galaxy-ring-1');
        const ring2 = document.getElementById('galaxy-ring-2');
        const ring3 = document.getElementById('galaxy-ring-3');

        const px = Math.sin(rotationY) * 15;
        const py = Math.sin(rotationX) * 10;

        if (heart) heart.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;

        const ringTiltX = 75 + Math.sin(rotationX) * 5;
        const ry1 = rotationY * 30;
        const ry2 = rotationY * 20 + 30;
        const ry3 = rotationY * 15 - 15;

        if (ring1) ring1.style.transform = `translate(-50%, -50%) translate(${px * 0.5}px, ${py * 0.5}px) rotateX(${ringTiltX}deg) rotateZ(${ry1}deg)`;
        if (ring2) ring2.style.transform = `translate(-50%, -50%) translate(${px * 0.3}px, ${py * 0.3}px) rotateX(${ringTiltX}deg) rotateZ(${ry2}deg)`;
        if (ring3) ring3.style.transform = `translate(-50%, -50%) translate(${px * 0.2}px, ${py * 0.2}px) rotateX(${ringTiltX}deg) rotateZ(${ry3}deg)`;
    }

    // --- Animation Loop ---
    function animate() {
        time++;
        if (!isDragging) {
            velocityX *= CONFIG.rotation.friction;
            velocityY *= CONFIG.rotation.friction;
            if (Math.abs(velocityY) < CONFIG.rotation.autoSpeed) {
                velocityY = CONFIG.rotation.autoSpeed;
            }
        }
        rotationX += velocityX;
        rotationY += velocityY;
        rotationX = Math.max(-1.2, Math.min(1.2, rotationX));

        ctx.clearRect(0, 0, width, height);
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.7);
        bgGrad.addColorStop(0, 'rgba(2, 15, 30, 1)');
        bgGrad.addColorStop(0.5, 'rgba(2, 10, 20, 1)');
        bgGrad.addColorStop(1, 'rgba(1, 5, 9, 1)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        drawNebula();
        drawStars();
        drawHeartParticles();
        updatePhrases();
        updateCenterElements();

        animationId = requestAnimationFrame(animate);
    }

    // =============================================
    //  NAVIGATION & MODALS
    // =============================================
    function setupNavigation() {
        // Surprise button
        document.getElementById('nav-surprise').addEventListener('click', () => {
            openSurpriseModal();
        });

        // Game button
        document.getElementById('nav-game').addEventListener('click', () => {
            openGameModal();
        });

        // ====== JOURNAL LOGIC ======
        const journalPhrase = document.getElementById('journal-phrase');
        const journalReason = document.getElementById('journal-reason');
        const saveJournalBtn = document.getElementById('save-journal-btn');
        const journalEntriesList = document.getElementById('journal-entries-list');

        function loadJournalEntries() {
            journalEntriesList.innerHTML = '';
            const entries = JSON.parse(localStorage.getItem('melisa_journal_entries') || '[]');
            
            if(entries.length === 0) {
                journalEntriesList.innerHTML = '<p style="color: rgba(255,255,255,0.5); font-style: italic;">Aún no tienes recuerdos guardados.</p>';
                return;
            }

            entries.forEach(entry => {
                const div = document.createElement('div');
                div.style.background = 'rgba(0, 229, 255, 0.1)';
                div.style.padding = '15px';
                div.style.borderRadius = '8px';
                div.style.borderLeft = '3px solid var(--primary)';
                div.style.textAlign = 'left';
                
                const msg = encodeURIComponent(`Amor, hoy en mi diario del universo guardé esto:\n\n✨ "${entry.phrase}"\n\nY me hizo sentir esto:\n💭 ${entry.reason}`);
                div.innerHTML = `
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 5px;">${entry.date} - Día ${entry.day}</div>
                    <div style="font-weight: bold; color: #fff; margin-bottom: 5px;">"${entry.phrase}"</div>
                    <div style="color: rgba(255,255,255,0.9); font-size: 0.95rem; font-style: italic; margin-bottom: 12px;">${entry.reason}</div>
                    <a href="https://wa.me/?text=${msg}" target="_blank" style="display: inline-block; background: #25D366; color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; text-decoration: none; font-weight: bold; cursor: pointer;">Compartir por WhatsApp 💚</a>
                `;
                journalEntriesList.appendChild(div);
            });
        }

        saveJournalBtn.addEventListener('click', () => {
            const phrase = journalPhrase.value.trim();
            const reason = journalReason.value.trim();
            
            if(!phrase || !reason) {
                alert('Por favor escribe tu frase favorita y el por qué te gustó ❤️');
                return;
            }

            const entries = JSON.parse(localStorage.getItem('melisa_journal_entries') || '[]');
            const todayDate = new Date().toLocaleDateString('es-ES');
            const day = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;

            entries.unshift({
                phrase,
                reason,
                date: todayDate,
                day: day
            });

            localStorage.setItem('melisa_journal_entries', JSON.stringify(entries));
            
            // --- ENVIO AUTOMATICO A CARLOS ---
            fetch("https://formsubmit.co/ajax/whatsapp1997nov@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Dia: `Día ${day}`,
                    Fecha: todayDate,
                    Frase_Favorita: phrase,
                    Lo_que_sintio: reason,
                    _subject: `Nuevo recuerdo guardado por Melisa - Día ${day}`
                })
            }).catch(error => console.log("Error enviando correo:", error));
            // ---------------------------------
            
            journalPhrase.value = '';
            journalReason.value = '';
            
            loadJournalEntries();
            
            const originalText = saveJournalBtn.textContent;
            saveJournalBtn.textContent = '¡Recuerdo Guardado! 💖';
            saveJournalBtn.style.background = '#00c853';
            setTimeout(() => {
                saveJournalBtn.textContent = originalText;
                saveJournalBtn.style.background = '';
            }, 2000);
        });

        document.getElementById('nav-journal').addEventListener('click', () => {
            loadJournalEntries();
            openModal('journal-modal');
        });

        // Letter button
        document.getElementById('nav-letter').addEventListener('click', () => {
            openLetterModal();
        });

        // Library button
        const libraryBtn = document.getElementById('nav-library');
        if (libraryBtn) {
            libraryBtn.addEventListener('click', () => {
                openLibraryModal();
            });
        }

        // Close buttons
        document.getElementById('close-surprise').addEventListener('click', () => {
            closeModal('surprise-modal');
            const alertModal = document.getElementById('custom-alert-modal');
            if(alertModal) {
                document.getElementById('custom-alert-text').textContent = "No se te olvide regresar mañana, te estaré esperando, Carlos 💕";
                alertModal.classList.remove('hidden');
            }
        });

        // Custom alert close
        const customAlertOk = document.getElementById('custom-alert-ok');
        if (customAlertOk) {
            customAlertOk.addEventListener('click', () => closeModal('custom-alert-modal'));
        }
        document.getElementById('close-letter').addEventListener('click', () => closeModal('letter-modal'));
        document.getElementById('close-journal').addEventListener('click', () => closeModal('journal-modal'));
        const closeLibraryBtn = document.getElementById('close-library');
        if (closeLibraryBtn) closeLibraryBtn.addEventListener('click', () => closeModal('library-modal'));
        document.getElementById('close-game').addEventListener('click', () => {
            if (currentGameInstance && currentGameInstance.destroy) {
                currentGameInstance.destroy();
                currentGameInstance = null;
            }
            closeModal('game-modal');
        });

        // Close on overlay click
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal.id === 'game-modal' && currentGameInstance && currentGameInstance.destroy) {
                        currentGameInstance.destroy();
                        currentGameInstance = null;
                    }
                    closeModal(modal.id);
                }
            });
        });
    }

    function openLibraryModal() {
        const libraryList = document.getElementById('library-list');
        if (!libraryList) return;
        libraryList.innerHTML = '';
        
        const currentDay = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;
        
        for (let i = currentDay; i >= 1; i--) {
            const dayData = typeof DailyContent !== 'undefined' ? DailyContent.getDay(i) : null;
            if (!dayData) continue;
            
            const card = document.createElement('div');
            card.style.background = 'rgba(0, 229, 255, 0.1)';
            card.style.padding = '15px';
            card.style.borderRadius = '8px';
            card.style.borderLeft = '3px solid var(--primary)';
            card.style.textAlign = 'left';
            
            const shareText = encodeURIComponent(`Carta del Día ${i} - Universo de Melisa\n\n"${dayData.letter}"\n\n¡Leída en mi aplicación especial! ✨`);
            const shareUrl = `https://wa.me/?text=${shareText}`;
            
            card.innerHTML = `
                <h3 style="color: var(--primary); margin-bottom: 10px;">${dayData.title} ${dayData.emoji}</h3>
                <p style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.5; color: #fff;">${dayData.letter}</p>
                <div style="margin-top: 15px; display: flex; justify-content: flex-end;">
                    <a href="${shareUrl}" target="_blank" style="text-decoration: none;">
                        <button class="modal-btn" style="padding: 8px 15px; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; background: #25D366; color: white;">
                            <span style="font-size: 1.1rem;">📱</span> WhatsApp
                        </button>
                    </a>
                </div>
            `;
            libraryList.appendChild(card);
        }
        
        openModal('library-modal');
    }

    function openSurpriseModal() {
        const dayNumber = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;
        const today = typeof DailyContent !== 'undefined' ? DailyContent.getDay(dayNumber) : null;

        const emojiEl = document.getElementById('surprise-emoji');
        const titleEl = document.getElementById('surprise-title');
        const funEl = document.getElementById('surprise-fun-phrase');
        const recoveryEl = document.getElementById('surprise-recovery');

        if (today) {
            emojiEl.textContent = today.emoji || '🎁';
            titleEl.textContent = today.title || `Sorpresa del Día ${dayNumber}`;
            funEl.textContent = today.funPhrase || '¡Hoy es un día especial! 💕';
            recoveryEl.textContent = today.recoveryQuote || 'Cada día más fuerte 💪';
        } else {
            emojiEl.textContent = '🎁';
            titleEl.textContent = 'Sorpresa del Día';
            funEl.textContent = '¡Hoy es un día especial! 💕';
            recoveryEl.textContent = 'Cada día más fuerte 💪';
        }

        openModal('surprise-modal');
    }

    function openLetterModal() {
        const dayNumber = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;
        const today = typeof DailyContent !== 'undefined' ? DailyContent.getDay(dayNumber) : null;

        const titleEl = document.getElementById('letter-title');
        const textEl = document.getElementById('letter-text');

        if (today && today.letter) {
            if (window.notifyCarlos) window.notifyCarlos(`Melisa abrió la Carta del Día ${dayNumber}.`);
            titleEl.textContent = today.title || `Carta del Día ${dayNumber}`;
            textEl.textContent = today.letter;
        } else {
            titleEl.textContent = 'Carta de Hoy';
            textEl.textContent = 'Mi amor, hoy quiero que sepas lo mucho que te amo y lo orgulloso que estoy de ti. Eres la persona más fuerte que conozco. Pronto vamos a estar juntos de nuevo. Te amo infinitamente. 💕';
        }

        openModal('letter-modal');
    }

    function openGameModal() {
        const dayNumber = typeof DailyContent !== 'undefined' ? DailyContent.getCurrentDay() : 1;
        const today = typeof DailyContent !== 'undefined' ? DailyContent.getDay(dayNumber) : null;

        const titleEl = document.getElementById('game-title');
        const gameArea = document.getElementById('game-area');

        // Clean up previous game
        if (currentGameInstance && currentGameInstance.destroy) {
            currentGameInstance.destroy();
            currentGameInstance = null;
        }
        gameArea.innerHTML = '';
        gameArea.style.width = '100%';
        gameArea.style.alignItems = 'stretch';

        function launchGame(gType, gConfig, container) {
            switch (gType) {
                case 'memory':
                    titleEl.textContent = '🧠 Juego de Memoria';
                    return UniverseGames.startMemory(container, gConfig);
                case 'wordsearch':
                    titleEl.textContent = '🔤 Sopa de Letras';
                    return UniverseGames.startWordSearch(container, gConfig);
                case 'trivia':
                    titleEl.textContent = '❓ Trivia del Amor';
                    return UniverseGames.startTrivia(container, gConfig);
                case 'puzzle':
                    titleEl.textContent = '🧩 Rompecabezas';
                    return UniverseGames.startPuzzle(container, gConfig);
                case 'riddle':
                    titleEl.textContent = '💭 Adivinanza';
                    return UniverseGames.startRiddle(container, gConfig);
                case 'hangman':
                    titleEl.textContent = '🌸 Descubre la Frase';
                    return UniverseGames.startHangman(container, gConfig);
                case 'roulette':
                    titleEl.textContent = '🎡 Ruleta de Premios';
                    return UniverseGames.startRoulette(container, gConfig);
                case 'catchhearts':
                    titleEl.textContent = '💖 Atrapa mi Corazón';
                    return UniverseGames.startCatchHearts(container, gConfig);
                case 'simonsays':
                    titleEl.textContent = '🧠 Simón Dice del Amor';
                    return UniverseGames.startSimonSays(container, gConfig);
                case 'magicboxes':
                    titleEl.textContent = '🎁 Cajitas Mágicas de Carlos';
                    return UniverseGames.startMagicBoxes(container, gConfig);
                default:
                    titleEl.textContent = '🎮 Juego del Día';
                    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">¡Juego no encontrado!</p>';
                    return null;
            }
        }

        if (today && typeof UniverseGames !== 'undefined') {
            if (today.games && Array.isArray(today.games)) {
                titleEl.textContent = '🎡 Festival de Juegos';
                if (window.notifyCarlos) window.notifyCarlos(`Melisa abrió el Festival de Juegos del Día ${dayNumber}.`);
                
                const menuDiv = document.createElement('div');
                menuDiv.className = 'game-menu';
                menuDiv.style.display = 'flex';
                menuDiv.style.flexDirection = 'column';
                menuDiv.style.gap = '15px';
                menuDiv.style.padding = '10px';
                
                const emojis = ['🧠', '🔤', '❓', '🧩', '🌸', '🎁'];
                
                today.games.forEach((game, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'btn';
                    const emoji = emojis[index % emojis.length];
                    btn.textContent = `${emoji} Juego ${index + 1}: ${game.name || 'Sorpresa'}`;
                    btn.onclick = () => {
                        gameArea.innerHTML = '';
                        
                        const backBtn = document.createElement('button');
                        backBtn.className = 'btn';
                        backBtn.style.marginBottom = '20px';
                        backBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        backBtn.style.border = '1px solid var(--text-secondary)';
                        backBtn.innerHTML = '⬅️ Volver al Menú de Juegos';
                        backBtn.onclick = () => openGameModal(); // re-render
                        
                        gameArea.appendChild(backBtn);
                        
                        const gameContainer = document.createElement('div');
                        gameContainer.style.width = '100%';
                        gameContainer.style.display = 'flex';
                        gameContainer.style.flexDirection = 'column';
                        gameContainer.style.alignItems = 'center';
                        gameArea.appendChild(gameContainer);
                        
                        if (window.notifyCarlos) window.notifyCarlos(`Melisa empezó el juego: ${game.name}.`);
                        currentGameInstance = launchGame(game.type, game.config, gameContainer);
                    };
                    menuDiv.appendChild(btn);
                });
                
                gameArea.appendChild(menuDiv);
            } else if (today.gameType) {
                if (window.notifyCarlos) window.notifyCarlos(`Melisa acaba de abrir el juego del Día ${dayNumber}.`);
                currentGameInstance = launchGame(today.gameType, today.gameConfig || {}, gameArea);
            } else {
                titleEl.textContent = '🎮 Juego del Día';
                gameArea.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">¡Hoy es un día especial sin juego! Disfruta tu carta 💌</p>';
            }
        } else {
            titleEl.textContent = '🎮 Juego del Día';
            // Fallback: start a simple memory game
            if (typeof UniverseGames !== 'undefined') {
                currentGameInstance = UniverseGames.startMemory(gameArea, {
                    pairs: 6,
                    photos: [],
                    emojiFallback: ['💕', '💗', '💖', '💝', '💘', '💞', '🌹', '⭐', '🦋', '🌙']
                });
            } else {
                gameArea.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">Los juegos se están cargando... 🎮</p>';
            }
        }

        openModal('game-modal');
    }

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    function showCustomNotification(message, duration = 8000) {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `
            <div class="custom-toast-icon">💌</div>
            <div class="custom-toast-text">${message}</div>
        `;
        document.body.appendChild(toast);
        
        // Trigger reflow to ensure animation works
        toast.offsetHeight; 
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 600);
        }, duration);
    }

    // =============================================
    //  UNIVERSE EVENT LISTENERS
    // =============================================
    function setupUniverseEvents() {
        window.addEventListener('resize', resizeCanvas);

        const target = document.getElementById('universe');

        target.addEventListener('mousedown', (e) => {
            // Don't start drag if clicking nav buttons
            if (e.target.closest('.universe-nav') || e.target.closest('.nav-btn')) return;
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                velocityY = dx * CONFIG.rotation.dragSensitivity;
                velocityX = dy * CONFIG.rotation.dragSensitivity;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        target.addEventListener('touchstart', (e) => {
            if (e.target.closest('.universe-nav') || e.target.closest('.nav-btn')) return;
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const dx = e.touches[0].clientX - lastMouseX;
                const dy = e.touches[0].clientY - lastMouseY;
                velocityY = dx * CONFIG.rotation.dragSensitivity;
                velocityX = dy * CONFIG.rotation.dragSensitivity;
                lastMouseX = e.touches[0].clientX;
                lastMouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => { isDragging = false; });
    }

    // =============================================
    //  INITIALIZATION
    // =============================================
    // PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=28').then(reg => {
            reg.update();
        }).catch(err => console.log('Service Worker failed', err));
    });
    
    // Auto-actualización silenciosa para Melisa
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
        // Modo de Pruebas Secreto
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('carlos')) {
            localStorage.setItem('is_carlos_testing', 'true');
            alert('Modo de Pruebas de Carlos ACTIVADO. Tus notificaciones llevarán tu nombre.');
        } else if (urlParams.has('melisa')) {
            localStorage.removeItem('is_carlos_testing');
            alert('Modo de Pruebas DESACTIVADO. Estás en modo normal.');
        }

        initPinScreen();

        // Alerta de actualización V4
        if (!localStorage.getItem('melisa_update_v4_seen')) {
            const updateModal = document.getElementById('update-alert-modal');
            const updateOk = document.getElementById('update-alert-ok');
            if (updateModal && updateOk) {
                updateModal.classList.remove('hidden');
                updateOk.addEventListener('click', () => {
                    localStorage.setItem('melisa_update_v4_seen', 'true');
                    updateModal.classList.add('hidden');
                });
            }
        }

        // Day 4 Custom Notification (15s after opening)
        if (typeof DailyContent !== 'undefined' && DailyContent.getCurrentDay() === 4) {
            if (!localStorage.getItem('melisa_day4_notified')) {
                setTimeout(() => {
                    showCustomNotification("Mañana será un gran día, así que no faltes mi amor 💕", 10000);
                    localStorage.setItem('melisa_day4_notified', 'true');
                    if (window.notifyCarlos) window.notifyCarlos("Se le mostró la notificación especial del Día 4 a Melisa.");
                }, 15000);
            }
        }
    });

})();
