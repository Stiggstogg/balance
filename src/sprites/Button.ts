import {GameObjects} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";

export default class Button extends GameObjects.Container {
    private image: GameObjects.Image;
    private text: GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y);

        // create objects and add to container
        this.image = new GameObjects.Image(scene, 0, 0, 'button').setOrigin(0);
        this.text = new GameObjects.Text(scene, 0, 0, text, gameOptions.buttonTextStyle).setOrigin(0);

        this.image.setPosition(-this.image.width / 2, -this.image.height / 2);
        this.text.setPosition(-this.text.width / 2, -this.text.height / 2 - 3);

        this.add([this.image, this.text]);

    }

}