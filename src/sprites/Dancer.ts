import {GameObjects} from 'phaser';
import {DanceMove} from '../helper/interfaces.ts';

// Mower class
export default class Dancer extends GameObjects.Container {

    private danceBody: GameObjects.Sprite;
    private danceArmLeft: GameObjects.Image;
    private danceArmRight: GameObjects.Image;
    private armPosCrouch: number;
    public danceMove: DanceMove;

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y);

        // create the sprites and position them
        this.armPosCrouch = 28;
        this.danceBody = new GameObjects.Sprite(scene, 0, 0, 'dance-body').setOrigin(0);
        this.danceArmLeft = new GameObjects.Image(scene, this.danceBody.x, this.danceBody.y, 'dance-arm', 0).setOrigin(0);
        this.danceArmRight = new GameObjects.Image(scene, this.danceBody.x + this.danceBody.width, this.danceBody.y, 'dance-arm', 0).setOrigin(1,0).setFlipX(true);

        // set the arm moves
        this.danceMove = {armDownLeft: true, armDownRight: true};

        // add all sprites to the container
        this.add([this.danceBody, this.danceArmLeft, this.danceArmRight]);


    }

    // update
    update() {

        const bodyFrameNumber = Number(this.danceBody.anims.getFrameName());
        this.danceArmLeft.setY(this.danceBody.y + bodyFrameNumber * this.armPosCrouch);
        this.danceArmRight.setY(this.danceBody.y + bodyFrameNumber * this.armPosCrouch);

        if (this.danceMove.armDownLeft) {
            this.danceArmLeft.setFlipY(false);
        }
        else {
            this.danceArmLeft.setFlipY(true);
        }

        if (this.danceMove.armDownRight) {
            this.danceArmRight.setFlipY(false);
        }
        else {
            this.danceArmRight.setFlipY(true);
        }

    }

    // toggle the left arm move
    toggleLeftArm() {
        this.danceMove.armDownLeft = !this.danceMove.armDownLeft;

    }

    // toggle the right arm move
    toggleRightArm() {
        this.danceMove.armDownRight = !this.danceMove.armDownRight;
    }

    // start to dance
    startDance() {
        this.danceBody.play('dance');
    }

    // stop the dance
    stopDance() {
        this.danceBody.stop();
    }


}