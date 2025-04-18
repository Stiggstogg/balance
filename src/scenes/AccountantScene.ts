import {GameObjects, Types} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {ButtonId, Side} from "../helper/enums.ts";
import BaseFrameScene from "./BaseFrameScene.ts";
import Button from "../sprites/Button.ts";

// "Work: Accountant" scene
export default class AccountantScene extends BaseFrameScene
{

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(Side.WORK, 'Accountant', 'Calculate the numbers', 'Accountant');
        //super(Side.WORK, 'LEFT', 'Do something', 'Accountant');                 // TODO: Remove at the end, just for video recording before full game reveal
    }

    create()
    {

        super.create();

        // add basic elements


    }

}
