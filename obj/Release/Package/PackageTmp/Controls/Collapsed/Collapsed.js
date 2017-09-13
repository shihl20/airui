function collapsedReg() {
    sessionStorage.setItem("needClosDiv", '');
    $('.closed .head').click(function () {
        if (checkClickTime()) {
            var parentDiv = $(this).parent();
            if ($(parentDiv).attr("class") == "open") {
                $(parentDiv).attr("class", "closed");
            }
            else {
                $(parentDiv).attr("class", "open");
                //重新计算详情布局
                reSetDetailSize();
                var clickFun = $(parentDiv).attr('data-function');
                if (clickFun != undefined && clickFun != '') {
                    window[clickFun]();
                }
            }
            if (navigator.userAgent.indexOf("MSIE") > 0) { }
            else {
                myScroll.refresh();
            }
            //IE下nicescroll刷新
            if ($("#content").getNiceScroll) {
                $("#content").getNiceScroll().resize();
            }
        }
    });
    $('.open .head').click(function () {
        if (checkClickTime()) {
            var parentDiv = $(this).parent();
            if ($(parentDiv).attr("class") == "open") {
                $(parentDiv).attr("class", "closed");
            }
            else {
                $(parentDiv).attr("class", "open");
                //重新计算详情布局
                reSetDetailSize();
                var clickFun = $(parentDiv).attr('data-function');
                if (clickFun != undefined && clickFun != '') {
                    window[clickFun]();
                }
            }
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                $("#content").getNiceScroll().resize();
                $(document).height();
            } else { myScroll.refresh(); }
            //IE下nicescroll刷新
            if ($("#content").getNiceScroll) {
                $("#content").getNiceScroll().resize();
            }
        }
    });
    $('#floatTitle').click(function () {
        if (checkClickTime(lastClickTime)) {
            var needClosDiv = sessionStorage.getItem("needClosDiv");
            $('#' + needClosDiv).attr("class", "closed");
            $('#floatTitle').css('display', 'none');
            if (navigator.userAgent.indexOf("MSIE") > 0) {

            } else { myScroll.refresh(); }
        }
    });
}