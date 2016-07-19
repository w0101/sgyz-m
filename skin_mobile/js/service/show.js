define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	if(_userid != _uid){
		var _html = '<div class="service-signup-form"><p>请填写你的联系方式，方便需求用户与你对接。</p><p>Q  Q<input type="text" class="dialog-input" id="qq" style="width: 260px;" /></p><p>电话<input type="text" class="dialog-input" id="phone" style="width: 260px;" /></p></div>';
		$('.detail-btn').click(function(){
			var sdialog = dialog({
				title: "参与接单",
				content: _html,
				fixed:true,
				modal : true,
				okValue: '确 定',
				ok: function () {
					var qq = $("#qq").val();
					var phone = $("#phone").val();
					$.getJSON(util.ajaxurl('servicesign'),{id:_id,qq:qq,phone:phone},function(result){
						if(result.status == true){
							alert('恭喜您参与接单成功,请等待需求用户联系.');
							sdialog.close();
						}else{
							alert(result.message);
							return false;
						}
					});
					return false;
				}
			});
			sdialog.show();
		})
	}else{
		if(_status == 1){
		$(".signup-list .item-icon").click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}else{
				$('.signup-list .item-icon').removeClass('active');
				$(this).addClass("active");
			}
		})
		$(".service-controll-btn>a").click(function(){
			var userid = 0;
			$(".signup-list .item-icon").each(function(){
				if($(this).hasClass('active')){
					userid = $(this).attr('data-userid');
				}
			})
			if(userid == 0){
				alert('请选择接单用户.');
				return false;
			}
			$.getJSON(util.ajaxurl('serviceset'),{id:_id,userid:userid},function(result){
				if(result.status == true){
					alert('选择接单用户成功.');
					location.href = location.href;
				}else{
					alert(result.message);
				}
			});
		})
		}
	}

})