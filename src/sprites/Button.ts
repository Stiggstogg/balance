import {GameObjects} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {ButtonId} from "../helper/enums.ts";

export default class Button extends GameObjects.Container {
    private image: GameObjects.Image;
    private text: GameObjects.Text;
    private id: ButtonId;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, id: ButtonId) {

        super(scene, x, y);
        this.id = id;

        // create objects and add to container
        this.image = new GameObjects.Image(scene, 0, 0, 'button').setOrigin(0);
        this.text = new GameObjects.Text(scene, 0, 0, text, gameOptions.buttonTextStyle).setOrigin(0);

        this.image.setPosition(-this.image.width / 2, -this.image.height / 2);
        this.text.setPosition(-this.text.width / 2, -this.text.height / 2 - 3);

        this.add([this.image, this.text]);

        // interactive
        this.setSize(this.image.width, this.image.height);
        this.setInteractive();
        this.on('pointerdown', () => {
            this.click();
        });

    }

    // Action which should happen when the sprite is clicked
    click(): void {
        this.scene.events.emit('click' + this.id);
    }

}