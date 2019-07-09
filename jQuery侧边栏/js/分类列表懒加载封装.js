
(function($){
/*懒加载共通函数开始*/
	//1.只加载一次HTML
	function loadHtmlOnce($elem,callback){
		
		var url = $elem.data('load');
		if(!url) return;
		if(!$elem.data('isLoaded')){
			$.getJSON(url,function(data){
				typeof callback == 'function' && callback($elem,data);
			})
		}
	}

	//2.生成分类列表结构
	function buildCategory($elem,data){
		var $layer = $elem.find('.dropdown-layer');
		/*生成HTML*/
		var html = "";
		for(var i=0;i<data.length;i++){
			html += '<dl class="category-details">';
			html +=	'<dt class="category-details-title fl">';
			html +=	'<a href="#" class="category-details-title-link">'+data[i].title+'</a>';
			html +=	'</dt>';
			html +=	'<dd class="category-details-item fl">';
			for(var j=0;j<data[i].items.length;j++){
				html +=	'<a href="#" class="link">'+data[i].items[j]+'</a>';
			}
			html +=	'</dd>';
			html +=	'</dl>';
		}

		/*模拟网络延迟*/
		setTimeout(function(){
			/*将HTML插入到下拉层中*/
			//设置元素中的HTML:jQuery对象.html([val])
			$layer.html(html);

			//数据已经加载
			$elem.data('isLoaded',true);
		},1000);
	}
/*懒加载共通函数结束*/

/*分类列表设置开始*/
	var $categoryDropdown = $('.focus .dropdown');
	$categoryDropdown.dropdown({
		js:true,
		mode:'slideLeftRight'
	});
/*分类列表设置结束*/

/*懒加载开始*/
	$categoryDropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		/*当侧拉层要显示的时侯才加载数据*/
		if(ev.type == 'dropdown-show'){
			//调用懒加载函数
			loadHtmlOnce($(this),buildCategory);
		}
	})	
/*懒加载结束*/	
})(jQuery);
