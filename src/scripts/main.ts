import { Ball } from './Ball';
import { GameSetup } from './GameSetup';
import { Player } from './Player';

const gameSetup = new GameSetup();
const player = new Player();
const ball = new Ball();

// Handle keyboard input
const keys = {
    left: false,
    right: false,
    jump: false
};

const resizeCanvas = () => {
    gameSetup.backgroundCanvas.width = window.innerWidth;
    gameSetup.backgroundCanvas.height = window.innerHeight;
    gameSetup.objectCanvas.width = window.innerWidth;
    gameSetup.objectCanvas.height = window.innerHeight;
};

const drawStatic = () => {

};

const draw = () => {
    if (gameSetup.objectCanvasContext && gameSetup.backgroundCanvasContext && gameSetup.pole instanceof HTMLImageElement) {
        // Clear canvas before drawing
        gameSetup.objectCanvasContext.clearRect(0, 0, gameSetup.objectCanvas.width, gameSetup.objectCanvas.height);
        gameSetup.backgroundCanvasContext.clearRect(0, 0, gameSetup.backgroundCanvas.width, gameSetup.backgroundCanvas.height);

        // Set background
        gameSetup.backgroundCanvasContext.fillStyle = "skyblue";
        gameSetup.backgroundCanvasContext.fillRect(0, 0, gameSetup.backgroundCanvas.width, gameSetup.backgroundCanvas.height);

        // Player movement
        if (keys.left || keys.right) {
            if (keys.left) {
                player.x -= player.speed;
            }
            if (keys.right) {
                player.x += player.speed;
            }

        }

        // Apply gameSetup.gravity to player
        if (player.isJumping) {
            player.y += player.velocityY;
            player.velocityY += gameSetup.gravity * player.gravityMultiplier;
        }

        // Check collision between player and ball to catch it unless on cd
        if (
            player.canCatchBall && !ball.held &&
            ball.x + gameSetup.ball.naturalWidth > player.x &&
            ball.x < player.x + gameSetup.player.naturalWidth &&
            ball.y + gameSetup.ball.naturalHeight > player.y &&
            ball.y < player.y + gameSetup.player.naturalHeight
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
        if (player.x + gameSetup.player.naturalWidth > gameSetup.objectCanvas.width) {
            player.x = gameSetup.objectCanvas.width - gameSetup.player.naturalWidth;
        }
        if (player.y > gameSetup.objectCanvas.height - gameSetup.player.height) {
            player.y = gameSetup.objectCanvas.height - gameSetup.player.height;
            player.isJumping = false;
            player.lastAirDirection = null;
            player.disabledAirMovement = false;
            if (!player.canLandWithBall) { document.dispatchEvent(new KeyboardEvent("keyup", { key: " " })); }; // force shot on land, unless caught midair

        }

        if (ball.held) {
            // Hold ball in the top-right corner of the player
            ball.x = player.x + gameSetup.player.naturalWidth - gameSetup.ball.naturalWidth / 2;
            ball.y = player.y - gameSetup.ball.naturalHeight / 2;
            ball.velocityX = 0;
            ball.velocityY = 0;
        } else {
            // Ball movement with gameSetup.gravity
            ball.y += ball.velocityY;
            ball.x += ball.velocityX;
            ball.velocityY += gameSetup.gravity * ball.gravityMultiplier;
            ball.velocityX *= ball.friction;

            // Ball boundary checks
            if (ball.y + gameSetup.ball.naturalHeight > gameSetup.objectCanvas.height - gameSetup.ground.naturalHeight) {
                ball.y = gameSetup.objectCanvas.height - gameSetup.ball.naturalHeight - gameSetup.ground.naturalHeight;
                Math.abs(ball.velocityY) < ball.velocityGroundLimit ? ball.velocityY = 0 : ball.velocityY *= -ball.bounce;
            }
            if (ball.x < 0 || ball.x + gameSetup.ball.naturalWidth > gameSetup.objectCanvas.width) {
                ball.velocityX *= -1;
            }
        }

        // Draw Player
        gameSetup.objectCanvasContext.drawImage(gameSetup.player, player.x, player.y, gameSetup.player.naturalWidth, gameSetup.player.naturalHeight);

        // Draw Ball
        gameSetup.objectCanvasContext.drawImage(gameSetup.ball, ball.x, ball.y, gameSetup.ball.naturalWidth, gameSetup.ball.naturalHeight);

        // Get pole position
        const poleX = gameSetup.objectCanvas.width - gameSetup.pole.naturalWidth;
        const poleY = gameSetup.objectCanvas.height - gameSetup.pole.naturalHeight - gameSetup.ground.naturalHeight;

        // Get backboard position
        const backBoardX = poleX - gameSetup.backBoard.naturalWidth;
        const backBoardY = poleY; // Adjust if needed

        // Compute rim position
        const rimX = backBoardX - gameSetup.rim.naturalWidth;
        const rimY = backBoardY + (gameSetup.backBoard.naturalHeight * 7 / 10);

        const groundY = gameSetup.objectCanvas.height - gameSetup.ground.naturalHeight; // Floor at bottom
        for (let groundX = 0; groundX < gameSetup.objectCanvas.width; groundX += gameSetup.ground.naturalWidth) {
            gameSetup.objectCanvasContext.drawImage(gameSetup.ground, groundX, groundY, gameSetup.ground.naturalWidth, gameSetup.ground.naturalHeight);
        }

        if (
            ball.x + gameSetup.ball.naturalWidth > backBoardX &&
            ball.x < backBoardX + gameSetup.backBoard.naturalWidth &&
            ball.y + gameSetup.ball.naturalHeight > backBoardY &&
            ball.y < backBoardY + gameSetup.backBoard.naturalHeight
        ) {
            // Check if the ball is hitting the **top** of the backboard
            if (ball.y + gameSetup.ball.naturalHeight - ball.velocityY <= backBoardY) {
                // Ball landed on top, bounce vertically
                ball.velocityY *= -ball.bounce;
                ball.y = backBoardY - gameSetup.ball.naturalHeight; // Adjust position to avoid overlap
            }
            // Check if the ball is hitting the **sides** of the backboard
            else if (ball.x + gameSetup.ball.naturalWidth - ball.velocityX <= backBoardX ||
                ball.x - ball.velocityX >= backBoardX + gameSetup.backBoard.naturalWidth) {
                // Ball hit left or right, reverse X direction
                ball.velocityX *= -1;
            }
        }

        // Draw Pole
        gameSetup.objectCanvasContext.drawImage(gameSetup.pole, poleX, poleY, gameSetup.pole.naturalWidth, gameSetup.pole.naturalHeight);

        // Draw Backboard on top of the pole
        gameSetup.objectCanvasContext.drawImage(gameSetup.backBoard, backBoardX, backBoardY, gameSetup.backBoard.naturalWidth, gameSetup.backBoard.naturalHeight);
        // Draw Rim
        gameSetup.objectCanvasContext.drawImage(gameSetup.rim, rimX, rimY, gameSetup.rim.naturalWidth, gameSetup.rim.naturalHeight);

        if (gameSetup.shotMessage) {
            gameSetup.objectCanvasContext.font = "30px Arial";
            gameSetup.objectCanvasContext.fillStyle = "gold";
            gameSetup.objectCanvasContext.textAlign = "center";
            gameSetup.objectCanvasContext.fillText(gameSetup.shotMessage, player.x + gameSetup.player.naturalWidth / 2, player.y - (gameSetup.player.naturalHeight / 10));
        }

        window.requestAnimationFrame(draw);
    }
};


window.addEventListener("resize", resizeCanvas);

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
            if (shotError < 0.05) {
                gameSetup.shotMessage = "PERFECT!";
                setTimeout(() => {
                    gameSetup.shotMessage = ""; // Remove message after 1.5s
                }, 1000);
            }
            // Release ball at 45-degree angle towards the right
            ball.velocityX = shotPower;
            ball.velocityY = -shotPower;
            ball.held = false;
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


