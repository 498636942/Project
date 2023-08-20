import { _decorator, Component, Node, Enum, Input } from 'cc';
import { AudioMgr } from '../Tools/AudioMsg';
const { ccclass, property } = _decorator;


export enum AudioClipType {
    None,
    Click,//点击
    LeftRight,//左右按键
}


@ccclass('AudioUI')
export class AudioUI extends Component {
    @property({
        type: Enum(AudioClipType),
        displayName: 'audioClipType',
    })
    audioClipType: AudioClipType = AudioClipType.Click;

    @property
    public audioName: string = "";

    start() {
        this.node.on(Input.EventType.MOUSE_DOWN, this.Click, this);
    }

    Click() {
        if (this.audioClipType == AudioClipType.None) {
            AudioMgr.instance.playSound(this.audioName);
        } else {
            switch (this.audioClipType) {
                case AudioClipType.Click:
                    AudioMgr.instance.playSound("click");
                    break;
                case AudioClipType.LeftRight:
                    AudioMgr.instance.playSound("leftRight");
                    break;
            }
        }

    }
}


