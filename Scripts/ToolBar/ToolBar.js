var toolBar = {};
(function () {
    function footBar() {
        //返回
        this.back = function (event) {
            var backUrl = sessionStorage.getItem("backUrl");
            global.loadPageByGetMethod(backUrl);
        }
        //用于在android 客户端，与物理“返回”键同步
        this.goBackClick = function () {
            var backUrl = sessionStorage.getItem("backUrl");
            if (sessionStorage.getItem('IsLoading') != 'true') {//不在加载的时候才回退
                if (backUrl == undefined || backUrl == '' || backUrl == null) {
                    alert("0");
                    return;
                }
                else {
                    alert("1");
                    global.loadPageByGetMethod(backUrl);
                    return;
                }
            }
        };
    };
    toolBar = new footBar();
}
)();
$('.back').click(function () {  
    toolBar.back();
});

$(document).click(function () {
    $('#rightMenu').hide();
});

//标签切换事件
function tabclick(tabObj) {
    $('.selecttab').attr("class", "tab");
    $(tabObj).attr("class", "selecttab");
    if ($(tabObj).attr("id") == "bizTab") {
        $('#content').css("display", "block");
        $('#flow').css("display", "none");
    }
        //流程标签点击事件
    else if ($(tabObj).attr("id") == "flowTab") {
        $('#floatTitle').css("display", "none");
        //添加流程内容
        if ($('#flow').html() == '') {
            flowShow();
        }
        $('#floatTitle').css("display", "none");
        $('#content').css("display", "none");
        $('#flow').css("display", "block");
    }
    else {
    }
    if (myScroll != undefined && navigator.userAgent.indexOf("MSIE") <= 0) {
        myScroll.refresh();
    }
}