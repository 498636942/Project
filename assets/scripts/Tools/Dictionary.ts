/**
 * 自定义字典类
 */
 export class Dictionary<K, V>
{
    keys: K[] = [];
    values: V[] = [];
 
    /**
     * 获取所有值
     */
    public getList() {
        let self = this;
        return self.values;
    }
    /**
     * 根据键得到值
     */
    public getValue(key: K): V {
        let self = this;
        let index = self.keys.indexOf(key);
        if (index != -1)
            return self.values[index];
        return null!;
    }
 
    /**根据值得到键 */
    public getKey(value: V): K {
        let self = this;
        let index = self.values.indexOf(value);
        if (index != -1)
            return self.keys[index];
        return null!;
    }
 
    /**改变值 */
    public changeValue(key: K, changeValue: V): void {
        let self = this;
        let index = self.keys.indexOf(key);
        if (index != -1)
            self.values[index] = changeValue;
    }
    /**改变键 */
    public changeKey(key: K, changeKey: K): void {
        let self = this;
        let index = self.keys.indexOf(key);
        if (index != -1)
            self.keys[index] = changeKey;
    }
    /** 根据键刷新值 */
    public updateValue(key: K, value: V) {
        let self = this;
        let index = self.keys.indexOf(key);
        if (index != -1)
            self.values[index] = value;
        else 
            self.add(key, value);
    }
 
    /**
     * 添加键值
     */
    public add(key: K, value: V, name?: string): void {
        let self = this;
        if (self.keys.indexOf(key) != -1) {
            // console.log("same key in dic", name);
            return;
        }
        self.keys.push(key);
        self.values.push(value);
    }
 
    /** 
     * 根据键添加值
     * type: 0:values是数组往里面添加值
     *       1:values是number,用来统计数量的
     */
    public addValue(key: K, value: any, type: number = 0) {
        let self = this;
        let index = self.keys.indexOf(key);
        if (index < 0) {
            self.keys.push(key);
            self.addValue(key, value, type);
        } else {
            let values = self.getValue(key) as any;
            if(type == 0) {
                if(values) {
                    values.push(value);
                } else {
                    values = [value];
                }
            } else {
                if(values) {
                    values += value;
                } else {
                    values = 1;
                }
            }
            self.changeValue(key, values);
        }
    }
 
    /**
     * 清空
     */
    public clear(): void {
        let self = this;
        self.keys.length = 0;
        self.values.length = 0;
    }
 
    /**
     * 根据键移除对象
     */
    public removeKey(key: K): void {
        let self = this;
        let index = self.keys.indexOf(key);
        if (index < 0) return;
        self.keys.splice(index, 1);
        self.values.splice(index, 1);
    }
 
    /**
     * 根据值移除对象
     */
    public removeValue(value: V): void {
        let self = this;
        let index = self.values.indexOf(value);
        self.keys.splice(index, 1);
        self.values.splice(index, 1);
    }
 
    /**
     * 根据键检测是否存在对象
     */
    public containsKey(key: K) {
        if (this.keys.indexOf(key, 0) == -1) {
            return false;
        }
        return true;
    }
 
    /**
     * 根据值检测是否存在对象
     */
    public containsValue(value: V) {
        if (this.values.indexOf(value, 0) == -1) {
            return false;
        }
        return true;
    }
 
    /**突出最后一个对象 */
    public pop(): void {
        let self = this;
        self.keys.pop();
        self.values.pop();
    }
 
    /**根据索引交换位置 */
    public swap(num1: number, num2: number): void {
        let self = this;
        if (self.keys.length <= num1 ||
            self.keys.length <= num2)
            return;
        //交换
        let tmpK = self.keys[num1];
        self.keys[num1] = self.keys[num2];
        self.keys[num2] = tmpK;
        let tmpV = self.values[num1];
        self.values[num1] = self.values[num2];
        self.values[num2] = tmpV;
    }
    /** 交换两个索引对应的值*/
    public cutValue(num1: K, num2: K): void {
        let self = this;
        if (self.keys.indexOf(num1) < -1 ||
            self.keys.indexOf(num1) < -2)
            return;
        let tmpV = self.getValue(num1);
        self.changeValue(num1, self.getValue(num2));
        self.changeValue(num2, tmpV);
    }
    // public cutValue(num1:number, num2:number):void {
    //     let self = this;
    //     if( self.keys.length <= num1 ||
    //         self.keys.length <= num2  )
    //         return;
    //     let tmpV = self.values[num1];
    //     self.values[num1] = self.values[num2];
    //     self.values[num2] = tmpV;
    // }
 
    /**长度 */
    public get size(): number {
        return this.keys.length;
    }
}