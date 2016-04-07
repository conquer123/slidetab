#SlideTab
***

主要是解决移动端标签页之间的手势滑动切换，支持分页。
效果直接看[demo](http://fa-ge.github.io/slidetab/dist/index.html)

##使用方法 (usage)
***
这个插件依赖zepto/jquery,dropload,hammer.js。但并不意味着你需要懂这些。你只需要把引入相应的css和js

    <link rel="stylesheet" href="lib/dropload-0.9.0/dropload.css">
    <link rel="stylesheet" href="lib/slidetab-0.1/slidetab.css">

	<script src="/bower_components/jquery/dist/jquery.min.js"></script>
	<script src="lib/dropload-0.9.0/dropload.js"></script>
	<script src="lib/hammer-2.0.6/hammer.js"></script>
	<script src="lib/slidetab-0.1/slidetab.js"></script>

    var slideTab = new SlideTab('.panes');

    slideTab.dropload = $('.wraper').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            getData();
        }
    });

 具体使用看[这里](https://github.com/fa-ge/slidetab/blob/master/app/scripts/main.js)
 源码看[这里](https://github.com/fa-ge/slidetab/blob/master/app/lib/slidetab-0.1/slidetab.js)

##Callbacks

* resetHeight: 重置容器的高度（在每次分页后调用）
* lock: 锁定窗格加载数据(在该窗格分页没数据的时候调用)
* slideTo: 移动到第几个窗格
* slideStart: 开始滑动的回掉
* slideEnd: 滑动结束的回掉(无论窗格有没有发生变化都调用）
* slideChanged: 滑动结束的回掉(只在窗格发生变化都调用）


