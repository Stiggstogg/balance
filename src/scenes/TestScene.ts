import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Mower from '../sprites/Mower.ts';
import Color = Phaser.Display.Color;

// TODO: Remove this scene at the end. It is only for testing

export default class TestScene extends Scene
{

    private lawnTexture: GameObjects.RenderTexture;
    private mower: Mower;
    private mowerLine: GameObjects.Line;
    private lineStart: {x: number, y: number};

    constructor()
    {
        super('Test');
    }

    create()
    {

        // create a render texture
        this.lawnTexture = this.add.renderTexture(0, 0, gameOptions.gameWidth, gameOptions.gameHeight).setOrigin(0);
        this.lawnTexture.fill(0x8f974a);

        // create a graphics object
        const mowerStart = {x: 10, y: 10};
        this.lineStart = {x: mowerStart.x, y: mowerStart.y};
        this.mowerLine = this.add.line(0, 0, this.lineStart.x, this.lineStart.y, mowerStart.x + 20, mowerStart.y, 0x99e550).setLineWidth(20).setOrigin(0);

        this.mower = this.add.existing(new Mower(this, mowerStart.x, mowerStart.y));

        // setup physics for mower
        this.physics.add.existing(this.mower);      // add mower to physics system
        this.mower.setCollideWorldBounds(true);     // set world bounds for the mower

        // add keyboard input
        this.input.on('pointerdown', () =>
        {
            this.lawnTexture.draw(this.mowerLine);
            this.mower.rotate(true);
            this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);
        });

        this.input.keyboard?.addKey('LEFT').on('down', () =>
        {

            this.lawnTexture.draw(this.mowerLine);
            this.mower.rotate(false);
            this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

        });

        this.input.keyboard?.addKey('RIGHT').on('down', () =>
        {

            this.lawnTexture.draw(this.mowerLine);
            this.mower.rotate(true);
            this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

        });


        this.input.keyboard?.addKey('SPACE').on('down', () =>
        {

            console.log(Date.now());

            this.lawnTexture.snapshot(this.lawnTextureSnapshot);

        });


    }

    update()
    {

        this.mower.update();

        this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

    }

    lawnTextureSnapshot(image: HTMLImageElement | Color) {

        // Check if the image is an instance of HTMLImageElement
        if (!(image instanceof HTMLImageElement)) {
            console.error('Invalid image type');
            return;
        }

        // create an offscreen canvas (will not be added to DOM so it will be automatically garbage collected)
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = gameOptions.gameWidth;
        offscreenCanvas.height = gameOptions.gameHeight;

        const context = offscreenCanvas.getContext('2d');
        if (!context) return;

        // Draw the snapshot image onto our offscreen canvas
        context.drawImage(image, 0, 0);

        // Now get the pixel data
        const imageData = context.getImageData(0, 0, gameOptions.gameWidth, gameOptions.gameHeight);
        const data = imageData.data;

        let originalColorCount = 0;
        let changedColorCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (r === 143 && g === 151 && b === 74) {
                originalColorCount++;
            } else {
                changedColorCount++;
            }
        }

        const totalPixels = gameOptions.gameWidth * gameOptions.gameHeight;
        const tracedPercent = (changedColorCount / totalPixels) * 100;

        console.log(originalColorCount);
        console.log(changedColorCount);

        console.log(`Traced Area: ${tracedPercent.toFixed(2)}%`);
    }

}
