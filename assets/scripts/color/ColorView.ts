import { _decorator, Component, Node, Color, Label, Button, Sprite, input, Input, color, game, Game, debug } from 'cc';
import { Connect } from '../Tools/Connect';
import { ColorManage } from './ColorManage';
const { ccclass, property } = _decorator;

@ccclass('ColorView')
export class ColorView extends Component {
    @property(Label)
    public timeDownLabel: Label;
    //图片内容
    @property(Node)
    public contentSprite: Node;
    //三个按钮
    @property({
        type: [Node],
        tooltip: '一个示例节点数组',
    })
    //三个按钮的描述
    btnArray: Node[] = [];
    @property({
        type: [Label],
        tooltip: '一个示例节点数组',
    })
    labelArray: Label[] = [];
    //内容Sprite
    private contentSprit: Sprite;
    //三个按钮
    @property({
        type: [Node],
        tooltip: '一个示例节点数组',
    })
    //游戏game，结束gameOver,两个UI页面
    gameArray: Node[] = [];
    //结算得分
    @property(Label)
    public resultLabel: Label;
    //返回主页按钮
    @property(Node)
    public returnMainBtn: Node;
    //当前时间
    private nowTime = 60;
    private allTime = 60;

    //当前选项
    private nowOption;
    //可选选项
    private selectOptions;
    //得分
    private _score = 0;
    public get Score() {
        return this._score;
    }
    private set Score(value) {
        this._score = value;
        this.scoreLabel.string = "分数：" + this._score;
    }
    //生命
    private _hp = 0;
    private set HP(value) {
        this._hp = value;
        this.hpLabel.string = "生命：" + this._hp;
    }
    public get HP() {
        return this._hp;
    }
    //满生命
    private _maxHp = 5;

    //分数
    @property(Label)
    public scoreLabel: Label;
    //血量
    @property(Label)
    public hpLabel: Label;

    start() {
        game.once(Game.EVENT_ENGINE_INITED, () => {
            document.title = '颜色敏感测试';
        });
        this.AddUIEventListener();
        //初始化连接类
        Connect.getInstance.Init();
    }
    onEnable() {
        this.Init();
        //游戏中
        this.SetGameState(0);
        this.RefreshView();
        this.TimeDown();
    }
    private Init() {
        this.Score = 0;
        this.HP = this._maxHp;
        this.nowTime = this.allTime;
        this.contentSprit = this.contentSprite.getComponent(Sprite);
    }

    public AddUIEventListener(): void {
        for (let index = 0; index < this.btnArray.length; index++) {
            const element = this.btnArray[index];
            element.on(Input.EventType.TOUCH_END, () => {
                this.ClickBtn(index);
            }, this);
        }
        this.returnMainBtn.on(Input.EventType.TOUCH_END, this.ReturnMainView, this)
    }
    /**
     * 更新页面
     * @param isDiff 是否困难 
     */
    private RefreshView(isDiff?) {
        //当前显示
        this.nowOption = ColorManage.getInstance.RandomColorIndex();
        //可选择选项
        // this.selectOptions = ColorManage.getInstance.GetOptions(this.nowOption);
        //显示内容
        this.ShowContentSprite(this.nowOption, this.contentSprit);
        //显示选择按钮
        this.ShowOptionLabel(isDiff);
    }
    //显示内容
    private ShowContentSprite(index: number, sprite: Sprite) {
        var color = ColorManage.getInstance.GetColorByIndex(index);
        if (sprite) {
            sprite.color = color;
        }
    }
    //显示选择按钮
    private ShowOptionLabel(isDiff) {
        //得到三个选项                
        this.selectOptions = ColorManage.getInstance.GetOptions(this.nowOption);
        for (let index = 0; index < this.labelArray.length; index++) {
            const element: Label = this.labelArray[index];
            const btnSprite = this.btnArray[index].getComponent(Sprite);//图片
            //正确的下标
            var textIndex = this.selectOptions[index];
            //文本
            var text = ColorManage.getInstance.allOptionText[textIndex];
            if (text != null) {
                element.string = text;
            }

            if (isDiff) {
                //如果困难模式
                var i = this.selectOptions[2-index]
                this.ShowContentSprite(i, btnSprite);
            }
        }
    }

    //点击按钮
    ClickBtn(index: number) {
        //用户选择项
        var option = this.selectOptions[index];
        //如果相同
        if (option == this.nowOption) {
            this.Score++;
        } else {
            this.HP--;
            if (this._hp <= 0) {
                this.GameOver();
            }
        }
        if (this.nowTime < 30) {
            //现在时间少于30了，加大难度
            this.RefreshView(true);
        } else {
            //更新页面
            this.RefreshView(false);
        }

    }

    /***
     * 倒计时
     */
    TimeDown() {
        //
        this.timeDownLabel.string = "倒计时：" + this.allTime;
        this.schedule(function () {
            this.nowTime--;
            if (this.nowTime >= 0) {
                this.timeDownLabel.string = "倒计时：" + this.nowTime;
            } else {
                this.GameOver();
            }
        }, 1, this.allTime, 0);
    }
    //游戏结束
    GameOver() {
        //显示游戏结束
        this.SetGameState(1);
        this.resultLabel.string = "游戏结束，总得分：" + this._score;
        let json: any = {};
        json.score = this._score;
        Connect.getInstance.Post("color", JSON.stringify(json));
    }

    //返回主页
    ReturnMainView() {
        // UIManage.getInstance.ShowView(ViewEnum.Menu, null, null,true)
    }
    /**
     * 设置游戏状态，根据状态显示页面
     */
    SetGameState(state: number) {
        for (let index = 0; index < this.gameArray.length; index++) {
            var active = false;
            var node: Node = this.gameArray[index];
            if (state == index) {
                active = true;
            }
            node.active = active;
        }
    }
}


