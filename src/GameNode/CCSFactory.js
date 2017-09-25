/**
 * Created by jorbeen on 2017/8/29.
 */
(function(){

    cc.Node.prototype.find = function(v){
        v = v.toString();
        if(v.indexOf('.')!=-1){
            var findArr=v.split('.'),tmpNode=this;
            while(findArr.length>0){
                tmpNode = tmpNode.find(findArr.shift().trim());
                if(tmpNode==null)break;
            }
            return tmpNode;
        }

        var me = this,node;
        if(me.getChildByTag && !isNaN(v)){
            node = me.getChildByTag(parseInt(v));
            if(node!=null){
                return node;
            }
        }

        if(me.getChildByName){
            node = me.getChildByName(v);
            if(node!=null){
                return node;
            }
        }
        if(me.getComponent){
            node = me.getComponent(v);
            if(node!=null){
                node = node.getNode()
                return node;
            }
        }

        GN.Log('致命错误!! find子对象时 '+ v + ' 未找到');
    };

    //点击事件
    cc.Node.prototype.touch = function(Type,fun,caller,noSound){
        var me = this;
        this._touchCaller = caller||this;

        //公共点击处理
        function allTouchCallBack() {
            // if(!noSound)X.audio.playEffect('res/sound/click.mp3');
        }
        function addCCListener() {
            me._touchFunction = function(sender,type){
                //公共点击处理
                if(type==ccui.Widget.TOUCH_ENDED){
                    allTouchCallBack();
                }
                fun.call(me._touchCaller,sender,type);
            };
            me.addTouchEventListener(me._touchFunction,me);
        }

        function addFLListener() {
            me._touchFunction = function(touch, event){
                allTouchCallBack();
                fun.call(this._touchCaller,touch, event);
            };
            flax.inputManager.addListener(me,me._touchFunction,InputType.click,caller);
        }

        switch (Type){
            case BC.CUIType.CC:
                addCCListener();
                break;
            case BC.CUIType.FL:
                addFLListener();
                break;
            default :
                throw new Error('未匹配UI类型');
                break
        }

    };

    //创建UI
    GN.ccsUI = function(_json,id,type){
    var ui = ui||{};
    if(id!=null)
        ui.json = function(v,type){
            var node
            if(type==BC.CUIType.CC){
                ui = new cc.Layer();
                node = ccs.load(v).node;
                ui.addChild(node);
            }else if(type==BC.CUIType.FL){
                ui = flax.assetsManager.createDisplay(v, "BeginScene", {
                    x: cc.winSize.width/2,
                    y: cc.winSize.height/2
                });
            }else{
                throw new Error('type not Find');
            }

        };
    if(_json!=null)ui.json(_json,type);
    return ui;
};

GN.Log = function (log) {
    if(BC.Debug)return;
    console.log(log);
};
/*
 获取当前场景
 */
GN.GetRunScene = function () {
    return new cc.Director._getInstance()._runningScene;
};

    /**
     *  基于flax框架  TileMap
     * @param tileWidth 每一个格子的宽
     * @param tileHeight 每一个格子的高
     * @param rows 行
     * @param cols 列
     * @param pos 坐标 默认 0
     * @returns {*}
     */
GN.initTileMap = function(tileWidth, tileHeight,rows,cols,pos){
    var tileMap = new flax.TileMap();
    tileMap.init(tileWidth, tileHeight);
    tileMap.setMapSize(rows, cols);
    pos = pos? pos : {x:0,y:0};
    tileMap.setPosition(pos.x,pos.y);
    tileMap.showDebugGrid();
    return tileMap;
};

GN.loadUrlImage = function (url, node)
{
    if (url != null && url != undefined && url != "")
    {
        cc.loader.loadImg(url, {isCrossOrigin : true}, function(err,img){
            if(err)
            {
                cc.log(err);
            }
            else
            {
                var texture;
                if (cc.sys.isNative)
                {
                    texture = img;
                }
                else
                {
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    texture = texture2d;
                }
                node.setTexture(texture);
            }
        });
    }
};
})();
