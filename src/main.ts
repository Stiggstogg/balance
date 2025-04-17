// Phaser import
import { Game, Types } from "phaser";

// import style file
import './style.css'

// scene imports
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import AccountantScene from './scenes/AccountantScene';
import LawnScene from './scenes/LawnScene.ts';

// other imports
import gameOptions from './helper/gameOptions';

const config: Types.Core.GameConfig = {
    title: gameOptions.gameTitle,
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        LoadingScene,
        MenuScene,
        GameScene,
        AccountantScene,
        LawnScene
    ]
};

export default new Game(config);
