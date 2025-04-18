import {GameObjects, Scene, Tweens, Types} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {ButtonId, GameState, Side} from '../helper/enums.ts';
import UIButton from '../sprites/UIButton.ts';

// Basic frame scene class with the frame and common elements
export default class BaseFrameScene extends Scene
{

    protected gameState: GameState;
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
    public frameOuter: GameObjects.Image;
    private frameMask: GameObjects.Image;
    private xOut: number;           // x position of the frame when it is outside (invisible)
    private xIn: number;            // x position of the frame when it is inside (visible)
    private startButton: UIButton;
    private tweenFrameOut: Tweens.Tween;
    private tweenButtonOut: Tweens.Tween;
    private tweenTextsOut: Tweens.Tween;
    private tweenCountdown: Tweens.Tween;
    protected points: number = 0;           // points for the current scene

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

        // set game state
        this.gameState = GameState.BEFORE;

        // positions
        const sideTitlePosY = gameOptions.gameHeight * 0.15;
        const titlePosY = gameOptions.gameHeight * 0.3;
        const descriptionPosY = gameOptions.gameHeight * 0.50;

        // create frame (from background and frame and mask)
        this.frameBack = this.add.image(0, this.framePos,'frame-back').setDepth(0.5);
        this.frameOuter = this.add.image(0, this.framePos,'frame-outer').setDepth(2);
        this.frameMask = this.add.image(0, this.framePos,'frame-mask').setDepth(1.4).setAlpha(0.95);

        // titles and descriptions
        this.sideTitle = this.add.text(0, sideTitlePosY, 'Work', gameOptions.titleTextStyle).setOrigin(0.5).setDepth(1.5);
        //this.sideTitle.setText('Title Left');       // TODO: Remove at the end, just for video recording before full game reveal
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
            this.frameMask.setOrigin(0);

            // start button
            this.startButton = this.add.existing(new UIButton(this, this.buttonPos.x, 0, 'Start', ButtonId.START));
            this.startButton.setY(gameOptions.gameHeight + this.startButton.height/2).setDepth(3).deactivate();

        } else {

            // x positions of frames
            this.xOut = gameOptions.gameWidth + this.frameBack.width;
            this.xIn = gameOptions.gameWidth - this.framePos;

            // frame origin and flip
            this.frameBack.setOrigin(1, 0).setFlipX(true);
            this.frameOuter.setOrigin(1, 0).setFlipX(true);
            this.frameMask.setOrigin(1, 0).setFlipX(true);

            // titles and descriptions: Change text
            this.sideTitle.setText('Life');
            // this.sideTitle.setText('Title Right');       // TODO: Remove at the end, just for video recording before full game reveal
        }

        // TODO: Remove this, at the end, as it is only needed to setup the assets in the scene during development
        // this.sideTitle.setVisible(false);
        // this.title.setVisible(false);
        // this.description.setVisible(false);

        // set start positions
        this.frameBack.setX(this.xOut);
        this.frameOuter.setX(this.xOut);
        this.frameMask.setX(this.xOut);
        this.sideTitle.setX(this.xOut + this.sideFactor * this.frameBack.width / 2);
        this.title.setX(this.sideTitle.x);
        this.description.setX(this.sideTitle.x);

        // countdown number
        this.countdown = this.add.text(this.xIn + this.sideFactor * this.frameBack.width / 2, gameOptions.gameHeight / 2, '1', gameOptions.titleTextStyle).setOrigin(0.5).setDepth(1.5).setScale(0);    // TODO: Change back to 3, this is only for faster testing

        // add tweens (and play the first one)
        this.addTweens();

        // add event listeners
        this.events.once('click' + ButtonId.START, () => {

            if (this.side === Side.WORK) {

                // deactivate button
                this.startButton.deactivate();

                // remove the button
                this.tweenButtonOut.play();

                // send an event to the game scene to make sure it sends the same event to the current life scene
                this.scene.get('Game').events.emit('click' + ButtonId.START);

            }

            this.tweenTextsOut.play();

        });

        // start the countdown as soon as the texts are hidden
        this.tweenTextsOut.once('complete', () => {
            this.startCountdown();
        });

        // change game state when the game starts
        this.events.once('startGame', () => {
            this.gameState = GameState.PLAYING;
        });

        // change the game state when the game stops and move out the frame
        this.events.once('stopGame', () => {
            this.gameState = GameState.AFTER;
            this.frameMask.setVisible(true);
            this.tweenFrameOut.play();
        });

    }

    // add tweens
    private addTweens(): void {

        // frame in
        this.tweens.add({
            targets: [this.frameBack, this.frameOuter, this.frameMask],
            duration: gameOptions.frameTweenLength,
            x: this.xIn,
            ease: 'Power2',
            paused: false               // will directly play the tween
        });

        // titles and description in
        this.tweens.add({
            targets: [this.sideTitle, this.title, this.description],
            duration: gameOptions.frameTweenLength,
            x: this.xIn + this.sideFactor * this.frameBack.width / 2,
            ease: 'Power2',
            paused: false               // will directly play the tween
        });

        // button in and out (only for work scene)
        if (this.side === Side.WORK) {

            // button in
            this.tweens.add({
                targets: this.startButton,
                duration: gameOptions.frameTweenLength / 2,
                delay: gameOptions.frameTweenLength / 2,
                y: this.buttonPos.y,
                ease: 'Cubic.Out',
                paused: false,
                onComplete: () => {
                    this.startButton.activate();
                }
            });

            // button out
            this.tweenButtonOut = this.tweens.add({
                targets: [this.startButton],
                duration: gameOptions.frameTweenLength / 2,
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
            duration: gameOptions.frameTweenLength / 4,
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
            targets: [this.frameBack, this.frameOuter, this.frameMask],
            duration: gameOptions.frameTweenLength,
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
                    this.frameMask.setVisible(false);
                    this.events.emit('startGame');

                }

            }
        });

    }


}
