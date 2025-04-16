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

    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // title of the game
        this.gameTitle = 'Balance';

        // Width and height of the game (canvas)
        this.gameWidth = 1024;
        this.gameHeight = 488;

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