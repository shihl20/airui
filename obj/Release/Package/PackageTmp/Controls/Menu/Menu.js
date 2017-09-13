/*陈毅*/
/*2014-03-20*/
/*功能导航*/
var menu = {};
(function () {
    function listNodes() {
        var object;
        //设置对象
        var setObject = function () {

            object = $('ul[data-gd-menu="1"]');
            if (object.length < 1) {
                return false;
            }
            return true;
        };
        //设置居中
        this.setMiddle = function () {
            if (!setObject()) {
                return;
            }
            var node = object.children().first();
            //todo:测试Android
            //alert("left:" + object.css('padding-left') + "right:" + object.css('padding-right'));
            var nodeWidth = node.css("width").replace("px", "");
            var marginWidth = node.css("margin-left").replace("px", "");
            nodeWidth = marginWidth * 2 + parseInt(nodeWidth);
            var totalWidth = object.css("width").replace("px", "");
            var count = totalWidth / nodeWidth;
            var laveWidth = totalWidth - parseInt(count) * nodeWidth;//剩余宽度
            object.css("padding-left", laveWidth / 2 + "px");
            //object.css("padding-right", laveWidth / 2 + "px");
            object.children().first().addClass("gd-menu-li-first");
            object.children().last().addClass("gd-menu-li-last");
            //alert("left:" + object.css('padding-left') + "right:" + object.css('padding-right'));
        };
        //刷新
        this.refresh = function () {
            if (!setObject()) {
                return;
            }
            if (object.children().length < 1) {
                return;
            }

            object.children().each(function (i, n) {
                fill(n);
                $(n).on("click", { "obj": n }, function (event) {
                    var url = $(event.data.obj).attr("data-gd-link");
                    if (url == "" || url == undefined) {
                        global.exceptionHandler('功能正在开发中...');
                        return;
                    }
                    setSessionStorage(n);
                    global.loadPageByGetMethod(url);
                });
                $(n).on("touchstart", { "obj": n }, function (event) {
                    //暂时没用，以后可来计时，处理“长按”事件（在touchend 中处理）
                    //alert("touchend" + event.data.obj);
                    //var url = $(event.data.obj).attr("data-gd-link");
                });

            });
            object.addClass("gd-menu-ul").css("margin-top", this.config.marginTop)
            .children().addClass("gd-menu-li")
            .children("div").addClass("gd-menu-li-div")
            .next("p").addClass("gd-menu-li-p");
            //设置居中
            this.setMiddle();
        };
        //初始化
        this.addItem = function (options) {
            if (!setObject()) {
                return;
            }
            $.extend(this.config, options);

            if (this.config.data != null && this.config.data != "") {
                object.html(create(this.config));
            }
            this.refresh();
        };
        //配置
        this.config = {
            data: null,
            marginTop: "0px"
        };
        //默认值
        //var navigDefault = {
        //    data: null,
        //    marginTop: "40px",
        //};
        //创建Li格式
        var create = function (params) {
            var data = params.data;
            var htmlLi = "";
            $(data).each(function (i, n) {
                htmlLi += String.format(
                    "<li data-gd-id=\"{0}\" " +
                    "data-gd-icon=\"{1}\"" +
                    " data-gd-link=\"{2}\">{3}</li>",
                    n.MenuId, n.PicPath, n.ClassName, n.MenuName);
            });
            return htmlLi;
        };
        //填充Li标签中的内容
        var fill = function (params) {
            params = $(params);
            if (params.attr("data-gd-icon") == null || params.attr("data-gd-icon") == "undefined") {
                params.attr("data-gd-icon", "default-menu-icon");
            }
            var strHtml = String.format(
                '<div class="{0}"></div><p>{1}</p>',
                params.attr("data-gd-icon"),
                params.text());

            params.html(strHtml);
        };
        //存储SessionStorage
        var setSessionStorage = function (obj) {
            if ($(obj).attr("data-gd-id") != null && $(obj).attr("data-gd-id") != "undefined") {
                sessionStorage.setItem("MenuId", $(obj).attr("data-gd-id"));
            }
        };
        this.reset = function () {
            if (!setObject()) {
                return;
            }
            this.setMiddle();
        };
    }
    menu = new listNodes();
})();
/*陈毅*/
/*2014-05-06*/
/*菜单权限前端存储*/
var menusDB = {};
(function () {
    function sqliteHandler() {
        //todo:菜单数据的更新和删除没写，每次创建菜单数据库是，都会把原有的数据表删除重新创建
        var db;
        //打开连接
        var openDb = function () {
            db = openDatabase("usermenulist", "1.0", "用户权限菜单", 1024000);
            if (!db) {
                global.exceptionHandler("openDatabase本地数据库出错");
                return false;
            }
            return true;
        };
        //创建Table
        this.createTable = function (data) {
            if (!openDb()) {
                return;
            }
            var sql = "SELECT count(*) as CNT FROM sqlite_master where type='table' and name='usermenulist'";
            db.transaction(function (tx) {
                tx.executeSql(sql, [], function (tx, result) {
                    var i = result.rows.item(0)['CNT'];
                    if (i > 0) {
                        tx.executeSql("drop table usermenulist", [], null, errorMethod);
                    }
                    tx.executeSql(
            "CREATE TABLE IF NOT EXISTS usermenulist (MenuId text, MenuName text,SoftwareId text,UserId text,PicPath text,ClassName text)",
            [],
            function (tx, result) {
                tableAddRow(tx, data);
            },
           errorMethod
           );
                }, errorMethod);

            });
        };
        //错误处理
        var errorMethod = function (tx, error) {

            global.exceptionHandler("本地数据库出错" + error.message);
        };
        //添加记录
        var tableAddRow = function (tx, data) {
            var values = String.format('SELECT "{0}","{1}","{2}","{3}","{4}","{5}"',
                data[0].MenuId, data[0].MenuName, data[0].SoftwareId, data[0].UserId, data[0].PicPath, data[0].ClassName);
            for (var i = 1; i < $(data).length; i++) {
                values += String.format('UNION ALL SELECT "{0}","{1}","{2}","{3}","{4}","{5}"',
                    data[i].MenuId, data[i].MenuName, data[i].SoftwareId, data[i].UserId, data[i].PicPath, data[i].ClassName);
            }
            tx.executeSql('insert into usermenulist (MenuId,MenuName,SoftwareId,UserId,PicPath,ClassName)' + values,
                [],
                function () {
                },
                function (tx, error) {
                    global.exceptionHandler('添加usermenulist表数据失败:' + error.message);
                });

        };
        //添加菜单
        this.addMenuRecord = function (data) {
            if (!openDb()) {
                return;
            }
            db.transaction(function (tx) {
                tableAddRow(tx, data);
            });
        };
        //查询菜单
        this.menuQuery = function (pId, len, callback) {
            if (!openDb()) {
                return;
            }
            db.transaction(function (tx) {
                var sql = "select * from usermenulist where MenuId like ?||'%' and LENGTH(MenuId)=?";
                tx.executeSql(sql, [pId, parseInt(len)], function (tx, result) {

                    var menuArry = new Array();


                    var rows = result.rows;
                    for (var i = 0; i < rows.length; i++) {
                        //菜单实体
                        var menuModel = {
                            ClassName: rows.item(i)['ClassName'],
                            MenuId: rows.item(i)['MenuId'],
                            MenuName: rows.item(i)['MenuName'],
                            PicPath: rows.item(i)['PicPath'],
                            SoftwareId: rows.item(i)['SoftwareId'],
                            UserId: rows.item(i)['UserId']
                        };
                        menuArry.push(menuModel);
                    }
                    callback(menuArry);
                }, errorMethod);
            });
        };

    }
    menusDB = new sqliteHandler();
})();

$(document).ready(function () {
    //var tse = [{ id: "123", name: "测试导航图", icon: "navig-icon-test", url: "#" }, { id: "23", name: "测试导航图", icon: "navig-icon-test", url: "1231" }, { id: "1wq23", name: "测试导航图", icon: "navig-icon-test", url: "#/123" }];
    //Navigation.Initial($navig, { data: tse });
    //debugger
    //menu.refresh();
});
//切换业务
function changePage(url) {
    //重置页面无刷新返回标识
    sessionStorage.setItem('noRefresh', false);
    global.loadPageByGetMethod(url)
}
//注销
function logout() {
    global.loadPageByGetMethod("login.html");
}
//生成主菜单
function createMenus(nowMenuId) {
    var mainMenus = JSON.parse(sessionStorage.getItem("mainMenus"));
    //先清空主菜单再注入
    $('#mainMenu').html('');
    var EmployeeName = sessionStorage.getItem("EmployeeName");
    var UserIcoPath = sessionStorage.getItem("UserIcoPath");
    if (mainMenus != undefined && mainMenus != null) {
        $(mainMenus).each(function (i, n) {
            if (nowMenuId == n.MenuId) {
                $('#mainMenu').append(String.format('<div><div class="menuSelectLeft" onclick="changePage(\'{0}\')">{1}</div><div class="menuSelectRight" onclick="changePage(\'{0}\')"></div></div>', n.ClassName, n.MenuName));
            }
            else {
                $('#mainMenu').append(String.format('<div class="menuLeft" {0} onclick="changePage(\'{1}\')">{2}</div>', i == 0 ? '' : 'style="border-top:0px"', n.ClassName, n.MenuName));
            }
        });
        $('#mainMenu').append('<div class="menuLeft" style="border-top:0px" onclick="logout()">注销登录</div>');

    }
    $('#userHeard').html('');
    $('#userHeard').append(String.format('<img src="{0}" />{1}', UserIcoPath == 'null' ? 'Images/userhead40x40.png' : UserIcoPath, replaceNull(EmployeeName)));
};
