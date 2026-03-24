document.addEventListener('DOMContentLoaded', () => {
    const balloonContainer = document.getElementById('balloon-container');
    const balloonUI = document.getElementById('balloon-ui');
    const birthdayMessage = document.getElementById('birthday-message');
    const counterDisplay = document.getElementById('counter');
    
    const cowGameContainer = document.getElementById('cow-game-container');
    const cow = document.getElementById('cow');
    const obstacle = document.getElementById('obstacle');
    const cowScoreDisplay = document.getElementById('cow-score');

    let poppedBalloons = 0;
    const totalBalloons = 10;
    let balloonInterval;

    let cowScore = 0;
    const requiredCowScore = 200;
    let isJumping = false;
    let checkCollision;
    let scoreInterval;

    // --- Cow Game Logic ---
    function jump() {
        if (!isJumping) {
            isJumping = true;
            cow.classList.add('jump');
            setTimeout(() => {
                cow.classList.remove('jump');
                isJumping = false;
            }, 600); // Matches the CSS animation duration
        }
    }

    // Listen for Spacebar or Up Arrow
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.code === 'ArrowUp') && !cowGameContainer.classList.contains('hidden')) {
            e.preventDefault();
            jump();
        }
    });
    
    // Touch support for mobile
    cowGameContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    }, { passive: false });

    function startCowGame() {
        obstacle.style.animationDuration = '1.5s';
        obstacle.classList.add('move');
        
        // Re-trigger the obstacle animation with a random delay after it finishes
        obstacle.addEventListener('animationend', () => {
            obstacle.classList.remove('move');
            const randomDelay = Math.random() * 1500 + 300; // Random delay between 300ms and 1800ms
            setTimeout(() => {
                if (!cowGameContainer.classList.contains('hidden')) {
                    const newDuration = Math.max(0.6, 1.5 - (cowScore * 0.003));
                    obstacle.style.animationDuration = `${newDuration}s`;
                    obstacle.classList.add('move');
                }
            }, randomDelay);
        });
        
        checkCollision = setInterval(() => {
            const cowTop = parseInt(window.getComputedStyle(cow).getPropertyValue('top'));
            const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

            // Collision detection (checks if the cow and obstacle overlap)
            if (obstacleLeft > 20 && obstacleLeft < 80 && cowTop > 110) {
                obstacle.style.animation = 'none';
                setTimeout(() => { 
                    obstacle.style.animation = ''; 
                    obstacle.style.animationDuration = '1.5s';
                }, 50);
                
                cowScore = 0;
                cowScoreDisplay.textContent = `Wynik: 0 / ${requiredCowScore}`;
                alert('O nie! Szkocka krówka uderzyła w kaktusa! Spróbuj ponownie!');
            }
        }, 10);

        scoreInterval = setInterval(() => {
            cowScore++;
            cowScoreDisplay.textContent = `Wynik: ${cowScore} / ${requiredCowScore}`;
            
            if (cowScore >= requiredCowScore) {
                alert('Hurra! Zdobyłeś 200 punktów! Czas na next step!');
                endCowGame();
            }
        }, 100);
    }

    function endCowGame() {
        clearInterval(checkCollision);
        clearInterval(scoreInterval);
        
        cowGameContainer.classList.add('hidden');
        balloonContainer.classList.remove('hidden');
        balloonUI.classList.remove('hidden');
        
        startBalloonGame();
    }

    // --- Balloon Game Logic ---
    function startBalloonGame() {
        counterDisplay.classList.remove('hidden');
        balloonInterval = setInterval(createBalloon, 1000);
    }

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${Math.random() * 90}vw`;
        balloon.style.backgroundColor = `hsla(${Math.random() * 360}, 100%, 75%, 0.8)`;
        balloon.style.animationDuration = `${Math.random() * 5 + 8}s`;

        balloon.addEventListener('click', () => {
            popBalloon(balloon);
        });

        balloonContainer.appendChild(balloon);

        setTimeout(() => {
            if (balloon.parentElement === balloonContainer) {
                balloonContainer.removeChild(balloon);
            }
        }, 13000);
    }

    function popBalloon(balloon) {
        if (balloon.parentElement === balloonContainer) {
            balloonContainer.removeChild(balloon);
            poppedBalloons++;
            updateCounter();
            checkWin();
        }
    }

    function updateCounter() {
        counterDisplay.textContent = `Przebite balony: ${poppedBalloons} / ${totalBalloons}`;
    }

    function checkWin() {
        if (poppedBalloons >= totalBalloons) {
            birthdayMessage.classList.remove('hidden');
            counterDisplay.classList.add('hidden');
            // Stop creating new balloons
            clearInterval(balloonInterval);
        }
    }

    // Initially hide the h1
    birthdayMessage.classList.add('hidden');

    // Start the cow game loop initially
    startCowGame();
});
