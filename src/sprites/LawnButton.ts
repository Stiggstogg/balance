import gameOptions from "../helper/gameOptions.ts";
import {ButtonId} from "../helper/enums.ts";
import BaseButton from './BaseButton.ts';

export default class LawnButton extends BaseButton {

    private readonly clockwise: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, id: ButtonId, clockwise: boolean) {

        super(scene, x, y, '', id, 'lawn-button', gameOptions.accountantTextStyle);

        this.clockwise = clockwise;

        if (this.clockwise) {
            this.setFrame(0);
        }
        else {
            this.setFrame(1);
        }

    }

    // Action which should happen when the sprite is clicked
    click(): void {
        this.scene.events.emit('click' + this.id, this.clockwise);
    }

}