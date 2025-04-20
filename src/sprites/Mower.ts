import { Physics } from 'phaser';
import gameOptions from "../helper/gameOptions.ts";

// Mower class
export default class Mower extends Physics.Arcade.Sprite {

    private readonly speed: number;
    public direction: number;


    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'lawn-mower', 0);

        // set start direction and speed
        this.direction = 0;
        this.speed = 1;

        // add physics to the sprite
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // set the body size and offset
        this.body!.setSize(20, 20);
        this.body!.setOffset(20, 0);

    }

    // update
    update() {
        super.update();

        // check if the player is moving and play the animation
        if (this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0) {
            this.anims.play('mower-walk', true);
        } else {
            this.anims.stop();
        }

    }

    // Move the sprite
    rotate(): void {

        if (this.direction > 2) {
            this.direction = 0;
        }
        else {
            this.direction++;
        }

    }

}