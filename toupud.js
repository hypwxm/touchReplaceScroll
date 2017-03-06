/*
* var swipper = Toupud;
   swipper.init({
    //要移动的元素，id或者类名class或者标签名。
    moveEle: ".swiper-wrapper",
    //moveEle要被拖动的方向  “ud” 上下， “lr” 左右
    dir: "lr",
    //移动开始回调函数
    startCallBack:function() {},
    //移动过程的回调函数
    moveCallBack:function() {},
    //触摸结束，停下来后的回调函数
    endCallBack: function() {
        imgScrollIndex = 0;
        scrollLoadingImg(0, document.documentElement.clientHeight);
    }，
    //scrollPeak触顶或触左
    scrollPeak: function() {},
    //scrollPeak触底或触右
    scrollSole: function() {}
 })
* */



var arrSlice = Array.prototype.slice;
function Toupud() {};

Toupud.prototype = {
    moveEle: null,
    moveDom: null,
    dir: null,
    //移动元素的总可以移动的距离
    moveDistance: 0,
    init: function (obj) {
        var that = this;
        this.setMoveEle(obj.moveEle);
        document.addEventListener("touchstart", function (event) {
            var target = event.target;
            if (DS.parentsUntil(target, that.moveEle)) {
                that.moveDom = DS.parentsUntil(target, that.moveEle);
                that.setMoveDir(obj.dir);
                that.moveDom.dir = that.dir;
                that.moveDom.moveDistance = that.moveDistance;
                //触摸结束，停下来后的回调函数
                that.moveDom.endCallBack = obj.endCallBack;
                //移动过程的回调函数
                that.moveDom.moveCallBack = obj.moveCallBack;
                //移动开始回调函数
                that.moveDom.startCallBack = obj.startCallBack;
                //scrollPeak触顶或触左
                that.moveDom.scrollPeak = obj.scrollPeak;
                //scrollPeak触底或触右
                that.moveDom.scrollSole = obj.scrollSole;
                //that.moveDom.style.transform = "translate3d(0,0,0)";
                mStart.call(that.moveDom, event);
                //that.moveDom.addEventListener("touchstart", mStart, false);
                that.moveDom.addEventListener("touchmove", mMove, false);
                that.moveDom.addEventListener("touchend", mEnd, false);
            }
        }, false);
    },
    setMoveEle: function (ele) {
        this.moveEle = ele;
    },
    //设置拖动方向，上下还是左右  ud   lr
    setMoveDir: function (dir) {
        this.dir = dir;
        var moveDis;
        if (dir == "ud") {
            moveDis = this.getBoxHeight();
        } else if (dir == "lr") {
            moveDis = this.getBoxWidth();
        }
        this.moveDistance = moveDis;
    },
    getBoxWidth: function () {
        return this.moveDom.scrollWidth;
    },
    getBoxHeight: function () {
        return this.moveDom.scrollHeight;
    },

};

function translateDir(dir, distance) {
    if(dir == "ud") {
        this.style.webkitTransform = "translate3d(0," + distance + "px,0)";
        this.style.transform = "translate3d(0," + distance + "px,0)";
    } else if(dir == "lr") {
        this.style.webkitTransform = "translate3d(" + distance + "px,0,0)";
        this.style.transform = "translate3d(" + distance + "px,0,0)";
    }
}

//移动过程中触摸
function stopMove(dir) {
    var pNode = this.parentNode;
    var pNodeOff = pNode.getBoundingClientRect();
    var _nodeOff = this.getBoundingClientRect();
    if(dir == "lr") {
        var pNodeOffL = pNodeOff.left;
        var _nodeOffL = _nodeOff.left;
        this.realPos = _nodeOffL - pNodeOffL;
        translateDir.apply(this, ["lr", this.realPos])
    } else if(dir == "ud") {
        var pNodeOffT = pNodeOff.top;
        var _nodeOffT = _nodeOff.top;
        this.realPos = _nodeOffT - pNodeOffT;
        translateDir.apply(this, ["ud", this.realPos])
    }
    this.stop = true;
    clearTimeout(this.beyondTimer);
    this.prevMove = this.realPos;
    this.moveDis = null;
}

function mStart(event) {
    var that = this, _touch;
    var dir = that.getAttribute("dir");
    var targetTouches = event.touches;
    _touch = targetTouches[0];
    that.touch = _touch;
    this.pointerX = _touch.clientX;
    this.pointerY = _touch.clientY;

    if(!this.prevMove) {
        this.prevMove = 0
    }
    that.scT = document.body.scrollTop;
    this.style.webkitTransitionDuration = "0s";
    this.style.transitionDuration = "0s";
    this.style.webkitTransitionTimingFunction = "cubic-bezier(0.333333, 0.666667, 0.666667, 1)";
    this.style.transitionTimingFunction = "cubic-bezier(0.333333, 0.666667, 0.666667, 1)";
    this.style.webkitTransitionProperty = "-webkit-transform";
    this.style.transitionProperty = "transform";
    stopMove.call(this, dir);
    this.moveTime = this.startTime = new Date().valueOf();
    this.speedPos = 0;
    this.speedCount = 0;
    var startCallBack = this.startCallBack;
    if(typeof startCallBack == "function") {
        startCallBack.call(this);
    }
    this.moveCount = 0;
}

function mMove(event) {

    function _removeMoveEvent() {
        this.removeEventListener("touchmove", mMove, false);
    }
    this.stop = false;
    var dir = this.getAttribute("dir");
    if (this.moveCount == 0 && dir == "lr") {
        if (this.scT != document.body.scrollTop) {
            _removeMoveEvent.call(this);
            return;
        }
    }
    this.moveCount++;
    var _touch, pointerX, pointerY, _dis, _disX, _disY;
    var targetTouches = event.touches;

    _touch = targetTouches[0];

    var prevMove = this.prevMove;
    pointerX = _touch.clientX;
    pointerY = _touch.clientY;
    _disX = pointerX - this.pointerX;
    _disY = pointerY - this.pointerY;
    if(dir == "lr") {
        if(this.moveCount == 1) {
            if(Math.abs(_disX/_disY) < 1) {
                _removeMoveEvent.call(this);
                this.moveCount++;
                return;
            }
        }
        _dis = _disX;
    } else if (dir == "ud") {
        if(this.moveCount == 1) {
            if(Math.abs(_disX/_disY) > 1) {
                _removeMoveEvent.call(this);
                this.moveCount++;
                return;
            }
        }
        _dis = _disY;
    }


    event.preventDefault();
    var finalPos = prevMove + _dis;
    if(finalPos >= 0 || finalPos <= -(this.moveDistance - this.parentNode.clientWidth)) {
        _dis = _dis/2;
    }
    if (dir == "ud") {
        translateDir.apply(this, ["ud", (prevMove + _dis)]);
    } else if (dir == "lr") {
        translateDir.apply(this, ["lr", (prevMove + _dis)]);
    }

    this.moveDis = prevMove + _dis;
    this._dis = _dis;

    if(this.speedCount == 0) {
        this.speedPos1 = _dis;
        this.speedCount++;
    }
    var nowTime = new Date().valueOf();
    if(nowTime - this.moveTime >= 20) {
        this.moveTime = nowTime;
        this.speedPos = _dis - this.speedPos1;
        this.speedPos1 = _dis;
    }
    var moveCallBack = this.moveCallBack;
    if(typeof moveCallBack == "function") {
        setTimeout(function() {
            moveCallBack.call(this);
        }, 10)
    }
}
function mEnd() {
    this.removeEventListener("touchmove", mMove, false);
    this.removeEventListener("touchend", mEnd, false);

    if(this.moveDis) {
        this.prevMove = this.moveDis;
    }

    if(!boundaryDetermination.call(this)) {
        //touchend的时候如果超出界限，直接到边界即可。
        return;
    }
    this.endTime = new Date().valueOf();
    if(this.endTime - this.moveTime > 50) return;
    var speed;
    speed = Math.abs(this.speedPos * 3);

    //速度越快所用时间越短，但是移动路程更长
    //时间公式  time = v/31.1的平方根；
    var needTime = Math.sqrt(speed/31.1);
    needTime = needTime > 2 ? 2 : needTime;

    //距离公式  v*4000的平方
    var needDis = Math.sqrt(speed * 4000);

    //正向或者反向判断
    if(this.speedPos < 0) {
        needDis = -needDis;
    }

    this.needDis = needDis;
    this.prevMove = this.prevMove + needDis;
    boundaryDetermination.call(this, needTime);
    return true;
}

function boundaryDetermination(needTime) {

    var endCallBack = this.endCallBack;
    if(typeof endCallBack == "function") {
        setTimeout(function() {
            endCallBack.call(this);
        }, needTime ? needTime : 500);
    }

    var dir = this.getAttribute("dir");
    var prevMove = this.prevMove;
    var maxMove, pCL;
    if(dir == "ud") {
        pCL = this.parentNode.clientHeight;
        maxMove = this.moveDistance - pCL;
    } else if (dir == "lr") {
        pCL = this.parentNode.clientWidth;
        maxMove = this.moveDistance - pCL;
    }

    if(this.prevMove >= 0) {
        //往右滑或往下的时候超过界限
        this.prevMove = 0;

        //scrollPeak触顶或触左
        if(typeof this.scrollPeak == "function") {
            this.scrollPeak.call(this);
        }
        if(needTime) {
            return _isBeyond.apply(this, [needTime, prevMove]);
        } else {
            return _isBeyond.call(this);
        }
    } else if (this.prevMove <= -maxMove) {
        //scrollPeak触底或触右
        if(typeof this.scrollSole == "function") {
            this.scrollSole.call(this);
        }

        //往左滑或往上超过界限
        if(this.moveDistance >= pCL) {
            //滑动块的长度币父级容器长的。
            this.prevMove = -maxMove;
            if(needTime) {
                return _isBeyond.apply(this, [needTime, prevMove - this.prevMove]);
            } else {
                return _isBeyond.call(this);
            }
        } else {
            //滑动块完全显示在父级容器内，直接恢复位置
            this.prevMove = 0;
            return _isBeyond.call(this);
        }
    } else {
        //滑动不会超出边界
        this.style.webkitTransitionDuration = needTime + "s";
        this.style.transitionDuration = needTime + "s";
        if(dir == "ud") {
            translateDir.apply(this, ["ud", this.prevMove]);
        } else if(dir == "lr") {
            translateDir.apply(this, ["lr", this.prevMove]);
        }
    }

    function _isBeyond(needTime, beyondMove) {
        var that = this;

        if(needTime) {
            //这里说明touchend的时候未超出边界，但是继续滑下去会超出边界，，要超出边界的部分按比例滑出，缓动

            //由于会有多出屏幕的部分，有事这部分会很长，得把多出来的时间重先减去
            needTime = needTime * (that.needDis - beyondMove)/that.needDis;

            that.style.webkitTransitionDuration = needTime + "s";
            that.style.transitionDuration = needTime + "s";
            if (dir == "ud") {
                translateDir.apply(that, ["ud", (that.prevMove + beyondMove/50)]);
            } else if (dir == "lr") {
                translateDir.apply(that, ["lr", (that.prevMove + beyondMove/50)]);
            }

            //超出动画结束后，缓动回到边界，如果在这个过程中有触摸了，需要在touchstart里面clearTimeout这个beyondTimer
            if(this.stop == false) {
                this.beyondTimer = setTimeout(function() {
                    that.style.webkitTransitionDuration = 0.3 + "s";
                    that.style.transitionDuration = 0.3 + "s";
                    if (dir == "ud") {
                        translateDir.apply(that, ["ud", that.prevMove]);
                    } else if (dir == "lr") {
                        translateDir.apply(that, ["lr", that.prevMove]);
                    }
                }, needTime * 1000);
            }

        } else {
            //走到这一步，说明touchend的时候已经超出边界了，直接回到边界位置即可。
            that.style.webkitTransitionDuration = "0.3s";
            that.style.transitionDuration = 0.3 + "s";
            if (dir == "ud") {
                translateDir.apply(that, ["ud", that.prevMove]);
            } else if (dir == "lr") {
                translateDir.apply(that, ["lr", that.prevMove]);
            }
        }
        return false;
    }
    return true;
}


Object.defineProperty(Toupud.prototype, "constructor", {
    enumerable: false,
    value: Toupud
});
