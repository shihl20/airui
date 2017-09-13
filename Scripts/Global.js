// javascript 全局异常处理
window.onerror = function (message, url, line, columnNumber, errorObj) {
    var e = {
        Message: message,
        Line: line,
        Url: url,
        ColumnNumber: columnNumber,
        ErrorObj: errorObj
    };
    // todo:如果在一段代码中,发生了多次异常,该方法会被调用多次,完善每次的异常记录和显示
    global.javaScriptExceptionHandler("JavaScript脚本异常", e);
    // 返回ture则不在浏览器中显示错误,返回false在浏览器中显示错误
    return false;
};
var chatInterval;//记录聊天页面定时器ID
var global = {};
(function () {
    function handler() {
        var object;
        this.getQueryStr = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
        // 页面常规错误处理方法
        this.exceptionHandler = function (message, e) {
            sessionStorage.setItem('CommonErrorMessage', message);
            this.errorPageLoad('CommonError.html');
            //this.writLog(message);
        };

        // web服务异常处理方法
        this.webServiceExceptionHandler = function (message) {
            var e = JSON.parse(message.responseText);
            message = String.format('<h3>{0}</h3>' +
                '<ul >' +
                '<li><label>异常信息:</label>{1}<li>' +
                '<li><label>异常类型:</label>{2}<li>' +
                '<li><label>堆栈追踪:</label>{3}<li>' +
                '</ul>', 'Web服务异常',
                e.Message, e.ExceptionType, e.StackTrace);
            sessionStorage.setItem('ServiceErrorMessage', message);
            this.errorPageLoad('ServiceError.html');
            this.writLog('web服务异常:' + e.Message);
        };

        //js异常处理方法
        this.javaScriptExceptionHandler = function (message, e) {
            message = String.format('<h3>{0}</h3>' +
                '<ul class="systemError">' +
                '<li><label>异常文件:</label>{1}<li>' +
                '<li><label>异常位置:</label>第{2}行<li>' +
                '<li><label>详细信息:</label>{3}<li>' +
                '</ul>', message,
                e.Url, e.Line, e.Message);
            sessionStorage.setItem('SystemErrorMessage', message);
            logMessage = e.Url + e.Line + e.Message;
            this.writLog('js异常:' + logMessage);
            this.errorPageLoad('SystemError.html');

        };
        this.writLog = function (errMsg) {
            var data = { errMsg: errMsg };
            $.ajax({
                type: "POST",
                contentType: "application/x-www-form-urlencoded", //WebService 会返回Json类型
                url: String.format("{0}/HandlerService.asmx/{1}",
                    global.getRootPath(), "WritErrorLog"),
                data: data,
                dataType: "json",
                error: function (msg) {
                },
                success: function (result) {
                }
            });
        }
        // 查询的数据不存在
        this.DataNotFoundPage = function (message) {
            sessionStorage.setItem('DataNotFoundMessage', message);
            this.errorPageLoad('DataNotFound.html');
        };

        //获取网站路径以及虚拟目录
        this.getRootPath = function () {
            //return "http://app.cqeduction.com:82/";
            return "http://192.168.1.115/sl/";
            var strFullPath = window.document.location.href;
            var strPath = window.document.location.pathname;
            var pos = strFullPath.indexOf(strPath);
            var prePath = strFullPath.substring(0, pos);
            var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 2);
            return (prePath + postPath);
        };
        this.getCmsRootPath = function () {
            //return "http://app.cqeduction.com:81/";
            return "http://192.168.1.115/sl/";
        };
        //获取网站路径
        this.getPath = function () {
            var presentpath = window.location.pathname;
            var completeUrl = window.location.href;
            return completeUrl.replace(presentpath, '') + "/";
        };

        // 类名（必须）,方法名称（必须）,参数（必须，多个参数之间用“|”分隔）,回调函数（可缺省）
        this.invokeHandlerMethod = function (className, method, parameters, callback, questFrom) {
            var assembly = "Handler"; //命名空间
            var handlerMethod = "HandlerFactory";
            var userInfoAttr = sessionStorage.getItem('userAttr');
            if (userInfoAttr == null || userInfoAttr == undefined) {
                message.setMessage("登录超时!");
                setTimeout(function () { window.location.href = "login.html"; }, 2000);
                return;
            }
            var logintUserInfo = JSON.parse(userInfoAttr);
            var data = { asb: assembly, cls: className, mth: method, param: parameters, userId: logintUserInfo.UserId, loginTime: logintUserInfo.LastLoginTime }
            //assembly, className, method, parameters, logintUserInfo.UserId, logintUserInfo.LastLoginTime);
            //var data = String.format(
            //    '{ "asb": "{0}", "cls": "{1}", "mth":"{2}","param":"{3}","userId":"{4}","loginTime":"{5}"}',
            //    assembly, className, method, parameters, logintUserInfo.UserId, logintUserInfo.LastLoginTime);
            //var data = String.format(
            //    '{ asb: {0}, cls: {1}, mth:{2},param:{3},userId:{4},loginTime:{5},token:{6} }',
            //    assembly, className, method, parameters, logintUserInfo.UserId, logintUserInfo.LoginTime, logintUserInfo.TokenCode);

            $.ajax({
                type: "POST",
                contentType: "application/json", //WebService 会返回Json类型
                //url: String.format("{0}WebServices/CommonHandler.ashx", this.getRootPath()),
                url: String.format("{0}HandlerService.asmx/HandlerFactory", this.getRootPath()),
                timeout: 30000,
                data: JSON.stringify(data),
                dataType: "json",
                error: function (message) {
                    global.webServiceExceptionHandler(message);
                },
                success: function (result) {
                    if (!result.d) {
                        result = { d: JSON.stringify(result) };
                    }
                    if (result.d && result.d.indexOf('提示信息：') == 0) {
                        if (questFrom == null) {
                            message.setMessage(result.d.substring(5));
                            message.closeLoading();
                            setTimeout(function () { window.location.href = "login.html" }, 2000);
                            return null;
                        }
                        else {
                            message.setMessage(result.d.substring(5));
                            message.closeLoading();
                            return null;
                        }
                    }
                    if (!String.IsNullOrEmpty(callback)) {
                        //todo:商讨，返回数据为空时，应该是返回调用页面去处理，暂时注释掉了
                        //if (result.d == '[]' || result.d == 'null') {
                        //    global.DataNotFoundPage('对不起,您所查询的数据不存在...');
                        //    return null;
                        //}
                        callback(result);
                        return null;
                    }

                    return result;
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        message.setMessage("访问超时！");
                    }
                }
            });
        };

        // 调用Handler层方法,不传入参数
        this.invokeHandlerMethodNoParams = function (className, method, callback) {
            this.invokeHandlerMethod(className, method, "null", callback);
        };

        // 加载页面
        this.loadPageByGdLink = function (element) {
            var url = $(obj).attr("data-gd-link");
            if (url != null && url != "#") {
                //$("body").append("<div id=\"loading\"><img src=\"Css/Themes/Default/Images/ajax-loader.gif\" /></div>");
                this.loadPageByGetMethod(url);

            }
        };

        // 延迟数据样式
        this.refreshDelayStyle = function () {
            // tab.refresh();
        };

        // 显示时间选取控件,如标签<input id="beginTime" />,则传入beginTime
        this.showDatePicker = function (element) {
            $(element).mobiscroll().date({
                theme: 'ios',
                lang: 'zh',
                display: 'bottom',
                dateOrder: 'yyyymmdd',
                dateFormat: 'yyyy-mm-dd',
                mode: 'scroller',
                animate: 'fade',
                startYear: 2000,
                endYear: 2050
            });
        };

        // 显示带[时,分]选择的时间选取控件
        this.showDateTimePicker = function (element) {
            $(element).mobiscroll().datetime({
                theme: 'ios',
                lang: 'zh',
                display: 'bottom',
                dateOrder: 'yyyymmdd',
                dateFormat: 'yyyy-mm-dd',
                mode: 'scroller',
                animate: 'fade',
                startYear: 2000,
                endYear: 2050
            });
        };

        // 过滤页面的表达式
        // todo:表达式需要优化，需要过滤掉标签中的空格 
        //result:加上(\w*|\W*|\s*|\S*|\0*)可以过滤掉空格，匹配的数组变了html[2]
        var regular = /(?:<div[\w\W]+data-role="page" id="main">)([\w\W]+)(?:<\/div>)/;
        // 读取页面方法
        this.loadPage = function (requestMethod, container, url, params, callback) {
            //清理聊天页面定时器
            if (chatInterval) {
                clearInterval(chatInterval);
            }
            var urlCopy = url;
            //验证登录
            var userId = sessionStorage.getItem("UserId");
            if (userId == null) {
                message.setMessage("请登录");
                setTimeout(function () {
                    location.href = 'Login.html';
                }, 1000);
                return;
            }
            //$("#main").gdLoading('show');//加载页面等待
            ////todo:页面缓存
            //pageWebDb.createTable();
            //pageWebDb.insertRecord(urlCopy, "test", $(container).html());
            //this.loadingShow(container);
            if (url.indexOf('?') < 0) {
                url += "?t=" + Math.random();
            } else {
                url += "&t=" + Math.random();
            }
            $.ajax({
                type: requestMethod,
                timeout: 30000,
                url: url,
                data: params,
                success: function (html) {
                    html = regular.exec(html);
                    if (html == null) {
                        global.exceptionHandler('目标页面可能未添加data-role="page"标签!');
                        return;
                    }
                    html = html[1];
                    if (callback != null && callback != undefined) {
                        $('#' + container).html('');
                        $('#' + container).append(html);
                        callback(container);
                    }
                    else {
                        $('#' + container).html('');
                        $('#' + container).append(html);
                    }
                    //刷新样式  
                    //$.mobile.pageContainer.trigger("create");
                    //重新计算page的最小高度
                    //$.mobile.resetActivePageHeight();

                    // 将页面地址记录到全局列表
                    if (urlCopy.indexOf("DataNotFound") >= 0) {
                        return;
                    }
                    if (urlCopy.indexOf("CommonError") >= 0) {
                        return;
                    }
                    if (urlCopy.indexOf("ServiceError") >= 0) {
                        return;
                    }
                    if (urlCopy.indexOf("SystemError") >= 0) {
                        return;
                    }
                    global.pages.addPage(urlCopy);
                },
                error: function (result) {
                    global.exceptionHandler("页面加载失败!", result);
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        message.setMessage("访问超时！");
                    }
                }
            });
        };
        //错误信息页面加载不用验证身份是否登录
        this.errorPageLoad = function (url, callback) {
            var container = 'main';
            //this.loadingShow('body');
            if (url.indexOf('?') < 0) {
                url += "?t=" + Math.random();
            } else {
                url += "&t=" + Math.random();
            }
            $.ajax({
                type: 'GET',
                url: url,
                data: {},
                success: function (html) {
                    html = regular.exec(html);
                    if (html == null) {
                        global.exceptionHandler('目标页面可能未添加data-role="page"标签!');
                        return;
                    }
                    html = html[1];
                    if (callback != null && callback != undefined) {
                        $(container).html(html);
                        callback(container);
                    }
                    else {
                        $('#' + container).html(html);
                    }
                    //刷新样式  
                    //$.mobile.pageContainer.trigger("create");
                    // 设置页面通用样式
                    //global.refreshPageStyle();
                },
                error: function (result) {
                    global.exceptionHandler("页面加载失败!", result);
                }
            });

        };
        // 通过Get方式读取页面
        this.loadPageByGetMethod = function (url, callback) {
            this.loadPage("Get", 'main', url, null, callback);
        };

        // 通过Post方式读取页面
        this.loadPageByPostMethod = function (url, callback) {
            this.loadPage("Post", 'main', url, null, callback);
        };

        //加载数据显示Loading
        this.loadingShow = function (id) {
            id = id || "body";
            object = $(id);
            //object.attr("position", "relative");
            var temp;
            temp = $('<div id="loadingDiv" class="gd-loading-img"></div>');
            object.append(temp);
            object.show();
        };
        //隐藏Loading
        this.loadingHide = function () {
            $('#loadingDiv').hide();
        };

        // 对象克隆
        this.clone = function (obj) {
            var newobj, s;
            if (typeof obj !== 'object') {
                return null;
            }
            newobj = obj.constructor === Object ? {} : [];
            if (window.JSON) {
                s = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(s); //反系列化（还原）
            } else {
                if (newobj.constructor === Array) {
                    newobj.concat(obj);
                } else {
                    for (var i in obj) {
                        newobj[i] = obj[i];
                    }
                }
            }
            return newobj;
        };

        //设置返回地址 url:要返回的地址
        //             noRefresh:返回的时候不刷新，如为truez则保存当前conten内容,如不传，则只更改返回地址
        this.setBackUrl = function (url, noRefresh) {
            //缓存返回地址
            sessionStorage.setItem("backUrl", url);
            if (noRefresh != undefined && noRefresh != null) {
                //缓存是否缓存页面标记
                sessionStorage.setItem("noRefresh", noRefresh);
                if (noRefresh == 'true') {
                    //保存当前页内容
                    this.bakContent.set();
                    //缓存进度条位置
                    sessionStorage.setItem("scrollPos", myScroll.y);
                }
            }
        }
    }
    // 页面操作类,记录用户访问过的页面列表
    function pages() {
        var list = new Array();

        this.addPage = function (url) {
            list.push(url);
        };

        this.getLastPage = function () {
            return list[list.length - 1];
        };

        this.getLastButOnePage = function () {
            return list[list.length - 2];
        };

        //切换业务注册
        this.RegChangeBiz = function RegChangeBiz() {
            $('.weui-tabbar__item').click(function () {
                switch ($(this).attr('data-link')) {
                    case 'lianxi':
                        global.loadPageByGetMethod('Pages/lianxi/Index.html');
                        break;
                    case 'oneonone':
                        global.loadPageByGetMethod('Pages/oneonone/Index.html');
                        break;
                    case 'zhiyuan':
                        global.loadPageByGetMethod('Pages/zhiyuan/Index.html');
                        break;
                    case 'yikao':
                        global.loadPageByGetMethod('Pages/yikao/Index.html');
                        break;
                    case 'me':
                        global.loadPageByGetMethod('Pages/me/Index.html');
                        break;
                    case 'mystudent':
                        global.loadPageByGetMethod('Pages/Teacher/MyStudent.html');
                        break;
                    case 'tc':
                        global.loadPageByGetMethod('Pages/Teacher/MyCenter.html');
                        break;
                    case 'tcircle':
                        global.loadPageByGetMethod('Pages/Teacher/TCircle.html');
                        break;
                    case '':
                        break;
                    default:
                        submit($(this).attr('data-link'));
                        break;
                }
            })
        }

        //创建页脚 curNavBar当前导航栏 用于页脚间切换 值为1,2,3
        this.createFoot = function createFoot(curNavBar) {
            //htmlHelper.foot.setIconPosition('top');
            htmlHelper.foot.clear();
            htmlHelper.foot.addNavBar([curNavBar == '1' ? '' : 'lianxi', 'regbook.png?v=170708', '练习', '']);
            htmlHelper.foot.addNavBar([curNavBar == '2' ? '' : 'oneonone', 'oneonone.png?v=170708', '名师1对1', '']);
            htmlHelper.foot.addNavBar([curNavBar == '3' ? '' : 'yikao', 'yikao.png?v=170708', '艺考1对1', '']);
            htmlHelper.foot.addNavBar([curNavBar == '4' ? '' : 'zhiyuan', 'zhiyuan.png?v=170708', '志愿', '']);
            htmlHelper.foot.addNavBar([curNavBar == '5' ? '' : 'me', 'me.png?v=170708', '个人中心', '']);
            $('#foot').html(htmlHelper.foot.get(curNavBar));
            this.RegChangeBiz();
        };
        this.createTCFoot = function createTCFoot(curNavBar) {
            //htmlHelper.foot.setIconPosition('top');
            htmlHelper.foot.clear();
            htmlHelper.foot.addNavBar([curNavBar == '1' ? '' : 'mystudent', 'mystudent.png?v=170708', '学生1对1', '']);
            htmlHelper.foot.addNavBar([curNavBar == '2' ? '' : 'tcircle', 'tcircle.png?v=170708', '教师圈', '']);

            htmlHelper.foot.addNavBar([curNavBar == '3' ? '' : 'tc', 'tc.png?v=170708', '个人中心', '']);
            $('#foot').html(htmlHelper.foot.get(curNavBar));
            this.RegChangeBiz();
        };

        this.initPage = function initPage() {
            $(".ui-content").height($(window).height() - 97);
        };
    };
    // 基础数据操作类
    function baseData() {

        // 获取多选列表中项的值
        this.getMultiSelectValues = function (id) {
            return this.getSelectValues(id, 'multi');
        };

        // 获取单选列表中项的值
        this.getSingleSelectValue = function (id) {
            return this.getSelectValues(id, 'single');
        };

        this.getSelectValues = function (id, type) {
            var selectValues = "";
            var filter;
            id = '#gd-select-list-' + id;

            switch (type) {
                case 'multi':
                    filter = 'input:checkbox:checked';
                    break;
                case 'single':
                    filter = 'input:radio:checked';
                    break;
                default:
                    throw new Error('未知的多选类型');
            }

            $(id).find(filter).each(function (index, value) {
                if (index == 0) {
                    selectValues += $(this).attr('id');
                    return;
                }
                selectValues += ',' + $(this).attr('id');
            });

            return selectValues;
        };

    }

    //缓存页面内容操作类
    function bakContent() {
        var bakContentHtml = '';
        //初始化无刷新返回为false
        sessionStorage.setItem("noRefresh", "false");
        this.set = function () {
            //重置bakDiv
            bakContent = '';
            //设置是否无刷新返回为true
            sessionStorage.setItem("noRefresh", "true");
            bakContent = $('#content').html();
            sessionStorage.setItem('pullUpState', $('#pullUp').css('display'));
        };
        //填充保存层
        this.get = function () {
            $('#content').html('');
            $('#content').append(bakContent);
            //刷新样式  
            //$.mobile.pageContainer.trigger("create");
        }
        this.clear = function () {
            //设置是否返回为true
            sessionStorage.setItem("noRefresh", "false");
            bakContent = $('<div>');
        }
    };

    global = new handler();
    global.pages = new pages();
    global.baseData = new baseData();
    global.bakContent = new bakContent();
})();
