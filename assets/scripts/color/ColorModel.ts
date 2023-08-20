import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorModel')
export class ColorModel {
    private static instance: ColorModel = null;

    public static get getInstance() {
        if (!ColorModel.instance) {
            ColorModel.instance = new ColorModel();
        }
        return ColorModel.instance;
    }

    public data = {};
}


