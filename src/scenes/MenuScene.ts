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
    private button: UIButton;
    private tweenButtonIn: Phaser.Tweens.Tween;
    private tweenWorkOut: Phaser.Tweens.Tween;
    private tweenLifeOut: Phaser.Tweens.Tween;
    private tweenBalanceOut: Phaser.Tweens.Tween;
    private tweenButtonOut: Phaser.Tweens.Tween;
    private offsetX: number;
    private startY: number;
    private middle: number;
    private buttonDistanceY: number;

    constructor()
    {
        super('Menu');
    }

    create()
    {

        // parameters
        this.offsetX = gameOptions.gameWidth * 0.03;           // x offset the upper line to center them above the "Balance" text
        this.startY = gameOptions.gameHeight * 0.1;             // y position of the upper line ("Work - Life")
        this.middle = gameOptions.gameWidth / 2;                // middle position of the screen
        this.buttonDistanceY = gameOptions.gameHeight * 0.4;        // y distance between the lower line ("Balance") and the button

        // Title
        this.work = this.add.text(0, this.startY, 'Work', gameOptions.titleTextStyle).setOrigin(1, 0);
        this.life = this.add.text(gameOptions.gameWidth, this.startY, 'Life', gameOptions.titleTextStyle).setOrigin(0, 0);
        this.dash = this.add.text(this.middle + this.offsetX, this.startY, '-', gameOptions.titleTextStyle).setOrigin(0.5, 0).setVisible(false);
        this.balance = this.add.text(this.middle, gameOptions.gameHeight, 'B a l a n c e', gameOptions.titleTextStyle).setOrigin(0.5, 0);

        // button
        this.button = this.add.existing(new UIButton(this, this.middle, gameOptions.gameHeight + this.buttonDistanceY, 'Play', ButtonId.PLAY));
        this.button.deactivate();

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

            // deactivate the button
            this.button.deactivate();

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
                this.tweenButtonIn.play();        // play the button tween
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

        this.tweenButtonIn = this.tweens.add({
            targets: this.button,
            duration: inDuration / 2,
            y: this.startY + distanceY + this.buttonDistanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.button.activate();        // activate the button
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

        this.tweenLifeOut = this.tweens.add({
            targets: this.life,
            duration: outDuration,
            x: gameOptions.gameWidth,
            ease: outEase,
            paused: true
        });

        this.tweenBalanceOut = this.tweens.add({
            targets: this.balance,
            duration: outDuration,
            y: gameOptions.gameHeight,
            ease: outEase,
            paused: true
        });

        this.tweenButtonOut = this.tweens.add({
            targets: this.button,
            duration: outDuration / 2,
            y: gameOptions.gameHeight + this.buttonDistanceY,
            ease: outEase,
            paused: true,
            onComplete: () => {
                this.tweenWorkOut.play();
                this.tweenLifeOut.play();
                this.tweenBalanceOut.play();
            }
        });

    }
}
