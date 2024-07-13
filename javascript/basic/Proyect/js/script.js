const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const usernameInput = document.getElementById('username');
const registerButton = document.getElementById('registerButton');
const startButton = document.getElementById('startButton');
const difficultyButton = document.getElementById('difficultyButton');

let username = '';
let difficulty = 'easy'; // Default difficulty
let gameState = 'start'; // 'start', 'playing', 'over'

// Game settings
const bird = { x: 50, y: 150, width: 40, height: 40, gravity: 0.2, lift: -6, velocity: 0 };
let pipes = [];
const pipeWidth = 80;
const pipeGap = 150;
let frameCount = 0;
let score = 0;

// Load images
const birdImage = new Image();
birdImage.src = './IMA/pajaro.png';

const pipeImage = new Image();
pipeImage.src = './IMA/tubo.png';

// Event listeners for buttons
registerButton.addEventListener('click', () => {
    username = usernameInput.value;
    alert(`Registered as ${username}`);
});

startButton.addEventListener('click', () => {
    if (username) {
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        gameState = 'playing';
        requestAnimationFrame(gameLoop);
    } else {
        alert('Please register first');
    }
});

difficultyButton.addEventListener('click', () => {
    if (difficulty === 'easy') {
        difficulty = 'hard';
        difficultyButton.textContent = 'Difficulty: Hard';
    } else {
        difficulty = 'easy';
        difficultyButton.textContent = 'Difficulty: Easy';
    }
});

// Bird jump
document.addEventListener('keydown', () => {
    if (gameState === 'playing') {
        bird.velocity = bird.lift;
    } else if (gameState === 'over') {
        resetGame();
    }
});

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    gameState = 'start';
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
}

// Generate random multiplication problems
function generateProblem() {
    const num1 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;
    let wrongAnswer;
    do {
        wrongAnswer = Math.floor(Math.random() * 81);
    } while (wrongAnswer === correctAnswer);
    const answers = [correctAnswer, wrongAnswer].sort(() => Math.random() - 0.5);
    return { problem: `${num1} x ${num2}`, answers };
}

function drawGameOverScreen() {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over! ${username}'s Score: ${score}`, canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText('Press Any Key to Retry', canvas.width / 2, canvas.height / 2);
}

// Game loop
function gameLoop() {
    if (gameState === 'playing') {
        frameCount++;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Bird physics
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Draw bird
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

        // Generate and draw pipes with math problems
        if (frameCount % 150 === 0) {
            const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
            const problem = generateProblem();
            pipes.push({ x: canvas.width, y: pipeHeight, problem });
        }

        pipes.forEach(pipe => {
            pipe.x -= 1.5;
            ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.y);
            ctx.drawImage(pipeImage, pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);

            // Display the math problem
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText(pipe.problem.problem, pipe.x + 10, 50);
            ctx.fillText(pipe.problem.answers[0], pipe.x + 10, pipe.y + 50);
            ctx.fillText(pipe.problem.answers[1], pipe.x + 10, pipe.y + pipeGap + 50);

            // Collision detection and score increment
            if (
                bird.x < pipe.x + pipeWidth &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
            ) {
                if ((pipe.problem.answers[0] === pipe.problem.problem.split(' x ')[0] * pipe.problem.problem.split(' x ')[1] && bird.y < pipe.y) ||
                    (pipe.problem.answers[1] === pipe.problem.problem.split(' x ')[0] * pipe.problem.problem.split(' x ')[1] && bird.y > pipe.y + pipeGap)) {
                    score++;
                } else {
                    gameState = 'over';
                }
            }
        });

        // Draw score
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(`Score: ${score}`, 10, 50);

        // Ground collision
        if (bird.y + bird.height > canvas.height) {
            gameState = 'over';
        }

        // Remove offscreen pipes
        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

        requestAnimationFrame(gameLoop);
    } else if (gameState === 'over') {
        drawGameOverScreen();
    }
}

if (gameState === 'start') {
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
} else if (gameState === 'playing') {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
}
