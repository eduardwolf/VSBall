import { GameObject } from "./GameObject"; // Import GameObject

export class Player extends GameObject {
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
  shootingImage: HTMLImageElement;
  runningImage1: HTMLImageElement;
  runningImage2: HTMLImageElement;
  idleImage1: HTMLImageElement;
  idleImage2: HTMLImageElement;


  constructor(id: string, shootingId: string, running1Id: string, running2Id: string, idle1Id: string, idle2Id: string, x: number = 0, y: number = 0) {
    super(id, x, y);

    // Player-specific properties
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
    this.shootingImage = this.getImageElement(shootingId);
    this.runningImage1 = this.getImageElement(running1Id);
    this.runningImage2 = this.getImageElement(running2Id);
    this.idleImage1 = this.getImageElement(idle1Id);
    this.idleImage2 = this.getImageElement(idle2Id);

  }

}
