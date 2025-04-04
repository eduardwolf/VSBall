import { Ball } from "./Ball";
import { GameObject } from "./GameObject";
import { BACKBOARD_ID, BALL_ID, GROUND_ID, PLAYER_ID, POLE_ID, RIM_ID, STATIC_CANVAS_ID, DYNAMIC_CANVAS_ID, PLAYER_SHOOTING_ID, PLAYER_RUNNING1_ID, PLAYER_RUNNING2_ID, PLAYER_IDLE1_ID, PLAYER_IDLE2_ID } from "../magicVals";
import { Player } from "./Player";

export class GameSetup {
  rim: GameObject;
  backBoard: GameObject;
  pole: GameObject;
  ground: GameObject;
  player: Player;
  ball: Ball;

  gravity: number;
  shotMessage: string;
  score: number;

  staticCanvas: HTMLCanvasElement;
  dynamicCanvas: HTMLCanvasElement;
  staticCanvasContext: CanvasRenderingContext2D;
  dynamicCanvasContext: CanvasRenderingContext2D;

  dribbleOffset: number;
  dribbleDirection: number;
  dribbleSpeed: number;

  runningFrame: number;
  lastRunningFrameTime: number;
  runningFrameInterval: number;

  constructor() {
    // Load images from HTML
    this.rim = new GameObject(RIM_ID, 0, 0);
    this.backBoard = new GameObject(BACKBOARD_ID, 0, 0);
    this.pole = new GameObject(POLE_ID, 0, 0);
    this.ground = new GameObject(GROUND_ID, 0, 0);
    this.player = new Player(PLAYER_ID, PLAYER_SHOOTING_ID, PLAYER_RUNNING1_ID, PLAYER_RUNNING2_ID, PLAYER_IDLE1_ID, PLAYER_IDLE2_ID,0, 0);
    this.ball = new Ball(BALL_ID, 0, 0);

    this.gravity = 0.1;
    this.score = 0;
    this.shotMessage = "";

    // Load canvases and their context
    this.staticCanvas = this.getCanvasElement(STATIC_CANVAS_ID);
    this.dynamicCanvas = this.getCanvasElement(DYNAMIC_CANVAS_ID);
    this.staticCanvasContext = this.getCanvasContext(this.staticCanvas);
    this.dynamicCanvasContext = this.getCanvasContext(this.dynamicCanvas);

    this.dribbleOffset = 0;
    this.dribbleDirection = 1;
    this.dribbleSpeed = 1;
    this.runningFrame = 0;
    this.lastRunningFrameTime = performance.now();
    this.runningFrameInterval = 250;
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

