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

	//2.轮播图懒加载共通
	function courselLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.find('.carousel-img').length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		/*1.开始加载*/
		$elem.on('coursel-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$elem.trigger('coursel-load',[index,elem]);
			}
		})
		/*2.执行加载*/
		$elem.on('coursel-load',function(ev,index,elem){
			var $elem = $(elem);
			var $imgs = $elem.find('.carousel-img');
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
				$elem.trigger('coursel-loaded');
			}
		})
		/*3.加载完毕*/
		$elem.on('coursel-loaded',function(){
			$elem.off('coursel-show',loadFn);
		})
	}
/*共通函数结束*/


/*轮播图逻辑开始*/
	var $coursel = $('.carousel .carousel-wrap');
	courselLazyLoad($coursel);
	$coursel.coursel({});
/*轮播图逻辑结束*/

/*今日热销逻辑开始*/
	var $todaysCoursel = $('.todays .carousel-wrap');
	courselLazyLoad($todaysCoursel);
	$todaysCoursel.coursel({});
/*今日热销逻辑结束*/
})(jQuery);
