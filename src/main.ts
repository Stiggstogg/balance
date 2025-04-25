// Phaser import
import { Game, Types } from "phaser";

// import style file
import './style.css'

// scene imports
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import BackgroundScene from './scenes/BackgroundScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import AccountantScene from './scenes/AccountantScene';
import LawnScene from './scenes/LawnScene.ts';
import PointsScene from './scenes/PointsScene.ts';
import EditorScene from './scenes/EditorScene.ts';
import DanceScene from './scenes/DanceScene.ts';
import TestScene from './scenes/TestScene.ts';          // TODO: remove this at the end, as it is only for testing
import TestScene2 from './scenes/TestScene2.ts';        // TODO: remove this at the end, as it is only for testing
import TestScene3 from './scenes/TestScene3.ts';        // TODO: remove this at the end, as it is only for testing

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
        GameScene,
        LawnScene,
        DanceScene,
        AccountantScene,
        EditorScene,
        PointsScene,
        TestScene,          // TODO: Remove this scene at the end. It is only for testing
        TestScene2,          // TODO: Remove this scene at the end. It is only for testing
        TestScene3,          // TODO: Remove this scene at the end. It is only for testing
    ]
};

export default new Game(config);
