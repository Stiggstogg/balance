import {Scene} from 'phaser';
import gameManager from '../helper/GameManager.ts';

// TODO: Remove this scene at the end. It is only for testing

export default class TestScene3 extends Scene
{

    constructor()
    {
        super('Test3');
    }

    create()
    {

        gameManager.newGame();

        gameManager.setScenes('Accountant', 'Dance');

        this.scene.start('Game');

    }

    update()
    {


    }


}
