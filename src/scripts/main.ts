import {
    BACKGROUND_CANVAS_ID,
    PLAYER_CANVAS_ID,
    PLAYER_ID,
    BALL_ID,
    RIM_ID,
    BACKBOARD_ID,
    POLE_ID,
    RIM_DISTANCE_FROM_WALL,
    GROUND_ID,
} from './magicVals';

// Get canvas elements and their contexts
const backgroundCanvas = <HTMLCanvasElement>document.getElementById(BACKGROUND_CANVAS_ID);
const playerCanvas = <HTMLCanvasElement>document.getElementById(PLAYER_CANVAS_ID);
const backgroundCanvasContext = backgroundCanvas.getContext("2d");
const playerCanvasContext = playerCanvas.getContext("2d");
const playerElement = <HTMLImageElement>document.getElementById(PLAYER_ID);
const ballElement = <HTMLImageElement>document.getElementById(BALL_ID);
const rimElement = <HTMLImageElement>document.getElementById(RIM_ID);
const backBoardElement = <HTMLImageElement>document.getElementById(BACKBOARD_ID);
const poleElement = <HTMLImageElement>document.getElementById(POLE_ID);
const groundElement = <HTMLImageElement>document.getElementById(GROUND_ID);

let preventInit = false;

// TODO: change to classes
let gravity = 0.1;
let shotMessage = "";
// Player properties
let playerX = 100;
let playerY = playerCanvas.height - playerElement.height;
let playerSpeed = 3;
let playerVelocityY = 0;
let playerIsJumping = true;
let playerCanJump = true;
let playerJumpForce = 5;
let playerGravityMultiplier = 1.5;
let playerLastAirDirection: "left" | "right" | null = null;
let playerDisabledAirMovement = false;
let playerCanCatchBall = true;
const playerMaxShotPower = 7; // Max power when releasing at peak 
const playerMinShotPower = 1;
let playerCanLandWithBall = false;


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
        } else if (!playerDisabledAirMovement) {
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
        } else if (!playerDisabledAirMovement) {
            if (playerLastAirDirection === null) {
                playerLastAirDirection = "right";
                keys.right = true;

            } else if (playerLastAirDirection === "right") {
                keys.right = true;
            }
        }
    }
    if (event.key === " " && !playerIsJumping && playerCanJump) {
        if (keys.right) {
            playerLastAirDirection = "right";
        } else if (keys.left) {
            playerLastAirDirection = "left";
        }
        keys.jump = true;
        playerIsJumping = true;
        playerVelocityY = - playerJumpForce; // Initial jump force ( when Y is zero, player is at the top of canvas, that's why it's negative )
        playerCanJump = false;

        if (ballHeld) {
            playerCanLandWithBall = false;
        }
    }


});

document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "A") {
        keys.left = false;
        if (playerIsJumping && playerLastAirDirection === "left") {
            playerDisabledAirMovement = true;
        }
    }
    if (event.key === "d" || event.key === "D") {
        keys.right = false;
        if (playerIsJumping && playerLastAirDirection === "right") {
            playerDisabledAirMovement = true;
        }
    }
    if (event.key === " ") {
        keys.jump = false;
        playerCanJump = true;
        if (ballHeld){
            const shotError = Math.abs(playerVelocityY) / playerJumpForce > 1 ? 1 : Math.abs(playerVelocityY) / playerJumpForce; // 1 is max error 
            const shotPower = Math.max(playerMinShotPower , playerMaxShotPower - (playerMaxShotPower * shotError));
            if (shotError < 0.05) {
                shotMessage = "PERFECT!";
                setTimeout(() => {
                    shotMessage = ""; // Remove message after 1.5s
                }, 1000);
            }            
            // Release ball at 45-degree angle towards the right
            ballVelocityX = shotPower;
            ballVelocityY = -shotPower;
            ballHeld = false;
            playerCanCatchBall = false; // to ensure it doesnt get stuck
            setTimeout(() => {
                playerCanCatchBall = true;
            }, 500);
        }
    }
});

const init = () => {
    window.requestAnimationFrame(draw);
    // TODO: draw static stuff so it doesn't get redrawn every frame
};

const draw = () => {
    if (playerCanvasContext && backgroundCanvasContext && poleElement instanceof HTMLImageElement) {
        // Clear canvas before drawing
        playerCanvasContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        backgroundCanvasContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Set background
        backgroundCanvasContext.fillStyle = "skyblue";
        backgroundCanvasContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Player movement
        if (keys.left || keys.right){
            if (keys.left) { 
                playerX -= playerSpeed; 
            }
            if (keys.right) { 
                playerX += playerSpeed;
            }
            
        }

        // Apply gravity to player
        if(playerIsJumping){
            playerY += playerVelocityY;
            playerVelocityY += gravity * playerGravityMultiplier;
        }

        // Check collision between player and ball to catch it unless on cd
        if (
            playerCanCatchBall && !ballHeld &&
            ballX + ballElement.naturalWidth > playerX &&
            ballX < playerX + playerElement.naturalWidth &&
            ballY + ballElement.naturalHeight > playerY &&
            ballY < playerY + playerElement.naturalHeight
        ) {
            if (playerIsJumping){
                playerCanLandWithBall = true;
            }else{
                playerCanLandWithBall = false;
            }
            ballHeld = true;
            
        }
        // Prevent player from leaving the canvas
        if (playerX < 0) { playerX = 0; }
        if (playerX + playerElement.naturalWidth > playerCanvas.width) {
            playerX = playerCanvas.width - playerElement.naturalWidth;
        }
        if (playerY > playerCanvas.height - playerElement.height) {
            playerY = playerCanvas.height - playerElement.height;
            playerIsJumping = false;
            playerLastAirDirection = null;
            playerDisabledAirMovement = false;
            if(!playerCanLandWithBall){document.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));}; // force shot on land, unless caught midair

        }

        if (ballHeld) {
            // Hold ball in the top-right corner of the player
            ballX = playerX + playerElement.naturalWidth - ballElement.naturalWidth / 2;
            ballY = playerY - ballElement.naturalHeight / 2;
            ballVelocityX = 0;
            ballVelocityY = 0;
        } else {
            // Ball movement with gravity
            ballY += ballVelocityY;
            ballX += ballVelocityX;
            ballVelocityY += gravity * ballGravityMultiplier;
            ballVelocityX *= ballFriction;

            // Ball boundary checks
            if (ballY + ballElement.naturalHeight > playerCanvas.height - groundElement.naturalHeight) {
                ballY = playerCanvas.height - ballElement.naturalHeight - groundElement.naturalHeight;
                Math.abs(ballVelocityY) < ballVelocityGroundLimit ? ballVelocityY = 0 : ballVelocityY *= -ballBounce;
            }
            if (ballX < 0 || ballX + ballElement.naturalWidth > playerCanvas.width) {
                ballVelocityX *= -1;
            }
        }

        // Draw Player
        playerCanvasContext.drawImage(playerElement, playerX, playerY, playerElement.naturalWidth, playerElement.naturalHeight);

        // Draw Ball
        playerCanvasContext.drawImage(ballElement, ballX, ballY, ballElement.naturalWidth, ballElement.naturalHeight);

        // Get pole position
        const poleX = playerCanvas.width - poleElement.naturalWidth - RIM_DISTANCE_FROM_WALL;
        const poleY = playerCanvas.height - poleElement.naturalHeight - groundElement.naturalHeight;

        // Get backboard position
        const backBoardX = poleX  - backBoardElement.naturalWidth;
        const backBoardY = poleY; // Adjust if needed

        // Compute rim position
        const rimX = backBoardX - rimElement.naturalWidth;
        const rimY = backBoardY + (backBoardElement.naturalHeight * 7 / 10);

        const groundY = playerCanvas.height - groundElement.naturalHeight; // Floor at bottom
        for (let groundX = 0; groundX < playerCanvas.width; groundX += groundElement.naturalWidth) {
            playerCanvasContext.drawImage(groundElement, groundX, groundY, groundElement.naturalWidth, groundElement.naturalHeight);
        }

        // TODO: test this block
        if (
            ballX + ballElement.naturalWidth > backBoardX &&
            ballX < backBoardX + backBoardElement.naturalWidth &&
            ballY + ballElement.naturalHeight > backBoardY &&
            ballY < backBoardY + backBoardElement.naturalHeight
        ) {
            // Check if the ball is hitting the **top** of the backboard
            if (ballY + ballElement.naturalHeight - ballVelocityY <= backBoardY) {
                // Ball landed on top, bounce vertically
                ballVelocityY *= -ballBounce;
                ballY = backBoardY - ballElement.naturalHeight; // Adjust position to avoid overlap
            }
            // Check if the ball is hitting the **sides** of the backboard
            else if (ballX + ballElement.naturalWidth - ballVelocityX <= backBoardX || 
                     ballX - ballVelocityX >= backBoardX + backBoardElement.naturalWidth) {
                // Ball hit left or right, reverse X direction
                ballVelocityX *= -1;
            }
        }

        // Draw Pole
        playerCanvasContext.drawImage(poleElement, poleX, poleY, poleElement.naturalWidth, poleElement.naturalHeight);

        // Draw Backboard on top of the pole
        playerCanvasContext.drawImage(backBoardElement, backBoardX, backBoardY, backBoardElement.naturalWidth, backBoardElement.naturalHeight);
        // Draw Rim
        playerCanvasContext.drawImage(rimElement, rimX, rimY, rimElement.naturalWidth, rimElement.naturalHeight);

        if (shotMessage) {
            playerCanvasContext.font = "30px Arial";
            playerCanvasContext.fillStyle = "gold";
            playerCanvasContext.textAlign = "center";
            playerCanvasContext.fillText(shotMessage, playerX + playerElement.naturalWidth / 2, playerY - (playerElement.naturalHeight / 10));
        }

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