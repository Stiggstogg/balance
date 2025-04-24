import {Utils} from 'phaser';

// This is the game manager which sets up the game sequence (mini-games) and keeps track of the points
class GameManager {

    private stage: number;
    private lastStage: boolean = false;         // true if the game is over
    private readonly scenesWork: string[];
    private readonly scenesLife: string[];
    private sceneSequenceWork: string[];
    private sceneSequenceLife: string[];
    private readonly progressDescriptionsWork: string[];
    private readonly progressDescriptionsLife: string[];
    private progressWork: number;          // progress of the work scene
    private multiplier: number;             // multiplier of the latest work stage
    private progressLife: number;           // progress of the life scene
    private points: number;                 // points of the latest life stage
    private totalPoints: number;            // total points of the game

    constructor() {

        // available scenes, provide here the keys/names of the scenes
        this.scenesWork = ['Accountant', 'Editor'];
        this.scenesLife = ['Lawn', 'Dance'];

        // progress descriptions (for points scene)
        this.progressDescriptionsWork = ['Accurate sums:', 'Typos found:'];
        this.progressDescriptionsLife = ['Mowed grass:', 'Dance sync:'];

        // initialize the other variables
        this.newGame();

    }

    // new Game
    public newGame(): void {

        // reset the game
        this.stage = 0;
        this.lastStage = false;
        this.sceneSequenceWork = [];
        this.sceneSequenceLife = [];
        this.progressWork = 0;
        this.multiplier = 1;
        this.progressLife = 0;
        this.points = 0;
        this.totalPoints = 0;

        // create a random sequence of the scenes
        this.createSceneSequence();

    }

    // create a random sequence of the scenes
    private createSceneSequence(): void {

        // empty the sequence arrays
        this.sceneSequenceWork = [];
        this.sceneSequenceLife = [];

        // create a random order of the work and lifes scenes
        const scenesIndexWork: number[] = [];
        const scenesIndexLife: number[] = [];

        for (let i = 0; i < this.scenesWork.length; i++) {
            scenesIndexWork.push(i);
        }

        for (let i = 0; i < this.scenesLife.length; i++) {
            scenesIndexLife.push(i);
        }

        Utils.Array.Shuffle(scenesIndexWork);
        Utils.Array.Shuffle(scenesIndexLife);

        // create sequence of work scenes based on the random sequence to ensure they do not repeat
        for (let i = 0; i < this.scenesLife.length; i++) {
            for (let j = 0; j < this.scenesWork.length; j++) {

                this.sceneSequenceWork.push(this.scenesWork[scenesIndexWork[j]]);

            }
        }

        // create sequence of life scenes based on the random sequence to ensure they do not repeat TODO: This code only works if the number of work and life scenes is 2 each! Improve it for any number
        // !!!!!!!!!!!!!!! CODE WORKS ONLY FOR 2 WORK AND 2 LIFE SCENES !!!!!!!!!!!!!!
        this.sceneSequenceLife.push(this.scenesLife[scenesIndexLife[0]]);
        this.sceneSequenceLife.push(this.scenesLife[scenesIndexLife[1]]);
        this.sceneSequenceLife.push(this.scenesLife[scenesIndexLife[1]]);
        this.sceneSequenceLife.push(this.scenesLife[scenesIndexLife[0]]);

    }

    // get next work scene
    public getNextWorkScene(): string {
        return this.sceneSequenceWork[this.stage];
    }

    // get next life scene
    public getNextLifeScene(): string {
        return this.sceneSequenceLife[this.stage];
    }

    // get the current stage number
    public getStage(): number {
        return this.stage + 1;
    }

    // get the total number of stages
    public getTotalStages(): number {
        return this.sceneSequenceWork.length;
    }

    // go to the next stage
    public nextStage(): void {
        this.stage++;

        if (this.stage >= this.sceneSequenceWork.length - 1) {
            this.lastStage = true;
        }
    }

    // set the progress and multiplier of the latest work scene
    public setWorkProgressMultiplier(progress: number, multiplier: number): void {
        this.progressWork = progress;
        this.multiplier = multiplier;

        console.log('Work:\nProgress: ' + this.progressWork + '\nMultiplier: ' + this.multiplier);      // TODO: Remove at the end. Just for testing

    }

    // set the progress and points of the latest life scene
    public setLifeProgressPoints(progress: number, points: number): void {
        this.progressLife = progress;
        this.points = points;

        console.log('Life:\nProgress: ' + this.progressLife + '\nPoints: ' + this.points);              // TODO: Remove at the end. Just for testing
    }

    // get the progress of the latest work scene
    public getWorkProgress(): number {
        return this.progressWork;
    }

    // get the multiplier of the latest work scene
    public getWorkMultiplier(): number {
        return this.multiplier;
    }

    // get the progress of the latest life scene
    public getLifeProgress(): number {
        return this.progressLife;
    }

    // get the points of the latest life scene
    public getLifePoints(): number {
        return this.points;
    }

    // get the total points of the game
    public getTotalPoints(): number {
        return this.totalPoints;
    }

    // increase the total points of the game
    public setTotalPoints(): void {
        this.totalPoints += this.points * this.multiplier;
    }

    // check if this is the last stage
    public isLastStage(): boolean {
        return this.lastStage;
    }

    // get the progress description of the latest work scene
    public getWorkProgressDescription(): string {

        const currentScene = this.sceneSequenceWork[this.stage];

        for (let i = 0; i < this.scenesWork.length; i++) {
            if (currentScene === this.scenesWork[i]) {
                return this.progressDescriptionsWork[i];
            }
        }
        return ''
    }

    // get the progress description of the latest life scene
    public getLifeProgressDescription(): string {

        const currentScene = this.sceneSequenceLife[this.stage];

        for (let i = 0; i < this.scenesLife.length; i++) {
            if (currentScene === this.scenesLife[i]) {
                return this.progressDescriptionsLife[i];
            }
        }
        return ''
    }

}

export default new GameManager();