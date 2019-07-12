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

	$coursel.on('coursel-show',function(ev,index,elem){

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
		})
		
		
	})

	$coursel.coursel({})
	/*轮播图逻辑结束*/
})(jQuery);
