(function ($, window, undefined) {
    var imgScorll;
    var pageSize = 0;
    //初始化Iscorll
    function loaded(id) {
        imgScorll = new iScroll(id, {
            snap: true,
            momentum: false,
            hScrollbar: false,
            zoom: true,
            bounce: false,
            onScrollEnd: function () {//滚动结束后的处理方法
                if (this.scale == 1 && this.dirX != 0) {
                    scrollEndHandler(this);
                }
            },
            onBeforeScrollEnd: function (e) {
            },
            onZoomEnd: function (e) {//放缩后的处理方法
                if (this.x == 0 && this.y == 0) {
                    if (e.target.tagName == 'IMG') {

                        $(e.target).parent('li').siblings('li[data-img-index!="null"]').show();
                    }
                    else {
                        $(e.target).siblings('li[data-img-index!="null"]').show();
                    }
                    var scrollerWidth = $('#scroller').children('ul').children('li[data-img-index!="null"]').length * window.innerWidth;
                    $('#scroller').css('width', scrollerWidth + 'px');
                    this.options.snap = true;
                    this.options.momentum = false;
                    this.options.hScrollbar = false;
                    var objs = $('ul.indicator[data-img-indicator="1"]').children('li[data-img-index!="null"]');
                    var thatIndex;
                    objs.each(function (i, n) {
                        if ($(n).hasClass('active')) {
                            thatIndex = i;
                            return;
                        }
                    });
                    imgScorll.currPageX = thatIndex - 1;
                    imgScorll.scrollToPage('next', 0, 1);
                    this.refresh();
                }
            },
            onZoomStart: function (e) {//放缩前的处理
                if (e.target.tagName == 'IMG') {
                    $(e.target).parent('li').siblings('li[data-img-index!="null"]').hide();
                }
                else {
                    $(e.target).siblings('li[data-img-index!="null"]').hide();
                }
                this.options.snap = false;
                if (this.scale == 1) {
                    this.x = 0;
                    this.y = this.maxScrollX = this.maxScrollY = this.minScrollY = 0;
                }
                if (this.scale == 1 && e.touches.length > 1) {
                    this.scale = 2;
                }
                $('#scroller').css('width', window.innerWidth + 'px');

            }
        });
    }
    //滑动结束后，处理工具栏里的样式
    function scrollEndHandler(that) {
        var objs = $('ul.indicator[data-img-indicator="1"]');
        objs.children('li.active').removeClass('active');
        objs.children('li[data-img-index="' + that.currPageX + '"]').addClass('active');
        var count = parseInt(that.currPageX / pageSize);
        objs.children('li[data-img-index!="null"]').hide().each(function (i, n) {
            if (i >= count * pageSize && i < (count * pageSize + pageSize)) {
                $(n).show();
            }
        });
    };
    //根据屏幕大小，把图片进行放缩（前提是：图片已加载完成，能获取到图片的宽高）
    function resizeImages(myimg, maxwidth, maxheight) {
        var oldwidth = $(myimg).attr('oldwidth'), oldheight = $(myimg).attr('oldheight');
        if ((maxwidth / oldwidth) < (maxheight / oldheight))//以宽为标准（以小的比例为标准）
        {
            var h = oldheight * maxwidth / oldwidth;//缩略图高度
            var top = parseInt((maxheight - h) / 2);
            myimg.height = h;
            myimg.width = maxwidth;
            $(myimg).css('padding', top + 'px 0px');
        }
        else {
            var w = oldwidth * maxheight / oldheight;//缩略图宽度
            var left = parseInt((maxwidth - w) / 2);
            myimg.width = w;
            myimg.height = maxheight;
            $(myimg).css('padding', '0px ' + left + 'px');
        }
        return $(myimg);
    }
    //构建图片标签
    function creatTag(data) {
        var template = '<li data-img-index="{3}" data-catename={4}><img src="{0}" oldheight="{1}" height="{1}" width="{2}"oldwidth="{2}" data-img-index="{3}" data-catename={4}></li>';
        var html = '';
        $(data).each(function (i, n) {
            html += String.format(template, n.url, n.height, n.width, i, n.CateName);
        });
        return html;
    }
    //导航按钮
    var navHtml = '<div class="nav-img-icon" data-img-icon="prev"></div><ul  data-img-indicator="1" class="indicator"></ul><div class="nav-img-icon" data-img-icon="next"></div>';
    //var hiddenBtn = '<a href="#mypanel" id="openPanel" style="display: none"></a>';
    //Panel层
    function createPanel(data) {
        if (data.length <= 0) {
            return "";
        }
        //var panelHtml = '<div data-role="panel" id="mypanel" data-position="left" data-display="overlay" data-position-fixed="true"></div>';
        var panelContent = '<ul class="ui-selectmenu-list ui-listview" id="cateName-menu" role="listbox" aria-labelledby="bizType-button"> </ul> ';
        var template = '<li data-option-index="{0}" data-catename="{1}" data-icon="false" class="" role="option" aria-selected="false"><a href="#" tabindex="-1" class="ui-btn ui-btn-icon-right ui-checkbox-off">{1}</a></li>';
        var html = '<li data-icon="check" id="OKBtn"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-check" data-rel="close">确定</a></li>';
        html += '<li data-option-index="all" data-catename="all" data-icon="false" class="" role="option" aria-selected="false"><a href="#" tabindex="-1" class="ui-btn ui-btn-icon-right ui-checkbox-off">全部</a></li>';
        $(data).each(function (i, n) {
            html += String.format(template, i, n);
        });
        return $(panelContent).append(html);

    }
    function showImg(obj, arr) {
        var count = 0;
        obj.each(function () {
            var $that = $(this);
            for (var x in arr) {
                if ($that.attr("data-catename") == arr[x]) {
                    $that.show();
                    $that.attr("data-img-index", count).children('img').attr("data-img-index", count);
                    count++;
                    break;
                } else {
                    $that.attr("data-img-index", 'null').children('img').attr("data-img-index", 'null');
                }
            }

        });
        return count;
    }
    $.fn.imgZoom = function (data) {

        var thm = data.thm;
        var orig = data.orig;
        var cateNames = data.cateNames;
        //加载导航，加载Panel
        $('#nav').html(navHtml);
        //加载隐藏 按钮
        //$('#nav').after(hiddenBtn);
        $('#mypanel').append(createPanel(cateNames));
        $("#mypanel").trigger("updatelayout");
        var indicator = $('ul.indicator[data-img-indicator="1"]');
        indicator.html(creatTag(thm));//缩略图
        $('#orig').html(creatTag(orig));//原图
        initCss(this, thm.length);
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        addPreventTouchmove();
        loaded(this.attr('id'));//初始化Iscorll
        indicator.children('li').first().addClass('active');
        //缩略图点击事件
        indicator.children('li').on('click', function (evt) {
            var activeIndex, thatIndex;
            activeIndex = $('ul.indicator[data-img-indicator="1"]').children('li.active').attr('data-img-index');
            thatIndex = $(this).attr('data-img-index');
            if (activeIndex < thatIndex) {
                imgScorll.currPageX = thatIndex - 1;
                imgScorll.scrollToPage('next', 0, 1);
            }
            if (activeIndex > thatIndex) {
                imgScorll.currPageX = thatIndex + 1;
                imgScorll.scrollToPage('prev', 0, 1);
            }
        });

        ////原图点击事件
        $('#orig').children('li').on('click', function () {
            $("#openPanel").trigger('click');
        });
        //Panel点击事件
        $('#mypanel').on('click', function () { $(this).panel("toggle"); }).children("ul#cateName-menu").children('li').on('click', function (e) {
            var $this = $(this);
            if ($this.attr('id') == "OKBtn" || $this.attr("data-catename") == 'all') {
                var cateName = [];
                $this.siblings('li[aria-selected="true"]').each(function () {
                    cateName.push($(this).attr("data-catename"));
                });
                var origImg = $('#orig').children('li');
                var indicatorImg = $('ul.indicator[data-img-indicator="1"]').children('li');
                var len = origImg.length;
                if ($this.attr("data-catename") == 'all') {
                    cateName = cateNames;
                    var temp = $this.children('a');
                    if (temp.hasClass('ui-checkbox-off')) {
                        temp.removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                        $this.attr('aria-selected', true);
                        $this.siblings('li[data-option-index][data-catename]').attr('aria-selected', true).children('a').removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                    }
                    else if (temp.hasClass('ui-checkbox-on')) {
                        temp.removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                        $this.attr('aria-selected', false);
                        $this.siblings('li[data-option-index][data-catename]').attr('aria-selected', false).children('a').removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                        e.stopPropagation();
                        return;
                    }
                }
                else {
                    origImg.hide();
                    indicatorImg.hide();
                }
                if (cateName.length > 0) {
                    len = showImg(origImg, cateName);
                    showImg(indicatorImg, cateName);
                }
                var scrollerWidth = len * window.innerWidth;
                $('#scroller').css('width', scrollerWidth + 'px');
                indicatorImg.removeClass('active').siblings('li[data-img-index="0"]').addClass('active');
                imgScorll.options.dirX = 0;
                imgScorll.scrollToPage(0, 0, 1);
                imgScorll.refresh();
                return;
            }
            var obja = $this.children('a');
            if (obja.hasClass('ui-checkbox-off')) {

                obja.removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                $this.attr('aria-selected', true);
            }
            else if (obja.hasClass('ui-checkbox-on')) {
                obja.removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                $this.attr('aria-selected', false);
                $this.siblings('li[data-option-index="all"][data-catename="all"]').attr('aria-selected', false).children('a').removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
            }
            e.stopPropagation();
        });
        //上一张，下一张点击事件
        $('#nav').children('div.nav-img-icon').on('click', function () {
            var objs = $('ul.indicator[data-img-indicator="1"]');
            var index = objs.children('li.active').attr('data-img-index');
            var len = objs.children('li').length;
            var newIndex;
            var flag = $(this).attr('data-img-icon');
            if (flag == 'prev') {
                imgScorll.dirX = -1;
                newIndex = index - 1;
            }
            else {
                imgScorll.dirX = 1;
                newIndex = parseInt(index) + 1;
            }
            if (newIndex < len && newIndex >= 0) {
                imgScorll.scrollToPage(flag, 0, 1);
            }
            return false;
        });
        //导航栏的自适应
        navItemCss();
        //注册屏幕旋转事件
        window.onorientationchange = function () {
            orientationChange('wrapper');
        };
    }
    //导航栏的自适应
    function navItemCss() { //导航栏的自适应
        if (window.innerWidth >= 320) {
            pageSize = parseInt((window.innerWidth - 60) / 80);
            var leaveW = (window.innerWidth - 60) % 80;
            var maginW = leaveW / parseInt(pageSize) / 2.0;
            $('ul.indicator[data-img-indicator="1"]').children('li').css('margin', ('0 ' + parseInt(maginW) + 'px'));
        }
    }
    //屏幕旋转事件处理
    function orientationChange(id) {//屏幕旋转事件处理
        var len = $('ul.indicator[data-img-indicator="1"]').children('li').length;
        initCss($('#' + id), len);
        navItemCss();
    };
    //样式初始化
    function initCss(obj, len) {
        var scrollerWidth = len * window.innerWidth;
        obj.css('width', window.innerWidth + 'px');
        $('#scroller').css('width', scrollerWidth + 'px');
        $('#scroller').children('ul').children('li').css('width', window.innerWidth + 'px').children('img').each(function () { resizeImages(this, window.innerWidth, (window.innerHeight - 80)); });
        $('ul.indicator[data-img-indicator="1"]').children('li').children('img').each(function () { resizeImages(this, 80, 80); });//小图片
    }
})(jQuery, this);