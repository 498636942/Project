import { _decorator, Component, Node, Prefab, Input, Label } from 'cc';
import { Connect } from './Connect';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property(Label)
    public testLabel: Label = null;
    //最后一次点击
    private lastTime = 0;

    //当前点击次数
    private clickNun = 0;
    //需要点击次数
    private needClickNum = 3;

    start() {
        this.testLabel.node.active = false;
        this.node.on(Input.EventType.MOUSE_DOWN, this.ClickTest, this)
    }

    ClickTest() {
        let nowTime = new Date().getTime();
        //间隔时间
        let interTime = nowTime - this.lastTime;
        console.log("间隔时间" + interTime);
        if (interTime > 500) {
            this.clickNun = 1;
            this.testLabel.node.active = false;
        } else {
            this.clickNun++;
            if (this.clickNun >= this.needClickNum) {
                //执行测试代码
                this.Test();
            }
        }
        this.lastTime = nowTime;

    }
    //测试代码
    private Test() {
        this.testLabel.node.active = true;
        let text = "地址:" + Connect.getInstance.url + ";openid:" + Connect.getInstance.openid;
        this.testLabel.string = text;
    }
}


