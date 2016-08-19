define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	$(".item-a-btn>a").click(function(){
		var type = $(this).attr('data-type'),id=$(this).attr('data-id');
		var parent = $(this).parent().parent().parent().parent();
		if(type == "reply"){
			var _html = '';
			
		}else if(type == "delete"){
			var wdia = dialog({
				title:"警告",content:"确定要删除这条消息/评论?此操作不可恢复!",fixed:true,okValue:"删除",cancelValue:"取消",ok:function(){
					$.getJSON(util.ajaxurl('delmsg'),{id:id},function(result){
						if(result.status == true){
							parent.remove();
							tips();
							wdia.close();
						}else{
							alert(result.message);
						}
					})
				},cancel:function(){
					wdia.close();
				}
			})
			wdia.show();
		}
	})
	tips();
	function tips(){
		var items = $('.user-message>.item');
		if(items.length < 1){
			$('.user-tips').show();
		}
	}
})