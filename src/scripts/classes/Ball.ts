import { GameObject } from "./GameObject"; // Import GameObject

export class Ball extends GameObject {
  velocityX: number;
  velocityY: number;
  bounce: number;
  friction: number;
  velocityGroundLimit: number;
  held: boolean;
  gravityMultiplier: number;
  isMidShot: boolean;

  constructor(id: string, x: number = 0, y: number = 0) {
    super(id, x, y); // Call the GameObject constructor

    // Ball-specific properties
    this.velocityX = 2;
    this.velocityY = 0;
    this.bounce = 0.7;
    this.friction = 0.99;
    this.velocityGroundLimit = 3;
    this.held = false;
    this.gravityMultiplier = 1;
    this.isMidShot = false;
  }

  // Add ball-specific methods here (e.g., movement, bouncing, etc.)
}
