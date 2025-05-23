// Phaser import
import { Game, Types } from "phaser";

// import style file
import './style.css'

// scene imports
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import BackgroundScene from './scenes/BackgroundScene';
import MenuScene from './scenes/MenuScene';
import CreditsScene from './scenes/CreditsScene.ts';
import GameScene from './scenes/GameScene';
import AccountantScene from './scenes/AccountantScene';
import LawnScene from './scenes/LawnScene.ts';
import PointsScene from './scenes/PointsScene.ts';
import EditorScene from './scenes/EditorScene.ts';
import DanceScene from './scenes/DanceScene.ts';

// other imports
import gameOptions from './helper/gameOptions';

const config: Types.Core.GameConfig = {
    title: gameOptions.gameTitle,
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    parent: 'game-container',
    backgroundColor: '#000000',
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: gameOptions.gameWidth * 1.5,
            height: gameOptions.gameHeight * 1.5
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        BootScene,
        LoadingScene,
        BackgroundScene,
        MenuScene,
        CreditsScene,
        GameScene,
        LawnScene,
        DanceScene,
        AccountantScene,
        EditorScene,
        PointsScene
    ]
};

export default new Game(config);
