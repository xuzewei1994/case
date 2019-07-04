// 综合动画
// options:对象的属性
function animation(obj,options,sport,isLinear,fnEnd){
	//默认情况下做匀速动画
	if(isLinear == undefined){
		isLinear = true;
	}
	//防止用户多次点击
	clearInterval(obj.timer);
	//初始化速度
	var iSpeed = 0;
	obj.timer = setInterval(function(){

		//是否终止所有动画
		var isStopAll = true;

		//循环遍历对象内的属性并逐次执行动画
		for(attr in options){

			// 判断是否终止当前动画
			var isStopCurrent = false;
			// 获取当前该属性的值
			var currentVal = parseFloat(getComputedStyle(obj,false)[attr]);
			// 处理透明度取值
			if(attr == "opacity"){
				currentVal = Math.round(currentVal*100);
			}
			// 判断是匀速还是减速动画
			if(isLinear){//匀速动画
				// 匀速动画取值
				if(currentVal < options[attr]){
					iSpeed = sport;
				}else{
					iSpeed = -sport;
				}
				// 动画的终止条件
				if(Math.abs(options[attr] - currentVal) < Math.abs(iSpeed)){
					//处理透明度和非透明度的取值
					if(attr == "opacity"){
						obj.style[attr] = options[attr]/100;
					}else{
						obj.style[attr] = options[attr] + "px";
					}
					// 终止当前动画
					isStopCurrent = true;
				}else{

					//如果还有动画没有执行完毕，便不能终止所有动画
					isStopAll = false;
				}
			}else{//减速动画
				// 减速动画的取值
				iSpeed = (options[attr] - currentVal)/10;
				iSpeed = iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				// 减速动画终止条件
				if(!iSpeed){
					// 终止当前动画
					isStopCurrent = true;
				}else{

					//还有动画没有执行完毕，不能终止所有动画
					isStopAll = false;
				}
			}
			if(!isStopCurrent){//动画执行过程
				//处理透明度和非透明度的动画执行过程
				if(attr == "opacity"){
					obj.style[attr] = (currentVal + iSpeed)/100;
				}else{
					obj.style[attr] = currentVal + iSpeed + "px";
				}
			}
		}

		//所有动画执行完毕
		if(isStopAll){
			// 清除定时器
			clearInterval(obj.timer);
			typeof fnEnd == "function" && fnEnd();
		}
	},30)
}