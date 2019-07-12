(function($){

	/*加载图片共通函数开始*/
	// imgUrl:图片地址 success:成功处理方式 error:失败处理方式
	function loadImage(imgUrl,success,error){
		//专门用来处理图片的构造函数
		var image = new Image();

		//src="images/focus-carousel/loading.gif"
		//imgUrl="images/focus-carousel/2.png"
		image.src = imgUrl

		//地址正确时的处理方式
		image.onload = function(){
			typeof success == 'function' && success(imgUrl);
		}

		//地址错误时的处理方式
		image.onerror = function(){
			typeof error == 'function' && error(imgUrl);
		}
	}
	/*加载图片共通函数结束*/


	/*轮播图逻辑开始*/
	var $coursel = $('.carousel .carousel-wrap');

	//图片被加载存入对象中
	var item = {};//0:loaded 1:loaded

	//获取所有图片的个数
	var totalNum = $coursel.find('.carousel-img').length-1;

	//定义一个变量在图片被加载过后+1
	var totalLoadedNum = 0;

	var loadFn = null;

	//1.开始加载
	$coursel.on('coursel-show',loadFn = function(ev,index,elem){
		/*判断当前图片有没有被加载*/
		//如果没有被加载过
		if(!item[index]){
			$coursel.trigger('coursel-load',[index,elem]);
		}
	})

	//2.执行加载
	$coursel.on('coursel-load',function(ev,index,elem){
		console.log('will load img',index);
		//获取当前要显示的li的DOM节点包装成jQuery对象
		var $elem = $(elem);
		//获取当前要显示的img的DOM节点包装成jQuery对象
		var $img = $elem.find('.carousel-img');
		//获取每张图片的地址(images/focus-carousel/2.png)
		var imgUrl = $img.data('src');
		loadImage(imgUrl,function(){
			$img.attr('src',imgUrl);
		},function(){
			$img.attr('src','images/focus-carousel/placeholder.png');
		});
		//图片已经被加载
		item[index] = 'isLoaded';
		totalLoadedNum++;
		//如果超过图片个数(则证明所有图片加载完毕)
		if(totalLoadedNum > totalNum){
			$coursel.trigger('coursel-loaded');
		}
	})

	//3.加载完毕
	$coursel.on('coursel-loaded',function(){
		//移除事件
		$coursel.off('coursel-show',loadFn);
	})

	$coursel.coursel({})
	/*轮播图逻辑结束*/
})(jQuery);
