/**
 * Created by jorbeen on 2017/8/29.
 */
(function(){
    var ID = 'YXSM';

    var fun = GM.UIMage.UIBase.extend({
        ctor: function(json,id,type){
            this._super(json,id,type);
        },
        show : function(){
            this._super(this.showed);
        },
        showed : function() {
            var me = this;
            me.ui.find('Panel.remove_btn').touch(BC.CUIType.CC,function (sender,type) {
                if (type == ccui.Widget.TOUCH_ENDED){

                }
            },this);
        }
        ,close: function(){

        }
    });

    GM.UIMage.BindUIByID(ID,new fun(res.yxsm,ID,BC.CUIType.CC));
})();
