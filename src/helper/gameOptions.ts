// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import { Types } from "phaser";

class GameOptions {

    public readonly gameTitle: string;
    public readonly gameWidth: number;                                  // game width
    public readonly gameHeight: number;                                 // game height
    public readonly textStyles: Types.GameObjects.Text.TextStyle[];

    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // title of the game
        this.gameTitle = 'My Game';

        // Width and height of the game (canvas)
        this.gameWidth = 800;
        this.gameHeight = 600;

        // ---------------------
        // Text styles
        // ---------------------

        this.textStyles = [];

        // Text style 0: Title
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '100px',
            color: '#FFE500',
            fontStyle: 'bold'
        });

    }

}

export default new GameOptions();