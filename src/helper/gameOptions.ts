// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import { Types } from "phaser";

class GameOptions {

    public readonly gameTitle: string;
    public readonly gameWidth: number;                                  // game width
    public readonly gameHeight: number;                                 // game height
    public readonly timeLimit: number;                                 // time limit for each mini game
    public readonly titleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly subTitleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly normalTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly buttonTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly cloudSpeedDifference: number;                      // relative difference in speed between the two clouds
    public readonly cloudSpeed: number;                                // speed of the clouds

    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // title of the game
        this.gameTitle = 'Balance';

        // Width and height of the game (canvas)
        this.gameWidth = 1024;
        this.gameHeight = 488;

        // time limit for each mini game
        this.timeLimit = 3; // seconds

        // ----------------------------
        // Scene options: Background
        // ----------------------------

        // cloud position
        this.cloudSpeed = 0.01;                   // speed of the clouds in game width per second
        this.cloudSpeedDifference = 0.05;            // relative difference in speed between the two clouds

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
            align: 'center'
        }

    }

}

export default new GameOptions();