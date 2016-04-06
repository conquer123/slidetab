
!(function ($, Hammer) {

    var SlideTab = function (container, options) {

        if (arguments.length === 0) {
            throw new Error('缺少参数, 容器的类名是必须要传的');
        }

        this.container = document.querySelector(container);

        if (!this.container) {
            throw new Error('找不到class或id为' + container + '的元素');
        }

        //直接子元素的个数
        this.childCount = this.container.children.length;

        //一个窗格的宽度
        this.panelSize = this.container.offsetWidth / this.childCount;

        //保存每一个窗格的高度,当滑动到某一个窗格的时候需要改变窗格的高度
        this.paneHeight = [];

        //每一页是否还需要加载数据
        this.tabEnds = [];

        //当前的窗格
        this.currentIndex = 0;

        //上一个窗格,主要是slidechange事件中判断窗格是否发生了变化
        this.preIndex = 0;

        this.hammer = new Hammer.Manager(this.container);

        this.hammer.add(new Hammer.Pan({threshold: 10}));

        this.hammer.on("panleft panright", Hammer.bindFn(this.onPan, this));
        this.hammer.on("panstart", Hammer.bindFn(this.onPanStart, this));
        this.hammer.on("panend pancancel", Hammer.bindFn(this.onPanEnd, this));


        //是否允许左右滑动
        this.canLeftRightslide = false;

        //是否第一次滑动
        this.globalFirstslide = true;

        this.init(options);
    }

    SlideTab.prototype = {

        /**
         * 初始化
         * @param options
         */
        init: function (options) {
            this.opts = {
                initialPane: 0
            };
            Hammer.extend(this.opts, options || {});

            this.currentIndex = this.opts.initialPane;
            this.preIndex = this.currentIndex;

            this.show(this.currentIndex, 0, false);

        },

        onPanStart: function (event) {

            //如果最开始手势是左右滑动,那就不允许上下滑动
            if (event.additionalEvent === 'panleft' || event.additionalEvent == 'panright') {
                document.addEventListener('touchmove', this.preventDefault, false);
                this.canLeftRightslide = true;
            }

            //如果最开始手势是上下滑动,那么就不允许左右滑动
            if (event.additionalEvent === 'pandown' || event.additionalEvent == 'panup') {
                this.canLeftRightslide = false;
            }

            this.slideStart();
        },
        onPan: function (event) {
            if (!this.canLeftRightslide) {
                return false;
            }

            var delta = event.deltaX,
                percent = (delta / this.panelSize) * 100,
                animate = false;

            this.preIndex = this.currentIndex;

            this.show(this.currentIndex, percent, animate);

        },
        onPanEnd: function (event) {
            var delta = event.deltaX,
                percent = (delta / this.panelSize) * 100;

            //当滑动的距离大于窗格的25%的时候才会滑动到下一个
            if (Math.abs(percent) > 25 && event.type == 'panend') {
                this.currentIndex += (percent < 0) ? 1 : -1;
            }

            this.show(this.currentIndex, 0, true);

            document.removeEventListener('touchmove', this.preventDefault, false);
            this.slideEnd();
        },

        /**
         * 显示第几个窗口
         * @param showIndex
         * @param percent
         * @param animate 是否需要动画
         */
        show: function (showIndex, percent, animate) {

            //显示第几个
            showIndex = Math.max(0, Math.min(showIndex, this.childCount - 1));

            percent = percent || 0;

            this.currentIndex = showIndex;

            var container = this.container,
                classList = container.classList;

            if (animate) {
                classList.add('animate');
            } else {
                classList.remove('animate');
            }

            //需要滑动到的位置
            var pos;
            if (percent == 0) {

                pos = -this.panelSize * showIndex;

                //更新container的高度
                this.container.style.height = this.paneHeight[showIndex] || 0;

                //只要不是初次滑动都需要调用
                if (this.globalFirstslide) {
                    this.globalFirstslide = false;
                } else {
                    this.handleLoad();
                }

            } else {
                pos = -this.preIndex * this.panelSize + this.panelSize * percent / 100;
            }

            var translate = 'translate3d(' + (pos) + 'px, 0, 0)';
            this.container.style.transform = translate;
            this.container.style.webkitTransform = translate;
            this.container.style.mozTransform = translate;
            this.container.style.msTransform = translate;

        },
        /**
         * 滑动到第几个
         */
        slideTo: function (index) {
            this.show(index, 0, true);
        },
        /**
         *  当窗格发生变化完成后触发
         */
        slideChanged: function () {
            this.opts.slideChanged && this.opts.slideChanged.call(this, this.currentIndex);
        },
        /**
         * 开始滑动
         */
        slideStart: function () {
            this.opts.slideStart && this.opts.slideStart.call(this);

        },
        /**
         *  当窗格发生变化完成后触发
         */
        slideEnd: function () {
            if (this.currentIndex !== this.preIndex) {
                this.slideChanged();
            }
            this.opts.slideEnd && this.opts.slideEnd.call(this);
        },
        /**
         * 阻止默认事件
         * @param event
         */
        preventDefault: function (event) {
            event.preventDefault();
        },
        /**
         * 重置容器的高度
         */
        resetHeight: function () {
            this.dropload.resetload();
            var style = this.container.style;
            style.height = this.container.children[this.currentIndex].offsetHeight + 'px';
            this.paneHeight[this.currentIndex] = style.height;
        },

        /**
         * 窗格切换的时候处理dropload是否需要加载数据
         */
        handleLoad: function () {
            var dropload = this.dropload;
            if (this.tabEnds[this.currentIndex]) {
                dropload.noData();
                dropload.lock();
            } else {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
            dropload.resetload();
        },

        /**
         * 锁定窗格加载数据
         */
        lock: function () {
            var dropload = this.dropload;
            dropload.lock();
            dropload.noData();
            this.tabEnds[this.currentIndex] = true;
        }
    };


    window.SlideTab = SlideTab;

})($, Hammer)
