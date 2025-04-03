import { BACKBOARD_ID, BALL_ID, GROUND_ID, PLAYER_ID, POLE_ID, RIM_ID, BACKGROUND_CANVAS_ID, OBJECT_CANVAS_ID } from "./magicVals";

export class GameSetup {
  rim: HTMLImageElement;
  backBoard: HTMLImageElement;
  pole: HTMLImageElement;
  ground: HTMLImageElement;
  player: HTMLImageElement;
  ball: HTMLImageElement;

  gravity: number;
  shotMessage: string;

  backgroundCanvas: HTMLCanvasElement; // includes background, score
  objectCanvas: HTMLCanvasElement; // includes player, ball, rim system
  backgroundCanvasContext: CanvasRenderingContext2D;
  objectCanvasContext: CanvasRenderingContext2D;

  constructor() {
    // Load images from HTML
    this.rim = this.getImageElement(RIM_ID);
    this.backBoard = this.getImageElement(BACKBOARD_ID);
    this.pole = this.getImageElement(POLE_ID);
    this.ground = this.getImageElement(GROUND_ID);
    this.player = this.getImageElement(PLAYER_ID);
    this.ball = this.getImageElement(BALL_ID);

    // Gravity setting
    this.gravity = 0.1;

    this.shotMessage = "";

    // Load canvases and their context
    this.backgroundCanvas = this.getCanvasElement(BACKGROUND_CANVAS_ID);
    this.objectCanvas = this.getCanvasElement(OBJECT_CANVAS_ID);
    this.backgroundCanvasContext = this.getCanvasContext(this.backgroundCanvas);
    this.objectCanvasContext = this.getCanvasContext(this.objectCanvas);
  }

  private getImageElement(id: string): HTMLImageElement {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLImageElement)) {
      throw new Error(`Element with ID ${id} is not a valid HTMLImageElement`);
    }
    return element;
  }

  private getCanvasElement(id: string): HTMLCanvasElement {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`Element with ID ${id} is not a valid HTMLCanvasElement`);
    }
    return element;
  }

  private getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error(`Could not get 2D context for canvas with ID ${canvas.id}`);
    }
    return context;
  }
}
