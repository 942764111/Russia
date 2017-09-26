
var GameBeginScene = GM.SceneMage.SceneBase.extend({
        onEnter: function () {
            this._super();
            GV.UI['YXSM2'].show();

        },
        onExit:function() {
        }
})