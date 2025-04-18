import {GameObjects, Scene, Types, Tweens} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {ButtonId, Side} from '../helper/enums.ts';
import Button from '../sprites/Button.ts';

// Basic frame scene class with the frame and common elements
export default class BaseFrameScene extends Scene
{

    private side: Side;
    private sideFactor: number;        // side factor (work: 1, life: -1)
    private sideTitle: GameObjects.Text;
    private titleString: string;
    private title: GameObjects.Text;
    private countdown: GameObjects.Text;          // countdown time
    private descriptionString: string;
    private description: GameObjects.Text;
    private framePos: number;                                  // frame position (distance from the edges)
    private buttonPos: { x: number; y: number };                // button position
    private frameBack: GameObjects.Image;
    private frameOuter: GameObjects.Image;
    private xOut: number;           // x position of the frame when it is outside (invisible)
    private xIn: number;            // x position of the frame when it is inside (visible)
    private startButton: Button;
    private tweenFrameOut: Tweens.Tween;
    private tweenButtonOut: Tweens.Tween;
    private tweenTextsOut: Tweens.Tween;
    private tweenCountdown: Tweens.Tween;

    constructor(side: Side, titleString: string, descriptionString: string, config?: string | Types.Scenes.SettingsConfig)
    {
        super(config);

        this.side = side;
        this.titleString = titleString;
        this.descriptionString = descriptionString;
        this.sideFactor = (this.side === Side.WORK) ? 1 : -1;

        // frame positions (distance from the edges)
        this.framePos = 4;
        this.buttonPos = { x: gameOptions.gameWidth / 2, y: gameOptions.gameHeight * 0.85 }; // button position

    }

    // Add basic elements
    create(): void {

        // positions
        const sideTitlePosY = gameOptions.gameHeight * 0.15;
        const titlePosY = gameOptions.gameHeight * 0.3;
        const descriptionPosY = gameOptions.gameHeight * 0.50;

        // create frame (from background and frame)
        this.frameBack = this.add.image(0, this.framePos,'frame-back').setDepth(0.5);
        this.frameOuter = this.add.image(0, this.framePos,'frame-outer').setDepth(2);

        // titles and descriptions
        this.sideTitle = this.add.text(0, sideTitlePosY, 'Work', gameOptions.titleTextStyle).setOrigin(0.5).setDepth(1.5);
        this.title = this.add.text(0, titlePosY, this.titleString, gameOptions.subTitleTextStyle).setOrigin(0.5).setDepth(1.5);
        this.description = this.add.text(0, descriptionPosY, this.descriptionString, gameOptions.normalTextStyle).setOrigin(0.5).setDepth(1.5);

        // define properties and add elements based on side
        if (this.side === Side.WORK) {

            // x positions of frames
            this.xOut = -this.frameBack.width;
            this.xIn = this.framePos;

            // frame origin
            this.frameBack.setOrigin(0);
            this.frameOuter.setOrigin(0);

            // start button
            this.startButton = this.add.existing(new Button(this, this.buttonPos.x, 0, 'Start', ButtonId.START));
            this.startButton.setY(gameOptions.gameHeight + this.startButton.height/2).setDepth(3);

        } else {

            // x positions of frames
            this.xOut = gameOptions.gameWidth + this.frameBack.width;
            this.xIn = gameOptions.gameWidth - this.framePos;

            // frame origin and flip
            this.frameBack.setOrigin(1, 0).setFlipX(true);
            this.frameOuter.setOrigin(1, 0).setFlipX(true);

            // titles and descriptions: Change text
            this.sideTitle.setText('Life');
        }

        // set start positions
        this.frameBack.setX(this.xOut);
        this.frameOuter.setX(this.xOut);
        this.sideTitle.setX(this.xOut + this.sideFactor * this.frameBack.width / 2);
        this.title.setX(this.sideTitle.x);
        this.description.setX(this.sideTitle.x);

        // countdown number
        this.countdown = this.add.text(this.xIn + this.sideFactor * this.frameBack.width / 2, gameOptions.gameHeight / 2, '3', gameOptions.titleTextStyle).setOrigin(0.5).setDepth(1.5).setScale(0);

        // add tweens (and play the first one)
        this.addTweens();

        // add event listeners
        this.events.on('click' + ButtonId.START, () => {

            if (this.side === Side.WORK) {

                // remove the button
                this.tweenButtonOut.play();

                // send an event to the game scene to make sure it sends the same event to the current life scene
                this.scene.get('Game').events.emit('click' + ButtonId.START);

            }

            this.tweenTextsOut.play();

        });

        this.tweenTextsOut.on('complete', () => {
            this.startCountdown();
        });

    }

    // add tweens
    private addTweens(): void {

        const frameTime = 1000;

        // frame in
        this.tweens.add({
            targets: [this.frameBack, this.frameOuter],
            duration: frameTime,
            x: this.xIn,
            ease: 'Power2',
            paused: false               // will directly play the tween
        });

        // titles and description in
        this.tweens.add({
            targets: [this.sideTitle, this.title, this.description],
            duration: frameTime,
            x: this.xIn + this.sideFactor * this.frameBack.width / 2,
            ease: 'Power2',
            paused: false               // will directly play the tween
        });

        // button in and out (only for
        if (this.side === Side.WORK) {
            this.tweens.add({
                targets: [this.startButton],
                duration: frameTime / 2,
                delay: frameTime / 2,
                y: this.buttonPos.y,
                ease: 'Cubic.Out',
                paused: false
            });

            // button out
            this.tweenButtonOut = this.tweens.add({
                targets: [this.startButton],
                duration: frameTime / 2,
                delay: 0,
                y: gameOptions.gameHeight + this.startButton.height/2,
                ease: 'Cubic.In',
                paused: true,
                onComplete: () => {
                    this.startButton.destroy();
                }
            });
        }

        // titles and description out
        this.tweenTextsOut = this.tweens.add({
            targets: [this.sideTitle, this.title, this.description],
            duration: frameTime / 4,
            scale: 0,
            ease: 'Cubic.Out',
            paused: true,
            onComplete: () => {
                this.sideTitle.destroy();
                this.title.destroy();
                this.description.destroy();
            }
        });

        this.tweenFrameOut = this.tweens.add({
            targets: [this.frameBack, this.frameOuter],
            duration: frameTime,
            x: this.xOut,
            ease: 'Cubic.In',
            paused: true
        });

    }

    // start countdown
    private startCountdown(): void {

        // create the countdown tween
        this.tweenCountdown = this.tweens.add({
            targets: this.countdown,
            duration: 1000,
            scale: 1,
            ease: 'Cubic.Out',
            paused: false,
            onComplete: () => {

                // get number
                const countNumber: number = Number(this.countdown.text);

                if (!isNaN(countNumber)) {

                    if (countNumber === 1) {
                        // set new number
                        this.countdown.setText('GO!')
                    }
                    else {
                        this.countdown.setText((countNumber - 1).toString());
                    }

                    this.tweenCountdown.play();
                }
                else {

                    // destroy the countdown
                    this.countdown.destroy();

                }

            }
        });

    }


}
