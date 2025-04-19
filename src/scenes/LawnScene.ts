import {GameObjects, Types} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {ButtonId, Side} from "../helper/enums.ts";
import BaseFrameScene from "./BaseFrameScene.ts";
import UIButton from "../sprites/UIButton.ts";

// "Life: Lawn Mower" scene
export default class LawnScene extends BaseFrameScene
{

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(Side.LIFE, 'Lawn Mowing', 'Mow the lawn', 'Lawn');
        //super(Side.LIFE, 'Right', 'Do something', 'Lawn');            // TODO: Remove at the end, just for video recording before full game reveal

    }

    create()
    {

        super.create();




    }

}
