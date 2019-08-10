import myglobal from "../../mygolbal.js"

cc.Class({
    extends: cc.Component,

    properties: {
        account_label:cc.Label,
        nickname_label:cc.Label,
        room_touxiang:cc.Sprite,
        globalcount_label:cc.Label,
        headimage:cc.Sprite,
        readyimage:cc.Node,
        offlineimage:cc.Node,
        card_node:cc.Node,
        card_prefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.readyimage.active = false
      this.offlineimage.active = false
     
      //监听开始游戏事件(客户端发给客户端)
      this.node.on("gamestart_event",function(event){
        this.readyimage.active = false
      }.bind(this))

      //给其他玩家发牌事件
      this.node.on("push_card_event",function(event){
        console.log("on push_card_event")
        //自己不再发牌
        if(this.accountid==myglobal.playerData.accountID){
            return
        }
        this.pushCard()
      }.bind(this))


    },

    start () {
        
    },

    //这里初始化房间内位置节点信息(自己和其他玩家)
    //data玩家节点数据
    //index玩家在房间的位置索引
    init_data(data,index){
      console.log("init_data:"+JSON.stringify(data))  
      //data:{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}
      this.accountid = data.accountid
      this.account_label.string = data.accountid
      this.nickname_label.string = data.nick_name
      this.globalcount_label.string = data.goldcount
      this.cardlist_node = []
      this.seat_index = index
      if(data.isready==true){
        this.readyimage.active = true
      }
      //网络图片加载
    //     cc.loader.load({url: data.avatarUrl, type: 'jpg'},  (err, tex)=> {
    //     //cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
    //     let oldWidth = this.headImage.node.width;
    //     //console.log('old withd' + oldWidth);
    //     this.room_touxiang.spriteFrame = new cc.SpriteFrame(tex);
    //     let newWidth = this.headImage.node.width;
    //     //console.log('old withd' + newWidth);
    //     this.headImage.node.scale = oldWidth / newWidth;
    // });
    //这里根据传入的avarter来获取本地图像
    var str = data.avatarUrl
    //console.log(str)
    var head_image_path = "UI/headimage/" + str
    cc.loader.loadRes(head_image_path,cc.SpriteFrame,function(err,spriteFrame) {
        if (err) {
            console.log(err.message || err);
            return;
        }          
         this.headimage.spriteFrame = spriteFrame;        
        }.bind(this));

    //注册一个player_ready消息
    this.node.on("player_ready_notify",function(event){
        console.log("player_ready_notify event",event)
            var detail = event
            console.log("------player_ready_notify detail:"+detail)
            if(detail==this.accountid){
                this.readyimage.active = true
            }
        }.bind(this))

        if(index==1){
          this.card_node.x = -this.card_node.x - 30
        }
    },

    // update (dt) {},
    pushCard(){
        
        this.card_node.active = true 
        for(var i=0;i<17;i++){
            var card = cc.instantiate(this.card_prefab)
            card.scale=0.6
            console.log(" this.card_node.parent.parent"+ this.card_node.parent.parent.name)
            card.parent = this.card_node
            //card.parent = this.node
            var height = card.height
            card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
            card.x = 0
           
            //console.log("call pushCard x:"+card.x+" y:"+card.y)
            this.cardlist_node.push(card)
        }
    },
});
