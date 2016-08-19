define(function(require){
	var $ = require('jquery'),util=require('util');
	if($('.perfect').height() < $(window).height()){
		$('.perfect').height($(window).height());
	}

	if(question.length > 1){
		var question_option = "";
		for (var i = 1; i < question.length; i++) {
			question_option += '<option value="'+question[i]+'">'+question[i]+'？</option>';
		}
		var firstOption = '<option value="' + question[0] + '">' + question[0] + '？</option>';
		$('#question1').html(firstOption + question_option);
		$('#question2').html(question_option);
	}
	require('select');
	$('#question1').change(function(){
		var question1 = $(this).children('option:selected').val();
		var question_option = "";
		for (var i = 0; i <= question.length - 1; i++) {
			if(question[i] != question1){
				question_option += '<option value="'+question[i]+'"'+(question2 == question[i] ? " selected" : "")+'>'+question[i]+'？</option>';
			}
		}
		$('#question2').html(question_option);
		$('#question2').selectpicker('refresh');
	}) 
	$('#getcode').click(function(){
		if($(this).hasClass('disable')) return ;
		var binds = $('#binds').val();
		var captcha = $('#captcha').val();
		if(binds == "") {
			alert('请输入手机号');
			$('#binds').focus();
			return false;
		}
		if(captcha == "") {
			alert('请输入图形验证码');
			$('#captcha').focus();
			return false;
		}
		if(captcha.length < 4) {
			alert('请输入正确图形验证码');
			$('#captcha').focus();
			return false;
		}
		$.getJSON(util.ajaxurl('binds'),{binds:binds,captcha:captcha},function(result){
			if(result.status == false){
				alert(result.message);
			}else{
				$('#getcode').addClass('disable');
				var i=60;
				var interval=window.setInterval(
					function() {
						if(i == 0) {
							$('#getcode').val('获取验证码');
							$('#getcode').removeClass('disable');
							clearInterval(interval);
						} else {
							$('#getcode').val('重新发送('+i+')');
							i--;
						}
					},1000);


			}
		});
	});
	$('#binds').blur(function(){
		var binds = $('#binds').val();
		if(binds != ""){
			$.getJSON(util.ajaxurl('valibind'),{binds:binds},function(result){
				if(result.status == true){
					$("#binds").next('.vali_icon').removeClass('vali_error').addClass('vali_ok');
				}else{
					$("#binds").next('.vali_icon').removeClass('vali_ok').addClass('vali_error');
				}
			});
		}else{
			$("#binds").next('.vali_icon').removeClass('vali_ok').addClass('vali_error');
		}
	})
	$('#captcha').blur(function(){
		var captcha = $('#captcha').val();
		if(captcha != ""){
			$.getJSON(util.ajaxurl('valicaptcha'),{captcha:captcha},function(result){
				if(result.status == true){
					$("#captcha").parent().find('.vali_icon').removeClass('vali_error').addClass('vali_ok');
				}else{
					$("#captcha").parent().find('.vali_icon').removeClass('vali_ok').addClass('vali_error');
				}
			});
		}else{
			$("#captcha").parent().find('.vali_icon').removeClass('vali_ok').addClass('vali_error');
		}
	})

	$('.captcha_img').click(function(){
		$(this).attr('src',util.ajaxurl('captcha') + '?' +Math.random());
	});
	/*$('#upload_picture_avatar').uploadify({
		"swf"             : _assets+"lib/uploadify/uploadify.swf",
		"fileObjName"     : "Filedata",
		"buttonText"      : "上传头像",
		"uploader"        : _UPLOAD_PICTURE,
		"height"          : 41,
		"width"           : 160,
		'removeTimeout'	  : 150,
		'fileTypeExts'	  : '*.jpg; *.png; *.gif;',
		"onUploadSuccess" : function(file, data, response) {
	        var data = $.parseJSON(data);
			var src = '';
			if(data.status){									
				$('.perfect-avatar').attr('src',_path + data.path);
				$('#cover_id_avatar').val(data.path);
			} else {
				alert(data.info);
			}
	    },
		"onUploadError" : function(file, data, response) {

	    }
	});*/
	
	$("#perfect").on('submit',this,function(){
		if($('#nickname').val() == ""){
			alert('昵称不能为空');
			$("#nickname").focus();
			return false;
		}
		if($('#binds').val() == ""){
			alert('请输入手机号!');
			$("#binds").focus();
			return false;
		}
		if($('#code').val() == ""){
			alert('请输入收到的验证码!');
			$("#code").focus();
			return false;
		}
		if($('#question1').val() == ""){
			alert('请选择密保问题一!');
			return false;
		}
		if($('#question2').val() == ""){
			alert('请选择密保问题二!');
			return false;
		}
		if($('#answer1').val() == ""){
			alert('请填写密保问题一的答案!');
			return false;
		}
		if($('#answer2').val() == ""){
			alert('请填写密保问题二的答案!');
			return false;
		}
		return true;
	});
})