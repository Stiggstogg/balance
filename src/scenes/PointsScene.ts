import {GameObjects, Scene, Tweens} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import UIButton from "../sprites/UIButton.ts";
import {ButtonId} from "../helper/enums.ts";
import gameManager from '../helper/GameManager.ts';
import SoundManager from '../helper/SoundManager.ts';

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
    private finalPointsTitle: GameObjects.Text;

    private startY: number;
    private distanceY: number;
    private positionLeftRight: number;
    private positionLeftRightDistance: number;

    private tweenDuration: number;
    private tweenEase: string;
    private tweenTotalPoints: Tweens.TweenChain;
    private tweenFinalPoints: Tweens.TweenChain;
    private tweenContinueStopButtonOut: Tweens.Tween;
    private tweenTitleOut: Tweens.Tween;
    private tweenStageTitleOut: Tweens.Tween;
    private tweenTotalPointsTitleOut: Tweens.Tween;
    private tweenTotalPointsValueOut: Tweens.Tween;
    private tweenMenuButtonOut: Tweens.Tween;
    private tweenFinalTitleOut: Tweens.Tween;
    private tweenTotalPointsValueOutSlow: Tweens.Tween;

    private totalButton: UIButton;
    private continueButton: UIButton;
    private stopButton: UIButton;
    private menuButton: UIButton;

    private soundManager: SoundManager;

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
        this.finalPointsTitle = this.add.text(gameOptions.gameWidth / 2 - 309, 0, 'Final', gameOptions.titleTextStyle).setOrigin(0, 1);      // the x position of "Final " needs to be very accurate as it needs to perfectly align with the "Point"

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

        this.menuButton = this.add.existing(new UIButton(this, gameOptions.gameWidth / 2, 0, 'Menu', ButtonId.MENU));
        this.menuButton.setY(gameOptions.gameHeight + this.menuButton.image.height/2);
        this.menuButton.deactivate();

        // start the points song
        this.soundManager = SoundManager.getInstance(this);                               // get the sound manager

        // play the points song
        this.soundManager.pointsSong.play({volume: gameOptions.pointsSongVolume});

        // stop the play song, but should anyway be already faded out
        this.soundManager.playSong.stop();

        // Button to go to the total point calculation
        this.events.once('click' + ButtonId.TOTAL, () => {

            // play the total points animation
            this.tweenTotalPoints.play();

            // When this is the last stage show the final points tweens, if not show the continue / stop buttons
            this.tweenTotalPoints.once('complete', () => {

                if (gameManager.isLastStage()) {

                    // play the final points tween
                    this.tweenFinalPoints.play();

                }
                else {

                    // move continue button in
                    this.tweens.add({
                        targets: this.continueButton,
                        duration: this.tweenDuration / 2,
                        y: gameOptions.gameHeight * 0.85,
                        ease: this.tweenEase,
                        onComplete: () => {
                            this.continueButton.activate();
                        }
                    });

                    // move stop button in
                    this.tweens.add({
                        targets: this.stopButton,
                        delay: this.tweenDuration / 4,
                        duration: this.tweenDuration / 2,
                        y: gameOptions.gameHeight * 0.92,
                        ease: this.tweenEase,
                        onComplete: () => {
                            this.stopButton.activate();
                        }
                    });

                }

            });

        });

        // Change to game scene when button is clicked
        this.events.once('click' + ButtonId.CONTINUE, () => {

            // move buttons out
            this.tweenContinueStopButtonOut.play();

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

        // Change to menu scene when button is clicked
        this.events.once('click' + ButtonId.STOP, () => {

            // fade out the points song
            this.soundManager.fadeOut(this, 'points-song');

            // move buttons out
            this.tweenContinueStopButtonOut.play();

            // move titles and total points out
            this.tweenTitleOut.play();
            this.tweenStageTitleOut.play();
            this.tweenTotalPointsTitleOut.play();
            this.tweenTotalPointsValueOut.play();

            this.tweenTitleOut.once('complete', () => {
                this.scene.start('Menu');
            });

        });

        // Change to menu scene when the menu button is clicked
        this.events.once('click' + ButtonId.MENU, () => {

            // fade out the points song
            this.soundManager.fadeOut(this, 'points-song');

            // move buttons out
            this.tweenMenuButtonOut.play();

            // move titles and total points out
            this.tweenFinalTitleOut.play();
            this.tweenTotalPointsValueOutSlow.play();

            this.tweenFinalTitleOut.once('complete', () => {
                this.scene.start('Menu');
            });

        });

        // add tweens
        this.tweenDuration = 500;                                  // set the typical duration of the tweens
        this.tweenEase = 'Cubic.Out';                               // set the typical ease function

        this.playStagePointsTween();
        this.addTotalPointsTween();
        this.addFinalPointsTween();
        this.addTweens();

    }

    // add and play the stage point tween
    playStagePointsTween() {

        this.tweens.chain({
            tweens: [
                {
                    targets: this.title,                                    // 1. move title in
                    duration: this.tweenDuration,
                    y: this.startY,
                    ease: this.tweenEase,
                    onStart: () => {
                        this.tweens.add({                                   // 1. move stage title in
                            targets: this.stageTitle,
                            duration: this.tweenDuration,
                            y: this.startY + this.distanceY * 0.25,
                            ease: this.tweenEase
                        });
                    }
                },
                {
                    targets: this.workTitle,                                // 2. move work title in
                    duration: this.tweenDuration,
                    x: this.positionLeftRight,
                    ease: this.tweenEase,
                    onStart: () => {
                        this.tweens.add({                                   // 2. move life title in
                            targets: this.lifeTitle,
                            duration: this.tweenDuration,
                            x: gameOptions.gameWidth - this.positionLeftRight,
                            ease: this.tweenEase,
                        });
                    }
                },
                {
                    targets: [this.workProgressName, this.lifeProgressName],    // 3. move work and life progress names in
                    duration: this.tweenDuration,
                    y: this.startY + 9 * this.distanceY,
                    ease: this.tweenEase,
                    onStart: () => {                                        // 3.5. move work and life multiplier / points names in
                        this.tweens.add({
                            targets: [this.workMultiplierName, this.lifePointsName],
                            delay: this.tweenDuration / 2,
                            duration: this.tweenDuration,
                            y: this.startY + 13 * this.distanceY,
                            ease: this.tweenEase,
                        });
                    }
                },
                {
                    targets: this.workProgressValue,                            // 4. move work progress value in
                    delay: this.tweenDuration,
                    duration: this.tweenDuration / 4,
                    scale: 1.3,
                    ease: this.tweenEase,
                    yoyo: true,
                    onStart: () => {

                        // show the work progress value
                        this.workProgressValue.setVisible(true);

                        // play the points sound
                        this.soundManager.pointsSound.play();
                    },
                },
                {
                    targets: this.workMultiplierValue,                          // 5. move work multiplier value in
                    delay: this.tweenDuration,
                    duration: this.tweenDuration / 4,
                    scale: 1.3,
                    ease: this.tweenEase,
                    yoyo: true,
                    onStart: () => {
                        // show the work progress value
                        this.workMultiplierValue.setVisible(true);

                        // play the points sound
                        this.soundManager.pointsSound.play();
                    },
                },
                {
                    targets: this.lifeProgressValue,                            // 6. move life progress value in
                    delay: this.tweenDuration,
                    duration: this.tweenDuration / 4,
                    scale: 1.3,
                    ease: this.tweenEase,
                    yoyo: true,
                    onStart: () => {
                        // show the work progress value
                        this.lifeProgressValue.setVisible(true);

                        // play the points sound
                        this.soundManager.pointsSound.play();
                    },
                },
                {                                                               // 7. move life points value in
                    targets: this.lifePointsValue,
                    delay: this.tweenDuration,
                    duration: this.tweenDuration / 4,
                    scale: 1.3,
                    ease: this.tweenEase,
                    yoyo: true,
                    onStart: () => {
                        // show the work progress value
                        this.lifePointsValue.setVisible(true);

                        // play the points sound
                        this.soundManager.pointsSound.play();
                    },
                },
                {                                                               // 8. move total button in
                    targets: this.totalButton,
                    duration: this.tweenDuration / 2,
                    y: gameOptions.gameHeight * 0.85,
                    ease: this.tweenEase,
                    onComplete: () => {
                        this.totalButton.activate();
                    }
                }
            ]
        });
    }

    // add the total points tween
    addTotalPointsTween() {

        const distanceMultiplierPoints = gameOptions.gameWidth *0.004;          // distance between the multiplier and the points when their are multiplied

        this.tweenTotalPoints = this.tweens.chain({
            paused: true,
            tweens: [
                {                                                                                   // 1. hide all work and life descriptions
                    targets: [
                        this.workTitle, this.lifeTitle,
                        this.workProgressName, this.lifeProgressName,
                        this.workProgressValue, this.lifeProgressValue,
                        this.workMultiplierName, this.lifePointsName],
                    delay: this.tweenDuration,
                    duration: this.tweenDuration / 4,
                    scale: 0,
                    ease: this.tweenEase,
                    onStart: () => {
                        this.tweens.add({                                                           // 1. move total button out
                            targets: this.totalButton,
                            duration: this.tweenDuration / 2,
                            y: gameOptions.gameHeight + this.totalButton.image.height / 2,
                            ease: this.tweenEase,
                            onStart: () => {
                                this.totalButton.deactivate();
                            }
                        });
                    },
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
                    }
                },
                {                                                                                              // 2. move multiplier
                    targets: this.workMultiplierValue,
                    delay: this.tweenDuration,
                    duration: this.tweenDuration,
                    x: gameOptions.gameWidth / 2 + distanceMultiplierPoints,
                    y: this.startY + 5 * this.distanceY,
                    ease: this.tweenEase,
                    onStart: () => {                                                                     // 2. move points
                        this.tweens.add({
                            targets: this.lifePointsValue,
                            duration: this.tweenDuration,
                            x: gameOptions.gameWidth / 2 - distanceMultiplierPoints - this.lifePointsValue.width,
                            y: this.startY + 5 * this.distanceY,
                            ease: this.tweenEase,
                            onComplete: () => {

                                // change origin and adapt position
                                this.lifePointsValue.setOrigin(1, 0);
                                this.lifePointsValue.setX(gameOptions.gameWidth / 2 - distanceMultiplierPoints);

                            }
                        });
                    }
                },
                {
                    targets: this.workMultiplierValue,                                                          // 3. Make multiplier value scale and then hide and show the multiplied points
                    duration: this.tweenDuration,
                    scaleX: 1.3,
                    yoyo: true,
                    ease: this.tweenEase,
                    onComplete: () => {

                        // play the points sound
                        this.soundManager.pointsSound.play();

                        // hide the work multiplier value
                        this.workMultiplierValue.setVisible(false);

                        // move the points into the middle and show the multiplied points
                        this.lifePointsValue.setOrigin(0.5, 0);
                        this.lifePointsValue.setX(gameOptions.gameWidth / 2);
                        this.lifePointsValue.setText(String(gameManager.getLifePoints() * gameManager.getWorkMultiplier()));
                    }
                },
                {
                    targets: this.totalPointsTitle,                                                             // 4. move total points title in
                    duration: this.tweenDuration,
                    y: this.startY + 10 * this.distanceY,
                    ease: this.tweenEase,
                    onStart: () => {
                        this.tweens.add({                                                                       // 4. move the total points value in
                            targets: this.totalPointsValue,
                            duration: this.tweenDuration,
                            y: this.startY + 14 * this.distanceY,
                            ease: this.tweenEase,
                        });
                    }
                },
                {
                    targets: this.lifePointsValue,                                                              // 5. move the stage points value down
                    delay: this.tweenDuration,
                    duration: this.tweenDuration / 2,
                    y: this.startY + 14 * this.distanceY,
                    ease: this.tweenEase,
                    onComplete: () => {

                        // hide the life points value
                        this.lifePointsValue.setVisible(false);

                    }
                },
                {
                    targets: this.totalPointsValue,                                                             // 6. stretch the total points text and then calculate the new total points and show the value
                    duration: this.tweenDuration / 4,
                    scaleY: 1.3,
                    ease: this.tweenEase,
                    yoyo: true,
                    onStart: () => {
                        this.soundManager.totalPointsSound.play();
                    },
                    onComplete: () => {

                        // calculate the new total points
                        gameManager.setTotalPoints();

                        // show the new total points
                        this.totalPointsValue.setText(gameManager.getTotalPoints().toString());
                    }
                }
            ]
        });

    }

    // add the final points tween
    addFinalPointsTween() {

        this.tweenFinalPoints = this.tweens.chain({
            paused: true,
            tweens: [
                {                                                                               // 1. make stage and total points title disappear
                    targets: [
                        this.stageTitle, this.totalPointsTitle],
                    duration: this.tweenDuration / 2,
                    scale: 0,
                    ease: this.tweenEase,
                    onComplete: () => {

                        // hide everything
                        this.stageTitle.setVisible(false);
                        this.totalPointsTitle.setVisible(false);

                    }
                },
                {                                                                               // 2. move final points title in (and hide the title)
                    targets: this.finalPointsTitle,
                    duration: this.tweenDuration,
                    y: this.startY,
                    ease: this.tweenEase,
                    onComplete: () => {

                        this.finalPointsTitle.setText('Final Points');
                        this.title.setVisible(false);                // hide the title

                        // move the final points title to the middle                            // 3. Move the final points title to the middle (this needs to be done here, as otherwise the title will not move into the middle (width is not set if I do it in a chain)
                        this.tweens.add({
                            targets: this.finalPointsTitle,
                            duration: this.tweenDuration,
                            x: gameOptions.gameWidth/2 - this.finalPointsTitle.width/2,
                            ease: this.tweenEase,
                        })
                    }
                },
                {                                                                               // 4. Scale points up and balce them in the middle
                    targets: this.totalPointsValue,
                    delay: this.tweenDuration,         // delay is needed here, because of the woraround above of moving the title into the middle
                    duration: this.tweenDuration,
                    y: gameOptions.gameHeight * 0.40,
                    scale: 1,
                    ease: this.tweenEase,
                    onStart: () => {
                        this.totalPointsValue.setStyle(gameOptions.titleTextStyle);
                        this.totalPointsValue.setScale(0.57);
                    },
                },
                {
                    targets: this.menuButton,                                                   // 5. Move menu button in
                    duration: this.tweenDuration / 2,
                    y: gameOptions.gameHeight * 0.85,
                    ease: this.tweenEase,
                    onComplete: () => {
                        this.menuButton.activate();
                    }
                }
            ]
        });

    }

    addTweens() {

        // move continue and stop button out
        this.tweenContinueStopButtonOut = this.tweens.add({
            targets: this.continueButton,                                       // continue button out
            delay: this.tweenDuration / 4,
            duration: this.tweenDuration / 2,
            y: gameOptions.gameHeight + this.continueButton.image.height / 2,
            ease: this.tweenEase,
            paused: true,
            onStart: () => {

                // deactivate buttons
                this.continueButton.deactivate();
                this.stopButton.deactivate();

                this.tweens.add({                                               // stop button out
                    targets: this.stopButton,
                    duration: this.tweenDuration / 2,
                    y: gameOptions.gameHeight + this.stopButton.image.height / 2,
                    ease: this.tweenEase
                });
            }
        });

        // move title out
        this.tweenTitleOut = this.tweens.add({
            targets: this.title,
            duration: this.tweenDuration,
            y: 0,
            ease: this.tweenEase,
            paused: true
        });

        // move stage title out
        this.tweenStageTitleOut = this.tweens.add({
            targets: this.stageTitle,
            duration: this.tweenDuration,
            y: this.stageTitle.y + gameOptions.gameHeight,
            ease: this.tweenEase,
            paused: true
        });

        // move total points title out
        this.tweenTotalPointsTitleOut = this.tweens.add({
            targets: this.totalPointsTitle,
            duration: this.tweenDuration,
            y: this.totalPointsTitle.y + gameOptions.gameHeight,
            ease: this.tweenEase,
            paused: true
        });

        // move total points value out
        this.tweenTotalPointsValueOut = this.tweens.add({
            targets: this.totalPointsValue,
            duration: this.tweenDuration,
            y: this.totalPointsValue.y + gameOptions.gameHeight,
            ease: this.tweenEase,
            paused: true
        });

        // move menu button out
        this.tweenMenuButtonOut = this.tweens.add({
            targets: this.menuButton,
            duration: this.tweenDuration / 2,
            y: gameOptions.gameHeight + this.menuButton.image.height,
            ease: this.tweenEase,
            paused: true,
            onStart: () => {

                // deactivate button
                this.menuButton.deactivate();
            }
        });

        // move title out
        this.tweenFinalTitleOut = this.tweens.add({
            targets: this.finalPointsTitle,
            duration: this.tweenDuration,
            y: 0,
            ease: this.tweenEase,
            paused: true
        });

        // move total points value out (a bit slower)
        this.tweenTotalPointsValueOutSlow = this.tweens.add({
            targets: this.totalPointsValue,
            duration: this.tweenDuration,
            y: gameOptions.gameHeight,
            ease: this.tweenEase,
            paused: true
        });

    }
}
