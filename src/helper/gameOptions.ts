// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import { Types } from "phaser";

class GameOptions {

    public readonly gameTitle: string;
    public readonly gameWidth: number;                                  // game width
    public readonly gameHeight: number;                                 // game height
    public readonly timeLimit: number;                                 // time limit for each mini game
    public readonly frameTweenLength: number;                         // tween length for the frame to appear and disappear
    public readonly cloudSpeedDifference: number;                      // relative difference in speed between the two clouds
    public readonly cloudSpeed: number;                                // speed of the clouds
    public readonly accountantRange: { min: number; max: number };    // value range for the numbers to be added
    public readonly accountantDeviation: { min: number; max: number }; // value range for the deviation of wrong results
    public readonly accountantTenthProb: number;                       // probability of getting a wrong result with is +/- 10 so that the user can not only check the last number
    public readonly accountantTwenthyProb: number;                     // probability of getting a wrong result with is +/- 20 so that the user can not only check the last number
    public readonly accountantNumberSwitchProb: number;                // probability of getting a wrong result where the last two numbers are inverted
    public readonly titleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly subTitleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly normalTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly buttonTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly accountantTitleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly accountantTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly editorPageNumberTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly editorTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly editorHighlightTextStyle: Types.GameObjects.Text.TextStyle;

    constructor() {

        // ---------------------
        // General options
        // ---------------------

        // title of the game
        this.gameTitle = 'Balance';

        // Width and height of the game (canvas)
        this.gameWidth = 1024;
        this.gameHeight = 488;

        // time limit for each mini game
        this.timeLimit = 60; // seconds

        // tween lengths
        this.frameTweenLength = 1000; // milliseconds

        // ----------------------------
        // Scene options: Background
        // ----------------------------

        // cloud position
        this.cloudSpeed = 0.01;                   // speed of the clouds in game width per second
        this.cloudSpeedDifference = 0.05;            // relative difference in speed between the two clouds

        // ----------------------------
        // Game options: Accountant
        // ----------------------------

        this.accountantRange = {min: 100, max: 499};    // value range for the numbers to be added
        this.accountantDeviation = {min: 1, max: 30}; // value range for the deviation of wrong results
        this.accountantTenthProb = 0.40;                // probability of getting a wrong result with is +/- 10 so that the user can not only check the last number
        this.accountantTwenthyProb = 0.30;              // probability of getting a wrong result with is +/- 20 so that the user can not only check the last number
        this.accountantNumberSwitchProb = 0.30;         // probability of getting a wrong result where the last two numbers are inverted

        // ----------------------------
        // Scene options: Base Frame
        // ----------------------------


        // ----------------------------
        // Scene options: Game
        // ----------------------------

        // ---------------------
        // Text styles
        // ---------------------

        this.titleTextStyle = {
            fontFamily: 'Luckiest Guy',
            fontSize: '70px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'center'
        };

        this.buttonTextStyle = {
            fontFamily: 'Luckiest Guy',
            fontSize: '40px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        };

        this.subTitleTextStyle = {
            fontFamily: 'Nunito',
            fontSize: '48px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }

        this.normalTextStyle = {
            fontFamily: 'Nunito',
            fontSize: '24px',
            color: '#000000',
            align: 'left'
        }

        this.accountantTitleTextStyle = {
            fontFamily: 'SpecialElite',
            fontSize: '28px',
            color: '#000000'
        }

        this.accountantTextStyle = {
            fontFamily: 'SpecialElite',
            fontSize: '24px',
            color: '#000000'
        }

        this.editorPageNumberTextStyle = {
            fontFamily: 'SpecialElite',
            fontSize: '18px',
            color: '#000000'
        }

        this.editorTextStyle = {
            fontFamily: 'SpecialElite',
            fontSize: '28px',
            color: '#000000'
        }

        this.editorHighlightTextStyle = {
            fontFamily: 'SpecialElite',
            fontSize: '28px',
            color: '#000000',
            //stroke: '#000000',
            //strokeThickness: 4
        }

    }

}

export default new GameOptions();