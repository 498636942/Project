import { assetManager, ImageAsset, SpriteFrame } from 'cc';

export class Utils {
    private static instance: Utils = null;
 
    public static getInstance() {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }
    public a = 4;

    // 根据图片链接，获取图片
    public urlToSpriteFrame(url: string, callback: (spriteFrame: SpriteFrame) => void): void {
        assetManager.loadRemote<ImageAsset>(url, (err, texture) => {
            if (!err) {
                callback(SpriteFrame.createWithImage(texture));
            }
        });
    }

    // 将秒数显示为'xx:xx:xx'的形式
    public formatTime(totalSeconds: number): string {
        let hours: number = this.rounding((totalSeconds / 3600));
        let hh: string = (hours < 10 ? "0" + hours : hours).toString();
        let minutes: number = this.rounding((totalSeconds - hours * 3600) / 60);
        let mm: string = minutes < 10 ? "0" + minutes : minutes.toString();
        let seconds: number = this.rounding(totalSeconds - hours * 3600 - minutes * 60);
        let ss: string = seconds < 10 ? "0" + seconds : seconds.toString();
        let num: string = hh + ":" + mm + ":" + ss;
        return num;
    }
    private rounding(num: number): number {
        return Math.floor(num);
    }

    // 整数转汉字
    public intToCN(num: number): string {
        let words = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        let adds = ["", '十', '百', '千', '万', '十', '百', '千', '亿'];
        if (words[num]) {
            return words[num];
        }
        else if (num > 10 && num < 20) {
            let numStr = num.toString();
            let n: number = Number(numStr.substring(1, 2));
            let result = adds[1] + words[n];
            return result;
        }
        else if (num > 10) {
            let result = "";
            let numStr = num.toString();
            for (var i = 0; i < numStr.length; ++i) {
                let n: number = Number(numStr.substring(i, i + 1));
                let m = numStr.length - i - 1;
                result += words[n] + adds[m];
            }
            return result;
        }
        else return "零";
    }

    /**
     * 判断下标是否越界
     * @param index 下标
     * @param list 数组
     * @returns 
     */
    public isValid(index: number, list) {
        if (index < 0 || index >= list.length) {
            return false;
        }
        return true;
    }
}

