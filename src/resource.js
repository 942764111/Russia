var resGameMove={
    downBtn:"res/Btn/downBtn.png",
    leftBtn:"res/Btn/leftBtn.png",
    rightBtn:"res/Btn/rightBtn.png",
    rotateBtn:"res/Btn/rotateBtn.png",
    GameMoveLayer:"res/img/GameMoveLayer.png",
    tetrisborder:"res/img/tetrisborder.png",
    tetrisLayer:"res/img/tetrisLayer.png",
};

var resGrid = {
    grid : "res/img/grid/grid.png",
    gridLayer : "res/img/grid/gridLayer.png"
};

var res = {
    gamemove_json:"res/GameMove.json",
    loginimg:'res/loginimg.png',
    poppingStars:"res/gamePopStars.plist",
    poppingStars_png:"res/gamePopStars.png"
};

var res_GameBegin = [
];

var res_GameMove = [
];
for(var json in res){
    res_GameMove.push(res[json]);
}

for(var gamemove in resGameMove){
    res_GameMove.push(resGameMove[gamemove]);
}

for(var Grid in resGrid){
    res_GameMove.push(resGrid[Grid]);
}

