import { Scene } from 'phaser';
import gameOptions from "../helper/gameOptions";

// images
import backgroundImg from '../assets/images/background.png';
import cloud1Img from '../assets/images/Cloud1.png';
import cloud2Img from '../assets/images/Cloud2.png';
import frameBackImg from '../assets/images/frame-back.png';
import frameOuterImg from '../assets/images/frame-outer.png';
import frameMaskImg from '../assets/images/frame-mask.png';
import watchImg from '../assets/images/watch.png';
import buttonImg from '../assets/images/button.png';
import zifferblattImg from '../assets/images/zifferblatt.png';
import accountantBalancesheetImg from '../assets/images/accountant-balancesheet.png';
import accountantPenImg from '../assets/images/accountant-pen.png';
import accountantButtonImg from '../assets/images/accountant-button.png';
import accountantValidationImg from '../assets/images/accountant-validation.png';
import lawnMowerImg from '../assets/images/lawn-mower.png';

// fonts
import LuckiestGuyFont from '../assets/fonts/LuckiestGuy-Regular.ttf';
import NunitoFont from '../assets/fonts/Nunito-VariableFont_wght.ttf';
import SpecialEliteFont from '../assets/fonts/SpecialElite-Regular.ttf';

// audio


export default class LoadingScene extends Scene
{
    constructor()
    {
        super('Loading');
    }

    init()
    {

        // show logo
        this.add.sprite(gameOptions.gameWidth/2, gameOptions.gameHeight/2, 'logo').setScale(1, 1); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.20, 'CLOWNGAMING', {fontSize: '70px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.73, 'Loading', {fontSize: '30px', color: '#27FF00'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = gameOptions.gameWidth * 0.3;            // progress bar width
        const barH = barW * 0.1;          // progress bar height
        const barX = gameOptions.gameWidth / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = gameOptions.gameHeight * 0.8 - barH / 2   // progress bar y coordinate (origin is 0, 0)
        bgBar.setPosition(barX, barY);
        bgBar.fillStyle(0xF5F5F5, 1);
        bgBar.fillRect(0, 0, barW, barH);    // position is 0, 0 as it was already set with ".setPosition()"

        // progress bar
        const progressBar = this.add.graphics();
        progressBar.setPosition(barX, barY);

        // listen to the 'progress' event (fires every time an asset is loaded and 'value' is the relative progress)
        this.load.on('progress', function(value: number) {

            // clearing progress bar (to draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0x27ff00, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);

        }, this);

    }

    preload()
    {
        // load images
        this.load.image('background', backgroundImg);
        this.load.image('cloud1', cloud1Img);
        this.load.image('cloud2', cloud2Img);
        this.load.image('frame-back', frameBackImg);
        this.load.image('frame-outer', frameOuterImg);
        this.load.image('frame-mask', frameMaskImg);
        this.load.image('watch', watchImg);
        this.load.image('zifferblatt', zifferblattImg);
        this.load.image('button', buttonImg);
        this.load.image('accountant-balancesheet', accountantBalancesheetImg);
        this.load.image('accountant-pen', accountantPenImg);
        this.load.image('accountant-button', accountantButtonImg);


        // load spritesheets
        this.load.spritesheet('accountant-validation', accountantValidationImg, {frameWidth: 32, frameHeight: 32, margin: 1, spacing: 1});
        this.load.spritesheet('lawn-mower', lawnMowerImg, {frameWidth: 40, frameHeight: 20, margin: 1, spacing: 1});

        // load audio
        //this.load.audio('miss', 'assets/audio/Pew.mp3');

        // fonts
        this.load.font('Luckiest Guy', LuckiestGuyFont, 'truetype');
        this.load.font('Nunito', NunitoFont, 'truetype');
        this.load.font('SpecialElite', SpecialEliteFont, 'truetype');

    }

    create()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.createAnimations();


        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        //this.scene.start('Background');
        //this.scene.launch('Menu');
        //this.scene.launch('Game', {workSceneKey: 'Accountant', lifeSceneKey: 'Lawn'}); // TODO: Just for testing to skip the menu
        this.scene.start('Test'); // TODO: Just for testing to skip the menu
    }

    createAnimations() {

        this.anims.create({
            key: 'mower-walk',
            frames: this.anims.generateFrameNames('lawn-mower', {frames: [0, 1]}),
            frameRate: 10,
            repeat: -1
        });

    }
}
