// Author:陈毅
// Create Date:2014-04-22
// listView,伸缩展示

var listView = {};
(function () {
    function handler() {
        var object;
        var ctrllist = new Array();
        this.getControlById = function (id) {
            for (var i = 0; i < ctrllist.length; i++) {
                if (ctrllist[i].key == id) {
                    return ctrllist[i];
                }
            }
            return null;
        };
        this.getControlByIndex = function (index) {
            return ctrllist[index];
        };
        var setObject = function () {
            object = $('ul[data-gd-listview="1"]');
            if (object.length < 1) {
                return false;
            }
            if (object.children().length < 1) {
                return false;
            }
            return true;
        };
        // 刷新
        this.refresh = function () {

            //todo:Olderversions不要删，以后可能要恢复
            function olderversions(parameters) {

                /* if (!setObject()) { return; }
                config.isAllExpansion = object.attr('aria-expanded') == undefined ? config.isAllExpansion : object.attr('aria-expanded');
                object.children("li").each(function (i, n) {
                    var obj = $(n);
                    obj.addClass("gd-listview-li").children("div").addClass("gd-listview-div");
                    obj.children('label').addClass('gd-listview-li-label gd-listview-li-label-expansion');
    
                    obj.children("label").on("click touchend", function () {
                        event.preventDefault();
                        var temp = $(this).parent();
                        if (config.isAllExpansion == "false") {
                            temp.siblings().children('label.gd-listview-li-label-expansion').toggleClass("gd-listview-li-label-flod gd-listview-li-label-expansion");
                            temp.siblings().children('div').addClass('gd-listview-div-hide');
                        }
                        temp.children('label').toggleClass("gd-listview-li-label-flod gd-listview-li-label-expansion");
                        temp.children('div').toggleClass('gd-listview-div-hide');
                    });
                });
    
                setStyle();*/
            }
            //todo:新版本，主要是为了防止一个页面加载多个ListView,而每个页面的事件去不一样的情况
            if (!setObject()) {
                return;
            }
            config.isAllExpansion = object.attr('aria-expanded') == undefined ? config.isAllExpansion : object.attr('aria-expanded');
            object.each(function (index, value) {
                $(value).children('li').each(function (i, n) {
                    var obj = $(n);
                    obj.addClass("gd-listview-li").children("div").addClass("gd-listview-div");
                    obj.children('label').addClass('gd-listview-li-label gd-listview-li-label-expansion');

                    obj.children("label").on("click", { "obj": obj }, function (event) {
                        onclickAndTouchend(event);
                    });
                });
                var ctrl = {
                    index: index,
                    key: $(value).attr('id'),
                    value: value,
                    onclick: null
                };
                $(value).click(function (event) {
                    if (ctrl.onclick != null) {
                        ctrl.onclick(event);
                    }
                });
                ctrllist.push(ctrl);
            });
            setStyle();
        };
        //默认事件
        var onclickAndTouchend = function (event) {
            event.preventDefault();
            var temp = event.data.obj;
            if (config.isAllExpansion == "false") {
                temp.siblings().children('label.gd-listview-li-label-expansion').toggleClass("gd-listview-li-label-flod gd-listview-li-label-expansion");
                temp.siblings().children('div').addClass('gd-listview-div-hide');
            }
            temp.children('label').toggleClass("gd-listview-li-label-flod gd-listview-li-label-expansion");
            temp.children('div').toggleClass('gd-listview-div-hide');
        };
        //重置
        this.reset = function () { };
        //设置样式
        var setStyle = function () {
            object.addClass("gd-listview");
            var obj = object.children("li");
            obj.first().addClass("gd-listview-li-first");
            obj.last().addClass("gd-listview-li-last");
            obj.children("div").last().addClass("gd-listview-div-last");
            if (config.isAllExpansion == "false") {
                obj.children("div").addClass('gd-listview-div-hide');
                obj.children('label').toggleClass('gd-listview-li-label-expansion gd-listview-li-label-flod');
                var selectedLi = object.find('li[data-gd-listview-selected="true"]');
                selectedLi.children("div").removeClass("gd-listview-div-hide");
                selectedLi.children("label").toggleClass('gd-listview-li-label-flod gd-listview-li-label-expansion');
            }
        };

        var config = {
            isAllExpansion: "false"
        };
    };
    listView = new handler();
})();

$(document).ready(function () {

    listView.refresh();
});
