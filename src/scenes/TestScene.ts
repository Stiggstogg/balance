import {GameObjects, Scene, Physics} from 'phaser';
import gameOptions from "../helper/gameOptions.ts";

// TODO: Remove this scene at the end. It is only for testing

export default class TestScene extends Scene
{

    private lawnTexture: GameObjects.RenderTexture;
    private mower: Physics.Arcade.Sprite;
    private mower2: GameObjects.Rectangle;
    private direction: number = 0;
    private speed: number = 1;
    private mowerLine: GameObjects.Line;
    private mowerLine2: GameObjects.Polygon;
    private lineStart: {x: number, y: number};
    private lineStart2: {x: number, y: number};
    private polygonPoints: number[];

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
        const mowerStart = {x: 20, y: 20};
        this.lineStart = {x: mowerStart.x, y: mowerStart.y};
        this.mowerLine = this.add.line(0, 0, this.lineStart.x, this.lineStart.y, mowerStart.x + 20, mowerStart.y, 0x99e550).setLineWidth(20).setOrigin(0);

        this.mower = this.physics.add.sprite(mowerStart.x, mowerStart.y, 'lawn-mower');

        // setup physics for mower
        this.physics.add.existing(this.mower);      // add mower to physics system
        this.mower.setCollideWorldBounds(true); // set world bounds for the mower


        //this.add.line(0, 0, 0, 100, 30, 100, 0x000000).setLineWidth(20).setOrigin(0);

        // create a graphics object (mower 2)
        const mowerStart2 = {x: 20, y: 300};
        this.lineStart2 = {x: mowerStart2.x - 10, y: mowerStart2.y};
        this.polygonPoints = [];
        this.polygonPoints.push(...[this.lineStart2.x, this.lineStart2.y]);
        this.polygonPoints.push(...[mowerStart2.x + 10, mowerStart2.y]);

        this.mowerLine2 = this.add.polygon(0, 0, this.polygonPoints).setOrigin(0);
        this.mowerLine2.setStrokeStyle(20, 0x0000ff);

        this.mower2 = this.add.rectangle(mowerStart2.x, mowerStart2.y, 20, 20, 0xff00ff, 0.5).setVisible(true);

        // add keyboard input
        this.input.keyboard?.addKey('SPACE').on('down', () =>
        {



            // set start line position
            const lineOffset = {x: 0, y: 0};

            // move the mower
            switch (this.direction) {
                case 0:
                    lineOffset.x = 0;
                    break;
                case 1:
                    lineOffset.y = 0;
                    break;
                case 2:
                    lineOffset.x = 0;
                    break;
                case 3:
                    lineOffset.y = 0;
                    break;
            }

            this.lawnTexture.draw(this.mowerLine);
            this.lineStart.x = this.mower.x + lineOffset.x;
            this.lineStart.y = this.mower.y + lineOffset.y;
            this.mowerLine.setTo(this.lineStart.x, this.lineStart.y, this.mower.x, this.mower.y);

            /*// mower 2
            this.polygonPoints.push(this.mower2.x + lineOffset.x);
            this.polygonPoints.push(this.mower2.y + lineOffset.y);
            this.polygonPoints.push(this.mower2.x + lineOffset.x);
            this.polygonPoints.push(this.mower2.y + lineOffset.y);
            this.mowerLine2.setTo(this.polygonPoints);
             */

        });

        const enterKey = this.input.keyboard?.on('down', () =>
        {

            console.log('enter key pressed');

            /*for (let i = 0; i < gameOptions.gameWidth; i++) {
                for (let j = 0; j < gameOptions.gameHeight; j++) {

                    const color = this.lawnTexture.snapshot(i, j).getPixel32(0, 0);

                }
            }*/

        });


    }

    update()
    {

        const lineOffset = {x: 0, y: 0}

        // move the mower
        switch (this.direction) {
            case 0:
                this.mower.x += this.speed;
                //this.mower2.x += this.speed;
                lineOffset.x = 10;
                break;
            case 1:
                this.mower.y += this.speed;
                //this.mower2.y += this.speed;
                lineOffset.y = 10;
                break;
            case 2:
                this.mower.x -= this.speed;
                //this.mower2.x -= this.speed;
                lineOffset.x = -10;
                break;
            case 3:
                this.mower.y -= this.speed;
                //this.mower2.y -= this.speed;
                lineOffset.y = -10;
                break;
        }

        this.mowerLine.setTo(this.lineStart.x, this.lineStart.y, this.mower.x + lineOffset.x, this.mower.y + lineOffset.y);

        //this.polygonPoints[this.polygonPoints.length - 2] = this.mower2.x + lineOffset.x;
        //this.polygonPoints[this.polygonPoints.length - 1] = this.mower2.y + lineOffset.y;
        //this.mowerLine2.setTo(this.polygonPoints);


        //this.lawnTexture.draw(this.mower);



    }

}
