import gameOptions from "../helper/gameOptions.ts";
import {ButtonId} from "../helper/enums.ts";
import BaseButton from './BaseButton.ts';

export default class DanceButton extends BaseButton {

    private readonly left: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, id: ButtonId, left: boolean) {

        super(scene, x, y, '', id, 'dance-button', gameOptions.accountantTextStyle);

        this.left = left;

        if (!this.left) {
            this.image.setFlipX(true);
        }

    }

    // Action which should happen when the sprite is clicked
    click(): void {
        this.scene.events.emit('click' + this.id, this.left);
    }

}