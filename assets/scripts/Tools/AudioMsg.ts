import { _decorator, Node, AudioClip, AudioSource, game, find, assetManager, resources } from "cc";
import { Dictionary } from "./Dictionary";

const { ccclass, property } = _decorator;

/**最多有几个音效播放器*/
const MAX_SOUNDS: number = 8

/**
 * 音效管理器
 */
@ccclass("AudioMgr")
export class AudioMgr {

    private static _instance: AudioMgr;
    public static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new AudioMgr();
        return this._instance;
    }

    /**音效的常驻节点*/
    private _persistRootNode: Node = null;
    //bgm音效全局唯一一个
    private _music: AudioSource = null
    //sound音效可以有多个
    private _sounds: AudioSource[] = null
    /**bgm静音 0没静音 1静音*/
    private _music_muted: number = 0
    /**sound静音 0没静音 1静音*/
    private _sound_muted: number = 0
    /**bgm音量*/
    private _music_volume: number = 1
    /**sound音量*/
    private _sound_volume: number = 1
    /**当前播放的音效索引用以控制使用不同的AudioSource*/
    private _now_soundid: number = 0
    /**当前播放的bgm音效名字*/
    private _cur_music_name: string = ""
    //存储所有的音效片段
    private music_clips: Dictionary<string, AudioClip>
    Init() {
        if (this._persistRootNode) return; //避免切换场景初始化报错
        this._persistRootNode = find("Canvas");
        this._sounds = []
        this.music_clips = new Dictionary<string, AudioClip>()
        /**
         * 读取本地存储的数据
         * 
         */
        this._music = this._persistRootNode.addComponent(AudioSource)
        //获取bgm的音量
        this._music.volume = this._music_volume
        //获取bgm是否存储静音
        this._music.volume = this._music_muted == 1 ? 0 : this._music_volume
        //获取sounds列表
        for (let i = 0; i < MAX_SOUNDS; i++) {
            this._sounds[i] = this._persistRootNode.addComponent(AudioSource)
            this._sounds[i].volume = this._sound_volume
            this._sounds[i].volume = this._sound_muted == 1 ? 0 : this._sound_volume
        }
    }

    /**
     * @param audioName 音效名字
     * @param isLoop 是否循环播放
     * @protected 播放音效
     */
    playMusic(audioName: string, isLoop: boolean = true) {
        if (this._cur_music_name == audioName) {
            return
        }
        let call = (clip) => {
            this._music.clip = null
            this._music.clip = clip
            this._music.loop = isLoop
            this._music.play()
            if (!this.music_clips.containsKey(audioName)) {
                this.music_clips.add(audioName, clip)
            }
        }
        if (this.music_clips.containsKey(audioName)) {
            call(this.music_clips.getValue(audioName))
        } else {
            let bundleName = "base.audio"
            let path = bundleName + "/" + audioName
            assetManager.loadBundle(bundleName, (err, bundle) => {
                bundle.load(path, AudioClip, (err: any, clip: any) => {
                    if (err) {
                        console.error("loadAudioClip" + err);
                    } else {
                        call(clip)
                    }
                });

            })
        }
    }

    /**
     * @param audioName 音效名字
     * @param isLoop 是否循环播放
     * @protected 播放音效
     */
    playSound(audioName: string, isLoop: boolean = false) {
        let call = (clip) => {
            this._sounds[this._now_soundid].clip = null
            this._sounds[this._now_soundid].clip = clip
            this._sounds[this._now_soundid].loop = isLoop
            this._sounds[this._now_soundid].play()
            if (!this.music_clips.containsKey(audioName)) {
                this.music_clips.add(audioName, clip)
            }
            this._now_soundid = this._now_soundid + 1 >= this._sounds.length ? 0 : this._now_soundid + 1
        }
        if (this.music_clips.containsKey(audioName)) {
            call(this.music_clips.getValue(audioName))
        } else {
            let bundleName = "Audio"
            //
            let path = bundleName + "/" + audioName
            // assetManager.loadBundle(bundleName,(err, bundle) => {
            //     bundle.load(path,AudioClip,(err: any, clip: any)=>{
            //         if (err) {
            //             console.error("loadAudioClip" + err);
            //         }else{
            //             call(clip)
            //         }
            //     });

            // })
            resources.load(path, AudioClip, (err, clip: AudioClip) => {
                if (err) {
                    console.error("loadAudioClip" + err);
                } else {
                    call(clip)
                }
            })
        }
    }

    /**
     * 停止播放bgm
     */
    stopMusic() {
        this._music.stop()
        this._music.clip = null
    }

    /**
     * 停止播放所有的sound
     */
    stopAllSound() {
        for (let i = 0; i < this._sounds.length; i++) {
            this._sounds[i].stop()
            this._sounds[i].clip = null
        }
        this._now_soundid = 0
    }

    /**
     * 
     * @param mute 是否静音music
     */
    setMusicMute(mute: boolean) {
        if (mute == (this._music_muted == 1)) {
            return
        }
        this._music_muted = mute ? 1 : 0
        this._music.volume = mute ? this._music_volume : 0
        //存储music静音 this._music_muted
    }

    /**
     * 
     * @param mute 是否静音sound
     */
    setSoundMute(mute: boolean) {
        if (mute == (this._sound_muted == 1)) {
            return
        }
        this._sound_muted = mute ? 1 : 0
        for (let i = 0; i < this._sounds.length; i++) {
            this._sounds[i].volume = mute ? this._sound_volume : 0
        }
        //存储sound静音 this._sound_muted
    }

    /**
     * 
     * @param value 设置音乐声音大小
     */
    setMusicVolume(value: number) {
        this._music.volume = value
        this._music_volume = value
        //存储music音量大小 this._music_volume
    }

    /**
     * 
     * @param value 设置sound声音大小
     */
    setSoundVolume(value: number) {
        this._sound_volume = value
        for (let i = 0; i < this._sounds.length; i++) {
            this._sounds[i].volume = value
        }
        //存储sound音量大小 this._sound_volume
    }

    /**
     * 
     * @returns 返回bgm静音状态
     */
    getMusicMute() {
        return this._music_muted
    }

    /**
     * 
     * @returns 返回sound音效静音状态
     */
    getSoundMute() {
        return this._sound_muted
    }

    /**
     * 
     * @returns 返回bgm声音大小
     */
    getMusicVolume() {
        return this._music_volume
    }

    /**
     * 
     * @returns 返回sound音效声音大小
     */
    getSoundVolume() {
        return this._sound_volume
    }
}