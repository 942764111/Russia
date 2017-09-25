/**
 * Created by jorbeen on 2017/8/29.
 */
/*
 游戏中常量声明
 */

/**
 * Model 层
 * @type {{}}
 */

/**
 * 游戏管理层
 * @type {{}}
 */
    var GM = GM||{};

    Object.defineProperties(GM,{
        UIMage:{
            value : {},
            writable : false
        },
        RichTextMage:{
            value:{},
            writable : false
        },
        SceneMage:{
            value:{},
            writable : false
        }
    })

/**
 * 游戏显示层
 * @type {{}}
 */
    var GV = GV||{};
    Object.defineProperties(GV,{
        Scene:{
            value : {},
            writable : false
        },
        UI:{
            value : {},
            writable : false
        }
    })

/**
 * GameNode 工具类 级 属性节点
 * @type {{}}
 */
    var GN = GN||{};
    Object.defineProperties(GN,{
        Str:{
            value : {},
            writable : false
        },
        Arr:{
            value : {},
            writable : false
        },
        Num:{
            value : {},
            writable : false
        },
        Obj:{
            value : {},
            writable : false
        },
        Date:{
            value : {},
            writable : false
        }
    })

/**
 * basic config  游戏设置
 * @type {{Debug: number, CUIType: {CC: string, FL: string}}}
 */
    var BC = {
        Debug   :   0,//  1:正式   0:调试
        CUIType :   {CC:'CC',FL:'FL'}, //cocosstudio 模式
    }

Object.freeze(BC)
Object.freeze(BC.CUIType)

