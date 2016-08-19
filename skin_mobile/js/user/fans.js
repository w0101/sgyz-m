define(function(require){
	var $ = require('jquery'), util=require('util'), dialog = require('dialog/dialog');
	$('.item-controll').height($('.item-img').height());

	$('.follow-sbtn').click(function(){
		var userid = parseInt($(this).attr('data-userid'));
		if(userid < 1) return ;
		var that = this;
		if($(this).hasClass('disable')){
			$.getJSON(util.ajaxurl('removefollow'),{to:userid},function(result){
				if(result.status == true){
					alert(result.message);
					$(that).parent().parent().parent().parent().remove();
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
	});

	$('.report-btn').click(function(){
		var userid = parseInt($(this).attr('data-userid'));
		var username = $(this).attr('data-username');
		var parentUlEl = $(this).parent();
		if(userid < 1) return ;
		var that = this;
		var tpl = '<div class="report-box"><div class="report-item"><label>举 报 人 ：</label><span>'+username+'</span></div><div class="report-item report-value"><label>举报理由：</label><textarea class="report-text" style="width:100%;height:70px;"></textarea></div></div>';
		var d = dialog({
			lock : true,
			title: "举报用户",
			content: tpl,
			fixed:true,
			okValue: '确定举报',
			ok: function () {
				var intro = $('.report-text').val();
				var that = this;
				if(intro == "") {
					alert('请输入评价内容');
					$('.report-text').focus();
					return false;
				}
				var data = {touserid:userid,intro:intro};
				$.post(util.ajaxurl('reportuser'),data,function(result){
					if(result.status == true){
						var alertdia = dialog({
							title: "提示",
							content: result.message,
							fixed:true,
							width:150,
							modal : true,
							okValue: '确 定',
							ok: function () {
								that.close();
								parentUlEl.hide();
								return true 
							}
						});
						alertdia.show();
					}else{
						var alertdia = dialog({
							title: "提示",
							content: result.message,
							fixed:true,
							width:150,
							modal : true,
							okValue: '确 定',
							ok: function () {
								return true 
							}
						});
						alertdia.show();
					}
				},'json')
				return false;
			}
		});
		d.show();
	});
})