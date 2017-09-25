/**
 * Created by jorbeen on 2017/8/30.
 */
(function(){
    var ID = 'YXSM2';

    var fun = GM.UIMage.UIBase.extend({
        ctor: function(json,id,type){
            this._super(json,id,type);
        },
        show : function(){
            this._super(this.showed);
        },
        showed : function() {
            var me = this;
            me.ui['btn_bean'].touch(BC.CUIType.FL,function (touch,event) {
                GM.Socket.send('getdata',{'id':1},function (data) {
                    GN.Log(data);
                });
            },me);
        }
        ,close: function(){

        }
    });

    GM.UIMage.BindUIByID(ID,new fun(res.GameBegin,ID,BC.CUIType.FL));
})();
