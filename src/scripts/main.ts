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


let gravity = 0.1;
// Player properties
let playerX = 100;
let playerY = playerCanvas.height - playerImage.height;
let playerSpeed = 3;
let playerVelocityY = 0;
let playerIsJumping = false;
let playerJumpForce = 5;
let playerGravityMultiplier = 2;
let playerLastAirDirection: "left" | "right" | null = null;
let playerDisabledAirMovement = false;
// Ball properties
let ballX = playerCanvas.width * 0.5;
let ballY = 0;
let ballVelocityX = 2;
let ballVelocityY = 0;
let ballBounce = 0.7;
let ballFriction = 0.99;
let ballVelocityGroundLimit = 3;
let ballHeld = false;
let ballGravityMultiplier = 1;

// Handle keyboard input
const keys = {
    left: false,
    right: false,
    jump: false
};

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A") {
        if (!playerIsJumping) {
            keys.left = true;
        } else  if(!playerDisabledAirMovement){
            if (playerLastAirDirection === null) {
                playerLastAirDirection = "left";
                keys.left = true;
            } else if (playerLastAirDirection === "left") {
                keys.left = true;
            }
        }
    }
    if (event.key === "d" || event.key === "D") {
        if (!playerIsJumping) {
            keys.right = true;
        } else if(!playerDisabledAirMovement){
            if (playerLastAirDirection === null) {
                playerLastAirDirection = "right";
                keys.right = true;

            } else if (playerLastAirDirection === "right") {
                keys.right = true;
            }
        }
    }
    if (event.key === " " && !playerIsJumping) {
        if (keys.right) {
            playerLastAirDirection = "right";
        } else if (keys.left) {
            playerLastAirDirection = "left";
        }
        keys.jump = true;
        playerIsJumping = true;
        playerVelocityY = - playerJumpForce; // Initial jump force ( when Y is zero, player is at the top of canvas, that's why it's negative )
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "A") { 
        keys.left = false; 
        if (playerIsJumping && playerLastAirDirection === "left"){
            playerDisabledAirMovement = true;
        }
    }
    if (event.key === "d" || event.key === "D") { 
        keys.right = false; 
        if (playerIsJumping && playerLastAirDirection === "right"){
            playerDisabledAirMovement = true;
        }
    }
});

const init = () => {
    window.requestAnimationFrame(draw);
};

const draw = () => {
    if (playerCanvasContext && backgroundCanvasContext) {
        // Clear canvas before drawing
        playerCanvasContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        backgroundCanvasContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Set background
        backgroundCanvasContext.fillStyle = "lightgreen";
        backgroundCanvasContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Player movement

        if (keys.left) { playerX -= playerSpeed; }
        if (keys.right) { playerX += playerSpeed; }

        // Apply gravity to player
        playerY += playerVelocityY;
        playerVelocityY += gravity * playerGravityMultiplier;

        // Prevent player from leaving the canvas
        if (playerX < 0) { playerX = 0; }
        if (playerX + playerImage.naturalWidth > playerCanvas.width) {
            playerX = playerCanvas.width - playerImage.naturalWidth;
        }
        if (playerY > playerCanvas.height - playerImage.height) {
            playerY = playerCanvas.height - playerImage.height;
            playerIsJumping = false;
            playerLastAirDirection = null;
            playerDisabledAirMovement = false;

            
        }

        // Check collision between player and ball
        if (
            ballX + ballImage.naturalWidth > playerX &&
            ballX < playerX + playerImage.naturalWidth &&
            ballY + ballImage.naturalHeight > playerY &&
            ballY < playerY + playerImage.naturalHeight
        ) {
            ballHeld = true;
        }

        if (ballHeld) {
            // Hold ball in the top-right corner of the player
            ballX = playerX + playerImage.naturalWidth - ballImage.naturalWidth / 2;
            ballY = playerY - ballImage.naturalHeight / 2;
            ballVelocityX = 0;
            ballVelocityY = 0;
        } else {
            // Ball movement with gravity
            ballY += ballVelocityY;
            ballX += ballVelocityX;
            ballVelocityY += gravity * ballGravityMultiplier;
            ballVelocityX *= ballFriction;

            // Ball boundary checks
            if (ballY + ballImage.naturalHeight > playerCanvas.height) {
                ballY = playerCanvas.height - ballImage.naturalHeight;
                Math.abs(ballVelocityY) < ballVelocityGroundLimit ? ballVelocityY = 0 : ballVelocityY *= -ballBounce;
            }
            if (ballX < 0 || ballX + ballImage.naturalWidth > playerCanvas.width) {
                ballVelocityX *= -1;
            }
        }

        // Draw Player
        playerCanvasContext.drawImage(playerImage, playerX, playerY, playerImage.naturalWidth, playerImage.naturalHeight);

        // Draw Ball
        playerCanvasContext.drawImage(ballImage, ballX, ballY, ballImage.naturalWidth, ballImage.naturalHeight);

        // Get backboard position
        const backBoardX = playerCanvas.width - backBoardImage.naturalWidth;
        const backBoardY = playerCanvas.height - backBoardImage.naturalHeight;

        // Compute rim position
        const rimX = backBoardX - rimImage.naturalWidth / 2 + (backBoardImage.naturalWidth - rimImage.naturalWidth) / 2;
        const rimY = backBoardY + (backBoardImage.naturalHeight * 1 / 5);

        // Draw Backboard
        playerCanvasContext.drawImage(backBoardImage, backBoardX, backBoardY, backBoardImage.naturalWidth, backBoardImage.naturalHeight);

        // Draw Rim
        playerCanvasContext.drawImage(rimImage, rimX, rimY, rimImage.naturalWidth, rimImage.naturalHeight);

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