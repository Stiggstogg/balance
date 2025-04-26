
import {Scene} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {ButtonId} from '../helper/enums.ts';
import Watch from '../sprites/Watch.ts';
import gameManager from '../helper/GameManager.ts';

export default class GameScene extends Scene
{

    private watch: Watch;

    constructor()
    {
        super('Game');
    }

    create()
    {

        // load the work and life scenes
        this.scene.launch(gameManager.getNextWorkScene());
        this.scene.launch(gameManager.getNextLifeScene());

        // add the watch
        this.watch = this.add.existing(new Watch(this, gameOptions.gameWidth / 2, 0, gameOptions.timeLimit));
        this.watch.setY(gameOptions.gameHeight + this.watch.watchHeight / 2);

        this.tweens.add({
            targets: this.watch,
            duration: gameOptions.frameTweenLength * 0.75,
            y: gameOptions.gameHeight / 2,
            ease: 'Cubic.Out',
            paused: false
        });

        // forward the button click event from the work scene to the life scene
        this.events.once('click' + ButtonId.START, () => {
            this.scene.get(gameManager.getNextLifeScene()).events.emit('click' + ButtonId.START);
        });

        // start the timer when the countdown is over (game starts)
        this.scene.get(gameManager.getNextWorkScene()).events.once('startGame', () => {
            this.watch.startTimer();
        });

        // forward the stop game event from the watch to the work and life scene, move the watch out of the frame
        this.events.once('stopGame', () => {
            this.scene.get(gameManager.getNextWorkScene()).events.emit('stopGame');
            this.scene.get(gameManager.getNextLifeScene()).events.emit('stopGame');

            this.tweens.add({
                targets: this.watch,
                delay: gameOptions.frameTweenLength * 0.25,
                duration: gameOptions.frameTweenLength * 0.75,
                y: gameOptions.gameHeight + this.watch.watchHeight / 2,
                ease: 'Cubic.In',
                paused: false,
                onComplete: () => {
                    // stop the life and work scene
                    this.scene.stop(gameManager.getNextWorkScene());
                    this.scene.stop(gameManager.getNextLifeScene());

                    // launch the points scene
                    this.scene.launch('Points');

                    // stop the game scene
                    this.scene.stop();
                }
            });
        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.START);
            this.events.off('startGame');
            this.events.off('stopGame');
        });

    }

    update() {

        this.watch.update();

    }

}
