//Create:陈毅；2014.12.25
//description：在手机上的检索下拉单选按钮（单选按钮的样式要自己写）
//usage:$('selecter').filter_list({ data: data, top: 45 },callback);
//params:data-传入的Json数据，数据中包含（Name和Id两个必要属性）；
//params:callback-点击选项后的回调函数（可为空）
//params:top-搜索框到页面顶部的绝对高度（可为空，默认为：45）
(function ($, window, undefined) {
    //后缀
    var _suffix = {
        list: '_thelist',
        filter_container: '_filter_container',
        filter_input: '_filter_input',
        filter_clear: '_filter_clear',
        listview: '_listview',
        getListviewID: function (id) { return '#' + id + this.listview; },
        getListID: function (id) { return '#' + id + this.list; },
        getInputID: function (id) { return '#' + id + this.filter_input; },
        getClearID: function (id) { return '#' + id + this.filter_clear; },
        getContainerID: function (id) { return '#' + id + this.filter_container; }
    };
    var _config = null;
    //默认配置
    var _defualtSetting = { data: null, top: '45' };
    //初始化FilterHtml
    function initFilter(id) {
        if (id == null || id == '' || id == undefined) {
            return '';
        }
        //筛选框
        var filterInput = String.format('<div id="{0}_filter_container" class="search-container"><input id="{0}_filter_input" type="text"class="search-input"/><span id="{0}_filter_clear" class="search-clear"></span></div>', id);
        //列表
        var listUl = String.format('<div class="list-container"><ul id="{0}_thelist" class="filter-ul"></ul></div>', id);
        var btnHtml = '<div class="cancel"><input class="cancel-btn" value="取消" type="button"></div>'
        var html = '<div id="{0}_listview" class="listView-container" >{1}{2}{3}</div>';

        html = String.format(html, id, filterInput, listUl, btnHtml);
        return html;
    }

    //子对象
    var _thisChildren = '<div style="width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"></div>';

    //创建列表
    function creatList(data) {
        var templat = '<li data-id="{0}" data-name="{1}">{1}</li>';
        var html = '';
        $(data).each(function () {
            html += String.format(templat, this.Id, this.Name);
        });
        return html;
    }
    //筛选列表
    $.fn.filter_list = function (setting, callback) {
        _config = $.extend({}, _defualtSetting, setting);
        if (_config.data == null || _config.data.length == 0) {
            //todo:抛JS异常
            return;
        }
        var $this = $(this);
        var _thisW = $this.width();
        $this.on('click', function () {
            $(_suffix.getListviewID(_id)).show();
        });
        var _id = $this.attr('id');
        $this.parent().append(initFilter(_id));
        var tempObj = $(_suffix.getListID(_id));
        //设置绝对高度
        $(_suffix.getContainerID(_id)).css('top', _config.top + 'px');
        tempObj.parent().css('top', (40 + parseInt(_config.top)) + 'px');
        //创建list
        tempObj.html(creatList(_config.data));
        //列表点击事件
        tempObj.children('li').on('click', function () {
            $(this).addClass('selected').siblings('li.selected').removeClass('selected');
            var text = $(this).attr('data-name');
            var selectedID = $(this).attr('data-id');
            $this.val(text).attr('data-id', selectedID);
            if ($this.children().length > 0) {
                $this.children().text(text);
            }
            else {
                $this.html($(_thisChildren).text(text));
            }
            $this.children().width(_thisW);
            $(_suffix.getListviewID(_id)).hide();
            if (callback != null && typeof (callback) === 'function') {
                callback(selectedID, text);
            }
        });
        //屏幕旋转事件
        var evt = "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(evt, function () {
            if ($this.children().length > 0) {
                _thisW = $this.width();
                $this.children().width(_thisW);
            }

        });
        //注册检索事件
        $(_suffix.getInputID(_id)).on('keyup', function (e) {
            //延时300ms响应
            setTimeout(function () {
                val = $(_suffix.getInputID(_id)).val();
                val = val.trim();
                if (val != '') {
                    $(_suffix.getClearID(_id)).show();
                }
                else {
                    $(_suffix.getClearID(_id)).hide();
                }
                var patt = new RegExp(val.toUpperCase());
                tempObj.children('li').hide();
                tempObj.children('li').each(function (i, n) {
                    var str = $(n).attr('data-name');
                    if (patt.test(str.toUpperCase())) {
                        $(n).show();
                    }
                });
            }, 300);
        });

        // 输入框清楚事件
        $(_suffix.getClearID(_id)).on('click', function () {
            tempObj.children('li').show();
            $(this).hide();
            $(_suffix.getInputID(_id)).focus().val('');
        });
        $(_suffix.getListviewID(_id)).children('div.cancel').children('input.cancel-btn').on('click', function () {
            $(_suffix.getListviewID(_id)).hide();
        });
    };

})(jQuery, this);