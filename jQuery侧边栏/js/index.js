/*分类列表开始*/
(function($){
	var $categoryDropdown = $('.focus .dropdown');
	$categoryDropdown.dropdown({
		js:true,
		mode:'slideLeftRight'
	});
/*懒加载开始*/
	$categoryDropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){

		/*当侧拉层要显示的时侯才加载数据*/
		if(ev.type == 'dropdown-show'){

			/*1.将this包装成jQuery对象*/
			//这里的this就是对应的每一个li
			var $elem = $(this);

			/*2.获取下拉层*/
			//jQuery对象.find('CSS选择器')
			//查找jQuery对象中DOM元素的后代中符合选择器规则的元素。
			var $layer = $elem.find('.dropdown-layer');

			/*3.获取数据的地址*/
			var url = $elem.data('load');
			//如果没有url就不用加载数据
			if(!url) return;

			/*4.当数据已经加载就没有必要再发送请求*/
			//判断数据如果没有被加载则发送请求
			if(!$elem.data('isLoaded')){

				/*5.如果有url则获取数据*/
				//该方法会产生跨域(可使用sublimeServer方法解决)
				$.getJSON(url,function(data){
					console.log(data);

					/*5.1生成HTML*/
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

					/*5.2模拟网络延迟*/
					setTimeout(function(){
						/*5.3将HTML插入到下拉层中*/
						//设置元素中的HTML:jQuery对象.html([val])
						$layer.html(html);

						//数据已经加载
						$elem.data('isLoaded',true);
					},1000);
				})
			}
		}
	})	
/*懒加载结束*/	
})(jQuery);
/*分类列表结束*/