//页面UI互动控制脚本
/*基础类*/
define('common', function (require) {
	var $=require('jquery'),util=require('util'),dialog = require('dialog/dialog');
	require("bootstrap")($);
	
	if($('.nav-subnav').height()>40){
		$('#show-nav').removeClass('hidden');
		$('#show-nav').on('tap',function(){
			$('.subnav-container').toggleClass('slide');
			$('#show-nav').toggleClass('show-down show-up');
		});
	}

	$('#search-icon').on('tap', function(){
		$('.cover').removeClass('hidden');
	})

	$('.follow-btn').click(function(){
		var userid = parseInt($(this).attr('data-userid'));
		if(userid < 1) return ;
		var that = this;
		if($(this).hasClass('disable')){
			$.getJSON(util.ajaxurl('cancelfollow'),{to:userid},function(result){
				if(result.status == true){
					alert(result.message);
					$(that).removeClass('disable').text('关注');
				}else{
					alert(result.message);
				}
			});
		}else{
			$.getJSON(util.ajaxurl('addfollow'),{to:userid},function(result){
				if(result.status == true){
					alert(result.message);
					$(that).addClass('disable').text('取消关注');
				}else{
					alert(result.message);
				}
			});
		}
	})

	//对dialog对象居中对齐化
	var dialog_h = $('.dialog').height();
	var dialog_w = $('.dialog').width();
	var winw = $(window).width();
	var winh = $(window).height();

	$('.dialog').css({top:(winh-dialog_h)/2+"px",left:(winw-dialog_w)/2+"px"}).hide();

	$('.dialog>.close').click(function(){
		if($('.dialog').is(":visible") == true){
			$(".dialog").hide();
		}
	})
	$('.dialog>.controll>.canlce-btn').click(function(){
		if($('.dialog').is(":visible") == true){
			$(".dialog").hide();
		}
	})

	/*var util = require('util'),$ = require('jquery'),dialog = require('dialog/dialog');

	//导航图库下拉控制
	$('.header-nav>.downup').click(function(){
		$(this).find('.child-nav').show();
	});
	if($('.match-detail').size()>0){
		$('.match-list>.item>.item-controll>.match-detail-folder').click(function(){
			var tops = $(this).parent().next('.item-intro').css('top');
			if(tops == '290px'){
				$(this).parent().next('.item-intro').animate({top:'0px'},'fast');
			}else{
				$(this).parent().next('.item-intro').animate({top:'290px'},'fast');
			}
		});
		$('.match-list>.item>.item-controll>.match-detail-folder').mouseout(function(){
			$(this).parent().next('.item-intro').animate({top:'290px'},'fast');
		});
		
	}
	if($('.match-vote').size()>0){
		$('.match-vote>.item>.item-select .select-icon').click(function(){
			var list = $(this).parent().parent();
			if($(this).hasClass('up')){
				$(this).removeClass('up');
				list.find('.select-list').hide();
			}else{
				$(this).addClass('up');
				list.find('.select-list').show();
			}
		});
	}
	if($('.login-img').size()>0){
		$('.login-img').click(function(){
			if($('.login-menu').is(":visible") == true){
				$(".login-menu").hide();
			}else{
				$(".login-menu").show();
			}
			
		});
	}


	
	
	//task referer status
	$.getJSON(util.ajaxurl('task'),function(result){ return ;})
	//绑定图片加载失败时.
	*/
});
