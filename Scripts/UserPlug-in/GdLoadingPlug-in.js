/*陈毅,2014.11.19*/
//description:加载等待插件：show:表示显示，hide：表示隐藏
//Usage:$(selecter).gdLoading('show', { 
//                                      timeout: 3,//设置自动隐藏时间
//                                      iconClass: 'newImage',//图标的样式，仅限于图标的url（好处：不受目录相对位置的影响）
//                                      text: '加载中...',//加载中
//                                      isText: true//是否显示文本
//                                      isOverlay: true//是否添加覆盖层
//                                      });
(function ($, window, undefined) {
    var _congfig = null;
    var _defaultHtml = '<div class="gd-container"><div class="gd-load-container gd-load-vertical"><div class="gd-load-main gd-load-img"><span class="gd-load-text">加载中...</span></div></div></div>';

    var overlay = '<div class="overlay"></div>';//覆盖层
    var container = '<div class="gd-container"></div>';//容器
    var loadLay = '<div class="gd-load-container gd-load-vertical"></div>';
    var imglay = '<div class="gd-load-main gd-load-img"></div>';//加载的图标
    var textSpan = '<span class="gd-load-text"></span>';//文字内容
    $.fn.gdLoading = function (handlerName, options) {
        _congfig = $.fn.extend({}, defaultSeting, options);
        var $this = $(this);

        //注册窗口改变事件，（对于屏幕旋转事件没有测试）
        //$(window).on('resize', { obj: $this, height: window.innerHeight }, function (evt) {
        //    reSize(evt.data.obj, evt.data.height);
        //});
        handler.hide($this);

        return handler[handlerName]($this);
    };
    var handler = {};
    handler.show = function ($obj) {
        //todo:处理显示的样式和逻辑   
        var tempobj;
        $obj.css('position', 'relative');
        if (_congfig.isOverlay) {
            $obj.append(overlay);//添加覆盖层
        }
        tempobj = $(textSpan).text(_congfig.text);
        if (!_congfig.isText) {
            tempobj.css('display', 'none');
        }
        tempobj = $(imglay).addClass(_congfig.iconClass).append(tempobj);
        tempobj = $(loadLay).append(tempobj);
        //if ($obj.height() < window.innerHeight && $obj.attr('data-role') != 'page' && !defaultSeting.isFirst) {
        //    tempobj.removeClass('gd-load-vertical');
        //    tempobj.css("padding-top", $obj.height() / 2);
        //    tempobj = $(container).append(tempobj);
        //    tempobj.removeClass('gd-container').addClass('gd-samllcontainer');
        //}
        //else {
        // tempobj.addClass('gd-load-vertical');
        //tempobj.css("padding-top", '0px');
        tempobj = $(container).append(tempobj);
        tempobj.removeClass('gd-samllcontainer').addClass('gd-container');
        //}
        $obj.append(tempobj);
        //if ($obj.attr('data-role') != 'page' && defaultSeting.isFirst) {
        //    defaultSeting.isFirst = false;
        //}
        //if ($obj.attr('data-role') == 'page') {
        //    defaultSeting.isFirst = true;
        //}
        if (_congfig.timeout != 0 && !isNaN(_congfig.timeout)) {
            autoHide($obj, _congfig.timeout);
        }
        return $obj;
    };
    handler.hide = function ($obj) {
        //todo:处理隐藏
        $obj.children('div.overlay').remove();
        $obj.children('div.gd-container').remove();
        $obj.children('div.gd-samllcontainer').remove();
        return $obj;
    }
    //自动隐藏(根据设置的时间，自动隐藏）
    var autoHide = function ($obj, time) {
        setTimeout(function () {
            handler.hide($obj);
        }, time * 1000);
    }
    //默认配置
    var defaultSeting = {
        timeout: 0,//设置自动隐藏时间
        iconClass: '',//图标的样式，仅限于图标的url（好处：不受目录相对位置的影响）
        text: '加载中...',//加载中
        isText: true,//是否显示文本
        isFirst: true,
        isOverlay: true//是否添加覆盖层
    };
    //窗口改变时触发
    var reSize = function ($obj, height) {
        handler.hide($obj);
        handler.show($obj);
    };

})(jQuery, this);