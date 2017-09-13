//creater:陈毅
//creatTime:2015.01.22
//todo:domim--站点参数还没处理好，主要是跨域问题。
var myCookie;
(function () {
    function cookieHandler() {
        //设置cookies
        //this.setCookie = function (name, value, time, path, domaim) {
        this.setCookie = function (name, value, time, path) {
            var Days = time == null ? 10 : time;
            path = path == null ? '/' : path;
            //domaim = domaim || '';
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            //if (domaim != '') {
            //    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path + ";domaim=" + domaim + ";secure=ture";
            //}
            //else {
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path;
            //}
        }
        //读取cookies
        this.getCookie = function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
        //删除cookies
        this.delCookie = function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 100);
            var cval = this.getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+";path=/";
        }
        //获取网站路径以及虚拟目录
        this.getRootPath = function () {
            var strFullPath = window.document.location.href;
            var strPath = window.document.location.pathname;
            var pos = strFullPath.indexOf(strPath);
            var prePath = strFullPath.substring(0, pos);
            var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 2);
            return (prePath + postPath);
        };

        //获取网站路径
        this.getPath = function () {
            var presentpath = window.location.pathname;
            var completeUrl = window.location.href;
            return completeUrl.replace(presentpath, '') + "/";
        };
    };
    myCookie = new cookieHandler();
})();