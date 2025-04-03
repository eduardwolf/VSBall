
export class Player {
  x: number;
  y: number;
  speed: number;
  velocityY: number;
  isJumping: boolean;
  canJump: boolean;
  jumpForce: number;
  gravityMultiplier: number;
  lastAirDirection: "left" | "right" | null;
  disabledAirMovement: boolean;
  canCatchBall: boolean;
  maxShotPower: number;
  minShotPower: number;
  canLandWithBall: boolean;

  constructor() {

    this.x = 0;
    this.y = 0;
    this.speed = 3;
    this.velocityY = 0;
    this.isJumping = true;
    this.canJump = true;
    this.jumpForce = 5;
    this.gravityMultiplier = 1.5;
    this.lastAirDirection = null;
    this.disabledAirMovement = false;
    this.canCatchBall = true;
    this.maxShotPower = 7;
    this.minShotPower = 1;
    this.canLandWithBall = false;
  }
}