//todo:页面缓存的测试
var pageWebDb = {};
(function () {
    function pageDbHander() {
        var db;
        //打开数据库连接
        var openDb = function () {
            db = openDatabase("pagecache", "1.0", "页面缓存", 1024 * 1024);
            if (!db) {
                global.exceptionHandler("openDatabase本地数据库出错");
                return false;
            }
            return true;
        };
        //表是否存在
        var isTableExist = function () {
            if (!openDb()) {
                return;
            }
            var sql = "SELECT count(*) as CNT FROM sqlite_master where type='table' and name='pagecache'";
            db.transaction(function (tx) {
                tx.executeSql(sql, [], function (tx, result) {
                    var i = result.rows.item(0)['CNT'];

                    if (i > 0) {
                        return true;
                    }
                    return false;
                }, errorMethod);
            });
        };
        //创建表
        this.createTable = function () {
            if (!openDb()) {
                return;
            }
            db.transaction(function (tx) {
                var sql = "SELECT count(*) as CNT FROM sqlite_master where type='table' and name='pagecache'";
                tx.executeSql(sql, [], function (tx, result) {
                    var i = result.rows.item(0)['CNT'];
                    if (i > 0) {
                        tx.executeSql("drop table pagecache", [], null, errorMethod);
                    }
                    tx.executeSql(
                     "CREATE TABLE IF NOT EXISTS pagecache (pageUrl text,pageName text,pageHtml text)",
                     [],
                    null,
                     errorMethod);
                }, errorMethod);
            });
        };
        //添加记录
        this.insertRecord = function (pageUrl, pageName, content) {
            if (!openDb()) {
                return;
            }

            //var sql = "INSERT INTO pagecache values(?,?,?)";
            //db.transaction(function (tx) {
            //    tx.executeSql(sql, [pageUrl, pageName, content], null, errorMethod);
            //});
            db.transaction(function (tx) {
                var sql = "SELECT count(*) as CNT FROM sqlite_master where type='table' and name='pagecache'";
                tx.executeSql(sql, [], function (tx, result) {
                    
                    var i = result.rows.item(0)['CNT'];
                    if (i > 0) {
                        var newsql = "INSERT INTO pagecache values(?,?,?)";
                        tx.executeSql(newsql, [pageUrl, pageName, content], null, errorMethod);
                    }
                }, null);


            });

        };
        //查询记录
        this.selectRecord = function (callback) {
            if (!openDb()) {
                return;
            }
            var sql = "SELECT pageHtml from pagecache where pageUrl='Pages/Index.html'";

            db.transaction(function (tx) {
                tx.executeSql(sql, [], function (tx, result) {
                    
                    callback(result.rows.item(0)["pageHtml"]);
                }, errorMethod);
            });
        };
        //更新记录
        this.updateRecord = function () {
        };
        //错误处理
        var errorMethod = function (tx, error) {

            global.exceptionHandler("本地数据库出错" + error.message);
        };
    }
    pageWebDb = new pageDbHander();

})();

//todo:页面数据缓存
var pageDataCache = {};
(function () {
    function pagedataCacheHandler() {
        var db;
        //创建连接
        var openDb = function () {
            db = openDatabase("pagecache", "1.0", "页面数据缓存", 1024 * 1024);
            if (!db) {
                global.exceptionHandler("openDatabase本地数据库出错");
                return false;
            }
            return true;
        };
        //表是否存在
        var isTableExist = function (tx, callback) {
            var cb = function (b, result) {
                var i = result.rows.item(0)['CNT'];

                if (i > 0) {
                    callback(true);
                    return;
                }
                callback(false);
                return;
            };
            var sql = "SELECT count(*) as CNT FROM sqlite_master where type='table' and name='pagedata'";
            tx.executeSql(sql, [], cb, errorMethod);
        };
        //创建表
        var doCreateTable = function (callback) {
            var cb = function (tx, result) {
                callback();
            };
            db.transaction(function (tx) {
                isTableExist(tx, function (flag) {
                    if (flag) {
                        tx.executeSql("drop table pagedata", [], null, errorMethod);
                    }
                    tx.executeSql("CREATE TABLE IF NOT EXISTS pagedata (pageUrl text,dataName text,data text)",
                     [],
                       cb,
                     errorMethod);
                });
            });
        };
        //创建表
        this.createTable = function (callback) {
            if (!openDb()) {
                return;
            }
            callback = callback || null;
            doCreateTable(callback);
        };
        //插入记录
        this.addRecord = function (url, name, jsonData, callback) {
            if (!openDb()) {
                return;
            }
            callback = callback || null;
            db.transaction(function (tx) {
                isTableExist(tx, function (flag) {
                    if (flag) {
                        var sql = 'INSERT INTO pagedata VALUES(?,?,?)';
                        tx.executeSql(sql, [url, name, jsonData], function (tx, result) {
                            if (callback != null) {
                                callback(result.rowsAffected);//返回插入的行数
                            }
                        }, errorMethod);
                    } else {
                        global.exceptionHandler("先创建数据表!");
                    }
                });
            });
        };
        //查询
        this.selectRecord = function (pageUrl, dataName, callback) {
            if (!openDb()) {
                return;
            };
            db.transaction(function (tx) {
                isTableExist(tx, function (flag) {
                    if (flag) {
                        var sql = "SELECT data FROM pagedata WHERE pageUrl =? and dataName=?";
                        tx.executeSql(sql, [pageUrl, dataName], function (tx, result) {
                            var arr = new Array();
                            var rows = result.rows;
                            for (var i = 0; i < rows.length; i++) {
                                arr.push(rows.item(i)['data']);
                            }
                            callback(arr);
                        }, errorMethod);
                    } else {
                        global.exceptionHandler("数据表不存在!");
                    }
                });
            });
        };
        //修改数据
        this.updateRecord = function (pageUrl, dataName, data, callback) {
            if (!openDb()) {
                return;
            }
            db.transaction(function (tx) {
                isTableExist(tx, function (flag) {
                    if (flag) {
                        var sql = "UPDATE pagedata SET data=? WHERE pageUrl=? AND dataName=? ";
                        tx.executeSql(sql, [data, pageUrl, dataName], function (tx, result) {
                            if (callback != null) {
                                callback(result.rowsAffected); //返回更新的行数
                            }
                        }, errorMethod);
                    } else {
                        global.exceptionHandler("数据表不存在");
                    }
                });
            });
        };
        //删除
        this.deleteRecord = function (pageUrl, dataName, callback) {
            if (!openDb()) {
                return;
            }
            db.transaction(function (tx) {
                isTableExist(tx, function (flag) {
                    if (flag) {
                        var sql = "DELETE FROM pagedata WHERE 1=1";
                        if (pageUrl != "" && pageUrl != null) {
                            sql += " AND pageUrl='" + pageUrl + "'";
                        }
                        if (dataName != "" && dataName != null) {
                            sql += " AND dataName='" + dataName + "'";
                        }
                        tx.executeSql(sql, [], function (tx, result) {
                            if (callback != null) {
                                callback(result.rowsAffected);//返回删除的行数
                            }
                        }, errorMethod);
                    } else {
                        global.exceptionHandler("先创建数据表!");
                    }
                });
            });

        };
        //错误处理
        var errorMethod = function (tx, error) {
            global.exceptionHandler("本地数据库出错" + error.message);
        };
    };
    pageDataCache = new pagedataCacheHandler();
})();