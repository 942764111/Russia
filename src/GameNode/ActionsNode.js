/**
 * Created by jorbeen on 2017/8/29.
 */

/*
 sprite.moveTo(0.5, cc.p(100, 200), cc.EaseIn, 2).rotateBy(0.5, 90).reverse().repeat().act();
 //链式中的动画被依次调用， act() 方法来执行
 sprite.moveBy(0.5, cc.p(100, 100)).reverse().spawn();
 sprite.tintBy(0.5, 100, 100, 100).reverse().act();
 //moveby 和 tintBy 动画同时进行，spwan()可以在描述一段连续动画，重新开始描述一段同时播放的动画
 sprite.animate(1.5, 'bird1.png', 'bird2.png', 'bird3.png').act();
 //animate可以播放桢动画
 sprite.animate(1.5, 'bird%d.png').act();
 //可以用%d来定义连续播放的桢动画，会分别播放 bird0.png、bird1.png... 直到找不到下一帧
 sprite.moveBy(0.5, cc.p(100,100)).then(function(){
 cc.log('moved');
 });
 //then可以用来在一段动画完成后执行某个动作
 var birdFlying = cc.AnimationFragement.create().animate(0.5, 'bird%d.png', 1, 3);

 bird.play(birdFlying).repeat().act();

 //cc.AnimationFragement 对象可以保存一段动画，sprite.play 可以播放保存的动画
 var flapping = false;
 var birdFlapping = cc.AnimationFragement.create()
 .moveBy(0.5, cc.p(0, 30), cc.EaseOut, 2)
 .reverse()
 .spawn()
 .rotateBy(0.5, -30)
 .reverse();

 //Action必须要retain，不然的话异步得不到
 this.retainTarget(birdFlapping.getAction());

 var self = this;

 this.delegate(this,'click',function(){
 if(!flapping){
 flapping = true;
 bird.play(birdFlapping).then(function(){
 flapping = false;
 }).act();
 }
 });
 */


(function(global){

    //将src对象上的属性copy到des对象上，默认不覆盖des对象原有属性，mixer为function可以选择属性的覆盖方式
    GN.mixin = function(des, src, mixer) {
        mixer = mixer || function(d, s){
                if(typeof d === 'undefined'){
                    return s;
                }
            }

        if(mixer == true){
            mixer = function(d, s){return s};
        }

        for (var i in src) {
            var v = mixer(des[i], src[i], i, des, src);
            if(typeof v !== 'undefined'){
                des[i] = v;
            }
        }

        return des;
    };

    function Animation(){

    }
    var getAnimFrames = function(name, startIndex, endIndex) {
        var frames = [],
            i = 0,
            startIndex = startIndex || 0;
        var reversed = false, cached = false;

        if(endIndex == null){
            //没有限定范围只能从cache中取
            endIndex = 99999;
            cached = true;
        }

        if(startIndex > endIndex){
            var tmp = endIndex;
            endIndex = startIndex;
            startIndex = tmp;
            reversed = true;
        }
        var length = (endIndex - startIndex) + 1;

        do {
            var frameName = name.replace('%d', startIndex + i),
                frame = cc.getSpriteFrame(frameName, cached);

            if(frame) {
                frames.push(frame);
            }else {
                break;
            }

        } while (++i < length);

        if(reversed){
            frames.reverse();
        }

        return frames;
    };

    GN.mixin(Animation.prototype, {
        getActionList: function(){
            this.__actions = this.__actions || [];
            return this.__actions;
        },
        getAction: function(){
            this.__spawn = this.__spawn || [];
            if(this.getActionList().length > 0){
                this.spawn();
            }
            if(this.__spawn.length > 1){
                return cc.Spawn.create.apply(cc.Spawn, this.__spawn);
            }else if(this.__spawn.length == 1){
                return this.__spawn[0];
            }
        },
        addAction: function(actionCls, args, easing, rate){
            var actions;

            if(actionCls instanceof Animation){
                actionCls = actionCls.getAction().clone();
            }

            if(actionCls instanceof cc.Action){
                rate = easing;
                easing = args;
                actions = [actionCls];
            }else{
                for(var i = args.length - 1; i >= 0; i--){
                    if(args[i] !== undefined){
                        break;
                    }
                }
                args.length = i + 1;
                actions = [actionCls.create.apply(actionCls, args)];
            }
            if(easing){
                //rate = rate || 2;
                var easingArgs = [].slice.call(arguments, 3);
                for(var i = easingArgs.length - 1; i >= 0; i--){
                    if(easingArgs[i] !== undefined){
                        //easingArgs.length = i + 1;
                        break;
                    }
                }
                easingArgs.length = i + 1;
                //cc.log(i, easingArgs);
                actions[0] = easing.create.apply(easing, [actions[0]].concat(easingArgs));
            }
            var actionSeq = this.getActionList();
            actionSeq.push.apply(actionSeq, actions);
            return this;
        },
        delay: function(time){
            return this.addAction(cc.DelayTime, [time]);
        },
        /**
         *  times - repeat time
         *  fromWhere - default 0, repeat all sequences before
         */
        repeat: function(times, fromWhere){
            times = times || 9999999;
            fromWhere = fromWhere || 0;
            var actionSeq = this.getActionList();
            if(actionSeq.length > 0){
                var action = cc.Sequence.create.apply(cc.Sequence, actionSeq.slice(-fromWhere));
                action = cc.Repeat.create(action, times);
                if(fromWhere == 0) actionSeq.length = 0;
                else actionSeq.length = actionSeq.length - fromWhere;
                actionSeq.push(action);
            }
            return this;
        },
        reverse: function(){
            var actionSeq = this.getActionList();
            if(actionSeq.length > 0){
                var action = actionSeq[actionSeq.length - 1];
                actionSeq.push(action.reverse());
            }
            return this;
        },
        reverseAll: function(){
            var actionSeq = this.getActionList();
            if(actionSeq.length > 0){
                var action = cc.Sequence.create.apply(cc.Sequence, actionSeq);
                actionSeq.push(action.reverse());
            }
            return this;
        },
        then: function(callFun){
            var callback = cc.CallFunc.create(callFun, this);
            this.getActionList().push(callback);
            return this;
        },
        bezierBy: function(dur, conf, easing, rate){
            return this.addAction(cc.BezierBy, [dur, conf], easing, rate);
        },
        bezierTo: function(dur, conf, easing, rate){
            return this.addAction(cc.BezierTo, [dur, conf], easing, rate);
        },
        blink: function(dur, blinks, easing, rate){
            return this.addAction(cc.Blink, [dur, blinks], easing, rate);
        },
        fadeIn: function(dur, easing, rate){
            return this.addAction(cc.FadeIn, [dur], easing, rate);
        },
        fadeOut: function(dur, easing, rate){
            return this.addAction(cc.FadeOut, [dur], easing, rate);
        },
        fadeTo: function(dur, opacity, easing, rate){
            return this.addAction(cc.FadeTo, [dur, opacity], easing, rate);
        },
        jumpBy: function(dur, pos, height, times, easing, rate){
            return this.addAction(cc.JumpBy, [dur, pos, height, times || 1], easing, rate);
        },
        jumpTo: function(dur, pos, height, times, easing, rate){
            return this.addAction(cc.JumpTo, [dur, pos, height, times || 1], easing, rate);
        },
        moveBy: function(dur, pos, easing, rate){
            return this.addAction(cc.MoveBy, [dur, pos], easing, rate);
        },
        moveTo: function(dur, pos, easing, rate){
            return this.addAction(cc.MoveTo, [dur, pos], easing, rate);
        },
        rotateBy: function(dur, deltaX, deltaY, easing, rate){
            return this.addAction(cc.RotateBy, [dur, deltaX, deltaY], easing, rate);
        },
        rotateTo: function(dur, deltaX, deltaY, easing, rate){
            return this.addAction(cc.RotateTo, [dur, deltaX, deltaY], easing, rate);
        },
        scaleBy: function(dur, sx, sy, easing, rate){
            return this.addAction(cc.ScaleBy, [dur, sx, sy], easing, rate);
        },
        scaleTo: function(dur, sx, sy, easing, rate){
            return this.addAction(cc.ScaleTo, [dur, sx, sy], easing, rate);
        },
        skewBy: function(dur, sx, sy, easing, rate){
            return this.addAction(cc.SkewBy, [dur, sx, sy], easing, rate);
        },
        skewTo: function(dur, sx, sy, easing, rate){
            return this.addAction(cc.SkewTo, [dur, sx, sy], easing, rate);
        },
        tintBy: function(dur, deltaR, deltaG, deltaB, easing, rate){
            return this.addAction(cc.TintBy, [dur, deltaR, deltaG, deltaB], easing, rate);
        },
        tintTo: function(dur, deltaR, deltaG, deltaB, easing, rate){
            return this.addAction(cc.TintTo, [dur, deltaR, deltaG, deltaB], easing, rate);
        },
        /**
         sprite.animate(0.2, 'a.png', 'b.png', 'c.png');
         sprite.animate(0.2, 'abc_%d.png');
         sprite.animate(0.2, 'abc_%d.png', startIndex, endIndex);
         */
        animate: function(dur /* frames */){
            var frames = [].slice.call(arguments, 1);

            if(/%d/.test(frames[0])){
                frames = getAnimFrames.apply(null, frames);
            }else{
                frames = frames.map(function(frameName){
                    return cc.getSpriteFrame(frameName);
                });
            }

            var animation = cc.Animation.create(frames, dur/frames.length);
            this.getActionList().push(cc.Animate.create(animation));
            return this;
        },
        spawn: function(){
            this.__spawn = this.__spawn || [];
            var actionSeq = this.getActionList();
            if(actionSeq.length > 0){
                var action = actionSeq[0];
                if(actionSeq.length > 1){
                    action = cc.Sequence.create.apply(cc.Sequence, actionSeq);
                }
                this.__spawn.push(action);
                actionSeq.length = 0;
            }
            return this;
        }
    });

    Animation.prototype.play = Animation.prototype.addAction;

    GN.mixin(cc.Node.prototype, new Animation);

    cc.AnimationFragement = Animation;
    cc.AnimationFragement.create = function(){
        return new cc.AnimationFragement();
    }

    cc.Node.prototype.run = function(){
        var action = this.getAction();
        if(action){
            this.runAction(action);
            this.getActionList().length = 0;
            this.__spawn.length = 0;
        }
    }

})(this);
