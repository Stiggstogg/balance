// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import { Types } from "phaser";

class GameOptions {

    public readonly gameTitle: string;
    public readonly gameWidth: number;                                  // game width
    public readonly gameHeight: number;                                 // game height
    public readonly titleTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly buttonTextStyle: Types.GameObjects.Text.TextStyle;
    public readonly cloud1Pos: { x: number; y: number };                // cloud 1 position
    public readonly cloud2Pos: { x: number; y: number };                // cloud 2 position
    public readonly framePos: number;                                  // frame position (distance from the edges)
    public readonly watchPos: { x: number; y: number };                // watch position

    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // title of the game
        this.gameTitle = 'Balance';

        // Width and height of the game (canvas)
        this.gameWidth = 1024;
        this.gameHeight = 488;

        // ----------------------------
        // Positions of game objects
        // ----------------------------

        // cloud position
        this.cloud1Pos = { x: 46, y: 15 };
        this.cloud2Pos = { x: 644, y: 73 };

        // frame positions (distance from the edges)
        this.framePos = 4;

        // watch position
        this.watchPos = { x: 511, y: 163 };



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

    }

}

export default new GameOptions();