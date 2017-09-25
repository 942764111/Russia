/**
 * Created by jorbeen on 2017/8/29.
 */

/*
    游戏中提示文字接口:
    
    GV.UI.tip_NB.show('test');
 */
(function(){
    var tip_NB = cc.Class.extend({
        ctor: function(){
            this._layer = new cc.Layer();
            this._listView = new ccui.ListView();
            this._listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            this._listView.setTouchEnabled(false);
            this._listView.setBounceEnabled(false);
            //this._listView.setInertiaScrollEnabled(true);
            this._listView.setSize(cc.size(cc.winSize.width, cc.winSize.height/2-400));
            this._listView.setInnerContainerSize(cc.size(cc.winSize.width, cc.winSize.height/2-400));
            this._listView.setClippingEnabled(false);
            this._listView.setAnchorPoint(cc.p(0,0));
            this._listView.setPosition(cc.p(0,cc.winSize.height/2));
            //this._listView.setScaleY(-1);
            this._listView.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
//            this._listView.setBackGroundImageScale9Enabled(true);
//            this._listView.setBackGroundImage("GUI/green_edit.png");

            /* this._listView.setBackGroundColorType(ccs.LayoutBackGroundColorType.solid);
             this._listView.setBackGroundColor(cc.BLACK);
             this._listView.setBackGroundColorOpacity(100);*/

            this._layer.addChild(this._listView);
            GN.GetRunScene().addChild(this._layer);
            this._layer.setLocalZOrder(9999999);
        }
        ,show: function(){
            var me = this;
            this._sel = function(){

                if (me._tips.length > 0) {
                    var d = me._tips.shift();

                    var item = d.split('|');
                    var color = '#ffffff';
                    var content = '';
                    if(item.length==1){
                        content = item[0];
                    }else{
                        color = item[0];
                        item.shift();
                        content = item.join('|');
                    }
                    var label = new cc.LabelTTF(content, '微软雅黑', 30)
                    label.setFontFillColor(cc.color(color));
                    label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                    label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                    label.setPosition(cc.winSize.width/2,25);
                    label.setScaleX(10);
                    label.setScaleY(1.5);
                    label.setOpacity(0);

                    //阴影
                    var label2 = new cc.LabelTTF(content, '微软雅黑', 30);
                    label2.setFontFillColor(cc.color(color));
                    label2.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                    label2.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                    label2.setPosition(cc.winSize/2+2,27);
                    label2.setScaleX(10);
                    label2.setScaleY(1.5);
                    label2.setOpacity(0);

                    var layout = new ccui.Layout();
                    layout.setSize(cc.size(cc.winSize.width,40));

                    layout.addChild(label,2);
                    layout.addChild(label2,1);

                    label.fadeIn(0.1).scaleTo(0.2,1,1).delay(3).fadeOut(0.3).then(function(){
                        var lens = me._listView.getChildren().length;
                        if(lens>5){
                            me._listView.removeItem(0);
                        }else{
                            me._willdel = (me._willdel || 0) + 1;
                            if(me._willdel>=lens){
                                me._willdel = 0;
                                me._listView.removeAllItems();
                            }
                        }
                    }).run();
                    label2.fadeIn(0.1).scaleTo(0.2,1,1).delay(3).fadeOut(0.3).run();

                    me._listView.pushBackCustomItem(layout);
                    me._listView.scrollToBottom(0.1,true);
                }
            };

            me._layer.scheduleOnce(function () {
                me._sel();
            },1);
        }
        ,createItem: function(d){
            if (!d) return;
            d = [].concat(d);
            this._tips = this._tips || [];

            for (var i = 0; i < d.length; i++){
                this._tips.push(d[i]);
            }
        }
        ,remove: function(){
            this._layer.removeFromParent();
        }
    });
    GV.UI.tip_NB = {
        show: function(d){
            if (!GV.UI.tip_NB._instance){
                GV.UI.tip_NB._instance = new tip_NB();
            }
            if (GV.UI.tip_NB._instance){
                GV.UI.tip_NB._instance.createItem(d);
                GV.UI.tip_NB._instance.show();
            }
        }
    };
})();