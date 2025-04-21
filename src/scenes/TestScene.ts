import {GameObjects, Scene} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";
import Mower from '../sprites/Mower.ts';
import Color = Phaser.Display.Color;

// TODO: Remove this scene at the end. It is only for testing

export default class TestScene extends Scene
{

    private lawn: GameObjects.RenderTexture;
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
        //this.lawn = this.add.renderTexture(987, 37, 440, 317).setOrigin(1,0).setDepth(1);
        this.lawn = this.add.renderTexture(gameOptions.gameWidth, 0, gameOptions.gameWidth, gameOptions.gameHeight).setOrigin(1,0).setDepth(1);
        //this.lawn.fill(0x8f974a);
        this.lawn.draw('lawn-lawn', 548, 36);

        // create a graphics object
        const mowerStart = {x: 710, y: 280};        // start position of the mower
        this.mower = this.add.existing(new Mower(this, mowerStart.x, mowerStart.y)).setDepth(1.1).setVisible(true);
        this.mowerLine = this.add.line(0, 0, this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y, 0x99e550).setLineWidth(10).setOrigin(0).setVisible(true).setDepth(1);

        this.mower.startMower();

        // add keyboard input
        this.input.on('pointerdown', () =>
        {
            this.lawn.draw(this.mowerLine);
            this.mower.rotate(true);
            this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

            //this.lawn.draw(this.add.line(0, 0, 10, 10, 20, 20, 0xFFFFFF).setLineWidth(10));

        });

        this.input.keyboard?.addKey('SPACE').on('down', () =>
        {

            console.log(Date.now());

            this.lawn.snapshot(this.lawnTextureSnapshot);

        });


    }

    update()
    {

        // update the mower
        this.mower.update();

        // update the mower line
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
