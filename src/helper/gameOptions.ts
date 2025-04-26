// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import { Types } from "phaser";
import {ResultFunction} from './interfaces.ts';

class GameOptions {

    public readonly gameTitle: string;
    public readonly gameWidth: number;                                  // game width
    public readonly gameHeight: number;                                 // game height
    public readonly countDownTime: number;                             // time for the countdown in seconds
    public readonly timeLimit: number;                                  // time limit for each mini game
    public readonly frameTweenLength: number;                           // tween length for the frame to appear and disappear
    public readonly cloudSpeedDifference: number;                       // relative difference in speed between the two clouds
    public readonly cloudSpeed: number;                                 // speed of the clouds
    public readonly menuSongVolume: number;                              // volume of the menu song
    public readonly playSongVolume: number;                              // volume of the play song
    public readonly pointsSongVolume: number;                            // volume of the points song
    public readonly clickSoundVolume: number;                            // volume of the click sound
    public readonly correctSoundVolume: number;                          // volume of the correct sound
    public readonly errorSoundVolume: number;                            // volume of the error sound
    public readonly countdownHighSoundVolume: number;                    // volume of the countdown high sound
    public readonly countdownLowSoundVolume: number;                     // volume of the countdown low sound
    public readonly mowerSoundVolume: number;                            // volume of the mower sound
    public readonly pointsSoundVolume: number;                           // volume of the points sound
    public readonly totalPointsSoundVolume: number;                      // volume of the total points sound
    public readonly accountantRange: { min: number; max: number };      // value range for the numbers to be added
    public readonly accountantFactor: number;                           // factor which is used to multiply the number to make them bigger
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
        this.countDownTime = 3;             // the time for the countdown in seconds
        this.timeLimit = 60; // seconds      TODO: Set back to 60. This is only for testing purposes

        // tween lengths
        this.frameTweenLength = 1000; // milliseconds

        // ----------------------------
        // Scene options: Background
        // ----------------------------

        // cloud position
        this.cloudSpeed = 0.01;                   // speed of the clouds in game width per second
        this.cloudSpeedDifference = 0.05;            // relative difference in speed between the two clouds

        // ----------------------------
        // Music and sound volumes
        // ----------------------------

        this.menuSongVolume = 0.75;                // volume of the menu song
        this.playSongVolume = 0.75;                // volume of the play song
        this.pointsSongVolume = 0.75;              // volume of the points song
        this.clickSoundVolume = 0.75;              // volume of the click sound
        this.correctSoundVolume = 1;            // volume of the correct sound
        this.errorSoundVolume = 0.9;              // volume of the error sound
        this.countdownLowSoundVolume = 0.75;       // volume of the countdown low sound
        this.countdownHighSoundVolume = 0.75;      // volume of the countdown high sound
        this.mowerSoundVolume = 0.75;              // volume of the mower sound
        this.pointsSoundVolume = 0.75;             // volume of the points sound
        this.totalPointsSoundVolume = 1;        // volume of the total points sound

        // ----------------------------
        // Game options: Accountant
        // ----------------------------

        this.accountantRange = {min: 10, max: 49};      // value range for the numbers to be added
        this.accountantFactor = 10;                     // factor which is used to multiply the number to make them bigger
        this.accountantDeviation = {min: 1, max: 9};   // value range for the deviation of wrong results
        this.accountantTenthProb = 0.40;                // probability of getting a wrong result with is +/- 10 so that the user can not only check the last number (applied before applying "Factor")
        this.accountantTwenthyProb = 0.30;              // probability of getting a wrong result with is +/- 20 so that the user can not only check the last number (applied before applying "Factor")
        this.accountantNumberSwitchProb = 0.30;         // probability of getting a wrong result where the last two numbers are inverted (applied before applying "Factor")
        this.accountantMultiplierFunction = {            // the factor which is used to calculate from the number of correct calculations (progress) to the multiplier
            slope: 0.9,
            offset: 1
        }

        // ----------------------------
        // Game options: Editor
        // ----------------------------

        this.editorMultiplierFunction = {            // the factor which is used to calculate from the number of correctly detected typos (progress) to the multiplier
            slope: 0.6,
            offset: 1
        }

        // ----------------------------
        // Game options: Lawn
        // ----------------------------

        this.lawnPointsFunctions = [                // the functions which are used to calculate from the percentage of mowed grass to the points
            {slope: 5.71, offset: 100},                 // the function which is used to calculate from the percentage of mowed grass to the points in the first segment
            {slope: 28, offset: -680}                // the function which is used to calculate from the percentage of mowed grass to the points in the second segment
        ];

        // ----------------------------
        // Game options: Dance
        // ----------------------------

        this.danceMoveLength = {min: 7, max: 12}        // number of seconds for how long a dance move should be shown
        this.dancePointsFunctions = [                     // the functions which are used to calculate from the percentage of how long your moves were correct to the points
            {slope: 3.33, offset: 100},                     // the function which is used to calculate from the percentage of how long your moves were correct to the points in the first segment
            {slope: 17.5, offset: -750}                        // the function which is used to calculate from the percentage of how long your moves were correct to the points in the second segment
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