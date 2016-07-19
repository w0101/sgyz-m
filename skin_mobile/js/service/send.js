define(function(require){
	var $ = require('jquery'),util=require('util');
	//$.uploadify = require('libs/uploadifys');
	require('select');
	/*$('.selectpicker').selectpicker({
	  style: 'btn-info',
	  size: 4
	});*/

 	//发布所需积分等于服务积分
 	var top_check = false;
 	$('#fee').keyup(function(){
 		var fee = parseInt($(this).val()) ? parseInt($(this).val()) : 0;
 		if(top_check){
 			fee+= _top_fee;
 		}
 		var $fee_div = $("#fee_div");
		$("#fee_div>span").text(fee+"积分");
		if(fee > _integral){
			$fee_div.find('p').show();
		}else{
			$fee_div.find('p').hide();
		}
	});
 	//添加了置顶积分
 	$('#top').click(function(){
 		var fee = parseInt($('#fee').val()) ? parseInt($('#fee').val()) : 0;
 		var $fee_div = $("#fee_div");
 		if($(this).prop("checked")){
 			fee = fee + _top_fee;
 			top_check = true;
 		}else{
 			top_check = false;
 		}
		$("#fee_div>span").text(fee+"积分");
		if(fee > _integral){
			$fee_div.find('p').show();
		}else{
			$fee_div.find('p').hide();
		}
 	})

 	var send_load = 0;
 	$('.send-service').click(function(){
 		if(send_load == 1) return false;
 		//验证.
 		var title = $('#title').val();
 		var intro = $('#intro').val();
 		var qq = $('#qq').val();
 		var mobile = $('#mobile').val();
 		var fee = parseInt($('#fee').val());
 		if(title == ""){
 			alert('请用一句话概括您要做什么');
 			$('#title').focus();
 			return false;
 		}
 		if(intro == ""){
 			alert('请把需求描述的详细一些');
 			$('#intro').focus();
 			return false;
 		}
 		if(fee < _min_fee){
 			alert('服务报酬不能小于'+_min_fee+"积分");
 			$('#fee').focus();
 			return false;
 		}
 		if(qq == ""){
 			alert('请填写QQ号方便接单人员联系.');
 			$('#qq').focus();
 			return false;
 		}
 		if(mobile == ""){
 			alert('请填写手机号码方便接单人员联系.');
 			$('#mobile').focus();
 			return false;
 		}
 		var post_data = $('#service_send').serialize();
 		send_load = 1;
 		$.post(util.ajaxurl('sendservice'),post_data,function(result){
 			send_load = 0;
 			if(result.status == true){
 				alert(result.message);
 				location.href = result.data.url;
 			}else{
				alert(result.message); 				
 			}
 		},'json');
 	});
/*	$('#upload_picture_btn').uploadify({
		"swf"             : _skin+"js/lib/uploadify/uploadify.swf",
		"fileObjName"     : "Filedata",
		"buttonText"      : "      ",
		"uploader"        : _UPLOAD_PICTURE,
		"height"          : 169,
		"width"           : 170,
		'removeTimeout'	  : 1000,
		'fileTypeExts'	  : '*.jpg; *.png; *.gif;',
		"onUploadSuccess" : function(file, data, response) {
            var data = $.parseJSON(data);
            if(data.status == 1){
            	$('#'+file.id).find('.preview_img').attr('src',_path + data.path);
            	$('<input type="hidden" name="data[images][]" value="'+data.path+'" />').appendTo($('#'+file.id));
            }
        },
		"onUploadError" : function(file, data, response) {

        }
    });*/
})