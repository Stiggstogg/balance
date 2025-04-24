import {GameObjects, Types, Utils} from 'phaser';
import {Math as Mathphaser} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {ButtonId, GameState, Side} from "../helper/enums.ts";
import BaseFrameScene from "./BaseFrameScene.ts";
import EditorButton from '../sprites/EditorButton.ts';
import gameManager from '../helper/GameManager.ts';

// "Work: Editor" scene
export default class EditorScene extends BaseFrameScene
{

    private book: GameObjects.Image;
    private buttonGroup: GameObjects.Group;
    private validation: GameObjects.Image;
    private pageNumber: GameObjects.Text;
    private wordsCorrect: string[];
    private wordsIncorrect: string[];
    private wordsIndex: number[];
    private validationWordGroup: GameObjects.Group;
    private selectionFrame: GameObjects.Image;
    private wrongWordLine: GameObjects.Image;

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(Side.WORK, 'Editor', 'Sharpen your red pen!\nFind the word with the typo.', 'Editor');
    }

    create() {

        // create elements from base scene (frame etc.)
        super.create();

        // add book and page number
        this.book = this.add.image(0, 0, 'editor-book').setOrigin(0).setDepth(1);
        this.pageNumber = this.add.text(0, 0, Mathphaser.RND.integerInRange(181, 437).toString(), gameOptions.editorPageNumberTextStyle).setOrigin(0.5).setDepth(1);

        // create buttons and validation words
        const buttonPosX = 203;
        const buttonStartY = 100;
        const buttonSpaceY = 80;
        this.buttonGroup = this.add.group();
        this.validationWordGroup = this.add.group();

        for (let i = 0; i < 4; i++) {

            // button
            const newButton = this.add.existing(new EditorButton(this, buttonPosX, buttonStartY + i * buttonSpaceY, ButtonId.EDITOR, i));
            newButton.deactivate();
            this.buttonGroup.add(newButton);        // add button to group

            // validation word
            const newWord = this.add.text(buttonPosX, buttonStartY + i * buttonSpaceY + 2, '', gameOptions.editorHighlightTextStyle);       // +2 is the offset which is also applied in the button
            this.validationWordGroup.add(newWord);                          // add word to group

        }

        this.buttonGroup.setDepth(1.1).setVisible(false);
        this.validationWordGroup.setOrigin(0.5).setDepth(1).setVisible(false);

        // create selection frame
        this.selectionFrame = this.add.image(buttonPosX, 0, 'editor-selection').setOrigin(0.5).setDepth(1.1).setVisible(false);

        // create the wrong word line
        this.wrongWordLine = this.add.image(0, 0, 'editor-line').setOrigin(0.5).setDepth(1.05).setVisible(false);       // line with length 40 and color red

        // create validation signs
        const validationDistance = 130;        // distance between buttons and validation sign
        const firstButton = this.buttonGroup.getChildren()[0] as EditorButton;        // get the first button
        this.validation = this.add.image(firstButton.x + validationDistance, firstButton.y, 'accountant-validation').setOrigin(0.5).setDepth(1.1).setVisible(false);

        // load words
        const words = this.cache.json.get('words');   // get the words from the json file
        this.wordsCorrect = Object.values(words.wordsCorrect);                  // get the correct words from the json file and create a string array out of it (Object.values is needed! As from the JSON file it is an object)
        this.wordsIncorrect = Object.values(words.wordsIncorrect);              // get the correct words from the json file and create a string array out of it (Object.values is needed! As from the JSON file it is an object)
        this.wordsIndex = Array.from(Array(this.wordsCorrect.length).keys());   // create an array with the numbers 0 to 9

        // set the start progress value
        this.setProgress(0);

        // event listeners for game start
        this.events.once('startGame', () => {

            // make the page number visible
            this.pageNumber.setVisible(true);

            // show numbers
            this.newWords();

        });

        // event listeners for button clicks
        this.events.on('click' + ButtonId.EDITOR, (index: number) => {
            this.handleButtonClick(index);
        });

        // event listener for game stop
        this.events.once('stopGame', () => {

            // calculate the multiplier based on the progress and store them in the game manager
            gameManager.setWorkProgressMultiplier(this.progress, this.calculateResult(this.progress, gameOptions.editorMultiplierFunction));

            // make everything which does not slide out invisible
            this.buttonGroup.setVisible(false);
            this.pageNumber.setVisible(false);
            this.validationWordGroup.setVisible(false);
            this.selectionFrame.setVisible(false);
            this.validation.setVisible(false);
            this.wrongWordLine.setVisible(false);

        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.EDITOR);
        });

    }

    update() {

        // move the balance sheet and pen together with the frame
        const bookPos = {x: 10, y: 17};                 // relative position to the frame
        const pageNumberPos = {x: 327, y: 405};          // relative position to the frame

        this.book.setPosition(this.frameOuter.x + bookPos.x, this.frameOuter.y + bookPos.y);
        this.pageNumber.setPosition(this.frameOuter.x + pageNumberPos.x, this.frameOuter.y + pageNumberPos.y);

    }

    // set the numbers (cash, inventory, total) and make them visible
    newWords() {

        if (this.gameState === GameState.PLAYING) {

            // show and activate buttons
            this.buttonGroup.setVisible(true);

            for (let i = 0; i < this.buttonGroup.getChildren().length; i++) {
                const button = this.buttonGroup.getChildren()[i] as EditorButton;
                button.activate();
            }

            // increase page number
            this.pageNumber.text = String(Number(this.pageNumber.text) + 1);

            // add new words
            Utils.Array.Shuffle(this.wordsIndex);     // take word index array and shuffle it

            const wrongWordIndex = Mathphaser.RND.integerInRange(0, this.buttonGroup.getChildren().length - 1); // get random index for wrong word

            let word = '';
            let correct = true;

            for (let i = 0; i < this.buttonGroup.getChildren().length; i++) {

                const button = this.buttonGroup.getChildren()[i] as EditorButton;

                if (i === wrongWordIndex) {        // set wrong word
                    word = this.wordsIncorrect[this.wordsIndex[i]];
                    correct = false;
                }
                else {
                    word = this.wordsCorrect[this.wordsIndex[i]];
                    correct = true;
                }

                // set the word and correct or incorrect for the button
                button.setWord(word, correct);

                // set the word for the validation word
                const validationWord = this.validationWordGroup.getChildren()[i] as GameObjects.Text;
                validationWord.setText(word);

            }

            // set the line below the wrong word
            const wrongValidationWord = this.validationWordGroup.getChildren()[wrongWordIndex] as GameObjects.Text;        // get the wrong validation word
            this.wrongWordLine.setPosition(wrongValidationWord.x, wrongValidationWord.y + 15);
            this.wrongWordLine.setCrop((this.wrongWordLine.width - wrongValidationWord.width) / 2, 0,  wrongValidationWord.width, this.wrongWordLine.height);
        }

    }

    // handle button click
    handleButtonClick(index: number) {

        const pressedButton = this.buttonGroup.getChildren()[index] as EditorButton;        // get the pressed button

        // deactivate all buttons, hide them
        for (let i = 0; i < this.buttonGroup.getChildren().length; i++) {
            const button = this.buttonGroup.getChildren()[i] as EditorButton;
            button.deactivate();
            button.setVisible(false);        // hide the buttons
        }

        // make the validation words and sign visible (in case the game is still running, otherwise it might show while the frame is moving out)
        if (this.gameState === GameState.PLAYING) {

            this.validation.setVisible(true);                   // show the validation sign
            this.validationWordGroup.setVisible(true);          // show the validation words
            this.selectionFrame.setVisible(true);               // show the selection frame
            this.wrongWordLine.setVisible(true);                  // show the line below the wrong word

        }

        // move everything at the right position
        this.validation.setY(pressedButton.y);                  // set the y position of the validation sign to the button position
        this.selectionFrame.setY(pressedButton.y);              // set the y position of the selection frame to the button position

        if (!pressedButton.correct) {        // if the pressed button is the one with the wrong word (correct choice)

            // play the sound
            this.correctSound.play();

            // set the correct validation sign
            this.validation.setFrame(1);            // set the validation sign to correct

            // set the progress
            this.setProgress(this.progress + 1);

        }
        else {

            // play the sound
            this.errorSound.play();

            // set the wrong validation sign
            this.validation.setFrame(0);            // set the validation sign to wrong

        }

        // animate the validation sign and create new words when done
        this.tweens.add({
            targets: this.validation,
            duration: 200,
            delay: 0,
            scale: 1.1,
            yoyo: true,
            repeat: 3,
            ease: 'Linear',
            paused: false,
            onComplete: () => {
                this.validation.setVisible(false);                  // hide validation sign
                this.validationWordGroup.setVisible(false);         // hide validation words
                this.selectionFrame.setVisible(false);              // hide selection frame
                this.wrongWordLine.setVisible(false);               // hide line below wrong word
                this.newWords();        // show new words
            }
        });

    }

}
