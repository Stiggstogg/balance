import gameOptions from "../helper/gameOptions.ts";
import {ButtonId} from "../helper/enums.ts";
import BaseButton from './BaseButton.ts';

export default class AccountantButton extends BaseButton {

    private resultNumber: number;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, id: ButtonId) {

        super(scene, x, y, text, id, 'accountant-button', gameOptions.accountantTextStyle);
        this.setTextOffset(3);
        this.setTextColor('#FFFFFF');

    }

    // Action which should happen when the sprite is clicked
    click(): void {
        this.scene.events.emit('click' + this.id, this.resultNumber);
    }

    // set the number of the button
    setNumber(number: number): void {
        this.resultNumber = number;
        this.setText(this.resultNumber.toString() + ' $');
    }

}