define(function(require,exports){
	var $=require('jquery');
	if($('.gallery-category-list').height()>102){
		$('#show-category').removeClass('hidden');
		$('#show-category').on('click',function(){
			$('.gallery-category').toggleClass('slide');
			$('#show-category').toggleClass('show-down show-up');
		});
	}

	var util=require('util'),dialog=require('dialog/dialog');
	$('.item .item-favicon').click(function(){
		var that = this;
		if(uid <= 0) {
			var logtip = dialog({
				title:"登录提示",
				content:"需要登录之后才可以收藏喜欢的作品哦",
				okValue:"马上登录",
				modal:true,
				cancelValue:"取消",
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
})