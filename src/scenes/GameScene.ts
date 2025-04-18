
import {GameObjects, Scene} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {ButtonId} from '../helper/enums.ts';
import {GameSceneData} from '../helper/interfaces.ts';

export default class GameScene extends Scene
{

    private watch: GameObjects.Image;
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
        this.watch = this.add.image(gameOptions.watchPos.x, gameOptions.gameHeight, 'watch').setOrigin(0.5, 0);

        this.tweens.add({
            targets: this.watch,
            duration: 750,
            y: gameOptions.watchPos.y,
            ease: 'Cubic.Out'
        }).play();

        // forward the events from the work scene to the life scene
        this.events.on('click' + ButtonId.START, () => {
            this.scene.get(this.gameSceneData.lifeSceneKey).events.emit('click' + ButtonId.START);
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

    }
}
