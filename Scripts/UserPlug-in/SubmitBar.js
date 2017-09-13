/*陈毅,2014.11.18*/

//description:用于有审批功能的页面，在页脚处添加“提交”、“打回”按钮。
//Usage:$(selecter).submitBar({
//              handler: function (submitType) { },//按钮事件的处理方法，让调用者自己处理,如果为空（submitData、linkUrl必须有值），
//              isDisplay: false,//是否显示
//              submitData: [],//提交的数据
//              linkUrl: ''//跳转跳转到处理页面的url
//});
(function ($, window, undefined) {
    $.fn.submitBar = function (options) {
        _config = $.extend({}, defaultConfig, options);
        $this = $(this);
        createFoot();
        //$this.append(submitBarHtml);

        if (_config.isDisplay) {
            $this.show();
        }
        else {
            $this.hide();
        }
        return this;
    };
    function approval() {
        var $obj = $(this);
        var submitType = $obj.attr('data-link');
        sessionStorage.setItem('submitType', submitType);//在信息处理页面获取，用于判断提交方式
        var curUrl = global.pages.getLastPage();
        //设置返回地址
        global.setBackUrl(curUrl, 'true'/*true表示需缓存当前页*/);
        _config.handler(submitType, $obj);
    };
    var $this = null;
    var _config = null;
    //Html标签(样式统一，在系统中没有用)
    var submitBarHtml = function () {
        var html = '<div data-role="navbar" data-iconpos="left" id="submitBar" style="display: none;"><ul><li><button data-icon="check" data-theme="d" id="submitPass" data-submittype="1" >提交</button></li><li><button data-icon="delete" data-theme="b" id="submitSendback" data-submittype="-1" >打回</button></li></ul></div>';
        return html;
    }
    //外部扩展
    var defaultConfig = {
        handler: function (submitType, $obj) {
            _defaultApproval(submitType, $obj)
        },//按钮事件的处理方法
        isDisplay: true,//是否显示
        submitData: [],//提交的数据
        linkUrl: 'Pages/NetSign/Common/ApprovalOperation.html'//跳转的页面
    };
    //默认的审批页面
    var _defaultApproval = function (submitType, obj) {
        sessionStorage.setItem('submitModels', _config.submitData.join("\\\\"));
        //todo:跳转至网签的审批页面（公用）
        global.loadPageByGetMethod(_config.linkUrl);
    };
    //生成提交页脚
    function createFoot() {
        htmlHelper.foot.clear();
        htmlHelper.foot.addNavBar(['1', 'submit.png', '提交', 'left']);
        htmlHelper.foot.addNavBar(['2', 'trunback.png', '打回', 'left']);
        $('#foot').html(htmlHelper.foot.get());
        $('#foot').children('div.footer').children('div.bar').on('click', approval);
    }

})(jQuery, this);