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
import lawnBackgroundImg from '../assets/images/lawn-background.png';
import lawnLawnImg from '../assets/images/lawn-lawn.png';
import lawnMowerImg from '../assets/images/lawn-mower-new.png';
import lawnPoolImg from '../assets/images/lawn-pool.png';
import lawnSandImg from '../assets/images/lawn-sand.png';
import lawnButtonImg from '../assets/images/lawn-button-large.png';
import editorBookImg from '../assets/images/editor-book.png';
import editorButtonImg from '../assets/images/editor-button.png';
import editorSelectionImg from '../assets/images/editor-selection.png';
import editorLineImg from '../assets/images/editor-line.png';
import danceBodyImg from '../assets/images/dance-human-body.png';
import danceArmImg from '../assets/images/dance-human-arm.png';
import danceBackgroundImg from '../assets/images/dance-background.png';
import danceBubbleImg from '../assets/images/dance-bubble.png';
import danceMovesImg from '../assets/images/dance-moves.png';
import danceButtonImg from '../assets/images/dance-button-large.png';
import danceValidationImg from '../assets/images/dance-validation.png';

// fonts
import LuckiestGuyFont from '../assets/fonts/LuckiestGuy-Regular.ttf';
import NunitoFont from '../assets/fonts/Nunito-VariableFont_wght.ttf';
import SpecialEliteFont from '../assets/fonts/SpecialElite-Regular.ttf';

// audio
import clickSound from '../assets/audio/click.mp3';
import correctSound from '../assets/audio/correct-new.mp3';
import errorSound from '../assets/audio/error-new.mp3';
import countdownHighSound from '../assets/audio/countdown-high.mp3';
import countdownLowSound from '../assets/audio/countdown-low.mp3';
import mowerSound from '../assets/audio/mower.mp3';
import pointsSound from '../assets/audio/points.mp3';
import totalPointsSound from '../assets/audio/total-points-new.mp3';
import menuSongSound from '../assets/audio/menu-song.mp3';
import playSongSound from '../assets/audio/play-song.mp3';
import pointsSongSound from '../assets/audio/points-song.mp3';

// json
import wordsJson from '../assets/json/words.json';

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
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.15, 'CLOWNGAMING', {fontSize: '70px', color: '#639bff', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.8, 'Loading', {fontSize: '38px', color: '#639bff'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = gameOptions.gameWidth * 0.4;            // progress bar width
        const barH = barW * 0.07;          // progress bar height
        const barX = gameOptions.gameWidth / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = gameOptions.gameHeight * 0.9 - barH / 2   // progress bar y coordinate (origin is 0, 0)
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
            progressBar.fillStyle(0x639bff, 1);

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
        this.load.image('lawn-background', lawnBackgroundImg);
        this.load.image('lawn-lawn', lawnLawnImg);
        this.load.image('lawn-pool', lawnPoolImg);
        this.load.image('lawn-sand', lawnSandImg);
        this.load.image('editor-book', editorBookImg);
        this.load.image('editor-button', editorButtonImg);
        this.load.image('editor-selection', editorSelectionImg);
        this.load.image('editor-line', editorLineImg);
        this.load.image('dance-background', danceBackgroundImg);
        this.load.image('dance-bubble', danceBubbleImg);
        this.load.image('dance-button', danceButtonImg);

        // load spritesheets
        this.load.spritesheet('accountant-validation', accountantValidationImg, {frameWidth: 32, frameHeight: 32, margin: 1, spacing: 1});
        this.load.spritesheet('lawn-mower', lawnMowerImg, {frameWidth: 40, frameHeight: 20, margin: 1, spacing: 1});
        this.load.spritesheet('lawn-button', lawnButtonImg, {frameWidth: 136, frameHeight: 60, margin: 1, spacing: 1});
        this.load.spritesheet('dance-body', danceBodyImg, {frameWidth: 171, frameHeight: 338, margin: 1, spacing: 1});
        this.load.spritesheet('dance-arm', danceArmImg, {frameWidth: 57, frameHeight: 205, margin: 1, spacing: 1});
        this.load.spritesheet('dance-moves', danceMovesImg, {frameWidth: 202, frameHeight: 99, margin: 1, spacing: 1});
        this.load.spritesheet('dance-validation', danceValidationImg, {frameWidth: 64, frameHeight: 64, margin: 1, spacing: 1});

        // load audio
        this.load.audio('click', clickSound);
        this.load.audio('correct', correctSound);
        this.load.audio('error', errorSound);
        this.load.audio('countdown-high', countdownHighSound);
        this.load.audio('countdown-low', countdownLowSound);
        this.load.audio('mower', mowerSound);
        this.load.audio('points', pointsSound);
        this.load.audio('total-points', totalPointsSound);
        this.load.audio('menu-song', menuSongSound);
        this.load.audio('play-song', playSongSound);
        this.load.audio('points-song', pointsSongSound);

        // fonts
        this.load.font('Luckiest Guy', LuckiestGuyFont, 'truetype');
        this.load.font('Nunito', NunitoFont, 'truetype');
        this.load.font('SpecialElite', SpecialEliteFont, 'truetype');

        // json
        this.load.json('words', wordsJson);

    }

    create()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.createAnimations();


        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Background');
        this.scene.launch('Menu');
    }

    createAnimations() {

        this.anims.create({
            key: 'mower-walk',
            frames: this.anims.generateFrameNames('lawn-mower', {frames: [0, 1]}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'dance',
            frames: this.anims.generateFrameNames('dance-body', {frames: [0, 1]}),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'dance-fast',
            frames: this.anims.generateFrameNames('dance-body', {frames: [0, 1]}),
            frameRate: 4,
            repeat: -1
        });

    }
}
