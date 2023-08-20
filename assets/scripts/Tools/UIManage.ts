import { _decorator, Component, Node, Prefab, instantiate, Director, resources, SpriteFrame } from 'cc';
import { ViewEnum } from './ViewEnum';
const { ccclass, property } = _decorator;

@ccclass('UIManage')
export class UIManage {
    private static instance: UIManage = null;

    public static get getInstance() {
        if (!UIManage.instance) {
            UIManage.instance = new UIManage();
        }
        return UIManage.instance;
    }
    //所有页面
    public allViewList: any = {};

    constructor() {
        this.allViewList = {};
    }

    public Init(name: ViewEnum, item: Node) {
        //初始页存入页面控制list
        this.allViewList[name] = item;
    }

    public ShowView(name: ViewEnum, parent: Node, prefab: Prefab, isCloseOtherView: boolean = false) {
        var item;
        if (isCloseOtherView) {
            //隐藏所有页面
            for (const key in this.allViewList) {
                if (Object.prototype.hasOwnProperty.call(this.allViewList, key)) {
                    const element = this.allViewList[key];
                    element.active = false;
                }
            }
        }
        if (this.allViewList[name]) {
            item = this.allViewList[name];
        } else {
            //第一次初始化，存入数组(简单对象池)
            item = instantiate(prefab);
            this.allViewList[name] = item;
        }
        if (item) {
            if (parent != null) {
                parent.addChild(item);
            }
            item.active = true;
        }
    }

    public CloseView(name: ViewEnum) {
        if (this.allViewList[name]) {
            var view: Node = this.allViewList[name];
            view.removeFromParent();
            view.destroy();
        }
    }

    //改变图片Sprite
    public LoadImageSprite(resName, sprite, onComplete?: Function) {
        resources.load(resName + "/spriteFrame", (err, spriteAsset: SpriteFrame) => {
            sprite.spriteFrame = spriteAsset;
            onComplete && onComplete();
        })
    }

}


