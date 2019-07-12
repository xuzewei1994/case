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

	//2.只加载一次数据
	function getDataOnce($elem,url,callback){
		var data = $elem.data('data');
		if(!data){
			$.getJSON(url,function(resData){
				callback(resData);
				$elem.data('data',resData);
			})
		}else{
			callback(data);
		}
	}
/*共通函数结束*/

/*楼层逻辑开始*/
	//楼层html懒加载
	function buildFloorHtml(oneFloorData){
		var html = '';
		html += '<div class="container">';
		html += buildFloorHeaderHtml(oneFloorData);
		html += buildFloorBodyHtml(oneFloorData);
		html += '</div>';
		return html;
	}
	function buildFloorHeaderHtml(oneFloorData){
		var html ='';
		html += '<div class="floor-hd">';
		html +=	'	<h2 class="floor-title fl">';
		html +=	'		<span class="floor-title-num">'+oneFloorData.num+'F</span>';
		html +=	'		<span class="floor-title-text">'+oneFloorData.text+'</span>';
		html +=	'	</h2>';
		html +=	'	<ul class="tab-item-wrap fr">';
		for(var i = 0;i<oneFloorData.tabs.length;i++){
			html +=	'<li class="fl">';
			html +=	'	<a class="tab-item" href="javascript:;">'+oneFloorData.tabs[i]+'</a>';
			html +=	'</li>';
			if(i != oneFloorData.tabs.length - 1){
				html +=	'<li class="fl tab-divider"></li>';
			}
		}
		html +=	'	</ul>';
		html +=	'</div>';

		return html;
	}
	function buildFloorBodyHtml(oneFloorData){
		var html = '';
		html += '<div class="floor-bd">';
		for(var i = 0;i<oneFloorData.items.length;i++){
			html +=	'	<ul class="tab-panel clearfix">';
			for(var j = 0;j<oneFloorData.items[i].length;j++){
				html +=	'		<li class="floor-item fl">';
				html +=	'			<p class="floor-item-pic">';
				html +=	'				<a href="#">';
				html +=	'					<img class="floor-img" src="images/floor/loading.gif" data-src="images/floor/'+oneFloorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="">';
				html +=	'				</a>';
				html +=	'			</p>';
				html +=	'			<p class="floor-item-name">';
				html +=	'				<a class="link" href="#">'+oneFloorData.items[i][j].name+'</a>';
				html +=	'			</p>';
				html +=	'			<p class="floor-item-price">￥'+oneFloorData.items[i][j].price+' </p>';
				html +=	'		</li>';
			}
			html +=	'	</ul>';
		}
		html +=	'</div>';
		return html;
	}
	//楼层图片懒加载
	function floorImgLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.find('.floor-img').length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		//1.开始加载
		$elem.on('tab-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$elem.trigger('tab-load',[index,elem]);
			}
		})
		//2.执行加载
		$elem.on('tab-load',function(ev,index,elem){
			// console.log('will load img',index);
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
			//图片已经被加载
			item[index] = 'isLoaded';
			totalLoadedNum++;
			//所有图片都被加载则移除事件
			if(totalLoadedNum > totalNum){
				$elem.trigger('tab-loaded');
			}
		})
		//3.加载完毕
		$elem.on('tab-loaded',function(){
			$elem.off('tab-show',loadFn);
		})
	}
	//楼层html懒加载
	function floorHtmlLazyLoad(){
		var item = {};//0:loaded 1:loaded
		var totalNum = $floor.length - 1;
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
			getDataOnce($doc,'data/floor/floorData.json',function(data){
				// console.log(data[index]);
				var html = buildFloorHtml(data[index]);
				//2.加载html
				$(elem).html(html);
				//3.楼层图片懒加载
				floorImgLazyLoad($(elem));
				//4.激活选项卡
				$(elem).tab({});
			});
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

	var $floor = $('.floor');
	var $win = $(window);
	var $doc = $(document);
	floorHtmlLazyLoad();
	
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
/*楼层逻辑结束*/

})(jQuery);
