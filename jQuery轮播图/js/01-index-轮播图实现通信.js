(function($){
	/*轮播图逻辑开始*/
	var $coursel = $('.carousel .carousel-wrap');

	$coursel.on('coursel-show',function(ev,index,elem){
		console.log(index,elem)
		//1 <li class="carousel-item" style="left: 728px;"></li>
		//2 <li class="carousel-item"></li>
		//3 <li class="carousel-item"></li>
		//0 <li class="carousel-item" style="left: -728px;"></li>
	})
	
	$coursel.coursel({})
	/*轮播图逻辑结束*/
})(jQuery);
