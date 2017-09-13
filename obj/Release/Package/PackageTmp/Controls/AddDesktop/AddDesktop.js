
/*陈毅,2014.12.17 */
/*添加到主屏的提示*/
/*Question:IOS7一下的分享图标不对，同时在使用时需要替换logoIcon图片*/
//Usage:$('#selecter').addDesktop();
//PS:selecter最好是body下面的第一个div ID ，方便理解，当然别的ID也可以
(function ($, window, undefined) {
    function closeclick_phone() {
        document.getElementById('addDesktop_iphone').style.display = 'none';
    }
    $.fn.addDesktop = function () {
        var _ua = window.navigator.userAgent;
        var _OSVersion = _ua.match(/(OS|Android) (\d+[_\.]\d+)/);
        _OSVersion = _OSVersion && _OSVersion[2] ? +_OSVersion[2].replace('_', '.') : 6;
        _OSVersion = _OSVersion >= 7 ? 7 : _OSVersion >= 6 ? 6 : 5;
        if (isIphone()) {
            this.append($(_iphoneHtml).html(String.format(_tipPanel, _OSVersion)));
            if (navigator.standalone) {
                $('#addDesktop_iphone').css('display', 'none');
            }
            else {
                $('#addDesktop_iphone').css('display', 'block');
                $('#addDesktop_iphone').children('div.tipPanel').children('div.btnClose').on('click', function () { document.getElementById('addDesktop_iphone').style.display = 'none'; });
            }
        }
        if (isIpad()) {
            this.append($(_ipadHtml).html(String.format(_tipPanel, _OSVersion)));
            if (navigator.standalone) {
                $('#addDesktop_ipad').css('display', 'none');
            }
            else {
                $('#addDesktop_ipad').css('display', 'block');
                $('#addDesktop_ipad').children('div.tipPanel').children('div.btnClose').on('click', function () { document.getElementById('addDesktop_ipad').style.display = 'none'; });
            }
        }

    }
    var _iphoneHtml = '<div class="addDesktop_iphone" id="addDesktop_iphone"></div>';
    var _ipadHtml = '<div class="addDesktop_ipad" id="addDesktop_ipad" ></div>';
    var _tipPanel = '<div class="tipPanel"><div class="webApp"></div><div class="tipCon">先点击<span class="ico_adddesktop_ios{0}"style=""id="ico_adddesktop_ios7_phone"></span><br>再选择"添加到主屏幕"</div><div class="btnClose"><span class="popCls"></span></div></div>';


    //var desktopHtml = '<div class="addDesktop_iphone" id="addDesktop_iphone"><div class="tipPanel"><div class="webApp"></div><div class="tipCon">先点击<span class="ico_adddesktop_ios7" style="" id="ico_adddesktop_ios7_phone"></span><br>再选择"添加到主屏幕"</div><div class="btnClose" onclick="closeclick_phone()"><span class="popCls"></span></div></div></div><div id="addDesktop_ipad"><div class="tipPanel"><div class="webApp"></div><div class="tipCon">先点击<span class="ico_adddesktop_ios7" style="" id="ico_adddesktop_ios7_phone"></span><br>再选择"添加到主屏幕"</div><div class="btnClose" onclick="closeclick_phone()"><span class="popCls"></span></div></div></div>';
})(jQuery, this);

