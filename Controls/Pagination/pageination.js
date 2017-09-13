
var pagination = {};
(function () {
    function paginationHandler() {
        var tipsDiv = '<div><p class="gd-tips">{0}</p></div>';
        var tipsDefault = "向上滑动显示更多信息";

        this.totalPage = 1;
        this.currentPageNumber = 1;
        this.pageSize = 10;
        this.totalRecords = 0;
        this.setDefault = function () {///设置默认的分页操作
            this.currentPageNumber = 1;
            this.pageSize = 10;
            this.totalPage = 1;
        };
        this.initPagination = function (currNo, size) {
            this.currentPageNumber = currNo;
            this.pageSize = size;
        };
        this.isHasData = function () {
            if (this.totalPage >= this.currentPageNumber) {
                return true;
            }
            return false;
        };
        this.tips = function (id) {
            if (id == null) {
                return;
            }
            if (this.totalPage >= this.currentPageNumber) {//设置分页信息
                toolBar.setPagination(this.currentPageNumber, this.totalPage, this.totalRecords);
            }
            if (this.totalPage >= this.currentPageNumber + 1) {
                var temp = String.format(tipsDiv, tipsDefault);
                $(id).after(temp);
                return;
            }
            var str = String.format(tipsDiv, '全部记录都已加载');
            $(id).after(str);
            return;
        };
    };
    pagination = new paginationHandler();
})();