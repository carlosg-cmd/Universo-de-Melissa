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
         container.innerHTML = '<p style="text-align:center; padding: 20px;">Rompecabezas en construcción... 🚧</p>';
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

    return {
        startMemory,
        startWordSearch,
        startTrivia,
        startPuzzle,
        startRiddle
    };
})();
