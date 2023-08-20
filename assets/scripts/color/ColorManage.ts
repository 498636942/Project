import { _decorator, Component, Node, Color, random } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorManage')
export class ColorManage {
    private static instance: ColorManage = null;

    public static get getInstance() {
        if (!ColorManage.instance) {
            ColorManage.instance = new ColorManage();
        }
        return ColorManage.instance;
    }
    //七种颜色
    public allOptions = [Color.RED, Color.YELLOW, Color.BLACK, Color.BLUE, Color.CYAN, Color.GRAY, Color.GREEN, Color.MAGENTA];
    //对应文本
    public allOptionText = ["红色", "黄色", "黑色", "蓝色", "青色", "灰色", "绿色", "紫色"];
    //一共选择三种按钮
    private num = 3;
    //随机一种颜色
    public RandomColorIndex() {
        var random = Math.floor(Math.random() * (this.allOptions.length - 0.01));
        return random;
    }
    //根据index，得到相对应颜色
    public GetColorByIndex(index: number): Color {
        return this.allOptions[index];
    }

    //得到可选的三个选项
    public GetOptions(index: number) {
        var array = [];
        for (let i = 0; i < this.allOptions.length; i++) {
            if (index != i) {
                array.push(i);
            }
        }
        //可选
        var options = [];
        //得到正确颜色应该在的选项中。
        var randomTarget = Math.floor(Math.random() * (this.num - 0.01));
        //再取两个值
        for (let i = 0; i < this.num; i++) {
            if (i == randomTarget) {
                //随机将正确选项插入三个中
                options.push(index);
            } else {
                //从array长度中取一个下标
                var random = Math.floor(Math.random() * (array.length - 0.01));
                var target = array[random];
                //从没有index的数组中取出两个数
                options.push(target);
                //移除已经取出来的元素
                const indexToRemove = array.indexOf(target);
                if (indexToRemove !== -1) {
                    // 使用 splice() 方法来移除元素
                    array.splice(indexToRemove, 1);
                }
            }
        }
        return options;
    }
}


