
var GameBeginScene = GM.SceneMage.SceneBase.extend({
        onEnter: function () {
            this._super();

            GM.Socket.send('test1',{'id':1},function (data) {
                GN.Log(data);
            });
            GV.UI['YXSM2'].show();

        },
        onExit:function() {
        }
})