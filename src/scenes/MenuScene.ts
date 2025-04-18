import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Button from "../sprites/Button.ts";
import {ButtonId} from "../helper/enums.ts";

export default class MenuScene extends Scene
{
    private title: GameObjects.Text;
    private button: Button;

    constructor()
    {
        super('Menu');
    }

    create()
    {

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, gameOptions.gameTitle, gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new Button(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.7, 'Play', ButtonId.PLAY));

        // Add keyboard inputs
        this.addKeys();

        // Change to game scene when button is clicked
        this.events.on('click' + ButtonId.PLAY, () => {
            this.scene.launch('Game', {workSceneKey: 'Accountant', lifeSceneKey: 'Lawn'});
            this.scene.stop();
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
