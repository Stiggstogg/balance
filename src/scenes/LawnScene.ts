import {GameObjects, Types} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {ButtonId, Side} from "../helper/enums.ts";
import BaseFrameScene from "./BaseFrameScene.ts";
import Button from "../sprites/Button.ts";

// "Life: Lawn Mower" scene
export default class LawnScene extends BaseFrameScene
{

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(Side.LIFE, 'Lawn Mowing', 'Mow the lawn', 'Lawn');

    }

    create()
    {

        // add basic elements
        this.addElements();

        this.moveFrameIn();


    }

}
