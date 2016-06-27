define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	$('.detail-item .item-enroll').click(function(){
		var signdialog = dialog({
			modal : true,
			title: "活动报名",
			content: _html,
			fixed:true,
			okValue: '确 定',
			ok: function () {
				if(_disable == "true") return true;
				$.getJSON(util.ajaxurl('activesign')+"?id="+_id,function(result){
					if(result.status == true){
						alert('恭喜您报名成功,请注意活动时间.');
						signdialog.close();
						location.href = location.href;
					}else{
						alert(result.message);
						signdialog.close();
					}
				});
			}
		});
		signdialog.show();
	})
	$.getJSON(util.ajaxurl('getfollow'),function(result){
		if(result.status == true){
			if(result.data.follow.length > 2){
				var userid = 0;
				$('.follow-btn').each(function(index){
					userid = $(this).attr('data-userid');
					if(userid != uid && result.data.follow.indexOf(','+userid+',') > -1){
						$(this).addClass('disable').text('取消关注');
					}
				})
			}
		}
	});
})