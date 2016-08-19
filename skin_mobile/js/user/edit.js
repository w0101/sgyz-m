define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog'),
			birthday=require('libs/birthday'),citydata=require('libs/citydata'),
			cityselect=require('libs/cityselect'),setType='mobile';
	//$.uploadify = require('libs/uploadify');
	cityselect($);
    birthday({
        YearSelector: ".sel_year",
        MonthSelector: ".sel_month",
        DaySelector: ".sel_day"
  	});

	$('#province, #city').cityselect({
        data    : citydata,
        id      : 'id',
        children: 'cities',
        name    : 'name',
        metaTag : 'name',
        selected : [province,city],
    });
    require('select');
    $('#province').change(function(){
    	$('#city').selectpicker('refresh');
    })
    $('.sel_month').change(function(){
    	$('.sel_day').selectpicker('refresh');
    })

	$('.setting-msgtext>.close').click(function(){
		$(".setting-msgtext").hide(100);
	});
	//新的方法
	//TODO 此功能有一堆问题待解决.下一步发送验证码时,没有把用户输入的信息发送给服务器,没有处理快速输入时的冲突.第二步没有验证数据有效性.
	$('.set-bind').click(function(){
		setType = $(this).attr('data-type');
		var setVal = $(this).attr('data-val');
		$.getJSON(util.ajaxurl('setbind'),{type:setType},function(result){
			var $container,$nextcontainer;
			if(result.status == true){
				if(setVal == ""){
					//绑定新的资料
					var d = dialog({
						lock : true,
						title: result.data.title,
						content: result.data.content,
						fixed:true,
						modal:true,
						button:[
							{id:'success',value:'绑 定',callback:function(){
								$nextcontainer = $('.dialog-setmobile');
								var me = this;
								//点击完成时验证数据.
								var bindval = $('#mobile',$nextcontainer).val();
								var captcha = $('#captcha',$nextcontainer).val();
								var code = $('#code',$nextcontainer).val();
								if(bindval == "") {
									alert(setType == 'mobile' ? '请输入要绑定的手机号码!' : '请输入要绑定的邮箱地址!');
									$('#mobile',$nextcontainer).focus();
									return false;
								}
								if(captcha == "") {
									alert('请输入图形验证码');
									$('#captcha',$nextcontainer).focus();
									return false;
								}
								if(captcha.length < 4) {
									alert('请输入正确的图形验证码');
									$('#captcha',$nextcontainer).focus();
									return false;
								}
								if(code == "") {
									alert('请输入短信验证码');
									$('#code',$nextcontainer).focus();
									return false;
								}
								if(code.length < 6) {
									alert('请输入正确的短信验证码');
									$('#code',$nextcontainer).focus();
									return false;
								}
								var data = {};
								data = {
									code:code,
									bindval:bindval,
									type:setType
								}
								$.post(util.ajaxurl('savebinds'),data,function(result){
									if(result.status == true){
										$('#'+setType+'_p').html(bindval);
										var tip = dialog({title:"提示",content:result.message,width:300,fixed:true,modal:true,ok:function(){
											me.close();
											return true;
										}});
										tip.show();
									}else{
										alert(result.message);
									}
								},'json');
								
								return false;
							}}
						],
					});
					d.show();
					$container = $('.dialog-setmobile');
					
					$('#captcha',$container).blur(blurcaptcha);
					$('#bindval',$container).blur(blurmobile);
					$('#getcode',$container).click(function(){
						var el = this,type='';
						if($(this).hasClass('disable')) return ;
						//type=$('.valiselect').val();
						if($('.valiselect').length > 0){
							type=$('.valiselect').val();
						}else{
							type=$('.dialog-setmobile').data('type');
						}
						util.log(type);
						if(type != 'mobile' && type !='email') return ;
						var captcha = $('#captcha',$container).val();
						var bindmobile = $('#mobile',$container).val();
						if(captcha == "") {
							alert('请输入图形验证码');
							$('#captcha',$container).focus();
							return false;
						}
						if(captcha.length < 4) {
							alert('请输入正确图形验证码');
							$('#captcha').focus();
							return false;
						}
						$.getJSON(util.ajaxurl('getbinds'),{type:type,captcha:captcha,bindval:bindmobile},function(result){
							if(result.status == false){
								alert(result.message);
							}else{
								$(el).addClass('disable');
								var i=60;
								var interval=window.setInterval(
									function() {
										if(i == 0) {
											$(el).val('获取验证码');
											$(el).removeClass('disable');
											clearInterval(interval);
										} else {
											$(el).val('重新发送('+i+')');
											i--;
										}
									},1000);
							}
						});
					});
					$('#refe_captcha',$container).click(function(){
						$(this).attr('src',util.ajaxurl('captcha') + '?' +Math.random());
					});
				}else{
					var d = dialog({
						lock : true,
						title: result.data.title,
						content: result.data.content,
						fixed:true,
						modal:true,
						button:[
							{id:'next',value:'下一步',callback:function(){
								var type=$('select.valiselect',$container).val(),data,me=this;
								util.log(type);
								//验证当前条件.
								if(type == 'question'){
									var question1 = $('#question1',$container).val();
									var question2 = $('#question2',$container).val();
									if(question1 == ""){
										alert('请输入密保问题一的答案');
										$('#question1',$container).focus();
										return false;
									}
									if(question2 == ""){
										alert('请输入密保问题二的答案');
										$('#question2',$container).focus();
										return false;
									}
									data = {
										type:type,
										question1:question1,
										question2:question2,
									};
								}else{
									var captcha = $('#captcha',$container).val();
									var code = $('#code',$container).val();
									if(captcha == "") {
										alert('请输入图形验证码');
										$('#captcha').focus();
										return false;
									}
									if(captcha.length < 4) {
										alert('请输入正确的图形验证码');
										$('#captcha',$container).focus();
										return false;
									}
									if(code == "") {
										alert('请输入短信验证码');
										$('#code',$container).focus();
										return false;
									}
									if(code.length < 6) {
										alert('请输入正确的短信验证码');
										$('#code',$container).focus();
										return false;
									}
									data = {
										type:type,
										captcha:captcha,
										code:code,
									};
								}

								$.getJSON(util.ajaxurl('valibinds'),data,function(result){
									if(result.status == false){
										if(type == 'question'){
											if(result.data.id == "1"){
												$('#question1',$container).focus();
											}else if(result.data.id == "2"){
												$('#question2',$container).focus();
											}
										}
										alert(result.message);
									}else{
										$container.hide();
										$('#bindval',$nextcontainer).blur(blurmobile);
										$('#captcha',$nextcontainer).blur(blurcaptcha);
										//绑定刷新验证码.
										$('#refe_captcha',$nextcontainer).click(function(){
											$(this).attr('src',util.ajaxurl('captcha') + '?' +Math.random());
										});
										me._popup.find('[i-id=success]').removeAttr('disabled');
										me._popup.find('[i-id=next]').attr('disabled',true);
										$('#refe_captcha',$nextcontainer).trigger('click');
										$nextcontainer.show();
										//绑定获取新验证码
										$('#getcode',$nextcontainer).click(function(){
											var bindval = $('#bindval',$nextcontainer).val(),captcha = $('#captcha',$nextcontainer).val(),el=this;
											if(bindval == "") {
												alert(setType == 'mobile' ? '请输入要绑定的手机号码!' : '请输入要绑定的邮箱地址!');
												$('#bindval',$nextcontainer).focus();
												return false;
											}
											if(captcha == "") {
												alert('请输入图形验证码');
												$('#captcha',$nextcontainer).focus();
												return false;
											}
											if(captcha.length < 4) {
												alert('请输入正确的图形验证码');
												$('#captcha',$nextcontainer).focus();
												return false;
											}
											$.getJSON(util.ajaxurl('getbinds'),{type:setType,captcha:captcha},function(result){
												if(result.status == false){
													alert(result.message);
												}else{
													$(el).addClass('disable');
													var i=60;
													var interval=window.setInterval(
														function() {
															if(i == 0) {
																$(el).val('获取验证码');
																$(el).removeClass('disable');
																clearInterval(interval);
															} else {
																$(el).val('重新发送('+i+')');
																i--;
															}
														},1000);
												}
											});
										});
									}
								});
								return false;
							},display:true},
							{id:'success',value:'完 成',callback:function(){
								var me = this;
								//点击完成时验证数据.
								if($nextcontainer.is(":visible") == true){
									var bindval = $('#bindval',$nextcontainer).val();
									var captcha = $('#captcha',$nextcontainer).val();
									var code = $('#code',$nextcontainer).val();
									if(bindval == "") {
										alert(setType == 'mobile' ? '请输入要绑定的手机号码!' : '请输入要绑定的邮箱地址!');
										$('#bindval',$nextcontainer).focus();
										return false;
									}
									if(captcha == "") {
										alert('请输入图形验证码');
										$('#captcha',$nextcontainer).focus();
										return false;
									}
									if(captcha.length < 4) {
										alert('请输入正确的图形验证码');
										$('#captcha',$nextcontainer).focus();
										return false;
									}
									if(code == "") {
										alert('请输入短信验证码');
										$('#code',$nextcontainer).focus();
										return false;
									}
									if(code.length < 6) {
										alert('请输入正确的短信验证码');
										$('#code',$nextcontainer).focus();
										return false;
									}
									var data = {};
									data = {
										code:code,
										bindval:bindval,
										type:setType
									}
									$.post(util.ajaxurl('savebinds'),data,function(result){
										if(result.status == true){
											var tip = dialog({title:"提示",content:result.message,width:300,fixed:true,modal:true,ok:function(){
												me.close();
												return true;
											}});
											tip.show();
										}else{
											alert(result.message);
										}
									},'json');
								}else{
									alert('错误操作!');
								}
								return false;
							},disabled:true}
						],
					});
					d.show();
					$container = $('.dialog-setmobile');
					$nextcontainer = $('.dialog-setnext');
					$('select.valiselect').change(function(e){
						util.log($(this).val());
						var val = $(this).val();
						if(val == 'question'){
							$('.question-item').show();
							$('.captcha-item,.valicode-item').hide();
						}else{
							$('.captcha-item,.valicode-item').show();
							$('.question-item').hide();
						}
					})
					$('.valiselect',$container).selectpicker({
						width:'260px'
					});
					$('#captcha',$container).blur(blurcaptcha);
					$('#getcode',$container).click(function(){
						var el = this,type='';
						if($(this).hasClass('disable')) return ;
						//type=$('.valiselect').val();
						if($('select.valiselect').length > 0){
							type=$('select.valiselect').val();
						}else{
							type=$('.dialog-setmobile').data('type');
						}
						util.log(type);
						if(type != 'mobile' && type !='email') return ;
						var captcha = $('#captcha',$container).val();
						if(captcha == "") {
							alert('请输入图形验证码');
							$('#captcha',$container).focus();
							return false;
						}
						if(captcha.length < 4) {
							alert('请输入正确图形验证码');
							$('#captcha').focus();
							return false;
						}
						$.getJSON(util.ajaxurl('getbinds'),{type:type,captcha:captcha},function(result){
							if(result.status == false){
								alert(result.message);
							}else{
								$(el).addClass('disable');
								var i=60;
								var interval=window.setInterval(
									function() {
										if(i == 0) {
											$(el).val('获取验证码');
											$(el).removeClass('disable');
											clearInterval(interval);
										} else {
											$(el).val('重新发送('+i+')');
											i--;
										}
									},1000);
							}
						});
					});
					$('#refe_captcha',$container).click(function(){
						$(this).attr('src',util.ajaxurl('captcha') + '?' +Math.random());
					});
				}
			}else{
				alert(result.message);
			}
		});
	});
	/*$('#upload_picture_avatar').uploadify({
		"swf"             : _assets+"lib/uploadify/uploadify.swf",
		"fileObjName"     : "Filedata",
		"buttonText"      : "上传头像",
		"uploader"        : _UPLOAD_PICTURE,
		"height"          : 41,
		"width"           : 160,
		'removeTimeout'	  : 0,
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
		"onUploadError" : function(file, data, response) {}
    });*/
    //提交检测
    $('#user_edit').on('submit',this,function(){
    	var nickname = $('#nickname').val();
		if(nickname == ""){
			alert('昵称不能为空哦!');
			return false;
		}
		if(nicknamenum > 0){
			if(nickname.length > nicknamenum){
				alert('昵称长度不能超过'+nicknamenum+'位!');
				return false;
			}
		}
		//检测生日
		var year = $("select.sel_year").val();
		var month = $("select.sel_month").val();
		var day = $("select.sel_day").val();
		if(year == "" || month == "" || day == ""){
			alert('请选择生日.');
			return false;
		}else{
			$('#birthday').val(year+"-"+month+"-"+day);
		}
		return true;
    })
	function blurmobile(e){
		var $target=$(e.target),binds = $target.val();
		if(binds != ""){
			$.getJSON(util.ajaxurl('valibind'),{binds:binds},function(result){
				if(result.status == true){
					$target.next('.vali_icon').removeClass('vali_error').addClass('vali_ok');
				}else{
					$target.next('.vali_icon').removeClass('vali_ok').addClass('vali_error');
				}
			});
		}else{
			$target.next('.vali_icon').removeClass('vali_ok').addClass('vali_error');
		}
	}
	function blurcaptcha(e){
		var $target=$(e.target),captcha = $target.val();
		if(captcha != ""){
			$.getJSON(util.ajaxurl('valicaptcha'),{captcha:captcha},function(result){
				if(result.status == true){
					$target.parent().find('.vali_icon').removeClass('vali_error').addClass('vali_ok');
				}else{
					$target.parent().find('.vali_icon').removeClass('vali_ok').addClass('vali_error');

				}
			});
		}else{
			$target.parent().find('.vali_icon').removeClass('vali_ok').addClass('vali_error');
		}
	}

})