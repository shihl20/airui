var message = {};
(
function () {
    function messageHandler() {

        this.setMessage = function (msg, time) {
            var oldDialog = dialog.get('timeOutDialog');
            if (oldDialog != undefined && oldDialog != null) {
                oldDialog.close().remove();
            }
            var d = dialog({
                id: 'timeOutDialog',
                skin: 'noteDialog',
                content: msg ? msg : '',
                quickClose: true
            });
            d.show();
            setTimeout(function () {
                d.close().remove();
            }, time == undefined ? 2000 : time);
        }
        //显示加载
        this.showLoading = function (title) {
            var oldDialog = dialog.get('loadingDialog');
            if (oldDialog != undefined && oldDialog != null) {
                oldDialog.close().remove();
            }
            var d = dialog({
                id: 'loadingDialog',
                //title: title,
                skin: 'loadingDialog',
                width: 40,
                height: 40,
                cancel: false
            });
            sessionStorage.setItem('IsLoading', 'true');
            d.showModal();
        }
        //关闭加载
        this.closeLoading = function () {
            var oldDialog = dialog.get('loadingDialog');
            if (oldDialog != undefined && oldDialog != null) {
                sessionStorage.removeItem('IsLoading');
                oldDialog.close().remove();
            }
        }
        //跟随元素 弹出
        this.artDialog = function (html, divId) {
            var oldDialog = dialog.get('divDialog');
            if (oldDialog != undefined && oldDialog != null) {
                oldDialog.close().remove();
            }
            var d = dialog({
                quickClose: true,
                align: 'bottom right',
                id: 'divDialog',
                skin: 'artDialog',
                content: html
            });
            setTimeout(function () {
                d.show(divId);
            }, 150);
        }
        //关闭 跟随元素 弹出框
        this.closeArtDialog = function () {
            var oldDialog = dialog.get('divDialog');
            if (oldDialog != undefined && oldDialog != null) {
                oldDialog.close().remove();
            }
        }
    }
    message = new messageHandler();
}
)();