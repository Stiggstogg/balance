// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import { Types } from "phaser";
import {ResultFunction} from './interfaces.ts';

class GameOptions {

    public readonly gameTitle: string;
    public readonly gameWidth: number;                                  // game width
    public readonly gameHeight: number;                                 // game height
    public readonly timeLimit: number;                                  // time limit for each mini game
    public readonly frameTweenLength: number;                           // tween length for the frame to appear and disappear
    public readonly cloudSpeedDifference: number;                       // relative difference in speed between the two clouds
    public readonly cloudSpeed: number;                                 // speed of the clouds
    public readonly accountantRange: { min: number; max: number };      // value range for the numbers to be added
    public readonly accountantDeviation: { min: number; max: number };  // value range for the deviation of wrong results
    public readonly accountantTenthProb: number;                        // probability of getting a wrong result with is +/- 10 so that the user can not only check the last number
    public readonly accountantTwenthyProb: number;                      // probability of getting a wrong result with is +/- 20 so that the user can not only check the last number
    public readonly accountantNumberSwitchProb: number;                 // probability of getting a wrong result where the last two numbers are inverted
    public readonly accountantMultiplierFunction: ResultFunction;       // the function which is used to calculate from the number of correct calculations to the multiplier
    public readonly editorMultiplierFunction: ResultFunction;           // the function which is used to calculate from the number of correctly detected typos to the multiplier
    public readonly lawnPointsFunctions: ResultFunction[];              // the functions which are used to calculate from the percentage of mowed grass to the points
    public readonly danceMoveLength: { min: number; max: number };      // number of seconds for how long a dance move should be shown
    public readonly danceProgressUpdateInterval: number;                // interval in seconds for the progress to be updated
    public readonly dancePointsFunctions: ResultFunction[];             // the functions which are used to calculate from the percentage of how long your moves were correct to the points
    public readonly titleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly smallTitleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly subTitleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly smallSubTitleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly normalTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly buttonTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly progressTextStyle: Types.GameObjects.Text.TextStyle;
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
        this.timeLimit = 3; // seconds      TODO: Set back to 60. This is only for testing purposes

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
        this.accountantDeviation = {min: 1, max: 30};   // value range for the deviation of wrong results
        this.accountantTenthProb = 0.40;                // probability of getting a wrong result with is +/- 10 so that the user can not only check the last number
        this.accountantTwenthyProb = 0.30;              // probability of getting a wrong result with is +/- 20 so that the user can not only check the last number
        this.accountantNumberSwitchProb = 0.30;         // probability of getting a wrong result where the last two numbers are inverted
        this.accountantMultiplierFunction = {            // the factor which is used to calculate from the number of correct calculations (progress) to the multiplier
            slope: 0.9,
            offset: 1
        }


        // ----------------------------
        // Game options: Editor
        // ----------------------------

        this.editorMultiplierFunction = {            // the factor which is used to calculate from the number of correctly detected typos (progress) to the multiplier
            slope: 0.9,
            offset: 1
        }

        // ----------------------------
        // Game options: Lawn
        // ----------------------------

        this.lawnPointsFunctions = [                // the functions which are used to calculate from the percentage of mowed grass to the points
            {slope: 10, offset: 100},                 // the function which is used to calculate from the percentage of mowed grass to the points in the first segment
            {slope: 20, offset: 0}                // the function which is used to calculate from the percentage of mowed grass to the points in the second segment
        ];

        // ----------------------------
        // Game options: Dance
        // ----------------------------

        this.danceMoveLength = {min: 7, max: 12}        // number of seconds for how long a dance move should be shown
        this.danceProgressUpdateInterval = 5;                // interval in seconds for the progress to be updated
        this.dancePointsFunctions = [                     // the functions which are used to calculate from the percentage of how long your moves were correct to the points
            {slope: 1.33, offset: 100},                     // the function which is used to calculate from the percentage of how long your moves were correct to the points in the first segment
            {slope: 32, offset: -2200}                        // the function which is used to calculate from the percentage of how long your moves were correct to the points in the second segment
        ];

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

        this.smallTitleTextStyle = {
            fontFamily: 'Luckiest Guy',
            fontSize: '40px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 7,
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

        this.smallSubTitleTextStyle = {
            fontFamily: 'Nunito',
            fontSize: '36px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }

        this.progressTextStyle = {
            fontFamily: 'Luckiest Guy',
            fontSize: '32px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'right'
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