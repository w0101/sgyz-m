define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	$('.item-favicon').click(function(){
		var that = this;
		if(uid <= 0) {
			var logtip = dialog({
				title:"登录提示",
				content:"需要登录之后才可以收藏喜欢的作品哦",
				okValue:"马上登录",
				modal:true,
				cancelValue:"取消",
				fixed:true,
				ok:function(){
					location.href = _login_url;
				}
			});
			logtip.show();
		}else{
			var id = $(this).parent().parent().attr('data-id');
			$.getJSON(util.ajaxurl('favorites'),{id:id},function(result){
				if(result.status == true){
					$(that).addClass('active');
					var alerttip = dialog({
						title:"操作提示",
						content:"已经收藏到你的作品收藏中",
						okValue:"确定",
						fixed:true,
						modal:true,
						ok:function(){

							this.close();
						}
					});
					alerttip.show();
				}else{
					alert(result.message);
				}
			});
		}
	})
	$('.preview').click(function(){
		var that = this;
		var img_src = $(this).attr('src');
		//var img_width = $(this).;
		var alerttip = dialog({
			title:"图片预览",
			//width:img_width,
			modal:true,
			content:'<div class="gallery-preview"><img src="'+img_src+'" /></div>',
			okValue:"确定",
			ok:function(){
				this.close();
			}
		});
		alerttip.show();
	})
	$('.detail-down-btn').click(function(){
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
	require('waterFall')($);
	var containerWidth = $('.hot-row').width();
	var itemWidth = 0;
	if(containerWidth>768){
		itemWidth = 300;
	}else{
		itemWidth = containerWidth;
	}
	//console.log(containerWidth);
	window.onload = function () {
		$('.gallery-list').waterFall({
			container: 'hot-row',
			child: 'hot-item',
			width: itemWidth,
			gap: 10,
			minRow: 1,
			resize: false
		})
	}
})