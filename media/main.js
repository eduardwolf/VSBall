/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RIM_ID = exports.RIM_SOURCE = exports.BALL_ID = exports.BALL_SOURCE = exports.PLAYER_ID = exports.PLAYER_SOURCE = exports.PLAYER_CANVAS_ID = exports.BACKGROUND_CANVAS_ID = void 0;
exports.BACKGROUND_CANVAS_ID = 'backgroundCanvas';
exports.PLAYER_CANVAS_ID = 'playerCanvas';
exports.PLAYER_SOURCE = 'playerSprite.svg';
exports.PLAYER_ID = 'playerSprite';
exports.BALL_SOURCE = 'ballSprite.svg';
exports.BALL_ID = 'ballSprite';
exports.RIM_SOURCE = 'rimSprite.svg';
exports.RIM_ID = 'rimSprite';


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const magicVals_1 = __webpack_require__(1);
const backgroundCanvas = document.getElementById(magicVals_1.BACKGROUND_CANVAS_ID);
const playerCanvas = document.getElementById(magicVals_1.PLAYER_CANVAS_ID);
const backgroundCanvasContext = backgroundCanvas.getContext("2d");
const playerCanvasContext = playerCanvas.getContext("2d");
const playerImage = new Image();
const ballImage = new Image();
const rimImage = new Image();
const playerElement = document.getElementById(magicVals_1.PLAYER_ID);
const ballElement = document.getElementById(magicVals_1.BALL_ID);
const rimElement = document.getElementById(magicVals_1.RIM_ID);
if (playerElement instanceof HTMLImageElement && ballElement instanceof HTMLImageElement && rimElement instanceof HTMLImageElement) {
    playerImage.src = playerElement.src;
    ballImage.src = ballElement.src;
    rimImage.src = rimElement.src;
}
else {
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

})();

/******/ })()
;
//# sourceMappingURL=main.js.map