/*陈毅,2015.01.5 */
(function ($, window, undefined) {
	//创建缩略图html
	//param:类型数组，缩略图片
	function createThumbnailHtml(typeArr, data) {
		var thum_cont = '<div class="thumbnail-container"></div>';
		var temp = [];
		var index = 0;
		var template = '<img src="{0}" oldheight="{1}" height="{1}" width="{2}"oldwidth="{2}" data-img-index="{3}" data-catename="{4}" data-catetype="{5}" data-iterator="{6}">';
		if (typeArr.length <= 0 && data.length > 0) {
			$(data).each(function (i, n) {
				if (!typeArr.contains(n.CateName)) {
					typeArr.push(n.CateName)
				}
			});
		}
		if (typeArr.length > 0) {
			for (var x = 0 ; x < typeArr.length; x++) {
				var count = 0;
				var html = '<div class="img-container" data-count="{0}"  data-catetype="{1}">';
				$(data).each(function (i, n) {
					if (typeArr[x] == n.CateName) {
						html += String.format(template, n.url, n.height, n.width, index, n.CateName, x, count);
						index++;
						count++;
					}
				});
				html += '</div>';
				var titleHtml = String.format('<div class="cate-title"><i></i><span>{0},共{1}张</span></div>', typeArr[x], count);
				html = String.format(html, count, x);
				temp.push(titleHtml + html);
			}
		}
		return $(thum_cont).html(temp.join('', ','));
	};
	//构建原图Html
	//param:类型数组，原图数据
	function creatOriginalHtml(id, typeArr, data) {
		var temp = [];
		var index = 0;
		var container = '<div class="contentScroller"id="' + id + '_browse"></div>';
		var scroll = '<div class="scroller"data-role="scroller"></div>';
		var template = '<li data-img-index="{3}" data-catename="{4}" data-catetype="{5}" data-iterator="{6}"><img src="{0}" oldheight="{1}" height="{1}" width="{2}"oldwidth="{2}" data-img-index="{3}" data-catename="{4}" data-catetype="{5}"  data-iterator="{6}"></li>'
		for (var x in typeArr) {
			var html = '';
			var count = 0;
			$(data).each(function (i, n) {
				if (typeArr[x] == n.CateName) {
					html += String.format(template, n.url, n.height, n.width, index, n.CateName, x, count);
					index++;
					count++;
				}
			});
			temp.push(html);
		}
		return { html: $(container).html($(scroll).html('<ul>' + temp.join('', ',') + '</ul>')), length: index }
	};
	//根据屏幕大小，把图片进行放缩（前提是：图片已加载完成，能获取到图片的宽高）
	function resizeImages(myimg, maxwidth, maxheight) {
		var oldwidth = $(myimg).attr('oldwidth'), oldheight = $(myimg).attr('oldheight');
		if ((maxwidth / oldwidth) < (maxheight / oldheight))//以宽为标准（以小的比例为标准）
		{
			var h = oldheight * maxwidth / oldwidth;//缩略图高度
			var top = parseInt((maxheight - h) / 2);
			myimg.height = h;
			myimg.width = maxwidth;
			$(myimg).css('padding', top + 'px 0px');
		}
		else {
			var w = oldwidth * maxheight / oldheight;//缩略图宽度
			var left = parseInt((maxwidth - w) / 2);
			myimg.width = w;
			myimg.height = maxheight;
			$(myimg).css('padding', '0px ' + left + 'px');
		}
		return $(myimg);
	}
	//图片标题
	function titleHtml(id) {
		var html = '<div class="img-title"id="' + id + '_title"><div class="back"><img src="Images/back.png"></div><p>{0}({1}/{2})</p></div>';
		return html;
	}
	//图片放缩的容器
	function zoomContainerHtml(id) {
		var html = '<div id="' + id + '_zoom_container"class="contentScroller"><div class="scroller"data-role="scroller"></div></div>'
		return html;
	}

	//设置样式
	function _setCss(len) {
		//设置imgScroll样式
		$($Id + _suffix).css('width', window.innerWidth).children('div[data-role="scroller"]').first().css('width', (len * window.innerWidth) + 'px');
		var origImg = $($Id + _suffix).children('div[data-role="scroller"]').children('ul').children('li');
		origImg.css('width', window.innerWidth).children('img').each(function (i, n) { resizeImages(this, window.innerWidth, (window.innerHeight - 80)); });
		//设置zoomScroll样式
		$($Id + _zoomSuffix).css('width', window.innerWidth).children('div[data-role="scroller"]').css('width', window.innerWidth);
	}

	//iScroll 初始化
	function iScrollInit() {
		imgScroll = new iScroll(_scrollId, {
			snap: true,
			snapThreshold: 80,
			momentum: false,
			hScrollbar: false,
			zoom: true,
			doubleTaped: true,
			bounce: false,
			onBeforeScrollEnd: function (e) {//滑动结束前
				if (this.scale == 1 && this.absDistX > this.options.snapThreshold) {
					var obj;
					if (e.target.tagName == 'IMG') {
						obj = $(e.target).parent('li');
					}
					else {
						obj = $(e.target);
					}
					if (this.dirX > 0) {
						obj = obj.next('li');
					} if (this.dirX < 0) {
						obj = obj.prev('li');
					}
					if (obj.length < 1) {
						return;
					}
					var cateType = obj.attr('data-catetype');
					var iterator = obj.attr('data-iterator');
					var name = obj.attr('data-catename');
					var count = $($Id).children('div.thumbnail-container').children('div.img-container[data-catetype="' + cateType + '"]').attr('data-count');
					if (count > 1) {
						name += '(' + (parseInt(iterator) + 1) + '/' + count + ')';
					}
					$($Id + _titleSuffix).children('p').text(name);

				}
			},
			onScrollEnd: function () {//滑动后
				var obj = $($Id + _suffix).children('div[data-role="scroller"]').children('ul').children('li[data-img-index="' + this.currPageX + '"]');
				var cateType = obj.attr('data-catetype');
				var iterator = obj.attr('data-iterator');
				var name = obj.attr('data-catename');
				var count = $($Id).children('div.thumbnail-container').children('div.img-container[data-catetype="' + cateType + '"]').attr('data-count');
				if (count > 1) {
					name += '(' + (parseInt(iterator) + 1) + '/' + count + ')';
				}
				$($Id + _titleSuffix).children('p').text(name);
			},
			onZoomStart: function (e) {//放缩前的处理
				var tempImg = $(e.target).clone();
				$($Id + _zoomSuffix).show().children('div[data-role="scroller"]').html(tempImg);

				zoomScroll.enable();
				zoomScroll.x = 0;
				zoomScroll.y = 0;
				zoomScroll.pointX = this.pointX;
				zoomScroll.pointY = this.pointY;
				if (e.touches.length > 1) {
					zoomScroll.zoom(this.pointX, this.pointY, 1.5, 50);
				}
				else {
					zoomScroll.zoom(this.pointX, this.pointY, 2, 250);//默认放大两倍
				}
				zoomScroll.refresh();
				this.disable();
			},
			onZoomEnd: function (e) {//放缩后的处理方法
				this.scrollToPage(this.currPageX, 0, 1);
				this.scale = 1;
				//this.disable();
			}
		});
	}

	var imgScroll;
	var thisId;
	var $Id;
	var _scrollId;
	var _zoomScrollId;

	//后缀
	var _suffix = '_browse';
	var _titleSuffix = '_title';
	var _zoomSuffix = '_zoom_container';
	var _defualtSize = 80;

	/******************用于放大***************/
	var zoomScroll;
	function zoomScrollInit() {
		zoomScroll = new iScroll(_zoomScrollId, {
			snap: false,
			snapThreshold: 160,//要修改
			momentum: false,
			hScrollbar: false,
			zoom: true,
			bounce: true,
			onBeforeScrollEnd: function (e) {//滑动结束前
				//todo:如果要求放大不允许滑动，则屏蔽一下If(){}中的代码
				//if ((this.x > 0 || this.x < -this.wrapperW) && this.absDistX > this.options.snapThreshold) {
				//    $($Id + _zoomSuffix).hide();
				//    this.scale = 1;
				//    var obj = $(e.target);
				//    var index = obj.attr('data-img-index');
				//    obj = $($Id + _suffix).children('div[data-role="scroller"]').children('ul').children('li[data-img-index="' + index + '"]');
				//    if (this.dirX > 0) {//下一张
				//        obj = obj.next('li');
				//        index++;
				//    } if (this.dirX < 0) { //上一张
				//        obj = obj.prev('li');
				//        index--;
				//    }
				//    if (obj.length < 1) {
				//        imgScroll.enable();
				//        imgScroll.refresh();
				//        return;
				//    }
				//    var cateType = obj.attr('data-catetype');
				//    var iterator = obj.attr('data-iterator');
				//    var name = obj.attr('data-catename');
				//    var count = $($Id).children('div.thumbnail-container').children('div.img-container[data-catetype="' + cateType + '"]').attr('data-count');
				//    if (count > 1) {
				//        name += '(' + (parseInt(iterator) + 1) + '/' + count + ')';
				//    }
				//    $($Id + _titleSuffix).children('p').text(name);
				//    imgScroll.enable();
				//    imgScroll.refresh();
				//    imgScroll.scrollToPage(index, 0, 1);
				//    this.disable();
				//}

			},
			onScrollEnd: function () {
			},
			onZoomStart: function (e) {//放缩前的处理
			},
			onZoomEnd: function (e) {//放缩后的处理方法
				if (this.scale == 1) {
					$($Id + _zoomSuffix).hide();
					imgScroll.enable();
					imgScroll.refresh();
					this.disable();
				}
			}
		});
	};
	/******************End***************/
	//相册
	$.fn.album = function (data) {
		var thm = data.thm;
		var orig = data.orig;
		var cateNames = data.cateNames;
		var $this = $(this);
		thisId = $this.attr('id');
		$Id = '#' + $this.attr('id');
		_scrollId = thisId + _suffix;
		_zoomScrollId = thisId + _zoomSuffix;
		//创建缩略图Html
		$this.html(createThumbnailHtml(cateNames, thm));
		//缩略图压缩
		var thumImg = $this.children('div.thumbnail-container').children('div.img-container').children('img');
		if (window.innerWidth >= 768 && window.innerHeight >= 768) {
			_defualtSize = 120;
		}
		thumImg.each(function () { resizeImages(this, _defualtSize, _defualtSize); });


		//原始图片Html
		var original = creatOriginalHtml(thisId, cateNames, orig);
		$this.append(original.html);
		$this.append(titleHtml(thisId));
		$this.append(zoomContainerHtml(thisId));
		//设置样式
		_setCss(original.length);
		//缩略图点击事件注册
		thumImg.on('click', function () {
			//处理点击放大处理
			var name = $(this).attr('data-catename');
			var iterator = $(this).attr('data-iterator');
			var count = $(this).parent().attr('data-count');
			if (count > 1) {
				name += '(' + (parseInt(iterator) + 1) + '/' + count + ')';
			}
			$($Id + _suffix).show();
			$($Id + _titleSuffix).show().children('p').text(name);
			var i = $(this).attr('data-img-index');
			//iScroll 初始化
			iScrollInit();
			zoomScrollInit();
			imgScroll.scrollToPage(i, 0, 0);

		});

		//注册关闭放大图片事件
		$($Id + _titleSuffix).children('div.back').on('click', function () {
			$($Id + _suffix).hide();
			$($Id + _titleSuffix).hide();
			imgScroll.destroy();
			$($Id + _zoomSuffix).hide();
			zoomScroll.destroy();
			imgSroll = zoomScroll = null;
		});
		//屏幕旋转事件
		var evt = "onorientationchange" in window ? "orientationchange" : "resize";
		window.addEventListener(evt, function () {
			_setCss(original.length);
			if (imgScroll && zoomScroll) {
				imgScroll.refresh();
				var imgIndex = imgScroll.currPageX;
				imgScroll.scrollToPage(imgIndex, 0, 0);
				zoomScroll.refresh();

			}
		}, false);
	}
})(jQuery, this);