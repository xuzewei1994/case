(function($){
/*头部搜素区域开始*/
	var $search = $('.search');
	//利用自定义事件原理监听getData事件
	//成功获取并处理数据
	$search.on('getData',function(ev,data){
		
		var $elem = $(this);
		var $layer = $elem.find('.search-layer')
		/*1.生成HTML结构*/
		var data = data.result;
		var html = createSearchLayer(data,5)

		/*2.将内容插入到搜索下拉层中*/
		$elem.search('appendHTML',html);

		/*3.显示下拉层*/
		if(html == ''){
			$elem.search('hideLayer')
		// 如果有数据则显示下拉层
		}else{
			$elem.search('showLayer')
		}
	})
	//获取数据失败并处理
	$search.on('getNoData',function(){
		$elem.search('appendHTML');
		$elem.search('hideLayer');
	})
	$search.search({});
	//data:接收数据 num:需要显示几条数据
	//生成搜索下拉列表HTML结构并且可以控制数据条目
	function createSearchLayer(data,num){
		var html = '';
		for(var i=0;i<data.length;i++){
			//超过num中止循环
			if(i >= num) break;
			html += '<li class="search-item">'+data[i][0]+'</li>';
		}
		return html;
	}
/*头部搜素区域结束*/
})(jQuery);