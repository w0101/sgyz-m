define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	var msgdialog = dialog({
		lock : true,
		title: "私信",
		content: '<div class="send-msg"><textarea id="sendmsg"></textarea></div>',
		fixed:true,
		okValue: '发 送',
		ok: function () {
			var msg = $("#sendmsg").val();
			var that = this;
			if(msg == "") {
				alert('请输入要发送的私信内容!');
				return false;
			}
			$.post(util.ajaxurl('sendmsg'),{to:_userid,msg:msg},function(result){
				if(result.status == true){
					alert('私信发送成功.');
					$("#sendmsg").val('');
					that.close();
				}else{
					alert(result.message);
				}
			},'json');
			return false;
		}
	});
	$(".user-btn-msg").click(function(){
		msgdialog.show();
	})
})