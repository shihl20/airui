// Author:陈巍
// Create Date:2014-04-09
// 客户端js代码异常处理页面

// 这里不能用document.ready调用,否则如果在这之前jQuery类库出现问题则不能执行错误处理代码
//todo:系统javascript异常后,javascript无法正常继续执行,现在采取的方式是让页面强制刷新,相当于重启程序,后期寻找优化方法
var errMsg = sessionStorage.getItem('SystemErrorMessage');
var showDetailMsg = false;
message.closeLoading();
$('#content').html(showDetailMsg ? errMsg : '系统错误，请联系管理员');
//$('#unregister').click(function (event) {
//});
$(document).ready(function () {
    $('#foot').on('click', function () {
        window.location.reload();
    });
})