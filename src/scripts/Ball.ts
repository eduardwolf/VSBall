export class Ball {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    bounce: number;
    friction: number;
    velocityGroundLimit: number;
    held: boolean;
    gravityMultiplier: number;
  
    constructor() {
      this.x = 0;
      this.y = 0;
      this.velocityX = 2;
      this.velocityY = 0;
      this.bounce = 0.7;
      this.friction = 0.99;
      this.velocityGroundLimit = 3;
      this.held = false;
      this.gravityMultiplier = 1;
    }
  }
  