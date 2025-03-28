/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RIM_SOURCE = exports.BALL_SOURCE = exports.PLAYER_CANVAS_ID = exports.BACKGROUND_CANVAS_ID = void 0;
exports.BACKGROUND_CANVAS_ID = 'backgroundCanvas';
exports.PLAYER_CANVAS_ID = 'playerCanvas';
exports.BALL_SOURCE = '';
exports.RIM_SOURCE = '';


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
    }
    else {
        console.error("Canvas not found");
    }
};
init();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map