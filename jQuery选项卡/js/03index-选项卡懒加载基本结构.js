(function($){
	
/*共通函数开始*/
	//1.加载图片
	function loadImage(imgUrl,success,error){
		var image = new Image();
		image.onload = function(){
			typeof success == 'function' && success(imgUrl);
		}
		image.onerror = function(){
			typeof error == 'function' && error(imgUrl);
		}
		image.src = imgUrl;
	};

	//2.楼层图片懒加载
	function floorLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.find('.floor-img').length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		/*1.开始加载*/
		$elem.on('tab-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$elem.trigger('tab-load',[index,elem]);
			}
		})
		/*2.执行加载*/
		$elem.on('tab-load',function(ev,index,elem){
			var $elem = $(elem);
			var $imgs = $elem.find('.floor-img');
			$imgs.each(function(){
				var $img = $(this);
				var imgUrl = $img.data('src');
				loadImage(imgUrl,function(){
					$img.attr('src',imgUrl);
				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});
			})
			/*2.2图片已经被加载*/
			item[index] = 'isLoaded';
			totalLoadedNum++;
			/*2.3所有图片都被加载则移除事件*/
			if(totalLoadedNum > totalNum){
				$elem.trigger('tab-loaded');
			}
		})
		/*3.加载完毕*/
		$elem.on('tab-loaded',function(){
			$elem.off('tab-show',loadFn);
		})
	}

/*共通函数结束*/

	var $floor = $('.floor');

	//获取window
	var $win = $(window);

	//获取document
	var $doc = $(document);

	//楼层html懒加载
	function floorHtmlLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		//1.开始加载
		$doc.on('floor-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$doc.trigger('floor-load',[index,elem]);
			}
		})
		//2.执行加载
		$doc.on('floor-load',function(ev,index,elem){
			//1.生成html结构
			//2.加载html
			//3.楼层图片懒加载
			//4.激活选项卡
			//楼层已经被加载
			item[index] = 'isLoaded';
			totalLoadedNum++;
			//所有图片都被加载则移除事件
			if(totalLoadedNum > totalNum){
				$doc.trigger('floor-loaded');
			}
		})
		//3.加载完毕
		$doc.on('floor-loaded',function(){
			$doc.off('floor-show',loadFn);
		})
	}

	//判断楼层是否在可视区
	function isVisible($elem){
		//楼层在可视区下面:可视区高度+滚动高度 > 楼层距离顶部的高度
		return ($win.height() + $win.scrollTop() > $elem.offset().top) 
		//楼层在可视区上面:楼层距离顶部的高度+楼层高度 > 滚动高度
		&& ($elem.offset().top + $elem.height() > $win.scrollTop())
	};

	/*遍历每一个楼层实现图片懒加载*/
	$doc.on('floor-show',function(ev,index,elem){
		console.log(index,elem);
	})

	//楼层移入可视区触发事件
	function timeToShow(){
		$floor.each(function(index,elem){
			if(isVisible($(elem))){
				//判断当前楼层有没有在可视区内
				$doc.trigger('floor-show',[index,elem]);
			}
		})
	}

	//刷新 滚动 改变浏览器大小时触发timeToShow
	$win.on('load scroll resize',function(){
		clearTimeout($floor.showTimer);
		//为避免连续出发可以设置定时器
		$floor.showTimer = setTimeout(timeToShow,200);
	})

	$floor.tab({});
})(jQuery);
