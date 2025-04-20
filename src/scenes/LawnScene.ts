import {GameObjects, Types} from 'phaser';
import {ButtonId, Side} from '../helper/enums.ts';
import BaseFrameScene from './BaseFrameScene.ts';
import Mower from '../sprites/Mower.ts';
import LawnButton from '../sprites/LawnButton.ts';

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

    constructor(config?: string | Types.Scenes.SettingsConfig)
    {
        super(Side.LIFE, 'Lawn Mowing', 'Mow the lawn', 'Lawn');
        //super(Side.LIFE, 'Right', 'Do something', 'Lawn');            // TODO: Remove at the end, just for video recording before full game reveal

    }

    create()
    {

        // create elements from base scene (frame etc.)
        super.create();

        // add lawn, background, pool and sandbox
        this.lawn = this.add.renderTexture(0, 0, 440, 317).setOrigin(1,0).setDepth(1);
        this.lawn.draw('lawn-lawn', 0, 0);        // draw the lawn texture on the render texture
        this.background = this.add.image(0, 0, 'lawn-background').setOrigin(1,0).setDepth(1);
        this.pool = this.physics.add.staticImage(0, 0, 'lawn-pool').setOrigin(1,0).setDepth(1);
        this.sand = this.physics.add.staticImage(0, 0, 'lawn-sand').setOrigin(1,0).setDepth(1);
        this.houseCollider = this.add.zone(548, 128, 142, 225).setOrigin(0);
        this.physics.add.existing(this.houseCollider, true);        // add the house collider to the physics system

        // get the total number of green pixels in the lawn texture
        // TODO: Implement and remove pixels from the lawn texture where the pool and the sandbox are

        // add lawn mower and the mower line
        const mowerStart = {x: 710, y: 280};        // start position of the mower
        this.mower = this.add.existing(new Mower(this, mowerStart.x, mowerStart.y)).setDepth(1.1).setVisible(false);
        this.mowerLine = this.add.line(0, 0, this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y, 0x99e550).setLineWidth(10).setOrigin(0).setVisible(false).setDepth(1);

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


        // event listeners for the button clicks
        this.events.on('click' + ButtonId.LAWN, (clockwise: boolean) => {

            this.lawn.draw(this.mowerLine);
            this.mower.rotate(clockwise);
            this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

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

            // TODO: Remove only test
            const testLine = this.add.line(0, 0, 800, 330, 850, 330, 0x000000).setLineWidth(20).setOrigin(0).setDepth(1.1);

            this.lawn.draw(testLine);

            testLine.destroy();


        });

        // event listener for game stop
        this.events.once('stopGame', () => {                // game stop

            this.mower.setVisible(false);
            this.mowerLine.setVisible(false);
            this.buttonClockwise.setVisible(false);
            this.buttonCounterClockwise.setVisible(false);
            this.mower.stopMower();

            // draw last line to texture
            // TODO: Needs to be implemented

            // calculate the points
            // TODO: Needs to be implemented

        });

        // remove all custom event listeners when the scene is destroyed
        this.events.once('shutdown', () => {
            this.events.off('click' + ButtonId.LAWN);
        });

    }

    update() {

        // move the background, lawn, pool and sandbox together with the frame
        const lawnPos = {x: -33, y: 33};       // set relative position to outer frame
        const backgroundPos = {x: -11, y: 11};       // set relative position to outer frame
        const poolPos = {x: -68, y: 54};
        const sandPos = {x: -151, y: 221};

        this.lawn.setPosition(this.frameOuter.x + lawnPos.x, this.frameOuter.y + lawnPos.y);
        this.background.setPosition(this.frameOuter.x + backgroundPos.x, this.frameOuter.y + backgroundPos.y);
        this.pool.setPosition(this.frameOuter.x + poolPos.x, this.frameOuter.y + poolPos.y);
        this.sand.setPosition(this.frameOuter.x + sandPos.x, this.frameOuter.y + sandPos.y);

        // update the mower
        this.mower.update();

        // update the mower line
        this.mowerLine.setTo(this.mower.getStartMowed().x, this.mower.getStartMowed().y, this.mower.getCurrentMowed().x, this.mower.getCurrentMowed().y);

    }

    // handle button click
    handleButtonClick(value: number) {

    }

}
