import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import UIButton from "../sprites/UIButton.ts";
import {ButtonId} from "../helper/enums.ts";
import gameManager from '../helper/GameManager.ts';

export default class MenuScene extends Scene
{
    private title: GameObjects.Text;
    private button: UIButton;

    constructor()
    {
        super('Menu');
    }

    create()
    {

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, gameOptions.gameTitle, gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new UIButton(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.7, 'Play', ButtonId.PLAY));

        // Add keyboard inputs
        this.addKeys();

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.PLAY, () => {

            gameManager.newGame();

            this.scene.launch('Game');
            this.scene.stop();
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
