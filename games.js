// ===================================================================
//  UNIVERSO MELISSA - Games Module
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
                    if (window.notifyCarlos) window.notifyCarlos("🎮 Melissa acaba de ganar el Juego de Memoria.");
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
                                    if (window.notifyCarlos) window.notifyCarlos("🎮 Melissa acaba de encontrar todas las palabras en la Sopa de Letras.");
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
            if (window.notifyCarlos) window.notifyCarlos(`🎮 Melissa terminó la Trivia con un puntaje de ${score}/${questions.length}.`);
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
                if (window.notifyCarlos) window.notifyCarlos("🎮 Melissa acaba de armar el Rompecabezas deslizante.");
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
                if (window.notifyCarlos) window.notifyCarlos("🎮 Melissa acaba de descubrir la frase secreta del girasol.");
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
                window.notifyCarlos(`🎰 Melissa giró la ruleta (Intento ${spins}/${WIN_TARGET})`);
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
                    if (window.notifyCarlos) window.notifyCarlos(`🏆 ¡MELISSA GANÓ EL PREMIO EN LA RULETA (Intento ${spins})!`);
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
        wrapper.style.minWidth = '280px';
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
        
        let attempts = parseInt(localStorage.getItem('melisa_attempts_catchhearts') || '0', 10);
        
        overlay.innerHTML = `
            <div style="background:rgba(255, 64, 129, 0.15); border:1px solid var(--pink); padding:10px; border-radius:8px; margin-bottom:12px; text-align:left; font-size:0.8rem; max-width:90%;">
                <strong>📢 AVISO OFICIAL (Desde las 5:30 PM):</strong><br>
                Los premios anteriores eran de prueba 😉. ¡Desde ahora empiezan los <strong>verdaderos premios</strong>!<br>
                Sumas de 2 en 2 y restas 1 por error. Ganas al llegar a <strong>1000 puntos</strong> o al jugar <strong>15 veces</strong>. ¡Tú puedes! 👑
            </div>
            <h2 style="color:var(--pink); margin-bottom:6px; font-size:1.3rem;">💖 Atrapa mi Corazón</h2>
            <p style="margin-bottom:6px; font-size:0.85rem;">Toca los corazones (+2 pts). Evita los 💔 grises (-1 pt).</p>
            <p style="color:var(--gold); font-weight:bold; margin-bottom:15px; font-size:0.95rem;">🎯 Meta: 1000 pts o 15 partidas (Llevas: ${attempts}/15)</p>
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
        let streak = 0; // Combo streak
        
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
            const speed = (Math.random() * 1.5 + 1.1) + (score * 0.0035); // px per frame (~60fps)
            
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
                    streak = 0;
                    score = Math.max(0, score - 1);
                    // Red flash
                    wrapper.style.boxShadow = 'inset 0 0 40px rgba(255,0,0,0.7)';
                    setTimeout(() => { wrapper.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)'; }, 250);
                    // Show -1 floating text
                    showFloating(el, '-1 (Racha rota)', '#ff4444');
                } else {
                    streak++;
                    let pts = 2;
                    let text = '+2';
                    let col = '#ffd700';
                    if (streak === 5) { pts = 5; text = '🔥 COMBO x5! (+5)'; col = '#ff9100'; }
                    else if (streak === 10) { pts = 10; text = '⚡ COMBO x10! (+10)'; col = '#00e5ff'; }
                    else if (streak === 20) { pts = 20; text = '🌟 COMBO x20! (+20)'; col = '#ff4081'; }
                    else if (streak >= 30 && streak % 10 === 0) { pts = 50; text = `👑 RACHA x${streak}! (+50)`; col = '#b388ff'; }
                    score += pts;
                    showFloating(el, text, col);
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
            f.style.top = refEl.style.top;
            f.style.color = color;
            f.style.fontWeight = 'bold';
            f.style.fontSize = '1.3rem';
            f.style.fontFamily = 'Outfit, sans-serif';
            f.style.zIndex = '15';
            f.style.pointerEvents = 'none';
            f.style.transition = 'all 0.6s ease-out';
            wrapper.appendChild(f);
            requestAnimationFrame(() => {
                f.style.transform = 'translateY(-30px)';
                f.style.opacity = '0';
            });
            setTimeout(() => { if (f.parentNode) f.remove(); }, 650);
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
            
            const totalAttempts = parseInt(localStorage.getItem('melisa_attempts_catchhearts') || '0', 10);
            
            if (win || score >= 1000) {
                celebrate(wrapper, '¡OBJETIVO CUMPLIDO! 🎉');
                if (window.notifyCarlos) window.notifyCarlos(`💖 Melissa desbloqueó el premio real de Atrapa mi Corazón (${score} pts, ${totalAttempts} partidas).`);
                overlay.innerHTML = `
                    <h2 style="color:var(--gold); margin-bottom:10px; text-shadow: 0 0 10px rgba(255,215,0,0.5); font-size:1.35rem;">¡PREMIO REAL #1 DESBLOQUEADO! 🎉</h2>
                    <p style="margin-bottom:8px; font-size:0.9rem;">Reto: Atrapa mi Corazón (Puntos: ${score}/1000 | Partidas: ${totalAttempts}/15).</p>
                    <div style="background:rgba(255,215,0,0.15); border:1px solid var(--gold); padding:12px; border-radius:10px; margin-bottom:15px; max-width:90%;">
                        <p style="color:var(--gold); font-weight:bold; font-size:0.95rem;">🎁 Tómale pantallazo y mándaselo a Carlos diciendo: <br><em>"¡Desbloqueé el Regalo Real #1 (Corazones)!"</em> 💕</p>
                    </div>
                `;
            } else {
                overlay.innerHTML = `
                    <h2 style="color:var(--pink); margin-bottom:10px; font-size:1.3rem;">¡BUEN INTENTO! 💪</h2>
                    <p style="margin-bottom:8px;">Hiciste <span style="color:var(--gold); font-weight:bold;">${score}</span> puntos en esta ronda.</p>
                    <p style="margin-bottom:15px; color:#ddd; font-size:0.9rem;">Partidas jugadas: <strong style="color:var(--gold)">${totalAttempts} / 15</strong><br>(¡Sigue intentando hasta alcanzar la meta de 1000 puntos!)</p>
                `;
                const retryBtn = document.createElement('button');
                retryBtn.className = 'btn';
                retryBtn.textContent = 'Jugar otra vez 🔄';
                retryBtn.style.fontSize = '1rem';
                retryBtn.style.padding = '12px 35px';
                retryBtn.onclick = startGame;
                overlay.appendChild(retryBtn);
            }
        }
        
        function startGame() {
            attempts = parseInt(localStorage.getItem('melisa_attempts_catchhearts') || '0', 10) + 1;
            localStorage.setItem('melisa_attempts_catchhearts', attempts);
            
            overlay.style.display = 'none';
            score = 0;
            streak = 0;
            isPlaying = true;
            hearts = [];
            updateScore();
            timeEl.innerHTML = '👑 Modo Maratón';
            
            // Spawn loop progressive based on score
            const scheduleSpawn = () => {
                if (!isPlaying) return;
                createHeart();
                const delay = Math.max(220, 650 - (score * 0.35));
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
        
        // VIP Notice banner
        const vipNotice = document.createElement('div');
        vipNotice.style.background = 'rgba(255, 64, 129, 0.15)';
        vipNotice.style.border = '1px solid var(--pink)';
        vipNotice.style.padding = '10px';
        vipNotice.style.borderRadius = '8px';
        vipNotice.style.fontSize = '0.8rem';
        vipNotice.style.color = '#fff';
        vipNotice.style.maxWidth = '280px';
        vipNotice.style.textAlign = 'left';
        vipNotice.innerHTML = `<strong>📢 AVISO OFICIAL (Desde las 5:30 PM):</strong><br>Los premios anteriores eran de prueba 😉. ¡Empiezan los <strong>verdaderos premios</strong>!<br>Sumas de 2 en 2 y restas 1 por error. Ganas al llegar a <strong>1000 puntos</strong> o al jugar <strong>15 veces</strong>.`;
        wrapper.appendChild(vipNotice);

        // Scoreboard
        const scoreboard = document.createElement('div');
        scoreboard.style.display = 'flex';
        scoreboard.style.justifyContent = 'space-between';
        scoreboard.style.width = '100%';
        scoreboard.style.maxWidth = '280px';
        scoreboard.style.fontFamily = 'Outfit, sans-serif';
        scoreboard.style.fontWeight = 'bold';
        scoreboard.style.fontSize = '0.95rem';
        scoreboard.style.color = 'var(--text-primary)';
        
        let attempts = parseInt(localStorage.getItem('melisa_attempts_simonsays') || '0', 10);
        
        const scoreEl = document.createElement('div');
        scoreEl.innerHTML = `🧠 0 / 1000`;
        
        const levelEl = document.createElement('div');
        levelEl.innerHTML = `🎮 Partidas: ${attempts}/15`;
        
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
        let streak = 0;
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
            levelEl.innerHTML = `🎮 Partidas: ${attempts}/15`;
            progressBar.style.width = Math.min(100, (score / 1000) * 100) + '%';
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
                    // Wrong! Lose 1 point
                    isWaitingForPlayer = false;
                    streak = 0;
                    score = Math.max(0, score - 1);
                    updateUI();
                    showFloatingScore('-1 (Racha rota)', '#ff4444');
                    statusEl.textContent = `¡Ups! Secuencia incorrecta (-1 pt) 💔`;
                    statusEl.style.color = '#ff4081';
                    startBtn.style.display = 'inline-block';
                    startBtn.textContent = 'Reintentar 🔄';
                    sequence = [];
                    round = 0;
                    return;
                }
                
                // Correct tap!
                score += 2;
                updateUI();
                
                if (playerSequence.length === sequence.length) {
                    // Completed this round!
                    isWaitingForPlayer = false;
                    streak++;
                    let bono = 20;
                    let text = '+20 Bono';
                    let col = '#ffd700';
                    if (streak === 2) { bono = 35; text = '🔥 COMBO x5! (+35)'; col = '#ff9100'; }
                    else if (streak === 3) { bono = 50; text = '⚡ COMBO x10! (+50)'; col = '#00e5ff'; }
                    else if (streak === 4) { bono = 80; text = '🌟 COMBO x20! (+80)'; col = '#ff4081'; }
                    else if (streak >= 5) { bono = 120; text = `👑 RACHA x50! (+120)`; col = '#b388ff'; }
                    
                    score += bono;
                    updateUI();
                    showFloatingScore(text, col);
                    
                    if (sequence.length >= 7) {
                        sequence = [];
                    }
                    
                    if (score >= 1000) {
                        // WIN!
                        setTimeout(() => {
                            statusEl.innerHTML = '<span style="color:var(--gold)">¡GANASTE TU PREMIO REAL #2! 🎉</span>';
                            celebrate(wrapper, '¡INCREÍBLE!');
                            if (window.notifyCarlos) window.notifyCarlos(`🧠 Melissa ganó Simón Dice del Amor (${score} pts, ${attempts} partidas).`);
                            
                            const winMsg = document.createElement('div');
                            winMsg.style.background = 'rgba(255, 215, 0, 0.15)';
                            winMsg.style.border = '1px solid var(--gold)';
                            winMsg.style.padding = '15px';
                            winMsg.style.borderRadius = '10px';
                            winMsg.style.marginTop = '10px';
                            winMsg.style.textAlign = 'center';
                            winMsg.innerHTML = '<p style="color:var(--gold); font-weight:bold; font-size:0.95rem;">🏆 ¡PREMIO REAL #2 DESBLOQUEADO!<br>🎁 Tómale pantallazo y mándaselo a Carlos diciendo: <br><em>"¡Desbloqueé el Regalo Real #2 (Simón Dice)!"</em> 👑</p>';
                            wrapper.appendChild(winMsg);
                            
                            startBtn.style.display = 'none';
                        }, 500);
                    } else {
                        const messages = [
                            `¡Muy bien! (${text}) 🌟`, `¡Excelente! (${text}) 💪`, `¡Increíble! (${text}) ✨`,
                            `¡Sigue así! (${text}) 🔥`, `¡Eres genial! (${text}) 💖`
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
            attempts = parseInt(localStorage.getItem('melisa_attempts_simonsays') || '0', 10) + 1;
            localStorage.setItem('melisa_attempts_simonsays', attempts);
            
            startBtn.style.display = 'none';
            const extras = wrapper.querySelectorAll('div[style*="border: 1px solid"]');
            extras.forEach(e => { if (e !== vipNotice) e.remove(); });
            sequence = [];
            round = 0;
            score = 0;
            updateUI();
            nextRound();
        };
        
        wrapper.appendChild(startBtn);
        container.appendChild(wrapper);
    }

    // ==========================================
    //  GAME 10: LAS CAJITAS MÁGICAS DE CARLOS
    // ==========================================
    function startMagicBoxes(container, config) {
        container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'game-magicboxes';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '15px';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '400px';
        wrapper.style.margin = '0 auto';
        wrapper.style.padding = '10px';

        // Automatic clean reset for v28 or ?reset=1
        if (localStorage.getItem('melisa_v28_reset') !== 'true' || window.location.search.includes('reset=1')) {
            localStorage.removeItem('melisa_magicboxes_digits');
            localStorage.removeItem('melisa_magicboxes_total');
            localStorage.setItem('melisa_v28_reset', 'true');
        }

        let totalExplored = parseInt(localStorage.getItem('melisa_magicboxes_total') || '0', 10);
        let won = false;
        
        // Secret 5-digit code: 26275
        const SECRET_CODE = ['2', '6', '2', '7', '5'];
        let unlockedDigits = JSON.parse(localStorage.getItem('melisa_magicboxes_digits') || '[]');

        const instructions = document.createElement('p');
        instructions.style.color = 'var(--text-secondary)';
        instructions.style.textAlign = 'center';
        instructions.style.fontSize = '0.95rem';
        instructions.style.margin = '0';
        instructions.innerHTML = '✨ ¡Hola mi reina! Toca cualquier cajita para descubrir pensamientos mágicos. <br><strong>¡Atenta! Irán apareciendo pistas secretas. ¡Tómales pantallazo porque las necesitarás para abrir el candado final!</strong> 📸🔐';
        wrapper.appendChild(instructions);

        const counterEl = document.createElement('div');
        counterEl.style.fontFamily = 'Outfit, sans-serif';
        counterEl.style.fontWeight = 'bold';
        counterEl.style.fontSize = '1rem';
        counterEl.style.color = 'var(--gold)';
        counterEl.style.textAlign = 'center';
        counterEl.innerHTML = `🔐 Pistas descubiertas hoy: ${unlockedDigits.length} <br><span style="font-size:0.8rem; color:var(--text-secondary);">Cajitas exploradas: ${totalExplored}</span>`;
        wrapper.appendChild(counterEl);

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.style.gap = '15px';
        grid.style.width = '100%';
        grid.style.marginTop = '10px';

        // Mega-banco generator (Thousands of variations)
        const openers = [
            "Mi princesa hermosa,", "Mi consentida preciosa,", "Reina de mi corazón,", "Mi guerrera valiente,", 
            "Amor de mi vida,", "Mi tesoro más preciado,", "Mi muñeca hermosa,", "Vida mía,", "Mi campeona inolvidable,", 
            "Mi dulce Melissa,", "Mi consentida adorada,", "Dueña de mi universo,", "Mi inspiración diaria,", "Mi razón de ser,"
        ];
        const cores = [
            "cada segundo que pasa admiro más tu fortaleza y cómo superas cada día de recuperación.",
            "eres la casualidad más hermosa y el regalo más grande que me ha dado el universo.",
            "mi lugar favorito en todo el mundo siempre será estar a tu lado abrazándote y cuidándote.",
            "tu sonrisa tiene el poder mágico de iluminar hasta los días más nublados.",
            "me encanta cocinar para ti, consentirte y verte recuperar tu energía día tras día.",
            "no hay cirugía ni obstáculo en este mundo que pueda detener a una mujer tan extraordinaria como tú.",
            "cuento los minutos para que termines tu reposo y podamos salir a celebrar nuestro gran amor.",
            "tu ternura, tu valentía y tu dulzura me enamoran mil veces más cada mañana.",
            "este Universo Melissa fue creado exclusivamente para recordarte lo infinitamente especial que eres.",
            "adoro cuando me miras, cuando sonríes y cuando me dejas consentirte como mereces.",
            "eres mi compañera inseparable, mi cómplice perfecta y el gran amor de mi existencia.",
            "que nunca se te olvide que tienes a un hombre que te adora y que da todo por verte feliz.",
            "cada cajita que abres lleva impregnado un beso enorme y un abrazo calientito para ti.",
            "la semana 1 de tu recuperación ha demostrado que eres una verdadera superhéroe de carne y hueso.",
            "tu salud y tu bienestar son mi prioridad número uno hoy, mañana y siempre."
        ];
        const endings = [
            "¡Te amo infinito! 💖", "¡Eres mi todo, mi cielo! ✨", "¡Estoy inmensamente orgulloso de ti! 🌹", 
            "¡Siempre contigo en cada paso! 🥰", "¡Pronto te daré mil besos de premio! 💋", "¡Eres el amor de mi vida! 👑",
            "¡Eres pura magia y dulzura! 🦋", "¡Te adoro con todo mi corazón! 💞", "¡Eres mi consentida eterna! 🌟"
        ];

        function getRandomRomanticMessage() {
            const op = openers[Math.floor(Math.random() * openers.length)];
            const co = cores[Math.floor(Math.random() * cores.length)];
            const en = endings[Math.floor(Math.random() * endings.length)];
            return { emoji: '💌', title: 'Pensamiento de Carlos', text: `${op} ${co} ${en}` };
        }

        function checkDigitUnlock() {
            const now = new Date();
            const hour = now.getHours();
            const isTestWin = window.location.search.includes('win=1');
            
            // First code strictly at 10:00 AM, then every 2 hours: >=12, >=14, >=16, >=18
            const conditions = [
                hour >= 10,
                hour >= 12,
                hour >= 14,
                hour >= 16,
                hour >= 18
            ];

            for (let i = 0; i < conditions.length; i++) {
                if ((conditions[i] || isTestWin) && unlockedDigits.length === i) {
                    const digit = SECRET_CODE[i];
                    unlockedDigits.push(digit);
                    localStorage.setItem('melisa_magicboxes_digits', JSON.stringify(unlockedDigits));
                    return {
                        emoji: '📸',
                        title: `¡PISTA #${unlockedDigits.length} DESCUBIERTA!`,
                        text: `¡Atención mi princesa! Ha aparecido la <strong>Pista #${unlockedDigits.length}</strong> para el candado final:<br><br><span style="font-size:2.8rem; color:var(--gold); background:rgba(0,0,0,0.5); padding:5px 20px; border-radius:12px; border:2px dashed var(--gold); display:inline-block; margin:10px 0;">[ ${digit} ]</span><br><br>📸 <strong>¡TÓMALE PANTALLAZO AHORA MISMO!</strong> Guárdalo muy bien porque necesitarás todas las pistas que encuentres para abrir la Llave Dorada.`,
                        isDigit: true
                    };
                }
            }
            return null;
        }

        function createGrid() {
            grid.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const boxBtn = document.createElement('div');
                boxBtn.style.background = 'linear-gradient(135deg, rgba(255,64,129,0.25), rgba(0,229,255,0.15))';
                boxBtn.style.border = '2px solid var(--accent-pink)';
                boxBtn.style.borderRadius = '15px';
                boxBtn.style.aspectRatio = '1';
                boxBtn.style.display = 'flex';
                boxBtn.style.alignItems = 'center';
                boxBtn.style.justifyContent = 'center';
                boxBtn.style.cursor = 'pointer';
                boxBtn.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                boxBtn.style.boxShadow = '0 5px 15px rgba(255,64,129,0.2)';
                boxBtn.style.userSelect = 'none';

                // NO BOX NUMBERS!
                boxBtn.innerHTML = '<span style="font-size:2.5rem; transition:transform 0.3s;">🎁</span>';

                boxBtn.onmouseenter = () => { boxBtn.style.transform = 'scale(1.08) translateY(-3px)'; };
                boxBtn.onmouseleave = () => { boxBtn.style.transform = 'scale(1)'; };

                boxBtn.onclick = () => {
                    if (won) return;
                    totalExplored++;
                    localStorage.setItem('melisa_magicboxes_total', totalExplored);

                    // Shuffle visual effect on all boxes immediately!
                    Array.from(grid.children).forEach((b) => {
                        b.style.transform = 'scale(0.85) rotate(' + ((Math.random() - 0.5) * 30) + 'deg)';
                        b.style.borderColor = 'var(--gold)';
                        setTimeout(() => {
                            b.style.transform = 'scale(1) rotate(0deg)';
                            b.style.borderColor = 'var(--accent-pink)';
                        }, 250);
                    });

                    const now = new Date();
                    // Lock appears after 7:59 PM (19:59) -> i.e. (hour == 19 && min >= 59) || hour >= 20
                    const isAfter759PM = (now.getHours() === 19 && now.getMinutes() >= 59) || now.getHours() >= 20 || window.location.search.includes('win=1');

                    if (isAfter759PM) {
                        showPadlockModal();
                        return;
                    }

                    // Check if she unlocked a new clue!
                    const digitData = checkDigitUnlock();
                    const msgData = digitData || getRandomRomanticMessage();

                    counterEl.innerHTML = `🔐 Pistas descubiertas hoy: ${unlockedDigits.length} <br><span style="font-size:0.8rem; color:var(--text-secondary);">Cajitas exploradas: ${totalExplored}</span>`;

                    showBoxModal(msgData, false, () => {
                        // On modal close, shuffle and keep boxes closed!
                        createGrid();
                    });
                };

                grid.appendChild(boxBtn);
            }
        }

        function showPadlockModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100vw';
            modalOverlay.style.height = '100vh';
            modalOverlay.style.background = 'rgba(0,0,0,0.88)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.zIndex = '99999';
            modalOverlay.style.padding = '20px';

            const card = document.createElement('div');
            card.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
            card.style.border = '2px solid var(--gold)';
            card.style.borderRadius = '20px';
            card.style.padding = '25px';
            card.style.maxWidth = '360px';
            card.style.width = '100%';
            card.style.textAlign = 'center';
            card.style.boxShadow = '0 0 40px rgba(255,215,0,0.6)';

            card.innerHTML = `
                <div style="font-size:3.5rem; margin-bottom:10px;">🔐</div>
                <h3 style="color:var(--gold); font-family:'Outfit', sans-serif; margin-bottom:10px; font-size:1.3rem;">¡CANDADO REAL DE LAS 7:00 PM!</h3>
                <p style="color:var(--text-primary); font-size:0.95rem; line-height:1.4; margin-bottom:15px;">
                    ¡Mi amor! Has llegado al momento cumbre. Para abrir esta cajita y obtener la Llave Dorada, ingresa el <strong>Código Secreto de 5 dígitos</strong> que recolectaste en tus pantallazos hoy:
                </p>
                <input type="text" id="secretCodeInput" maxlength="5" placeholder="Ej: 72495" style="width:80%; padding:12px; font-size:1.4rem; text-align:center; letter-spacing:6px; border-radius:10px; border:2px solid var(--gold); background:#0f172a; color:#fff; font-weight:bold; margin-bottom:15px; outline:none;">
                <div id="lockError" style="color:#ff4081; font-size:0.85rem; margin-bottom:12px; display:none;">❌ Código incorrecto. ¡Revisa tus pantallazos mi amor!</div>
                <button id="unlockBtn" class="btn" style="background:var(--gold); color:#000; font-weight:bold; padding:12px 25px; border-radius:30px; border:none; cursor:pointer; width:100%;">
                    ¡DESBLOQUEAR LLAVE DORADA! 🗝️
                </button>
                <button id="closeLockBtn" style="background:transparent; color:var(--text-secondary); border:none; margin-top:12px; cursor:pointer; font-size:0.85rem;">Seguir intentando luego</button>
            `;

            modalOverlay.appendChild(card);
            document.body.appendChild(modalOverlay);

            const input = card.querySelector('#secretCodeInput');
            const err = card.querySelector('#lockError');
            const unlockBtn = card.querySelector('#unlockBtn');
            const closeBtn = card.querySelector('#closeLockBtn');

            closeBtn.onclick = () => modalOverlay.remove();

            unlockBtn.onclick = () => {
                const val = input.value.trim();
                const target = SECRET_CODE.join('');
                if (val === target || window.location.search.includes('win=1')) {
                    modalOverlay.remove();
                    won = true;
                    celebrate(wrapper, '¡CANDADO ABIERTO!');
                    if (window.notifyCarlos) window.notifyCarlos('🏆 Melissa ingresó el código 72495 y desbloqueó la Llave Dorada.');

                    const winMsg = document.createElement('div');
                    winMsg.style.background = 'rgba(255, 215, 0, 0.18)';
                    winMsg.style.border = '2px solid var(--gold)';
                    winMsg.style.padding = '20px';
                    winMsg.style.borderRadius = '15px';
                    winMsg.style.marginTop = '15px';
                    winMsg.style.textAlign = 'center';
                    winMsg.style.width = '100%';
                    winMsg.style.animation = 'pulse 2s infinite';
                    winMsg.innerHTML = `
                        <div style="font-size:3rem; margin-bottom:8px;">🗝️👑</div>
                        <h3 style="color:var(--gold); margin:0 0 8px 0; font-size:1.3rem;">¡PREMIO REAL DÍA 7 DESBLOQUEADO! 🎉</h3>
                        <p style="color:var(--text-primary); font-size:0.95rem; margin-bottom:15px;">¡Lo lograste mi campeona! Descifraste el código <strong>${target}</strong> y abriste mi corazón.</p>
                        <div style="background:rgba(0,0,0,0.6); padding:15px; border-radius:10px; border:2px dashed var(--gold);">
                            <p style="color:var(--gold); font-weight:bold; font-size:1rem; margin:0; line-height:1.4;">
                                📸 <strong>¡Envíame el pantallazo de esta pantalla ahora mismo, mi amor!</strong><br><br>
                                <span style="color:#fff; font-weight:normal;">Diciéndome:<br><em>"¡Mi rey, descifré el código ${target} y encontré la Llave de Oro en las Cajitas del Día 7!"</em> 🗝️💖</span>
                            </p>
                        </div>
                    `;
                    wrapper.innerHTML = '';
                    wrapper.appendChild(winMsg);
                } else {
                    err.style.display = 'block';
                    input.style.borderColor = '#ff4081';
                }
            };
        }

        createGrid();
        wrapper.appendChild(grid);

        function showBoxModal(data, isFinal, onClose) {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100vw';
            modalOverlay.style.height = '100vh';
            modalOverlay.style.background = 'rgba(0,0,0,0.85)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.zIndex = '99999';
            modalOverlay.style.padding = '20px';

            const card = document.createElement('div');
            card.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
            card.style.border = data.isDigit ? '2px solid var(--gold)' : '2px solid var(--accent-pink)';
            card.style.borderRadius = '20px';
            card.style.padding = '25px';
            card.style.maxWidth = '340px';
            card.style.width = '100%';
            card.style.textAlign = 'center';
            card.style.boxShadow = data.isDigit ? '0 0 40px rgba(255,215,0,0.6)' : '0 0 30px rgba(255,64,129,0.5)';

            card.innerHTML = `
                <div style="font-size:3.5rem; margin-bottom:10px;">${data.emoji}</div>
                <h3 style="color:${data.isDigit ? 'var(--gold)' : 'var(--accent-pink)'}; font-family:'Outfit', sans-serif; margin-bottom:12px; font-size:1.3rem;">${data.title}</h3>
                <p style="color:var(--text-primary); font-size:1.05rem; line-height:1.5; margin-bottom:20px;">${data.text}</p>
                <button class="btn" style="background:${data.isDigit ? 'var(--gold)' : 'var(--accent-pink)'}; color:#000; font-weight:bold; padding:10px 25px; border-radius:30px; border:none; cursor:pointer;">
                    ${data.isDigit ? '¡Ya le tomé pantallazo! 📸' : '¡Seguir descubriendo sorpresas! 💕'}
                </button>
            `;

            const btn = card.querySelector('button');
            btn.onclick = () => {
                modalOverlay.remove();
                if (onClose) onClose();
            };

            modalOverlay.appendChild(card);
            document.body.appendChild(modalOverlay);
        }

        container.appendChild(wrapper);
    }

    // ==========================================
    // 10. TRAGAMONEDAS DEL AMOR (SLOTS - DÍA 8 SIN PREMIO)
    // ==========================================
    function startSlots(container, config = {}) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-slots';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '20px';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '420px';
        wrapper.style.margin = '0 auto';
        wrapper.style.padding = '15px';

        let totalSpins = parseInt(localStorage.getItem('melisa_slots_total') || '0', 10);

        const instructions = document.createElement('p');
        instructions.style.color = 'var(--text-secondary)';
        instructions.style.textAlign = 'center';
        instructions.style.fontSize = '0.95rem';
        instructions.style.margin = '0';
        instructions.innerHTML = '✨ ¡Hola mi hermosa princesa! Jala la palanca o presiona el botón para girar los rodillos. <br><strong>¡Descubre hermosas dedicatorias y celebra tus 8 días de valiente recuperación!</strong> 💖🎰';
        wrapper.appendChild(instructions);

        const counterEl = document.createElement('div');
        counterEl.style.fontFamily = 'Outfit, sans-serif';
        counterEl.style.fontWeight = 'bold';
        counterEl.style.fontSize = '1.1rem';
        counterEl.style.color = 'var(--gold)';
        counterEl.style.textAlign = 'center';
        counterEl.innerHTML = `💫 Giros de amor hoy: ${totalSpins}`;
        wrapper.appendChild(counterEl);

        // Slot Machine Frame
        const machineFrame = document.createElement('div');
        machineFrame.style.background = 'linear-gradient(145deg, #1f1f2e, #14141f)';
        machineFrame.style.border = '3px solid var(--gold)';
        machineFrame.style.borderRadius = '20px';
        machineFrame.style.padding = '25px 20px';
        machineFrame.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.2)';
        machineFrame.style.width = '100%';
        machineFrame.style.display = 'flex';
        machineFrame.style.flexDirection = 'column';
        machineFrame.style.alignItems = 'center';
        machineFrame.style.gap = '20px';

        // Reels Container
        const reelsBox = document.createElement('div');
        reelsBox.style.display = 'grid';
        reelsBox.style.gridTemplateColumns = 'repeat(3, 1fr)';
        reelsBox.style.gap = '15px';
        reelsBox.style.width = '100%';

        const symbols = ['👑', '💖', '🌹', '💋', '🦋', '⭐', '🎁'];
        const reelEls = [];

        for (let i = 0; i < 3; i++) {
            const reel = document.createElement('div');
            reel.style.background = '#0d0d14';
            reel.style.border = '2px solid rgba(0, 229, 255, 0.4)';
            reel.style.borderRadius = '15px';
            reel.style.height = '100px';
            reel.style.display = 'flex';
            reel.style.alignItems = 'center';
            reel.style.justifyContent = 'center';
            reel.style.fontSize = '3.5rem';
            reel.style.boxShadow = 'inset 0 0 15px rgba(0,0,0,0.8)';
            reel.style.transition = 'transform 0.1s';
            reel.textContent = symbols[i];
            reelsBox.appendChild(reel);
            reelEls.push(reel);
        }
        machineFrame.appendChild(reelsBox);

        // Spin Button
        const spinBtn = document.createElement('button');
        spinBtn.style.background = 'linear-gradient(135deg, var(--gold), #ffa500)';
        spinBtn.style.color = '#000';
        spinBtn.style.border = 'none';
        spinBtn.style.padding = '16px 30px';
        spinBtn.style.borderRadius = '50px';
        spinBtn.style.fontSize = '1.2rem';
        spinBtn.style.fontWeight = 'bold';
        spinBtn.style.cursor = 'pointer';
        spinBtn.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
        spinBtn.style.transition = 'all 0.2s ease';
        spinBtn.style.width = '90%';
        spinBtn.innerHTML = '🎰 ¡GIRAR RODILLOS! ✨';
        machineFrame.appendChild(spinBtn);

        wrapper.appendChild(machineFrame);

        // Romantic Phrases for Day 8 (Massive personalized pool from Carlos & Melissa's universe)
        const jackpotPhrases = [
            "👑 ¡ALINEASTE 3 CORONAS DE MI REINA! Mi vida hermosa, hoy cumples 8 días siendo una campeona indiscutible en tu recuperación. No necesitas ningún premio terrenal porque tú eres el tesoro más invaluable de mi vida. ¡Estoy tan orgulloso de ti!",
            "💖 ¡TRIPLE CORAZÓN DE AMOR ETERNO! Mi princesa, cada uno de tus esfuerzos en esta recuperación me llena el alma de admiración. Te amo hoy, mañana y para siempre.",
            "🌹 ¡ROSAS DE AMOR INFINITO! En este Día 8 quiero recordarte que pase lo que pase, siempre estaré aquí sosteniendo tu mano y cuidando tu hermoso corazón.",
            "✨ ¡JACKPOT DE ESTRELLAS! ¿Te acuerdas de cuando empezó esta semana de reposo? ¡Ya llevamos 8 días superados juntos! Eres la mujer más valiente y fuerte que conozco.",
            "🦋 ¡ALINEACIÓN MARIPOSA! Al igual que una mariposa, estás sanando y preparándote para extender tus alas muy pronto. ¡Qué ganas tengo de nuestra próxima cita cuando estés al 100%!",
            "💋 ¡BESOS POR MIL! Si este tragamonedas fuera en la vida real, este jackpot te daría un millón de besos y abrazos consentidores en el sofá. ¡Te adoro mi reina!",
            "🎁 ¡EL REGALO ERES TÚ! No puse premios físicos hoy porque la verdadera celebración es ver cómo mejoras cada día. Eres el regalo más grande que me dio el universo.",
            "👑 ¡REINA DE MI UNIVERSO! Creé esta aplicación y cada uno de estos minijuegos solo para ver sonreír a mi princesa preferida mientras descansa. ¡Eres mi todo!",
            "💖 ¡AMOR INCONDICIONAL X3! Ni la distancia ni los días de reposo pueden apagar lo mucho que te amo. ¡Ya falta un día menos para abrazarnos súper fuerte!",
            "🌹 ¡ROSAS DORADAS! Cada sonrisa tuya ilumina mi mundo entero. Gracias por ser tan dulce, tan paciente y tan hermosa. ¡Felicidades por tu octavo día de recuperación!",
            "✨ ¡JACKPOT DE LUZ! Eres la persona favorita de mis días, mis tardes y mis noches. ¡Que nunca se te olvide lo increíblemente especial que eres para mí!",
            "👑 ¡TRIPLE CORONA REAL! Si pudiera darte un trofeo por cada día que te has portado tan bien en tu recuperación, ya tendrías un palacio lleno de oro. ¡Te amo mi vida!",
            "💖 ¡CORAZONES AL 100%! Mi amor por ti crece más rápido que los giros de esta máquina. ¡Eres y serás siempre mi consentida hermosa!",
            "🦋 ¡VUELO DE AMOR! Imagínate cuando terminemos el mes y salgamos a celebrar tu salud al máximo. ¡Ese día será el verdadero jackpot para los dos!",
            "🎁 ¡SORPRESA DEL ALMA! Mi mayor felicidad es saber que estás descansando, comiendo rico y dejándote consentir. ¡Te amo infinito!"
        ];

        const match2Phrases = [
            "💖 ¡Doble Corazón! Tu sonrisa ilumina mis días más que cualquier estrella en el firmamento. ¡Sigue adelante mi reina!",
            "👑 ¡Doble Corona! Eres la dueña indiscutible de mis pensamientos y de mi vida. ¡Te amo muchísimo!",
            "💋 ¡Besos Mágicos! Te mando un millón de abrazos y consentimientos para que tu cuerpo siga sanando de maravilla.",
            "⭐ ¡Estrellas Alineadas! Nuestro amor estaba destinado desde antes de conocernos. ¡Eres mi bendición más grande!",
            "🌹 ¡Doble Rosa! Qué hermosa te ves hoy descansando. ¡Recuerda tomar tu agua y no hacer esfuerzos bruscos!",
            "🦋 ¡Par de Mariposas! Cada día que pasa te siento más cerquita de mi corazón. ¡Eres una guerrera hermosa!",
            "🎁 ¡Doble Sorpresa! ¿Sabías que cada vez que sonríes me alegras el día por completo? ¡Te adoro princesa!",
            "💖 ¡Coincidencia Mágica! Así como coincidieron estos rodillos, coincidieron nuestras almas en este universo.",
            "👑 ¡Reina y Corazón! Tú mandas en mi corazón hoy, mañana y siempre. ¡Disfruta tu Día 8 mi amor!",
            "⭐ ¡Doble Brillo! Tu valentía durante estos días de reposo me inspira muchísimo. ¡Estoy muy orgulloso de ti!",
            "💋 ¡Doble Besito! Un besito en tu frente y otro en tu mejilla para que tengas un día súper bendecido y tranquilo.",
            "🌹 ¡Par de Rosas para la flor más hermosa! Nunca olvides cuánto te valoro y respeto mi vida.",
            "🦋 ¡Alas de Amor! Ya falta menos para salir a pasear de la mano. ¡Por ahora a seguir descansando como reina!",
            "💖 ¡Latidos Unidos! Mi corazón late al mismo ritmo que el tuyo. ¡Todo va a salir excelente mi amor!",
            "🎁 ¡Regalo de Alegría! Espero que este minijuego te saque una hermosa sonrisa en esta linda mañana."
        ];

        const match0Phrases = [
            "💫 ¡Casi se alinean todos! Pero en mi corazón tú siempre te llevas el premio mayor todos los días. ¡Gira otra vez mi amor!",
            "🦋 ¡Sigue girando hermosa! Cada día que pasa estás más fuerte, más sana y hermosa. ¡Te adoro!",
            "🎁 ¡El mejor regalo ya lo tengo yo al tenerte a ti en mi vida! Vuelve a girar para descubrir más piropos.",
            "💖 ¡No salieron iguales, pero mi amor por ti sí es igual de gigante todos los días! ¡Intenta otro giro princesa!",
            "👑 ¡Una reina no se rinde! Dale otra vez al botón y veamos qué hermosa frase te sale en el siguiente intento.",
            "⭐ ¡La suerte es mía por tener a una mujer tan maravillosa como tú! ¡Jala la palanca otra vez!",
            "🌹 ¡Una rosa virtual mientras giran los rodillos! Recuerda que te amo con todo mi ser.",
            "💋 ¡Un besito de la suerte de parte de tu rey Carlos para el próximo giro! ¡Tú puedes mi vida!",
            "✨ ¡Gira sin parar mi reina! Hoy los giros son infinitos para que te diviertas todo el día.",
            "💫 ¡Cada giro es un pretexto más para decirte lo mucho que me encantas! ¡Dale otra vez!"
        ];

        let isSpinning = false;

        spinBtn.onclick = () => {
            if (isSpinning) return;
            isSpinning = true;
            spinBtn.style.opacity = '0.5';
            spinBtn.style.cursor = 'not-allowed';
            spinBtn.innerHTML = '💫 ¡Girando...!';

            totalSpins++;
            localStorage.setItem('melisa_slots_total', totalSpins.toString());
            counterEl.innerHTML = `💫 Giros de amor hoy: ${totalSpins}`;

            // Determine outcome
            // Every 4th spin or 25% chance gives a JACKPOT (3 matching)
            const isJackpot = (totalSpins % 4 === 0) || (Math.random() < 0.25);
            // 50% chance of 2 matching if not jackpot
            const isMatch2 = !isJackpot && (Math.random() < 0.6);

            let finalSymbols = [];
            if (isJackpot) {
                const s = symbols[Math.floor(Math.random() * symbols.length)];
                finalSymbols = [s, s, s];
            } else if (isMatch2) {
                const s = symbols[Math.floor(Math.random() * symbols.length)];
                let s2 = symbols[Math.floor(Math.random() * symbols.length)];
                while (s2 === s) s2 = symbols[Math.floor(Math.random() * symbols.length)];
                finalSymbols = [s, s, s2];
                // Shuffle the positions
                finalSymbols.sort(() => Math.random() - 0.5);
            } else {
                // 3 distinct
                const shuffled = [...symbols].sort(() => Math.random() - 0.5);
                finalSymbols = [shuffled[0], shuffled[1], shuffled[2]];
            }

            // Spin animation loops
            const intervals = [];
            for (let i = 0; i < 3; i++) {
                intervals[i] = setInterval(() => {
                    reelEls[i].textContent = symbols[Math.floor(Math.random() * symbols.length)];
                }, 80);
            }

            // Stop reels one by one
            setTimeout(() => {
                clearInterval(intervals[0]);
                reelEls[0].textContent = finalSymbols[0];
            }, 800);

            setTimeout(() => {
                clearInterval(intervals[1]);
                reelEls[1].textContent = finalSymbols[1];
            }, 1400);

            setTimeout(() => {
                clearInterval(intervals[2]);
                reelEls[2].textContent = finalSymbols[2];
                isSpinning = false;
                spinBtn.style.opacity = '1';
                spinBtn.style.cursor = 'pointer';
                spinBtn.innerHTML = '🎰 ¡GIRAR RODILLOS! ✨';

                // Show modal result
                let title = '💫 ¡Giro Mágico!';
                let text = '';
                let emoji = '💕';

                if (isJackpot) {
                    emoji = '🎉👑';
                    title = '✨ ¡SUPER JACKPOT DEL DÍA 8! ✨';
                    text = jackpotPhrases[Math.floor(Math.random() * jackpotPhrases.length)];
                } else if (isMatch2) {
                    emoji = '💖✨';
                    title = '🌸 ¡Hermosa Coincidencia!';
                    text = match2Phrases[Math.floor(Math.random() * match2Phrases.length)];
                } else {
                    emoji = '🍀';
                    title = '💫 ¡Pensamiento para ti!';
                    text = match0Phrases[Math.floor(Math.random() * match0Phrases.length)];
                }

                showSlotsModal({ emoji, title, text });
            }, 2000);
        };

        function showSlotsModal({ emoji, title, text }) {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100vw';
            modalOverlay.style.height = '100vh';
            modalOverlay.style.background = 'rgba(0,0,0,0.85)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.zIndex = '10000';
            modalOverlay.style.padding = '20px';

            const card = document.createElement('div');
            card.style.background = 'linear-gradient(145deg, #1a1a2e, #16213e)';
            card.style.border = '2px solid var(--gold)';
            card.style.borderRadius = '20px';
            card.style.padding = '25px';
            card.style.maxWidth = '400px';
            card.style.width = '100%';
            card.style.textAlign = 'center';
            card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.8)';
            card.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            card.innerHTML = `
                <div style="font-size:3.5rem; margin-bottom:10px;">${emoji}</div>
                <h3 style="color:var(--gold); margin:0 0 12px 0; font-family:'Outfit',sans-serif; font-size:1.4rem;">${title}</h3>
                <p style="color:var(--text-primary); font-size:1rem; line-height:1.6; margin-bottom:20px;">${text}</p>
                <button style="background:var(--cyan); color:#000; border:none; padding:12px 28px; border-radius:30px; font-weight:bold; font-size:1rem; cursor:pointer; box-shadow:0 4px 15px rgba(0,229,255,0.4);">
                    💖 ¡Seguir girando y celebrando! 🎰
                </button>
            `;

            card.querySelector('button').onclick = () => {
                modalOverlay.remove();
            };

            modalOverlay.appendChild(card);
            document.body.appendChild(modalOverlay);
        }

        container.appendChild(wrapper);
    }

    // =============================================
    //  DÍA 9: TANDA DE PENALES DEL AMOR ⚽🏆
    // =============================================
    function startPenalties(container, config) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-penalties';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '500px';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.position = 'relative';

        let goals = parseInt(localStorage.getItem('melisa_penalties_goals') || '0', 10);

        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '20px';
        header.innerHTML = `
            <h2 style="color:var(--gold); font-family:'Outfit',sans-serif; margin-bottom:5px;">🏆 Tanda de Penales del Amor ⚽</h2>
            <p style="color:var(--text-secondary); font-size:0.95rem;">¡Métele un golazo al portero profesional! Juega rondas infinitas hoy.</p>
            <div id="penalties-counter" style="background:rgba(0,229,255,0.15); border:1px solid var(--cyan); padding:8px 18px; border-radius:20px; color:var(--cyan); font-weight:bold; display:inline-block; margin-top:10px; font-size:1.1rem; box-shadow:0 4px 12px rgba(0,229,255,0.2);">
                🏆 Goles de amor hoy: ${goals}
            </div>
        `;
        wrapper.appendChild(header);

        // Professional Stadium & Goal Frame
        const stadium = document.createElement('div');
        stadium.style.width = '100%';
        stadium.style.height = '260px';
        stadium.style.background = 'linear-gradient(180deg, #112233 0%, #1a4a24 45%, #226630 100%)';
        stadium.style.border = '3px solid var(--gold)';
        stadium.style.borderRadius = '18px';
        stadium.style.position = 'relative';
        stadium.style.overflow = 'hidden';
        stadium.style.boxShadow = '0 12px 30px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.4)';

        // Turf pattern
        const turf = document.createElement('div');
        turf.style.position = 'absolute';
        turf.style.inset = '0';
        turf.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.08) 20px, rgba(0,0,0,0.08) 40px)';
        turf.style.pointerEvents = 'none';
        stadium.appendChild(turf);

        // Goal Post with Net Grid
        const goalPost = document.createElement('div');
        goalPost.style.position = 'absolute';
        goalPost.style.top = '30px';
        goalPost.style.left = '12%';
        goalPost.style.width = '76%';
        goalPost.style.height = '150px';
        goalPost.style.border = '7px solid #fff';
        goalPost.style.borderBottom = 'none';
        goalPost.style.borderRadius = '6px 6px 0 0';
        goalPost.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)';
        goalPost.style.backgroundImage = 'radial-gradient(circle, rgba(255,255,255,0.35) 1.5px, transparent 1.5px)';
        goalPost.style.backgroundSize = '14px 14px';
        stadium.appendChild(goalPost);

        // Professional Diving Goalkeeper Character
        const goalie = document.createElement('div');
        goalie.style.position = 'absolute';
        goalie.style.top = '85px';
        goalie.style.left = '42%';
        goalie.style.width = '68px';
        goalie.style.height = '85px';
        goalie.style.transition = 'all 0.55s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        goalie.style.display = 'flex';
        goalie.style.flexDirection = 'column';
        goalie.style.alignItems = 'center';
        goalie.style.zIndex = '5';
        goalie.innerHTML = `
            <div style="font-size:1.8rem; line-height:1; filter:drop-shadow(0 3px 5px rgba(0,0,0,0.6));">👨‍🦱</div>
            <div style="background:linear-gradient(135deg, #ff0055, #cc0044); width:52px; height:36px; border-radius:10px; border:2px solid #fff; display:flex; justify-content:space-between; align-items:center; padding:0 3px; box-shadow:0 4px 10px rgba(0,0,0,0.5); margin-top:-3px;">
                <span style="font-size:1.4rem; transform:translateX(-14px);">🧤</span>
                <span style="color:#fff; font-weight:900; font-size:0.8rem; font-family:sans-serif;">1</span>
                <span style="font-size:1.4rem; transform:translateX(14px) scaleX(-1);">🧤</span>
            </div>
            <div style="display:flex; gap:8px; margin-top:2px;">
                <div style="width:13px; height:24px; background:#1a1a1a; border-radius:4px; border:1px solid rgba(255,255,255,0.2);"></div>
                <div style="width:13px; height:24px; background:#1a1a1a; border-radius:4px; border:1px solid rgba(255,255,255,0.2);"></div>
            </div>
        `;
        stadium.appendChild(goalie);

        // Ball Shadow
        const ballShadow = document.createElement('div');
        ballShadow.style.position = 'absolute';
        ballShadow.style.bottom = '12px';
        ballShadow.style.left = '45%';
        ballShadow.style.width = '35px';
        ballShadow.style.height = '10px';
        ballShadow.style.background = 'rgba(0,0,0,0.5)';
        ballShadow.style.borderRadius = '50%';
        ballShadow.style.transition = 'all 0.5s ease';
        stadium.appendChild(ballShadow);

        // Ball
        const ball = document.createElement('div');
        ball.style.position = 'absolute';
        ball.style.bottom = '15px';
        ball.style.left = '45%';
        ball.style.fontSize = '2.4rem';
        ball.style.transition = 'all 0.58s cubic-bezier(0.25, 1, 0.5, 1)';
        ball.style.zIndex = '10';
        ball.style.filter = 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))';
        ball.innerHTML = '⚽';
        stadium.appendChild(ball);

        // GOOL Popup Banner hidden
        const golPopup = document.createElement('div');
        golPopup.style.position = 'absolute';
        golPopup.style.top = '45%';
        golPopup.style.left = '50%';
        golPopup.style.transform = 'translate(-50%, -50%) scale(0)';
        golPopup.style.transition = 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        golPopup.style.background = 'rgba(0,0,0,0.9)';
        golPopup.style.border = '4px solid var(--gold)';
        golPopup.style.borderRadius = '25px';
        golPopup.style.padding = '15px 28px';
        golPopup.style.color = '#fff';
        golPopup.style.fontSize = '2.2rem';
        golPopup.style.fontWeight = '900';
        golPopup.style.zIndex = '50';
        golPopup.style.boxShadow = '0 0 35px rgba(255,215,0,0.9)';
        golPopup.style.textAlign = 'center';
        golPopup.style.whiteSpace = 'nowrap';
        golPopup.innerHTML = '🎉 ¡GOOOOOOL! ⚽👑';
        stadium.appendChild(golPopup);

        wrapper.appendChild(stadium);

        // Commentary Box
        const commentary = document.createElement('div');
        commentary.style.width = '100%';
        commentary.style.background = 'rgba(255,255,255,0.06)';
        commentary.style.border = '1px solid rgba(255,255,255,0.15)';
        commentary.style.borderRadius = '14px';
        commentary.style.padding = '16px';
        commentary.style.marginTop = '16px';
        commentary.style.textAlign = 'center';
        commentary.style.color = 'var(--text-primary)';
        commentary.style.fontStyle = 'italic';
        commentary.style.minHeight = '65px';
        commentary.style.lineHeight = '1.5';
        commentary.innerHTML = '🎙️ <b>Comentarista:</b> "¡Atención! Melissa acomoda el balón frente a la portería. ¡El arquero flexiona las piernas listo para estirarse!"';
        wrapper.appendChild(commentary);

        // Controls
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '10px';
        controlsDiv.style.marginTop = '15px';
        controlsDiv.style.width = '100%';

        const shootOptions = [
            { label: '⬅️ Palo Izquierdo', dir: 'left', targetX: '18%', targetY: '170px' },
            { label: '⏺️ Centro / Arriba', dir: 'center', targetX: '45%', targetY: '165px' },
            { label: '➡️ Palo Derecho', dir: 'right', targetX: '70%', targetY: '170px' }
        ];

        const goalComments = [
            '🎙️ <b>¡GOOOOOLAZO IMPRESIONANTE!</b> "¡La clavó en el ángulo donde duermen las arañas! En el Mundial de mi vida, tú eres la estrella número 10 indiscutible, mi princesa hermosa. ¡Carlos celebra aplaudiendo!"',
            '🎙️ <b>¡GOOOOOL DE ORO!</b> "¡El portero voló espectacular hacia el lado contrario! Así como conquistaste este arco, conquistaste mi corazón para siempre. ¡Orgulloso de tu fuerza!"',
            '🎙️ <b>¡GOLAZO DE CAMPEONA!</b> "¡Grita todo el estadio! Melissa demuestra que tiene una puntería y una garra de campeona mundial. ¡Te ganaste la Copa del Amor!"',
            '🎙️ <b>¡GOOOOOL MAGISTRAL!</b> "¡Qué remate tan perfecto! Eres la dueña absoluta del trofeo de mi corazón hoy, mañana y toda la eternidad. ¡Te amo mi reina!"'
        ];

        let isShooting = false;

        shootOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.flex = '1';
            btn.style.padding = '14px 6px';
            btn.style.fontSize = '0.92rem';
            btn.style.fontWeight = 'bold';
            btn.innerHTML = opt.label;
            btn.onclick = () => {
                if (isShooting) return;
                isShooting = true;

                // Professional Goalkeeper Diving Mechanics
                const diveTypes = [
                    { left: '16%', top: '105px', transform: 'rotate(-72deg) scale(1.1)' },
                    { left: '42%', top: '40px', transform: 'scale(1.2)' },
                    { left: '66%', top: '105px', transform: 'rotate(72deg) scale(1.1)' }
                ];
                const goalieDive = diveTypes[Math.floor(Math.random() * diveTypes.length)];
                goalie.style.left = goalieDive.left;
                goalie.style.top = goalieDive.top;
                goalie.style.transform = goalieDive.transform;

                // Ball moves to target
                ball.style.left = opt.targetX;
                ball.style.bottom = opt.targetY;
                ball.style.transform = 'scale(0.55) rotate(540deg)';
                ballShadow.style.left = opt.targetX;
                ballShadow.style.bottom = '40px';
                ballShadow.style.transform = 'scale(0.4)';

                setTimeout(() => {
                    const isGoal = Math.random() < 0.88;

                    if (isGoal) {
                        goals++;
                        localStorage.setItem('melisa_penalties_goals', goals.toString());
                        document.getElementById('penalties-counter').innerHTML = `🏆 Goles de amor hoy: ${goals}`;
                        stadium.style.borderColor = '#00ff88';
                        stadium.style.boxShadow = '0 0 35px rgba(0,255,136,0.6)';
                        commentary.innerHTML = goalComments[Math.floor(Math.random() * goalComments.length)];

                        // Show GOOOL text popup & Confetti
                        golPopup.style.transform = 'translate(-50%, -50%) scale(1)';

                        const confettiContainer = document.createElement('div');
                        confettiContainer.className = 'game-confetti';
                        confettiContainer.style.position = 'absolute';
                        confettiContainer.style.inset = '0';
                        confettiContainer.style.overflow = 'hidden';
                        confettiContainer.style.pointerEvents = 'none';
                        for(let i=0; i<45; i++) {
                            const piece = document.createElement('div');
                            piece.className = 'game-confetti-piece';
                            piece.style.left = `${Math.random() * 100}%`;
                            piece.style.backgroundColor = ['#00e5ff', '#ffd54f', '#ff4081', '#00ff88', '#fff'][Math.floor(Math.random() * 5)];
                            piece.style.animationDelay = `${Math.random() * 1.5}s`;
                            confettiContainer.appendChild(piece);
                        }
                        wrapper.appendChild(confettiContainer);

                        setTimeout(() => {
                            if (confettiContainer && confettiContainer.parentNode) {
                                confettiContainer.remove();
                            }
                        }, 2500);
                    } else {
                        commentary.innerHTML = '🎙️ <b>¡Atajada de película!</b> "¡El arquero voló como un gato y la sacó con los guantes! Pero para tu rey Carlos tú siempre eres la campeona. ¡Patea otro penal!"';
                    }

                    setTimeout(() => {
                        golPopup.style.transform = 'translate(-50%, -50%) scale(0)';
                        ball.style.transition = 'none';
                        goalie.style.transition = 'none';
                        ballShadow.style.transition = 'none';

                        ball.style.bottom = '15px';
                        ball.style.left = '45%';
                        ball.style.transform = 'scale(1) rotate(0deg)';
                        ballShadow.style.bottom = '12px';
                        ballShadow.style.left = '45%';
                        ballShadow.style.transform = 'scale(1)';

                        stadium.style.borderColor = 'var(--gold)';
                        stadium.style.boxShadow = '0 12px 30px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.4)';
                        goalie.style.left = '42%';
                        goalie.style.top = '85px';
                        goalie.style.transform = 'rotate(0deg) scale(1)';

                        setTimeout(() => {
                            ball.style.transition = 'all 0.58s cubic-bezier(0.25, 1, 0.5, 1)';
                            goalie.style.transition = 'all 0.55s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
                            ballShadow.style.transition = 'all 0.5s ease';
                            isShooting = false;
                        }, 50);
                    }, 2300);
                }, 580);
            };
            controlsDiv.appendChild(btn);
        });

        wrapper.appendChild(controlsDiv);
        container.appendChild(wrapper);
    }

    // =============================================
    //  DÍA 9: ÁLBUM PANINI DE CARLOS & MELISSA 📖🃏
    // =============================================
    function startAlbum(container, config) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-album';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '520px';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';

        let collected = JSON.parse(localStorage.getItem('melisa_album_collected') || '[]');
        let stickersCount = parseInt(localStorage.getItem('melisa_album_total') || collected.length.toString(), 10);

        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '18px';
        header.innerHTML = `
            <h2 style="color:var(--gold); font-family:'Outfit',sans-serif; margin-bottom:5px;">📖 Álbum Panini del Amor ⭐</h2>
            <p style="color:var(--text-secondary); font-size:0.95rem;">¡Abre sobres dorados infinitos o visualiza tu colección de láminas reales!</p>
            <div id="album-counter" style="background:rgba(255,215,0,0.15); border:1px solid var(--gold); padding:8px 18px; border-radius:20px; color:var(--gold); font-weight:bold; display:inline-block; margin-top:10px; font-size:1.1rem; box-shadow:0 4px 12px rgba(255,215,0,0.2);">
                ✨ Monitas pegadas en tu álbum: ${stickersCount}
            </div>
        `;
        wrapper.appendChild(header);

        // Pack Area
        const packDiv = document.createElement('div');
        packDiv.style.width = '100%';
        packDiv.style.background = 'linear-gradient(135deg, #2b1055 0%, #7597de 100%)';
        packDiv.style.border = '2px dashed var(--gold)';
        packDiv.style.borderRadius = '16px';
        packDiv.style.padding = '25px 20px';
        packDiv.style.textAlign = 'center';
        packDiv.style.boxShadow = '0 10px 28px rgba(0,0,0,0.6)';
        packDiv.style.marginBottom = '20px';

        packDiv.innerHTML = `
            <div style="font-size:4.2rem; margin-bottom:8px; filter:drop-shadow(0 5px 15px rgba(255,215,0,0.5));">🃏✨</div>
            <h3 style="color:#fff; margin:0 0 8px 0; font-family:'Outfit',sans-serif; font-size:1.35rem;">Sobre Dorado Panini Edición Oro</h3>
            <p style="color:rgba(255,255,255,0.85); font-size:0.9rem; margin-bottom:20px;">Contiene 1 lámina brillante holográfica con foto real de Carlos & Melissa.</p>
        `;

        const btnsRow = document.createElement('div');
        btnsRow.style.display = 'flex';
        btnsRow.style.gap = '12px';
        btnsRow.style.flexWrap = 'wrap';
        btnsRow.style.justifyContent = 'center';

        const openBtn = document.createElement('button');
        openBtn.className = 'btn';
        openBtn.style.background = 'var(--gold)';
        openBtn.style.color = '#000';
        openBtn.style.fontWeight = '900';
        openBtn.style.padding = '14px 26px';
        openBtn.style.fontSize = '1.05rem';
        openBtn.style.boxShadow = '0 6px 20px rgba(255,215,0,0.5)';
        openBtn.style.borderRadius = '30px';
        openBtn.innerHTML = '✨ ¡ABRIR SOBRE DORADO! 🎁';

        const viewAlbumBtn = document.createElement('button');
        viewAlbumBtn.className = 'btn';
        viewAlbumBtn.style.background = 'var(--cyan)';
        viewAlbumBtn.style.color = '#000';
        viewAlbumBtn.style.fontWeight = '900';
        viewAlbumBtn.style.padding = '14px 22px';
        viewAlbumBtn.style.fontSize = '1.05rem';
        viewAlbumBtn.style.boxShadow = '0 6px 20px rgba(0,229,255,0.4)';
        viewAlbumBtn.style.borderRadius = '30px';
        viewAlbumBtn.innerHTML = `📖 Ver Álbum Pegado (${collected.length})`;

        btnsRow.appendChild(openBtn);
        btnsRow.appendChild(viewAlbumBtn);
        packDiv.appendChild(btnsRow);
        wrapper.appendChild(packDiv);

        const cardDisplay = document.createElement('div');
        cardDisplay.style.width = '100%';
        cardDisplay.style.display = 'none';
        cardDisplay.style.flexDirection = 'column';
        cardDisplay.style.alignItems = 'center';
        wrapper.appendChild(cardDisplay);

        // Gallery Display
        const galleryDisplay = document.createElement('div');
        galleryDisplay.style.width = '100%';
        galleryDisplay.style.display = 'none';
        galleryDisplay.style.flexDirection = 'column';
        galleryDisplay.style.alignItems = 'center';
        wrapper.appendChild(galleryDisplay);

        const titles = [
            '⭐ Selección Melissa & Carlos - Titulares Indiscutibles',
            '👑 Melissa - Capitana Eterna de mi Corazón',
            '🏆 Balón de Oro del Amor Incondicional',
            '🇨🇴 Hinchada Oficial de tu Recuperación',
            '✨ Estrellas Brillantes de Nuestro Universo'
        ];

        const messages = [
            'Cada foto nuestra me recuerda el motivo por el cual sonrío todos los días. ¡Eres mi jugadora favorita para toda la vida!',
            'En este Mundial del Amor, verte mejorar día a día es la mayor victoria que puedo pedir. ¡Te amo infinitamente mi princesa!',
            'No hay estadio en el mundo que pueda contener todo el amor y la admiración que siento por ti. ¡Felicidades en tu Día 9!',
            'Guardé cada uno de estos recuerdos porque a tu lado cada instante se convierte en una obra de arte. ¡Te adoro mi reina!',
            '¡Qué guapos nos vemos juntos! Muy pronto estaremos sumando miles de fotos más en nuestras próximas aventuras.'
        ];

        openBtn.onclick = () => {
            galleryDisplay.style.display = 'none';
            packDiv.style.display = 'none';

            const photoNum = Math.floor(Math.random() * 185) + 1;
            const isRepeated = collected.includes(photoNum);
            const photoUrl = `fotos/foto (${photoNum}).jpeg`;
            const titleText = titles[Math.floor(Math.random() * titles.length)];
            const msgText = messages[Math.floor(Math.random() * messages.length)];

            cardDisplay.style.display = 'flex';
            cardDisplay.innerHTML = `
                <div style="background:linear-gradient(145deg, #181824, #2a2a40); border:3px solid var(--gold); border-radius:20px; padding:20px; width:100%; max-width:360px; text-align:center; box-shadow:0 15px 35px rgba(0,0,0,0.8); animation:popIn 0.4s ease;">
                    <div style="background:${isRepeated ? '#ff4081' : '#00ff88'}; color:#000; font-weight:900; padding:6px 14px; border-radius:20px; font-size:0.85rem; letter-spacing:1px; margin-bottom:14px; display:inline-block; box-shadow:0 4px 10px rgba(0,0,0,0.3);">
                        ${isRepeated ? '⚠️ FIGURITA REPETIDA' : '🌟 ¡NUEVA FIGURITA!'}
                    </div>
                    <div style="background:#000; border-radius:14px; overflow:hidden; height:280px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; border:2px solid rgba(255,215,0,0.4); box-shadow:0 6px 16px rgba(0,0,0,0.6);">
                        <img src="${photoUrl}" alt="Recuerdo Melissa y Carlos" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='fotos/foto (1).jpeg';">
                    </div>
                    <div style="background:var(--gold); color:#000; font-weight:900; padding:6px 14px; border-radius:8px; font-size:0.85rem; letter-spacing:1px; margin-bottom:12px; display:inline-block;">
                        EDICIÓN ORO PANINI #${photoNum}
                    </div>
                    <h4 style="color:#fff; margin:0 0 10px 0; font-family:'Outfit',sans-serif; font-size:1.18rem;">${titleText}</h4>
                    <p style="color:rgba(255,255,255,0.9); font-size:0.95rem; line-height:1.5; font-style:italic; margin-bottom:18px;">"${msgText}"</p>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button id="paste-sticker-btn" class="btn" style="background:var(--cyan); color:#000; width:100%; font-weight:900; padding:14px; font-size:1.02rem; border-radius:30px; box-shadow:0 4px 15px rgba(0,229,255,0.4);">
                            📗 PEGAR EN MI ÁLBUM
                        </button>
                        <button id="discard-sticker-btn" class="btn" style="background:rgba(255,64,129,0.2); border:2px solid #ff4081; color:#ff4081; width:100%; font-weight:900; padding:12px; font-size:0.95rem; border-radius:30px;">
                            🗑️ DESCARTAR / GUARDAR REPETIDA
                        </button>
                    </div>
                </div>
            `;

            const pasteBtn = cardDisplay.querySelector('#paste-sticker-btn');
            if (pasteBtn) {
                pasteBtn.onclick = () => {
                    if (!collected.includes(photoNum)) {
                        collected.push(photoNum);
                        localStorage.setItem('melisa_album_collected', JSON.stringify(collected));
                    }
                    stickersCount++;
                    localStorage.setItem('melisa_album_total', stickersCount.toString());
                    const albCounter = wrapper.querySelector('#album-counter');
                    if (albCounter) albCounter.innerHTML = `✨ Monitas pegadas en tu álbum: ${stickersCount}`;
                    viewAlbumBtn.innerHTML = `📖 Ver Álbum Pegado (${collected.length})`;

                    cardDisplay.style.display = 'none';
                    packDiv.style.display = 'block';
                    packDiv.scrollIntoView({ behavior: 'smooth' });
                };
            }

            const discardBtn = cardDisplay.querySelector('#discard-sticker-btn');
            if (discardBtn) {
                discardBtn.onclick = () => {
                    cardDisplay.style.display = 'none';
                    packDiv.style.display = 'block';
                    packDiv.scrollIntoView({ behavior: 'smooth' });
                };
            }

            cardDisplay.scrollIntoView({ behavior: 'smooth' });
        };

        viewAlbumBtn.onclick = () => {
            cardDisplay.style.display = 'none';
            packDiv.style.display = 'block';
            galleryDisplay.style.display = 'flex';

            if (collected.length === 0) {
                galleryDisplay.innerHTML = `
                    <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); border-radius:15px; padding:25px; text-align:center; width:100%;">
                        <p style="color:var(--text-secondary);">Aún no has pegado láminas hoy. ¡Presiona 'ABRIR SOBRE DORADO' y decide cuáles pegar en tu álbum!</p>
                    </div>
                `;
            } else {
                let gridHtml = `
                    <h3 style="color:var(--gold); font-family:'Outfit',sans-serif; margin:10px 0 15px 0;">¡Tus Láminas Panini Coleccionadas! ✨</h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:12px; width:100%;">
                `;
                collected.forEach(num => {
                    gridHtml += `
                        <div style="background:#1a1a2e; border:2px solid var(--gold); border-radius:12px; overflow:hidden; padding:8px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                            <div style="height:120px; border-radius:8px; overflow:hidden; margin-bottom:6px; background:#000;">
                                <img src="fotos/foto (${num}).jpeg" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='fotos/foto (1).jpeg';">
                            </div>
                            <span style="color:var(--gold); font-size:0.75rem; font-weight:bold;">LÁMINA #${num}</span>
                        </div>
                    `;
                });
                gridHtml += `</div>`;
                galleryDisplay.innerHTML = gridHtml;
            }
            galleryDisplay.scrollIntoView({ behavior: 'smooth' });
        };

        container.appendChild(wrapper);
    }

    // =============================================
    //  DÍA 9: SELECCIONES DEL MUNDIAL 2026 🌍🏆 (INFINITO)
    // =============================================
    function startWorldCupTeams(container, config) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-worldcupteams';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '520px';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.position = 'relative';

        const teamsData = [
            { flag: '🇨🇴', name: 'COLOMBIA', question: '¿Cuál es nuestra selección amada, el país del café, la cumbia y el orgullo tricolor por el que late nuestro corazón?', options: ['COLOMBIA', 'ECUADOR', 'VENEZUELA'] },
            { flag: '🇦🇷', name: 'ARGENTINA', question: '¿Qué selección sudamericana es la actual campeona del mundo (Qatar 2022) liderada por Lionel Messi?', options: ['ARGENTINA', 'BRASIL', 'URUGUAY'] },
            { flag: '🇧🇷', name: 'BRASIL', question: '¿Cuál es la selección pentacampeona del mundo famosa por el jogo bonito y la camiseta verdeamarela?', options: ['BRASIL', 'PORTUGAL', 'COLOMBIA'] },
            { flag: '🇲🇽', name: 'MEXICO', question: '¿Qué país es una de las 3 sedes anfitrionas del 2026 donde se jugará en el histórico Estadio Azteca?', options: ['MEXICO', 'ESTADOS UNIDOS', 'CANADA'] },
            { flag: '🇪🇸', name: 'ESPAÑA', question: '¿Qué selección europea es conocida como La Furia Roja, campeona de Europa y maestra del tiki-taka?', options: ['ESPAÑA', 'ITALIA', 'FRANCIA'] },
            { flag: '🇫🇷', name: 'FRANCIA', question: '¿Qué poderosa selección europea fue campeona en 2018 y subcampeona del mundo liderada por Mbappé?', options: ['FRANCIA', 'ALEMANIA', 'INGLATERRA'] },
            { flag: '🇺🇸', name: 'ESTADOS UNIDOS', question: '¿Cuál es el país anfitrión principal donde se disputará la gran final de la Copa del Mundo 2026?', options: ['ESTADOS UNIDOS', 'CANADA', 'MEXICO'] },
            { flag: '🇺🇾', name: 'URUGUAY', question: '¿Qué selección sudamericana conocida como "La Celeste" fue el primer campeón en la historia de los mundiales (1930)?', options: ['URUGUAY', 'PARAGUAY', 'CHILE'] },
            { flag: '🇩🇪', name: 'ALEMANIA', question: '¿Qué potencia del fútbol europeo ha ganado 4 Copas del Mundo y viste tradicionalmente de blanco?', options: ['ALEMANIA', 'HOLANDA', 'SUIZA'] },
            { flag: '🇨🇦', name: 'CANADA', question: '¿Qué país norteamericano co-anfitrión del Mundial 2026 tiene una famosa hoja de arce en su bandera?', options: ['CANADA', 'ESTADOS UNIDOS', 'MEXICO'] },
            { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'INGLATERRA', question: '¿Qué selección europea es conocida como "Los Tres Leones" y ganó el Mundial en 1966?', options: ['INGLATERRA', 'ESCOCIA', 'GALES'] },
            { flag: '🇮🇹', name: 'ITALIA', question: '¿Qué histórica selección europea tetracampeona es conocida como la "Azzurra"?', options: ['ITALIA', 'GRECIA', 'ESPAÑA'] },
            { flag: '🇵🇹', name: 'PORTUGAL', question: '¿Qué selección europea viste de rojo y verde y ha sido capitaneada por Cristiano Ronaldo?', options: ['PORTUGAL', 'ESPAÑA', 'BELGICA'] },
            { flag: '🇳🇱', name: 'PAISES BAJOS', question: '¿Qué famosa selección europea que viste de naranja es conocida históricamente como la "Naranja Mecánica"?', options: ['PAISES BAJOS', 'ALEMANIA', 'DINAMARCA'] },
            { flag: '🇭🇷', name: 'CROACIA', question: '¿Qué selección con camiseta a cuadros rojos y blancos llegó a la final en el Mundial 2018 y fue tercera en 2022?', options: ['CROACIA', 'POLONIA', 'SUIZA'] },
            { flag: '🇧🇪', name: 'BELGICA', question: '¿Qué selección europea es apodada "Los Diablos Rojos" y tiene estrellas como De Bruyne y Lukaku?', options: ['BELGICA', 'SUIZA', 'AUSTRIA'] },
            { flag: '🇯🇵', name: 'JAPON', question: '¿Qué selección asiática conocida como los "Samuráis Azules" destaca por su disciplina y velocidad?', options: ['JAPON', 'COREA DEL SUR', 'CHINA'] },
            { flag: '🇰🇷', name: 'COREA DEL SUR', question: '¿Qué selección asiática apodada los "Guerreros Taeguk" llegó a semifinales en 2002 y viste de rojo?', options: ['COREA DEL SUR', 'JAPON', 'AUSTRALIA'] },
            { flag: '🇲🇦', name: 'MARRUECOS', question: '¿Qué selección africana apodada los "Leones del Atlas" hizo historia al llegar a semifinales en Qatar 2022?', options: ['MARRUECOS', 'EGIPTO', 'SENEGAL'] },
            { flag: '🇸🇳', name: 'SENEGAL', question: '¿Qué selección africana conocida como los "Leones de la Teranga" viste de verde, amarillo y rojo?', options: ['SENEGAL', 'CAMERUN', 'NIGERIA'] },
            { flag: '🇪🇨', name: 'ECUADOR', question: '¿Qué selección sudamericana apodada "La Tri" disputa sus partidos de local en las alturas de Quito?', options: ['ECUADOR', 'PERU', 'BOLIVIA'] },
            { flag: '🇵🇪', name: 'PERU', question: '¿Qué selección sudamericana lleva una icónica franja diagonal roja en el pecho de su camiseta blanca?', options: ['PERU', 'PARAGUAY', 'CHILE'] },
            { flag: '🇨🇱', name: 'CHILE', question: '¿Qué selección sudamericana es conocida como "La Roja" y fue bicampeona de América en 2015 y 2016?', options: ['CHILE', 'PERU', 'URUGUAY'] },
            { flag: '🇵🇾', name: 'PARAGUAY', question: '¿Qué selección sudamericana apodada "La Albirroja" es famosa por su aguerrida garra guaraní?', options: ['PARAGUAY', 'PERU', 'VENEZUELA'] },
            { flag: '🇻🇪', name: 'VENEZUELA', question: '¿Qué selección sudamericana es conocida con cariño y orgullo como la "Vinotinto"?', options: ['VENEZUELA', 'COLOMBIA', 'ECUADOR'] },
            { flag: '🇨🇷', name: 'COSTA RICA', question: '¿Qué selección centroamericana conocida como los "Ticos" maravilló al mundo llegando a cuartos en Brasil 2014?', options: ['COSTA RICA', 'PANAMA', 'HONDURAS'] },
            { flag: '🇨🇭', name: 'SUIZA', question: '¿Qué selección europea tiene una cruz blanca en su bandera roja y es famosa por su solidez defensiva?', options: ['SUIZA', 'AUSTRIA', 'DINAMARCA'] },
            { flag: '🇩🇰', name: 'DINAMARCA', question: '¿Qué selección nórdica conocida como la "Dinamita Roja" fue campeona de Europa en 1992?', options: ['DINAMARCA', 'SUECIA', 'NORUEGA'] },
            { flag: '🇵🇱', name: 'POLONIA', question: '¿Qué selección europea viste de blanco y rojo y ha tenido como gran goleador a Robert Lewandowski?', options: ['POLONIA', 'UCRANIA', 'REP. CHECA'] },
            { flag: '🇦🇺', name: 'AUSTRALIA', question: '¿Qué selección de Oceanía que compite en Asia es apodada los "Socceroos" y viste de amarillo y verde?', options: ['AUSTRALIA', 'NUEVA ZELANDA', 'JAPON'] },
            { flag: '🇳🇬', name: 'NIGERIA', question: '¿Qué histórica selección africana viste de verde y es famosa en el mundo entero como las "Súper Águilas"?', options: ['NIGERIA', 'CAMERUN', 'GHANA'] },
            { flag: '🇪🇬', name: 'EGIPTO', question: '¿Qué selección africana apodada los "Faraones" es el equipo con más títulos en la Copa Africana de Naciones?', options: ['EGIPTO', 'MARRUECOS', 'ARGELIA'] },
            { flag: '🇬🇭', name: 'GHANA', question: '¿Qué selección africana apodada las "Estrellas Negras" estuvo a un paso de semifinales en Sudáfrica 2010?', options: ['GHANA', 'NIGERIA', 'COSTA DE MARFIL'] },
            { flag: '🇨🇲', name: 'CAMERUN', question: '¿Qué selección africana es legendariamente conocida como los "Leones Indomables"?', options: ['CAMERUN', 'SENEGAL', 'NIGERIA'] },
            { flag: '🇸🇪', name: 'SUECIA', question: '¿Qué selección escandinava que viste de amarillo y azul fue subcampeona del mundo en 1958?', options: ['SUECIA', 'NORUEGA', 'FINLANDIA'] },
            { flag: '🇬🇷', name: 'GRECIA', question: '¿Qué selección europea dio una de las mayores sorpresas de la historia ganando la Eurocopa en 2004?', options: ['GRECIA', 'TURQUIA', 'ITALIA'] },
            { flag: '🇵🇦', name: 'PANAMA', question: '¿Qué selección centroamericana apodada los "Canaleros" jugó su primer e histórico Mundial en Rusia 2018?', options: ['PANAMA', 'COSTA RICA', 'GUATEMALA'] },
            { flag: '💖', name: 'MELISSA', question: '¿Cuál es la selección, reina y jugadora número 1 en el corazón y en el universo entero de Carlos?', options: ['MELISSA', 'LA REINA', 'MI AMOR'] },
            { flag: '👑', name: 'CARLOS', question: '¿Quién es el capitán del amor que dará todo en la cancha de la vida para ver siempre feliz a Melissa?', options: ['CARLOS', 'EL REY', 'MI NOVIO'] },
            { flag: '🏆', name: 'NUESTRO AMOR', question: '¿Cuál es el trofeo más grande, invencible y eterno que ganaremos todos los días por el resto de nuestras vidas?', options: ['NUESTRO AMOR', 'LA COPA DEL MUNDO', 'EL CHAMPIONSHIP'] }
        ];

        // Load or initialize non-repeating infinite unshown index pool
        let unshownIndices = [];
        try {
            const savedPool = localStorage.getItem('melisa_wct_unshown_pool');
            if (savedPool) {
                unshownIndices = JSON.parse(savedPool);
            }
        } catch(e) {}

        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        if (Array.isArray(unshownIndices)) {
            unshownIndices = unshownIndices.filter(i => typeof i === 'number' && i >= 0 && i < teamsData.length && teamsData[i]);
        }
        if (!Array.isArray(unshownIndices) || unshownIndices.length === 0) {
            unshownIndices = Array.from({length: teamsData.length}, (_, i) => i);
            shuffleArray(unshownIndices);
            localStorage.setItem('melisa_wct_unshown_pool', JSON.stringify(unshownIndices));
        }

        let correctCount = parseInt(localStorage.getItem('melisa_wct_score') || '0', 10);

        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '18px';
        header.innerHTML = `
            <h2 style="color:var(--gold); font-family:'Outfit',sans-serif; margin-bottom:5px;">🌍 Preguntas del Mundial 2026 🏆</h2>
            <p style="color:var(--text-secondary); font-size:0.95rem;">¡Juego infinito! Responde adivinando o seleccionando la opción correcta.</p>
            <div id="wct-counter" style="background:rgba(0,229,255,0.15); border:1px solid var(--cyan); padding:8px 18px; border-radius:20px; color:var(--cyan); font-weight:bold; display:inline-block; margin-top:10px; font-size:1.1rem; box-shadow:0 4px 12px rgba(0,229,255,0.2);">
                🏆 Aciertos Mundialistas: ${correctCount}
            </div>
        `;
        wrapper.appendChild(header);

        const card = document.createElement('div');
        card.style.width = '100%';
        card.style.background = 'linear-gradient(145deg, #112233, #1e3a5f)';
        card.style.border = '3px solid var(--gold)';
        card.style.borderRadius = '20px';
        card.style.padding = '24px 20px';
        card.style.textAlign = 'center';
        card.style.boxShadow = '0 12px 30px rgba(0,0,0,0.7)';
        wrapper.appendChild(card);

        function renderTeam() {
            if (!Array.isArray(unshownIndices) || unshownIndices.length === 0 || unshownIndices[0] === undefined || !teamsData[unshownIndices[0]]) {
                unshownIndices = Array.from({length: teamsData.length}, (_, i) => i);
                shuffleArray(unshownIndices);
                localStorage.setItem('melisa_wct_unshown_pool', JSON.stringify(unshownIndices));
            }

            const currentIdx = unshownIndices[0];
            const current = teamsData[currentIdx];
            
            // Shuffle options
            const opts = [...current.options];
            shuffleArray(opts);

            card.innerHTML = `
                <div style="background:linear-gradient(90deg, #00e5ff, #ffd54f); color:#000; font-weight:900; font-size:0.85rem; padding:5px 16px; border-radius:20px; display:inline-block; margin-bottom:12px; letter-spacing:1px; box-shadow:0 4px 10px rgba(0,229,255,0.3);">
                    ⚽ RETO FUTBOLERO DEL AMOR
                </div>
                <div style="font-size:4.8rem; margin:8px 0; filter:drop-shadow(0 5px 12px rgba(0,0,0,0.6));">${current.flag}</div>
                <h3 style="color:#fff; font-family:'Outfit',sans-serif; font-size:1.18rem; margin:10px 0 16px 0; line-height:1.4;">${current.question}</h3>
                
                <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:14px; margin-bottom:18px; border:1px solid rgba(255,255,255,0.15);">
                    <label style="color:var(--gold); font-size:0.85rem; font-weight:bold; display:block; margin-bottom:8px;">✍️ ESCRIBE LA RESPUESTA AQUÍ:</label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="team-input" placeholder="Escribe tu respuesta..." autocomplete="off" style="flex:1; padding:12px; border-radius:10px; border:2px solid var(--cyan); background:rgba(0,0,0,0.6); color:#fff; font-size:1.1rem; text-align:center; font-weight:bold; outline:none;">
                        <button id="check-btn" class="btn" style="background:var(--gold); color:#000; font-weight:900; padding:12px 18px; border-radius:10px;">
                            ¡Verificar!
                        </button>
                    </div>
                </div>

                <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:12px; font-weight:bold;">👉 O SELECCIONA UNA OPCIÓN RÁPIDA:</p>
                <div id="options-row" style="display:flex; gap:10px; flex-direction:column; width:100%;"></div>

                <div id="feedback-area" style="margin-top:16px; min-height:40px;"></div>
            `;

            const inputEl = card.querySelector('#team-input');
            const checkBtn = card.querySelector('#check-btn');
            const feedback = card.querySelector('#feedback-area');
            const optionsRow = card.querySelector('#options-row');

            function triggerSuccess() {
                correctCount++;
                localStorage.setItem('melisa_wct_score', correctCount.toString());
                const wctCounter = wrapper.querySelector('#wct-counter');
                if (wctCounter) wctCounter.innerHTML = `🏆 Aciertos Mundialistas: ${correctCount}`;
                
                // Remove solved question from unshown pool
                unshownIndices.shift();
                if (unshownIndices.length === 0) {
                    unshownIndices = Array.from({length: teamsData.length}, (_, i) => i);
                    shuffleArray(unshownIndices);
                }
                localStorage.setItem('melisa_wct_unshown_pool', JSON.stringify(unshownIndices));
                
                feedback.innerHTML = `
                    <div style="color:#00ff88; font-weight:900; font-size:1.3rem; margin-bottom:12px; animation:popIn 0.4s ease;">🎉 ¡CORRECTO! ¡GOLAZO ACERTADO! ⚽👑</div>
                    <button id="next-team-btn" class="btn" style="background:var(--cyan); color:#000; width:100%; font-weight:900; padding:14px; font-size:1.05rem; border-radius:30px; box-shadow:0 6px 18px rgba(0,229,255,0.4);">
                        ➡️ Siguiente Pregunta
                    </button>
                `;

                // Confetti celebration
                const confettiContainer = document.createElement('div');
                confettiContainer.className = 'game-confetti';
                confettiContainer.style.position = 'absolute';
                confettiContainer.style.inset = '0';
                confettiContainer.style.overflow = 'hidden';
                confettiContainer.style.pointerEvents = 'none';
                for(let i=0; i<40; i++) {
                    const piece = document.createElement('div');
                    piece.className = 'game-confetti-piece';
                    piece.style.left = `${Math.random() * 100}%`;
                    piece.style.backgroundColor = ['#00e5ff', '#ffd54f', '#ff4081', '#00ff88'][Math.floor(Math.random() * 4)];
                    piece.style.animationDelay = `${Math.random() * 1.5}s`;
                    confettiContainer.appendChild(piece);
                }
                wrapper.appendChild(confettiContainer);

                setTimeout(() => { if (confettiContainer.parentNode) confettiContainer.remove(); }, 2500);

                const nextBtn = feedback.querySelector('#next-team-btn');
                if (nextBtn) {
                    nextBtn.onclick = () => {
                        renderTeam();
                    };
                }
            }

            function checkAnswer(userStr) {
                const rawUser = (userStr || inputEl.value).trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const target = current.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                if (rawUser === target || (target === 'ESTADOS UNIDOS' && (rawUser === 'USA' || rawUser === 'EEUU')) || (target === 'PAISES BAJOS' && rawUser === 'HOLANDA')) {
                    inputEl.value = current.name;
                    inputEl.style.borderColor = '#00ff88';
                    inputEl.style.backgroundColor = 'rgba(0,255,136,0.15)';
                    triggerSuccess();
                } else {
                    inputEl.style.borderColor = '#ff4081';
                    feedback.innerHTML = `<span style="color:#ff4081; font-weight:bold;">¡Respuesta incorrecta! Inténtalo de nuevo mi campeona 💪</span>`;
                }
            }

            if (optionsRow) {
                opts.forEach(optText => {
                    const optBtn = document.createElement('button');
                    optBtn.className = 'btn';
                    optBtn.style.background = 'rgba(255,255,255,0.08)';
                    optBtn.style.border = '2px solid rgba(255,255,255,0.25)';
                    optBtn.style.color = '#fff';
                    optBtn.style.fontWeight = 'bold';
                    optBtn.style.padding = '12px';
                    optBtn.style.fontSize = '1.02rem';
                    optBtn.style.borderRadius = '12px';
                    optBtn.style.transition = 'all 0.2s ease';
                    optBtn.innerHTML = optText;
                    optBtn.onclick = () => checkAnswer(optText);
                    optionsRow.appendChild(optBtn);
                });
            }

            if (checkBtn) checkBtn.onclick = () => checkAnswer();
            if (inputEl) inputEl.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkAnswer(); });
        }

        container.appendChild(wrapper);
        renderTeam();
    }

    // =============================================
    //  DÍA 10: ¡FESTIVAL MUSICAL DEL AMOR! 🎶🎤 (3 MODOS INFINITOS)
    // =============================================
    function startMusicFestival(container, config) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-musicfestival';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '540px';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.position = 'relative';

        // Append wrapper FIRST to prevent DOM query errors
        container.appendChild(wrapper);

        // Top Navigation Tabs
        let activeTab = 'trivia'; // 'trivia', 'piano', 'rockola'

        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '16px';
        header.style.width = '100%';
        header.innerHTML = `
            <div style="background:linear-gradient(90deg, #ff007f, #00e5ff); color:#fff; font-weight:900; font-size:0.85rem; padding:6px 18px; border-radius:20px; display:inline-block; margin-bottom:10px; letter-spacing:1px; box-shadow:0 4px 12px rgba(255,0,127,0.4);">
                🎧 DÍA 10: KARAOKE & FESTIVAL ROMÁNTICO 🎹
            </div>
            <h2 style="color:var(--gold); font-family:'Outfit',sans-serif; margin-bottom:6px; font-size:1.8rem;">🎶 Festival Musical de Nuestro Amor 🎤</h2>
            <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:14px;">¡Tres escenarios mágicos, sonido real y sorpresas románticas infinitas!</p>
            
            <div style="display:flex; gap:8px; justify-content:center; background:rgba(0,0,0,0.5); padding:6px; border-radius:25px; border:1px solid rgba(0,229,255,0.3); width:100%; max-width:480px; margin:0 auto;">
                <button id="tab-btn-trivia" class="btn" style="flex:1; padding:10px 6px; font-size:0.85rem; border-radius:20px; font-weight:bold; transition:all 0.3s ease;">
                    🎧 Adivina Letra
                </button>
                <button id="tab-btn-piano" class="btn" style="flex:1; padding:10px 6px; font-size:0.85rem; border-radius:20px; font-weight:bold; transition:all 0.3s ease;">
                    🎹 Piano Mágico
                </button>
                <button id="tab-btn-rockola" class="btn" style="flex:1; padding:10px 6px; font-size:0.85rem; border-radius:20px; font-weight:bold; transition:all 0.3s ease;">
                    📻 Rockola FM
                </button>
            </div>
        `;
        wrapper.appendChild(header);

        const contentArea = document.createElement('div');
        contentArea.style.width = '100%';
        contentArea.style.background = 'linear-gradient(145deg, #121826, #1f293d)';
        contentArea.style.border = '3px solid var(--cyan)';
        contentArea.style.borderRadius = '24px';
        contentArea.style.padding = '22px 18px';
        contentArea.style.boxShadow = '0 15px 35px rgba(0,0,0,0.7)';
        contentArea.style.minHeight = '360px';
        contentArea.style.position = 'relative';
        contentArea.style.overflow = 'hidden';
        wrapper.appendChild(contentArea);

        // Helper: shuffle
        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        // ==========================================
        //  TAB 1: TRIVIA MUSICAL / ADIVINA LA LETRA
        // ==========================================
        const triviaData = [
            { song: "Morat & Sebastián Yatra - Bajo La Mesa", prompt: "«Y es que no sé disimular, la forma en que te miro...» 🎵 ¿Qué sigue en nuestra canción del Día 9?", correct: "Se nota a la legua que te quiero", options: ["Se nota a la legua que te quiero", "Me delata el corazón cuando respiro", "Y me pierdo en tus ojos de lucero"] },
            { song: "Sebastián Yatra - No Hay Nadie Más", prompt: "«Voy a cuidarte por las noches, voy a amarte sin reproches...» 🎼 ¿Cómo continúa este hermoso juramento?", correct: "Te voy a extrañar en la tempestad", options: ["Te voy a extrañar en la tempestad", "Y seré tu luz en la oscuridad", "Porque tú eres mi única verdad"] },
            { song: "Morat - Cómo Te Atreves", prompt: "«¿Cómo te atreves a volver...?» 🎸 ¿Qué dice el épico coro de Morat?", correct: "A darle vida a lo que era muerto", options: ["A darle vida a lo que era muerto", "A romper el hielo que había cubierto", "A robarme el corazón en el desierto"] },
            { song: "Chayanne - Torero", prompt: "«De lunes a domingo voy desesperado...» 💃🕺 ¿Qué busca Chayanne con tanta pasión?", correct: "El corazón con la razón en un partido", options: ["El corazón con la razón en un partido", "Un beso tuyo que me deje adormecido", "Tu amor sincero que jamás he perdido"] },
            { song: "Shakira - Antología", prompt: "«Y fue por ti que escribí más de cien canciones...» 📝 ¿Y qué más hizo por amor?", correct: "Y hasta perdoné tus equivocaciones", options: ["Y hasta perdoné tus equivocaciones", "Y llené de besos todos los rincones", "Y superé todas mis ilusiones"] },
            { song: "Fonseca - Te Mando Flores", prompt: "«Te mando flores que recojo en el camino...» 🌸🌺 ¿Para qué se las manda Fonseca?", correct: "Yo te las mando entre sueños porque no puedo hablarte", options: ["Yo te las mando entre sueños porque no puedo hablarte", "Para que siempre recuerdes cuánto quiero amarte", "Porque en mi corazón nunca dejaré de llevarte"] },
            { song: "Carlos Vives & Shakira - La Bicicleta", prompt: "«Lleva, llévame en tu bicicleta...» 🚲 ¿A dónde quieren ir paseando?", correct: "Óyeme, Carlos, llévame en tu bicicleta", options: ["Óyeme, Carlos, llévame en tu bicicleta", "A recorrer la playa hasta que sea secreta", "Por todo el mundo con el alma discreta"] },
            { song: "Feid - Normal", prompt: "«Dime cómo te va, cómo te sientes...» 💚🎶 ¿Cuál es el sentimiento que nos une?", correct: "Si tú eres mi estrella entre tanta gente", options: ["Si tú eres mi estrella entre tanta gente", "Aunque la distancia se sienta tan presente", "Porque te llevo guardada en mi mente"] },
            { song: "Karol G & Nicki Minaj - Tusa / Ocean", prompt: "«Si algún día te vas de casa...» 🌊 ¿A dónde la llevaría por amor en Ocean?", correct: "Yo te llevo a la NASA", options: ["Yo te llevo a la NASA", "Te regalo lo que pasa", "Abrazaditos en la terraza"] },
            { song: "Juanes - Es Por Ti", prompt: "«Cada vez que me levanto y veo que a mi lado estás...» ☀️ ¿Qué siente Juanes al ver al amor de su vida?", correct: "Me siento renovado y me siento enamorado", options: ["Me siento renovado y me siento enamorado", "Se acaban las tristezas y todo lo pasado", "El mundo es perfecto y todo es dorado"] },
            { song: "Luis Miguel - La Incondicional", prompt: "«Tú, la misma de ayer...» 🍷🌹 ¿Cómo describe a esa mujer única y leal?", correct: "La incondicional, la que no espera nada", options: ["La incondicional, la que no espera nada", "La reina eterna de mi alma enamorada", "La luz brillante de mi madrugada"] },
            { song: "Sin Bandera - Entra en mi Vida", prompt: "«Te vi venir y no dudé...» 🚪❤️ ¿Qué hizo al ver llegar a esa persona especial?", correct: "Te vi llegar y te abrí la puerta", options: ["Te vi llegar y te abrí la puerta", "Dejé mi alma totalmente descubierta", "Sabía que mi suerte ya estaba cierta"] },
            { song: "Reik - Noviembre Sin Ti", prompt: "«Noviembre sin ti es pedirle a la luna...» 🌙 ¿Qué le pide a la luna en esta balada?", correct: "Que brille en la noche de mi corazón", options: ["Que brille en la noche de mi corazón", "Que me devuelva toda la ilusión", "Que cante conmigo esta hermosa canción"] },
            { song: "Camila - Todo Cambió", prompt: "«Todo cambió cuando te vi...» 🎨 ¿Qué transformó el amor en su vida?", correct: "De blanco y negro al color me convertí", options: ["De blanco y negro al color me convertí", "En el momento exacto en que te conocí", "Y desde entonces solo vivo para ti"] },
            { song: "Alejandro Fernández - Me Dediqué a Perderte", prompt: "«Si pudiera volver al pasado...» ⏳ ¿Qué haría diferente si tuviera otra oportunidad?", correct: "Te abrazaría fuerte y no te dejaría", options: ["Te abrazaría fuerte y no te dejaría", "Te regalaría toda mi alegría", "Te cuidaría de noche y de día"] },
            { song: "Carlos Vives - Volví a Nacer", prompt: "«Quiero casarme contigo...» 💍 ¿Y qué más quiere Carlos con su hermosa Melissa?", correct: "Quedarme a tu lado, ser el bendecido con tu amor", options: ["Quedarme a tu lado, ser el bendecido con tu amor", "Regalarte el mundo entero y todo mi calor", "Cuidarte los sueños sin ningún temor"] },
            { song: "Jorge Celedón / Fonseca - Esta Vida", prompt: "«Me gusta el olor a tierra mojada...» 🌿🎶 ¿Y qué es lo que más nos gusta de esta vida?", correct: "Me gusta vivir esta vida a tu lado y amarte", options: ["Me gusta vivir esta vida a tu lado y amarte", "Me gusta cantar por la noche y abrazarte", "Me gusta viajar por el mundo para admirarte"] },
            { song: "Binomio de Oro - Niña Bonita", prompt: "«Tú eres mi niña bonita...» 👸❤️ ¿Qué representa Melissa en la vida de Carlos?", correct: "La que me quita el sueño y me da alegría", options: ["La que me quita el sueño y me da alegría", "La estrella más brillante de toda mi vida", "La luz que ilumina mi noche y mi día"] },
            { song: "Fonseca - Prometo", prompt: "«Prometo darte el sol todos los días...» ☀️ ¿Cuál es la promesa eterna del amor?", correct: "Prometo cuidarte y amarte toda la vida", options: ["Prometo cuidarte y amarte toda la vida", "Prometo cantarte canciones de alegría", "Prometo llevarte a bailar cada madrugada"] },
            { song: "Juan Luis Guerra - Burbujas de Amor", prompt: "«Quisiera ser un pez...» 🐠💭 ¿Para qué quiere ser un pez en esta romántica bachata?", correct: "Para tocar mi nariz en tu pecera y hacer burbujas de amor", options: ["Para tocar mi nariz en tu pecera y hacer burbujas de amor", "Para nadar por tus mares de ilusión verdadera", "Para cuidarte de noche en la costa entera"] },
            { song: "Romeo Santos / Aventura - Solo por un Beso", prompt: "«Solo por un beso...» 💋 ¿Qué sucede con tan solo un beso de la persona amada?", correct: "Se puede enamorar sin darte cuenta", options: ["Se puede enamorar sin darte cuenta", "Se detiene el tiempo en cámara lenta", "Se calma la lluvia y la tormenta"] },
            { song: "Marc Anthony - Valió la Pena", prompt: "«Valió la pena lo que era necesario...» 💃 ¿Por qué valió la pena todo el esfuerzo?", correct: "Para estar contigo amor, tú eres una bendición", options: ["Para estar contigo amor, tú eres una bendición", "Porque al final triunfó nuestra gran ilusión", "Para regalarte entero todo mi corazón"] },
            { song: "Marc Anthony - Tu Amor Me Hace Bien", prompt: "«Te quiero así deliciosa...» 🌹 ¿Qué le dice Marc Anthony a su gran amor?", correct: "Tranquila, porque tu amor me hace bien", options: ["Tranquila, porque tu amor me hace bien", "Feliz, porque contigo el mundo es un Edén", "Segura, porque te amo como a nadie más"] },
            { song: "Chayanne - Me Enamoré de Ti", prompt: "«Me enamoré de ti, y qué...» 💘 ¿Qué importa cuando el amor es verdadero?", correct: "Me importa si no es fácil, yo te quiero", options: ["Me importa si no es fácil, yo te quiero", "El mundo entero sabe que soy sincero", "Por un abrazo tuyo yo me muero"] },
            { song: "Chayanne - Dejaría Todo", prompt: "«Dejaría todo porque te quedaras...» 🥺🙏 ¿Qué estaría dispuesto a dejar por su amor?", correct: "Mi credo, mi pasado, mi religión", options: ["Mi credo, mi pasado, mi religión", "Mis miedos, mis dudas y mi corazón", "El mundo entero sin ninguna condición"] },
            { song: "Shakira - Día de Enero", prompt: "«Y aunque hayas sido un extranjero...» 🩹❤️ ¿Qué le promete Shakira en este hermoso himno?", correct: "Te voy a curar el corazón partío", options: ["Te voy a curar el corazón partío", "Te voy a dar todo el calor del hogar mío", "Te voy a querer tanto que olvidarás el frío"] },
            { song: "Sebastián Yatra - Robarte un Beso", prompt: "«Déjame robarte un beso...» 😘 ¿Hasta dónde quiere que llegue ese beso?", correct: "Que me llegue hasta el alma", options: ["Que me llegue hasta el alma", "Que nos devuelva toda la calma", "Que suene fuerte como una palma"] },
            { song: "Morat - Cuando Nadie Ve", prompt: "«Cuando nadie ve...» 🕶️✨ ¿Qué pasa en la intimidad de ese amor secreto y mágico?", correct: "Te puedo querer, te puedo besar", options: ["Te puedo querer, te puedo besar", "Nos ponemos los dos a cantar y bailar", "El tiempo se detiene sin preguntar"] },
            { song: "Morat - Besos en Guerra", prompt: "«Sabes que no hay que ser un adivino...» 🔮 ¿Qué se ve claramente en nuestro destino?", correct: "Para ver que el destino nos unió", options: ["Para ver que el destino nos unió", "Para saber que este amor nunca murió", "Para entender todo lo que nos pasó"] },
            { song: "Camilo - Vida de Rico", prompt: "«Yo no tengo pa' darte un viaje al Polo Norte...» 🏡 ¿Pero qué es lo más valioso que le ofrece?", correct: "Pero tengo un amor que no se rompe", options: ["Pero tengo un amor que no se rompe", "Pero te doy mi vida sin que te importe", "Pero tengo besos de todo corte"] },
            { song: "Camilo & Evaluna - Por Primera Vez", prompt: "«Por primera vez...» 🌅 ¿Qué ocurrió en ese amanecer tan especial?", correct: "Un amanecer bonito me despertó a tu lado", options: ["Un amanecer bonito me despertó a tu lado", "Sentí mi corazón totalmente enamorado", "Supe que todo lo triste había pasado"] },
            { song: "Feid - Luna", prompt: "«Te busco en la luna...» 🌕💚 ¿Cómo recuerda a esa persona especial en la distancia?", correct: "Y en cada estrella veo tu mirada", options: ["Y en cada estrella veo tu mirada", "Porque sin ti mi vida no es nada", "Con la esperanza intacta y guardada"] },
            { song: "Karol G - Mientras Me Curo del Cora", prompt: "«Y mientras me curo del cora...» 🌊☀️ ¿Cuál es la actitud positiva para sanar?", correct: "Hoy salgo para el mar a ver el sol, sé que todo va a estar mejor", options: ["Hoy salgo para el mar a ver el sol, sé que todo va a estar mejor", "Me pongo a cantar con mucha fuerza y amor", "Abrazo a los que quiero sin ningún temor"] },
            { song: "Karol G - Ocean", prompt: "«Me siento grande por ti...» 🌌 ¿Qué tan inmenso es este amor tan bonito?", correct: "Y aunque lo intentara no podría sin ti", options: ["Y aunque lo intentara no podría sin ti", "Tú eres todo lo que yo siempre pedí", "Desde el primer segundo en que te vi"] },
            { song: "Luis Fonsi & Daddy Yankee - Despacito", prompt: "«Pasito a pasito, suave suavecito...» 💃🕺 ¿Cómo nos vamos acercando?", correct: "Nos vamos pegando poquito a poquito", options: ["Nos vamos pegando poquito a poquito", "Bailando juntos en este bonito rito", "Gritando nuestro amor al infinito"] },
            { song: "Enrique Iglesias - Bailando", prompt: "«Yo te miro, se me corta la respiración...» 💓 ¿Qué pasa cuando cruzan las miradas?", correct: "Cuanto tú me miras se me sube el corazón", options: ["Cuanto tú me miras se me sube el corazón", "Se enciende el fuego de nuestra pasión", "Empieza a sonar nuestra mejor canción"] },
            { song: "Ricky Martin - Tu Recuerdo", prompt: "«Tu recuerdo sigue aquí...» 🌧️ ¿Cómo describe esa presencia constante en su alma?", correct: "Como un aguacero en el desierto", options: ["Como un aguacero en el desierto", "Como un tesoro que mantengo abierto", "Como un sueño del que nunca despierto"] },
            { song: "David Bisbal - Ave María", prompt: "«Ave María, ¿cuándo serás mía?...» 🌹 ¿Qué estaría dispuesto a dar por su amor?", correct: "Si me quisieras, todo te daría", options: ["Si me quisieras, todo te daría", "De noche y de día yo te cuidaría", "Tu amor sería mi mayor alegría"] },
            { song: "Ricardo Montaner - Tan Enamorados", prompt: "«Tan enamorados de la madrugada...» 🌃 ¿Qué pasa con el tiempo cuando están juntos?", correct: "Que la noche dura un poco más", options: ["Que la noche dura un poco más", "Que no nos queremos separar jamás", "Que dejamos todo el dolor atrás"] },
            { song: "Cristian Castro - Azul", prompt: "«Este amor es azul como el mar azul...» 🌊 ¿De dónde nació esta ilusión tan grande?", correct: "Como de tu mirada nació mi ilusión", options: ["Como de tu mirada nació mi ilusión", "Como el cielo puro de nuestra pasión", "Como un poema escrito en el corazón"] },
            { song: "Luis Miguel - Hasta que me olvides", prompt: "«Hasta que me olvides, voy a intentarlo...» 🍷 ¿Qué tan fuerte es la perseverancia de este amor?", correct: "No habrá quien me seque este amor", options: ["No habrá quien me seque este amor", "Lucharé por ti con todo mi valor", "Te daré mi vida y todo mi calor"] },
            { song: "Sin Bandera - Mientes Tan Bien / Que Lloro", prompt: "«Que lloro por ti...» 😢❤️ ¿Cómo expresa ese sentimiento profundo en la balada?", correct: "Que lloro sin ti, que ya lo entendí", options: ["Que lloro sin ti, que ya lo entendí", "Que sufro en silencio porque te perdí", "Que daría mi vida entera por ti"] },
            { song: "Reik - Yo Quisiera", prompt: "«Yo quisiera ser aquel...» 🧥🌙 ¿Qué anhela ser para la dueña de sus sueños?", correct: "Que por ti diera la vida y te abrigara en la noche", options: ["Que por ti diera la vida y te abrigara en la noche", "Que te regale flores en un hermoso coche", "Que te ame por siempre sin ningún reproche"] },
            { song: "Camila - Mientes / Todo Cambió", prompt: "«Tú llegaste a mi vida...» ☀️ ¿Qué trajo su llegada al corazón?", correct: "Como un sol que me dio calor", options: ["Como un sol que me dio calor", "Borrando para siempre todo dolor", "Llenando mi mundo de mucho color"] },
            { song: "Alejandro Sanz - Amiga Mía", prompt: "«Amiga mía, princesa de un cuento infinito...» 👑 ¿Qué significa ella en su mundo?", correct: "Tú eres todo lo que necesito", options: ["Tú eres todo lo que necesito", "El verso más hermoso que se ha escrito", "Un amor tan puro y tan bonito"] },
            { song: "Juanes - A Dios le Pido", prompt: "«Que mis ojos se despierten con la luz de tu mirada...» 🙏✨ ¿Qué es lo que le pide a Dios?", correct: "A Dios le pido que te quedes a mi lado", options: ["A Dios le pido que te quedes a mi lado", "A Dios le pido que siempre seas feliz", "A Dios le pido un amor ilimitado"] },
            { song: "Jesse & Joy - ¡Corre!", prompt: "«Así que corre, corre, corre corazón...» 🏃‍♀️🏃‍♂️ ¿Hacia dónde corre nuestro destino?", correct: "Hacia mis brazos sin temor", options: ["Hacia mis brazos sin temor", "A buscar un mundo mucho mejor", "Para vivir siempre en nuestro amor"] },
            { song: "Mon Laferte - Amárrame", prompt: "«Amárrame...» 🎀❤️ ¿Cuál es la petición apasionada en este dueto?", correct: "Abrázame fuerte y no me sueltes jamás", options: ["Abrázame fuerte y no me sueltes jamás", "Cariño mío, dame un beso más", "Y baila conmigo dejando todo atrás"] },
            { song: "Rosalía & Rauw Alejandro - Beso", prompt: "«Yo ya necesito otro beso...» 😘 ¿De qué tipo de besos está hablando?", correct: "De esos que tú me das", options: ["De esos que tú me das", "Que me llenen de paz", "Que no olvidaré jamás"] },
            { song: "Manuel Turizo - La Bachata", prompt: "«Ando manejando por las calles que besaste...» 🚗 ¿Y qué va haciendo en el camino?", correct: "Y escuchando la canción que me cantaste", options: ["Y escuchando la canción que me cantaste", "Y recordando todo lo que me regalaste", "Y pensando en el amor que me dejaste"] },
            { song: "Piso 21 - Te Vi", prompt: "«Te vi, me enamoré...» 😍 ¿Qué supe en ese preciso instante?", correct: "Y supe que eras tú la mujer de mi vida", options: ["Y supe que eras tú la mujer de mi vida", "Que mi alma por fin estaba completa y sanada", "Que mi suerte para siempre cambió de medida"] },
            { song: "Mike Bahía - Amantes / Detente", prompt: "«Detente un minuto...» ⏱️🌹 ¿Para qué le pide detener el tiempo?", correct: "Y mírame a los ojos para decirte que te amo", options: ["Y mírame a los ojos para decirte que te amo", "Para abrazarte fuerte y decirte que te extraño", "Para que sepas que contigo nunca me engaño"] },
            { song: "Carlos Rivera - Me Muero", prompt: "«Me muero por besarte...» 💋 ¿Y qué más desea hacer con todo su ser?", correct: "Por rodearte con mis brazos llenos de amor", options: ["Por rodearte con mis brazos llenos de amor", "Por cuidarte y quitarte todo el dolor", "Por regalarte una vida llena de color"] },
            { song: "Christian Nodal - De los Besos que te Di", prompt: "«De los besos que te di...» 🤠💋 ¿Qué pregunta se hace sobre esos momentos?", correct: "¿Cuál de todos fue el que te hizo enamorar?", correct_idx: 0, options: ["¿Cuál de todos fue el que te hizo enamorar?", "¿Cuál recuerdas cuando te vas a acostar?", "¿Cuál te gustaría volver a probar?"] },
            { song: "Grupo Frontera & Bad Bunny - un x100to", prompt: "«Me queda un por ciento...» 🔋📱 ¿Y en qué usa ese último porcentaje de batería?", correct: "Y lo uso solo para decirte cuánto te quiero", options: ["Y lo uso solo para decirte cuánto te quiero", "Para mandarte un beso sincero", "Para decirte que eres mi mundo entero"] },
            { song: "👑 Dedicatoria: Himno de Carlos & Meli", prompt: "«En el Universo de Melissa cada día...» 💖 ¿Cómo continúa esta canción real de su amor?", correct: "Carlos le demuestra su amor infinito", options: ["Carlos le demuestra su amor infinito", "Todo es hermoso y el cielo es muy bonito", "Se escriben poemas en un papelito"] },
            { song: "💘 Dedicatoria: El Ritmo del Corazón", prompt: "«¿Cuál es la melodía más hermosa que escucha Carlos todos los días?» 🎧", correct: "La risa y la dulce voz de su amada Melissa", correct_idx: 0, options: ["La risa y la dulce voz de su amada Melissa", "Las canciones de la radio por la mañana", "El sonido de la lluvia cayendo en la ventana"] },
            { song: "🏆 Dedicatoria: Día 10 de Recuperación", prompt: "«¿Qué celebra hoy todo el Universo con música, aplausos y alegría?» 🎉", correct: "¡10 días de valentía y un amor imparable!", options: ["¡10 días de valentía y un amor imparable!", "Que ganamos el campeonato de fútbol", "Que salió el sol más brillante de todos"] },
            { song: "🌟 Dedicatoria: La Fuerza de Melissa", prompt: "«Cuando el camino se pone un poco difícil...» 💪🥰 ¿Qué hace Carlos por su reina?", correct: "Le toma la mano y le recuerda que juntos son invencibles", options: ["Le toma la mano y le recuerda que juntos son invencibles", "Le canta una serenata debajo de la ventana", "Le regala un ramo de flores cada mañana"] },
            { song: "💖 Dedicatoria: El Universo de Melissa", prompt: "«¿Por qué Carlos creó este universo mágico de 30 días?» 🪐✨", correct: "Porque el amor verdadero se demuestra con hechos y detalles", options: ["Porque el amor verdadero se demuestra con hechos y detalles", "Porque quería ganar un concurso de programación", "Porque le gusta mucho jugar en la computadora"] },
            // --- 50 NUEVAS PREGUNTAS EXCLUSIVAS DE MORAT ---
            { song: "Morat - No Se Va", prompt: "«Y aunque todo cambie, hay cosas que no cambian...» 🎸 ¿Qué dice el coro del himno de Morat?", correct: "Y tu recuerdo no se va, no se va, no se va", options: ["Y tu recuerdo no se va, no se va, no se va", "Y mi corazón se queda aquí en el mismo lugar", "Y el amor que te tengo nunca dejará de brillar"] },
            { song: "Morat - No Se Va (Verso)", prompt: "«Quédate otra vez, quédate toda la noche...» 🌙 ¿Cómo continúa esta petición de amor?", correct: "Quédate otra vez, quédate una vida", options: ["Quédate otra vez, quédate una vida", "Quédate conmigo hasta la despedida", "Quédate abrazada sin encontrar salida"] },
            { song: "Morat - Cómo Te Atreves (Verso 2)", prompt: "«Y yo me guardé mil pedazos de mi corazón...» 💔 ¿Para qué se los guardó?", correct: "Esperando por si alguna vez volvías", options: ["Esperando por si alguna vez volvías", "Para escribirte las mejores poesías", "Porque sabía que pronto me amarías"] },
            { song: "Morat - Cómo Te Atreves (Coro)", prompt: "«Cuatro años sin mirarte...» 👀 ¿Y qué pasó después de tanto tiempo?", correct: "Y hoy te tengo frente a frente", options: ["Y hoy te tengo frente a frente", "Y mi amor sigue igual de caliente", "Y te extraño inevitablemente"] },
            { song: "Morat - Besos en Guerra (Verso)", prompt: "«¿Quién te dijo que el amor es una apuesta...?» 🎲 ¿Qué pasa en esa apuesta según Morat?", correct: "Donde siempre uno pierde y otro gana", options: ["Donde siempre uno pierde y otro gana", "Donde se sufre desde la mañana", "Donde la tristeza entra por la ventana"] },
            { song: "Morat & Juanes - Besos en Guerra (Coro)", prompt: "«Por qué me miras con esos ojos...» 😍 ¿Qué provocan esos ojitos de Melissa?", correct: "Que me roban la razón y la calma", options: ["Que me roban la razón y la calma", "Que me llevan directo hasta el alma", "Que me hacen aplaudir con la palma"] },
            { song: "Morat - Amor Con Hielo", prompt: "«Y es que ya no soy el mismo que te amaba a ciegas...» ❄️ ¿Qué pasa ahora en esta canción?", correct: "Ya no me hace falta tu calor", options: ["Ya no me hace falta tu calor", "Ahora vivo lleno de mucho color", "Se acabó para siempre el dolor"] },
            { song: "Morat - Amor Con Hielo (Coro)", prompt: "«Ahora me toca a mí...» ⏰ ¿Qué le toca ver ahora en la canción?", correct: "Ver cómo te derrites por volver", options: ["Ver cómo te derrites por volver", "Ver cómo empieza un nuevo amanecer", "Ver todo lo bonito que va a suceder"] },
            { song: "Morat - A Dónde Vamos", prompt: "«A dónde vamos si no es de tu mano...» 🤝💖 ¿Qué es el camino sin su amor?", correct: "A dónde vamos si el camino no es contigo", options: ["A dónde vamos si el camino no es contigo", "A dónde vamos si no tengo abrigo", "A dónde vamos si no te consigo"] },
            { song: "Morat - A Dónde Vamos (Coro)", prompt: "«Y no nos importa hacia dónde sople el viento...» 🌬️ ¿Por qué no les importa el viento?", correct: "Si tengo tus besos yo tengo mi destino", options: ["Si tengo tus besos yo tengo mi destino", "Porque nuestro amor es un camino divino", "Porque superamos cualquier torbellino"] },
            { song: "Morat & Álvaro Soler - Yo Contigo, Tú Conmigo", prompt: "«¿Por qué parar para pensar...?» 🌍 ¿Qué hacen cuando están juntos?", correct: "Si yo contigo, tú conmigo, le damos vuelta al mundo", options: ["Si yo contigo, tú conmigo, le damos vuelta al mundo", "Y nos damos un abrazo súper profundo", "Porque nuestro amor es el más rotundo"] },
            { song: "Morat & Feid - Salir con Vida", prompt: "«Yo nunca había visto un espectáculo igual...» ✨ ¿A qué espectáculo se refiere?", correct: "Que el de ver tus ojos al despertar", options: ["Que el de ver tus ojos al despertar", "Como verte sonreír y bailar", "Como el de la luna sobre el mar"] },
            { song: "Morat & Feid - Salir con Vida (Coro)", prompt: "«De este amor yo no quiero...» 💓 ¿Cuál es la declaración de este temazo?", correct: "Salir con vida si no es a tu lado", options: ["Salir con vida si no es a tu lado", "Olvidar ni un segundo lo pasado", "Dejar mi corazón desamparado"] },
            { song: "Morat - Cuando Nadie Ve (Verso 2)", prompt: "«Y me pongo a contar los segundos...» ⏱️ ¿Para qué cuenta los segundos Carlos?", correct: "Para que estemos solos tú y yo", options: ["Para que estemos solos tú y yo", "Para que empiece de nuevo el reloj", "Para darte un beso con mucho fervor"] },
            { song: "Morat - Cuando Nadie Ve (Coro 2)", prompt: "«Se me nota en la mirada...» 🥰 ¿Qué se le nota a Carlos a leguas?", correct: "Lo mucho que me muero por tenerte", options: ["Lo mucho que me muero por tenerte", "Que tengo una increíble buena suerte", "Que mi amor por ti es súper fuerte"] },
            { song: "Morat - Porfa No Te Vayas", prompt: "«Porfa no te vayas...» 🙏❤️ ¿Qué pasa si ella se va?", correct: "Que sin ti mi vida pierde toda la magia", options: ["Que sin ti mi vida pierde toda la magia", "Que me quedo triste en esta terraza", "Que se apagan las luces de la casa"] },
            { song: "Morat - Porfa No Te Vayas (Verso)", prompt: "«Y es que te miro y se me olvida el mundo...» 🌎 ¿Por qué se olvida el mundo?", correct: "Porque tú eres todo lo que quiero", options: ["Porque tú eres todo lo que quiero", "Porque tu amor es verdadero", "Porque te amo desde enero"] },
            { song: "Morat - Llamada Perdida", prompt: "«Y tengo mil llamadas perdidas en mi teléfono...» 📱 ¿De quién espera llamada?", correct: "Pero solo espero escuchar tu voz", options: ["Pero solo espero escuchar tu voz", "Porque mi corazón late muy veloz", "Y quiero que estemos juntos los dos"] },
            { song: "Morat - París", prompt: "«¿Cómo te vas a ir a París...?» 🗼 ¿Y dejarlo haciendo qué?", correct: "Y dejarme aquí contando las horas por verte", options: ["Y dejarme aquí contando las horas por verte", "Sin darme un beso para la buena suerte", "Y olvidarte de un amor tan fuerte"] },
            { song: "Morat - Valen Más", prompt: "«Tus defectos valen más...» 💎 ¿Qué valen más los defectos del amor de tu vida?", correct: "Que las virtudes de cualquiera", options: ["Que las virtudes de cualquiera", "Que el oro de la tierra entera", "Que la primavera más sincera"] },
            { song: "Morat - Valen Más (Coro)", prompt: "«Porque eres perfecta tal como eres...» 👸 ¿Qué cambiaría Carlos de Melissa?", correct: "Y no cambiaría absolutamente nada de ti", options: ["Y no cambiaría absolutamente nada de ti", "Solo pediría que estés siempre junto a mí", "Desde aquel momento hermoso en que te vi"] },
            { song: "Morat & Juanes - 506", prompt: "«Recuerdo el número de tu casa...» 🏠🎶 ¿Qué número mágico recuerdan?", correct: "El 506 donde todo empezó", options: ["El 506 donde todo empezó", "El 100 por ciento que nos unió", "El 30 de nuestro aniversario"] },
            { song: "Morat - 506 (Coro)", prompt: "«¿Cómo hago para no pensarte...?» 💭❤️ ¿Dónde la lleva guardada?", correct: "Si estás tatuada en mi memoria y en mi piel", options: ["Si estás tatuada en mi memoria y en mi piel", "Si eres más dulce y rica que la miel", "Si mi corazón siempre te será fiel"] },
            { song: "Morat - Enamórate de Alguien Más", prompt: "«No quiero que sufras por mi culpa...» 🌹 ¿Qué desea en el fondo en esta balada?", correct: "Pero en el fondo quiero que siempre me recuerdes", options: ["Pero en el fondo quiero que siempre me recuerdes", "Quiero que nunca en la vida te pierdas", "Que cantemos juntos jugando con cuerdas"] },
            { song: "Morat - Punto y Aparte", prompt: "«Tú eres mi punto y aparte...» 📖 ¿Qué significa ella en su historia?", correct: "El comienzo de la historia más bonita de mi vida", options: ["El comienzo de la historia más bonita de mi vida", "La razón por la que mi alma no está perdida", "La luz que ilumina toda mi avenida"] },
            { song: "Morat - Aprender a Quererte", prompt: "«Cuando te vi sentí que mi vida...» ⚡ ¿Qué sintió al verla por primera vez?", correct: "Estaba a punto de cambiar para siempre", options: ["Estaba a punto de cambiar para siempre", "Se llenó de luz en el mes de diciembre", "Era una semilla que quería que siembre"] },
            { song: "Morat - Aprender a Quererte (Coro)", prompt: "«Y es que yo quiero aprender a quererte...» 🎓❤️ ¿Cómo quiere quererla?", correct: "Como nadie en este mundo te ha querido jamás", options: ["Como nadie en este mundo te ha querido jamás", "Con una pasión que te llene de paz", "Sin mirar ni un segundo hacia atrás"] },
            { song: "Morat - La Correcta", prompt: "«Tú eres la persona correcta...» 🎯 ¿En qué momento llegó?", correct: "En el momento perfecto y en el lugar ideal", options: ["En el momento perfecto y en el lugar ideal", "Para hacerme sentir un amor sin igual", "Como un hermoso sueño celestial"] },
            { song: "Morat - La Correcta (Coro)", prompt: "«No hay dudas cuando te miro...» 👁️✨ ¿Qué certeza tiene Carlos?", correct: "Sé que eres el amor de toda mi vida", options: ["Sé que eres el amor de toda mi vida", "Que mi alma jamás se sentirá abatida", "Que eres mi reina consentida"] },
            { song: "Morat - Mi Nuevo Vicio", prompt: "«Tú eres mi nuevo vicio...» 🍬 ¿Qué le produce ese vicio tan bonito?", correct: "El que me hace feliz y me quita el dolor", options: ["El que me hace feliz y me quita el dolor", "El que me llena de mucho calor", "El que le da a mi vida su color"] },
            { song: "Morat - Acuérdate de Mí", prompt: "«Cuando mires las estrellas en la noche...» 🌌 ¿Qué le pide al mirar al cielo?", correct: "Acuérdate de cuánto te amo yo", options: ["Acuérdate de cuánto te amo yo", "Pide un deseo con mucha ilusión", "Siente el latido de mi corazón"] },
            { song: "Morat - Otras Se Van", prompt: "«Y aunque otras personas se vayan...» 🚶‍♀️❤️ ¿Qué hace el amor verdadero?", correct: "Yo me quedo contigo en las buenas y en las malas", options: ["Yo me quedo contigo en las buenas y en las malas", "Yo te regalo mis sueños y mis alas", "Te llevo a bailar por todas las salas"] },
            { song: "Morat & Danna Paola - Idiota", prompt: "«Yo fui un idiota al pensar...» 🤦‍♂️ ¿Qué pensamiento tonto tuvo en el pasado?", correct: "Que podría vivir un solo segundo sin tu amor", options: ["Que podría vivir un solo segundo sin tu amor", "Que el tiempo pasaba sin ningún dolor", "Que no necesitaba de todo tu calor"] },
            { song: "Morat - Mi Suerte", prompt: "«Tú eres mi mayor suerte...» 🍀 ¿Cómo describe a Melissa en esta canción?", correct: "El boleto ganador que la vida me regaló", options: ["El boleto ganador que la vida me regaló", "La estrella más bella que me iluminó", "El amor infinito que me rescató"] },
            { song: "Morat - Mi Suerte (Coro)", prompt: "«No cambio un minuto a tu lado...» ⏳💖 ¿Por qué no lo cambiaría?", correct: "Por todo el oro del mundo", options: ["Por todo el oro del mundo", "Por un océano profundo", "Por un segundo errabundo"] },
            { song: "Morat - Primeras Veces", prompt: "«Contigo quiero vivir...» 🚀 ¿Qué quiere vivir Carlos con su novia?", correct: "Todas las primeras veces que me faltan por vivir", options: ["Todas las primeras veces que me faltan por vivir", "Los sueños más bonitos antes de dormir", "Una historia eterna para compartir"] },
            { song: "Morat - Debí Suponerlo", prompt: "«Debí suponer que al mirarte...» 😍 ¿Qué debió suponer desde el día 1?", correct: "Me iba a enamorar perdidamente de ti", options: ["Me iba a enamorar perdidamente de ti", "Que serías el centro de mi existir", "Que juntos íbamos siempre a sonreír"] },
            { song: "Morat - Feo", prompt: "«No importa lo que diga la gente...» 🗣️¿Qué pasa con su amor?", correct: "Nuestro amor es lo más hermoso del universo", options: ["Nuestro amor es lo más hermoso del universo", "Cada día se convierte en un nuevo verso", "Es un sentimiento puro e inmerso"] },
            { song: "Morat - Nunca Volvieron", prompt: "«Las tristezas se fueron...» ☀️ ¿Y cuándo volvieron?", correct: "Y desde que estás tú nunca volvieron", options: ["Y desde que estás tú nunca volvieron", "Se desvanecieron y desaparecieron", "Con nuestro amor se resolvieron"] },
            { song: "Morat - Sobreviviste", prompt: "«A todas las tormentas del pasado...» 🌧️🌈 ¿Para qué sobreviviste mi amor?", correct: "Sobreviviste para ser mi gran amor", options: ["Sobreviviste para ser mi gran amor", "Para llenarme de paz y de valor", "Para brillar con todo tu esplendor"] },
            { song: "Morat & Sebastián Yatra - Bajo La Mesa (Verso 2)", prompt: "«Y tocar tus pies bajo la mesa...» 🥿🤭 ¿Para qué hace ese gesto cómplice?", correct: "Para que sepas que estoy aquí solo para ti", options: ["Para que sepas que estoy aquí solo para ti", "Para hacerte reír sin que nadie se entere", "Para demostrar el amor que se quiere"] },
            { song: "Morat & Sebastián Yatra - Bajo La Mesa (Coro 2)", prompt: "«Que si te vas me llevo una tristeza...» 🧩 ¿Por qué le dolería tanto?", correct: "Porque eres tú mi pieza favorita del rompecabezas", options: ["Porque eres tú mi pieza favorita del rompecabezas", "Porque tu amor me llena de grandezas", "Porque contigo se acaban las asperezas"] },
            { song: "Morat - Segundos Platos", prompt: "«Yo no nací para ser...» 🍽️ ¿Qué lugar ocupa Melissa en el corazón de Carlos?", correct: "La segunda opción de nadie, contigo soy el número uno", options: ["La segunda opción de nadie, contigo soy el número uno", "El que se rinde cuando llega el desayuno", "Una casualidad sin destino alguno"] },
            { song: "Morat - Mil Tormentas", prompt: "«Aunque vengan mil tormentas...» ⛈️☂️ ¿Qué le promete Carlos en las dificultades?", correct: "Yo seré tu refugio y tu paz", options: ["Yo seré tu refugio y tu paz", "Te amaré como nunca jamás", "No te voy a soltar hacia atrás"] },
            { song: "Morat - Si Ayer Fuera Hoy", prompt: "«Si ayer fuera hoy...» 📅❤️ ¿Qué elección tomaría Carlos una y otra vez?", correct: "Te volvería a elegir una y mil veces más", options: ["Te volvería a elegir una y mil veces más", "Te regalaría mi corazón en paz", "Te llevaría a volar por donde vas"] },
            { song: "Morat - Al Aire", prompt: "«Quiero gritar nuestro amor al aire...» 📢 ¿Para qué gritarlo tan fuerte?", correct: "Para que todo el mundo sepa cuánto te quiero", options: ["Para que todo el mundo sepa cuánto te quiero", "Para mandar un mensaje sincero", "Porque eres tú mi lucero primero"] },
            { song: "Morat - No Termino", prompt: "«Y es que yo nunca termino...» ♾️ ¿De qué no termina Carlos jamás?", correct: "De admirar tu belleza y tu valentía", options: ["De admirar tu belleza y tu valentía", "De pensar en ti de noche y de día", "De escribirte nuestra hermosa melodía"] },
            { song: "Morat - Antes de los Veinte", prompt: "«Desde que te conocí...» ⏳ ¿Qué supe sobre mi futuro?", correct: "Supe que mi futuro solo tenía sentido contigo", options: ["Supe que mi futuro solo tenía sentido contigo", "Sabía que serías mi mejor abrigo", "Que Dios te mandó como un regalo amigo"] },
            { song: "Morat - Causa Perdida", prompt: "«No eres una causa perdida...» 🏆 ¿Qué eres para el corazón de tu novio?", correct: "Eres la victoria más hermosa de mi corazón", options: ["Eres la victoria más hermosa de mi corazón", "La dueña de toda mi razón", "El motivo de mi mejor canción"] },
            { song: "Morat - Labios Rotos", prompt: "«Y con un solo beso tuyo...» 💋 ¿Qué pasa con todas las heridas?", correct: "Se sanan todas mis heridas por completo", options: ["Se sanan todas mis heridas por completo", "Se olvida el mundo y todo su secreto", "Se cumple mi amoroso decreto"] },
            // --- 50 NUEVAS PREGUNTAS DE VALLENATO ROMÁNTICO ---
            { song: "Felipe Peláez - El Amor Más Grande del Planeta", prompt: "«Yo te voy a amar como nadie en el planeta...» 🌍❤️ ¿Qué le promete Felipe Peláez a su amada?", correct: "Y te voy a regalar mi vida entera", options: ["Y te voy a regalar mi vida entera", "Porque tú eres mi regalo más bonito", "Y te haré canciones cada madrugada"] },
            { song: "Felipe Peláez - El Amor Más Grande del Planeta (Coro)", prompt: "«Tú me cambiaste la vida desde que llegaste...» 💫 ¿Y por eso qué le da?", correct: "Y por eso te doy el amor más grande del planeta", options: ["Y por eso te doy el amor más grande del planeta", "Y te escribo poesías en una libreta", "Porque eres la reina de mi meta"] },
            { song: "Felipe Peláez - Tan Natural", prompt: "«Y es que se me da tan natural...» 🍃🎶 ¿Qué se le da natural con Melissa?", correct: "Quererte, adorarte y pensarte cada segundo", options: ["Quererte, adorarte y pensarte cada segundo", "Cuidar tus sueños por todo el mundo", "Darte un beso dulce y profundo"] },
            { song: "Felipe Peláez - Te Amo y Te Amo", prompt: "«Te amo, te amo y te amo...» 💘 ¿Qué le dice con tanta insistencia?", correct: "Y no me cansaré de decírtelo toda la vida", options: ["Y no me cansaré de decírtelo toda la vida", "Porque tú eres mi estrella consentida", "Y mi alma jamás estará perdida"] },
            { song: "Felipe Peláez - Lo Tienes Todo", prompt: "«Tú lo tienes todo para hacerme feliz...» 👸✨ ¿Qué es lo que tiene?", correct: "La sonrisa más bella y el alma más pura", options: ["La sonrisa más bella y el alma más pura", "Una mirada llena de ternura", "El amor que me cura toda locura"] },
            { song: "Binomio de Oro - Quiero Que Seas Mi Estrella", prompt: "«Quiero que seas mi estrella...» ⭐ ¿Para qué quiere que sea su estrella?", correct: "La que ilumine mis noches y guíe mi camino", options: ["La que ilumine mis noches y guíe mi camino", "Para llevarla siempre en mi destino", "Porque tu amor es un regalo divino"] },
            { song: "Binomio de Oro - Quiero Que Seas Mi Estrella (Coro)", prompt: "«Y es que yo me ilusioné con tu mirada...» 😍 ¿Qué pasó después de ilusionarse?", correct: "Y ahora solo vivo para entregarte mi amor", options: ["Y ahora solo vivo para entregarte mi amor", "Y se acabó para siempre todo el dolor", "Y mi mundo se llenó de mucho color"] },
            { song: "Binomio de Oro - Un Osito Dormilón", prompt: "«Te regalaré un osito dormilón...» 🧸😴 ¿Para qué le regala ese osito?", correct: "Para que te acompañe y te abrace en mis ausencias", options: ["Para que te acompañe y te abrace en mis ausencias", "Para que escuches todas mis vivencias", "Porque tu amor no tiene competencias"] },
            { song: "Binomio de Oro - Me Ilusioné", prompt: "«Me ilusioné, me enamoré...» 💖 ¿De qué se enamoró profundamente?", correct: "De tu sonrisa dulce y de tus ojos hermosos", options: ["De tu sonrisa dulce y de tus ojos hermosos", "De los momentos mágicos y dichosos", "De tus abrazos cálidos y cariñosos"] },
            { song: "Binomio de Oro - Niña Bonita (Verso)", prompt: "«Cuando te veo caminar se detiene el tiempo...» ⌛ ¿Por qué le causa esa sensación?", correct: "Porque eres la reina consentida de mi corazón", options: ["Porque eres la reina consentida de mi corazón", "Porque eres la musa de mi canción", "Porque eres mi más grande bendición"] },
            { song: "Binomio de Oro - Cómo Te Olvido", prompt: "«Si te llevo en cada latido de mi pecho...» 💓 ¿Qué pasa con su recuerdo?", correct: "Es imposible olvidarte porque eres mi vida", options: ["Es imposible olvidarte porque eres mi vida", "Tu imagen jamás estará perdida", "Eres mi princesa y mi consentida"] },
            { song: "Diomedes Díaz - Tú Eres La Reina", prompt: "«Tú eres la reina de mi alma...» 👑 ¿Qué reina en la vida de Carlos?", correct: "La que manda en mi corazón y en mi destino", options: ["La que manda en mi corazón y en mi destino", "La inspiración de este canto vallenato", "La que me hace feliz a cada rato"] },
            { song: "Diomedes Díaz - Tú Eres La Reina (Coro)", prompt: "«Y es que para ti son mis mejores canciones...» 🪗 ¿Por qué le canta a ella?", correct: "Porque te adoro con todo el alma mía", options: ["Porque te adoro con todo el alma mía", "Porque me llenas de paz y alegría", "Porque te pienso de noche y de día"] },
            { song: "Diomedes Díaz - Amarte Más No Pude", prompt: "«Yo te amé con todo el corazón...» ❤️🔥 ¿Y cómo sigue ese sentimiento?", correct: "Y te sigo amando más que a mi propia vida", options: ["Y te sigo amando más que a mi propia vida", "Y te amaré sin encontrar medida", "Porque eres tú mi única salida"] },
            { song: "Diomedes Díaz - Sin Medir Distancias", prompt: "«Sin medir distancias yo te busco...» 🚶‍♂️💌 ¿Por qué no le importan las distancias?", correct: "Porque el amor verdadero no conoce fronteras", options: ["Porque el amor verdadero no conoce fronteras", "Porque quiero que siempre me quieras", "Para esperarte en todas las primaveras"] },
            { song: "Diomedes Díaz - Te Necesito", prompt: "«Te necesito como el aire para respirar...» 🌬️ ¿Qué tan vital es su amor?", correct: "Porque sin tu presencia no soy nada", options: ["Porque sin tu presencia no soy nada", "Tú eres mi estrella iluminada", "La dueña de mi alma enamorada"] },
            { song: "Los Inquietos del Vallenato - Nunca Niegues Que Te Amo", prompt: "«Nunca niegues que te amo con locura...» 🥺💖 ¿Qué certeza le da?", correct: "Porque por ti he dado mi vida y mi verdad", options: ["Porque por ti he dado mi vida y mi verdad", "Te amo por toda la eternidad", "Eres mi luz y mi felicidad"] },
            { song: "Los Inquietos del Vallenato - Entrégame Tu Amor", prompt: "«Entrégame tu amor sin condiciones...» 🤝 ¿Qué promete hacer con ese amor?", correct: "Que yo te prometo cuidarlo eternamente", options: ["Que yo te prometo cuidarlo eternamente", "Que lo llevaré grabado en mi mente", "Porque te amo inevitablemente"] },
            { song: "Los Inquietos del Vallenato - Quiero Saber de Ti", prompt: "«Quiero saber de ti, de tus sueños...» 💭✨ ¿Para qué quiere saberlo todo?", correct: "Para compartir cada segundo de esta vida a tu lado", options: ["Para compartir cada segundo de esta vida a tu lado", "Para tener mi corazón enamorado", "Para olvidar todo lo triste del pasado"] },
            { song: "Los Inquietos del Vallenato - Regálame una Noche", prompt: "«Regálame una noche bajo el cielo azul...» 🌃🎶 ¿Qué le haría en esa noche?", correct: "Para cantarte al oído lo mucho que te quiero", options: ["Para cantarte al oído lo mucho que te quiero", "Para entregarte mi corazón sincero", "Porque eres tú mi lucero primero"] },
            { song: "Los Diablitos - Mi Destino Eres Tú", prompt: "«He descubierto que mi destino eres tú...» 🧭❤️ ¿Quién es ella?", correct: "La mujer que siempre soñé y esperaba", options: ["La mujer que siempre soñé y esperaba", "La que mi corazón tanto anhelaba", "La que con mi tristeza acababa"] },
            { song: "Los Diablitos - Busco Alguien Que Me Quiera", prompt: "«Y encontré en ti el amor más sincero...» 🌹 ¿Qué le trajo ese amor?", correct: "El que sanó mi alma y me dio la felicidad", options: ["El que sanó mi alma y me dio la felicidad", "Un sentimiento de pura verdad", "La luz en medio de la oscuridad"] },
            { song: "Los Diablitos - Historia de Amor", prompt: "«Esta es nuestra historia de amor...» 📖✍️ ¿Cómo está escrita?", correct: "Escrita con besos, abrazos y promesas eternas", options: ["Escrita con besos, abrazos y promesas eternas", "Con las canciones más románticas y tiernas", "En las noches más bonitas y modernas"] },
            { song: "Jorge Celedón - Cuatro Rosas", prompt: "«Te traigo cuatro rosas rosas...» 🌹🌹🌹🌹 ¿Para qué le lleva esas flores?", correct: "Para decirte cuánto te quiero y cuánto te admiro", options: ["Para decirte cuánto te quiero y cuánto te admiro", "Para que sientas cada suspiro", "Porque me enamoro cuando te miro"] },
            { song: "Jorge Celedón - Ay Hombe", prompt: "«Ay hombe, qué bonito es el amor...» 🪗🥰 ¿Cuándo es bonito el amor en el vallenato?", correct: "Cuando se quiere de verdad como te quiero yo", options: ["Cuando se quiere de verdad como te quiero yo", "Cuando se canta con mucha emoción y voz", "Cuando estamos abrazaditos los dos"] },
            { song: "Jorge Celedón - Qué Bonita Es Esta Vida", prompt: "«Y qué bonita es esta vida...» ☀️🌾 ¿Desde cuándo es tan bonita la vida?", correct: "Desde que me despierto con tu hermosa sonrisa", options: ["Desde que me despierto con tu hermosa sonrisa", "Porque tu amor me acaricia como la brisa", "Cuando te abrazo sin ninguna prisa"] },
            { song: "Jorge Celedón - Lo Que Tú Necesitas", prompt: "«Yo tengo lo que tú necesitas...» 🎁❤️ ¿Qué es lo que Carlos tiene para Melissa?", correct: "Un corazón sincero y un amor incondicional", options: ["Un corazón sincero y un amor incondicional", "Una devoción y ternura sin igual", "Un cariño eterno y fenomenal"] },
            { song: "Silvestre Dangond - Las Locuras Mías", prompt: "«Que me perdonen las locuras mías...» 🤪💘 ¿Por qué hace tantas locuras?", correct: "Pero estoy loco de amor por tu hermosura", options: ["Pero estoy loco de amor por tu hermosura", "Porque tu amor es mi única cura", "Para vivir una hermosa aventura"] },
            { song: "Silvestre Dangond - Por Un Beso de Tu Boca", prompt: "«Por un beso de tu boca...» 💋 ¿Qué es capaz de hacer Silvestre por un beso?", correct: "Soy capaz de bajar las estrellas y el cielo", options: ["Soy capaz de bajar las estrellas y el cielo", "Te regalo mi vida y mi consuelo", "Dejo atrás cualquier miedo o desvelo"] },
            { song: "Silvestre Dangond & Nicky Jam - Cásate Conmigo", prompt: "«Cásate conmigo, quédate conmigo...» 💍👰 ¿Para qué le pide matrimonio?", correct: "Para vivir juntos toda una eternidad de amor", options: ["Para vivir juntos toda una eternidad de amor", "Para regalarte todo mi calor", "Y quitar de tu vida cualquier dolor"] },
            { song: "Silvestre Dangond - Un Amor Verdadero", prompt: "«Lo nuestro es un amor verdadero...» 🔒💞 ¿Cómo es ese amor de verdad?", correct: "De esos que no se rompen ni con las tormentas", options: ["De esos que no se rompen ni con las tormentas", "Que supera todas las adversidades que sientas", "Que crece con las alegrías que me cuentas"] },
            { song: "Silvestre Dangond - Gracias", prompt: "«Le doy gracias a Dios y a la vida...» 🙏✨ ¿Por qué da tantas gracias?", correct: "Por haberme puesto un ángel como tú en el camino", options: ["Por haberme puesto un ángel como tú en el camino", "Por darme el amor más lindo y divino", "Porque contigo encontré mi destino"] },
            { song: "Martin Elias - 10 Razones Para Amarte", prompt: "«Tengo mil razones para amarte...» 🔟❤️ ¿Cuál es la principal razón?", correct: "Y la primera es que eres lo más hermoso en mi mundo", options: ["Y la primera es que eres lo más hermoso en mi mundo", "Que tienes un corazón puro y profundo", "Que me haces feliz cada segundo"] },
            { song: "Martin Elias - 10 Razones Para Amarte (Coro)", prompt: "«Tú me llenas de paz y alegría...» 🕊️😊 ¿Y por eso qué hace Carlos?", correct: "Y por eso te dedico mi amor todos los días", options: ["Y por eso te dedico mi amor todos los días", "Y te canto las más bellas melodías", "Porque tú eres la luz de mis poesías"] },
            { song: "Martin Elias - Ella Es Mi Todo", prompt: "«Ella es mi todo, mi luz y mi guía...» 🌟 ¿Qué significa Melissa para su novio?", correct: "La que me inspira a ser mejor cada mañana", options: ["La que me inspira a ser mejor cada mañana", "La que entra como el sol por la ventana", "Una princesa hermosa y soberana"] },
            { song: "Kaleth Morales - Vivo en el Limbo", prompt: "«Y es que te veo y me quedo sin palabras...» 😶😍 ¿Por qué lo deja en el limbo?", correct: "Porque tu dulzura me tiene viviendo en un sueño", options: ["Porque tu dulzura me tiene viviendo en un sueño", "Porque de tu corazón soy el único dueño", "Con un amor infinito y risueño"] },
            { song: "Kaleth Morales - Ella Es Mi Todo", prompt: "«No hay nada más hermoso en este mundo...» 🌎❤️ ¿Qué es lo más hermoso para Kaleth?", correct: "Que ver tus ojos brillando llenos de amor", options: ["Que ver tus ojos brillando llenos de amor", "Sentir tu abrazo y todo tu calor", "Cuidarte siempre sin ningún temor"] },
            { song: "Peter Manjarrés - Tragao de Ti", prompt: "«Estoy completamente tragao de ti...» 🤤💘 ¿Qué tan enamorado está?", correct: "Enamorado hasta los huesos de tu dulce ser", options: ["Enamorado hasta los huesos de tu dulce ser", "Pensando en ti en cada amanecer", "Y feliz de verte florecer"] },
            { song: "Peter Manjarrés - Que Dios Te Bendiga", prompt: "«Que Dios te bendiga mi amor...» 🙏🌹 ¿Cuál es el deseo vallenato más lindo?", correct: "Y que guarde nuestra relación por mil años más", options: ["Y que guarde nuestra relación por mil años más", "Que te llene de mucha luz y paz", "Y que no nos separemos jamás"] },
            { song: "Peter Manjarrés - El Amor de Mi Tierra", prompt: "«Con el amor más puro de mi tierra...» 🇨🇴❤️ ¿Qué le entrega?", correct: "Te entrego mi corazón sin ninguna reserva", options: ["Te entrego mi corazón sin ninguna reserva", "Una pasión que mi alma conserva", "Una promesa que el cielo observa"] },
            { song: "Carlos Vives - Fruta Fresca", prompt: "«Sí, sí, sí, tu amor es como fruta fresca...» 🍉🍎 ¿Qué le hace ese amor de fruta fresca?", correct: "Que me llena de vida y me alegra el corazón", options: ["Que me llena de vida y me alegra el corazón", "Que me inspira a cantar una nueva canción", "Que me envuelve en la más bella ilusión"] },
            { song: "Carlos Vives - Bailar Contigo", prompt: "«Quiero bailar contigo bajo la luna...» 🌙💃 ¿Qué siente al bailar con su reina?", correct: "Y sentir que el tiempo se detiene en tus abrazos", options: ["Y sentir que el tiempo se detiene en tus abrazos", "Y estrecharte fuerte entre mis brazos", "Uniéndonos con mil tiernos lazos"] },
            { song: "Carlos Vives - Ella Es Mi Fiesta", prompt: "«Ella es mi fiesta, mi alegría y mi canción...» 🎉¿Cómo celebra Carlos la vida de Meli?", correct: "La celebración más grande que tiene mi alma", options: ["La celebración más grande que tiene mi alma", "La que me devuelve toda la calma", "Aplaudiendo feliz con la palma"] },
            { song: "Carlos Vives - Dejame Entrar", prompt: "«Déjame entrar en tu corazón...» 🚪❤️ ¿Para qué quiere entrar Vives?", correct: "Para llenarlo de detalles, ternura y calor", options: ["Para llenarlo de detalles, ternura y calor", "Para borrarte cualquier dolor", "Para pintar tu mundo de color"] },
            { song: "Los Gigantes del Vallenato - Yo Te Vi", prompt: "«Te vi llegar como un regalo del cielo...» 🎁☁️ ¿Qué supo al verla?", correct: "Y supe que serías la dueña de mi destino", options: ["Y supe que serías la dueña de mi destino", "Que tu amor era el más divino", "Que iluminarías todo mi camino"] },
            { song: "Los Gigantes del Vallenato - Te Amo", prompt: "«Te amo con una fuerza imparable...» 💪💖 ¿Cómo es esa fuerza?", correct: "Que crece más y más con cada amanecer", options: ["Que crece más y más con cada amanecer", "Que me hace tan feliz en mi ser", "Que no se puede romper ni vencer"] },
            { song: "Jean Carlos Centeno - Distintos Destinos", prompt: "«Aunque el mundo dé mil vueltas...» 🌍💞 ¿Qué le promete Jean Carlos?", correct: "Mi puerto seguro siempre será tu amor", options: ["Mi puerto seguro siempre será tu amor", "Yo seré tu protector y tu valor", "Te regalaré una vida sin dolor"] },
            { song: "Jean Carlos Centeno - Amándote", prompt: "«Amándote de noche y de día...» 🌞🌜 ¿Qué encuentra en ese amor?", correct: "Es como encuentro la verdadera felicidad", options: ["Es como encuentro la verdadera felicidad", "Una vida de pura verdad", "Una luz en la oscuridad"] },
            { song: "Nelson Velásquez - Ven a Mí", prompt: "«Ven a mí, mi amor bonita...» 🤗🌹 ¿Qué le espera en sus brazos?", correct: "Que mis brazos están abiertos solo para ti", options: ["Que mis brazos están abiertos solo para ti", "Un corazón que late muy feliz", "Una historia con raíz"] },
            { song: "Nelson Velásquez - Regálame Tu Amor", prompt: "«Regálame tu amor por toda la vida...» 💝 ¿Qué promete hacer por ella?", correct: "Que yo te haré la mujer más feliz del universo", options: ["Que yo te haré la mujer más feliz del universo", "Y te escribiré un hermoso verso", "En este amor tan bonito e inmerso"] }
        ];

        let triviaPool = [];
        try {
            const sp = localStorage.getItem('melisa_music_trivia_pool');
            if (sp) triviaPool = JSON.parse(sp);
        } catch(e) {}
        if (!Array.isArray(triviaPool)) triviaPool = [];
        triviaPool = triviaPool.filter(i => typeof i === 'number' && i >= 0 && i < triviaData.length && triviaData[i]);
        if (triviaPool.length === 0) {
            triviaPool = Array.from({length: triviaData.length}, (_, i) => i);
            shuffle(triviaPool);
            localStorage.setItem('melisa_music_trivia_pool', JSON.stringify(triviaPool));
        }

        let triviaScore = parseInt(localStorage.getItem('melisa_music_trivia_score') || '0', 10);

        function renderTriviaTab() {
            if (!Array.isArray(triviaPool) || triviaPool.length === 0 || triviaPool[0] === undefined || !triviaData[triviaPool[0]]) {
                triviaPool = Array.from({length: triviaData.length}, (_, i) => i);
                shuffle(triviaPool);
                localStorage.setItem('melisa_music_trivia_pool', JSON.stringify(triviaPool));
            }

            const qIdx = triviaPool[0];
            const q = triviaData[qIdx];
            const opts = [...q.options];
            shuffle(opts);

            contentArea.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; background:rgba(0,0,0,0.4); padding:8px 14px; border-radius:15px; border:1px solid rgba(0,229,255,0.2);">
                    <span style="color:var(--cyan); font-weight:bold; font-size:0.9rem;">🎧 MODO KARAOKE</span>
                    <span style="color:var(--gold); font-weight:900; font-size:0.95rem;">🏆 Discos de Oro: ${triviaScore}</span>
                </div>
                <div style="background:rgba(255,0,127,0.15); border:1px solid #ff007f; padding:6px 14px; border-radius:12px; color:#ff80bf; font-size:0.82rem; font-weight:bold; display:inline-block; margin-bottom:12px;">
                    📌 CANCIÓN: ${q.song}
                </div>
                <h3 style="color:#fff; font-family:'Outfit',sans-serif; font-size:1.15rem; line-height:1.4; margin-bottom:20px;">
                    ${q.prompt}
                </h3>
                <div id="trivia-options" style="display:flex; flex-direction:column; gap:10px; width:100%;"></div>
                <div id="trivia-feedback" style="margin-top:18px; min-height:45px; text-align:center;"></div>
            `;

            const optContainer = contentArea.querySelector('#trivia-options');
            const feedbackEl = contentArea.querySelector('#trivia-feedback');

            opts.forEach(optText => {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.style.background = 'rgba(255,255,255,0.08)';
                btn.style.border = '2px solid rgba(255,255,255,0.2)';
                btn.style.color = '#fff';
                btn.style.padding = '14px 16px';
                btn.style.borderRadius = '14px';
                btn.style.fontSize = '0.98rem';
                btn.style.fontWeight = 'bold';
                btn.style.textAlign = 'left';
                btn.style.transition = 'all 0.2s ease';
                btn.innerHTML = `🎵 ${optText}`;

                btn.onclick = () => {
                    if (optText === q.correct) {
                        btn.style.background = 'rgba(0,255,136,0.25)';
                        btn.style.borderColor = '#00ff88';
                        btn.style.color = '#00ff88';
                        triviaScore++;
                        localStorage.setItem('melisa_music_trivia_score', triviaScore.toString());

                        triviaPool.shift();
                        if (triviaPool.length === 0) {
                            triviaPool = Array.from({length: triviaData.length}, (_, i) => i);
                            shuffle(triviaPool);
                        }
                        localStorage.setItem('melisa_music_trivia_pool', JSON.stringify(triviaPool));

                        feedbackEl.innerHTML = `
                            <div style="color:#00ff88; font-weight:900; font-size:1.25rem; margin-bottom:12px; animation:popIn 0.3s ease;">🎉 ¡CORRECTO! ¡ERES LA REINA DEL KARAOKE! 🎤✨</div>
                            <button id="next-song-btn" class="btn" style="background:var(--cyan); color:#000; width:100%; font-weight:900; padding:12px; border-radius:25px; box-shadow:0 4px 15px rgba(0,229,255,0.4);">
                                ➡️ Siguiente Canción
                            </button>
                        `;

                        // Confetti
                        const cDiv = document.createElement('div');
                        cDiv.className = 'game-confetti';
                        cDiv.style.position = 'absolute'; cDiv.style.inset = '0'; cDiv.style.pointerEvents = 'none';
                        for(let i=0; i<30; i++) {
                            const p = document.createElement('div');
                            p.className = 'game-confetti-piece';
                            p.style.left = `${Math.random()*100}%`;
                            p.style.backgroundColor = ['#00e5ff','#ff007f','#ffd54f','#00ff88'][Math.floor(Math.random()*4)];
                            cDiv.appendChild(p);
                        }
                        contentArea.appendChild(cDiv);
                        setTimeout(() => { if (cDiv.parentNode) cDiv.remove(); }, 2000);

                        const nextBtn = feedbackEl.querySelector('#next-song-btn');
                        if (nextBtn) nextBtn.onclick = () => renderTriviaTab();
                    } else {
                        btn.style.background = 'rgba(255,64,129,0.25)';
                        btn.style.borderColor = '#ff4081';
                        feedbackEl.innerHTML = `<span style="color:#ff4081; font-weight:bold;">❌ ¡Uy casi! Esa no es la letra, inténtalo con otra opción mi campeona 💪</span>`;
                    }
                };
                if (optContainer) optContainer.appendChild(btn);
            });
        }

        // ==========================================
        //  TAB 2: PIANO MÁGICO DE CARLOS (WEB AUDIO API)
        // ==========================================
        const pianoQuotes = [
            "🎹 ¡Nota Do de Dulzura! Eres la melodía que alegra mi mañana.",
            "🎹 ¡Nota Re de Reina! Mi Melissa, para mí no hay mujer más hermosa ni valiente en todo el universo.",
            "🎹 ¡Nota Mi de Mi Amor! Cada latido de mi corazón suena con tu dulce nombre.",
            "🎹 ¡Nota Fa de Fascinante! Tu sonrisa tiene el poder de iluminar mi día más oscuro.",
            "🎹 ¡Nota Sol de Sol mío! Eres el sol que ilumina mi vida; muy pronto amaneceremos celebrando tu salud.",
            "🎹 ¡Nota La de Lealtad! Yo estaré a tu lado hoy, mañana y en cada segundo de tu hermosa vida.",
            "🎹 ¡Nota Si de Siempre Juntos! Nada ni nadie podrá apagar la música y la magia de nuestro amor.",
            "🎼 ¡Acorde Mágico! Esta distancia es solo un silencio temporal antes de que te llene de abrazos y besos.",
            "🎼 ¡Sinfonía del Corazón! Te envío 10,000 besos musicales desde lo más profundo de mi alma para que te cures más rápido.",
            "🎼 ¡Armonía Perfecta! Contigo mi vida no es un ensayo, ¡tú eres mi obra maestra más hermosa!",
            "🎹 ¡Ritmo Imparable! Admiro tanto tu valentía; te mereces una ovación de pie en todo mi mundo.",
            "🎹 ¡Melodía Celestial! Si mi amor por ti fuera una canción, sonaría por toda la eternidad sin detenerse.",
            "🎼 ¡Dúo Perfecto! Tú y yo hacemos el mejor equipo de todo el cosmos. ¡Te amo infinito, mi princesa Melissa!",
            "🎹 ¡Nota de Esperanza! Ya cuento los días para que estemos bailando, riendo y celebrando tu salud completa.",
            "🎼 ¡Serenata de Amor! Cierra los ojos y siente cómo mi abrazo te envuelve en este instante, mi amor.",
            "🎹 ¡Composición Real! Eres el verso más bonito y bendecido que Dios escribió en mi destino.",
            "🎼 ¡Concierto de Besos! Cada día que pasa es una nota más cerca de volver a tenerte entre mis brazos.",
            "🎹 ¡Sonido de Paz! Descansa y recupérate tranquila, que aquí estoy yo, tu rey, velando siempre por ti.",
            "🎼 ¡Inspiración Eterna! Eres la musa que inspira toda la alegría y el amor que siento en mi corazón.",
            "🎹 ¡Aplauso Infinito! ¡Eres la reina indiscutible de mi corazón y de mi vida entera!"
        ];

        let pianoPool = [];
        try {
            const pp = localStorage.getItem('melisa_music_piano_pool');
            if (pp) pianoPool = JSON.parse(pp);
        } catch(e) {}
        if (!Array.isArray(pianoPool)) pianoPool = [];
        pianoPool = pianoPool.filter(i => typeof i === 'number' && i >= 0 && i < pianoQuotes.length && pianoQuotes[i]);
        if (pianoPool.length === 0) {
            pianoPool = Array.from({length: pianoQuotes.length}, (_, i) => i);
            shuffle(pianoPool);
            localStorage.setItem('melisa_music_piano_pool', JSON.stringify(pianoPool));
        }

        let pianoNotesPlayed = parseInt(localStorage.getItem('melisa_music_piano_count') || '0', 10);
        let audioCtx = null;

        function playTone(freq, type = 'sine') {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

                // Elegant piano envelope
                gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 1.2);
            } catch(e) {}
        }

        const keysData = [
            { note: "DO", freq: 261.63, color: "#ff007f", key: "1" },
            { note: "RE", freq: 293.66, color: "#ff4081", key: "2" },
            { note: "MI", freq: 329.63, color: "#ffd54f", key: "3" },
            { note: "FA", freq: 349.23, color: "#00e5ff", key: "4" },
            { note: "SOL", freq: 392.00, color: "#00ff88", key: "5" },
            { note: "LA", freq: 440.00, color: "#7c4dff", key: "6" },
            { note: "SI", freq: 493.88, color: "#ff80bf", key: "7" },
            { note: "DO*", freq: 523.25, color: "#ffffff", key: "8" }
        ];

        function renderPianoTab() {
            if (!Array.isArray(pianoPool) || pianoPool.length === 0 || pianoPool[0] === undefined || !pianoQuotes[pianoPool[0]]) {
                pianoPool = Array.from({length: pianoQuotes.length}, (_, i) => i);
                shuffle(pianoPool);
                localStorage.setItem('melisa_music_piano_pool', JSON.stringify(pianoPool));
            }

            contentArea.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:rgba(0,0,0,0.4); padding:8px 14px; border-radius:15px; border:1px solid rgba(0,229,255,0.2);">
                    <span style="color:var(--cyan); font-weight:bold; font-size:0.9rem;">🎹 MI PIANO ROMÁNTICO PARA MELISSA</span>
                    <span id="piano-counter-txt" style="color:var(--gold); font-weight:900; font-size:0.9rem;">🎵 Notas Tocadas: ${pianoNotesPlayed}</span>
                </div>
                <p style="color:#fff; font-size:0.88rem; text-align:center; margin-bottom:16px;">
                    ✨ Toca las teclas para escuchar sonido real y liberar dedicatorias mágicas que escribí desde el fondo de mi corazón para ti.
                </p>

                <div id="piano-keyboard" style="display:flex; justify-content:center; gap:6px; margin-bottom:20px; padding:10px; background:#0a0e17; border-radius:18px; border:2px solid rgba(255,255,255,0.1); overflow-x:auto;"></div>

                <div style="text-align:center; margin-bottom:16px;">
                    <button id="magic-chord-btn" class="btn" style="background:linear-gradient(90deg, #ff007f, #00e5ff); color:#fff; font-weight:900; padding:12px 24px; border-radius:30px; box-shadow:0 6px 20px rgba(255,0,127,0.4); font-size:1.05rem;">
                        ✨ ¡Tocar Acorde Mágico de Amor! 💖
                    </button>
                </div>

                <div id="piano-quote-box" style="background:rgba(0,229,255,0.1); border:2px dashed var(--cyan); border-radius:16px; padding:16px; text-align:center; min-height:80px; display:flex; align-items:center; justify-content:center;">
                    <span style="color:var(--text-secondary); font-style:italic;">🎶 Toca cualquier tecla o presiona el botón mágico para recibir un mensaje de amor...</span>
                </div>
            `;

            const kbDiv = contentArea.querySelector('#piano-keyboard');
            const quoteBox = contentArea.querySelector('#piano-quote-box');
            const counterTxt = contentArea.querySelector('#piano-counter-txt');

            function triggerQuote() {
                if (pianoPool.length === 0) {
                    pianoPool = Array.from({length: pianoQuotes.length}, (_, i) => i);
                    shuffle(pianoPool);
                }
                const qIdx = pianoPool.shift();
                localStorage.setItem('melisa_music_piano_pool', JSON.stringify(pianoPool));

                if (quoteBox) {
                    quoteBox.style.animation = 'none';
                    void quoteBox.offsetWidth;
                    quoteBox.style.animation = 'popIn 0.4s ease';
                    quoteBox.innerHTML = `
                        <div style="color:#fff; font-size:1.05rem; font-weight:bold; line-height:1.4;">
                            ${pianoQuotes[qIdx]}
                        </div>
                    `;
                }
            }

            keysData.forEach(k => {
                const keyBtn = document.createElement('button');
                keyBtn.style.width = '45px';
                keyBtn.style.height = '150px';
                keyBtn.style.background = k.note === 'DO*' ? '#fff' : 'linear-gradient(180deg, #fff 0%, #e0e0e0 100%)';
                keyBtn.style.border = '2px solid #333';
                keyBtn.style.borderRadius = '0 0 10px 10px';
                keyBtn.style.display = 'flex';
                keyBtn.style.flexDirection = 'column';
                keyBtn.style.justifyContent = 'flex-end';
                keyBtn.style.alignItems = 'center';
                keyBtn.style.paddingBottom = '12px';
                keyBtn.style.color = '#000';
                keyBtn.style.fontWeight = '900';
                keyBtn.style.fontSize = '0.85rem';
                keyBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.5)';
                keyBtn.style.cursor = 'pointer';
                keyBtn.style.transition = 'all 0.1s ease';
                keyBtn.innerHTML = `<span style="color:${k.color}; font-size:1.1rem;">●</span><span style="margin-top:4px;">${k.note}</span>`;

                keyBtn.onmousedown = () => {
                    keyBtn.style.transform = 'translateY(4px) scale(0.96)';
                    keyBtn.style.background = k.color;
                    keyBtn.style.color = '#fff';
                    playTone(k.freq, 'triangle');

                    pianoNotesPlayed++;
                    localStorage.setItem('melisa_music_piano_count', pianoNotesPlayed.toString());
                    if (counterTxt) counterTxt.innerHTML = `🎵 Notas Tocadas: ${pianoNotesPlayed}`;

                    if (pianoNotesPlayed % 4 === 0) triggerQuote();
                };

                keyBtn.onmouseup = () => {
                    keyBtn.style.transform = 'translateY(0) scale(1)';
                    keyBtn.style.background = k.note === 'DO*' ? '#fff' : 'linear-gradient(180deg, #fff 0%, #e0e0e0 100%)';
                    keyBtn.style.color = '#000';
                };
                keyBtn.onmouseleave = keyBtn.onmouseup;

                if (kbDiv) kbDiv.appendChild(keyBtn);
            });

            const magicBtn = contentArea.querySelector('#magic-chord-btn');
            if (magicBtn) {
                magicBtn.onclick = () => {
                    // Play a sweet 3-note arpeggio
                    playTone(261.63); // DO
                    setTimeout(() => playTone(329.63), 180); // MI
                    setTimeout(() => playTone(392.00), 360); // SOL
                    setTimeout(() => playTone(523.25), 540); // DO*
                    
                    pianoNotesPlayed += 4;
                    localStorage.setItem('melisa_music_piano_count', pianoNotesPlayed.toString());
                    if (counterTxt) counterTxt.innerHTML = `🎵 Notas Tocadas: ${pianoNotesPlayed}`;

                    triggerQuote();

                    // Confetti hearts
                    const cDiv = document.createElement('div');
                    cDiv.className = 'game-confetti';
                    cDiv.style.position = 'absolute'; cDiv.style.inset = '0'; cDiv.style.pointerEvents = 'none';
                    for(let i=0; i<25; i++) {
                        const p = document.createElement('div');
                        p.className = 'game-confetti-piece';
                        p.style.left = `${Math.random()*100}%`;
                        p.style.backgroundColor = ['#ff007f','#00e5ff','#ffd54f'][Math.floor(Math.random()*3)];
                        cDiv.appendChild(p);
                    }
                    contentArea.appendChild(cDiv);
                    setTimeout(() => { if (cDiv.parentNode) cDiv.remove(); }, 2000);
                };
            }
        }

        // ==========================================
        //  TAB 3: LA ROCKOLA ROMÁNTICA (ESTACIONES FM)
        // ==========================================
        const rockolaStations = [
            { station: "📻 99.9 FM - Radio Besos", title: "¡Hit de Abrazos Apretaditos!", desc: "Sintonizando en directo desde mi corazón para ti: 'Mi Melissa, te mando mil besos al aire para que te llenen de calor y dulzura hoy'." },
            { station: "📻 100.5 FM - Estación Pasión", title: "Boletín Informativo del Amor", desc: "Se reporta un enamoramiento extremo, incurable y eterno de tu rey hacia la mujer más espectacular del planeta: ¡tú, mi Melissa!" },
            { station: "📻 102.3 FM - Frecuencia Destino", title: "La Casualidad más Hermosa", desc: "En esta estación recordamos que coincidir contigo en esta vida ha sido el regalo más grande y maravilloso que Dios me dio." },
            { station: "📻 104.8 FM - Radio Recuperación", title: "¡Fuerza, Salud y Alegría!", desc: "Transmitiendo energía curativa 24/7: Cada día que pasa eres más fuerte, tu cuerpo sana maravillosamente y muy pronto estaremos festejando en la calle." },
            { station: "📻 107.5 FM - Romántica Universal", title: "Dedicatoria VIP de tu Enamorado #1", desc: "'Eres el motivo de mi sonrisa, la inspiración de mis días y la reina indiscutible de todo mi universo. ¡Te amo con el alma!'" },
            { station: "📻 108.0 FM - Estación Futuro", title: "Pronóstico del Tiempo Juntos", desc: "Pronóstico del clima para cuando te recuperes: ¡100% de probabilidad de salidas a cenar, paseos tomados de la mano, risas y felicidad total!" },
            { station: "📻 95.5 FM - Radio Sonrisas", title: "El Sonido de tu Risa", desc: "No hay sinfonía en el mundo que se compare con el sonido de tu risa. Yo estoy contando los segundos para volver a ver tus ojitos brillar de felicidad." },
            { station: "📻 101.1 FM - Frecuencia Ternura", title: "La Guerrera más Hermosa", desc: "Hoy celebramos tu valentía. Has demostrado una fuerza increíble en estos 10 días. ¡Eres el orgullo más grande de mi vida y de mi corazón!" },
            { station: "📻 103.7 FM - Estación Promesas", title: "Un Juramento de Amor", desc: "Pase lo que pase, en los días buenos y en los difíciles, siempre tendrás mi mano sosteniendo la tuya con lealtad absoluta." },
            { station: "📻 106.2 FM - Radio Universo", title: "El Centro del Sistema Solar", desc: "Todos los planetas, las estrellas y los latidos de mi corazón giran alrededor de una sola reina: ¡Tú, mi hermosa Melissa!" },
            { station: "📻 98.4 FM - Frecuencia Poesía", title: "Un Verso para Mi Amada", desc: "'Si el universo entero fuera música, tú serías la melodía perfecta que da sentido a toda mi existencia'." },
            { station: "📻 105.9 FM - Estación Celebración", title: "¡Llegamos al Día 10!", desc: "¡Diez días de recuperación superados con éxito! Preparen el confeti y la música porque mi reina va directo a la victoria total." }
        ];

        let rockolaPool = [];
        try {
            const rp = localStorage.getItem('melisa_music_rockola_pool');
            if (rp) rockolaPool = JSON.parse(rp);
        } catch(e) {}
        if (!Array.isArray(rockolaPool)) rockolaPool = [];
        rockolaPool = rockolaPool.filter(i => typeof i === 'number' && i >= 0 && i < rockolaStations.length && rockolaStations[i]);
        if (rockolaPool.length === 0) {
            rockolaPool = Array.from({length: rockolaStations.length}, (_, i) => i);
            shuffle(rockolaPool);
            localStorage.setItem('melisa_music_rockola_pool', JSON.stringify(rockolaPool));
        }

        function renderRockolaTab() {
            if (!Array.isArray(rockolaPool) || rockolaPool.length === 0 || rockolaPool[0] === undefined || !rockolaStations[rockolaPool[0]]) {
                rockolaPool = Array.from({length: rockolaStations.length}, (_, i) => i);
                shuffle(rockolaPool);
                localStorage.setItem('melisa_music_rockola_pool', JSON.stringify(rockolaPool));
            }

            const stIdx = rockolaPool[0];
            const st = rockolaStations[stIdx];

            contentArea.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; background:rgba(0,0,0,0.4); padding:8px 14px; border-radius:15px; border:1px solid rgba(0,229,255,0.2);">
                    <span style="color:var(--cyan); font-weight:bold; font-size:0.9rem;">📻 ROCKOLA ROMÁNTICA</span>
                    <span style="color:#00ff88; font-weight:900; font-size:0.85rem;">● TRANSMITIENDO EN VIVO</span>
                </div>

                <div style="background:linear-gradient(135deg, #2a0845, #6441a5); border:3px solid var(--gold); border-radius:20px; padding:20px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.6); margin-bottom:20px; position:relative;">
                    <div style="background:#000; border:2px solid #00e5ff; border-radius:12px; padding:10px; margin-bottom:14px; color:#00e5ff; font-family:monospace; font-size:1.1rem; font-weight:bold; letter-spacing:1px; box-shadow:inset 0 0 10px rgba(0,229,255,0.5);">
                        ${st.station}
                    </div>
                    <h3 style="color:var(--gold); font-family:'Outfit',sans-serif; font-size:1.3rem; margin-bottom:10px;">
                        ✨ ${st.title} ✨
                    </h3>
                    <p style="color:#fff; font-size:1rem; line-height:1.5; background:rgba(0,0,0,0.3); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                        «${st.desc}»
                    </p>
                </div>

                <div style="text-align:center;">
                    <button id="next-station-btn" class="btn" style="background:linear-gradient(90deg, #00e5ff, #ffd54f); color:#000; font-weight:900; padding:14px 28px; border-radius:30px; box-shadow:0 6px 20px rgba(0,229,255,0.4); font-size:1.08rem; width:100%;">
                        🎰 ¡Sintonizar Siguiente Estación Random! 📻
                    </button>
                </div>
            `;

            const nextStBtn = contentArea.querySelector('#next-station-btn');
            if (nextStBtn) {
                nextStBtn.onclick = () => {
                    rockolaPool.shift();
                    if (rockolaPool.length === 0) {
                        rockolaPool = Array.from({length: rockolaStations.length}, (_, i) => i);
                        shuffle(rockolaPool);
                    }
                    localStorage.setItem('melisa_music_rockola_pool', JSON.stringify(rockolaPool));
                    
                    // Sound effect or tone
                    playTone(440, 'sine');
                    setTimeout(() => playTone(587.33, 'sine'), 150);

                    renderRockolaTab();
                };
            }
        }

        function updateTabUI() {
            const btnT = wrapper.querySelector('#tab-btn-trivia');
            const btnP = wrapper.querySelector('#tab-btn-piano');
            const btnR = wrapper.querySelector('#tab-btn-rockola');

            if (btnT) { btnT.style.background = activeTab === 'trivia' ? '#00e5ff' : 'rgba(255,255,255,0.1)'; btnT.style.color = activeTab === 'trivia' ? '#000' : '#fff'; btnT.style.fontWeight = '900'; btnT.style.boxShadow = activeTab === 'trivia' ? '0 0 15px rgba(0,229,255,0.6)' : 'none'; }
            if (btnP) { btnP.style.background = activeTab === 'piano' ? '#00e5ff' : 'rgba(255,255,255,0.1)'; btnP.style.color = activeTab === 'piano' ? '#000' : '#fff'; btnP.style.fontWeight = '900'; btnP.style.boxShadow = activeTab === 'piano' ? '0 0 15px rgba(0,229,255,0.6)' : 'none'; }
            if (btnR) { btnR.style.background = activeTab === 'rockola' ? '#00e5ff' : 'rgba(255,255,255,0.1)'; btnR.style.color = activeTab === 'rockola' ? '#000' : '#fff'; btnR.style.fontWeight = '900'; btnR.style.boxShadow = activeTab === 'rockola' ? '0 0 15px rgba(0,229,255,0.6)' : 'none'; }

            if (activeTab === 'trivia') renderTriviaTab();
            else if (activeTab === 'piano') renderPianoTab();
            else if (activeTab === 'rockola') renderRockolaTab();
        }

        const btnT = wrapper.querySelector('#tab-btn-trivia');
        const btnP = wrapper.querySelector('#tab-btn-piano');
        const btnR = wrapper.querySelector('#tab-btn-rockola');

        if (btnT) btnT.onclick = () => { activeTab = 'trivia'; updateTabUI(); };
        if (btnP) btnP.onclick = () => { activeTab = 'piano'; updateTabUI(); };
        if (btnR) btnR.onclick = () => { activeTab = 'rockola'; updateTabUI(); };

        updateTabUI();
    }

    // =============================================
    //  DÍA 11: ARCADE RETRO - LAS MAQUINITAS DEL AMOR 🕹️👾
    // =============================================
    function startArcade(container, config) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-arcade-wrapper';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '600px';
        wrapper.style.margin = '0 auto';
        wrapper.style.background = 'linear-gradient(180deg, #0f0c20 0%, #1a153b 100%)';
        wrapper.style.border = '3px solid #00e5ff';
        wrapper.style.borderRadius = '24px';
        wrapper.style.padding = '20px';
        wrapper.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(255, 0, 127, 0.2)';
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden';
        container.appendChild(wrapper);

        let tickets = parseInt(localStorage.getItem('melisa_arcade_tickets') || '50', 10);
        let redeemedPrizes = JSON.parse(localStorage.getItem('melisa_arcade_redeemed') || '[]');
        let activeTab = 'pacbesos';

        function playArcadeTone(freq, type = 'sine', duration = 0.15) {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch(e) {}
        }

        // Header
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '18px';
        header.style.borderBottom = '2px dashed rgba(255, 255, 255, 0.2)';
        header.style.paddingBottom = '14px';
        header.innerHTML = `
            <div style="font-size:2.5rem; margin-bottom:4px; filter:drop-shadow(0 0 10px #ff007f);">🕹️👾</div>
            <h2 style="color:#fff; font-family:'Outfit',sans-serif; font-size:1.5rem; margin:0 0 8px 0; text-shadow:0 0 10px #00e5ff;">ARCADE RETRO CARLOS & MELISSA</h2>
            <div style="display:inline-block; background:linear-gradient(90deg, #ffd54f, #ff8f00); color:#000; font-weight:900; padding:6px 16px; border-radius:20px; font-size:0.95rem; box-shadow:0 4px 15px rgba(255, 215, 0, 0.5);">
                🎟️ TICKETS ARCADE: <span id="arcade-tickets-val">${tickets.toLocaleString('es-CO')}</span>
            </div>
        `;
        wrapper.appendChild(header);

        // Timer & Deadline Logic
        const deadline = new Date();
        deadline.setHours(23, 55, 0, 0); // 11:55 PM today
        const isPastDeadline = Date.now() > deadline.getTime();
        let countdownInterval = null;

        const banner = document.createElement('div');
        banner.style.background = isPastDeadline ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 127, 0.2)';
        banner.style.border = isPastDeadline ? '2px solid red' : '2px solid #ff007f';
        banner.style.padding = '12px';
        banner.style.borderRadius = '16px';
        banner.style.marginBottom = '20px';
        banner.style.textAlign = 'center';
        banner.style.boxShadow = isPastDeadline ? '0 0 15px rgba(255,0,0,0.4)' : '0 0 15px rgba(255,0,127,0.4)';

        if (isPastDeadline) {
            banner.innerHTML = '<strong style="color:#ff4444; font-size:1.1rem;">⏳ TIEMPO AGOTADO</strong><br><span style="color:#fff; font-size:0.9rem;">La tienda de canje ha cerrado, ¡pero tus puntos están intactos! 💖</span>';
        } else {
            banner.innerHTML = '<strong style="color:#00ff88; font-size:1.15rem;">🔥 ¡EMPEZÓ LA RECTA FINAL! 🔥</strong><br><span style="color:#fff; font-size:0.9rem;">Tienes hasta las 11:55 PM de hoy para acumular y canjear tus premios antes de que la tienda cierre.</span><br><div id="arcade-countdown" style="font-size:1.4rem; font-weight:900; color:var(--gold); margin-top:8px;"></div>';
        }
        wrapper.appendChild(banner);

        if (!isPastDeadline) {
            countdownInterval = setInterval(() => {
                const t = deadline.getTime() - Date.now();
                if (t <= 0) {
                    clearInterval(countdownInterval);
                    location.reload(); // Reload to apply "Closed" state
                } else {
                    const el = wrapper.querySelector('#arcade-countdown');
                    if (el) {
                        const h = Math.floor((t / (1000 * 60 * 60)) % 24);
                        const m = Math.floor((t / 1000 / 60) % 60);
                        const s = Math.floor((t / 1000) % 60);
                        el.textContent = `⏱️ ${h}h ${m}m ${s}s restantes`;
                    }
                }
            }, 1000);
        }

        // Tab Navigation
        const nav = document.createElement('div');
        nav.style.display = 'flex';
        nav.style.gap = '8px';
        nav.style.marginBottom = '20px';
        nav.style.justifyContent = 'center';
        nav.style.flexWrap = 'wrap';

        const tabs = [
            { id: 'pacbesos', label: '👾 Pac-Besos', color: '#00e5ff' },
            { id: 'tetrislove', label: '🧱 Tetris del Amor', color: '#ff007f' },
            { id: 'arcadeprizes', label: '🎟️ Canjear Premios', color: '#ffd54f' }
        ];

        tabs.forEach(t => {
            const btn = document.createElement('button');
            btn.id = `tab-btn-${t.id}`;
            btn.className = 'btn';
            btn.style.flex = '1';
            btn.style.minWidth = '130px';
            btn.style.padding = '10px 12px';
            btn.style.borderRadius = '14px';
            btn.style.fontWeight = '900';
            btn.style.fontSize = '0.88rem';
            btn.style.transition = 'all 0.2s ease';
            btn.textContent = t.label;

            if (t.id === 'arcadeprizes' && isPastDeadline) {
                btn.style.opacity = '0.5';
                btn.style.textDecoration = 'line-through';
                btn.textContent = '🔒 Cerrado';
                btn.onclick = () => {
                    const alertEl = document.createElement('div');
                    alertEl.style.position = 'absolute'; alertEl.style.top = '50%'; alertEl.style.left = '50%'; alertEl.style.transform = 'translate(-50%, -50%)';
                    alertEl.style.background = 'rgba(255,0,0,0.95)'; alertEl.style.color = '#fff'; alertEl.style.padding = '15px'; alertEl.style.borderRadius = '15px'; alertEl.style.zIndex = '1000'; alertEl.style.textAlign = 'center'; alertEl.style.fontWeight = 'bold';
                    alertEl.innerHTML = '¡El tiempo de canje finalizó! ⏳<br>Pero tranquila, tus tickets están guardados a salvo. 💖';
                    wrapper.appendChild(alertEl);
                    setTimeout(() => { if (alertEl.parentNode) alertEl.remove(); }, 3500);
                };
            } else {
                btn.onclick = () => {
                    activeTab = t.id;
                    updateTabUI();
                };
            }
            nav.appendChild(btn);
        });
        wrapper.appendChild(nav);

        // Content Area
        const contentArea = document.createElement('div');
        contentArea.id = 'arcade-content';
        wrapper.appendChild(contentArea);

        function updateTicketDisplay() {
            const el = wrapper.querySelector('#arcade-tickets-val');
            if (el) el.textContent = tickets.toLocaleString('es-CO');
        }

        // --- TAB 1: PAC-BESOS ---
        let pacPlayer = { r: 0, c: 0 };
        let pacGhosts = [
            { r: 7, c: 7, name: 'Fantasmita del Aburrimiento 👻', color: '#ff4081' },
            { r: 0, c: 7, name: 'Fantasmita del Dolor 🕷️', color: '#7c4dff' }
        ];
        let pacKisses = [];
        let pacScore = 0;
        let pacInterval = null;

        const mazeLayout = [
            [0,0,0,1,0,0,0,0],
            [0,1,0,1,0,1,1,0],
            [0,1,0,0,0,0,1,0],
            [0,0,0,1,1,0,0,0],
            [0,1,0,0,0,0,1,0],
            [0,1,1,0,1,0,1,0],
            [0,0,0,0,1,0,0,0],
            [0,0,1,0,0,0,1,0]
        ];

        function initPacBesos() {
            pacPlayer = { r: 0, c: 0 };
            pacGhosts = [
                { r: 7, c: 7, name: 'Fantasmita del Aburrimiento 👻', color: '#ff4081' },
                { r: 0, c: 7, name: 'Fantasmita del Dolor 🕷️', color: '#7c4dff' }
            ];
            pacKisses = [
                {r:0, c:2}, {r:0, c:6}, {r:2, c:0}, {r:2, c:4}, {r:3, c:7},
                {r:4, c:2}, {r:6, c:1}, {r:6, c:5}, {r:7, c:0}, {r:7, c:5}
            ];
            pacScore = 0;
            if (pacInterval) clearInterval(pacInterval);
            pacInterval = setInterval(moveGhosts, 750);
        }

        function moveGhosts() {
            if (activeTab !== 'pacbesos') return;
            const dirs = [{r:-1,c:0}, {r:1,c:0}, {r:0,c:-1}, {r:0,c:1}];
            pacGhosts.forEach(g => {
                const validDirs = dirs.filter(d => {
                    const nr = g.r + d.r;
                    const nc = g.c + d.c;
                    return nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && mazeLayout[nr][nc] === 0;
                });
                if (validDirs.length > 0) {
                    const move = validDirs[Math.floor(Math.random() * validDirs.length)];
                    g.r += move.r;
                    g.c += move.c;
                }
                if (g.r === pacPlayer.r && g.c === pacPlayer.c) {
                    playArcadeTone(330, 'sine', 0.25);
                    const toast = document.createElement('div');
                    toast.style.position = 'absolute';
                    toast.style.top = '50%';
                    toast.style.left = '50%';
                    toast.style.transform = 'translate(-50%, -50%)';
                    toast.style.background = 'rgba(255, 0, 127, 0.95)';
                    toast.style.color = '#fff';
                    toast.style.padding = '12px 20px';
                    toast.style.borderRadius = '15px';
                    toast.style.fontWeight = 'bold';
                    toast.style.textAlign = 'center';
                    toast.style.zIndex = '100';
                    toast.style.boxShadow = '0 0 20px rgba(0,0,0,0.8)';
                    toast.innerHTML = '🛡️ ¡Escudo de Amor de Carlos activado!<br>No pierdes vidas, ¡el amor nos hace invencibles! 💖';
                    wrapper.appendChild(toast);
                    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2000);
                    g.r = 7; g.c = 7;
                    renderPacGrid();
                }
            });
            renderPacGrid();
        }

        function movePlayer(dr, dc) {
            const nr = pacPlayer.r + dr;
            const nc = pacPlayer.c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && mazeLayout[nr][nc] === 0) {
                pacPlayer.r = nr;
                pacPlayer.c = nc;
                playArcadeTone(440, 'triangle', 0.08);

                // Check Kisses
                const kissIdx = pacKisses.findIndex(k => k.r === nr && k.c === nc);
                if (kissIdx !== -1) {
                    pacKisses.splice(kissIdx, 1);
                    pacScore += 10;
                    playArcadeTone(587.33, 'triangle', 0.15);
                    setTimeout(() => playArcadeTone(880, 'triangle', 0.25), 100);

                    if (pacKisses.length === 0) {
                        if (pacInterval) clearInterval(pacInterval);
                        tickets += 100;
                        localStorage.setItem('melisa_arcade_tickets', tickets.toString());
                        updateTicketDisplay();
                        contentArea.innerHTML = `
                            <div style="text-align:center; padding:30px; background:rgba(0, 255, 136, 0.15); border:2px solid #00ff88; border-radius:20px; animation:popIn 0.4s ease;">
                                <div style="font-size:3.5rem; margin-bottom:10px;">🏆💋</div>
                                <h3 style="color:#00ff88; font-family:'Outfit',sans-serif; font-size:1.6rem; margin:0 0 10px 0;">¡NIVEL COMPLETADO!</h3>
                                <p style="color:#fff; font-size:1.05rem; line-height:1.5; margin-bottom:20px;">
                                    ¡Eres la reina indiscutible del Pac-Besos! Has atrapado todo mi amor y superado los obstáculos.<br><br>
                                    <strong style="color:var(--gold); font-size:1.2rem;">+100 TICKETS ARCADE GANADOS 🎟️💖</strong>
                                </p>
                                <button id="pac-replay-btn" class="btn" style="background:var(--cyan); color:#000; font-weight:900; padding:12px 28px; border-radius:25px; box-shadow:0 4px 15px rgba(0,229,255,0.4);">
                                    🔄 Jugar Otra Vez para Más Tickets
                                </button>
                            </div>
                        `;
                        const replayBtn = contentArea.querySelector('#pac-replay-btn');
                        if (replayBtn) replayBtn.onclick = () => { initPacBesos(); renderPacBesos(); };
                        return;
                    }
                }
                renderPacGrid();
            }
        }

        function renderPacGrid() {
            const gridEl = contentArea.querySelector('#pac-grid');
            if (!gridEl) return;
            gridEl.innerHTML = '';
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const cell = document.createElement('div');
                    cell.style.width = '100%';
                    cell.style.aspectRatio = '1';
                    cell.style.borderRadius = '8px';
                    cell.style.display = 'flex';
                    cell.style.alignItems = 'center';
                    cell.style.justifyContent = 'center';
                    cell.style.fontSize = '1.4rem';
                    cell.style.fontWeight = 'bold';

                    if (mazeLayout[r][c] === 1) {
                        cell.style.background = 'rgba(0, 229, 255, 0.2)';
                        cell.style.border = '2px solid #00e5ff';
                        cell.style.boxShadow = 'inset 0 0 8px rgba(0,229,255,0.5)';
                        cell.innerHTML = '🧱';
                    } else {
                        cell.style.background = 'rgba(255, 255, 255, 0.04)';
                        cell.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        if (pacPlayer.r === r && pacPlayer.c === c) {
                            cell.innerHTML = '👸';
                            cell.style.background = 'rgba(255, 215, 0, 0.3)';
                            cell.style.boxShadow = '0 0 12px var(--gold)';
                        } else if (pacGhosts.some(g => g.r === r && g.c === c)) {
                            const gh = pacGhosts.find(g => g.r === r && g.c === c);
                            cell.innerHTML = gh.name.includes('Aburrimiento') ? '👻' : '🕷️';
                        } else if (pacKisses.some(k => k.r === r && k.c === c)) {
                            cell.innerHTML = '💋';
                        } else {
                            cell.innerHTML = '<span style="color:rgba(255,255,255,0.2); font-size:0.6rem;">●</span>';
                        }
                    }
                    gridEl.appendChild(cell);
                }
            }
            const scoreEl = contentArea.querySelector('#pac-score-val');
            if (scoreEl) scoreEl.textContent = `${pacScore} / 100`;
        }

        function renderPacBesos() {
            if (pacKisses.length === 0) initPacBesos();
            contentArea.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:rgba(0,0,0,0.4); padding:8px 14px; border-radius:15px; border:1px solid rgba(0,229,255,0.2);">
                    <span style="color:var(--cyan); font-weight:bold; font-size:0.9rem;">🕹️ NIVEL: LABERINTO DEL AMOR</span>
                    <span style="color:#ff007f; font-weight:900; font-size:0.9rem;">💋 Besos: <span id="pac-score-val">${pacScore} / 100</span></span>
                </div>
                <p style="color:#fff; font-size:0.85rem; text-align:center; margin-bottom:14px;">
                    ✨ Mueve a tu princesa 👸 para recolectar los 10 besos 💋 de Carlos. ¡Aquí tienes vidas infinitas!
                </p>
                <div id="pac-grid" style="display:grid; grid-template-columns:repeat(8, 1fr); gap:6px; max-width:340px; margin:0 auto 18px auto; background:#080612; padding:10px; border-radius:16px; border:2px solid rgba(255,255,255,0.1);"></div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:8px; max-width:180px; margin:0 auto;">
                    <button id="pac-btn-up" class="btn" style="background:var(--cyan); color:#000; width:55px; height:48px; border-radius:12px; font-size:1.3rem; font-weight:900; padding:0;">⬆️</button>
                    <div style="display:flex; gap:12px;">
                        <button id="pac-btn-left" class="btn" style="background:var(--cyan); color:#000; width:55px; height:48px; border-radius:12px; font-size:1.3rem; font-weight:900; padding:0;">⬅️</button>
                        <button id="pac-btn-down" class="btn" style="background:var(--cyan); color:#000; width:55px; height:48px; border-radius:12px; font-size:1.3rem; font-weight:900; padding:0;">⬇️</button>
                        <button id="pac-btn-right" class="btn" style="background:var(--cyan); color:#000; width:55px; height:48px; border-radius:12px; font-size:1.3rem; font-weight:900; padding:0;">➡️</button>
                    </div>
                </div>
            `;
            renderPacGrid();

            const bUp = contentArea.querySelector('#pac-btn-up');
            const bDown = contentArea.querySelector('#pac-btn-down');
            const bLeft = contentArea.querySelector('#pac-btn-left');
            const bRight = contentArea.querySelector('#pac-btn-right');

            if (bUp) bUp.onclick = () => movePlayer(-1, 0);
            if (bDown) bDown.onclick = () => movePlayer(1, 0);
            if (bLeft) bLeft.onclick = () => movePlayer(0, -1);
            if (bRight) bRight.onclick = () => movePlayer(0, 1);
        }

        // --- TAB 2: TETRIS DEL AMOR ---
        let tetrisPiecesCount = 0;
        const tetrisShapes = [
            { name: 'Doble Corazón', emoji: '💖', color: '#ff007f' },
            { name: 'Corona Real', emoji: '👑', color: '#ffd54f' },
            { name: 'Abrazo Eterno', emoji: '🫂', color: '#00e5ff' },
            { name: 'Beso Apasionado', emoji: '💋', color: '#00ff88' },
            { name: 'Estrella de Paz', emoji: '⭐', color: '#7c4dff' }
        ];
        let currentShape = tetrisShapes[0];
        let tetrisBoard = [[], [], []]; // 3 columns, max 5 rows

        function renderTetrisLove() {
            if (pacInterval) clearInterval(pacInterval);
            if (!currentShape) currentShape = tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];

            contentArea.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:rgba(0,0,0,0.4); padding:8px 14px; border-radius:15px; border:1px solid rgba(0,229,255,0.2);">
                    <span style="color:var(--cyan); font-weight:bold; font-size:0.9rem;">🧱 ENCAJA NUESTRO AMOR</span>
                    <span style="color:var(--gold); font-weight:900; font-size:0.9rem;">💖 Piezas: ${tetrisPiecesCount}</span>
                </div>
                <p style="color:#fff; font-size:0.85rem; text-align:center; margin-bottom:14px;">
                    ✨ Elige en cuál columna (1, 2 o 3) dejar caer la pieza. ¡Cuando completes una línea horizontal de 3 piezas ganarás el súper bono de amor!
                </p>

                <div style="background:#0a0818; border:2px dashed #ff007f; border-radius:16px; padding:12px; text-align:center; margin-bottom:16px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:4px;">PRÓXIMA PIEZA EN CAER:</div>
                    <div id="tetris-piece-display" style="font-size:2.2rem; margin-bottom:4px; filter:drop-shadow(0 0 10px ${currentShape.color}); animation:bounce 1.5s infinite;">
                        ${currentShape.emoji}
                    </div>
                    <div style="color:#fff; font-weight:bold; font-size:0.95rem;">«${currentShape.name}»</div>
                </div>

                <div id="tetris-board" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; max-width:280px; margin:0 auto 16px auto; background:#080612; padding:12px; border-radius:16px; border:2px solid rgba(255,255,255,0.15); min-height:200px;"></div>

                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; max-width:280px; margin:0 auto 16px auto;">
                    <button id="tetris-col-0" class="btn" style="background:var(--cyan); color:#000; font-weight:900; padding:10px 4px; border-radius:12px; font-size:0.85rem;">⬇️ Col 1</button>
                    <button id="tetris-col-1" class="btn" style="background:#ff007f; color:#fff; font-weight:900; padding:10px 4px; border-radius:12px; font-size:0.85rem;">⬇️ Col 2</button>
                    <button id="tetris-col-2" class="btn" style="background:var(--gold); color:#000; font-weight:900; padding:10px 4px; border-radius:12px; font-size:0.85rem;">⬇️ Col 3</button>
                </div>

                <div id="tetris-msg-box" style="background:rgba(0,229,255,0.1); border:1px solid var(--cyan); border-radius:14px; padding:10px; text-align:center; color:#fff; font-size:0.88rem; min-height:44px; display:flex; align-items:center; justify-content:center;">
                    Selecciona una columna para dejar caer la pieza... 💞
                </div>
            `;

            function renderBoard() {
                const boardEl = contentArea.querySelector('#tetris-board');
                if (!boardEl) return;
                boardEl.innerHTML = '';
                // Render from top row (row 4) down to bottom row (row 0)
                for (let r = 4; r >= 0; r--) {
                    for (let c = 0; c < 3; c++) {
                        const cell = document.createElement('div');
                        cell.style.width = '100%';
                        cell.style.aspectRatio = '1';
                        cell.style.borderRadius = '8px';
                        cell.style.display = 'flex';
                        cell.style.alignItems = 'center';
                        cell.style.justifyContent = 'center';
                        cell.style.fontSize = '1.5rem';

                        const piece = tetrisBoard[c][r];
                        if (piece) {
                            cell.style.background = 'rgba(255,255,255,0.1)';
                            cell.style.border = `2px solid ${piece.color}`;
                            cell.style.boxShadow = `0 0 8px ${piece.color}`;
                            cell.innerHTML = piece.emoji;
                        } else {
                            cell.style.background = 'rgba(255,255,255,0.02)';
                            cell.style.border = '1px dashed rgba(255,255,255,0.08)';
                        }
                        boardEl.appendChild(cell);
                    }
                }
            }

            function dropPiece(colIdx) {
                if (tetrisBoard[colIdx].length >= 5) {
                    // Auto-clear top if full so she never loses
                    tetrisBoard[colIdx].shift();
                }
                tetrisBoard[colIdx].push(currentShape);
                tetrisPiecesCount++;
                tickets += 30;
                playArcadeTone(523.25, 'triangle', 0.15);

                // Check if bottom row (row 0) is full across all 3 columns
                let lineCleared = false;
                if (tetrisBoard[0].length > 0 && tetrisBoard[1].length > 0 && tetrisBoard[2].length > 0) {
                    // Clear bottom row from all columns!
                    tetrisBoard[0].shift();
                    tetrisBoard[1].shift();
                    tetrisBoard[2].shift();
                    tickets += 100;
                    lineCleared = true;
                    playArcadeTone(587.33, 'sine', 0.2);
                    setTimeout(() => playArcadeTone(880, 'sine', 0.35), 150);
                }

                localStorage.setItem('melisa_arcade_tickets', tickets.toString());
                updateTicketDisplay();
                renderBoard();

                const msgBox = contentArea.querySelector('#tetris-msg-box');
                if (msgBox) {
                    msgBox.style.animation = 'none';
                    void msgBox.offsetWidth;
                    msgBox.style.animation = 'popIn 0.3s ease';
                    if (lineCleared) {
                        msgBox.innerHTML = '<strong style="color:#00ff88;">💥 ¡LÍNEA COMPLETADA! +130 TICKETS EN TOTAL 🎟️<br>¡Así de perfecto encajan nuestras almas! 💖</strong>';
                    } else {
                        msgBox.innerHTML = `<span style="color:#00e5ff;">+30 Tickets ganados 🎟️ ¡Sigue encajando piezas para armar la línea!</span>`;
                    }
                }

                // Next piece
                currentShape = tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];
                const pDisp = contentArea.querySelector('#tetris-piece-display');
                if (pDisp) {
                    pDisp.innerHTML = currentShape.emoji;
                    pDisp.style.filter = `drop-shadow(0 0 10px ${currentShape.color})`;
                    pDisp.nextElementSibling.textContent = `«${currentShape.name}»`;
                }
            }

            renderBoard();

            const b0 = contentArea.querySelector('#tetris-col-0');
            const b1 = contentArea.querySelector('#tetris-col-1');
            const b2 = contentArea.querySelector('#tetris-col-2');

            if (b0) b0.onclick = () => dropPiece(0);
            if (b1) b1.onclick = () => dropPiece(1);
            if (b2) b2.onclick = () => dropPiece(2);
        }

        // --- TAB 3: CANJEAR PREMIOS VIP ---
        const vipPrizes = [
            { id: 'p_burger', title: '🍔 Hamburguesa Gourmet & Papitas', desc: 'Una salida o pedido a domicilio de tu hamburguesa favorita en cuanto te recuperes.', cost: 10005000 },
            { id: 'p_icecream', title: '🍦 Helado Doble Consentido', desc: 'Una tarde deliciosa comiendo tu helado preferido tomados de la mano.', cost: 10002500 },
            { id: 'p_movie', title: '🎬 Tarde de Cine & Crispetas VIP', desc: 'Película a tu elección, sofá, cobija, crispetas gigantes y abrazos ilimitados.', cost: 10000300 },
            { id: 'p_massage', title: '💆‍♀️ Masaje Real de tu Rey (20 min)', desc: 'Sesión especial de masaje relajante en pies y espalda dado exclusivamente por Carlos.', cost: 18000000 },
            { id: 'p_trip', title: '✈️ Paseo Especial de Celebración', desc: 'Una escapada o paseo romántico para festejar tu alta médica por todo lo alto.', cost: 20000000 },
            { id: 'p_wish', title: '👑 El Gran Deseo de la Reina', desc: '¡Tú pides el capricho o deseo que quieras y tu rey Carlos te lo cumple sin dudarlo!', cost: 15000000 }
        ];

        function renderArcadePrizes() {
            if (pacInterval) clearInterval(pacInterval);

            contentArea.innerHTML = `
                <div style="background:linear-gradient(135deg, #ffd54f, #ff8f00); color:#000; padding:14px; border-radius:16px; text-align:center; font-weight:900; font-size:1.15rem; margin-bottom:18px; box-shadow:0 6px 20px rgba(255,215,0,0.4);">
                    🎟️ TUS TICKETS DISPONIBLES: ${tickets.toLocaleString('es-CO')}
                </div>
                <p style="color:#fff; text-align:center; font-size:0.88rem; margin-bottom:18px;">
                    ✨ Canjea tus Tickets ganados en los minijuegos por premios reales que tu rey Carlos te hará efectivos en cuanto te recuperes.
                </p>
                <div id="prizes-list" style="display:flex; flex-direction:column; gap:14px; margin-bottom:24px;"></div>
            `;

            const listEl = contentArea.querySelector('#prizes-list');
            vipPrizes.forEach(p => {
                const isRedeemed = redeemedPrizes.includes(p.id);
                const canAfford = tickets >= p.cost;

                const card = document.createElement('div');
                card.style.background = isRedeemed ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.06)';
                card.style.border = isRedeemed ? '2px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.15)';
                card.style.borderRadius = '16px';
                card.style.padding = '14px';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.gap = '10px';

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <h4 style="color:${isRedeemed ? '#00ff88' : '#fff'}; font-family:'Outfit',sans-serif; font-size:1.05rem; margin:0;">${p.title}</h4>
                        <span style="background:${isRedeemed ? '#00ff88' : 'var(--gold)'}; color:#000; font-weight:900; font-size:0.8rem; padding:4px 10px; border-radius:12px; white-space:nowrap;">
                            ${isRedeemed ? 'CANJEADO ✅' : `🎟️ ${p.cost.toLocaleString('es-CO')}`}
                        </span>
                    </div>
                    <p style="color:var(--text-secondary); font-size:0.85rem; margin:0; line-height:1.4;">${p.desc}</p>
                    <div id="prize-action-${p.id}" style="margin-top:4px;"></div>
                `;

                const actionDiv = card.querySelector(`#prize-action-${p.id}`);
                if (isRedeemed) {
                    actionDiv.innerHTML = `<div style="color:#00ff88; font-size:0.85rem; font-weight:bold; text-align:center; padding:6px; background:rgba(0,255,136,0.15); border-radius:10px;">🌟 ¡Premio listo para cobrarle a Carlos! 👑</div>`;
                } else {
                    const btn = document.createElement('button');
                    btn.className = 'btn';
                    btn.style.width = '100%';
                    btn.style.padding = '10px';
                    btn.style.borderRadius = '14px';
                    btn.style.fontWeight = '900';
                    btn.style.fontSize = '0.9rem';
                    if (canAfford) {
                        btn.style.background = 'var(--cyan)';
                        btn.style.color = '#000';
                        btn.style.boxShadow = '0 4px 12px rgba(0,229,255,0.3)';
                        btn.textContent = `🎁 CANJEAR PREMIO POR ${p.cost.toLocaleString('es-CO')} TICKETS`;
                        btn.onclick = () => {
                            tickets -= p.cost;
                            redeemedPrizes.push(p.id);
                            localStorage.setItem('melisa_arcade_tickets', tickets.toString());
                            localStorage.setItem('melisa_arcade_redeemed', JSON.stringify(redeemedPrizes));
                            playArcadeTone(587.33, 'sine', 0.2);
                            setTimeout(() => playArcadeTone(880, 'sine', 0.35), 150);
                            renderArcadePrizes();
                        };
                    } else {
                        btn.style.background = 'rgba(255,255,255,0.1)';
                        btn.style.color = 'rgba(255,255,255,0.4)';
                        btn.style.cursor = 'not-allowed';
                        btn.textContent = `🔒 Faltan ${(p.cost - tickets).toLocaleString('es-CO')} Tickets para canjear`;
                        btn.disabled = true;
                    }
                    actionDiv.appendChild(btn);
                }

                if (listEl) listEl.appendChild(card);
            });

        }

        function updateTabUI() {
            const btnP = wrapper.querySelector('#tab-btn-pacbesos');
            const btnT = wrapper.querySelector('#tab-btn-tetrislove');
            const btnA = wrapper.querySelector('#tab-btn-arcadeprizes');

            if (btnP) { btnP.style.background = activeTab === 'pacbesos' ? '#00e5ff' : 'rgba(255,255,255,0.1)'; btnP.style.color = activeTab === 'pacbesos' ? '#000' : '#fff'; btnP.style.boxShadow = activeTab === 'pacbesos' ? '0 0 15px rgba(0,229,255,0.6)' : 'none'; }
            if (btnT) { btnT.style.background = activeTab === 'tetrislove' ? '#ff007f' : 'rgba(255,255,255,0.1)'; btnT.style.color = activeTab === 'tetrislove' ? '#fff' : '#fff'; btnT.style.boxShadow = activeTab === 'tetrislove' ? '0 0 15px rgba(255,0,127,0.6)' : 'none'; }
            if (btnA) { btnA.style.background = activeTab === 'arcadeprizes' ? '#ffd54f' : 'rgba(255,255,255,0.1)'; btnA.style.color = activeTab === 'arcadeprizes' ? '#000' : '#fff'; btnA.style.boxShadow = activeTab === 'arcadeprizes' ? '0 0 15px rgba(255,215,0,0.6)' : 'none'; }

            updateTicketDisplay();

            if (activeTab === 'pacbesos') renderPacBesos();
            else if (activeTab === 'tetrislove') renderTetrisLove();
            else if (activeTab === 'arcadeprizes') renderArcadePrizes();
        }

        const btnP = wrapper.querySelector('#tab-btn-pacbesos');
        const btnT = wrapper.querySelector('#tab-btn-tetrislove');
        const btnA = wrapper.querySelector('#tab-btn-arcadeprizes');

        if (btnP) btnP.onclick = () => { activeTab = 'pacbesos'; updateTabUI(); };
        if (btnT) btnT.onclick = () => { activeTab = 'tetrislove'; updateTabUI(); };
        if (btnA) btnA.onclick = () => { activeTab = 'arcadeprizes'; updateTabUI(); };

        updateTabUI();
        return {
            destroy: () => {
                if (pacInterval) clearInterval(pacInterval);
                if (countdownInterval) clearInterval(countdownInterval);
            }
        };
    }

    // =============================================
    //  DÍA 12: FLAPPY LOVE 🕊️💖
    // =============================================
    function startFlappyLove(container, config) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-flappy-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '400px';
        wrapper.style.height = '500px';
        wrapper.style.margin = '0 auto';
        wrapper.style.background = 'linear-gradient(to bottom, #87CEEB 0%, #e0f6ff 100%)';
        wrapper.style.border = '4px solid #ff007f';
        wrapper.style.borderRadius = '16px';
        wrapper.style.overflow = 'hidden';
        wrapper.style.boxShadow = '0 8px 20px rgba(255,0,127,0.3)';
        container.appendChild(wrapper);

        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 500;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        wrapper.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Game State
        let isPlaying = false;
        let isGameOver = false;
        let score = 0;
        let animationId = null;

        const bird = {
            x: 50,
            y: 200,
            velocity: 0,
            gravity: 0.5,
            jump: -7.5,
            size: 36, // Using 36px font for emoji
            emoji: '🕊️'
        };

        const pipes = [];
        const pipeWidth = 60;
        const pipeGap = 160;
        const speed = 2.5;

        // Overlay for Instructions & Game Over
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
        overlay.style.display = 'flex'; overlay.style.flexDirection = 'column'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.style.color = '#fff'; overlay.style.textAlign = 'center'; overlay.style.padding = '20px';
        overlay.style.zIndex = '20';
        wrapper.appendChild(overlay);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.position = 'absolute';
        scoreDisplay.style.top = '10px'; scoreDisplay.style.left = '0'; scoreDisplay.style.width = '100%';
        scoreDisplay.style.textAlign = 'center'; scoreDisplay.style.fontSize = '3rem'; scoreDisplay.style.fontWeight = '900';
        scoreDisplay.style.color = '#fff'; scoreDisplay.style.textShadow = '3px 3px 0 #ff007f, -1px -1px 0 #ff007f, 1px -1px 0 #ff007f, -1px 1px 0 #ff007f';
        scoreDisplay.style.zIndex = '10';
        scoreDisplay.style.pointerEvents = 'none';
        scoreDisplay.textContent = '0';
        scoreDisplay.style.display = 'none';
        wrapper.appendChild(scoreDisplay);

        function drawBird() {
            ctx.font = `${bird.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.save();
            ctx.translate(bird.x, bird.y);
            const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 0.08)));
            ctx.rotate(angle);
            ctx.scale(-1, 1); // Flip horizontally so the dove faces right
            ctx.fillText(bird.emoji, 0, 0);
            ctx.restore();
        }

        function drawPipes() {
            pipes.forEach(p => {
                // Stems
                ctx.fillStyle = '#2e7d32'; 
                ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
                ctx.fillRect(p.x, canvas.height - p.bottomHeight, pipeWidth, p.bottomHeight);

                // Caps (only draw one rose at the top and one leaf at the bottom to avoid lag)
                ctx.font = '28px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🌹', p.x + pipeWidth/2, p.topHeight - 15);
                ctx.fillText('🍃', p.x + pipeWidth/2, canvas.height - p.bottomHeight + 15);
            });
        }

        function playTone(freq, type, dur) {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + dur);
            } catch(e) {}
        }

        function update() {
            if (!isPlaying) return;

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Bird physics
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            // Pipes spawn
            if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 220) {
                const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
                const bottomHeight = canvas.height - topHeight - pipeGap;
                pipes.push({ x: canvas.width, topHeight, bottomHeight, passed: false });
            }

            // Move pipes
            pipes.forEach(p => {
                p.x -= speed;
                
                // Score
                if (!p.passed && bird.x > p.x + pipeWidth) {
                    p.passed = true;
                    score++;
                    scoreDisplay.textContent = score;
                    playTone(880, 'sine', 0.1);
                }
            });

            // Remove off-screen pipes
            if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
                pipes.shift();
            }

            drawPipes();
            drawBird();

            // Collision detection
            // Bird bounding box (approximate for the emoji)
            const birdR = 14; 
            const hitGround = bird.y + birdR > canvas.height;
            const hitCeiling = bird.y - birdR < 0;

            let hitPipe = false;
            pipes.forEach(p => {
                if (bird.x + birdR > p.x && bird.x - birdR < p.x + pipeWidth) {
                    if (bird.y - birdR < p.topHeight || bird.y + birdR > canvas.height - p.bottomHeight) {
                        hitPipe = true;
                    }
                }
            });

            if (hitGround || hitCeiling || hitPipe) {
                gameOver();
            } else {
                animationId = requestAnimationFrame(update);
            }
        }

        function flap() {
            if (isGameOver) return;
            bird.velocity = bird.jump;
            if (!isPlaying) {
                isPlaying = true;
                overlay.style.display = 'none';
                scoreDisplay.style.display = 'block';
                update();
            } else {
                playTone(330, 'triangle', 0.1);
            }
        }

        function gameOver() {
            isPlaying = false;
            isGameOver = true;
            cancelAnimationFrame(animationId);
            playTone(150, 'sawtooth', 0.4);

            overlay.style.display = 'flex';
            overlay.innerHTML = `
                <div style="font-size:4rem; margin-bottom:10px; filter:drop-shadow(0 0 10px #ff007f);">💥</div>
                <h2 style="color:#fff; margin:0 0 10px 0; font-family:'Outfit',sans-serif;">¡Uy! Nos caímos 😅</h2>
                <p style="font-size:1.5rem; color:var(--gold); font-weight:900; margin-bottom:10px;">Puntaje: ${score}</p>
                <p style="font-size:1rem; margin-bottom:20px; padding:0 15px; color:#ddd;">No importa cuántas veces caigamos, nuestro amor siempre nos dará alas para volver a volar. ❤️</p>
                <button id="flappy-restart" class="btn" style="background:var(--cyan); color:#000; font-weight:900; font-size:1.1rem; padding:12px 28px; border-radius:25px; box-shadow:0 4px 15px rgba(0,229,255,0.4);">VOLVER A VOLAR 🕊️</button>
            `;

            setTimeout(() => {
                const btn = overlay.querySelector('#flappy-restart');
                if (btn) btn.onclick = (e) => { e.stopPropagation(); resetGame(); };
            }, 300);
        }

        function resetGame() {
            bird.y = 200;
            bird.velocity = 0;
            pipes.length = 0;
            score = 0;
            scoreDisplay.textContent = '0';
            isGameOver = false;
            isPlaying = false;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBird();

            overlay.style.display = 'flex';
            overlay.innerHTML = `
                <h2 style="font-family:'Outfit',sans-serif; color:#ff007f; text-shadow:0 0 15px #fff; margin:0 0 10px 0; font-size:3rem;">Flappy Love</h2>
                <div style="font-size:3rem; margin-bottom:10px;">🕊️💖</div>
                <p style="font-size:1.1rem; margin-bottom:25px; font-weight:500;">Toca la pantalla para volar y esquiva las rosas. ¡Intenta superar los 1000 puntos!</p>
                <button class="btn" id="flappy-start" style="background:#ff007f; color:#fff; font-weight:900; font-size:1.2rem; padding:14px 35px; border-radius:30px; box-shadow:0 6px 20px rgba(255,0,127,0.5);">¡EMPEZAR! 💖</button>
            `;
            setTimeout(() => {
                const btn = overlay.querySelector('#flappy-start');
                if (btn) btn.onclick = (e) => { e.stopPropagation(); flap(); };
            }, 100);
        }

        // Init screen
        resetGame();

        // Global listeners for the wrapper
        wrapper.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON') flap();
        });
        wrapper.addEventListener('touchstart', (e) => { 
            if (e.target.tagName !== 'BUTTON') { e.preventDefault(); flap(); }
        }, {passive: false});

        return {
            destroy: () => {
                if (animationId) cancelAnimationFrame(animationId);
            }
        };
    }

    // ==========================================
    // 18. TIMELINE (ORDENA NUESTRA HISTORIA)
    // ==========================================
    function startTimeline(container, config) {
        container.innerHTML = '';

        const milestones = (config.milestones && config.milestones.length >= 2)
            ? config.milestones
            : [
                { label: 'Primer beso', date: '5 de junio' },
                { label: 'Nos hicimos novios', date: '19 de octubre' }
            ];

        const correctOrder = milestones.map((m, i) => ({ ...m, correctIndex: i }));
        let shuffled = shuffleArray([...correctOrder]);
        let nextExpected = 0;
        let mistakes = 0;

        const statsDiv = document.createElement('div');
        statsDiv.className = 'game-stats';
        statsDiv.innerHTML = `<span>Progreso: <span class="stat-value" id="tl-progress">0</span> / ${milestones.length}</span><span>Errores: <span class="stat-value" id="tl-mistakes">0</span></span>`;
        container.appendChild(statsDiv);

        const instructions = document.createElement('p');
        instructions.style.cssText = 'text-align:center;color:var(--text-secondary);margin:8px 0 16px;font-size:0.95rem;';
        instructions.textContent = 'Toca los momentos en el orden correcto, del más antiguo al más reciente 👇';
        container.appendChild(instructions);

        const timelineTrack = document.createElement('div');
        timelineTrack.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;max-width:420px;margin:0 auto 20px;min-height:' + (milestones.length * 46) + 'px;';
        container.appendChild(timelineTrack);

        const optionsGrid = document.createElement('div');
        optionsGrid.style.cssText = 'display:flex;flex-direction:column;gap:10px;width:100%;max-width:420px;margin:0 auto;';
        container.appendChild(optionsGrid);

        function renderOptions() {
            optionsGrid.innerHTML = '';
            shuffled.forEach((item) => {
                const btn = document.createElement('button');
                btn.textContent = item.label;
                btn.style.cssText = 'padding:14px 16px;border-radius:12px;border:1.5px solid var(--primary-soft);background:rgba(0,229,255,0.06);color:var(--text-primary,#e0f7fa);font-size:1rem;cursor:pointer;text-align:left;transition:all 0.2s;';
                btn.onmouseenter = () => { btn.style.borderColor = 'var(--primary)'; };
                btn.onmouseleave = () => { btn.style.borderColor = 'var(--primary-soft)'; };
                btn.onclick = () => handlePick(item, btn);
                optionsGrid.appendChild(btn);
            });
        }

        function handlePick(item, btn) {
            if (item.correctIndex === nextExpected) {
                btn.disabled = true;
                const slot = document.createElement('div');
                slot.style.cssText = 'padding:12px 16px;border-radius:12px;border:1.5px solid var(--primary);background:var(--primary-soft);color:var(--primary);font-weight:600;display:flex;justify-content:space-between;align-items:center;box-shadow:0 0 15px var(--primary-glow);animation:fadeInSlide 0.4s ease;';
                slot.innerHTML = `<span>${nextExpected + 1}. ${item.label}</span>${item.date ? `<span style="font-size:0.85rem;color:var(--text-secondary);">${item.date}</span>` : ''}`;
                timelineTrack.appendChild(slot);

                nextExpected++;
                document.getElementById('tl-progress').textContent = nextExpected;
                shuffled = shuffled.filter(s => s !== item);
                renderOptions();

                if (nextExpected === milestones.length) {
                    if (window.notifyCarlos) window.notifyCarlos("🎮 Melissa acaba de ganar el juego de Ordena Nuestra Historia.");
                    optionsGrid.innerHTML = '';
                    setTimeout(() => celebrate(container, `¡Ordenaste toda nuestra historia con ${mistakes} error${mistakes === 1 ? '' : 'es'}!`), 400);
                }
            } else {
                mistakes++;
                document.getElementById('tl-mistakes').textContent = mistakes;
                btn.style.borderColor = 'var(--danger)';
                btn.style.background = 'rgba(255,82,82,0.12)';
                btn.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 300 });
                setTimeout(() => {
                    btn.style.borderColor = 'var(--primary-soft)';
                    btn.style.background = 'rgba(0,229,255,0.06)';
                }, 400);
            }
        }

        renderOptions();

        // Replay button
        const replayBtn = document.createElement('button');
        replayBtn.className = 'game-replay-btn';
        replayBtn.innerHTML = '🔄 Jugar de nuevo';
        replayBtn.onclick = () => startTimeline(container, config);
        container.appendChild(replayBtn);

        return { destroy: () => { container.innerHTML = ''; } };
    }

    // ==========================================
    // 19. CAZA CORAZONES (WHACK-A-HEART, REPLAYABLE SCORE LOOP)
    // ==========================================
    function startWhackHearts(container, config) {
        container.innerHTML = '';

        const DURATION = config.duration || 45; // seconds
        const HOLE_COUNT = config.holeCount || 9;
        const START_INTERVAL = 1100; // ms a heart stays visible at the start
        const MIN_INTERVAL = 500;   // ms at max difficulty
        const emojis = config.emojis || ['💖', '💗', '💕'];

        const HIGH_SCORE_KEY = 'melisa_whack_hearts_highscore';
        let bestScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0');

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative;width:100%;max-width:420px;margin:0 auto;user-select:none;-webkit-user-select:none;touch-action:manipulation;';
        container.appendChild(wrapper);

        const scoreboard = document.createElement('div');
        scoreboard.className = 'game-stats';
        scoreboard.innerHTML = `
            <span>Puntos: <span class="stat-value" id="wh-score">0</span></span>
            <span>Tiempo: <span class="stat-value" id="wh-time">${DURATION}</span>s</span>
            <span>Mejor: <span class="stat-value" id="wh-best">${bestScore}</span></span>
        `;
        wrapper.appendChild(scoreboard);

        const grid = document.createElement('div');
        const cols = 3;
        const rows = Math.ceil(HOLE_COUNT / cols);
        grid.style.cssText = `display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;margin-top:14px;`;
        wrapper.appendChild(grid);

        const holes = [];
        for (let i = 0; i < HOLE_COUNT; i++) {
            const hole = document.createElement('div');
            hole.style.cssText = 'aspect-ratio:1;border-radius:50%;border:2px solid var(--primary-soft);background:rgba(0,229,255,0.05);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;transition:transform 0.1s;overflow:hidden;';
            hole.dataset.active = 'false';
            hole.addEventListener('click', () => hit(i));
            grid.appendChild(hole);
            holes.push(hole);
        }

        // Start overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;background:rgba(5,15,30,0.92);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:10;text-align:center;padding:20px;';
        overlay.innerHTML = `
            <div style="font-size:3rem;">💘</div>
            <p style="color:var(--text-secondary);max-width:280px;">Toca los corazones antes de que se escondan. ¡Entre más rápido reacciones, más puntos ganas!</p>
        `;
        const startBtn = document.createElement('button');
        startBtn.className = 'game-replay-btn';
        startBtn.textContent = '💖 Empezar';
        overlay.appendChild(startBtn);
        wrapper.appendChild(overlay);

        let score = 0;
        let timeLeft = DURATION;
        let activeHole = -1;
        let popTimeout = null;
        let tickInterval = null;
        let currentInterval = START_INTERVAL;
        let running = false;

        function hit(index) {
            if (!running || index !== activeHole) return;
            score++;
            document.getElementById('wh-score').textContent = score;
            holes[index].style.transform = 'scale(1.15)';
            setTimeout(() => { holes[index].style.transform = 'scale(1)'; }, 100);
            clearHole(index);
            activeHole = -1;
            scheduleNextPop();
        }

        function clearHole(index) {
            holes[index].innerHTML = '';
            holes[index].dataset.active = 'false';
            holes[index].style.borderColor = 'var(--primary-soft)';
            holes[index].style.background = 'rgba(0,229,255,0.05)';
        }

        function popRandomHeart() {
            if (activeHole !== -1) clearHole(activeHole);
            let next = Math.floor(Math.random() * HOLE_COUNT);
            activeHole = next;
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            holes[next].innerHTML = emoji;
            holes[next].dataset.active = 'true';
            holes[next].style.borderColor = 'var(--primary)';
            holes[next].style.background = 'var(--primary-soft)';

            // Progressively speed up as time passes
            const progress = 1 - (timeLeft / DURATION);
            currentInterval = Math.max(MIN_INTERVAL, START_INTERVAL - progress * (START_INTERVAL - MIN_INTERVAL));

            popTimeout = setTimeout(() => {
                if (activeHole === next) {
                    clearHole(next);
                    activeHole = -1;
                    if (running) scheduleNextPop();
                }
            }, currentInterval);
        }

        function scheduleNextPop() {
            if (!running) return;
            popTimeout = setTimeout(popRandomHeart, 250);
        }

        function endGame() {
            running = false;
            clearTimeout(popTimeout);
            clearInterval(tickInterval);
            if (activeHole !== -1) clearHole(activeHole);

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem(HIGH_SCORE_KEY, String(bestScore));
            }
            document.getElementById('wh-best').textContent = bestScore;

            if (window.notifyCarlos) window.notifyCarlos(`🎮 Melissa jugó Caza Corazones y obtuvo ${score} puntos.`);

            overlay.innerHTML = `
                <div style="font-size:3rem;">${score >= bestScore && score > 0 ? '🏆' : '💗'}</div>
                <p style="color:var(--primary);font-size:1.3rem;font-weight:700;margin:0;">¡${score} puntos!</p>
                <p style="color:var(--text-secondary);margin:0;">Mejor puntaje: ${bestScore}</p>
            `;
            const again = document.createElement('button');
            again.className = 'game-replay-btn';
            again.textContent = '🔄 Jugar de nuevo';
            again.onclick = () => startWhackHearts(container, config);
            overlay.appendChild(again);
            overlay.style.display = 'flex';
        }

        startBtn.onclick = () => {
            overlay.style.display = 'none';
            running = true;
            score = 0;
            timeLeft = DURATION;
            document.getElementById('wh-score').textContent = '0';
            document.getElementById('wh-time').textContent = String(timeLeft);

            tickInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('wh-time').textContent = String(Math.max(0, timeLeft));
                if (timeLeft <= 0) endGame();
            }, 1000);

            popRandomHeart();
        };

        return {
            destroy: () => {
                clearTimeout(popTimeout);
                clearInterval(tickInterval);
                running = false;
                container.innerHTML = '';
            }
        };
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
        startSimonSays,
        startMagicBoxes,
        startSlots,
        startPenalties,
        startAlbum,
        startKeepyUppy: startWorldCupTeams,
        startWorldCupTeams,
        startMusicFestival,
        startArcade,
        startFlappyLove,
        startTimeline,
        startWhackHearts
    };
})();

