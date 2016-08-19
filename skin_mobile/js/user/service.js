define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog'),raty=require('libs/raty');
	$('.item').on('click','.item-ok',function(){
		if(confirm('确定对方已经完成了您的需求?')){
			var id = parseInt($(this).parent().parent().attr('data-id'));
			if(id > 0){
				var that = this;
				$.getJSON(util.ajaxurl('okservice'),{id:id},function(result){
					if(result.status == true){
						alert(result.message);
						$(that).removeClass('item-ok').addClass('item-scope').html('立即评价');
					}else{
						alert(result.message);
					}
				})
			}else{
				dialog.alert('选择错误.');
			}
		}
	})
	$('.item').on('click','.item-scope',function(){
		var id = parseInt($(this).parent().parent().data('id'));
		if(id > 0){
			var item_this = this;
			$.getJSON(util.ajaxurl('opencomment'),{id:id},function(result){
				if(result.status == true){
					var tpl = '<div class="user-service-socpe">'
								+'<div class="dialog-item">'
									+'<label>服务方：</label>'
									+'<div class="item-context">'
										+'<div class="item-user-img">'
											+'<img class="img-responsive" src="'+result.data.user.avatar+'" />'
										+'</div>'
										+'<div class="item-user-info">'
											+'<div class="item-name">'+result.data.user.nickname+'</div>'
											+'<div class="item-sopce">TA的评分：<span>'+result.data.user.score+'</span></div>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<div class="dialog-item">'
									+'<label>服务评分：</label>'
									+'<div class="item-context" id="star_div"></div>'
								+'</div>'
								+'<div class="dialog-item form-group">'
									+'<label>服务评价：</label>'
									+'<textarea class="form-control" id="intro"></textarea>'
								+'</div>'
								+'<input type="hidden" id="level" value="0" />'
							+'</div>';
					var d = dialog({
						lock : true,
						title: "服务评价",
						content: tpl,
						fixed:true,
						okValue: '提交评价',
						ok: function () {
							var level = parseInt($('#level').val());
							var intro = $('#intro').val();
							var that = this;
							if(level < 1) {
								alert('请选择评分等级');
								return false;
							}
							if(intro == "") {
								alert('请输入评价内容');
								$('#intro').focus();
								return false;
							}
							var data = {id:id,level:level,intro:intro};
							$.post(util.ajaxurl('savecomment'),data,function(result){
								if(result.status == true){
									var alertdia = dialog({
										title: "提示",
										content: result.message,
										fixed:true,
										width:150,
										modal : true,
										okValue: '确 定',
										ok: function () {
											$(item_this).removeClass('item-scope').html('已结束');
											that.close();
											return true 
										}
									});
									alertdia.show();
								}else{
									var alertdia = dialog({
										title: "提示",
										content: result.message,
										fixed:true,
										width:150,
										modal : true,
										okValue: '确 定',
										ok: function () {
											return true 
										}
									});
									alertdia.show();

								}
							},'json')
							return false;
						}
					});
					d.show();
					raty.init($('#star_div'),{
						hints: ['1','2', '3', '4', '5'],
						number:5,
						path: _skin + 'img',
						starOff: 'star-off-big.png',
						starOn: 'star-on-big.png',
						size: 18,
						start: 1,
						showHalf: true,
						target: $("#level"),
						targetKeep : true,
						click: function (score, evt) {
							
						}
					});
				}else{
					alert(result.message);
				}
			})
		}else{
			alert('选择错误.');
		}
	})

})