cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, disabled by default to improve performance
    var sys = cc.sys;
    cc.view.enableRetina(true);
    //if(sys.os === sys.OS_IOS ||sys.os==sys.OS_ANDROID){
    //
    //   // flax.init(cc.ResolutionPolicy.SHOW_ALL);
    //}else{
    //    flax.init(cc.ResolutionPolicy.FIXED_HEIGHT);
    //}

    flax.init(cc.ResolutionPolicy.FIXED_HEIGHT);

  //  cc.view.resizeWithBrowserSize(true);

    flax.registerScene("GameBegin", GameBeginScene, res_GameBegin);
    flax.registerScene("GameMove", GameMoveScene, res_GameMove);

    $.ajax({
        type: 'GET',
        url: 'http://192.168.188.98:8080/elsfk/index/getTransfer',
        dataType: "jsonp",
        async:'false',
        data: {
            uid:uid,
            hid:hid,
        },
        success: function (returndata) {
            if(returndata.code == 200){
                var tempdata = returndata.data;

            }else{
            }
        },
        error: function (err) {
        }
    });

    flax.replaceScene("GameMove");
};
cc.game.run();

