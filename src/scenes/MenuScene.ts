import {GameObjects} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Button from "../sprites/Button.ts";
import {ButtonId} from "../helper/enums.ts";
import BaseScene from "./BaseScene.ts";

export default class MenuScene extends BaseScene
{
    private title: GameObjects.Text;
    private button: Button;

    constructor()
    {
        super('Menu');
    }

    create()
    {

        // add background
        super.addBackground();

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, gameOptions.gameTitle, gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new Button(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.7, 'Play', ButtonId.PLAY));

        // Add keyboard inputs
        this.addKeys();

        // Change to game scene when button is clicked
        this.events.on('click' + ButtonId.PLAY, () => {
            this.scene.start('Game');
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
