var loading = {};
(function () {

    function loadingHandler() {
        var modalContainer = '<div data-loading="1" class="gd-loading-img"></div>';
        this.show = function () {
            $('body').append(modalContainer);
        };
        this.remove = function () {
            $('div[data-loading="1"]').remove();
        };
    }

    loading = new loadingHandler();
})();