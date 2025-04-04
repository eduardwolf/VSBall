import { GameSetup } from './classes/GameSetup';

/*
  - Initializes GameSetup class which includes all necessary properties, including game objects, canvas contexts, and other game info
  - Draws static objects on initialization and window resize
  - Draws dynamic objects each frame
  - Listens for player movement events and calculates positions of the player and the ball accordingly
*/
let dribbleOffset = 0;
let dribbleDirection = 1; // 1 for downward, -1 for upward
const dribbleSpeed = 1; // Speed of dribbling movement
let runningFrame = 0;
let lastRunningFrameTime = performance.now();
const runningFrameInterval = 250; // ms between frames



const gameSetup = new GameSetup();
const player = gameSetup.player;
const ball = gameSetup.ball;

// Handle keyboard input
const keys = {
    left: false,
    right: false,
    jump: false
};

const resizeCanvas = () => {
    gameSetup.staticCanvas.width = window.innerWidth;
    gameSetup.staticCanvas.height = window.innerHeight;
    gameSetup.dynamicCanvas.width = window.innerWidth;
    gameSetup.dynamicCanvas.height = window.innerHeight;
};

// Draws static objects on initialization and window resize
const drawStatic = () => {
    gameSetup.staticCanvasContext.clearRect(0, 0, gameSetup.staticCanvas.width, gameSetup.staticCanvas.height);
    gameSetup.staticCanvasContext.fillStyle = "skyblue";
    gameSetup.staticCanvasContext.fillRect(0, 0, gameSetup.staticCanvas.width, gameSetup.staticCanvas.height);

    gameSetup.ground.y = gameSetup.staticCanvas.height - gameSetup.ground.image.naturalHeight;
    for (let groundX = 0; groundX < gameSetup.staticCanvas.width; groundX += gameSetup.ground.image.naturalWidth) {
        gameSetup.staticCanvasContext.drawImage(gameSetup.ground.image, groundX, gameSetup.ground.y, gameSetup.ground.image.naturalWidth, gameSetup.ground.image.naturalHeight);
    }

    gameSetup.pole.x = gameSetup.staticCanvas.width - gameSetup.pole.image.naturalWidth;
    gameSetup.pole.y = gameSetup.staticCanvas.height - gameSetup.pole.image.naturalHeight - gameSetup.ground.image.naturalHeight;
    gameSetup.staticCanvasContext.drawImage(gameSetup.pole.image, gameSetup.pole.x, gameSetup.pole.y, gameSetup.pole.image.naturalWidth, gameSetup.pole.image.naturalHeight);

    gameSetup.backBoard.x = gameSetup.pole.x - gameSetup.backBoard.image.naturalWidth;
    gameSetup.backBoard.y = gameSetup.pole.y;
    gameSetup.staticCanvasContext.drawImage(gameSetup.backBoard.image, gameSetup.backBoard.x, gameSetup.backBoard.y, gameSetup.backBoard.image.naturalWidth, gameSetup.backBoard.image.naturalHeight);

    gameSetup.rim.x = gameSetup.backBoard.x - gameSetup.rim.image.naturalWidth;
    gameSetup.rim.y = gameSetup.backBoard.y + (gameSetup.backBoard.image.naturalHeight * 7 / 10);
    gameSetup.staticCanvasContext.drawImage(gameSetup.rim.image, gameSetup.rim.x, gameSetup.rim.y, gameSetup.rim.image.naturalWidth, gameSetup.rim.image.naturalHeight);

};

// Draws dynamic objects each frame
const draw = () => {
    gameSetup.dynamicCanvasContext.clearRect(0, 0, gameSetup.dynamicCanvas.width, gameSetup.dynamicCanvas.height);

    // Player movement
    if (keys.left || keys.right) {
        if (keys.left) {
            player.x -= player.speed;
        }
        if (keys.right) {
            player.x += player.speed;
        }

    }

    // Apply gravity to player
    if (player.isJumping) {
        player.y += player.velocityY;
        player.velocityY += gameSetup.gravity * player.gravityMultiplier;
    }

    // Check collision between player and ball to catch it unless on cd
    if (
        player.canCatchBall && !ball.held &&
        ball.x + gameSetup.ball.image.naturalWidth > player.x &&
        ball.x < player.x + gameSetup.player.image.naturalWidth &&
        ball.y + gameSetup.ball.image.naturalHeight > player.y &&
        ball.y < player.y + gameSetup.player.image.naturalHeight
    ) {
        if (player.isJumping) {
            player.canLandWithBall = true;
        } else {
            player.canLandWithBall = false;
        }
        ball.held = true;

    }

    // Prevent player from leaving the canvas
    if (player.x < 0) { player.x = 0; }
    if (player.x + gameSetup.player.image.naturalWidth > gameSetup.dynamicCanvas.width) {
        player.x = gameSetup.dynamicCanvas.width - gameSetup.player.image.naturalWidth;
    }
    if (player.y > gameSetup.dynamicCanvas.height - gameSetup.player.image.naturalHeight - gameSetup.ground.image.naturalHeight) {
        player.y = gameSetup.dynamicCanvas.height - gameSetup.player.image.naturalHeight - gameSetup.ground.image.naturalHeight;
        player.isJumping = false;
        player.lastAirDirection = null;
        player.disabledAirMovement = false;
        if (!player.canLandWithBall) { document.dispatchEvent(new KeyboardEvent("keyup", { key: " " })); }; // force shot on land, unless caught midair
    }

    if (ball.held) {
        if (!player.isJumping) {
            dribbleOffset += dribbleDirection * dribbleSpeed;

            // Reverse direction at max dribble height
            if (Math.abs(dribbleOffset) >= player.image.naturalHeight / 3) {
                dribbleDirection *= -1;
            }

            // Adjust ball position
            ball.y = player.y + player.image.naturalHeight / 2 + dribbleOffset - ball.image.naturalHeight / 3;

        } else {
            dribbleOffset = 0;
            // Hold ball in the top-right corner of the player
            ball.y = player.y - gameSetup.ball.image.naturalHeight / 2;

        }
        ball.x = player.x + gameSetup.player.image.naturalWidth - gameSetup.ball.image.naturalWidth / 2;
        ball.velocityX = 0;
        ball.velocityY = 0;

    } else {
        // Ball movement with gameSetup.gravity
        ball.y += ball.velocityY;
        ball.x += ball.velocityX;
        ball.velocityY += gameSetup.gravity * ball.gravityMultiplier;
        ball.velocityX *= ball.friction;

        // Ball boundary checks
        if (ball.y + gameSetup.ball.image.naturalHeight > gameSetup.dynamicCanvas.height - gameSetup.ground.image.naturalHeight) {
            ball.y = gameSetup.dynamicCanvas.height - gameSetup.ball.image.naturalHeight - gameSetup.ground.image.naturalHeight;
            Math.abs(ball.velocityY) < ball.velocityGroundLimit ? ball.velocityY = 0 : ball.velocityY *= -ball.bounce;
            if (ball.isMidShot) {
                ball.isMidShot = false;
                gameSetup.score = 0;
            }
        }
        if (ball.x < 0 || ball.x + gameSetup.ball.image.naturalWidth > gameSetup.dynamicCanvas.width) {
            ball.velocityX *= -1;
        }
    }

    // Ball vs backboard collision
    if (
        ball.x + gameSetup.ball.image.naturalWidth > gameSetup.backBoard.x &&
        ball.x < gameSetup.backBoard.x + gameSetup.backBoard.image.naturalWidth &&
        ball.y + gameSetup.ball.image.naturalHeight > gameSetup.backBoard.y &&
        ball.y < gameSetup.backBoard.y + gameSetup.backBoard.image.naturalHeight
    ) {
        // Check if the ball is hitting the top of the backboard
        if (ball.y + gameSetup.ball.image.naturalHeight - ball.velocityY <= gameSetup.backBoard.y) {
            // Ball landed on top, bounce vertically
            ball.velocityY *= -ball.bounce;
            ball.y = gameSetup.backBoard.y - gameSetup.ball.image.naturalHeight; // Adjust position to avoid overlap
        }
        // Check if the ball is hitting the sides of the backboard
        else if (ball.x + gameSetup.ball.image.naturalWidth - ball.velocityX <= gameSetup.backBoard.x ||
            ball.x - ball.velocityX >= gameSetup.backBoard.x + gameSetup.backBoard.image.naturalWidth) {
            // Ball hit left or right, reverse X direction
            ball.velocityX *= -1;
        }
    }
    // Ball vs rim collission
    if (
        ball.x + gameSetup.ball.image.naturalWidth > gameSetup.rim.x &&
        ball.x < gameSetup.rim.x + gameSetup.rim.image.naturalWidth &&
        ball.y + gameSetup.ball.image.naturalHeight > gameSetup.rim.y &&
        ball.y < gameSetup.rim.y + gameSetup.rim.image.naturalHeight
    ) {
        // Check if the ball is hitting the top of the rim
        if (ball.y + gameSetup.ball.image.naturalHeight - ball.velocityY <= gameSetup.rim.y) {
            console.log("score");
            if (ball.isMidShot) {
                gameSetup.score += 1;
                ball.isMidShot = false;
            }
        }
        // Check if the ball is hitting the left side of the rim
        else if (ball.x + gameSetup.ball.image.naturalWidth - ball.velocityX <= gameSetup.rim.x) {
            ball.velocityX *= -1; // Reverse x direction
        }
    }
    // Perfect shot message
    /*
    if (gameSetup.shotMessage) {
        gameSetup.dynamicCanvasContext.font = "30px Arial";
        gameSetup.dynamicCanvasContext.fillStyle = "gold";
        gameSetup.dynamicCanvasContext.textAlign = "center";
        gameSetup.dynamicCanvasContext.fillText(gameSetup.shotMessage, player.x + gameSetup.player.image.naturalWidth / 2, player.y - (gameSetup.player.image.naturalHeight / 10));
    }*/

    // Draw Player
    let playerImg;
    if ((keys.left || keys.right) && !player.isJumping) {
        const currentTime = performance.now();
        if (currentTime - lastRunningFrameTime >= runningFrameInterval) {
            runningFrame = (runningFrame + 1) % 2;
            lastRunningFrameTime = currentTime;
        }
        playerImg = runningFrame === 0 ? player.runningImage1 : player.runningImage2;
    } else {
        runningFrame = 0;
        lastRunningFrameTime = performance.now();
        playerImg = player.isJumping ? gameSetup.player.shootingImage : player.image;
    }
    gameSetup.dynamicCanvasContext.drawImage(playerImg, player.x, player.y, playerImg.naturalWidth, playerImg.naturalHeight);
    // Draw Ball
    gameSetup.dynamicCanvasContext.drawImage(ball.image, ball.x, ball.y, gameSetup.ball.image.naturalWidth, gameSetup.ball.image.naturalHeight);

    // Display score
    gameSetup.dynamicCanvasContext.font = `${gameSetup.dynamicCanvas.width / 40 + gameSetup.dynamicCanvas.height / 40 + gameSetup.score * 1}px Arial`; // Scale font size dynamically
    gameSetup.dynamicCanvasContext.fillStyle = "black";
    gameSetup.dynamicCanvasContext.textAlign = "center";
    gameSetup.dynamicCanvasContext.fillText(`Score: ${gameSetup.score}`, gameSetup.dynamicCanvas.width / 2, gameSetup.dynamicCanvas.height / 10);
    window.requestAnimationFrame(draw); // Loop per frame
};

window.addEventListener("resize", () => {
    resizeCanvas();
    drawStatic();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A") {
        if (!player.isJumping) {
            keys.left = true;
        } else if (!player.disabledAirMovement) {
            if (player.lastAirDirection === null) {
                player.lastAirDirection = "left";
                keys.left = true;
            } else if (player.lastAirDirection === "left") {
                keys.left = true;
            }
        }
    }
    if (event.key === "d" || event.key === "D") {
        if (!player.isJumping) {
            keys.right = true;
        } else if (!player.disabledAirMovement) {
            if (player.lastAirDirection === null) {
                player.lastAirDirection = "right";
                keys.right = true;

            } else if (player.lastAirDirection === "right") {
                keys.right = true;
            }
        }
    }
    if (event.key === " " && !player.isJumping && player.canJump) {
        if (keys.right) {
            player.lastAirDirection = "right";
        } else if (keys.left) {
            player.lastAirDirection = "left";
        }
        keys.jump = true;
        player.isJumping = true;
        player.velocityY = - player.jumpForce; // Initial jump force ( when Y is zero, player is at the top of canvas, that's why it's negative )
        player.canJump = false;

        if (ball.held) {
            player.canLandWithBall = false;
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "A") {
        keys.left = false;
        if (player.isJumping && player.lastAirDirection === "left") {
            player.disabledAirMovement = true;
        }
    }
    if (event.key === "d" || event.key === "D") {
        keys.right = false;
        if (player.isJumping && player.lastAirDirection === "right") {
            player.disabledAirMovement = true;
        }
    }
    if (event.key === " ") {
        keys.jump = false;
        player.canJump = true;
        if (ball.held) {
            const shotError = Math.abs(player.velocityY) / player.jumpForce > 1 ? 1 : Math.abs(player.velocityY) / player.jumpForce; // 1 is max error 
            const shotPower = Math.max(player.minShotPower, player.maxShotPower - (player.maxShotPower * shotError));
            /*if (shotError < 0.05) {
                gameSetup.shotMessage = "PERFECT!";
                setTimeout(() => {
                    gameSetup.shotMessage = ""; // Remove message after 1.5s
                }, 1000);
            }*/

            // Release ball at 45-degree angle towards the right
            ball.velocityX = shotPower;
            ball.velocityY = -shotPower;
            ball.held = false;
            ball.isMidShot = true;
            player.canCatchBall = false; // to ensure it doesnt get stuck
            setTimeout(() => {
                player.canCatchBall = true;
            }, 500);
        }
    }
});


resizeCanvas(); // Initial canvas resize
drawStatic(); // Draw static objects
window.requestAnimationFrame(draw); // Redraw per frame