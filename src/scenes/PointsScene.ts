import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Button from "../sprites/Button.ts";
import {ButtonId} from "../helper/enums.ts";

export default class PointsScene extends Scene
{
    private title: GameObjects.Text;
    private button: Button;

    constructor()
    {
        super('Points');
    }

    create()
    {

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Points', gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new Button(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.7, 'Continue', ButtonId.PLAY));

        // Change to game scene when button is clicked
        this.events.on('click' + ButtonId.PLAY, () => {
            this.scene.start('Game');
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
