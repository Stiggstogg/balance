import {GameObjects, Math as Mathphaser} from 'phaser';
import {ButtonId, GameState, Side} from '../helper/enums.ts';
import BaseFrameScene from './BaseFrameScene.ts';
import gameOptions from '../helper/gameOptions.ts';
import Dancer from '../sprites/Dancer.ts';
import DanceButton from '../sprites/DanceButton.ts';
import {DanceMove} from '../helper/interfaces.ts';
import gameManager from '../helper/GameManager.ts';

// "Life: "Dancing Class" scene
export default class DanceScene extends BaseFrameScene
{

    private background: GameObjects.Image;
    private dancer: Dancer;
    private bubble: GameObjects.Image;
    private moves: GameObjects.Image;
    private buttonLeft: DanceButton;
    private buttonRight: DanceButton;
    private nextDanceMoveTime: number;
    private currentMove: DanceMove;
    private currentMoveIndex: number;
    private danceFramesTotal: number;
    private danceFramesCorrect: number;
    private validation: GameObjects.Image;
    private nextPorgressUpdate: number;

    constructor()
    {
        super(Side.LIFE, 'Dancing Class', 'Get ready to groove!\nFollow the teacher\'s instructions and move your hands up or down!' , 'Dance');

    }

    create()
    {

        // create elements from base scene (frame etc.)
        super.create();

        // add background, dancer, bubble and moves
        this.background = this.add.image(0, 0, 'dance-background').setOrigin(1, 0).setDepth(1);
        this.dancer = this.add.existing(new Dancer(this, 0, 0)).setDepth(1.1);
        this.bubble = this.add.image(901, 103, 'dance-bubble').setOrigin(0.5).setDepth(1).setVisible(false);
        this.moves = this.add.image(this.bubble.x, this.bubble.y, 'dance-moves').setOrigin(0.5).setDepth(1).setVisible(false);
        this.validation = this.add.image(890, 240, 'dance-validation', 1).setOrigin(0.5).setDepth(1).setVisible(false);

        // add buttons
        const buttonY = 440;
        const buttonDistance = 200;
        const buttonMiddleX = 750;
        this.buttonLeft = this.add.existing(new DanceButton(this, buttonMiddleX - buttonDistance/2, buttonY, ButtonId.DANCE, true)).setDepth(1).setVisible(false);
        this.buttonRight = this.add.existing(new DanceButton(this, buttonMiddleX + buttonDistance/2, buttonY, ButtonId.DANCE, false)).setDepth(1).setVisible(false);

        // initialize the dance move timer and the current move
        this.nextDanceMoveTime = Date.now();
        this.currentMove = {armDownLeft: true, armDownRight: true};
        this.currentMoveIndex = 0;

        // initialize the dance frames (for points calculation)
        this.danceFramesTotal = 0;
        this.danceFramesCorrect = 0;

        // set the start progress value and initialize the progress update timer
        this.setProgress(100);
        this.nextPorgressUpdate = Date.now();

        // event listeners for the button clicks
        this.events.on('click' + ButtonId.DANCE, (left: boolean) => {

            if (left) {
                this.dancer.toggleLeftArm();
            }
            else {
                this.dancer.toggleRightArm();
            }

        });

        // event listeners for game state events (start, stop)
        this.events.once('startGame', () => {               // game start

            // make bubble, moves and buttons visible
            this.bubble.setVisible(true);
            this.moves.setVisible(true);
            this.buttonLeft.setVisible(true);
            this.buttonRight.setVisible(true);
            this.validation.setVisible(true);

            // start the dancer animation
            this.dancer.startDance();

            // set the time when the next dance move should be triggered
            this.nextDanceMoveTime = Date.now() + Mathphaser.RND.integerInRange(gameOptions.danceMoveLength.min, gameOptions.danceMoveLength.max) * 1000;

            // set the time when the next progress update should be triggered
            this.nextPorgressUpdate = Date.now() + gameOptions.danceProgressUpdateInterval * 1000;

        });

        // event listener for game stop
        this.events.once('stopGame', () => {                // game stop

            // set the progress one last time
            this.setProgress(Math.round((this.danceFramesCorrect / this.danceFramesTotal) * 100));

            // calculate the multiplier based on the progress and store them in the game manager
            gameManager.setLifeProgressPoints(this.progress, this.calculateResult(this.progress, gameOptions.dancePointsFunctions));

            // make the bubble, moves and buttons invisible
            this.bubble.setVisible(false);
            this.moves.setVisible(false);
            this.buttonLeft.setVisible(false);
            this.buttonRight.setVisible(false);
            this.validation.setVisible(false);

            // stop the dancer animation
            this.dancer.stopDance();

        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.DANCE);
            this.events.off('startGame');
            this.events.off('stopGame');
        });

    }

    update() {

        // update the dancer
        this.dancer.update();

        // move the background
        const backgroundPos = {x: -12, y: 12};       // set relative position to outer frame
        const dancerPos = {x: -350, y: 70};       // set relative position to outer frame

        this.background.setPosition(this.frameOuter.x + backgroundPos.x, this.frameOuter.y + backgroundPos.y);
        this.dancer.setPosition(this.frameOuter.x + dancerPos.x, this.frameOuter.y + dancerPos.y);

        // check if a new dance move should be triggered and a progess update should be done
        if (this.gameState === GameState.PLAYING) {
            if (Date.now() >= this.nextDanceMoveTime) {
                this.newMove();
            }

            if (Date.now() >= this.nextPorgressUpdate) {
                this.setProgress(Math.round((this.danceFramesCorrect / this.danceFramesTotal) * 100));
                this.nextPorgressUpdate = Date.now() + gameOptions.danceProgressUpdateInterval * 1000;
            }
        }

        // count the points in case the move is correct
        if (this.gameState === GameState.PLAYING) {

            this.danceFramesTotal++;

            // check if move of the player aligns with the current move
            if (this.currentMove.armDownLeft === this.dancer.danceMove.armDownLeft &&
                this.currentMove.armDownRight === this.dancer.danceMove.armDownRight) {

                // correct move
                this.danceFramesCorrect++;

                // change the validation sign to green
                this.validation.setFrame(1);
            }
            else {
                // wrong move, change the validation sign to red
                this.validation.setFrame(0);
            }

        }


    }

    // function to trigger a new dance move
    newMove() {

        // all possible dance moves
        const allDanceMoves = [
            {armDownLeft: true, armDownRight: true},
            {armDownLeft: false, armDownRight: true},
            {armDownLeft: true, armDownRight: false},
            {armDownLeft: false, armDownRight: false}
        ];

        // pick a new dance randomly
        const allMovesWithoutCurrent = [0, 1, 2, 3];
        allMovesWithoutCurrent.splice(this.currentMoveIndex, 1);    // remove the current move from the list of next moves
        const newMoveIndex = Mathphaser.RND.pick(allMovesWithoutCurrent);

        // set the picture to the right move
        this.moves.setFrame(newMoveIndex);

        // make the bubble and move blink (scale up and down)
        this.tweens.add({
            targets: [this.moves, this.bubble],
            duration: 300,
            scale: 1.1,
            ease: 'Cubic.InOut',
            yoyo: true,
            repeat: 2,
        });

        // set the current move (for validation) and the index
        this.currentMove = allDanceMoves[newMoveIndex];
        this.currentMoveIndex = newMoveIndex;

        // set the time when the next move should be triggered
        this.nextDanceMoveTime = Date.now() + Mathphaser.RND.integerInRange(gameOptions.danceMoveLength.min, gameOptions.danceMoveLength.max) * 1000;

    }

}
