import { EventType } from "./EventType";

export class EventManage {
    private static _allEvent = {};

    /**
     * 添加事件
     * @param key 事件类型
     * @param fun 函数
     * @param self 作用域
     */
    public static addEventListener(key: EventType, fun: Function, self) {
        if (!this._allEvent[key]) {
            this._allEvent[key] = [];
        }
        let length = this._allEvent[key].length;
        //添加函数
        this._allEvent[key][length] = { "fun": fun, "self": self };
    }

    //移除事件
    public static removeEventListener(key: EventType, fun) {
        if (this._allEvent[key]) {
            let i = 0;
            while (this._allEvent[key][i]) {
                if (this._allEvent[key][i].fun == fun) {
                    if (i > -1) {
                        this._allEvent[key].splice(i, 1)
                    }
                    break;
                } else {
                    i++;
                }
            }
        }
    }

    //执行事件
    public static exit(key: EventType, params) {
        if (this._allEvent[key]) {
            this._allEvent[key].forEach(element => {
                let e = element.fun as Function;
                e.call(element.self, params);
            });
        }
    }
}