/*  DOM Elements Reference  */
const main = document.getElementById("main");
const movingArea = document.getElementById("moving-area");
const bird = document.getElementById("bird");
const gameOver = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

let birdBottom = movingArea.offsetHeight / 2;
bird.style.bottom = `${birdBottom}px`;

const chickenSound = new Audio("../src/sound/chicken.wav");

/*  Current vertical speed  */
let velocity = 0;

/*  Gravity multiplier  */
const gravity = -0.10;

/*  Upward force  */
const jumpStrength = 5;

/*  Terminal velocity  */
const maxFallSpeed = -3; 

/*  Game State Variables  */
let score = 0;
let GameOver = false;
let columnMoveSpeed = 6;
let columnGenerationSpeed = 1000;
let columnProgress = 2000;

document.addEventListener("keydown", handleInput);



function restartGame() {
    location.reload();
}


function handleInput(e) {
    /*  Bird jump  */
    if (e.code === "Space") {
        velocity = jumpStrength;
    }
}

function updateScore() {
    score += 0.5;
    document.getElementById("score").innerText = `Score: ${score}`;
}

function birdMovementLoop() {
    velocity += gravity;
    velocity = Math.max(velocity, maxFallSpeed);

    birdBottom += velocity;


    /*  Prevent falling below ground  */
    if (birdBottom <= 0) {
        birdBottom = 0;
        velocity = 0;
    }

    bird.style.bottom = `${birdBottom}px`;

    /*  Runs every animation frame  */
    requestAnimationFrame(birdMovementLoop);
}

checkCollision();

birdMovementLoop();

// bird hit detection
function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const columns = movingArea.children;
    for (let i = 0; i < columns.length; i++) {
        const columnRect = columns[i].getBoundingClientRect();
        if (
            birdRect.left < columnRect.right &&
            birdRect.right > columnRect.left &&
            birdRect.top < columnRect.bottom &&
            birdRect.bottom > columnRect.top
        ) {
            chickenSound.play();
            if (score > localStorage.getItem("flappyChickenHighScore")) {
                localStorage.setItem("flappyChickenHighScore", score);
                gameOver.style.display = "block";
                GameOver = true;
                finalScore.innerText = `New High Score: ${score}!`;
            } else {
                gameOver.style.display = "block";
                GameOver = true;
                finalScore.innerText = `Score: ${score} \n High Score: ${localStorage.getItem("flappyChickenHighScore")}`;
            }
            return;
        }
    }
    requestAnimationFrame(checkCollision);
}

function generateColumn() {
    const randomNum = Math.floor(Math.random() * 80) + 11;
    const gapHeight = 20;

    generateTopColumn(randomNum, gapHeight);
    generateBottomColumn(randomNum, gapHeight);

    columnProgress += 300;
}

function generateTopColumn(randomNum, gapHeight) {
    const div = document.createElement("div");

    div.className = "column";
    div.style.position = "absolute";
    div.style.top = "0px";
    div.style.left = `${columnProgress}px`;
    div.style.width = "50px";
    div.style.height = `${100 - randomNum - gapHeight}vh`;
    div.style.background = "green";

    movingArea.appendChild(div);
}

function generateBottomColumn(randomNum, gapHeight) {
    const div = document.createElement("div");

    div.className = "column";
    div.style.position = "absolute";
    div.style.bottom = "0px";
    div.style.left = `${columnProgress}px`;
    div.style.width = "50px";
    div.style.height = `${randomNum - gapHeight}vh`;
    div.style.background = "green";

    movingArea.appendChild(div);
}

function moveColumns() {
    const columns = movingArea.children;

    if (GameOver === false) {
        for (let i = 0; i < columns.length; i++) {
            const currentLeft = parseInt(columns[i].style.left);
            columns[i].style.left = `${currentLeft - columnMoveSpeed}px`;
    
            if (currentLeft < -60) {
                movingArea.removeChild(columns[i]);
                i--;
            }
            if (currentLeft > bird.offsetLeft + bird.offsetWidth && currentLeft - columnMoveSpeed <= bird.offsetLeft + bird.offsetWidth) {
                updateScore();
            }
        }
    }
}

setInterval(moveColumns, 1);
setInterval(generateColumn, columnGenerationSpeed);