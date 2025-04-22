import {GameObjects, Types} from 'phaser';
import {ButtonId} from "../helper/enums.ts";

export default class BaseButton extends GameObjects.Container {
    public image: GameObjects.Image;
    private text: GameObjects.Text;
    protected id: ButtonId;
    private offset: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, id: ButtonId, buttonAssetKey: string, buttonTextStyle: Types.GameObjects.Text.TextStyle) {

        super(scene, x, y);
        this.id = id;

        // create objects and add to container
        this.image = new GameObjects.Image(scene, 0, 0, buttonAssetKey).setOrigin(0);
        this.text = new GameObjects.Text(scene, 0, 0, text, buttonTextStyle).setOrigin(0);

        this.image.setPosition(-this.image.width / 2, -this.image.height / 2);
        this.text.setPosition(-this.text.width / 2, -this.text.height / 2);

        this.add([this.image, this.text]);

        // set size
        this.setSize(this.image.width, this.image.height);

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

    // set text offset to center it (if needed)
    setTextOffset(offset: number): void {
        this.offset = offset;
        this.text.setY(this.text.y + this.offset);
    }

    // set text color
    setTextColor(color: string): void {
        this.text.setStyle({color: color});
    }

    // change the text
    setText(text: string): void {
        this.text.setText(text);
        this.text.setPosition(-this.text.width / 2, -this.text.height / 2 + this.offset);
    }

    // get the text
    getText(): string {
        return this.text.text;
    }

    // activate button
    activate(): void {
        this.setInteractive();
    }

    // deactivate button
    deactivate(): void {
        this.disableInteractive();
    }

    // set the frame of the picture
    setFrame(frame: number) {
        this.image.setFrame(frame);
    }

}