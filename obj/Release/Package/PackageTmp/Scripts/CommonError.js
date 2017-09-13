// Author:陈巍
// Create Date:2014-04-09
// 普通客户端异常处理页面
var errMsg = sessionStorage.getItem('CommonErrorMessage');
message.closeLoading();
$('#content').html(errMsg);
$(document).ready(function () {
    $('#foot').on('click', function () {
        window.location.reload();
    });
})