import BaseScene from './BaseScene.ts';
import gameOptions from "../helper/gameOptions.ts";

export default class GameScene extends BaseScene
{

    private watch: Phaser.GameObjects.Image;

    constructor()
    {
        super('Game');
    }

    create()
    {

        // add background
        this.addBackground();

        // load the work and life scenes
        this.scene.launch('Accountant');
        this.scene.launch('Lawn');

        // add the watch
        this.watch = this.add.image(gameOptions.watchPos.x, gameOptions.gameHeight, 'watch').setOrigin(0.5, 0);

        this.tweens.add({
            targets: this.watch,
            duration: 750,
            y: gameOptions.watchPos.y,
            ease: 'Power2'
        }).play();

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
