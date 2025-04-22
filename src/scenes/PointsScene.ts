import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import UIButton from "../sprites/UIButton.ts";
import {ButtonId} from "../helper/enums.ts";
import gameManager from '../helper/GameManager.ts';

export default class PointsScene extends Scene
{
    private title: GameObjects.Text;
    private button: UIButton;

    constructor()
    {
        super('Points');
    }

    create()
    {

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Points', gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new UIButton(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.7, 'Continue', ButtonId.PLAY));

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.PLAY, () => {

            if (gameManager.isLastStage()) {    // go back to the menu if this is the last stage
                this.scene.start('Menu');

            } else {                            // go to the next stage
                gameManager.nextStage();        // go to the next stage
                this.scene.start('Game');
            }

        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
