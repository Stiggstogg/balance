import {GameObjects, Math} from 'phaser';

export default class Watch extends GameObjects.Container {

    private watch: GameObjects.Image;
    private point: GameObjects.Graphics;
    private slice: GameObjects.Graphics;
    public watchHeight: number;
    private timeLimit: number;
    private running: boolean = false;
    private startTime: number;

    constructor(scene: Phaser.Scene, x: number, y: number, timeLimit: number) {

        super(scene, x, y);

        this.timeLimit = timeLimit;

        // create objects and add to container
        this.watch = new GameObjects.Image(scene, 0, 0, 'watch');

        this.point = new GameObjects.Graphics(scene);
        this.point.fillStyle(0x000000);
        this.point.fillCircle(0, 0, 3);

        this.slice = new GameObjects.Graphics(scene);
        this.slice.slice(0, 0, 70, Math.DegToRad(269.9), Math.DegToRad(270), true);
        this.slice.fillStyle(0xdf7126);
        this.slice.fillPath();

        this.add([this.watch, this.slice, this.point]);

        // set the watch height
        this.watchHeight = this.watch.height;

    }

    update() {

        if (this.running) {
            // calculate the time elapsed since the start
            const elapsedTime = (this.scene.time.now - this.startTime) / 1000;
            const angle = Math.DegToRad(270) + Math.DegToRad(360 * (elapsedTime / this.timeLimit));
            this.slice.clear();
            this.slice.slice(0, 0, 70, Math.DegToRad(269.9), angle, true);
            this.slice.fillStyle(0xdf7126);
            this.slice.fillPath();

            if (elapsedTime >= this.timeLimit) {
                this.slice.destroy();
                this.running = false;
                this.scene.events.emit('stopGame');
            }
        }

    }

    // start the timer
    startTimer() {
        this.running = true;
        this.startTime = this.scene.time.now;
    }


}