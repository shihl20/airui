var finishLogin = false;
$(document).ready(function () {
    //窗口大小改变事件
    window.onresize = function () {
        reSetDetailSize();
    }
    //移除jqm默认加载层
    $('.ui-loader').remove();
    //清楚所有的本地Session
    sessionStorage.clear();
    //提示用户添加到主屏
    $("#main").addDesktop();
    var loginName = localStorage.getItem("LoginName");
    var savePsd = localStorage.getItem("PassWord");
    var saveLoginName = localStorage.getItem("saveLoginName");
    if (loginName != null) {
        $('#username').val(loginName);
        $('#password').val(savePsd);
        if (saveLoginName == "checked") {
            $("#saveLoginName").attr("checked", true);
        }
        else {
            $("#saveLoginName").attr("checked", false);
        }
    }

    $('#saveLoginName').click(function () {
        if ($('#saveLoginName').attr('checked')) {
            $('#saveLoginName').attr('checked', false);
        } else {
            $('#saveLoginName').attr('checked', 'checked');
        }
    });
    //设置返回地址为空
    sessionStorage.setItem("backUrl", "");
    //如果是Android系统，显示APK下载链接
    if (navigator.userAgent.toLowerCase().match(/android/i) == "android") {
        $('#downloadUrl').css('display', 'block');
    }
    $('#loginBtn').click(function () {
        login();
    });
});
//Android自动登录
function androidLogin() {
    if ($('#saveLoginName').attr('checked') && $('#username').val() != '' && $('#password').val() != '' && !finishLogin) {
        finishLogin = true;
        login();
    }
}
//Android忘记手势密码验证通过后，重置保存的用户密码
function reSetLocalStorage(loginName, passWord, md5Psw) {
    localStorage.setItem("LoginName", loginName);
    localStorage.setItem("PassWord", passWord);
    localStorage.setItem("saveLoginName", "checked");
    if (loginName != null) {
        $('#username').val(loginName);
        $('#password').val(passWord);
        $("input[type=checkbox]").checkboxradio();
        $("#saveLoginName").attr("checked", true).checkboxradio("refresh");
    }
}
//Android忘记手势密码
function forgetHandPsd(loginName, passWord) {
    var data = String.format('{ "userLoginName": "{0}" }', loginName);
    $.ajax({
        type: "POST",
        contentType: "application/json;", //WebService 会返回Json类型
        url: String.format("{0}WebServices/HandlerService.asmx/{1}",
            global.getRootPath(), "GetLoginToken"),
        data: data,
        dataType: "json",
        error: function (msg) {
            message.closeLoading();
            global.webServiceExceptionHandler(msg);
        },
        success: function (result) {
            var data = String.format(
               '{ "loginName": "{0}", "passWord": "{1}", "token": "{2}","machineInfo":"{3}"  }', loginName, passWord, result.d, navigator.userAgent);
            $.ajax({
                type: "POST",
                contentType: "application/json;", //WebService 会返回Json类型
                url: String.format("{0}WebServices/HandlerService.asmx/{1}",
                    global.getRootPath(), "LoginValidation"),
                data: data,
                dataType: "json",
                error: function (msg) {
                    alert("failed");
                },
                success: function (result) {
                    var userInfoAttr = JSON.parse(result.d);
                    if (userInfoAttr.UserId == undefined) {
                        alert(result.d);
                        return;
                    }
                    if (result.d == "" || result.d == loginName) {
                        alert('用户不存在');
                        return;
                    }
                    if (result.d == "" || result.d == passWord) {
                        alert('密码错误');
                        return;
                    }

                    if (result.d == "-1") {
                        alert('用户名不能为空');
                        return;
                    }
                    if (result.d == "-2") {
                        alert('密码不能为空');
                        return;
                    }
                    alert("success");
                }
            });
        }
    });
}
//登录
function login(i) {
    if ($('#username').val() == '') {
        $.alert("用户名不能为空");
        $('#username')[0].focus();
        return;
    }
    if ($('#password').val() == '') {
        $.alert("密码不能为空");
        $('#password')[0].focus();
        return;
    }
    var data = String.format(
               '{ "userLoginName": "{0}" }', $('#username').val());
    //message.showLoading('身份验证中');
    vaildUser();
    //$.ajax({
    //    type: "POST",
    //    contentType: "application/json;", //WebService 会返回Json类型
    //    url: String.format("{0}WebServices/HandlerService.asmx/{1}",
    //        global.getRootPath(), "GetLoginToken"),
    //    data: data,
    //    dataType: "json",
    //    error: function (msg) {
    //        message.closeLoading();
    //        global.webServiceExceptionHandler(msg);
    //    },
    //    success: function (result) {
    //        vaildUser(result.d);
    //    }
    //});
};
//验证用户
function vaildUser() {
    var data = String.format(
               '{ "loginName": "{0}", "passWord": "{1}","machineInfo":"{2}"  }', $('#username').val(), hex_md5($('#username').val() + $('#password').val()), navigator.userAgent);
    var urlpara = String.format(
               '?loginName={0}&passWord={1}&machineInfo=123', $('#username').val(), hex_md5($('#username').val() + $('#password').val()));
    $.ajax({
        type: "POST",
        contentType: "application/json", //WebService 会返回Json类型
        url: global.getRootPath() + "HandlerService.asmx/LoginValidation",
        data: data,
        dataType: "json",
        error: function (msg) {
            global.webServiceExceptionHandler(msg);
        },
        success: function (result) {
            //message.closeLoading();
            callback(result);
        }
    });
}
//改变用户名时，清空密码
function ClearPsw() {
    $('#password').val("");
}
function callback(result) {
    var userInfoAttr = JSON.parse(result.d);
    if (userInfoAttr.UserId == undefined) {
        message.setMessage(result.d);
        return;
    }
    sessionStorage.setItem("userAttr", result.d);
    if ($("#saveLoginName").attr("checked")) {
        localStorage.setItem("LoginName", $('#username').val());
        localStorage.setItem("PassWord", $('#password').val());
        localStorage.setItem("saveLoginName", "checked");
    } else {
        localStorage.removeItem("PassWord");
        localStorage.removeItem("saveLoginName");
        $('#password').val("");
    }
    sessionStorage.setItem("UserId", userInfoAttr.UserId);
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //如果是Android系统，显示APK下载链接
    //if (isAndroid || isiOS) {
    $('#downloadUrl').css('display', 'block');
    //获取当前设备单个字体宽度并保存
    htmlHelper.sizeHelp.setLenth();
    if (userInfoAttr.UserType == "1") {
        global.loadPageByGetMethod("Pages/LianXi/Index.html");
    }
    else {
        global.loadPageByGetMethod("Pages/Teacher/MyStudent.html");
    }
    //}
    //    //如果不是移动终端 则打开欢迎页面
    //else {
    //    window.location.href = 'welcome.html';
    //}
}