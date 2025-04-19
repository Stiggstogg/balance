import gameOptions from "../helper/gameOptions.ts";
import {ButtonId} from "../helper/enums.ts";
import BaseButton from './BaseButton.ts';

export default class UIButton extends BaseButton {

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, id: ButtonId) {

        super(scene, x, y, text, id, 'button', gameOptions.buttonTextStyle);

        this.setTextOffset(-3);
    }
}