// ===================================================================
//  UNIVERSO MELISA - Games Module
//  Memory, Word Search, Trivia, Puzzle, Riddle
// ===================================================================

const UniverseGames = (function() {
    'use strict';

    // Helper to celebrate wins
    function celebrate(container, message) {
        const celeb = document.createElement('div');
        celeb.className = 'game-celebration';
        celeb.innerHTML = `<h3>¡Felicidades! 🎉</h3><p>${message}</p>`;
        container.appendChild(celeb);

        // Confetti
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'game-confetti';
        for(let i=0; i<50; i++) {
            const piece = document.createElement('div');
            piece.className = 'game-confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = ['#00e5ff', '#ffd54f', '#ff4081', '#b388ff', '#69f0ae'][Math.floor(Math.random() * 5)];
            piece.style.animationDelay = `${Math.random() * 2}s`;
            confettiContainer.appendChild(piece);
        }
        container.appendChild(confettiContainer);
    }

    // Array shuffle helper
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ==========================================
    // 1. MEMORY GAME
    // ==========================================
    function startMemory(container, config) {
        container.innerHTML = '';
        const pairsCount = config.pairs || 6;
        const emojis = config.emojiFallback || ['💕','💗','💖','💝','💘','💞','🌹','⭐'];
        const totalAvailablePhotos = config.maxPhotos || 199; // Maximum number of photos in folder to pick from
        
        // Randomly pick `pairsCount` photos from the available pool
        let possibleIndices = Array.from({length: totalAvailablePhotos}, (_, i) => i + 1);
        shuffleArray(possibleIndices);
        
        let items = [];
        for(let i=0; i<pairsCount; i++) {
            items.push(`foto (${possibleIndices[i]})`);
        }
        
        // Double items for pairs
        let cards = [...items, ...items];
        // Shuffle
        shuffleArray(cards);

        const statsDiv = document.createElement('div');
        statsDiv.className = 'game-stats';
        statsDiv.innerHTML = `<span>Movimientos: <span class="stat-value" id="mem-moves">0</span></span>`;
        container.appendChild(statsDiv);

        const grid = document.createElement('div');
        grid.className = 'game-memory-grid';
        grid.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(pairsCount*2))}, 1fr)`;
        
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        let moves = 0;
        let matches = 0;

        cards.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'game-memory-card';
            card.dataset.item = item;
            
            // Check if it's a photo or emoji
            let imgIndex = item.replace('foto (', '').replace(')', '');
            let emojiIndex = (parseInt(imgIndex) - 1) % emojis.length;
            
            // Using onerror to fallback to emoji if photo doesn't exist
            let frontContent = `<img src="fotos/${item}.jpeg" onerror="this.outerHTML='<span style=\\'font-size:3rem\\'>${emojis[emojiIndex]}</span>'" alt="foto">`;

            card.innerHTML = `
                <div class="game-memory-card-inner">
                    <div class="game-memory-card-back">✨</div>
                    <div class="game-memory-card-front">${frontContent}</div>
                </div>
            `;
            
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        
        // Add replay button
        const replayBtn = document.createElement('button');
        replayBtn.className = 'game-replay-btn';
        replayBtn.innerHTML = '🔄 Jugar de nuevo';
        replayBtn.onclick = () => startMemory(container, config);
        container.appendChild(replayBtn);

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;

            this.classList.add('flipped');

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            moves++;
            document.getElementById('mem-moves').textContent = moves;
            checkForMatch();
        }

        function checkForMatch() {
            let isMatch = firstCard.dataset.item === secondCard.dataset.item;

            if (isMatch) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                matches++;
                resetBoard();
                if (matches === pairsCount) {
                    if (window.notifyCarlos) window.notifyCarlos("🎮 Melisa acaba de ganar el Juego de Memoria.");
                    setTimeout(() => celebrate(container, `¡Lo lograste en ${moves} movimientos!`), 500);
                }
            } else {
                lockBoard = true;
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    resetBoard();
                }, 1000);
            }
        }

        function resetBoard() {
            [firstCard, secondCard, lockBoard] = [null, null, false];
        }

        return {
            destroy: () => { container.innerHTML = ''; },
            replay: () => startMemory(container, config)
        };
    }

    // ==========================================
    // 2. WORD SEARCH
    // ==========================================
    function startWordSearch(container, config) {
        container.innerHTML = '';
        
        // Randomize which words we pick if we have more than needed
        let allWords = config.words || ['MELISSA', 'CARLOS', 'AMOR', 'BESO', 'ESTRELLA', 'CIELO', 'LUNA'];
        shuffleArray(allWords);
        let selectedOriginalWords = allWords.slice(0, 10);
        let words = selectedOriginalWords.map(w => w.toUpperCase().replace(/\s+/g, ''));
        
        const size = config.gridSize || 16;
        let grid = Array(size).fill(null).map(() => Array(size).fill(''));
        let foundWords = new Set();
        
        // Basic word placement logic (horizontal, vertical, diagonal)
        const directions = [
            [0, 1], [1, 0], [1, 1], [-1, 1] // right, down, down-right, up-right
        ];

        function canPlace(word, r, c, dr, dc) {
            for(let i=0; i<word.length; i++) {
                let nr = r + i*dr, nc = c + i*dc;
                if(nr < 0 || nr >= size || nc < 0 || nc >= size) return false;
                if(grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
            }
            return true;
        }

        words.forEach(word => {
            let placed = false;
            let attempts = 0;
            while(!placed && attempts < 100) {
                attempts++;
                let r = Math.floor(Math.random() * size);
                let c = Math.floor(Math.random() * size);
                let dir = directions[Math.floor(Math.random() * directions.length)];
                
                if(canPlace(word, r, c, dir[0], dir[1])) {
                    for(let i=0; i<word.length; i++) {
                        grid[r + i*dir[0]][c + i*dir[1]] = word[i];
                    }
                    placed = true;
                }
            }
        });

        // Fill empty cells
        const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                if(grid[r][c] === '') {
                    grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }

        // Render Grid
        const wsContainer = document.createElement('div');
        wsContainer.className = 'game-wordsearch-container';
        
        const gridEl = document.createElement('div');
        gridEl.className = 'game-wordsearch-grid';
        gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        let isDragging = false;
        let selectedCells = [];
        let startCell = null;

        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                const cell = document.createElement('div');
                cell.className = 'game-wordsearch-cell';
                cell.textContent = grid[r][c];
                cell.dataset.r = r;
                cell.dataset.c = c;
                gridEl.appendChild(cell);
            }
        }

        // Render Word List
        const listEl = document.createElement('div');
        listEl.className = 'game-wordlist';
        selectedOriginalWords.forEach((originalW, idx) => {
            const w = words[idx];
            const wEl = document.createElement('div');
            wEl.className = 'game-wordlist-item';
            wEl.textContent = originalW;
            wEl.dataset.word = w;
            listEl.appendChild(wEl);
        });
        
        // Add replay button
        const replayBtn = document.createElement('button');
        replayBtn.className = 'game-replay-btn';
        replayBtn.innerHTML = '🔄 Nueva partida';
        replayBtn.onclick = () => startWordSearch(container, config);
        
        wsContainer.appendChild(listEl);
        wsContainer.appendChild(gridEl);
        wsContainer.appendChild(replayBtn);
        container.appendChild(wsContainer);

        // Very simple click-to-select mechanism (instead of full drag for simplicity on mobile)
        let firstClick = null;
        
        function getLineOfCells(c1, c2) {
            let r1 = parseInt(c1.dataset.r), col1 = parseInt(c1.dataset.c);
            let r2 = parseInt(c2.dataset.r), col2 = parseInt(c2.dataset.c);
            
            let dr = r2 - r1;
            let dc = col2 - col1;
            
            let steps = Math.max(Math.abs(dr), Math.abs(dc));
            if (steps === 0) return [c1];
            
            // Check if valid line
            if (Math.abs(dr) !== Math.abs(dc) && dr !== 0 && dc !== 0) return null;
            
            let cells = [];
            let rStep = dr === 0 ? 0 : (dr > 0 ? 1 : -1);
            let cStep = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
            
            for(let i=0; i<=steps; i++) {
                let node = gridEl.querySelector(`[data-r="${r1 + i*rStep}"][data-c="${col1 + i*cStep}"]`);
                if(node) cells.push(node);
            }
            return cells;
        }

        gridEl.addEventListener('click', (e) => {
            if(e.target.classList.contains('game-wordsearch-cell')) {
                if(!firstClick) {
                    firstClick = e.target;
                    firstClick.classList.add('selected');
                } else {
                    let secondClick = e.target;
                    let line = getLineOfCells(firstClick, secondClick);
                    
                    if (line) {
                        let str = line.map(c => c.textContent).join('');
                        let strRev = str.split('').reverse().join('');
                        
                        if (words.includes(str) || words.includes(strRev)) {
                            let wordFound = words.includes(str) ? str : strRev;
                            if(!foundWords.has(wordFound)) {
                                foundWords.add(wordFound);
                                line.forEach(c => c.classList.add('found'));
                                listEl.querySelector(`[data-word="${wordFound}"]`).classList.add('found');
                                
                                if(foundWords.size === words.length) {
                                    if (window.notifyCarlos) window.notifyCarlos("🎮 Melisa acaba de encontrar todas las palabras en la Sopa de Letras.");
                                    setTimeout(() => celebrate(wsContainer, '¡Encontraste todas nuestras palabras!'), 500);
                                }
                            }
                        }
                    }
                    
                    // Reset
                    gridEl.querySelectorAll('.game-wordsearch-cell').forEach(c => c.classList.remove('selected'));
                    firstClick = null;
                }
            }
        });

        return { destroy: () => { container.innerHTML = ''; } };
    }

    // ==========================================
    // 3. TRIVIA
    // ==========================================
    function startTrivia(container, config) {
        container.innerHTML = '';
        let allQuestions = config.questions || [
            { q: '¿Pregunta de prueba?', options: ['A','B'], correct: 0, explanation: 'Respuesta' }
        ];
        
        // Randomize questions
        let questions = shuffleArray([...allQuestions]).slice(0, 15); // Pick 15 random
        
        let currentQ = 0;
        let score = 0;

        const progressDiv = document.createElement('div');
        progressDiv.className = 'game-trivia-progress';
        progressDiv.innerHTML = `<div class="game-trivia-progress-bar" style="width: 0%"></div>`;
        container.appendChild(progressDiv);

        const qContainer = document.createElement('div');
        qContainer.className = 'game-trivia-container';
        container.appendChild(qContainer);
        
        const replayBtn = document.createElement('button');
        replayBtn.className = 'game-replay-btn';
        replayBtn.innerHTML = '🔄 Jugar de nuevo';
        replayBtn.onclick = () => startTrivia(container, config);

        function renderQuestion() {
            if (currentQ >= questions.length) {
                showScore();
                return;
            }

            const q = questions[currentQ];
            progressDiv.firstChild.style.width = `${((currentQ) / questions.length) * 100}%`;
            
            let html = `<div class="game-trivia-question">${q.q}</div><div class="game-trivia-options">`;
            
            q.options.forEach((opt, i) => {
                html += `<div class="game-trivia-option" data-idx="${i}">${opt}</div>`;
            });
            
            html += `</div><div id="trivia-explanation" class="game-trivia-explanation" style="display:none;"></div>`;
            qContainer.innerHTML = html;

            const options = qContainer.querySelectorAll('.game-trivia-option');
            options.forEach(opt => {
                opt.addEventListener('click', function() {
                    if (this.classList.contains('disabled')) return;
                    
                    options.forEach(o => o.classList.add('disabled'));
                    const selected = parseInt(this.dataset.idx);
                    
                    if (selected === q.correct) {
                        this.classList.add('correct');
                        score++;
                    } else {
                        this.classList.add('incorrect');
                        options[q.correct].classList.add('correct');
                    }

                    const exp = document.getElementById('trivia-explanation');
                    exp.textContent = q.explanation;
                    exp.style.display = 'block';

                    const nextBtn = document.createElement('button');
                    nextBtn.className = 'game-trivia-next';
                    nextBtn.textContent = currentQ < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados';
                    nextBtn.onclick = () => {
                        currentQ++;
                        renderQuestion();
                    };
                    qContainer.appendChild(nextBtn);
                });
            });
        }

        function showScore() {
            progressDiv.firstChild.style.width = '100%';
            if (window.notifyCarlos) window.notifyCarlos(`🎮 Melisa terminó la Trivia con un puntaje de ${score}/${questions.length}.`);
            qContainer.innerHTML = `
                <div class="game-trivia-score">
                    <div class="game-trivia-score-number">${score} / ${questions.length}</div>
                    <div class="game-trivia-score-label">Respuestas correctas</div>
                </div>
            `;
            celebrate(qContainer, score === questions.length ? '¡Me conoces perfectamente!' : '¡Buen trabajo mi amor!');
            qContainer.appendChild(replayBtn);
        }

        renderQuestion();

        return { destroy: () => { container.innerHTML = ''; } };
    }

    // ==========================================
    // 4. PUZZLE
    // ==========================================
    function startPuzzle(container, config) {
        container.innerHTML = '';
        
        const size = config.gridSize || 3;
        
        let imageList = [];
        if (Array.isArray(config.images)) {
            imageList = config.images;
        } else if (config.image) {
            imageList = [config.image];
        } else {
            imageList = ['fotos/foto_139.jpeg'];
        }
        
        const imageUrl = imageList[Math.floor(Math.random() * imageList.length)];
        
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '15px';
        
        const instructions = document.createElement('p');
        instructions.textContent = 'Desliza las piezas para formar nuestra foto ❤️';
        instructions.style.color = '#fff';
        instructions.style.fontSize = '0.9rem';
        instructions.style.marginBottom = '10px';
        
        const board = document.createElement('div');
        // Usamos un tamaño responsivo maximo de 300px
        board.style.width = '280px';
        board.style.height = '280px';
        board.style.display = 'grid';
        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        board.style.gap = '2px';
        board.style.backgroundColor = 'rgba(0,229,255,0.3)';
        board.style.border = '2px solid var(--primary)';
        board.style.borderRadius = '8px';
        board.style.overflow = 'hidden';
        
        // Estado del juego
        const numTiles = size * size;
        let tiles = [];
        
        // Inicializar piezas ordenadas (0 a 8) donde size*size-1 es el vacio
        for (let i = 0; i < numTiles; i++) {
            tiles.push(i);
        }
        
        // Función para verificar si se puede resolver
        function isSolvable(arr) {
            let inversions = 0;
            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i] !== numTiles - 1 && arr[j] !== numTiles - 1 && arr[i] > arr[j]) {
                        inversions++;
                    }
                }
            }
            return inversions % 2 === 0;
        }
        
        // Mezclar hasta que sea resoluble
        do {
            for (let i = tiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
            }
        } while (!isSolvable(tiles) || checkWin(tiles));
        
        function checkWin(currentTiles) {
            for (let i = 0; i < numTiles - 1; i++) {
                if (currentTiles[i] !== i) return false;
            }
            return true;
        }
        
        function renderBoard() {
            board.innerHTML = '';
            tiles.forEach((tileIndex, position) => {
                const cell = document.createElement('div');
                cell.style.width = '100%';
                cell.style.height = '100%';
                
                if (tileIndex === numTiles - 1) {
                    // Pieza vacía
                    cell.style.backgroundColor = 'transparent';
                } else {
                    cell.style.backgroundImage = `url('${imageUrl}')`;
                    cell.style.backgroundSize = `${size * 100}% ${size * 100}%`;
                    
                    // Calcular posicion X e Y basada en el valor real de la pieza
                    const bgX = (tileIndex % size) * (100 / (size - 1));
                    const bgY = Math.floor(tileIndex / size) * (100 / (size - 1));
                    
                    cell.style.backgroundPosition = `${bgX}% ${bgY}%`;
                    cell.style.cursor = 'pointer';
                    cell.style.borderRadius = '4px';
                    cell.style.transition = 'transform 0.1s';
                    
                    cell.addEventListener('click', () => moveTile(position));
                }
                board.appendChild(cell);
            });
            
            if (checkWin(tiles)) {
                if (window.notifyCarlos) window.notifyCarlos("🎮 Melisa acaba de armar el Rompecabezas deslizante.");
                setTimeout(() => {
                    board.innerHTML = '';
                    board.style.display = 'block';
                    board.style.backgroundImage = `url('${imageUrl}')`;
                    board.style.backgroundSize = 'cover';
                    board.style.backgroundPosition = 'center';
                    
                    const winMsg = document.createElement('div');
                    winMsg.innerHTML = '<h3 style="color:var(--gold); margin-bottom:10px;">¡Lo lograste! 🧩</h3><p>Encajamos perfectamente.</p>';
                    winMsg.style.textAlign = 'center';
                    winMsg.style.marginTop = '20px';
                    
                    if (imageList.length > 1) {
                        const retryBtn = document.createElement('button');
                        retryBtn.className = 'btn';
                        retryBtn.style.marginTop = '15px';
                        retryBtn.textContent = 'Intentar con otra foto 🔄';
                        retryBtn.onclick = () => {
                            container.innerHTML = '';
                            startPuzzle(container, config);
                        };
                        winMsg.appendChild(retryBtn);
                    }
                    
                    wrapper.appendChild(winMsg);
                }, 300);
            }
        }
        
        function moveTile(pos) {
            const emptyPos = tiles.indexOf(numTiles - 1);
            
            // Validar adyacencia
            const row = Math.floor(pos / size);
            const col = pos % size;
            const emptyRow = Math.floor(emptyPos / size);
            const emptyCol = emptyPos % size;
            
            const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
                               (Math.abs(col - emptyCol) === 1 && row === emptyRow);
            
            if (isAdjacent) {
                // Intercambiar
                [tiles[pos], tiles[emptyPos]] = [tiles[emptyPos], tiles[pos]];
                renderBoard();
            }
        }
        
        wrapper.appendChild(instructions);
        wrapper.appendChild(board);
        container.appendChild(wrapper);
        
        renderBoard();
        
        return { destroy: () => { container.innerHTML = ''; } };
    }

    // ==========================================
    // 5. RIDDLE
    // ==========================================
    function startRiddle(container, config) {
        container.innerHTML = '';
        
        const rContainer = document.createElement('div');
        rContainer.className = 'game-riddle-container';
        
        // Random riddle support if array
        let rConfig = config;
        if(Array.isArray(config.riddles)) {
            rConfig = config.riddles[Math.floor(Math.random() * config.riddles.length)];
        }
        
        const q = rConfig.riddle || 'Soy invisible pero me sientes...';
        const a = (rConfig.answer || 'amor').toLowerCase();
        const hint = rConfig.hint || 'Pista no disponible';

        rContainer.innerHTML = `
            <div class="game-riddle-text">"${q}"</div>
            <input type="text" class="game-riddle-input" placeholder="Tu respuesta..." autocomplete="off">
            <button class="game-riddle-submit">Adivinar</button>
            <button class="game-riddle-hint-btn">Necesito una pista</button>
            <div class="game-riddle-hint" style="display:none;">${hint}</div>
            <div class="game-riddle-result" style="display:none;"></div>
        `;
        
        container.appendChild(rContainer);

        const input = rContainer.querySelector('.game-riddle-input');
        const submitBtn = rContainer.querySelector('.game-riddle-submit');
        const hintBtn = rContainer.querySelector('.game-riddle-hint-btn');
        const hintDiv = rContainer.querySelector('.game-riddle-hint');
        const resultDiv = rContainer.querySelector('.game-riddle-result');

        hintBtn.addEventListener('click', () => {
            hintDiv.style.display = 'block';
            hintBtn.style.display = 'none';
        });

        submitBtn.addEventListener('click', () => {
            const val = input.value.trim().toLowerCase();
            if (!val) return;
            
            resultDiv.style.display = 'block';
            if (val === a || val.includes(a)) {
                resultDiv.className = 'game-riddle-result correct';
                resultDiv.textContent = '¡Correcto mi amor! 💕';
                celebrate(rContainer, '¡Qué inteligente eres!');
            } else {
                resultDiv.className = 'game-riddle-result incorrect';
                resultDiv.textContent = 'Mmm... casi, pero no. ¡Sigue intentando!';
            }
        });

        return { destroy: () => { container.innerHTML = ''; } };
    }
    // ==========================================
    // 6. HANGMAN (DESCUBRE LA FRASE)
    // ==========================================
    function startHangman(container, config) {
        container.innerHTML = '';
        
        // Add styles for the sunflower animations
        if (!document.getElementById('hangman-styles')) {
            const style = document.createElement('style');
            style.id = 'hangman-styles';
            style.innerHTML = `
                @keyframes sway {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
                .sunflower-body {
                    transform-origin: 50px 100px;
                    animation: sway 4s ease-in-out infinite;
                }
                .falling-petal {
                    transition: transform 1.5s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.5s;
                }
            `;
            document.head.appendChild(style);
        }

        let phrase = 'TE AMO';
        if (config.phrases && config.phrases.length > 0) {
            phrase = config.phrases[Math.floor(Math.random() * config.phrases.length)].toUpperCase();
        } else if (config.phrase) {
            phrase = config.phrase.toUpperCase();
        }
        let guessed = new Set();
        let mistakes = 0;
        const maxMistakes = 12;
        
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '10px';
        
        // Girasol animado (SVG)
        const petals = [];
        for (let i = 0; i < maxMistakes; i++) {
            // Group handles the initial rotation so the ellipse's local axes can be transformed for falling
            petals.push(`
                <g transform="rotate(${i * 30} 50 50)">
                    <ellipse cx="50" cy="20" rx="6" ry="18" fill="#FFD700" id="petal-${i}" class="falling-petal" style="transform-origin: 50px 20px;" />
                </g>
            `);
        }
        const svgHTML = `
        <svg viewBox="0 0 100 120" width="120" height="140" style="overflow: visible;">
          <g class="sunflower-body">
              <!-- Tallo y hojas -->
              <path d="M 50 50 Q 40 80 50 120" stroke="#228B22" stroke-width="4" fill="none" />
              <path d="M 45 90 Q 20 80 30 60 Q 40 70 45 90" fill="#228B22" />
              <path d="M 53 100 Q 80 110 70 80 Q 60 90 53 100" fill="#228B22" />
              
              <!-- Pétalos -->
              ${petals.join('')}
              
              <!-- Centro del girasol -->
              <circle cx="50" cy="50" r="16" fill="#654321" />
              <circle cx="50" cy="50" r="12" fill="#3E2723" stroke="#8D6E63" stroke-width="1.5" stroke-dasharray="2,2" />
          </g>
        </svg>
        `;
        const flowerDiv = document.createElement('div');
        flowerDiv.innerHTML = svgHTML;
        wrapper.appendChild(flowerDiv);
        
        // Frase a adivinar
        const phraseDiv = document.createElement('div');
        phraseDiv.style.display = 'flex';
        phraseDiv.style.flexWrap = 'wrap';
        phraseDiv.style.justifyContent = 'center';
        phraseDiv.style.gap = '5px';
        phraseDiv.style.fontSize = '1.1rem';
        phraseDiv.style.fontWeight = 'bold';
        phraseDiv.style.letterSpacing = '3px';
        wrapper.appendChild(phraseDiv);
        
        function renderPhrase() {
            phraseDiv.innerHTML = '';
            let won = true;
            for (let char of phrase) {
                if (char === ' ') {
                    phraseDiv.innerHTML += '<span style="width: 15px;"></span>';
                } else {
                    const span = document.createElement('span');
                    span.style.borderBottom = '2px solid white';
                    span.style.minWidth = '15px';
                    span.style.textAlign = 'center';
                    span.style.display = 'inline-block';
                    if (guessed.has(char)) {
                        span.textContent = char;
                    } else {
                        span.textContent = '_';
                        won = false;
                    }
                    phraseDiv.appendChild(span);
                }
            }
            if (won) {
                if (window.notifyCarlos) window.notifyCarlos("🎮 Melisa acaba de descubrir la frase secreta del girasol.");
                keyboardDiv.style.display = 'none';
                setTimeout(() => {
                    celebrate(wrapper, '¡Descubriste la frase secreta!');
                    if (config.phrases && config.phrases.length > 1) {
                        const retryBtn = document.createElement('button');
                        retryBtn.className = 'btn';
                        retryBtn.style.marginTop = '15px';
                        retryBtn.textContent = 'Jugar con otra frase 🔄';
                        retryBtn.onclick = () => {
                            container.innerHTML = '';
                            startHangman(container, config);
                        };
                        wrapper.appendChild(retryBtn);
                    }
                }, 500);
            }
        }
        
        // Teclado virtual
        const keyboardDiv = document.createElement('div');
        keyboardDiv.style.display = 'flex';
        keyboardDiv.style.flexWrap = 'wrap';
        keyboardDiv.style.justifyContent = 'center';
        keyboardDiv.style.gap = '4px';
        keyboardDiv.style.maxWidth = '340px';
        
        const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        for (let char of letters) {
            const btn = document.createElement('button');
            btn.textContent = char;
            btn.className = 'btn';
            btn.style.padding = '8px 5px';
            btn.style.minWidth = '30px';
            btn.style.fontSize = '0.9rem';
            btn.onclick = () => {
                if (guessed.has(char)) return;
                guessed.add(char);
                btn.disabled = true;
                btn.style.opacity = '0.4';
                
                if (!phrase.includes(char)) {
                    // Error: quitar un pétalo haciendo que caiga
                    if (mistakes < maxMistakes) {
                        const petal = flowerDiv.querySelector(`#petal-${mistakes}`);
                        if (petal) {
                            // Translate inward to simulate falling relative to its rotated position, 
                            // or translate down in unrotated coords.
                            // The petal is rotated so the top points away from center. 
                            // Translating Y by 150 pushes it "up" and "away" in its local coordinates.
                            // It looks like it flies off and fades.
                            petal.style.transform = `translateY(100px) rotate(45deg) scale(0.5)`;
                            petal.style.opacity = '0';
                        }
                        mistakes++;
                    }
                    if (mistakes >= maxMistakes) {
                        keyboardDiv.style.display = 'none';
                        phraseDiv.innerHTML = `<span style="color:var(--danger)">¡Oh no, el girasol se quedó sin pétalos!</span>`;
                        setTimeout(() => {
                            container.innerHTML = '';
                            startHangman(container, config);
                        }, 3000);
                    }
                }
                renderPhrase();
            };
            keyboardDiv.appendChild(btn);
        }
        
        wrapper.appendChild(keyboardDiv);
        container.appendChild(wrapper);
        
        renderPhrase();
        
        return { destroy: () => { container.innerHTML = ''; } };
    }

    // ==========================================
    // 6. ROULETTE (RULETA)
    // ==========================================
    function startRoulette(container, config) {
        container.innerHTML = '';
        
        let spins = parseInt(localStorage.getItem('melisa_roulette_spins') || '0');
        const WIN_TARGET = 50;
        
        const slices = [
            { text: 'Sigue\\nintentando', color: '#fdf4da', textColor: '#6b1c11', isWin: false },
            { text: 'Uy\\ncasi', color: '#fff9eb', textColor: '#6b1c11', isWin: false },
            { text: 'Por eso\\nlas operan', color: '#fdf4da', textColor: '#6b1c11', isWin: false },
            { text: 'Beso de\\nconsuelo', color: '#fff9eb', textColor: '#6b1c11', isWin: false },
            { text: 'Intenta\\nde nuevo', color: '#fdf4da', textColor: '#6b1c11', isWin: false },
            { text: 'PREMIO\\nSORPRESA', color: '#ff5722', textColor: '#ffffff', isWin: true }, // The winning slice
            { text: 'Sigue\\nparticipando', color: '#fdf4da', textColor: '#6b1c11', isWin: false },
            { text: 'No creo que\\nte rindas', color: '#fff9eb', textColor: '#6b1c11', isWin: false }
        ];
        
        const numSlices = slices.length;
        const sliceAngle = 360 / numSlices;
        
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '20px';
        wrapper.style.width = '100%';
        wrapper.style.position = 'relative';
        
        // Pointer (Temu style gold pin)
        const pointer = document.createElement('div');
        pointer.style.position = 'absolute';
        pointer.style.top = '-20px';
        pointer.style.zIndex = '20';
        pointer.style.width = '30px';
        pointer.style.height = '45px';
        pointer.style.background = 'radial-gradient(ellipse at center, #ffd700 0%, #b8860b 100%)';
        pointer.style.clipPath = 'polygon(50% 100%, 0 40%, 0 0, 100% 0, 100% 40%)';
        pointer.style.borderRadius = '5px 5px 50% 50%';
        pointer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
        // Center inner dot for the pointer
        const pointerInner = document.createElement('div');
        pointerInner.style.width = '12px';
        pointerInner.style.height = '12px';
        pointerInner.style.background = '#fff';
        pointerInner.style.borderRadius = '50%';
        pointerInner.style.position = 'absolute';
        pointerInner.style.top = '8px';
        pointerInner.style.left = '50%';
        pointerInner.style.transform = 'translateX(-50%)';
        pointerInner.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3)';
        pointer.appendChild(pointerInner);

        // Wheel Container
        const wheelContainer = document.createElement('div');
        wheelContainer.style.width = '280px';
        wheelContainer.style.height = '280px';
        wheelContainer.style.position = 'relative';
        wheelContainer.style.borderRadius = '50%';
        wheelContainer.style.overflow = 'hidden';
        wheelContainer.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5), 0 0 0 8px #2c1a17, 0 0 0 10px #d4af37';
        
        // The Wheel (SVG)
        const wheel = document.createElement('div');
        wheel.style.width = '100%';
        wheel.style.height = '100%';
        wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        wheel.style.transform = 'rotate(0deg)';
        
        let svgHTML = `<svg viewBox="0 0 200 200" width="100%" height="100%">
            <defs>
                <radialGradient id="gradOrange" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ff8a50;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff5722;stop-opacity:1" />
                </radialGradient>
            </defs>`;
        
        const center = 100;
        const radius = 100;
        
        slices.forEach((slice, i) => {
            const startAngle = i * sliceAngle;
            const endAngle = (i + 1) * sliceAngle;
            
            // To start from top, we shift by -90
            const startX = center + radius * Math.cos(Math.PI * (startAngle - 90) / 180);
            const startY = center + radius * Math.sin(Math.PI * (startAngle - 90) / 180);
            const endX = center + radius * Math.cos(Math.PI * (endAngle - 90) / 180);
            const endY = center + radius * Math.sin(Math.PI * (endAngle - 90) / 180);
            
            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
            
            const d = [
                `M ${center} ${center}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `Z`
            ].join(' ');
            
            const fillColor = slice.isWin ? 'url(#gradOrange)' : slice.color;
            svgHTML += `<path d="${d}" fill="${fillColor}" stroke="#d4af37" stroke-width="1.5"></path>`;
            
            // Text
            const textAngle = startAngle + (sliceAngle / 2);
            const textRadius = 72; // Move text further out where slice is wider
            const textX = center + textRadius * Math.cos(Math.PI * (textAngle - 90) / 180);
            const textY = center + textRadius * Math.sin(Math.PI * (textAngle - 90) / 180);
            
            let tspanHTML = '';
            const words = slice.text.split('\\n');
            words.forEach((word, idx) => {
                // Adjust dy to tighten line spacing slightly and center vertically better
                const dy = idx === 0 ? (words.length > 1 ? '-0.4em' : '0') : '1.1em';
                tspanHTML += `<tspan x="0" dy="${dy}">${word}</tspan>`;
            });
            
            const fontSize = slice.isWin ? '9' : '8';
            
            svgHTML += `
                <g transform="translate(${textX}, ${textY}) rotate(${textAngle})">
                    <text x="0" y="0" font-family="Outfit, sans-serif" font-size="${fontSize}" font-weight="700" fill="${slice.textColor}" text-anchor="middle" dominant-baseline="middle" style="letter-spacing: -0.2px;">
                        ${tspanHTML}
                    </text>
                </g>
            `;
        });
        
        // Outer pins
        slices.forEach((slice, i) => {
            const angle = i * sliceAngle;
            const pinX = center + 92 * Math.cos(Math.PI * (angle - 90) / 180);
            const pinY = center + 92 * Math.sin(Math.PI * (angle - 90) / 180);
            svgHTML += `<circle cx="${pinX}" cy="${pinY}" r="4" fill="#ffdf73" stroke="#b8860b" stroke-width="0.5" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))"></circle>`;
        });

        svgHTML += `
            <circle cx="100" cy="100" r="16" fill="#2c2c2c" stroke="#d4af37" stroke-width="4" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"></circle>
        </svg>`;
        
        wheel.innerHTML = svgHTML;
        wheelContainer.appendChild(wheel);
        
        // Spin Button
        const spinBtn = document.createElement('button');
        spinBtn.className = 'btn';
        spinBtn.style.padding = '15px 40px';
        spinBtn.style.fontSize = '1.2rem';
        spinBtn.style.marginTop = '20px';
        spinBtn.style.background = 'var(--pink)';
        spinBtn.innerHTML = '¡GIRAR RULETA! 🎡';
        
        let isSpinning = false;
        let currentRotation = 0;
        
        spinBtn.onclick = () => {
            if (isSpinning) return;
            isSpinning = true;
            spinBtn.style.opacity = '0.5';
            spinBtn.style.cursor = 'not-allowed';
            
            spins++;
            localStorage.setItem('melisa_roulette_spins', spins);
            
            if (window.notifyCarlos) {
                window.notifyCarlos(`🎰 Melisa giró la ruleta (Intento ${spins}/${WIN_TARGET})`);
            }
            
            let targetIndex;
            if (spins >= WIN_TARGET) {
                targetIndex = 5; // Premio sorpresa
            } else {
                const nonWinIndices = [0, 1, 2, 3, 4, 6, 7];
                targetIndex = nonWinIndices[Math.floor(Math.random() * nonWinIndices.length)];
            }
            
            const targetAngle = targetIndex * sliceAngle + (sliceAngle / 2);
            const offsetToTop = 360 - targetAngle;
            
            const extraSpins = 360 * 5;
            
            currentRotation += extraSpins;
            currentRotation = Math.floor(currentRotation / 360) * 360 + offsetToTop;
            
            const randomJitter = (Math.random() - 0.5) * (sliceAngle * 0.6);
            currentRotation += randomJitter;
            
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            
            setTimeout(() => {
                isSpinning = false;
                spinBtn.style.opacity = '1';
                spinBtn.style.cursor = 'pointer';
                
                const landedSlice = slices[targetIndex];
                
                if (landedSlice.isWin) {
                    celebrate(wrapper, '¡GANASTE EL PREMIO SORPRESA! 🎉');
                    if (window.notifyCarlos) window.notifyCarlos(`🏆 ¡MELISA GANÓ EL PREMIO EN LA RULETA (Intento ${spins})!`);
                    spinBtn.style.display = 'none';
                    
                    const winMsg = document.createElement('div');
                    winMsg.style.background = 'rgba(255, 215, 0, 0.2)';
                    winMsg.style.border = '2px solid var(--gold)';
                    winMsg.style.padding = '20px';
                    winMsg.style.borderRadius = 'var(--radius-md)';
                    winMsg.style.marginTop = '20px';
                    winMsg.style.textAlign = 'center';
                    winMsg.innerHTML = `
                        <h3 style="color: var(--gold); margin-bottom:10px;">¡FELICITACIONES!</h3>
                        <p>Has sido muy persistente. Tómale pantallazo a esto y mándaselo a Carlos para reclamar tu <strong>PREMIO SORPRESA</strong>.</p>
                    `;
                    wrapper.appendChild(winMsg);
                } else {
                    const resultMsg = document.createElement('div');
                    resultMsg.style.position = 'absolute';
                    resultMsg.style.top = '50%';
                    resultMsg.style.left = '50%';
                    resultMsg.style.transform = 'translate(-50%, -50%)';
                    resultMsg.style.background = 'var(--bg-card)';
                    resultMsg.style.border = `2px solid ${landedSlice.color}`;
                    resultMsg.style.padding = '15px 25px';
                    resultMsg.style.borderRadius = 'var(--radius-lg)';
                    resultMsg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
                    resultMsg.style.zIndex = '20';
                    resultMsg.style.fontWeight = 'bold';
                    resultMsg.style.fontSize = '1.2rem';
                    resultMsg.style.color = landedSlice.color;
                    resultMsg.style.textAlign = 'center';
                    resultMsg.innerHTML = landedSlice.text.replace('\\n', '<br>');
                    
                    wrapper.appendChild(resultMsg);
                    
                    setTimeout(() => {
                        resultMsg.style.opacity = '0';
                        resultMsg.style.transition = 'opacity 0.5s';
                        setTimeout(() => resultMsg.remove(), 500);
                    }, 2500);
                }
                
            }, 4100);
        };
        
        wrapper.appendChild(pointer);
        wrapper.appendChild(wheelContainer);
        wrapper.appendChild(spinBtn);
        
        container.appendChild(wrapper);
    }

    // ==========================================
    // 7. CATCH HEARTS (ATRAPA MI CORAZÓN)
    // ==========================================
    function startCatchHearts(container, config) {
        container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '420px';
        wrapper.style.background = 'linear-gradient(to bottom, #0a1128, #1a2a6c)';
        wrapper.style.borderRadius = 'var(--radius-lg)';
        wrapper.style.overflow = 'hidden';
        wrapper.style.border = '2px solid var(--primary)';
        wrapper.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)';
        wrapper.style.touchAction = 'none'; // Prevent scroll while playing
        wrapper.style.webkitUserSelect = 'none';
        wrapper.style.userSelect = 'none';
        
        // Progress bar (visual indicator toward 1000)
        const progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '4px';
        progressBar.style.width = '0%';
        progressBar.style.background = 'linear-gradient(90deg, #ff4081, #ffd700)';
        progressBar.style.transition = 'width 0.3s';
        progressBar.style.zIndex = '10';
        wrapper.appendChild(progressBar);
        
        const scoreboard = document.createElement('div');
        scoreboard.style.position = 'absolute';
        scoreboard.style.top = '10px';
        scoreboard.style.left = '12px';
        scoreboard.style.right = '12px';
        scoreboard.style.display = 'flex';
        scoreboard.style.justifyContent = 'space-between';
        scoreboard.style.color = '#fff';
        scoreboard.style.fontFamily = 'Outfit, sans-serif';
        scoreboard.style.fontSize = '1rem';
        scoreboard.style.fontWeight = 'bold';
        scoreboard.style.zIndex = '10';
        scoreboard.style.textShadow = '0 1px 4px rgba(0,0,0,0.8)';
        
        const scoreEl = document.createElement('div');
        scoreEl.innerHTML = '💖 0 / 1000';
        
        const timeEl = document.createElement('div');
        timeEl.innerHTML = '⏱️ 60s';
        
        scoreboard.appendChild(scoreEl);
        scoreboard.appendChild(timeEl);
        wrapper.appendChild(scoreboard);
        
        // Start / End overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '30';
        overlay.style.textAlign = 'center';
        overlay.style.padding = '20px';
        overlay.style.color = '#fff';
        
        overlay.innerHTML = `
            <h2 style="color:var(--pink); margin-bottom:10px; font-size:1.4rem;">💖 Atrapa mi Corazón</h2>
            <p style="margin-bottom:8px; font-size:0.9rem;">Toca los corazones de colores para sumar puntos.</p>
            <p style="color:#aaa; margin-bottom:8px; font-size:0.85rem;">¡Cuidado con los 💔 grises! Te restan puntos.</p>
            <p style="color:var(--gold); font-weight:bold; margin-bottom:20px; font-size:0.95rem;">Meta: ¡1000 puntos!</p>
        `;
        
        const playBtn = document.createElement('button');
        playBtn.className = 'btn';
        playBtn.textContent = '¡JUGAR!';
        playBtn.style.fontSize = '1.1rem';
        playBtn.style.padding = '12px 40px';
        overlay.appendChild(playBtn);
        wrapper.appendChild(overlay);
        
        container.appendChild(wrapper);
        
        // ---- Game state ----
        let score = 0;
        let timeLeft = 60;
        let timerInterval = null;
        let spawnTimer = null;
        let animFrame = null;
        let isPlaying = false;
        let hearts = []; // Array of active heart objects
        
        function updateScore() {
            scoreEl.innerHTML = `💖 ${score} / 1000`;
            progressBar.style.width = Math.min(100, (score / 1000) * 100) + '%';
        }
        
        function createHeart() {
            if (!isPlaying) return;
            
            const isTrap = Math.random() < 0.25;
            const size = Math.floor(Math.random() * 18) + 28;
            const wrapperW = wrapper.offsetWidth || 300;
            const x = Math.random() * (wrapperW - size - 10) + 5;
            const speed = (Math.random() * 1.5 + 1); // px per frame (~60fps)
            
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.left = x + 'px';
            el.style.top = '-50px';
            el.style.fontSize = size + 'px';
            el.style.lineHeight = '1';
            el.style.cursor = 'pointer';
            el.style.zIndex = '5';
            el.style.pointerEvents = 'auto';
            
            if (isTrap) {
                el.textContent = '💔';
                el.style.filter = 'grayscale(80%) brightness(0.7)';
            } else {
                const emojis = ['💖', '💗', '💓', '❤️', '💕'];
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            }
            
            let caught = false;
            
            const onTap = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (caught || !isPlaying) return;
                caught = true;
                
                el.style.transition = 'transform 0.25s ease-out, opacity 0.25s';
                el.style.transform = 'scale(1.6)';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                
                if (isTrap) {
                    score = Math.max(0, score - 100);
                    // Red flash
                    wrapper.style.boxShadow = 'inset 0 0 40px rgba(255,0,0,0.7)';
                    setTimeout(() => { wrapper.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)'; }, 250);
                    // Show -100 floating text
                    showFloating(el, '-100', '#ff4444');
                } else {
                    const pts = size < 35 ? 100 : 50;
                    score += pts;
                    showFloating(el, '+' + pts, '#ffd700');
                }
                
                updateScore();
                
                setTimeout(() => removeHeart(heartObj), 300);
                
                if (score >= 1000) {
                    endGame(true);
                }
            };
            
            el.addEventListener('touchstart', onTap, { passive: false });
            el.addEventListener('mousedown', onTap);
            
            wrapper.appendChild(el);
            
            const heartObj = { el, y: -50, speed, caught };
            hearts.push(heartObj);
        }
        
        function showFloating(refEl, text, color) {
            const f = document.createElement('div');
            f.textContent = text;
            f.style.position = 'absolute';
            f.style.left = refEl.style.left;
            f.style.top = (parseFloat(refEl.style.top) - 10) + 'px';
            f.style.color = color;
            f.style.fontWeight = 'bold';
            f.style.fontSize = '1.1rem';
            f.style.fontFamily = 'Outfit, sans-serif';
            f.style.zIndex = '15';
            f.style.pointerEvents = 'none';
            f.style.textShadow = '0 1px 3px rgba(0,0,0,0.7)';
            f.style.transition = 'all 0.6s ease-out';
            wrapper.appendChild(f);
            requestAnimationFrame(() => {
                f.style.top = (parseFloat(f.style.top) - 40) + 'px';
                f.style.opacity = '0';
            });
            setTimeout(() => { if (f.parentNode) f.remove(); }, 700);
        }
        
        function removeHeart(hObj) {
            const idx = hearts.indexOf(hObj);
            if (idx !== -1) hearts.splice(idx, 1);
            if (hObj.el.parentNode) hObj.el.remove();
        }
        
        function gameLoop() {
            if (!isPlaying) return;
            
            const wrapperH = wrapper.offsetHeight || 420;
            
            for (let i = hearts.length - 1; i >= 0; i--) {
                const h = hearts[i];
                if (h.caught) continue;
                h.y += h.speed;
                h.el.style.top = h.y + 'px';
                
                // Off-screen removal
                if (h.y > wrapperH + 30) {
                    removeHeart(h);
                }
            }
            
            animFrame = requestAnimationFrame(gameLoop);
        }
        
        function endGame(win) {
            isPlaying = false;
            if (timerInterval) clearInterval(timerInterval);
            if (spawnTimer) clearTimeout(spawnTimer);
            if (animFrame) cancelAnimationFrame(animFrame);
            
            // Remove remaining hearts
            hearts.forEach(h => { if (h.el.parentNode) h.el.remove(); });
            hearts = [];
            
            overlay.innerHTML = '';
            overlay.style.display = 'flex';
            
            if (win) {
                celebrate(wrapper, '¡OBJETIVO CUMPLIDO! 🎉');
                if (window.notifyCarlos) window.notifyCarlos('💖 Melisa ganó Atrapa mi Corazón (1000 puntos).');
                overlay.innerHTML = `
                    <h2 style="color:var(--gold); margin-bottom:15px; text-shadow: 0 0 10px rgba(255,215,0,0.5); font-size:1.4rem;">¡ERES INCREÍBLE! 🎉</h2>
                    <p style="margin-bottom:15px;">Atrapaste todos mis corazones.</p>
                    <div style="background:rgba(255,215,0,0.1); border:1px solid var(--gold); padding:15px; border-radius:10px; margin-bottom:15px;">
                        <p style="color:var(--gold); font-weight:bold;">Tómale pantallazo y mándaselo a Carlos para tu premio sorpresa 🎁</p>
                    </div>
                `;
            } else {
                overlay.innerHTML = `
                    <h2 style="color:var(--pink); margin-bottom:15px; font-size:1.3rem;">¡TIEMPO AGOTADO! ⏱️</h2>
                    <p style="margin-bottom:15px;">Hiciste <span style="color:var(--gold); font-weight:bold;">${score}</span> puntos.</p>
                    <p style="margin-bottom:20px; color:#aaa; font-size:0.9rem;">¡Inténtalo de nuevo, tú puedes!</p>
                `;
                const retryBtn = document.createElement('button');
                retryBtn.className = 'btn';
                retryBtn.textContent = 'Intentar de nuevo 🔄';
                retryBtn.style.fontSize = '1rem';
                retryBtn.style.padding = '12px 35px';
                retryBtn.onclick = startGame;
                overlay.appendChild(retryBtn);
            }
        }
        
        function startGame() {
            overlay.style.display = 'none';
            score = 0;
            timeLeft = 60;
            isPlaying = true;
            hearts = [];
            updateScore();
            timeEl.innerHTML = '⏱️ 60s';
            
            // Timer
            timerInterval = setInterval(() => {
                if (!isPlaying) return;
                timeLeft--;
                timeEl.innerHTML = `⏱️ ${timeLeft}s`;
                if (timeLeft <= 0) endGame(false);
            }, 1000);
            
            // Spawn loop with increasing frequency
            const scheduleSpawn = () => {
                if (!isPlaying) return;
                createHeart();
                const delay = Math.max(250, 700 - (60 - timeLeft) * 8);
                spawnTimer = setTimeout(scheduleSpawn, delay);
            };
            scheduleSpawn();
            
            // Animation loop
            animFrame = requestAnimationFrame(gameLoop);
        }
        
        playBtn.onclick = startGame;
    }

    // ==========================================
    // 8. SIMON SAYS (SIMÓN DICE) - META: 1000 PUNTOS
    // ==========================================
    function startSimonSays(container, config) {
        container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.width = '100%';
        wrapper.style.gap = '15px';
        wrapper.style.position = 'relative';
        
        // Scoreboard
        const scoreboard = document.createElement('div');
        scoreboard.style.display = 'flex';
        scoreboard.style.justifyContent = 'space-between';
        scoreboard.style.width = '100%';
        scoreboard.style.maxWidth = '280px';
        scoreboard.style.fontFamily = 'Outfit, sans-serif';
        scoreboard.style.fontWeight = 'bold';
        scoreboard.style.fontSize = '1rem';
        scoreboard.style.color = 'var(--text-primary)';
        
        const scoreEl = document.createElement('div');
        scoreEl.innerHTML = '🧠 0 / 1000';
        
        const levelEl = document.createElement('div');
        levelEl.innerHTML = 'Nivel 0';
        
        scoreboard.appendChild(scoreEl);
        scoreboard.appendChild(levelEl);
        wrapper.appendChild(scoreboard);
        
        // Progress bar
        const progressWrap = document.createElement('div');
        progressWrap.style.width = '100%';
        progressWrap.style.maxWidth = '280px';
        progressWrap.style.height = '6px';
        progressWrap.style.background = 'rgba(255,255,255,0.1)';
        progressWrap.style.borderRadius = '3px';
        progressWrap.style.overflow = 'hidden';
        
        const progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.background = 'linear-gradient(90deg, #b388ff, #ffd700)';
        progressBar.style.transition = 'width 0.4s ease';
        progressBar.style.borderRadius = '3px';
        progressWrap.appendChild(progressBar);
        wrapper.appendChild(progressWrap);
        
        // Status text
        const statusEl = document.createElement('div');
        statusEl.style.color = 'var(--text-secondary)';
        statusEl.style.textAlign = 'center';
        statusEl.style.minHeight = '24px';
        statusEl.style.fontSize = '0.95rem';
        statusEl.textContent = 'Presiona INICIAR para jugar';
        wrapper.appendChild(statusEl);
        
        // Grid of 4 buttons
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
        grid.style.gap = '12px';
        grid.style.width = '260px';
        grid.style.height = '260px';
        
        let score = 0;
        let round = 0;
        let sequence = [];
        let playerSequence = [];
        let isWaitingForPlayer = false;
        
        const buttonsData = [
            { id: 0, color: '#ff4081', glow: 'rgba(255,64,129,0.8)', emoji: '💖' },
            { id: 1, color: '#00e5ff', glow: 'rgba(0,229,255,0.8)', emoji: '✨' },
            { id: 2, color: '#ffd54f', glow: 'rgba(255,213,79,0.8)', emoji: '🌻' },
            { id: 3, color: '#b388ff', glow: 'rgba(179,136,255,0.8)', emoji: '💌' }
        ];
        
        const btnElements = [];
        
        function updateUI() {
            scoreEl.innerHTML = `🧠 ${score} / 1000`;
            levelEl.innerHTML = `Nivel ${round}`;
            progressBar.style.width = Math.min(100, (score / 1000) * 100) + '%';
        }
        
        // Points per round: increases as rounds go up
        function pointsForRound(r) {
            // Round 1=50, 2=75, 3=100, 4=125, 5=150, 6=175, 7=200, etc.
            return 50 + (r - 1) * 25;
        }
        
        // Floating score indicator
        function showFloatingScore(text, color) {
            const f = document.createElement('div');
            f.textContent = text;
            f.style.position = 'absolute';
            f.style.top = '50%';
            f.style.left = '50%';
            f.style.transform = 'translate(-50%, -50%)';
            f.style.color = color;
            f.style.fontWeight = 'bold';
            f.style.fontSize = '1.8rem';
            f.style.fontFamily = 'Outfit, sans-serif';
            f.style.zIndex = '20';
            f.style.pointerEvents = 'none';
            f.style.textShadow = '0 2px 8px rgba(0,0,0,0.6)';
            f.style.transition = 'all 0.8s ease-out';
            wrapper.appendChild(f);
            requestAnimationFrame(() => {
                f.style.transform = 'translate(-50%, -120%)';
                f.style.opacity = '0';
            });
            setTimeout(() => { if (f.parentNode) f.remove(); }, 900);
        }
        
        buttonsData.forEach(data => {
            const btn = document.createElement('div');
            btn.style.backgroundColor = data.color;
            btn.style.borderRadius = 'var(--radius-lg)';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.fontSize = '2.5rem';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.1s';
            btn.style.opacity = '0.6';
            btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            btn.innerHTML = data.emoji;
            
            btn.onclick = () => {
                if (!isWaitingForPlayer) return;
                
                flashButton(data.id, 200);
                playerSequence.push(data.id);
                
                const currentIndex = playerSequence.length - 1;
                if (playerSequence[currentIndex] !== sequence[currentIndex]) {
                    // Wrong! Lose points
                    isWaitingForPlayer = false;
                    const penalty = Math.min(score, 75);
                    score = Math.max(0, score - penalty);
                    updateUI();
                    showFloatingScore('-' + penalty, '#ff4444');
                    statusEl.textContent = '¡Ups! Secuencia incorrecta 💔';
                    statusEl.style.color = '#ff4081';
                    startBtn.style.display = 'inline-block';
                    startBtn.textContent = 'Reintentar 🔄';
                    // Reset sequence for next attempt
                    sequence = [];
                    round = 0;
                    return;
                }
                
                if (playerSequence.length === sequence.length) {
                    // Completed this round!
                    isWaitingForPlayer = false;
                    const pts = pointsForRound(round);
                    score += pts;
                    updateUI();
                    showFloatingScore('+' + pts, '#ffd700');
                    
                    if (score >= 1000) {
                        // WIN!
                        setTimeout(() => {
                            statusEl.innerHTML = '<span style="color:var(--gold)">¡GANASTE! 🎉 1000 PUNTOS</span>';
                            celebrate(wrapper, '¡TIENES UNA MEMORIA INCREÍBLE!');
                            if (window.notifyCarlos) window.notifyCarlos('🧠 Melisa ganó el Simón Dice del Amor (1000 pts).');
                            
                            const winMsg = document.createElement('div');
                            winMsg.style.background = 'rgba(255, 215, 0, 0.1)';
                            winMsg.style.border = '1px solid var(--gold)';
                            winMsg.style.padding = '15px';
                            winMsg.style.borderRadius = '10px';
                            winMsg.style.marginTop = '10px';
                            winMsg.style.textAlign = 'center';
                            winMsg.innerHTML = '<p style="color:var(--gold); font-weight:bold;">Tómale pantallazo y mándaselo a Carlos para tu premio sorpresa 🎁</p>';
                            wrapper.appendChild(winMsg);
                            
                            startBtn.style.display = 'none';
                        }, 500);
                    } else {
                        const messages = [
                            '¡Muy bien! 🌟', '¡Excelente! 💪', '¡Increíble! ✨',
                            '¡Sigue así! 🔥', '¡Eres genial! 💖', '¡Casi llegas! 👑'
                        ];
                        statusEl.textContent = messages[Math.floor(Math.random() * messages.length)];
                        statusEl.style.color = 'var(--gold)';
                        setTimeout(nextRound, 1200);
                    }
                }
            };
            
            btnElements.push(btn);
            grid.appendChild(btn);
        });
        
        function flashButton(id, duration) {
            const btn = btnElements[id];
            const data = buttonsData[id];
            btn.style.opacity = '1';
            btn.style.transform = 'scale(0.93)';
            btn.style.boxShadow = `0 0 25px ${data.glow}, inset 0 0 10px rgba(255,255,255,0.5)`;
            
            setTimeout(() => {
                btn.style.opacity = '0.6';
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            }, duration);
        }
        
        async function playSequence() {
            isWaitingForPlayer = false;
            statusEl.textContent = `Nivel ${round} - Observa... 👀`;
            statusEl.style.color = 'var(--text-primary)';
            
            for (let i = 0; i < sequence.length; i++) {
                await new Promise(r => setTimeout(r, 400));
                flashButton(sequence[i], 400);
                await new Promise(r => setTimeout(r, 500));
            }
            
            statusEl.textContent = '¡Tu turno! 👆';
            isWaitingForPlayer = true;
        }
        
        function nextRound() {
            playerSequence = [];
            round++;
            updateUI();
            sequence.push(Math.floor(Math.random() * 4));
            playSequence();
        }
        
        wrapper.appendChild(grid);
        
        const startBtn = document.createElement('button');
        startBtn.className = 'btn';
        startBtn.textContent = '¡INICIAR!';
        startBtn.style.marginTop = '10px';
        startBtn.style.fontSize = '1rem';
        startBtn.style.padding = '12px 35px';
        
        startBtn.onclick = () => {
            startBtn.style.display = 'none';
            // Remove win message if present
            const extras = wrapper.querySelectorAll('div[style*="border: 1px solid"]');
            extras.forEach(e => e.remove());
            sequence = [];
            round = 0;
            score = 0;
            updateUI();
            nextRound();
        };
        
        wrapper.appendChild(startBtn);
        container.appendChild(wrapper);
    }

    return {
        startMemory,
        startWordSearch,
        startTrivia,
        startPuzzle,
        startRiddle,
        startHangman,
        startRoulette,
        startCatchHearts,
        startSimonSays
    };
})();
