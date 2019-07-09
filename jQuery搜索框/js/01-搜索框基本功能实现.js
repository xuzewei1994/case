(function($){
	function Search($elem,options){
		console.log(this);
		//1.罗列属性
		this.$elem = $elem;
		this.options = options;
		//获取form表单
		this.$searchForm = this.$elem.find('.search-form');
		//获取搜索框
		this.$searchInput = this.$elem.find('.search-input');
		//获取搜索按钮
		this.$searchBtn = this.$elem.find('.search-btn');
		//获取下拉列表
		this.$searchLayer = this.$elem.find('.search-layer');
	
		//2.初始化
		this.init();
	}
	Search.prototype = {
		constructor:Search,
		init:function(){
			/*1.监听提交按钮事件*/
			this.$searchBtn.on('click',$.proxy(this.submit,this));
		},
		//提交表单方法
		submit:function(){
			//如果输入框没有数据则不提交
			if(!this.getInputVal()){
				return false;
			}else{
				//如果有数据则自动触发表单的submit事件
				this.$searchForm.trigger('submit');
			}
		},
		//获取输入框值的方法
		getInputVal:function(){
			//每次获取输入框的值时去除两边的空格
			return $.trim(this.$searchInput.val());
		}
	}

	//当不传参数时的默认配置信息
	Search.DEFAULTS = {
		
	}

	//封装dropdown插件
	$.fn.extend({
		search:function(options){
			//1.实现隐式迭代
			this.each(function(){
				
				/*获取DOM节点*/
				var $elem = $(this);

				/*实现单例模式*/
				//将获取到的信息存储到data上
				var search = $elem.data('search');

				//如果data上没有search
				if(!search){

					//如果不传参数用默认信息(DEFAULTS)
					//如果传参数用配置信息
					options = $.extend({},Search.DEFAULTS,options);

					//只有通过search上的实例才可以调用search上的方法
					//当前节点($elem)实现侧拉功能
					//实现动画效果的配置信息(options)
					search = new Search($elem,options);
					
					//将实例信息存储在当前dom节点上
					$elem.data('search',search);
				}
				//第二次调用search则是调用实例上的方法
				if(typeof search[options] == 'function'){
					search[options]();
				}
			})
		}
	})
})(jQuery);