define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog'),um = require('umeditor/rule');
	//配置评论回复
	$('.sorce-list>.item>.item-info>.item-controller>.reply-btn').click(function(){
		var id = $(this).attr('data-id');
		if(id < 1) return false;
		var parent = $(this).parent().parent();
		var name = parent.find('.item-name').text();
		var content = parent.find('.item-content').text();
		$('.reply-text>span').empty();
		$('#replyid').val(id);
		$('.reply-text>span').text('回复【'+name+'】的：“'+content+'”');
		$('#reply_text').prepend($('.reply-text').clone(true));
		//$('.reply-text').hide();
		//$('.reply-btn>.reply-text').remove();
		$('#reply_text>.reply-text').show();
	})
	$('.reply-text>.close-btn').click(function(){
		$('.submit-btn>.reply-text>span').empty();
		$('#replyid').val(0);
		//$('.reply-btn.submit-btn').prepend($(this).parent());
		$('#reply_text>.reply-text').remove();
		//$('.reply-btn>.reply-text').hide();
	})
	$('#reply').on('submit',this,function(){ return false;});
	//配置编辑器
	var replyWidth = $('.bbs-reply').width();
	if(replyWidth > 500){ replyWidth = replyWidth-80;}
	window.UMEDITOR_CONFIG = {
    	UMEDITOR_HOME_URL : _skin+'js/umeditor/',
    	imageUrl:_upload_path,
    	imagePath:_dir_path,
    	imagePathFix:_base_path,
    	initialFrameWidth:replyWidth,
    	initialFrameHeight:200,
    	imageFieldName:"Filedata",
    	paragraph:{'p':''},
    	fontfamily:[{ name: 'songti', val: '宋体,SimSun'},],
    	fontsize:[14],
    	toolbar:['bold underline strikethrough forecolor']
    };
	var um = UM.getEditor('reply_text');
	var sendcode = 0;
 	$('.replybtn').click(function(){
		if(sendcode == 1) return false;
		if($(this).hasClass('disable')) return false;
 		//验证.
 		var intro = um.getContent();
 		if(intro == ""){
 			alert('帖子内容不能为空哦!');
 			um.focus();
 			return false;
 		}
 		var post_data = $('#reply').serialize();
 		sendcode = 1;
 		$.post(_ajax_url,post_data,function(result){
 			sendcode = 0;
 			if(result.status == true){
				var alertdt = dialog({title:"提示",content:result.message,fixed:true,width:200,modal:true,ok:function(){
 					location.href = result.data.url;
 				}});
        		alertdt.show();		
 			}else{	
				var alertdt = dialog({title:"错误",content:result.message,fixed:true,width:200,modal:true});
        		alertdt.show();		
 			}
 		},'json');
 		return false;
 	})
		
})