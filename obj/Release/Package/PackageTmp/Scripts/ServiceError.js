// Author:陈巍
// Create Date:2014-04-09
// Web服务端异常处理页面

var errMsg = sessionStorage.getItem('ServiceErrorMessage');
var showDetailMsg = false;
message.closeLoading();
$('#content').html(showDetailMsg ? errMsg : '调用服务错误，请联系管理员');
$(document).ready(function () {
    $('#foot').on('click', function () {
        window.location.reload();
    });
})