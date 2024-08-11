import { Scene } from 'phaser';

import logoImg from '../assets/images/logo.png';

export default class BootScene extends Scene
{
    constructor()
    {
        super('Boot');
    }

    preload()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('logo', logoImg);
    }

    create()
    {
        this.scene.start('Loading');
    }
}
