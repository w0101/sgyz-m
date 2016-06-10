define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	$('.cart-down-btn').click(function(){
		var tiptext = "确定要下载此文件吗？继续将扣除你"+_fee+"积分!";
		if(_iscart == 1){
			tiptext = "确定要下载此文件吗？";
		}
		var wdia = dialog({
			title:"下载提示",
			content:tiptext,
			okValue:"下载",
			cancelValue:"取消",
			fixed:true,
			modal:true,
			ok:function(){
				this.close();
				$.getJSON(util.ajaxurl('down'),{id:_id},function(result){
					if(result.status == true){
						var fream = $("#fream");
						if(fream.length < 1){
							var iFrame;
							iFrame = document.createElement("iframe");  
							iFrame.setAttribute("id", 'fream');  
							iFrame.setAttribute("style", "display:none;");  
							iFrame.setAttribute("height", "0px");  
							iFrame.setAttribute("width", "0px");  
							iFrame.setAttribute("frameborder", "0");  
							document.body.appendChild(iFrame);
							var fream = $("#fream");
						}
						fream.attr('src',result.data.url);
						_iscart=1;
					}else{
						alert(result.message);
					}
				})
				return true;
			},cancel:function(){
				this.close();
			}
		});
		wdia.show();
		return false;
	})
})