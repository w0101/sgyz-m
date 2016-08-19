define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog'),minmoney=0;
	minmoney = parseInt(cashcfg[0].minmoney);	
	var userIntegral = parseInt(integral/100),
		tipContainer = $('.cash-fee-tip');

	$('#integral').on('keyup',this,function(){
		var fee = 0,input_integral=parseInt($(this).val())*100;
		/*if(input_integral < minmoney){
			$('.cash-fee-tip').html('最低提现额度为:'+minmoney);
			return false;
		}
		if(input_integral > integral) {
			$(this).val(parseInt(integral/100));
			input_integral = parseInt(integral/100);
		}*/

		for(var i=0;i<cashcfg.length;i++){
			if(cashcfg[i].minmoney <= input_integral && cashcfg[i].maxmoney >=input_integral){
				fee = cashcfg[i].fee;
				break;
			}
			if(cashcfg[i].maxmoney == 0){
				if(cashcfg[i].minmoney <= input_integral){
					fee = cashcfg[i].fee;
					break;
				}
			}

		}

		if(fee > 0){
			$('.cash-fee-tip').html('提现手续费用：'+fee+'%，实收：'+Math.floor((input_integral * ((100-fee) / 100))));
		}else{
			$('.cash-fee-tip').html('');
		}
	})
	$('.cash-unit').on('click',this,function(){
		$('#integral').trigger('focus');
	});
	$('.cash-plus').on('click',this,function(){
		var $el=$('#integral'),current_integral = parseInt($el.val());
		if(integral < minmoney){
			return false;
		}
		/*if(current_integral * 100 > integral){
			$el.val(parseInt(integral/100));
			$('.cash-fee-tip').html('目前最多提现:'+parseInt(integral/100));
			$el.trigger('keyup');
			return false;
		}else{
			$el.val(parseInt(integral/100));
			$('.cash-fee-tip').html('目前最多提现:'+parseInt(integral/100)* 100);
			return false;
		}*/
		current_integral++;
		if(current_integral * 100 > integral){
			$el.val(userIntegral);
			$('.cash-fee-tip').html('目前最多提现：' + userIntegral);
			$el.trigger('keyup');
			return false;
		}else{
			$el.val(parseInt(current_integral));
			$el.trigger('keyup');
			return false;
		}
	});
	$('.cash-cerl').on('click',this,function(){
		var $el=$('#integral'),current_integral = parseInt($el.val());
		if(integral < minmoney){
			$el.val(parseInt(integral/100));
			tipContainer.html('最低提现额度为：'+ minmoney + '积分，您的积分不足');
			return false;
		}
		/*if(current_integral * 100 < minmoney){
			$el.val(parseInt(minmoney/100));
			$('.cash-fee-tip').html('最少提现:'+parseInt(minmoney/100)*100);
			$el.trigger('keyup');
			return false;
		}*/
		current_integral--;
		if(current_integral * 100 < minmoney){
			$el.val(parseInt(minmoney/100));
			$('.cash-fee-tip').html('最少提现:'+parseInt(minmoney/100));
			$el.trigger('keyup');
			return false;
		}else{
			$el.val(parseInt(current_integral));
			$el.trigger('keyup');
			return false;
		}
	});
	$('#integral').val(userIntegral);
	$('#integral').trigger('keyup');
})