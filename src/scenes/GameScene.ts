
import {GameObjects, Scene} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {ButtonId} from '../helper/enums.ts';
import {GameSceneData} from '../helper/interfaces.ts';
import Watch from '../sprites/Watch.ts';

export default class GameScene extends Scene
{

    private watch: Watch;
    private gameSceneData: GameSceneData;

    constructor()
    {
        super('Game');
    }

    init(data: GameSceneData){

        this.gameSceneData = data;

    }

    create()
    {

        // load the work and life scenes
        this.scene.launch(this.gameSceneData.lifeSceneKey);
        this.scene.launch(this.gameSceneData.workSceneKey);

        // add the watch
        this.watch = this.add.existing(new Watch(this, gameOptions.gameWidth / 2, 0, gameOptions.timeLimit));
        this.watch.setY(gameOptions.gameHeight + this.watch.watchHeight / 2);

        this.tweens.add({
            targets: this.watch,
            duration: 750,
            y: gameOptions.gameHeight / 2,
            ease: 'Cubic.Out',
            paused: false
        });

        // forward the button click event from the work scene to the life scene
        this.events.on('click' + ButtonId.START, () => {
            this.scene.get(this.gameSceneData.lifeSceneKey).events.emit('click' + ButtonId.START);
        });

        // start the timer when the coutdown is over (game starts)
        this.scene.get(this.gameSceneData.workSceneKey).events.on('startGame', () => {
            this.watch.startTimer();
        });

        // forward the stop game event from the watch to the work and life scene, move the watch out of the frame
        this.events.on('stopGame', () => {
            this.scene.get(this.gameSceneData.lifeSceneKey).events.emit('stopGame');
            this.scene.get(this.gameSceneData.workSceneKey).events.emit('stopGame');


            this.tweens.add({
                targets: this.watch,
                delay: 250,
                duration: 750,
                y: gameOptions.gameHeight + this.watch.watchHeight / 2,
                ease: 'Cubic.In',
                paused: false,
                onComplete: () => {
                    // stop the life and work scene
                    this.scene.stop(this.gameSceneData.workSceneKey);
                    this.scene.stop(this.gameSceneData.lifeSceneKey);

                    // launch the points scene
                    this.scene.launch('Points');

                    // stop the game scene
                    this.scene.stop();
                }
            });
        });

    }

    update() {

        this.watch.update();

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
