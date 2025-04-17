import {GameObjects, Scene, Types} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {Side} from "../helper/enums.ts";

// Basic frame scene class with the frame and common elements
export default class BaseFrameScene extends Scene
{

    private side: Side;
    private title: string;
    private description: string;
    private frameBack: GameObjects.Image;
    private frameOuter: GameObjects.Image;
    private xOut: number;           // x position of the frame when it is outside (invisible)
    private xIn: number;            // x position of the frame when it is inside (visible)

    constructor(side: Side, title: string, description: string, config?: string | Types.Scenes.SettingsConfig)
    {
        super(config);

        this.side = side;
        this.title = title;
        this.description = description;

    }

    // Add basic elements
    protected addElements(): void {

        // create frame (from background and frame)
        this.frameBack = this.add.image(0, gameOptions.framePos,'frame-back').setDepth(0.5);
        this.frameOuter = this.add.image(0, gameOptions.framePos,'frame-outer').setDepth(2);

        // define properties based on side
        if (this.side === Side.WORK) {
            this.xOut = -this.frameBack.width;
            this.xIn = gameOptions.framePos;
            this.frameBack.setOrigin(0);
            this.frameOuter.setOrigin(0);
        } else {
            this.xOut = gameOptions.gameWidth + this.frameBack.width;
            this.xIn = gameOptions.gameWidth - gameOptions.framePos;
            this.frameBack.setOrigin(1, 0).setFlipX(true);
            this.frameOuter.setOrigin(1, 0).setFlipX(true);
        }

        this.frameBack.setX(this.xOut);
        this.frameOuter.setX(this.xOut);

    }

    // move frame in
    protected moveFrameIn(): void {

        this.tweens.add({
            targets: [this.frameBack, this.frameOuter],
            duration: 1000,
            x: this.xIn,
            ease: 'Power2',
        }).play();

    }
}
