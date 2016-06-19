define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog'),um = require('umeditor/rule');
	//$.chosen=require('libs/chosen');
	//$('#upload-match').on('submit',this,function(){ return false;});
	var fidsel = $('.select-fid');
	_fee = parseInt(_fee);
	$('.select-cat').change(function(){
		var val = $(this).val();
		$('.send-bbs').removeClass('disable');
		if(val != ""){
			$.each(_cat,function(index,item){
				if(item.id == val){
					_theme = item.theme;
					return ;
				}
			})
			fidsel.empty();
			$('<option value="">选择帖子主题</option>').appendTo(fidsel);
			$.each(_theme,function(index,item){
				$('<option value="'+item.id+'">'+item.name+'</option>').appendTo(fidsel);
			})
			fidsel.trigger('chosen:updated');
		}
	})
	$('.select-fid').change(function(){
		var val = $(this).val();
		var fid;
		$.each(_theme,function(index,item){
			if(item.id == val){
				fid = item;
				return ;
			}
		})
		var fee = parseInt(fid.fee);
		var _html = '';
		if(fee > 0){
			if(_fee > fee){
				_html = '发帖需要扣除'+ fee+'积分';
			}else{
				$('.send-bbs').addClass('disable');
				_html = '发帖需要扣除'+ fee+'积分，<span>积分不足</span>';
			}
			if(fid.pass == 1){
				_html += '，发表此主题的帖子需要审核.'
			}
			$('.fee-tips').html(_html).show();
		}
	});
	//$('.select').chosen({disable_search_threshold:1000});
	//配置编辑器
	var editorWidth = $('.bbs-post').width();
	window.UMEDITOR_CONFIG = {
    	UMEDITOR_HOME_URL : _skin+'js/umeditor/',
    	imageUrl:_upload_path,
    	imagePath:_dir_path,
    	imagePathFix:_base_path,
    	initialFrameWidth:editorWidth,
    	initialFrameHeight:300,
    	imageFieldName:"Filedata",
    	paragraph:{'p':''},
    	fontfamily:[{ name: 'songti', val: '宋体,SimSun'},],
    	fontsize:[12, 14, 16, 18, 20, 24],
    	toolbar:['undo redo | bold italic underline strikethrough | forecolor backcolor |','insertorderedlist insertunorderedlist | selectall cleardoc | fontfamily fontsize' ,'| justifyleft justifycenter justifyright justifyjustify |','horizontal fullscreen']
    };
	var um = UM.getEditor('intro');
	var sendcode = 0;
 	$('.send-bbs').click(function(){
		if(sendcode == 1) return false;
		if($(this).hasClass('disable')) return false;
 		//验证.
 		var title = $('#title').val();
 		var intro = um.getContent();
 		if(title == ""){
 			alert('请用一句话描述你想说些什么？');
 			$('#title').focus();
 			return false;
 		}
 		if(intro == ""){
 			alert('帖子内容不能为空哦!');
 			um.focus();
 			return false;
 		}
 		var post_data = $('#bbs_send').serialize();
 		sendcode = 1;
 		$.post(util.ajaxurl('sendbbs'),post_data,function(result){
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