import { Physics } from 'phaser';
import gameOptions from "../helper/gameOptions.ts";

// Mower class
export default class Mower extends Physics.Arcade.Sprite {

    private readonly speed: number;
    public direction: number;
    public lineOffset: {x: number, y: number};
    private readonly mowerDimensions: {width: number, height: number};  // dimensions of the mower
    private readonly mowerOffset: {x: number, y: number};    // offset of the mower (top left) from the sprite (top left)
    private currentMowedOffset: {x: number, y: number};    // this defines the offset of the mowed position from the mower position
    private startMowed: {x: number, y: number};          // start position where the grass was mowed (resets after each turn)
    private currentMowed: {x: number, y: number};        // current position where the grass was mowed
    private started: boolean = false;        // true if the mower has started mowing, false if not

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'lawn-mower', 0);

        // set start direction and speed
        this.direction = 0;
        this.speed = 40;
        this.lineOffset = {x: 0, y: 0};
        this.mowerDimensions = {width: 20, height: 20};
        this.mowerOffset = {x: 20, y: 0};

        // add physics to the sprite
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // set the body size and offset
        this.body!.setSize(this.mowerDimensions.width, this.mowerDimensions.height);
        this.body!.setOffset(this.mowerOffset.x, this.mowerOffset.y);         // offset of the body from the sprite (top left)

        // set the origin to the center of the mower
        this.setOrigin((this.mowerOffset.x + this.mowerDimensions.width/2)/this.width, (this.mowerOffset.y + this.mowerDimensions.height/2)/this.height);

        // initialize the mowed positions and offsets
        this.currentMowedOffset = {x: this.mowerDimensions.width / 2, y: 0};
        this.startMowed = {x: this.x - this.currentMowedOffset.x, y: this.y - this.currentMowedOffset.y};
        this.currentMowed = {x: this.x + this.currentMowedOffset.x, y: this.y + this.currentMowedOffset.y};

    }

    // update
    update() {
        super.update();

        this.currentMowedOffset = {x: 0, y: 0};    // this defines the offset of the mowed position from the mower position // TODO: Remove, I think this is not needed

        if (this.started) {

            // move the mower
            switch (this.direction) {
                case 0:
                    this.setVelocity(this.speed, 0);
                    break;
                case 1:
                    this.setVelocity(0, this.speed);
                    break;
                case 2:
                    this.setVelocity(-this.speed, 0);
                    break;
                case 3:
                    this.setVelocity(0, -this.speed);
                    break;
            }

            // set the current mowed position
            this.currentMowed = {x: this.x + this.currentMowedOffset.x, y: this.y + this.currentMowedOffset.y};

            // check if the player is blocked and stop the animation or play the animation
            if (this.body!.blocked.none) {
                this.anims.play('mower-walk', true);
            } else {
                this.anims.stop();
            }

        }

    }

    // Move the sprite
    rotate(clockwise: boolean): void {

        // rotate
        if (clockwise) {
            if (this.direction > 2) {
                this.direction = 0;
            }
            else {
                this.direction++;
            }
        }
        else {
            if (this.direction < 1) {
                this.direction = 3;
            }
            else {
                this.direction--;
            }
        }

        // set velocity and mowed offset
        switch (this.direction) {
            case 0:
                this.setVelocity(this.speed, 0);
                this.currentMowedOffset = {x: this.mowerDimensions.width / 2, y: 0};
                break;
            case 1:
                this.setVelocity(0, this.speed);
                this.currentMowedOffset = {x: 0, y: this.mowerDimensions.height / 2};
                break;
            case 2:
                this.setVelocity(-this.speed, 0);
                this.currentMowedOffset = {x: -this.mowerDimensions.width / 2, y: 0};
                break;
            case 3:
                this.setVelocity(0, -this.speed);
                this.currentMowedOffset = {x: 0, y: -this.mowerDimensions.height / 2};
                break;
        }

        // set the start of the current mowed line
        this.startMowed = {x: this.x - this.currentMowedOffset.x, y: this.y - this.currentMowedOffset.y};

        // set the rotation of the sprite and move it, so that it rotates around the mower
        this.setRotation(this.direction * Math.PI / 2);

    }

    // get the mowed start position
    getStartMowed(): {x: number, y: number} {
        return this.startMowed;
    }

    // get the mowed current position
    getCurrentMowed(): {x: number, y: number} {
        return this.currentMowed;
    }

    // start the mower
    startMower() {
        this.started = true;
    }

    // stop the mower
    stopMower() {
        this.started = false;
        this.setVelocity(0, 0);
    }


}