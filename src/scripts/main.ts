import {
    BACKGROUND_CANVAS_ID,
    PLAYER_CANVAS_ID,
    PLAYER_ID,
    BALL_ID,
    RIM_ID
} from './magicVals';

const backgroundCanvas = <HTMLCanvasElement>document.getElementById(BACKGROUND_CANVAS_ID);
const playerCanvas = <HTMLCanvasElement>document.getElementById(PLAYER_CANVAS_ID);

const backgroundCanvasContext = backgroundCanvas.getContext("2d");
const playerCanvasContext = playerCanvas.getContext("2d");

const playerImage = new Image();
const ballImage = new Image();
const rimImage = new Image();

const playerElement = document.getElementById(PLAYER_ID);
const ballElement = document.getElementById(BALL_ID);
const rimElement = document.getElementById(RIM_ID);

if (playerElement instanceof HTMLImageElement && ballElement instanceof HTMLImageElement && rimElement instanceof HTMLImageElement) {
    playerImage.src = playerElement.src;
    ballImage.src = ballElement.src;
    rimImage.src = rimElement.src;
} else {
    console.error("Missing Image element");
}

const init = () => {
    window.requestAnimationFrame(draw);
};

const draw = () => {
    if (playerCanvasContext && backgroundCanvasContext) {

         // Clear canvas before drawing
         playerCanvasContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
         backgroundCanvasContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
         
        // Set bg
        backgroundCanvasContext.fillStyle = "black";
        backgroundCanvasContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);


         //TODO: draw images in their native size
 

        window.requestAnimationFrame(draw);
    }
};

init();