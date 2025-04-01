import {
    BACKGROUND_CANVAS_ID,
    PLAYER_CANVAS_ID,
    PLAYER_ID,
    BALL_ID,
    RIM_ID,
    BACKBOARD_ID
} from './magicVals';

// Get canvas elements and their contexts
const backgroundCanvas = <HTMLCanvasElement>document.getElementById(BACKGROUND_CANVAS_ID);
const playerCanvas = <HTMLCanvasElement>document.getElementById(PLAYER_CANVAS_ID);
const backgroundCanvasContext = backgroundCanvas.getContext("2d");
const playerCanvasContext = playerCanvas.getContext("2d");

// Instantiate images that draw the svgs and get their elements
const playerImage = new Image();
const ballImage = new Image();
const rimImage = new Image();
const backBoardImage = new Image();
const playerElement = document.getElementById(PLAYER_ID);
const ballElement = document.getElementById(BALL_ID);
const rimElement = document.getElementById(RIM_ID);
const backBoardElement = document.getElementById(BACKBOARD_ID);


let preventInit = false;

// Set the image source to the element's
if (playerElement instanceof HTMLImageElement && ballElement instanceof HTMLImageElement && rimElement instanceof HTMLImageElement && backBoardElement instanceof HTMLImageElement) {
    playerImage.src = playerElement.src;
    ballImage.src = ballElement.src;
    rimImage.src = rimElement.src;
    backBoardImage.src = backBoardElement.src;

} else {
    preventInit = true;
    console.error("Missing Image element");
}

// Player properties
let playerX = 100;
let playerY = playerCanvas.height - playerImage.height;
let playerSpeed = 5;
let playerVelocityY = 0;
let gravity = 0.5;
let isJumping = false;

let ballX = playerCanvas.width * 0.5;
let ballY = 0;
let ballVelocityX = 2;
let ballVelocityY = 0;
let ballBounce = 0.7;
let ballFriction = 0.99;
let ballVelocityGroundLimit = 3;

// Handle keyboard input
const keys = {
    left: false,
    right: false,
    jump: false
};

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A") { keys.left = true; }
    if (event.key === "d" || event.key === "D") { keys.right = true; }
    if (event.key === " " && !isJumping) {
        keys.jump = true;
        isJumping = true;
        playerVelocityY = -10; // Initial jump force ( when Y is zero, player is at the top of canvas, that's why it's negative )
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "A") { keys.left = false; }
    if (event.key === "d" || event.key === "D") { keys.right = false; }
});

const init = () => {
    window.requestAnimationFrame(draw);
};

const draw = () => {
    if (playerCanvasContext && backgroundCanvasContext) {


        // Clear canvas before drawing
        playerCanvasContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        backgroundCanvasContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Set bg
        backgroundCanvasContext.fillStyle = "lightgreen";
        backgroundCanvasContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Player movement
        if (keys.left) { playerX -= playerSpeed; }
        if (keys.right) { playerX += playerSpeed; }

        // Apply gravity to player
        playerY += playerVelocityY;
        playerVelocityY += gravity;

        // Prevent player from leaving the canvas
        if (playerX < 0) { playerX = 0; }
        if (playerX + playerImage.naturalWidth > playerCanvas.width) { playerX = playerCanvas.width - playerImage.naturalWidth; }
        if (playerY > playerCanvas.height - playerImage.height) {
            playerY = playerCanvas.height - playerImage.height;
            isJumping = false;
        }

        // Ball movement
        ballY += ballVelocityY;
        ballX += ballVelocityX;
        ballVelocityY += gravity;
        ballVelocityX *= ballFriction;

        // Prevent ball from leaving the canvas
        if (ballY + ballImage.naturalHeight > playerCanvas.height) {
            ballY = playerCanvas.height - ballImage.naturalHeight;
            Math.abs(ballVelocityY) < ballVelocityGroundLimit ? ballVelocityY = 0 : ballVelocityY *= -ballBounce; // Ground ball
        }
        if (ballX < 0 || ballX + ballImage.naturalWidth > playerCanvas.width) {
            ballVelocityX *= -1;
        }

        // Get backboard position
        const backBoardX = playerCanvas.width - backBoardImage.naturalWidth;
        const backBoardY = playerCanvas.height - backBoardImage.naturalHeight;

        // Compute rim position
        const rimX = backBoardX - rimImage.naturalWidth / 2 + (backBoardImage.naturalWidth - rimImage.naturalWidth) / 2;
        const rimY = backBoardY + (backBoardImage.naturalHeight * 1 / 5);

        // Draw Player
        playerCanvasContext.drawImage(playerImage, playerX, playerY, playerImage.naturalWidth, playerImage.naturalHeight);

        // Draw Ball
        playerCanvasContext.drawImage(
            ballImage,
            ballX,
            ballY,
            ballImage.naturalWidth,
            ballImage.naturalHeight
        );
        // Draw Backboard
        playerCanvasContext.drawImage(
            backBoardImage,
            backBoardX,
            backBoardY,
            backBoardImage.naturalWidth,
            backBoardImage.naturalHeight
        );
        // Draw rim
        playerCanvasContext.drawImage(
            rimImage,
            rimX,
            rimY,
            rimImage.naturalWidth,
            rimImage.naturalHeight
        );

        window.requestAnimationFrame(draw);
    }
};

const resizeCanvas = () => {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    playerCanvas.width = window.innerWidth;
    playerCanvas.height = window.innerHeight;
};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

preventInit ? console.error("Failed to initialize VSBall") : init();