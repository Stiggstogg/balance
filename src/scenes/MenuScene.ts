import { Scene, GameObjects, Types } from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Button from "../sprites/Button.ts";

export default class MenuScene extends Scene
{
    private title: GameObjects.Text;
    private cloud1: GameObjects.Image;
    private cloud2: GameObjects.Image;
    private titleText: string;
    private button: Button;
    private menuEntries: string[];
    private instructionText: string;
    private titleStyle: Types.GameObjects.Text.TextStyle;
    private inactiveStyle: Types.GameObjects.Text.TextStyle;
    private activeStyle: Types.GameObjects.Text.TextStyle;
    private instructionStyle: Types.GameObjects.Text.TextStyle;
    private selected: number;
    private items: GameObjects.Text[];

    constructor()
    {
        super('Menu');
    }

    create()
    {

        // -----------------------
        // Define parameters
        // -----------------------

        // title text
        this.titleText = 'Balance';

        // instruction text
        this.instructionText = 'Use arrow keys or W, A, S, D to select\nUse [SPACE] or [ENTER] to confirm';

        // background
        this.add.image(0,0,'background').setOrigin(0);

        // clouds
        this.cloud1 = this.add.image(46,15,'cloud1').setOrigin(0);
        this.cloud2 = this.add.image(644,73,'cloud2').setOrigin(0);

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, this.titleText, gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new Button(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.7, 'Play'));

        // Add keyboard inputs
        this.addKeys();

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
