define(function(require){
	var $ = require('jquery'),util=require('util'),
	//uploadmatch=require('libs/uploadmatch'),
	dialog=require('dialog/dialog'),
	citydata=require('libs/citydata'),
	cityselect=require('libs/cityselect');
	require('canvasToBlob');
	cityselect($);
	require('fileinput');
	var send_load = 0;
	//var _upload_url = upload_url.replace('ticket.html',''); 
	var w = $(window).width();
	$('.upload-img-icon').css({left: (w-128)/2 + 'px'})

	var first = true;//首次设置封面图片
	//var fileNames = [];//上传的图片名字
	$("#upload-btn").fileinput({
	    uploadUrl: _UPLOAD_MATCH, // server upload action
	    uploadAsync: true,
	    maxFileCount: 15,
	    browseOnZoneClick: true,
	    showRemove: false,
	    showClose: false,
	   // browseIcon: '',
	    browseLabel: '更多图片',
	    allowedFileExtensions: ['jpg','png'],
	    layoutTemplates: {
			footer: '<div class="file-thumbnail-footer">\n' +
			        '    <div class="file-caption-name" style="width:{width};height:38px;line-height:38px;">设为封面</div>\n' +
			        '<i class="item-checkbox"></i> '+
			        '</div>',
			progress: '',
			modalMain: '',
			modal: ''
		}
	}).on('change', function(event){
    	//处理界面转换
    	if($('.upload-imgs').hasClass('upload-box')){
    		$(".upload-imgs").removeClass('upload-box').addClass('upload-work');
    		$('.upload-data').show();
    	}
	}).on('fileimagesloaded', function(event){
		if(first){
			$('.file-preview-frame:first-child').find('.item-checkbox').addClass('checkbox-checked');
			first = false;
		}
	}).on('fileuploaded', function(event,data){
        var result = data.response,
        	index = result.file_id,
        	$preview = $('.file-preview-frame[data-fileindex=' + index + ']');

		if(result.status == 1){
        	$('<input type="hidden" name="data[images][]" value="'+result.ticket+'" class="imguploaded"/>').appendTo($('form'));
        	$('img[title="' + data.filenames[parseInt(result.file_id)] + '"]').data('thumbPath', result.thumb_path);
        }else{
			var tip = dialog({title:"提示",content:result.info,width:300,fixed:true,modal:true,ok:function(){
				if($preview.find('.item-checkbox').hasClass('checkbox-checked')){
					first = true;
				}
				$preview.remove();
			}});
        	tip.show();
        }
	});
	//选择的封面
	$('.file-preview-thumbnails').click(function(event){
		var $target = $(event.target),
			itemid = $target.parents('.file-preview-frame').data('fileindex'),
			$checkbox = $target.parents('.file-preview-frame').find('.item-checkbox');
		if(!$checkbox.hasClass('checkbox-checked')){
			$('.item-checkbox').removeClass('checkbox-checked');
			$checkbox.addClass('checkbox-checked');
		}else{
			$checkbox.removeClass('checkbox-checked');
		}
	});
	$('#province, #city').cityselect({
        data    : citydata,
        id      : 'id',
        children: 'cities',
        name    : 'name',
        metaTag : 'name',
    });
	require('select');
	$('#province').change(function(){
		$('#city').selectpicker('refresh');
	});
	$('#upload-match').on('submit',this,function(){ return false;});
	var sendcode = 0;
 	$('.upload-submit').click(function(){
		if(sendcode == 1) return false;
 		//验证.
 		var title = $('#title').val();
 		var intro = $('#intro').val();
 		if(title == ""){
 			alert('请用一句话描述您的作品');
 			$('#title').focus();
 			return false;
 		}
 		if(intro == ""){
 			alert('请把您的作品描述的详细一些');
 			$('#intro').focus();
 			return false;
 		}
 		var imguploaded = $('.imguploaded');
 		if(imguploaded.length == 0){
 			alert('未上传作品');
 			return false;
 		}
 		var checked = false;//是否选择封面
 		$('.item-checkbox').each(function(){
 			if($(this).hasClass('checkbox-checked')){
 				var img = $(this).parents('.file-preview-frame').find('img');
 				$('#matchthumb').val(img.data('thumbPath'));
 				checked = true;
 				return false;
 			}

 		});
 		if(!checked){
 			alert('请选择封面图片');
 			return false;
 		}

 		var post_data = $('#upload-match').serialize();
 		sendcode = 1;
 		$.post(util.ajaxurl('sendmatch'),post_data,function(result){
 			sendcode = 0;
 			if(result.status == true){
				var alertdt = dialog({title:"投稿成功",content:result.message,fixed:true,width:200,modal:true,ok:function(){
 					location.href = result.data.url;
 				}});
        		alertdt.show();		
 			}else{	
				var alertdt = dialog({title:"投稿错误",content:result.message,fixed:true,width:200,modal:true});
        		alertdt.show();		
 			}
 		},'json');
 		return false;
 	})
})