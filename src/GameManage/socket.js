(function(){
     var Socket = cc.Class.extend({
         socket:null,
         isInit:false,
         MessageQueue:{},//消息队列
         Key:"",
         ctor: function(){
             this.initNetwork();
         },
         initNetwork : function () {
             var self = this;
             GN.Log('Network initSocket...');
             this.host = "ws://192.168.188.34:8080/TetrisServer/websocket";
             this.socket = new ReconnectingWebSocket(this.host);

             this.socket.onopen = function(evt) {
                 GN.Log('Network onopen...');
                 self.isInit = true;
             };

             this.socket.onerror = function(evt){
                 GN.Log('Network onerror...');
                 this.isInit = false;
             };

             this.socket.onclose = function(evt){
                 GN.Log('Network onclose...');
                 this.isInit = false;
             };
         },
         /**
          *
          * @param code   端点
          * @param data   向后台发送的数据
          * @param callback  发送后回调
          * @param Look
          */
         send : function(code,data,callback,Look) {
             var self = this;
             if(self.isInit) {
                 var obj = {};
                 obj.key = code;
                 obj.data = data;
                 var _data = GN.Obj.fmtData(obj);

                 self.Key = code;
                 self.MessageQueue[obj.key] = null;
                 GN.Log('SOCKET发送数据:' + _data);
                 this.socket.send(_data);

                 this.socket.onmessage = function(evt){
                     var data  = GN.Obj.toJSON(evt.data);
                     callback && callback(data);
                 };

             }else{
                    GN.Log('not socket');
             }
             // if(lock)G.frame.loading.show();
         }
     })

     GM.Socket = new Socket();
 })();
