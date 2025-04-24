import {GameObjects, Scene, Tweens, Types} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {ButtonId, GameState, Side} from '../helper/enums.ts';
import UIButton from '../sprites/UIButton.ts';
import {ResultFunction} from '../helper/interfaces.ts';
import gameManager from '../helper/GameManager.ts';

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
    public xIn: number;            // x position of the frame when it is inside (visible)
    private startButton: UIButton;
    private tweenFrameOut: Tweens.Tween;
    private tweenButtonOut: Tweens.Tween;
    private tweenTextsOut: Tweens.Tween;
    private tweenCountdown: Tweens.Tween;
    protected progress: number = 0;           // progress made during the game
    private progressText: GameObjects.Text;          // progress text (shows on the top right (work) or top left (life) the progress made

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
        const descriptionPosY = gameOptions.gameHeight * 0.40;

        // create frame (from background and frame and mask)
        this.frameBack = this.add.image(0, this.framePos,'frame-back').setDepth(0.5);
        this.frameOuter = this.add.image(0, this.framePos,'frame-outer').setDepth(2);
        this.frameMask = this.add.image(0, this.framePos,'frame-mask').setDepth(1.4).setAlpha(0.95);

        // titles and descriptions
        this.sideTitle = this.add.text(0, sideTitlePosY, 'Work', gameOptions.titleTextStyle).setOrigin(0.5).setDepth(1.5);
        this.title = this.add.text(0, titlePosY, this.titleString, gameOptions.subTitleTextStyle).setOrigin(0.5).setDepth(1.5);
        this.description = this.add.text(0, descriptionPosY, this.descriptionString, gameOptions.normalTextStyle).setOrigin(0.5, 0).setDepth(1.5).setWordWrapWidth(gameOptions.gameWidth * 0.3);

        // progress text
        this.progressText = this.add.text(0, 0, '100', gameOptions.progressTextStyle).setDepth(1.3).setVisible(false);
        const progressTextXOffset = 480;    // offset of the progress text from the edge of the scene
        let progressTextX = progressTextXOffset

        // define properties and add elements based on side
        if (this.side === Side.WORK) {

            // x positions of frames
            this.xOut = -this.frameBack.width;
            this.xIn = this.framePos;

            // frame origin
            this.frameBack.setOrigin(0);
            this.frameOuter.setOrigin(0);
            this.frameMask.setOrigin(0);

            // progress text
            this.progressText.setOrigin(1, 0);
            this.progressText.setText('10');

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

            // progress text
            this.progressText.setOrigin(0, 0);
            this.progressText.setText('100 %');
            progressTextX = gameOptions.gameWidth - progressTextXOffset;

            // titles and descriptions: Change text
            this.sideTitle.setText('Life');
        }

        // set start positions
        this.frameBack.setX(this.xOut);
        this.frameOuter.setX(this.xOut);
        this.frameMask.setX(this.xOut);
        this.sideTitle.setX(this.xOut + this.sideFactor * this.frameBack.width / 2);
        this.title.setX(this.sideTitle.x);
        this.description.setX(this.sideTitle.x);

        // set progress text position
        this.progressText.setPosition(progressTextX, 25);

        // countdown number
        this.countdown = this.add.text(this.xIn + this.sideFactor * this.frameBack.width / 2, gameOptions.gameHeight / 2, '3', gameOptions.titleTextStyle).setOrigin(0.5).setDepth(1.5).setScale(0);    // TODO: Change back to 3, this is only for faster testing

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

            // make progress text visible
            this.progressText.setVisible(true);
        });

        // change the game state when the game stops and move out the frame
        this.events.once('stopGame', () => {
            this.gameState = GameState.AFTER;
            this.frameMask.setVisible(true);
            this.tweenFrameOut.play();

            // make progress text invisible
            this.progressText.setVisible(false);
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

    // change progress
    setProgress(progress: number): void {

        this.progress = progress;

        // set progress text
        if (this.side === Side.WORK) {
            this.progressText.setText(Math.round(this.progress).toString());
        }
        else {
            this.progressText.setText(Math.round(this.progress).toString() + ' %');
        }

        // titles and description out
        this.tweens.add({
            targets: this.progressText,
            duration: 200,
            scale: 1.3,
            ease: 'Cubic.Out',
            yoyo: true,
            paused: false
        });

    }

    // calculate and store the result (multiplier (work) or points (life))
    calculateResult(progress: number, func: ResultFunction | ResultFunction[]): number {

        // initialize variables
        let slope = 1;
        let offset = 0;

        if (Array.isArray(func)) {          // array is provided (two segments)

            // calculate the segment change point
            const slope1 = func[0].slope;
            const offset1 = func[0].offset;
            const slope2 = func[1].slope;
            const offset2 = func[1].offset;
            const segmentChangeProgress = Math.round((offset2 - offset1) / (slope1 - slope2));

            if (progress < segmentChangeProgress) {        // first segment
                slope = slope1;
                offset = offset1;
            }
            else {                              // second segment
                slope = slope2;
                offset = offset2;
            }

        }
        else {                              // single function is provided
            slope = func.slope;
            offset = func.offset;
        }

        return Math.round(progress * slope + offset);        // calculate the result based on the progress and the function

    }


}
