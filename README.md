# touchReplaceScroll
手指触摸事件代替页面scroll事件。
```javascript
var swipper = Toupud;
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
 ```
