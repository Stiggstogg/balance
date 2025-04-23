import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import UIButton from "../sprites/UIButton.ts";
import {ButtonId} from "../helper/enums.ts";
import gameManager from '../helper/GameManager.ts';

export default class PointsScene extends Scene
{
    private title: GameObjects.Text;
    private stageTitle: GameObjects.Text;
    private workTitle: GameObjects.Text;
    private lifeTitle: GameObjects.Text;
    private workProgressName: GameObjects.Text;
    private workProgressValue: GameObjects.Text;
    private workMultiplierName: GameObjects.Text;
    private workMultiplierValue: GameObjects.Text;
    private lifeProgressName: GameObjects.Text;
    private lifeProgressValue: GameObjects.Text;
    private lifePointsName: GameObjects.Text;
    private lifePointsValue: GameObjects.Text;
    private totalPointsTitle: GameObjects.Text;
    private totalPointsValue: GameObjects.Text;

    private startY: number;
    private distanceY: number;
    private positionLeftRight: number;
    private positionLeftRightDistance: number;

    private tweenHideDescriptions: Phaser.Tweens.Tween;
    private tweenTotalButtonOut: Phaser.Tweens.Tween;
    private tweenContinueButtonOut: Phaser.Tweens.Tween;
    private tweenStopButtonOut: Phaser.Tweens.Tween;
    private tweenTitleOut: Phaser.Tweens.Tween;
    private tweenStageTitleOut: Phaser.Tweens.Tween;
    private tweenTotalPointsTitleOut: Phaser.Tweens.Tween;
    private tweenTotalPointsValueOut: Phaser.Tweens.Tween;

    private totalButton: UIButton;
    private continueButton: UIButton;
    private stopButton: UIButton;

    constructor()
    {
        super('Points');
    }

    create()
    {

        // parameters (positions)
        this.startY = gameOptions.gameHeight * 0.2;        // y position of title
        this.distanceY = gameOptions.gameHeight * 0.03;    // y distance between different elements
        this.positionLeftRight = gameOptions.gameWidth * 0.3;    // position (middle) of the left and right elements (work and life)
        this.positionLeftRightDistance = gameOptions.gameWidth * 0.01;    // distance from the middle of the left and right side of the screen

        // Title
        this.title = this.add.text(gameOptions.gameWidth / 2, 0, 'Points', gameOptions.titleTextStyle).setOrigin(0.5, 1);

        // Stage title
        this.stageTitle = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight, 'Stage ' + gameManager.getStage() + ' / ' + gameManager.getTotalStages(), gameOptions.smallTitleTextStyle).setOrigin(0.5, 0);

        // Work and life titles and descriptions
        this.workTitle = this.add.text(0, this.startY + 5 * this.distanceY, 'Work' , gameOptions.smallTitleTextStyle).setOrigin(0.5, 0);
        this.lifeTitle = this.add.text(gameOptions.gameWidth, this.startY + 5 * this.distanceY, 'Life', gameOptions.smallTitleTextStyle).setOrigin(0.5, 0);
        this.workTitle.setX(this.workTitle.x - this.workTitle.width / 2);
        this.lifeTitle.setX(this.lifeTitle.x + this.lifeTitle.width / 2);

        this.workProgressName = this.add.text(this.positionLeftRight - this.positionLeftRightDistance, gameOptions.gameHeight, gameManager.getWorkProgressDescription(), gameOptions.smallSubTitleTextStyle).setOrigin(1, 0);
        this.workMultiplierName = this.add.text(this.positionLeftRight - this.positionLeftRightDistance, gameOptions.gameHeight + 4 * this.distanceY,'Multiplier:', gameOptions.smallSubTitleTextStyle).setOrigin(1, 0);

        this.lifeProgressName = this.add.text(gameOptions.gameWidth - this.positionLeftRight - this.positionLeftRightDistance, gameOptions.gameHeight, gameManager.getLifeProgressDescription(), gameOptions.smallSubTitleTextStyle).setOrigin(1, 0);
        this.lifePointsName = this.add.text(gameOptions.gameWidth - this.positionLeftRight - this.positionLeftRightDistance, gameOptions.gameHeight + 4 * this.distanceY,'Points:', gameOptions.smallSubTitleTextStyle).setOrigin(1, 0);

        this.workProgressValue = this.add.text(this.positionLeftRight + this.positionLeftRightDistance, this.startY + 9 * this.distanceY, gameManager.getWorkProgress().toString(), gameOptions.smallSubTitleTextStyle).setOrigin(0, 0).setVisible(false);
        this.workMultiplierValue = this.add.text(this.positionLeftRight + this.positionLeftRightDistance, this.startY + 13 * this.distanceY, 'x ' + gameManager.getWorkMultiplier().toString(), gameOptions.smallSubTitleTextStyle).setOrigin(0, 0).setVisible(false);

        this.lifeProgressValue = this.add.text(gameOptions.gameWidth - this.positionLeftRight + this.positionLeftRightDistance, this.startY + 9 * this.distanceY, gameManager.getLifeProgress().toString() + '%', gameOptions.smallSubTitleTextStyle).setOrigin(0, 0).setVisible(false);
        this.lifePointsValue = this.add.text(gameOptions.gameWidth - this.positionLeftRight + this.positionLeftRightDistance, this.startY + 13 * this.distanceY, gameManager.getLifePoints().toString(), gameOptions.smallSubTitleTextStyle).setOrigin(0, 0).setVisible(false);

        // total points
        this.totalPointsTitle = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight, 'Total Points', gameOptions.smallTitleTextStyle).setOrigin(0.5, 0);
        this.totalPointsValue = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight + 4 * this.distanceY, gameManager.getTotalPoints().toString(), gameOptions.smallTitleTextStyle).setOrigin(0.5, 0);

        // buttons
        this.totalButton = this.add.existing(new UIButton(this, gameOptions.gameWidth / 2, 0, 'Total', ButtonId.TOTAL));
        this.totalButton.setY(gameOptions.gameHeight + this.totalButton.image.height/2);
        this.totalButton.deactivate();

        this.continueButton = this.add.existing(new UIButton(this, gameOptions.gameWidth / 2, 0, 'Continue', ButtonId.CONTINUE));
        this.continueButton.setY(gameOptions.gameHeight + this.continueButton.image.height/2);
        this.continueButton.deactivate();

        this.stopButton = this.add.existing(new UIButton(this, gameOptions.gameWidth * 0.12, 0, 'Stop', ButtonId.STOP));
        this.stopButton.setY(gameOptions.gameHeight + this.stopButton.image.height/2);
        this.stopButton.deactivate();

        // Button to go to the total point calculation
        this.events.once('click' + ButtonId.TOTAL, () => {

            this.tweenHideDescriptions.play();
            this.tweenTotalButtonOut.play();        // move button out and deactivate it

        });

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.CONTINUE, () => {

            // move buttons out
            this.tweenContinueButtonOut.play();
            this.tweenStopButtonOut.play();

            // move titles and total points out
            this.tweenTitleOut.play();
            this.tweenStageTitleOut.play();
            this.tweenTotalPointsTitleOut.play();
            this.tweenTotalPointsValueOut.play();

            // go to the next stage
            gameManager.nextStage();

            this.tweenTitleOut.once('complete', () => {
                this.scene.start('Game');
            });

        });

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.STOP, () => {

            // move buttons out
            this.tweenContinueButtonOut.play();
            this.tweenStopButtonOut.play();

            // move titles and total points out
            this.tweenTitleOut.play();
            this.tweenStageTitleOut.play();
            this.tweenTotalPointsTitleOut.play();
            this.tweenTotalPointsValueOut.play();

            this.tweenTitleOut.once('complete', () => {
                this.scene.start('Menu');
            });


        });

        // add tweens
        this.addTweens();

    }

    // add and play tweens
    addTweens() {

        // parameters
        const inDuration = 500;                                     // duration of the tween
        const inEase = 'Cubic.Out';                                 // ease function

        // title in
        this.tweens.add({
            targets: this.title,
            duration: inDuration,
            y: this.startY,
            ease: inEase,
            paused: false,
            onComplete: () => {                                      // show the button when the title is in
                tweenWorkIn.play();                                     // play the work title tween
                tweenLifeIn.play();                                     // play the life title tween
            }
        });

        // Stage title in
        this.tweens.add({
            targets: this.stageTitle,
            duration: inDuration,
            y: this.startY + this.distanceY * 0.25,
            ease: inEase,
            paused: false
        });

        // Work title in
        const tweenWorkIn = this.tweens.add({
            targets: this.workTitle,
            duration: inDuration,
            x: this.positionLeftRight,
            ease: inEase,
            paused: true,
            onComplete: () => {
                progressNameIn.play();
                multiplierPointsNameIn.play();
            }
        });

        // Life title in
        const tweenLifeIn = this.tweens.add({
            targets: this.lifeTitle,
            duration: inDuration,
            x: gameOptions.gameWidth - this.positionLeftRight,
            ease: inEase,
            paused: true
        });

        // Work and life progress names in
        const progressNameIn = this.tweens.add({
            targets: [this.workProgressName, this.lifeProgressName],
            duration: inDuration,
            y: this.startY + 9 * this.distanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {
                workProgressValueIn.play();                         // play the work progress value tween
            }
        });

        // Work and life multiplier / points names in
        const multiplierPointsNameIn = this.tweens.add({
            targets: [this.workMultiplierName, this.lifePointsName],
            delay: inDuration / 2,
            duration: inDuration,
            y: this.startY + 13 * this.distanceY,
            ease: inEase,
            paused: true
        });

        // work progess value in
        const workProgressValueIn = this.tweens.add({
            targets: this.workProgressValue,
            delay: inDuration,
            duration: inDuration / 4,
            scale: 1.3,
            ease: inEase,
            yoyo: true,
            paused: true,
            onStart: () => {
                this.workProgressValue.setVisible(true);            // show the work progress value
            },
            onComplete: () => {
                workMultiplierValueIn.play();
            }
        });

        // work multiplier value in
        const workMultiplierValueIn = this.tweens.add({
            targets: this.workMultiplierValue,
            delay: inDuration,
            duration: inDuration / 4,
            scale: 1.3,
            ease: inEase,
            yoyo: true,
            paused: true,
            onStart: () => {
                this.workMultiplierValue.setVisible(true);            // show the work progress value
            },
            onComplete: () => {
                lifeProgressValueIn.play();
            }
        });

        // life progess value in
        const lifeProgressValueIn = this.tweens.add({
            targets: this.lifeProgressValue,
            delay: inDuration,
            duration: inDuration / 4,
            scale: 1.3,
            ease: inEase,
            yoyo: true,
            paused: true,
            onStart: () => {
                this.lifeProgressValue.setVisible(true);            // show the work progress value
            },
            onComplete: () => {
                lifePointsValueIn.play();
            }
        });

        // life points value in
        const lifePointsValueIn = this.tweens.add({
            targets: this.lifePointsValue,
            delay: inDuration,
            duration: inDuration / 4,
            scale: 1.3,
            ease: inEase,
            yoyo: true,
            paused: true,
            onStart: () => {
                this.lifePointsValue.setVisible(true);            // show the work progress value
            },
            onComplete: () => {
                totalButtonIn.play();
            }
        });

        // total button In
        const totalButtonIn = this.tweens.add({
            targets: this.totalButton,
            duration: inDuration / 2,
            y: gameOptions.gameHeight * 0.85,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.totalButton.activate();
            }
        });

        // hide all work and life descriptions and values
        this.tweenHideDescriptions = this.tweens.add({
            targets: [
                this.workTitle, this.lifeTitle,
                this.workProgressName, this.lifeProgressName,
                this.workProgressValue, this.lifeProgressValue,
                this.workMultiplierName, this.lifePointsName],
            delay: inDuration,
            duration: inDuration / 4,
            scale: 0,
            ease: inEase,
            paused: true,
            onComplete: () => {

                // hide everything
                this.workTitle.setVisible(false);
                this.lifeTitle.setVisible(false);
                this.workProgressName.setVisible(false);
                this.lifeProgressName.setVisible(false);
                this.workProgressValue.setVisible(false);
                this.lifeProgressValue.setVisible(false);
                this.workMultiplierName.setVisible(false);
                this.lifePointsName.setVisible(false);

                moveMultiplier.play();
                movePoints.play();
            }
        });

        const distanceMultiplierPoints = gameOptions.gameWidth *0.004;

        // move multiplier
        const moveMultiplier = this.tweens.add({
            targets: this.workMultiplierValue,
            delay: inDuration ,
            duration: inDuration,
            x: gameOptions.gameWidth / 2 + distanceMultiplierPoints,
            y: this.startY + 5 * this.distanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {

            }
        });

        // move points
        const movePoints = this.tweens.add({
            targets: this.lifePointsValue,
            delay: inDuration ,
            duration: inDuration,
            x: gameOptions.gameWidth / 2 - distanceMultiplierPoints - this.lifePointsValue.width,
            y: this.startY + 5 * this.distanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {

                // change origin and adapt position
                this.lifePointsValue.setOrigin(1, 0);
                this.lifePointsValue.setX(gameOptions.gameWidth / 2 - distanceMultiplierPoints);

                // do the multiplication
                multiplication.play();

            }
        });

        // total button out
        this.tweenTotalButtonOut = this.tweens.add({
            targets: this.totalButton,
            duration: inDuration / 2,
            y: gameOptions.gameHeight + this.totalButton.image.height / 2,
            ease: inEase,
            paused: true,
            onStart: () => {
                this.totalButton.deactivate();
            }
        });

        // do multiplication of points
        const multiplication = this.tweens.add({
            targets: this.workMultiplierValue,
            duration: inDuration,
            scale: 1.3,
            yoyo: true,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.workMultiplierValue.setVisible(false);            // hide the work multiplier value
                this.lifePointsValue.setOrigin(0.5, 0);
                this.lifePointsValue.setX(gameOptions.gameWidth / 2);
                this.lifePointsValue.setText(String(gameManager.getLifePoints() * gameManager.getWorkMultiplier()));

                // bring in the title and the total points
                totalTitleIn.play();
                totalValueIn.play();
            }
        });

        // total points title in
        const totalTitleIn = this.tweens.add({
            targets: this.totalPointsTitle,
            duration: inDuration,
            y: this.startY + 10 * this.distanceY,
            ease: inEase,
            paused: true
        });

        // total points value in
        const totalValueIn = this.tweens.add({
            targets: this.totalPointsValue,
            duration: inDuration,
            y: this.startY + 14 * this.distanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {
                addPoints.play();
            }
        });

        // add stage points
        const addPoints = this.tweens.add({
            targets: this.lifePointsValue,
            delay: inDuration,
            duration: inDuration / 2,
            y: this.startY + 14 * this.distanceY,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.lifePointsValue.setVisible(false);            // hide the life points value

                // calculate the new total points
                gameManager.setTotalPoints();

                // play the animation to increase the total points
                totalPointsIncrease.play();
            }
        });

        // total points increase
        const totalPointsIncrease = this.tweens.add({
            targets: this.totalPointsValue,
            duration: inDuration / 4,
            scaleY: 1.3,
            ease: inEase,
            yoyo: true,
            paused: true,
            onComplete: () => {
                this.totalPointsValue.setText(gameManager.getTotalPoints().toString());

                // move continue and stop button in
                continueButtonIn.play();
                stopButtonIn.play();
            }
        });

        // move continue button in
        const continueButtonIn = this.tweens.add({
            targets: this.continueButton,
            duration: inDuration / 2,
            y: gameOptions.gameHeight * 0.85,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.continueButton.activate();
            }
        });

        // move stop button in
        const stopButtonIn = this.tweens.add({
            targets: this.stopButton,
            delay: inDuration / 4,
            duration: inDuration / 2,
            y: gameOptions.gameHeight * 0.92,
            ease: inEase,
            paused: true,
            onComplete: () => {
                this.stopButton.activate();
            }
        });

        // move continue button out
        this.tweenContinueButtonOut = this.tweens.add({
            targets: this.continueButton,
            delay: inDuration / 4,
            duration: inDuration / 2,
            y: gameOptions.gameHeight + this.continueButton.image.height / 2,
            ease: inEase,
            paused: true
        });

        // move stop button out
        this.tweenStopButtonOut = this.tweens.add({
            targets: this.stopButton,
            duration: inDuration / 2,
            y: gameOptions.gameHeight + this.stopButton.image.height / 2,
            ease: inEase,
            paused: true
        });

        // move title out
        this.tweenTitleOut = this.tweens.add({
            targets: this.title,
            duration: inDuration,
            y: 0,
            ease: inEase,
            paused: true
        });

        // move stage title out
        this.tweenStageTitleOut = this.tweens.add({
            targets: this.stageTitle,
            duration: inDuration,
            y: this.stageTitle.y + gameOptions.gameHeight,
            ease: inEase,
            paused: true
        });

        // move total points title out
        this.tweenTotalPointsTitleOut = this.tweens.add({
            targets: this.totalPointsTitle,
            duration: inDuration,
            y: this.totalPointsTitle.y + gameOptions.gameHeight,
            ease: inEase,
            paused: true
        });

        // move total points value out
        this.tweenTotalPointsValueOut = this.tweens.add({
            targets: this.totalPointsValue,
            duration: inDuration,
            y: this.totalPointsValue.y + gameOptions.gameHeight,
            ease: inEase,
            paused: true
        });


    }

}
