// 格式化字符串,可以替换占位符,如String.Format("{0}加{1}等于{3}",1,1,2)
String.format = function (src) {
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    });
};

// 通用判断对象是否为null的方法
String.IsNullOrEmpty = function (object) {
    if (object == null) {
        return true;
    }

    if (object == "") {
        return true;
    }

    return false;
};

// 删除左右两端的空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

// 将字符串转换为日期类型
String.prototype.toDate = function () {
    var temp = Date.parse(this);
    if (temp == null) {
        return "";
    }
    var date = eval('new Date(' + this.replace(/\d+(?=-[^-]+$)/,
        function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
};


// 格式化日期对象format="yyyy-MM-dd hh:mm:ss"
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour
        "m+": this.getMinutes(),  //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//转化为金额(整数‘123456’转化为‘123,456';浮点数默认保留两位）：str.toMoney();
String.prototype.toMoney = function () {
    if (this.length <= 0 && isNaN(this)) {
        return this;
    }
    var mathRound = function (num) {
        return Math.round(num * 100) / 100;
    }
    var result = '';
    var array = this.split('.');
    var len = array.length;
    if (len > 1 && array[1].length > 2) {
        var temp = mathRound(this);
        array = temp.toString().split('.');
    }
    var newArray = [];
    for (var i = array[0].length - 1, j = 1; i >= 0; i--, j++) {
        newArray.push(array[0][i]);
        if (j % 3 == 0 && j != array[0].length) {
            newArray.push(',');
        }
    }
    result = newArray.reverse().join('');
    if (array.length > 1) {
        result += '.' + (array[1].length == 2 ? array[1] : array[1] + '0');
    }
    else
        if (len > 1) {
            result += '.00'
        }
    array = newArray = null;
    return result;
};

//判断该元素数组中是否存在
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

// 判断设备是否是PC机
function isPc() {
    return navigator.userAgent.toLowerCase().match(/windows/i) == "windows";
};

// 判断设备是否是苹果
//Iphone
function isIphone() {
    return navigator.userAgent.toLowerCase().match(/iphone os/i) == "iphone os";
};
//Ipad
function isIpad() {
    return navigator.userAgent.toLowerCase().match(/ipad/i) == "ipad";
};
function isAndroid() {
    return navigator.userAgent.toLowerCase().match(/android/i) == "android";
};

function isUC() {
    return navigator.userAgent.toLowerCase().match(/ucweb/i) == "ucweb";
};

function isMidp() {
    return navigator.userAgent.toLowerCase().match(/midp/i) == "midp";
};

//判断是否从主屏启动（前提是IOS系统）:是-true,否则为-false；
function isStandalone() {
    var result = false;
    if (navigator.standalone) {
        result = true;
    }
    return result;
}

//var bForcepc = fGetQuery("dv") == "pc";
//function fBrowserRedirect() {
//    var sUserAgent = navigator.userAgent.toLowerCase();
//    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
//    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
//    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
//    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
//    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
//    var bIsAndroid = sUserAgent.match(/android/i) == "android";
//    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
//    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
//    if (bIsIpad) {
//        var sUrl = location.href;
//        if (!bForcepc) {
//            window.location.href = "http://ipad.mail.163.com/";
//        }
//    }
//    if (bIsIphoneOs || bIsAndroid) {
//        var sUrl = location.href;
//        if (!bForcepc) {
//            window.location.href = "http://smart.mail.163.com/";
//        }
//    }
//    if (bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
//        var sUrl = location.href;
//        if (!bForcepc) {
//            window.location.href = "http://m.mail.163.com/";
//        }
//    }
//}
//function fGetQuery(name) {//获取参数值  
//    var sUrl = window.location.search.substr(1);
//    var r = sUrl.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
//    return (r == null ? null : unescape(r[2]));
//}
//function fShowVerBlock() {
//    if (bForcepc) {
//        document.getElementById("dv_block").style.display = "block";
//    }
//    else {
//        document.getElementById("ad_block").style.display = "block";
//    }
//}
//fBrowserRedirect();
/**
 * 初始化下拉刷新上拉翻页iScroll控件
 */
function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        scrollbarClass: 'myScrollbar', /* 重要样式 */
        useTransition: false, /* 此属性不知用意，本人从true改为false */
        useTransform: false,
        hideScrollbar: true,
        fadeScrollbar: true,
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                this.minScrollY = -pullDownOffset;
            }
            else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip') && !pullDownEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                this.maxScrollY = this.maxScrollY;
            } else if ((this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) || pullDownEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                //this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });

    setTimeout(function () {
        if (document.getElementById('wrapper') != null) {
            document.getElementById('wrapper').style.left = '0';
        }
    }, 800);
}
/**
 * 初始化基础iScroll控件
 * top 距离顶部高度
 */
function baseloaded(top) {
    if (myScroll != null) {
        myScroll.destroy();
    }
    top = (top == undefined ? 90 : top);
    myScroll = new iScroll('wrapper', {
        bounce: false,
        vScroll: true,
        scrollbarClass: 'myScrollbar', /* 重要样式 */
        useTransition: false, /* 此属性不知用意，本人从true改为false */
        useTransform: false,
        hideScrollbar: false,
        vScrollbar: true, //fadeScrollbar: true,
        onRefresh: function () {
        },
        onScrollMove: function () {
            if ($('#flow').css('display') != 'block') {
                $('.open').each(function () {
                    //上滑显示浮动标题栏
                    if ($(this).offset().top <= top) {
                        var nowfloatDiv = sessionStorage.getItem("needClosDiv");
                        if ($('#floatTitle').css("display") == 'none') {
                            $('#floatTitle').css("display", "block");
                            $('#floatTitle .title').html($(this.children[0].children[1]).html());
                            sessionStorage.setItem("needClosDiv", this.id);
                        }
                        if (nowfloatDiv != this.id) {
                            $('#floatTitle .title').html($(this.children[0].children[1]).html());
                            sessionStorage.setItem("needClosDiv", this.id);
                        }
                    }
                    //下滑隐藏浮动标题栏
                    if ($(this).offset().top > top) {
                        if ($('#floatTitle').css("display") == 'block') {
                            var nowfloatDiv = sessionStorage.getItem("needClosDiv");
                            if (nowfloatDiv == this.id) {
                                $('#floatTitle').css("display", "none");
                                sessionStorage.setItem("needClosDiv", '');
                            }
                        }
                    }
                });
            }
        },
        onScrollEnd: function () {
            if ($('#flow').css('display') != 'block') {
                var nowfloatDiv = sessionStorage.getItem("needClosDiv");
                if (nowfloatDiv != 'undefined' && $('#' + nowfloatDiv).offset() != undefined) {
                    if ($('#' + nowfloatDiv).offset().top > top) {
                        $('#floatTitle').css("display", "none");
                        sessionStorage.setItem("needClosDiv", '');
                    }
                }
                $('.open').each(function () {
                    //上滑显示浮动标题栏
                    if ($(this).offset().top <= top) {
                        var nowfloatDiv = sessionStorage.getItem("needClosDiv");
                        if ($('#floatTitle').css("display") == 'none') {
                            $('#floatTitle').css("display", "block");
                            $('#floatTitle .title').html($(this.children[0].children[1]).html());
                            sessionStorage.setItem("needClosDiv", this.id);
                        }
                        if (nowfloatDiv != this.id) {
                            $('#floatTitle .title').html($(this.children[0].children[1]).html());
                            sessionStorage.setItem("needClosDiv", this.id);
                        }
                    }
                    //下滑隐藏浮动标题栏
                    if ($(this).offset().top > top) {
                        if ($('#floatTitle').css("display") == 'block') {
                            var nowfloatDiv = sessionStorage.getItem("needClosDiv");
                            if (nowfloatDiv == this.id) {
                                $('#floatTitle').css("display", "none");
                                sessionStorage.setItem("needClosDiv", '');
                            }
                        }
                    }
                })
            }
        }
    });

    setTimeout(function () {
        if (document.getElementById('wrapper') != null) {
            document.getElementById('wrapper').style.left = '0';
        }
    }, 800);
}
//判断两次点击时间间隔
var lastClickTime = null;
function checkClickTime() {
    if (lastClickTime == null) {
        lastClickTime = new Date().getTime();
    }
    else {
        var nowClickTime = new Date().getTime();
        if (nowClickTime - lastClickTime < 500) {
            return false;
        }
        else {
            lastClickTime = nowClickTime;
        }
    }
    return true;
}
//替换undefined和null
function replaceNull(str) {
    if (str == undefined || str == null)
        str = '';
    return str.toString().trim();
}
/*带标签内容块点击事件注册*/
function contentTabReg() {
    $('.contentTab .selected').each(
        function () {
            $('#' + $(this).attr("data-content-id")).css('display', 'block')
        });
    $('.contentTab .unSelected').each(
        function () {
            $('#' + $(this).attr("data-content-id")).css('display', 'none')
        });
    $('.contentTab .selected').click(function () {
        if (checkClickTime()) {
            if ($(this).attr("class") == "unSelected") {
                $(this).parent().children().each(function () {
                    $(this).attr("class", "unSelected");
                })
                $(this).attr("class", "selected");
                $('#' + $(this).attr("data-content-id")).parent().children().each(function () {
                    $(this).css('display', 'none');
                })
                $('#' + $(this).attr("data-content-id")).css('display', 'block');
                //重新计算详情布局
                reSetDetailSize();
            }
            if (navigator.userAgent.indexOf("MSIE") <= 0) {
                myScroll.refresh();
            }
        }
    });
    $('.contentTab .unSelected').click(function () {
        if (checkClickTime()) {
            if ($(this).attr("class") == "unSelected") {
                $(this).parent().children().each(function () {
                    $(this).attr("class", "unSelected");
                })
                $(this).attr("class", "selected");
                $('#' + $(this).attr("data-content-id")).parent().children().each(function () {
                    $(this).css('display', 'none');
                })
                $('#' + $(this).attr("data-content-id")).css('display', 'block');
                //重新计算详情布局
                reSetDetailSize();
            }
            if (navigator.userAgent.indexOf("MSIE") <= 0) {
                myScroll.refresh();
            }
        }
    });
}
/*滚动页码点击事件注册*/
function scrollPageReg() {
    $('.pageScroll .selected').click(function () {
        if (checkClickTime()) {
            if ($(this).attr("class") == "unSelected") {
                $(this).parent().children().each(function () {
                    $(this).attr("class", "unSelected");
                })
                $(this).attr("class", "selected");
                var nowScroll = $(this).attr("data-scrollId");
                var pageIndex = $(this).attr("data-content-index");
                window[nowScroll].scrollToPage(pageIndex, 1);
            }
        }
    });
    $('.pageScroll .unSelected').click(function () {
        if (checkClickTime()) {
            if ($(this).attr("class") == "unSelected") {
                $(this).parent().children().each(function () {
                    $(this).attr("class", "unSelected");
                })
                $(this).attr("class", "selected");
                var nowScroll = $(this).attr("data-scrollId");
                var pageIndex = $(this).attr("data-content-index");
                window[nowScroll].scrollToPage(pageIndex, 1);
            }
        }
    });
}

///iScroll插件中 阻止touchmove事件的处理方法
var touchmoveHandler = function (e) { e.preventDefault(); };
///在没有iScroll的页面中，如果有多条记录，而不能滑动屏幕，需添加此方法在ready()中
function removePreventTouchmove() {
    document.removeEventListener('touchmove', touchmoveHandler, false);
}
//注册iScroll 时，调用该事件，阻止Touchmove;
function addPreventTouchmove() {
    if (typeof (addEventListener) == "undefined") {
        document.attachEvent('touchmove', touchmoveHandler, false);
    }
    else {
        document.addEventListener('touchmove', touchmoveHandler, false);
    }
}
//当窗口大小改变时重设详细模块的宽度
function reSetDetailSize() {
    $('#content .row1x2').each(function (i, v) {
        var spanArray = $(v).children('span');
        var sapnNum = spanArray.length;
        if (sapnNum > 0) {
            sapnGroupNum = sapnNum / 2;
            if (sapnGroupNum == 1)
                var perGroupWidth = Math.floor($(v).width() / sapnGroupNum);
            for (var i = 0; i < sapnGroupNum; i++) {
                if (i % 2 == 1) {
                    $(spanArray[1]).css('width', perGroupWidth - $(spanArray[0]).width());
                }
            }
        }
    });
    //$.mobile.pageContainer.trigger("create");
}