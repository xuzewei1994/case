(function($){
	function Coursel($elem,options){
		/*1.罗列属性*/
		this.$elem = $elem;
		this.options = options;

		//获取图片列表
		this.$courselItems = this.$elem.find('.carousel-item');

		//获取底部按钮
		this.$courselBtns = this.$elem.find('.btn-item');
		
		//获取左右按钮
		this.$courselControls = this.$elem.find('.control');
		
		//获取图片的个数
		this.itemLength = this.$courselItems.length;

		//当前显示的图片
		this.now = this._getCorrectIndex(this.options.activeIndex);

		//设置定时器
		this.timer = 0;

		/*2.初始化*/
		this.init();
	}
	Coursel.prototype = {
		constructor:Coursel,
		init:function(){

			/*判断是否用滑入滑出*/
			if(this.options.slide){
				/*1.移走所有图片,显示默认图片*/
				this.$elem.addClass('slide');
				//让要显示的图片回到初始位置
				this.$courselItems.eq(this.now).css({left:0});

			/*否则用淡入淡出*/
			}else{
				/*1.隐藏所有图片,显示默认图片*/
				this.$elem.addClass('fade');
				//显示第几张图片
				this.$courselItems.eq(this.now).show();

				/*2.底部按钮默认选中*/
				this.$courselBtns.eq(this.now).addClass('active');

				/*3.监听鼠标移入移出显示隐藏左右按钮事件*/
				this.$elem.hover(function(){
					this.$courselControls.show();
				}.bind(this),function(){
					this.$courselControls.hide();
				}.bind(this));

				/*4.初始化显示隐藏插件*/
				this.$courselItems.showHide(this.options)

				/*5.(事件委托)监听点击左右按钮显示隐藏图片事件*/
				this.$elem.on('click','.control-left',function(){
					this._fade(this._getCorrectIndex(this.now-1));
				}.bind(this));
				this.$elem.on('click','.control-right',function(){
					this._fade(this._getCorrectIndex(this.now+1));
				}.bind(this));

				/*6.自动轮播*/
				//是否自动轮播
				if(this.options.autoPlay){
					//开始自动轮播
					this.autoPlay();
					/*7.鼠标移入移出开始停止轮播*/
					this.$elem.hover($.proxy(this.paused,this),$.proxy(this.autoPlay,this))
				}

				/*8.监听底部按钮事件*/
				var _this = this;
				this.$courselBtns.on('click',function(){
					//获取当前索引值
					var index = _this.$courselBtns.index(this);
					_this._fade(index);
				})
			}
		},
		//显示下一张图片方法
		_fade:function(index){

			//index:将要显示的图片
			console.log(index);

			//如果当前显示的和即将要显示的是同一张图片则无需执行一下代码
			if(index == this.now) return;

			/*1.隐藏当前*/
			this.$courselItems.eq(this.now).showHide('hide');

			/*2.显示下一张图片*/
			this.$courselItems.eq(index).showHide('show');

			/*3.底部按钮更新*/
			this.$courselBtns.eq(this.now).removeClass('active');
			this.$courselBtns.eq(index).addClass('active');

			/*4.更新索引值*/
			this.now = index;
		},
		//限制index值的方法
		_getCorrectIndex:function(num){
			//翻到最后一张图片之后回到第一张图片
			if(num >= this.itemLength) return 0;
			//翻到第一张之后回到最后一张图片
			if(num < 0) return this.itemLength-1;
			//如果再区间内返回当前数值
			return num;
		},
		//开始轮播方法
		autoPlay:function(){
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				//自动触发右侧点击事件
				this.$courselControls.eq(1).trigger('click');
			}.bind(this),this.options.autoPlay)
		},
		//停止轮播方法
		paused:function(){
			clearInterval(this.timer);
		}
	}

	//当不传参数时的默认配置信息
	Coursel.DEFAULTS = {
		//是否滑入滑出
		slide:true,
		//默认显示图片
		activeIndex:0,
		js:true,
		mode:'fade',
		autoPlay:0
	}

	//封装dropdown插件
	$.fn.extend({
		coursel:function(options){
			//1.实现隐式迭代
			this.each(function(){
				
				/*获取DOM节点*/
				var $elem = $(this);

				/*实现单例模式*/
				//将获取到的信息存储到data上
				var coursel = $elem.data('coursel');

				//如果data上没有coursel
				if(!coursel){

					//如果不传参数用默认信息(DEFAULTS)
					//如果传参数用配置信息
					options = $.extend({},Coursel.DEFAULTS,options);

					//只有通过coursel上的实例才可以调用coursel上的方法
					//当前节点($elem)实现侧拉功能
					//实现动画效果的配置信息(options)
					coursel = new Coursel($elem,options);
					
					//将实例信息存储在当前dom节点上
					$elem.data('coursel',coursel);
				}
				//第二次调用coursel则是调用实例上的方法
				if(typeof coursel[options] == 'function'){
					coursel[options]();
				}
			})
		}
	})
})(jQuery);