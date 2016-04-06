$(function () {

    $('.nav').on('click', '.nav-tab', function () {
        var index = $('.nav-tab').index(this);
        slideTab.slideTo(index);
        slideChanged(index);
    });


    var slideTab = new SlideTab('.panes', {
        initialPane: 0,
        slideChanged: slideChanged
    });

    slideTab.dropload = $('.wraper').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            getData(me);
        }
    });

    function slideChanged(index) {

        $('.bar-progress').css('left', 25 * index + '%');
    }

    var pages = [0, 0, 0, 0]

    function getData() {
        var index = slideTab.currentIndex;
        $.getJSON('test.json', function (data) {
            if (pages[index]++ === 10) {
                slideTab.lock();
            }
            var items = [];

            $.each(data, function (key, value) {
                items.push('<div class="item">' + value + '</div>');
            });
            $('.pane').eq(index).append(items.join(''));
            slideTab.resetHeight();
        });

    }

})