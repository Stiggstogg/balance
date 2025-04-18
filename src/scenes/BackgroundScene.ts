import {GameObjects, Scene, Types} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";

// Basic scene class with the background which is used to extend the other scenes
export default class BackgroundScene extends Scene
{
    private cloud1Pos: { x: number, y: number };
    private cloud2Pos: { x: number, y: number };
    private cloud1: GameObjects.Image;
    private cloud2: GameObjects.Image;

    constructor()
    {
        super('Background');

    }

    init() {

        this.cloud1Pos = { x: 46, y: 15 };
        this.cloud2Pos = { x: 644, y: 73 };

    }

    create() {

        // background
        this.add.image(0,0,'background').setOrigin(0);

        // clouds

        this.cloud1 = this.add.image(this.cloud1Pos.x, this.cloud1Pos.y,'cloud1').setOrigin(0);
        this.cloud2 = this.add.image(this.cloud2Pos.x, this.cloud2Pos.y,'cloud2').setOrigin(0);

    }

    update() {

        // convert cloud speed from "game width / second" to "pixels / frame"
        const cloudSpeed1 = gameOptions.cloudSpeed * gameOptions.gameWidth / 60;
        const cloudSpeed2 = gameOptions.cloudSpeed * (1 - gameOptions.cloudSpeedDifference) * gameOptions.gameWidth / 60;

        // move clouds
        this.cloud1.x -= cloudSpeed1;
        this.cloud2.x -= cloudSpeed2;

        // reset clouds when they go off screen
        if (this.cloud1.x < -this.cloud1.width) {
            this.cloud1.x = gameOptions.gameWidth;
        }
        if (this.cloud2.x < -this.cloud2.width) {
            this.cloud2.x = gameOptions.gameWidth;
        }
    }

}
