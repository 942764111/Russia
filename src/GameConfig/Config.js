/**
 * Created by jorbeen on 2017/8/29.
 */
var GC = GC||{};

GC.MAP_CONFIG={
     COLS : 22,//列
     ROWS : 11,//行
     TILE_SIZE : 41// tile_Grid size
};
/*
    形状配置表
 */
GC.GRID_CONFIG={
    'S':{'flaxresID':'S'},
    'I':{'flaxresID':'I'},
    'T':{'flaxresID':'T'},
    'L':{'flaxresID':'L'}
};
Object.freeze(GC);