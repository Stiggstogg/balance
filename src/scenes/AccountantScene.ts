import {GameObjects, Utils, } from 'phaser';
import {Math as Mathphaser} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import {ButtonId, GameState, Side} from "../helper/enums.ts";
import BaseFrameScene from "./BaseFrameScene.ts";
import UIButton from "../sprites/UIButton.ts";
import AccountantButton from '../sprites/AccountantButton.ts';
import gameManager from '../helper/GameManager.ts';

// "Work: Accountant" scene
export default class AccountantScene extends BaseFrameScene
{

    private balancesheet: GameObjects.Image;
    private pen: GameObjects.Image;
    private textGroup: GameObjects.Group;
    private numberGroup: GameObjects.Group;
    private validation: GameObjects.Image;
    private cash: number;
    private inventory: number;
    private total: number;
    private cashText: GameObjects.Text;
    private inventoryText: GameObjects.Text;
    private totalText: GameObjects.Text;
    private accountantButton1: UIButton;
    private accountantButton2: UIButton;
    private accountantButton3: UIButton;
    private accountantButton4: UIButton;
    private buttonGroup: GameObjects.Group;

    constructor()
    {
        super(Side.WORK, 'Accountant', 'Ready to crunch numbers?\nTotal the assets to complete the 2025 balance sheets.', 'Accountant');
    }

    create() {

        // create elements from base scene (frame etc.)
        super.create();

        // add images
        this.balancesheet = this.add.image(0, 0, 'accountant-balancesheet').setOrigin(0).setDepth(1);
        this.pen = this.add.image(0, 0, 'accountant-pen').setOrigin(0).setDepth(1);

        // add title texts
        this.textGroup = this.add.group();
        const startY = 145
        const spaceY = 30;
        const text1PosX = 80;
        const text2PosX = 100;
        const numPosX = 344;
        this.textGroup.add(this.add.text(214, 102, 'Balance Sheet 2025', gameOptions.accountantTitleTextStyle).setOrigin(0.5, 0));
        this.textGroup.add(this.add.text(text1PosX, startY, 'Assets:', gameOptions.accountantTextStyle).setOrigin(0, 0));
        this.textGroup.add(this.add.text(text2PosX, startY + 1.2 * spaceY, 'Cash:', gameOptions.accountantTextStyle).setOrigin(0, 0));
        this.textGroup.add(this.add.text(text2PosX, startY + 2.2 * spaceY, 'Inventory:', gameOptions.accountantTextStyle).setOrigin(0, 0));
        this.textGroup.add(this.add.text(text1PosX, startY + 3.65 * spaceY, 'Total:', gameOptions.accountantTextStyle).setOrigin(0, 0));
        this.textGroup.setVisible(false).setDepth(1.1);

        // add number texts
        this.cash = 1000;
        this.inventory = 500;
        this.total = this.cash + this.inventory;
        this.cashText = this.add.text(numPosX, startY + 1.2 * spaceY, this.toMoneyString(this.cash), gameOptions.accountantTextStyle);
        this.inventoryText = this.add.text(numPosX, startY + 2.2 * spaceY, this.toMoneyString(this.inventory), gameOptions.accountantTextStyle);
        this.totalText = this.add.text(numPosX, startY + 3.65 * spaceY, '???? $', gameOptions.accountantTextStyle);
        this.numberGroup = this.add.group();
        this.numberGroup.addMultiple([this.cashText, this.inventoryText, this.totalText]);
        this.numberGroup.setOrigin(1,0).setDepth(1.1).setVisible(false);

        // add validation signs
        this.validation = this.add.image(this.totalText.x + 3 + 16, this.totalText.y -3 + 16, 'accountant-validation').setOrigin(0.5).setDepth(1.1).setVisible(false);

        // add buttons
        this.accountantButton1 = this.add.existing(new AccountantButton(this, 0, 0, '1000 $', ButtonId.ACCOUNTANT));       // create first button to get the size
        const buttonSpaceX = 20;
        const buttonSpaceY = 25;
        const buttonStartY = (this.textGroup.getChildren()[this.textGroup.getChildren().length - 1] as GameObjects.Text).y + this.accountantButton1.height/2 + 3 * buttonSpaceY;
        const buttonStartX = 50 + this.accountantButton1.width/2 + buttonSpaceX;
        this.accountantButton1.setPosition(buttonStartX, buttonStartY);
        this.accountantButton2 = this.add.existing(new AccountantButton(this, buttonStartX + this.accountantButton1.width + buttonSpaceX, buttonStartY, '2000 $', ButtonId.ACCOUNTANT));
        this.accountantButton3 = this.add.existing(new AccountantButton(this, buttonStartX, buttonStartY + this.accountantButton1.height + buttonSpaceY, '3000 $', ButtonId.ACCOUNTANT));
        this.accountantButton4 = this.add.existing(new AccountantButton(this, buttonStartX + this.accountantButton1.width + buttonSpaceX, buttonStartY + this.accountantButton1.height + buttonSpaceY, '4000 $', ButtonId.ACCOUNTANT));
        this.buttonGroup = this.add.group();
        this.buttonGroup.addMultiple([this.accountantButton1, this.accountantButton2, this.accountantButton3, this.accountantButton4]);
        this.buttonGroup.setDepth(1.1).setVisible(false);

        // set the start progress value
        this.setProgress(0);

        // event listeners for game start
        this.events.once('startGame', () => {

            // make texts visible
            this.textGroup.setVisible(true);

            // show numbers
            this.newNumbers();

        });

        // event listeners for button clicks
        this.events.on('click' + ButtonId.ACCOUNTANT, (value: number) => {
            this.handleButtonClick(value);
        });

        // event listener for game stop
        this.events.once('stopGame', () => {

            // calculate the multiplier based on the progress and store them in the game manager
            gameManager.setWorkProgressMultiplier(this.progress, this.calculateResult(this.progress, gameOptions.accountantMultiplierFunction));

            // make everything which does not slide out invisible
            this.textGroup.setVisible(false);
            this.buttonGroup.setVisible(false);
            this.cashText.setVisible(false);
            this.inventoryText.setVisible(false);
            this.totalText.setVisible(false);
            this.validation.setVisible(false);
        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.ACCOUNTANT);
        });

    }

    update() {

        // move the balance sheet and pen together with the frame
        const balancesheetPos = {x: 21, y: 28};        // relative position to the frame
        const penPos = {x: 390, y: 33};        // relative position to the frame

        this.balancesheet.setPosition(this.frameOuter.x + balancesheetPos.x, this.frameOuter.y + balancesheetPos.y);
        this.pen.setPosition(this.frameOuter.x + penPos.x, this.frameOuter.y + penPos.y);


    }

    // convert a number to a money string (e.g. 1000 -> '1,000 $')
    toMoneyString(num: number): string
    {
        return num.toString() + ' $';
    }

    // set the numbers (cash, inventory, total) and make them visible
    newNumbers() {

        if (this.gameState === GameState.PLAYING) {

            // set numbers for cash and inventory
            this.cash = Mathphaser.RND.integerInRange(gameOptions.accountantRange.min, gameOptions.accountantRange.max) * gameOptions.accountantFactor;
            this.inventory = Mathphaser.RND.integerInRange(gameOptions.accountantRange.min, gameOptions.accountantRange.max) * gameOptions.accountantFactor;
            this.total = this.cash + this.inventory;
            const totalWithoutFactor = this.total / gameOptions.accountantFactor;       // calculate the total without the factor (to generate wrong results)

            // set text and make it visible
            this.cashText.setText(this.toMoneyString(this.cash));
            this.inventoryText.setText(this.toMoneyString(this.inventory));
            this.totalText.setText('???? $');
            this.numberGroup.setVisible(true);       // make all numbers visible

            // define answers for the buttons and make buttons visible
            let results = [];
            results.push(this.total);        // add the correct answer

            if (Mathphaser.RND.frac() <= gameOptions.accountantTenthProb) {        // check if by chance a wrong value with exactly +/- 10 is generated
                results.push((totalWithoutFactor + Mathphaser.RND.pick([-1, 1]) * 10) * gameOptions.accountantFactor);
            }

            if (Mathphaser.RND.frac() <= gameOptions.accountantTwenthyProb) {        // check if by chance a wrong value with exactly +/- 20 is generated
                results.push((totalWithoutFactor + Mathphaser.RND.pick([-1, 1]) * 20) * gameOptions.accountantFactor);
            }

            if (Mathphaser.RND.frac() <= gameOptions.accountantNumberSwitchProb && totalWithoutFactor % 10 !== 0) {        // check if by chance a number switch on the last two digits should be done, but only if the last digit is not 0

                const lastDigit = totalWithoutFactor % 10;
                const secondLastDigit = Math.floor((totalWithoutFactor % 100) / 10);
                const remaining = Math.floor(totalWithoutFactor / 100);

                results.push((remaining * 100 + lastDigit * 10 + secondLastDigit) * gameOptions.accountantFactor);        // switch the last two digits and multiply with the factor

            }

            for (let i = results.length; i < 4; i++) {          // fill up the remaining buttons with random values

                results.push((totalWithoutFactor + Mathphaser.RND.pick([-1, 1]) * Mathphaser.RND.integerInRange(gameOptions.accountantDeviation.min, gameOptions.accountantDeviation.max)) * gameOptions.accountantFactor);

            }

            let duplicates = true;                          // check for duplicates and replace them with new random values

            while (duplicates) {
                duplicates = false;

                for (let i = 0; i < results.length; i++) {

                    for (let j = i + 1; j < results.length; j++) {

                        if (results[i] === results[j]) {
                            duplicates = true;
                            results[j] = (totalWithoutFactor + Mathphaser.RND.pick([-1, 1]) * Mathphaser.RND.integerInRange(gameOptions.accountantDeviation.min, gameOptions.accountantDeviation.max)) * gameOptions.accountantFactor;
                        }
                    }
                }
            }

            // shuffle the results
            results = Utils.Array.Shuffle(results);

            // add possible results to buttons
            for (let i = 0; i < this.buttonGroup.getChildren().length; ++i) {

                const button = this.buttonGroup.getChildren()[i] as AccountantButton;
                button.setNumber(results[i]);
                button.setVisible(true);

            }

            this.buttonGroup.setVisible(true);

        }

    }

    // handle button click
    handleButtonClick(value: number) {

        // write button value to the total text
        this.totalText.setText(this.toMoneyString(this.cash));

        // check if the button value is correct
        if (value === this.total) {
            this.setProgress(this.progress + 1);
            this.validation.setFrame(1);
            this.soundManager.correctSound.play();

        } else {
            this.validation.setFrame(0);
            this.soundManager.errorSound.play();
        }

        this.validation.setVisible(true);

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
                this.validation.setVisible(false);        // hide validation sign
                this.newNumbers();                         // generate new numbers
            }
        });

        // hide buttons
        this.buttonGroup.setVisible(false);

    }

}
