import {GameObjects, Types, Display} from 'phaser';
import {Math as Mathphaser} from 'phaser';
import {ButtonId, Side} from '../helper/enums.ts';
import BaseFrameScene from './BaseFrameScene.ts';
import Mower from '../sprites/Mower.ts';
import LawnButton from '../sprites/LawnButton.ts';
import gameOptions from '../helper/gameOptions.ts';
import gameManager from '../helper/GameManager.ts';

// "Life: Lawn Mower" scene
export default class LawnScene extends BaseFrameScene
{

    private background: GameObjects.Image;
    private pool: Types.Physics.Arcade.ImageWithStaticBody;
    private sand: Types.Physics.Arcade.ImageWithStaticBody;
    private lawn: GameObjects.RenderTexture;
    private mower: Mower;
    private mowerLine: GameObjects.Line;
    private houseCollider: GameObjects.Zone;
    private buttonClockwise: LawnButton;
    private buttonCounterClockwise: LawnButton;
    private unmowedColor: Display.Color;
    private mowedColor: Display.Color;
    private totalPixels: number;
    private mowedPixels: number;

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(Side.LIFE, 'Lawn Mowing', 'Time to tidy up the turf!\nRotate your mower left or right to cut every patch.', 'Lawn');

    }

    create()
    {

        // create elements from base scene (frame etc.)
        super.create();

        // set colors
        this.unmowedColor = new Display.Color(55, 148, 110);        // color of the unmowed lawn (needs to be the same as the one in the lawn texture)
        this.mowedColor = new Display.Color(153, 229, 80);          // color of the mowed lawn

        // add lawn, background, pool and sandbox
        this.lawn = this.add.renderTexture(0, 0, gameOptions.gameWidth, gameOptions.gameHeight).setOrigin(1,0).setDepth(1);
        this.lawn.draw('lawn-lawn', 547, 37);        // draw the lawn texture on the render texture
        this.background = this.add.image(0, 0, 'lawn-background').setOrigin(1,0).setDepth(1.1);
        this.pool = this.physics.add.staticImage(0, 0, 'lawn-pool').setOrigin(1,0).setDepth(1.1);
        this.sand = this.physics.add.staticImage(0, 0, 'lawn-sand').setOrigin(1,0).setDepth(1.1);
        this.houseCollider = this.add.zone(548, 128, 142, 225).setOrigin(0);
        this.physics.add.existing(this.houseCollider, true);        // add the house collider to the physics system

        // get the total number of unmowed grass pixels in the lawn texture
        this.lawn.snapshot((image: HTMLImageElement | any) => {
            this.totalPixels = this.getLawnPixelsInColor(image, this.unmowedColor);
        });

        // create a random start position for the mower
        const startArea = {x: 690, y: 128, width: 0, height: 225};
        const mowerStart = {x: startArea.x + Mathphaser.RND.integerInRange(0, startArea.width), y: startArea.y + Mathphaser.RND.integerInRange(0, startArea.height)};        // start position of the mower

        // create mower and st
        this.mower = this.add.existing(new Mower(this, mowerStart.x, mowerStart.y)).setDepth(1.2).setVisible(false);
        this.mowerLine = this.add.line(0, 0, this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y, this.mowedColor.color).setLineWidth(20).setOrigin(0).setVisible(false).setDepth(1);

        // add colliders
        this.physics.world.setBounds(548, 36, 440, 317);        // set the world bounds to the size of the lawn
        this.mower.setCollideWorldBounds(true);                 // set the mower to collide with the world bounds
        this.physics.add.collider(this.mower, this.pool);
        this.physics.add.collider(this.mower, this.sand);
        this.physics.add.collider(this.mower, this.houseCollider);

        // add buttons
        const buttonDistance = 200;
        const buttonY = this.frameOuter.y + 420;
        this.buttonCounterClockwise = this.add.existing(new LawnButton(this, this.xIn - this.frameOuter.width/2 - buttonDistance/2, buttonY, ButtonId.LAWN, false)).setDepth(1.1).setVisible(false);
        this.buttonClockwise = this.add.existing(new LawnButton(this, this.xIn - this.frameOuter.width/2 + buttonDistance/2, buttonY, ButtonId.LAWN, true)).setDepth(1.1).setVisible(false);

        // set the start progress value
        this.setProgress(0);

        // event listeners for the button clicks
        this.events.on('click' + ButtonId.LAWN, (clockwise: boolean) => {

            this.lawn.draw(this.mowerLine);
            this.mower.rotate(clockwise);
            this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

            // get the current number of pixels mowed and show the progress
            this.lawn.snapshot((image: HTMLImageElement | any) => {
                this.mowedPixels = this.getLawnPixelsInColor(image, this.mowedColor);

                // this part needs to be in the same function, to ensure the snapshot is finished before the calculation
                const percentage = Math.round((this.mowedPixels / this.totalPixels) * 100);

                this.setProgress(percentage);

            });

        });

        // event listeners for game state events (start, stop)
        this.events.once('startGame', () => {               // game start

            // move the body of the pool and sandbox to their current position (after they slided in)
            this.pool.body!.x = this.pool.x - this.pool.width;  // width needs to be subtracted because the origin of the pool is 1, 0
            this.pool.body!.y = this.pool.y;
            this.sand.body!.x = this.sand.x - this.sand.width;  // width needs to be subtracted because the origin of the sandbox is 1, 0
            this.sand.body!.y = this.sand.y;

            // make mower and line visible and start the mower
            this.mower.setVisible(true);
            this.mowerLine.setVisible(true);
            this.mower.startMower();

            // make buttons visible
            this.buttonClockwise.setVisible(true);
            this.buttonCounterClockwise.setVisible(true);

        });

        // event listener for game stop
        this.events.once('stopGame', () => {                // game stop

            // draw last line to texture
            this.lawn.draw(this.mowerLine);

            // make everything invisible
            this.mower.setVisible(false);
            this.mowerLine.setVisible(false);
            this.buttonClockwise.setVisible(false);
            this.buttonCounterClockwise.setVisible(false);
            this.mower.stopMower();

            // get the number of mowed pixels and calculate the points
            this.lawn.snapshot((image: HTMLImageElement | any) => {
                this.mowedPixels = this.getLawnPixelsInColor(image, this.mowedColor);

                // this part needs to be in the same function, to ensure the snapshot is finished before the calculation
                const percentage = Math.round((this.mowedPixels / this.totalPixels) * 100);

                // set the progress one last time
                this.setProgress(percentage);

                // calculate the multiplier based on the progress and store them in the game manager
                gameManager.setLifeProgressPoints(this.progress, this.calculateResult(this.progress, gameOptions.lawnPointsFunctions));

            });

        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.LAWN);
        });

    }

    update() {

        // move the background, lawn, pool and sandbox together with the frame
        const lawnPos = {x: 4, y: -4};       // set relative position to outer frame
        const backgroundPos = {x: -11, y: 11};       // set relative position to outer frame
        const poolPos = {x: -68, y: 54};
        const sandPos = {x: -151, y: 220};

        this.lawn.setPosition(this.frameOuter.x + lawnPos.x, this.frameOuter.y + lawnPos.y);
        this.background.setPosition(this.frameOuter.x + backgroundPos.x, this.frameOuter.y + backgroundPos.y);
        this.pool.setPosition(this.frameOuter.x + poolPos.x, this.frameOuter.y + poolPos.y);
        this.sand.setPosition(this.frameOuter.x + sandPos.x, this.frameOuter.y + sandPos.y);

        // update the mower
        this.mower.update();

        // update the mower line
        this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

    }

    // get number of pixels in a certain color
    getLawnPixelsInColor(image: HTMLImageElement | any, lookupColor: Display.Color): number {

        // Check if the image is an instance of HTMLImageElement
        if (!(image instanceof HTMLImageElement)) {
            console.error('Invalid image type');
            return 0;
        }

        // create an offscreen canvas (will not be added to DOM so it will be automatically garbage collected)
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = gameOptions.gameWidth;
        offscreenCanvas.height = gameOptions.gameHeight;

        const context = offscreenCanvas.getContext('2d');
        if (!context) {
            console.error('Context not available');
            return 0;
        }

        // Draw the snapshot image onto our offscreen canvas
        context.drawImage(image, 0, 0);

        // Now get the pixel data
        const imageData = context.getImageData(0, 0, gameOptions.gameWidth, gameOptions.gameHeight);
        const data = imageData.data;

        let colorCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (r === lookupColor.red && g === lookupColor.green && b === lookupColor.blue) {
                colorCount++;
            }
        }

        return colorCount

    }

}
