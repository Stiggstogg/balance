import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import UIButton from "../sprites/UIButton.ts";
import {ButtonId} from "../helper/enums.ts";
import gameManager from '../helper/GameManager.ts';
import SoundManager from '../helper/SoundManager.ts';

export default class MenuScene extends Scene
{
    private work: GameObjects.Text;
    private life: GameObjects.Text;
    private dash: GameObjects.Text;
    private balance: GameObjects.Text;
    private description: GameObjects.Text;
    private button: UIButton;
    private creditsButton: UIButton;
    private tweenWorkOut: Phaser.Tweens.Tween;
    private tweenButtonOut: Phaser.Tweens.Tween;
    private offsetX: number;
    private startY: number;
    private middle: number;
    private buttonDistanceY: number;
    private descriptionDistanceY: number;

    constructor()
    {
        super('Menu');
    }

    create()
    {

        // parameters
        this.offsetX = gameOptions.gameWidth * 0.03;                // x offset the upper line to center them above the "Balance" text
        this.startY = gameOptions.gameHeight * 0.05;                // y position of the upper line ("Work - Life")
        this.middle = gameOptions.gameWidth / 2;                    // middle position of the screen
        this.descriptionDistanceY = gameOptions.gameHeight * 0.4;   // y distance between the lower line ("Balance") and the description
        this.buttonDistanceY = gameOptions.gameHeight * 0.35;        // y distance between the lower line ("Balance") and the button

        // Title
        this.work = this.add.text(0, this.startY, 'Work', gameOptions.titleTextStyle).setOrigin(1, 0);
        this.life = this.add.text(gameOptions.gameWidth, this.startY, 'Life', gameOptions.titleTextStyle).setOrigin(0, 0);
        this.dash = this.add.text(this.middle + this.offsetX, this.startY, '-', gameOptions.titleTextStyle).setOrigin(0.5, 0).setVisible(false);
        this.balance = this.add.text(this.middle, gameOptions.gameHeight, 'B a l a n c e', gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // description
        this.description = this.add.text(0, this.startY + this.descriptionDistanceY,
            'You juggle two jobs and a whirlwind of daily life tasks. Each day, you must tackle one work task and one life task — simultaneously!\n' +
            'Find your balance and complete all tasks across ' + gameManager.getTotalStages().toString() + ' demanding days to maximize your score and prove you can handle it all.',
            gameOptions.normalTextStyle).setOrigin(0.5, 0);
        this.description.setX(gameOptions.gameWidth + this.description.width);
        this.description.setWordWrapWidth(gameOptions.gameWidth * 0.70);        // set word wrap width

        // Play button
        this.button = this.add.existing(new UIButton(this, this.middle, gameOptions.gameHeight + this.buttonDistanceY, 'Play', ButtonId.PLAY));
        this.button.deactivate();

        // Credits button
        this.creditsButton = this.add.existing(new UIButton(this, gameOptions.gameWidth * 0.12, 0, 'Credits', ButtonId.CREDITS));
        this.creditsButton = this.creditsButton.setY(gameOptions.gameHeight + this.creditsButton.image.height /2);
        this.creditsButton.deactivate();

        // add and play menu song
        const soundManager =  SoundManager.getInstance(this);                                    // get the sound manager

        if (!soundManager.menuSong.isPlaying) {                                                 // play the menu song if it is not playing yet
            soundManager.menuSong.play({volume: gameOptions.menuSongVolume});                   // gameOptions.menuSongVolume);
        }

        // stop the points song (however, should not be playing anyway)
        soundManager.pointsSong.stop();

        // add tweens
        this.addTweens();

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.PLAY, () => {

            // create a new game
            gameManager.newGame();

            // move the title and the button away
            this.tweenButtonOut.play();             // this will also trigger the other tweens (on complete)

            // launch the game scene as soon as the tweens are done
            this.tweenWorkOut.once('complete', () => {

                this.time.addEvent({            // wait a bit and then start the game
                    delay: 500,
                    callback: () => {
                        this.scene.launch('Game');
                        this.scene.stop();
                    }
                });

            });

        });

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.CREDITS, () => {

            // move the title and the button away
            this.tweenButtonOut.play();             // this will also trigger the other tweens (on complete)

            // launch the game scene as soon as the tweens are done
            this.tweenWorkOut.once('complete', () => {

                this.time.addEvent({            // wait a bit and then start the game
                    delay: 500,
                    callback: () => {
                        this.scene.launch('Credits');
                        this.scene.stop();
                    }
                });

            });

        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.PLAY);
            this.events.off('click' + ButtonId.CREDITS);
            this.tweenWorkOut.off('complete');
        });


    }

    // add and play tweens
    addTweens() {

        // moving in
        // -----------

        // parameters
        const inDuration = 1000;
        const inEase = 'Cubic.Out';

        // positions
        const distanceX = gameOptions.gameWidth * 0.05;         // x distance between "Work" and "Life"
        const distanceY = gameOptions.gameHeight * 0.17;        // y distance between "Work - Life" and "Balance"

        this.tweens.add({
            targets: this.work,
            duration: inDuration,
            x: this.middle - distanceX/2 + this.offsetX,
            ease: inEase,
            paused: false,
            onComplete: () => {
                this.dash.setVisible(true);     // make dash visible

                // bring the description
                tweenDescriptionIn.play();
            }
        });

        this.tweens.add({
            targets: this.life,
            duration: inDuration,
            x: this.middle + distanceX/2 + this.offsetX,
            ease: inEase,
            paused: false
        });

        this.tweens.add({
            targets: this.balance,
            duration: inDuration,
            y: this.startY + distanceY,
            ease: inEase,
            paused: false,
        });

        const tweenDescriptionIn = this.tweens.add({
            targets: this.description,
            duration: inDuration,
            x: gameOptions.gameWidth / 2,
            ease: inEase,
            paused: true,
            onComplete: () => {
                // bring the button in
                tweenButtonIn.play();
            }
        });

        const tweenButtonIn = this.tweens.add({
            targets: this.button,
            duration: inDuration / 2,
            y: this.startY + this.descriptionDistanceY + this.buttonDistanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.button.activate();         // activate the button
                tweenCreditsButtonIn.play();    // bring in the credits button
            }
        });

        const tweenCreditsButtonIn = this.tweens.add({
            targets: this.creditsButton,
            duration: inDuration / 2,
            y: gameOptions.gameHeight * 0.92,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.creditsButton.activate();        // activate the button
            }
        });

        // moving out
        // -----------

        // parameters
        const outDuration = 500;
        const outEase = 'Cubic.In';

        this.tweenWorkOut = this.tweens.add({
            targets: this.work,
            duration: outDuration,
            x: 0,
            ease: outEase,
            paused: true,
            onStart: () => {
                this.dash.setVisible(false);     // make dash invisible
            }
        });

        const tweenLifeOut = this.tweens.add({
            targets: this.life,
            duration: outDuration,
            x: gameOptions.gameWidth,
            ease: outEase,
            paused: true
        });

        const tweenBalanceOut = this.tweens.add({
            targets: this.balance,
            duration: outDuration,
            y: gameOptions.gameHeight,
            ease: outEase,
            paused: true
        });

        const tweenDescriptionOut = this.tweens.add({
            targets: this.description,
            duration: outDuration / 2,
            x: gameOptions.gameWidth + this.description.width,
            ease: outEase,
            paused: true
        });

        this.tweenButtonOut = this.tweens.add({
            targets: this.button,
            duration: outDuration / 2,
            y: gameOptions.gameHeight + this.buttonDistanceY,
            ease: outEase,
            paused: true,
            onStart: () => {
                this.button.deactivate();        // deactivate the button
                tweenCreditsButtonOut.play();    // move the credits button out
                tweenDescriptionOut.play();        // move the description out
            },
            onComplete: () => {
                this.tweenWorkOut.play();
                tweenLifeOut.play();
                tweenBalanceOut.play();
            }
        });

        const tweenCreditsButtonOut = this.tweens.add({
            targets: this.creditsButton,
            duration: inDuration / 2,
            y: gameOptions.gameHeight + this.creditsButton.image.height / 2,
            ease: inEase,
            paused: true,
            onSTart: () => {
                this.creditsButton.deactivate();        // activate the button
            }
        });

    }
}
