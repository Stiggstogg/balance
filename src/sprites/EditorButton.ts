import gameOptions from "../helper/gameOptions.ts";
import {ButtonId} from "../helper/enums.ts";
import BaseButton from './BaseButton.ts';

export default class EditorButton extends BaseButton {

    public correct: boolean;
    private readonly index: number;

    constructor(scene: Phaser.Scene, x: number, y: number, id: ButtonId, index: number) {

        super(scene, x, y, '', id, 'editor-button', gameOptions.editorTextStyle);
        this.correct = false;
        this.index = index;
        this.setTextOffset(2);
        this.setTextColor('#FFFFFF');

    }

    // Action which should happen when the sprite is clicked
    click(): void {
        this.scene.events.emit('click' + this.id, this.index);
    }

    // set the text and correct or incorrect for the button
    setWord(word: string, correct: boolean): void {
        this.setText(word);
        this.correct = correct;
    }

}