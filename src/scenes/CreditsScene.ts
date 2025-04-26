import {GameObjects, Scene, Tweens} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import UIButton from "../sprites/UIButton.ts";
import {ButtonId} from "../helper/enums.ts";

export default class CreditsScene extends Scene
{
    private title: GameObjects.Text;
    private creditsTitles: GameObjects.Text;
    private creditsTexts: GameObjects.Text;
    private button: UIButton;
    private titleY: number;
    private buttonY: number;
    private creditsDistanceY: number;
    private creditsTitleX: number;
    private creditsTextX: number;
    private tweenDuration: number;
    private tweenEaseIn: string;
    private tweenEaseOut: string;
    private tweenOut: Tweens.TweenChain;

    constructor()
    {
        super('Credits');
    }

    create()
    {

        // parameters
        this.titleY = gameOptions.gameHeight * 0.05;
        this.buttonY = gameOptions.gameHeight * 0.90;
        this.creditsDistanceY = gameOptions.gameHeight * 0.2;
        this.creditsTitleX = gameOptions.gameWidth * 0.20;
        this.creditsTextX = gameOptions.gameWidth * 0.37;

        // Create UI elements
        this.title = this.add.text(gameOptions.gameWidth / 2, 0, 'Credits', gameOptions.titleTextStyle).setOrigin(0.5, 0);
        this.title.setY(-this.title.height);
        this.creditsTitles = this.add.text(gameOptions.gameWidth, this.titleY + this.creditsDistanceY, '', gameOptions.normalTextStyle).setOrigin(0, 0);
        this.creditsTexts = this.add.text(gameOptions.gameWidth + this.creditsTextX - this.creditsTitleX, this.titleY + this.creditsDistanceY, '', gameOptions.normalTextStyle).setOrigin(0, 0);
        this.button = this.add.existing(new UIButton(this, gameOptions.gameWidth / 2, 0, 'Back', ButtonId.BACK));
        this.button.deactivate();
        this.button.setY(gameOptions.gameHeight + this.button.image.height / 2);

        // Add credits
        this.creditsTitles.setText(
            'Special thanks to my support and inspiration at home!\n' +
            'Thanks to my play testers.\n\n' +
            'Code:\n' +
            'Graphics:\n' +
            'Music:\n' +
            'Sound effects:\n' +
            'Framework:\n' +
            'Tools:\n'
        );

        this.creditsTexts.setText(
            '\n' +
            '\n\n' +
            'Home made typescript spaghetti code\n' +
            'Inspired by AI, hand drawn by me\n' +
            'Original compositions played on my instruments\n' +
            'My Bosch power tool (lawn mower) and my instruments\n' +
            'Phaser 3\n' +
            'vite.js, Webstorm, Aseprite and Reaper'
        );


        // add tweens
        this.tweenDuration = 1000;
        this.tweenEaseIn = 'Cubic.Out';
        this.tweenEaseOut = 'Cubic.In';
        this.tweensIn();
        this.tweensOut();

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.BACK, () => {

            // move the texts away
            this.tweenOut.play();

            this.tweenOut.once('complete', () => {
                // go to the menu scene (when everything is moved out)
                this.scene.launch('Menu');
                this.scene.stop();
            });

        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.BACK);
            this.tweenOut.off('complete');
        });

    }

    // add and play tweens
    tweensIn() {

        this.tweens.chain({
            tweens: [
                {
                    targets: this.title,
                    duration: this.tweenDuration,
                    y: this.titleY,
                    ease: this.tweenEaseIn
                },
                {
                    targets: this.creditsTitles,
                    duration: this.tweenDuration / 2,
                    x: this.creditsTitleX,
                    ease: this.tweenEaseIn,
                    onStart: () => {
                        this.tweens.add({
                            targets: this.creditsTexts,
                            duration: this.tweenDuration / 2,
                            x: this.creditsTextX,
                            ease: this.tweenEaseIn
                        })
                    }
                },
                {
                    targets: this.button,
                    duration: this.tweenDuration / 2,
                    y: this.buttonY,
                    ease: this.tweenEaseIn,
                    onComplete: () => {
                        this.button.activate();
                    }
                }
            ]
        });
    }


    tweensOut() {

        this.tweenOut = this.tweens.chain({
            tweens: [
                {
                    targets: this.button,
                    duration: this.tweenDuration / 2,
                    y: gameOptions.gameHeight + this.button.image.height / 2,
                    ease: this.tweenEaseOut,
                    onStart: () => {
                        this.button.deactivate();
                    }
                },
                {
                    targets: this.creditsTitles,
                    duration: this.tweenDuration / 2,
                    x: gameOptions.gameWidth,
                    ease: this.tweenEaseOut,
                    onStart: () => {
                        this.tweens.add({
                            targets: this.creditsTexts,
                            duration: this.tweenDuration / 2,
                            x: gameOptions.gameWidth + this.creditsTextX - this.creditsTitleX,
                            ease: this.tweenEaseOut
                        })
                    }
                },
                {
                    targets: this.title,
                    duration: this.tweenDuration / 2,
                    y: -this.title.height,
                    ease: this.tweenEaseOut
                },
            ],
            paused: true,
        });

    }
}
