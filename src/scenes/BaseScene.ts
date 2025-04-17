import {GameObjects, Scene, Types} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";

// Basic scene class with the background which is used to extend the other scenes
export default class BaseScene extends Scene
{
    private cloud1: GameObjects.Image;
    private cloud2: GameObjects.Image;

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(config);

    }

    // Add background
    protected addBackground(): void {

        // background
        this.add.image(0,0,'background').setOrigin(0);

        // clouds
        this.cloud1 = this.add.image(gameOptions.cloud1Pos.x, gameOptions.cloud1Pos.y,'cloud1').setOrigin(0);
        this.cloud2 = this.add.image(gameOptions.cloud2Pos.x, gameOptions.cloud2Pos.y,'cloud2').setOrigin(0);

    }
}
