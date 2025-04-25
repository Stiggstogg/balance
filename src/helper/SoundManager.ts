import {Sound, Scene} from 'phaser';
import gameOptions from './gameOptions.ts';

// sound manager class used as singleton
export default class SoundManager {

    // singleton instance
    private static instance: SoundManager | null = null;

    // scene
    private readonly scene: Scene;

    // songs
    public readonly menuSong: Sound.WebAudioSound;
    public readonly playSong: Sound.WebAudioSound;
    public readonly pointsSong: Sound.WebAudioSound;

    // sounds
    public readonly clickSound: Sound.WebAudioSound;
    public readonly correctSound: Sound.WebAudioSound;
    public readonly errorSound: Sound.WebAudioSound;
    public readonly countdownHighSound: Sound.WebAudioSound;
    public readonly countdownLowSound: Sound.WebAudioSound;
    public readonly mowerSound: Sound.WebAudioSound;
    public readonly pointsSound: Sound.WebAudioSound;
    public readonly totalPointsSound: Sound.WebAudioSound;

    constructor(scene: Scene) {

        // get scene (to have access to the sound manager)
        this.scene = scene;

        // add songs (looped and with volume set)
        this.menuSong = this.addSound(scene, 'menu-song').setLoop(true).setVolume(gameOptions.menuSongVolume);
        this.playSong = this.addSound(scene, 'play-song').setLoop(false).setVolume(gameOptions.playSongVolume);
        this.pointsSong = this.addSound(scene, 'points-song').setLoop(true).setVolume(gameOptions.pointsSongVolume);

        // add sounds (with volume set)
        this.clickSound = this.addSound(scene, 'click').setVolume(gameOptions.clickSoundVolume);
        this.correctSound = this.addSound(scene, 'correct').setVolume(gameOptions.correctSoundVolume);
        this.errorSound = this.addSound(scene, 'error').setVolume(gameOptions.errorSoundVolume);
        this.countdownHighSound = this.addSound(scene, 'countdown-high').setVolume(gameOptions.countdownHighSoundVolume);
        this.countdownLowSound = this.addSound(scene, 'countdown-low').setVolume(gameOptions.countdownLowSoundVolume);
        this.mowerSound = this.addSound(scene, 'mower').setVolume(gameOptions.mowerSoundVolume);
        this.pointsSound = this.addSound(scene, 'points').setVolume(gameOptions.pointsSoundVolume);
        this.totalPointsSound = this.addSound(scene, 'total-points').setVolume(gameOptions.totalPointsSoundVolume);

    }

    // adds a sound to the scene
    addSound(scene: Phaser.Scene, key: string) {

        let sound = scene.sound.get(key) as Sound.WebAudioSound;         // get the sound (if it is already loaded)

        if (sound == null) {                                                // load the sound if it is not loaded yet
            sound = scene.sound.add(key) as Sound.WebAudioSound;
        }

        return sound;

    }

    fadeOut(scene: Scene, key: string) {

        const sound = this.scene.sound.get(key) as Sound.WebAudioSound;

        sound.setVolume(1);         // set the volume to 1 before fading out

        scene.tweens.add({
            targets: sound,
            volume: 0,
            duration: 500,
            ease: 'Cubic.Out',
            onComplete: () => {
                sound.stop();             // stop the sound when the fade out is done
            }
        });

    }

    fadeIn(scene: Scene, key: string, finalVolume: number) {

        const sound = this.scene.sound.get(key) as Sound.WebAudioSound;         // get the sound

        sound.setVolume(0);

        scene.tweens.add({
            targets: sound,
            volume: finalVolume,
            duration: 500,
            ease: 'Cubic.Out',
            onStart: () => {
                sound.play();             // play the sound when the fade in starts
            }
        });
    }


    // singleton instance getter
    static getInstance(scene: Scene): SoundManager {

        if (this.instance === null) {
            this.instance = new SoundManager(scene);
        }

        return this.instance;

    }

}