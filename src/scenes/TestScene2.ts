import {Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Color = Phaser.Display.Color;
import Dancer from '../sprites/Dancer.ts';

// TODO: Remove this scene at the end. It is only for testing

export default class TestScene2 extends Scene
{

    private dancer: Dancer;

    constructor()
    {
        super('Test2');
    }

    create()
    {

        // add background
        this.add.rectangle(0, 0, gameOptions.gameWidth, gameOptions.gameHeight, Color.HexStringToColor('#eec39a').color).setOrigin(0);

        // add dancer
        this.dancer = this.add.existing(new Dancer(this, gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2));

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {

            // check if the key is 'A' or 'D'
            if (event.key === 'a') {
                this.dancer.toggleLeftArm();
            }
            else if (event.key === 'd') {
                this.dancer.toggleRightArm();
            }
        });

    }

    update()
    {

        this.dancer.update();


    }


}
