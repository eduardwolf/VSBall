import {
    BACKGROUND_CANVAS_ID,
    PLAYER_CANVAS_ID,
    BALL_SOURCE,
    RIM_SOURCE
} from './magicVals';

const backgroundCanvas = <HTMLCanvasElement>document.getElementById(BACKGROUND_CANVAS_ID);
const playerCanvas = <HTMLCanvasElement>document.getElementById(PLAYER_CANVAS_ID);

const backgroundCanvasContext = backgroundCanvas.getContext("2d");
const playerCanvasContext = playerCanvas.getContext("2d");


const init = () => {
    window.requestAnimationFrame(draw);
};

const draw = () => {
    if (playerCanvasContext && backgroundCanvasContext) {
        
        // Set the rectangle color
        backgroundCanvasContext.fillStyle = "black";
        playerCanvasContext.fillStyle = "red";

        // Define rectangle dimensions
        const rectWidth = 15;
        const rectHeight = 30;
        const x = (playerCanvas.width - rectWidth) / 2;
        const y = playerCanvas.height - rectHeight;

        // Draw the rectangle
        backgroundCanvasContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        playerCanvasContext.fillRect(x, y, rectWidth, rectHeight);

        // Loop the animation
        window.requestAnimationFrame(draw);
    }else{
        console.error("Canvas not found");
    }
};

init();