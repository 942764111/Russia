/**
 * Created by jorbeen on 2017/9/11.
 */
/**
 * Created by QiaoBin on 2017/9/9.
 */
(function(){
    var ID = 'RunGame';

    var fun = GM.UIMage.UIBase.extend({
        GridtileObjs    :   null,
        GridtileObjsChilds    :   [],
        Data    :   {'index':0,'data':['I','S','L']},
        ctor: function(json,id,type){
            this._super(json,id,type);
        },
        show : function(){
            this._super(this.showed);
        },
        showed : function() {
            var me = this;
            me.GameState('State');
        }
        ,GameState : function(State){
            var me = this;
            switch (State){
                case 'State':
                    me.initAttribute();

                    //初始化地图
                    me.initMap();

                    //创建一组格子
                    me.CreateOneGird();

                    //初始化按钮
                    me.initBtns();

                    //开始线程
                    me.runGame();
                    break;
                case 'Replay':
                    function callBack() {

                        me.initAttribute();
                        //创建一组格子
                        me.CreateOneGird();

                        //开始线程
                        me.runGame();
                    }
                    me.ui.scheduleOnce(callBack,2);
                    break;
                case 'Over':
                    break;
            }
        }
        ,initBtns : function () {
            var me = this;

            function leftBtns(TitleObj) {
                if(!me.GridtileObjs)return;
                me.GirdRunState('left');
            }

            function rightBtns() {
                if(!me.GridtileObjs)return;
                me.GirdRunState('right')
            }
            var index = 0;
            function rotate() {
                if(!me.GridtileObjs)return;
                if(index==0){
                    index = 1;
                    me.GridtileObjs.setRotation(90);
                }else{
                    index=0;
                    me.GridtileObjs.setRotation(0);
                }
                me.updateGridChildsTileIndex(function () {
                    rotate();
                },true);
            }
            function downBtn() {
                me.GirdRunState('down')
            }
            me.ui.find('layer.Btns.rotateBtn').touch(BC.CUIType.CC,function (sender,type) {
                if (type == ccui.Widget.TOUCH_ENDED){
                    rotate();
                }
            },this);

            me.ui.find('layer.Btns.leftBtn').touch(BC.CUIType.CC,function (sender,type) {
                if (type == ccui.Widget.TOUCH_ENDED){
                    leftBtns();
                }
            },this);

            me.ui.find('layer.Btns.rightBtn').touch(BC.CUIType.CC,function (sender,type) {
                if (type == ccui.Widget.TOUCH_ENDED){
                    rightBtns();
                }
            },this);

            me.ui.find('layer.Btns.downBtn').touch(BC.CUIType.CC,function (sender,type) {
                if (type == ccui.Widget.TOUCH_ENDED){
                    downBtn();
                }
            },this);

        }
        ,initAttribute : function () {
            var me = this;
            me.GridtileObjs = null;

            for(var i=0;i<me.GridtileObjsChilds.length;i){
                me.GridtileObjsChilds[i].isCollision = false;
                me.GridtileObjsChilds.splice(i,1);
            }
            me.GridtileObjsChilds = [];
        }
        ,initMap : function(){
            var me = this;
            /*
             Grid背景
             */
            function DrawGridLayerMap(){
                me.GridLayertileMap = GN.initTileMap(
                    GC.MAP_CONFIG.TILE_SIZE,
                    GC.MAP_CONFIG.TILE_SIZE,
                    GC.MAP_CONFIG.ROWS,
                    GC.MAP_CONFIG.COLS,
                    {x:me.ui.find('layer.tetrisLayer').x/2-85,
                        y:me.ui.find('layer.tetrisLayer').y/2-80}
                );
                for(var i = 0; i < GC.MAP_CONFIG.ROWS; i++)
                {
                    for(var j = 0; j < GC.MAP_CONFIG.COLS; j++)
                    {
                        var star = flax.assetsManager.createDisplay(res.poppingStars, "gridLayer", {parent: me.ui}, true);
                        me.GridLayertileMap.snapToTile(star, i, j, true);
                    }
                }
            }
            /*
             初始化Grid
             */
            function initGridMap(){
                me.GridtileMap = GN.initTileMap(
                    GC.MAP_CONFIG.TILE_SIZE,
                    GC.MAP_CONFIG.TILE_SIZE,
                    GC.MAP_CONFIG.ROWS,
                    GC.MAP_CONFIG.COLS,
                    {x:me.ui.find('layer.tetrisLayer').x/2-85,
                        y:me.ui.find('layer.tetrisLayer').y/2-80}
                );
                me.GridtileMap.setAnchorPoint(0,0);
            }
            DrawGridLayerMap();
            initGridMap();

        }
        /**
         * 创建一个形状
         * @constructor
         */
        ,CreateOneGird : function () {
            var me = this;

            function GetOneGrid() {
                var gridObj = me.Data['data'][me.Data.index];
                if(!gridObj){
                    me.Data.index = 0;
                    gridObj = me.Data['data'][me.Data.index]; 
                }
                me.Data.index+=1;
                return gridObj;
            }


            var CreateGrid = flax.assetsManager.createDisplay(res.poppingStars, 'L', {parent: me.ui}, true);
            me.GridtileMap.snapToTile(CreateGrid,5,18);

            for(var i=1;i<=4;i++){
                //坐标转换
                var pos = me.GridtileMap.getTileIndex(CreateGrid['index'+i].parent.convertToWorldSpace(CreateGrid['index'+i]));
                me.GridtileMap.snapToTile(CreateGrid['index'+i],pos.x,pos.y,true);
                CreateGrid['index'+i].isCollision = true;
                me.GridtileObjsChilds.push(CreateGrid['index'+i]);
            }
            me.GridtileObjs = CreateGrid;
        }
        ,runGame : function () {
            var me = this;
            //游戏时间
            function GameTime() {

            }
            
            //move
            function Move() {
                if(me.GirdRunState('down')){
                    me.ui.unschedule(Move);
                    me.eliminate();
                    me.GameState('Replay');
                }
            }
            this.ui.schedule(Move,0.5);
        }
        ,GirdRunState : function (direction) {
            var me = this;
            function directionMethod(state) {
                var GridChilds;
                GridChilds = me.GridtileObjsChilds;
                var isborder = function () {
                    var is = false;
                    for(var i=0;i<GridChilds.length;i++){
                        var GridChildspos = me.GridtileMap.getTileIndex(GridChilds[i].parent.convertToWorldSpace(GridChilds[i]));
                        if(state=='left'){
                            is = GridChildspos.x<1?true:false;
                            if(!me.GridtileMap.isEmptyTile(GridChildspos.x-1,GridChildspos.y) &&
                                me.GridtileMap.getObjects(GridChildspos.x-1,GridChildspos.y).length>0&&
                                !me.GridtileMap.getObjects(GridChildspos.x-1,GridChildspos.y)[0].isCollision){
                                is = true;
                            }
                        } if(state=='right'){
                            is = GridChildspos.x>9?true:false;
                            if(!me.GridtileMap.isEmptyTile(GridChildspos.x+1,GridChildspos.y) &&
                                me.GridtileMap.getObjects(GridChildspos.x+1,GridChildspos.y).length>0&&
                                !me.GridtileMap.getObjects(GridChildspos.x+1,GridChildspos.y)[0].isCollision){
                                is = true;
                            }
                        } if(state=='down'){
                            is = GridChildspos.y<1?true:false;
                            if(!me.GridtileMap.isEmptyTile(GridChildspos.x,GridChildspos.y-1) &&
                                me.GridtileMap.getObjects(GridChildspos.x,GridChildspos.y-1).length>0&&
                                !me.GridtileMap.getObjects(GridChildspos.x,GridChildspos.y-1)[0].isCollision){
                                is = true;
                            }
                        }

                        if(is){
                            break;
                        }
                    }
                    return is;
                }();
                if(!isborder){
                    //updateTile

                    var setpos = me.GridtileMap.getTileIndex(me.GridtileObjs);
                    if(state=='left'){
                        setpos.x-=1;
                    } if(state=='right'){
                        setpos.x+=1;
                    } if(state=='down'){
                        setpos.y-=1;
                    }

                    me.GridtileMap.snapToTile(me.GridtileObjs,setpos.x,setpos.y);

                    me.updateGridChildsTileIndex();
                }
                return isborder;
            }
            return directionMethod(direction);
        }
        /**
         * 更新格子位置
         * @param obj
         */
        ,updateGridChildsTileIndex : function (CallBack) {
            var me = this,pos,isEmpty;
            var GridChilds = me.GridtileObjsChilds;
            for(var i=0;i<GridChilds.length;i++){
                pos = me.GridtileMap.getTileIndex(GridChilds[i].parent.convertToWorldSpace(GridChilds[i]));

                //判断旋转时周围是否有障碍
                isEmpty = (CallBack?!me.GridtileMap.isEmptyTile(pos.x,pos.y):false)&&
                    me.GridtileMap.getObjects(pos.x,pos.y)[0]&&
                    !me.GridtileMap.getObjects(pos.x,pos.y)[0].isCollision;

                if(pos.x>10||pos.x<0||pos.y<0||isEmpty) {
                    CallBack&&CallBack();
                    break;
                }
                me.GridtileMap.snapToTile(GridChilds[i],pos.x,pos.y,true);
            }
        }
        ,eliminate : function () {
            var me = this,ColPosArr = [],ColObjets;
            function iseliminate() {
                var pos,Colpos;
                var GridChilds = me.GridtileObjsChilds;
                for(var i=0;i<GridChilds.length;i++){
                    pos = me.GridtileMap.getTileIndex(GridChilds[i].parent.convertToWorldSpace(GridChilds[i]));
                    Colpos = me.GridtileMap.getCol(pos.y);
                    var is = false;
                    for(var j = 0;j<Colpos.length;j++){


                        if(!me.GridtileMap.isEmptyTile(Colpos[j].x,Colpos[j].y)){
                            is = true;
                        }else{
                            is = false;
                            break;
                        }
                    }
                    if(is){
                        ColPosArr.push(Colpos);
                    }
                }
            }

            function eliminate(){
                for(var i=0;i<ColPosArr.length;i++){
                     function remove() {
                         for(var j=0;j<ColPosArr[i].length;j++){
                             ColObjets = me.GridtileMap.getObjects(ColPosArr[i][j].x,ColPosArr[i][j].y);
                             for(var obj =0;obj<ColObjets.length;obj++){
                                 ColObjets[obj].removeFromParent();
                             }
                         }
                     }
                     function Fill() {
                         var allobjs = me.GridtileMap.getAllObjects(),pos,getCOLS;
                         for(var i=allobjs.length-1;i>=0;i--){
                             pos = me.GridtileMap.getTileIndex(allobjs[i].parent.convertToWorldSpace(allobjs[i]));
                             if(pos.y-1>=0){
                              allobjs[i].moveBy(0.1,cc.p(0,-41)).run();
                             }
                         }
                     }
                    remove();
                    Fill();
                }
            }
            iseliminate();
            eliminate();
        }
        ,DeBugLog : function () {
            var me =this,pos;
            var GridChilds = me.GridtileObjsChilds;
            for(var i=0;i<GridChilds.length;i++){
                pos = me.GridtileMap.getTileIndex(GridChilds[i].parent.convertToWorldSpace(GridChilds[i]));
                cc.log(pos);
            }
            cc.log("=============================");
        }
        ,close: function(){

        }
    });

    GM.UIMage.BindUIByID(ID,new fun(res.gamemove_json,ID,BC.CUIType.CC));
})();
