(function($){
	function Search($elem,options){
		/*1.罗列属性*/
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
	
		/*2.初始化*/
		this.init();

		/*3判断是否显示下拉层*/
		if(this.options.autocomplete){
			this.autocomplete();
		}
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
		},

		//自动显示隐藏下拉层方法
		autocomplete:function(){
			/*1.初始化显示隐藏插件*/
			this.$searchLayer.showHide(this.options);

			/*2.监听输入框输入事件获取数据(jsonp)*/
			this.$searchInput.on('input',$.proxy(this.getData,this));

			/*3.点击页面别的部分隐藏下拉层*/
			$(document).on('click',function(){
				this.hideLayer();
			}.bind(this));

			/*4.获取焦点下拉层出现*/
			this.$searchInput.on('focus',function(){
				//如果输入框有值才显示下拉层
				if(this.getInputVal()){
					this.showLayer();
				}
			}.bind(this));

			/*5.点击输入框按钮时阻值事件冒泡*/
			this.$searchInput.on('click',function(ev){
				ev.stopPropagation();
			})
		},
		//获取数据的方法
		getData:function(){
			//如果数据为空则不发送请求
			if(this.getInputVal() == ''){
				return;
			}
			$.ajax({
				/*1.获取地址值做字符串的拼接*/
				url:this.options.url + this.getInputVal(),

				/*2.数据类型*/
				dataType:'jsonp',

				/*3.前后台请求数据的方法*/
				jsonp:'callback'
			})

			/*4.获取成功*/
			.done(function(data){
				console.log(data);

				/*1.生成HTML结构*/
				var html = '';
				for(var i=0;i<data.result.length;i++){
					html += '<li>'+data.result[i][0]+'</li>';
				}

				/*2.将内容插入到搜索下拉层中*/
				this.appendHTML(html);

				/*3.显示下拉层*/
				// 如果没有数据则隐藏下拉层
				if(html == ''){
					this.hideLayer();
				// 如果有数据则显示下拉层
				}else{
					this.showLayer();
				}
			}.bind(this))

			/*5.获取失败*/
			.fail(function(err){
				console.log(err);
			})
		},
		//插入HTML方法
		appendHTML:function(html){
			this.$searchLayer.html(html);
		},
		//显示下拉层方法
		showLayer:function(){
			this.$searchLayer.showHide('show');
		},
		//隐藏下拉层方法
		hideLayer:function(){
			this.$searchLayer.showHide('hide');
		}
	}

	//当不传参数时的默认配置信息
	Search.DEFAULTS = {
		//是否显示下拉层
		autocomplete:true,
		//获取数据的地址
		url:'https://suggest.taobao.com/sug?q=',

		//传入配置信息
		js:true,
		mode:'slide'
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