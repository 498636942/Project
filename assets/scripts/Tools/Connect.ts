/**
 * 连接类
 */
export class Connect {
    private static instance: Connect = null;
 
    public static get getInstance() {        
        if (!Connect.instance) {
            Connect.instance = new Connect();
        }
        return Connect.instance;
    }

    public url = "";
    //用户id
    public openid = "oFS4S5vybPe2o-tJlhCnZfGc0QbU";

    Init(){
        // 假设URL为 http://example.com/?param1=value1&param2=value2
        // 获取完整的URL
        this.url = window.location.href;

        // 使用URLSearchParams解析查询参数
        const params = new URLSearchParams(new URL(this.url).search);

        // 获取指定参数的值
        let openid = params.get('openid'); // "value1"
        if(openid != null){
            this.openid = openid;
        }
        // let GameId = params.get('GameId'); // "value2"
        // if(GameId != null){
        //     this.GameId = GameId;
        // }

        // console.log(this.UserId, this.GameId); // 输出: "value1" "value2"
    }

    //http
    private xhr = new XMLHttpRequest();

    Post(GameId:string,GameScoreInfo:any){
        let url = "https://match.yarace.com:82/api/public/SaveGameData"; // 替换为你的请求URL
        this.xhr.open("POST", url, true);
        this.xhr.setRequestHeader("Content-Type", "application/json"); // 假设请求内容是JSON格式，可根据实际情况修改
        let xhr = this.xhr;
        this.xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // 请求成功，可以在这里处理响应数据
                    let response = JSON.parse(xhr.responseText);
                    // 处理响应数据的逻辑...
                } else {
                    // 请求失败，可以在这里进行错误处理
                    console.error("请求失败，状态码：" + xhr.status);
                }
            }
        };
        var GameScoreInfoStr = JSON.stringify(GameScoreInfo);
        let requestData = {
            // 构造请求的数据
            UserId: this.openid,
            GameId: GameId,
            GameScoreInfo:GameScoreInfoStr,//所有数据
        };
        xhr.send(JSON.stringify(requestData)); // 将请求数据转换为字符串并发送
    }


}