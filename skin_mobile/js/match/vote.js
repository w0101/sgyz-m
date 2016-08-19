define(function(require){
	var $ = require('jquery'),
	util=require('util'),
	dialog=require('dialog/dialog');


	$('.match-detail-folder').click(function(){
		$(this).parents('.item').find('.item-intro').css({
			top:'0px'
		});
	});
	$('.item-intro').click(function(){
		$(this).css({top:'100%'});
	});

	$('.item-checkbox').click(function(){
		var itemid = $(this).data('id');
		if(!$(this).hasClass('checkbox-checked')){
			$(this).addClass('checkbox-checked');
			//发送请求到服务器.
			$.getJSON(util.ajaxurl('addvote'),{id:_id,itemid:itemid},function(result){
				if(result.status == true){
					setdata(result.data);
				}else{
					serverhalt(result);
				}
			})
		}else{
			var itemid = $(this).attr('data-id');
			$.getJSON(util.ajaxurl('delvote'),{id:_id,itemid:itemid},function(result){
				if(result.status == true){
					setdata(result.data);
				}else{
					serverhalt(result);
				}
			})
		}
	});
	var $dom = $('#vote-cart');
	var h = $(window).height();
	$dom.css({'top':(0.1 * h)+"px"});
	
	
	var _select = '<option value="">请选择投票的费用</option>';
	var vote_list = _vote_list.split(',');
	for(var i=0;i<vote_list.length;i++){
		_select += '<option value="'+vote_list[i]+'">'+(vote_list[i]>0?vote_list[i]+'积分':"免费")+'</option>';
	}
	$dom.on('click','.item-close',function(e){
		var itemid = $(this).attr('data-id');
		$.getJSON(util.ajaxurl('delvote'),{id:_id,itemid:itemid},function(result){
			if(result.status == true){
				setdata(result.data);
			}else{
				serverhalt(result);
			}
		})
	})
	$dom.on('click','.cart-controller-btn',function(e){
		if($(this).hasClass('disable')) return ;
		var data = {id:_id,item:[]};
		$dom.find('.list>.item').each(function(){
			var itemid = $(this).find('.item-close').data('id');
			var fee = $(this).find('select.select').val();
			if(fee != ""){
				data.item.push({id:itemid,fee:fee});
			}
		})
		if(data.length < _votenum){
			var alertdia = dialog({
				title:"提示",
				content:'请选择每个作品要投的票数',
				okValue:"确定",
				ok:function(){}
			});
			alertdia.show();
			return ;
		}
		util.log(data);
		$.post(util.ajaxurl('savevote'),data,function(result){
			if(result.status == true){
				alert(result.message);
				location.href = result.data.url;
			}else{
				alert(result.message);
			}
		},'json');
	})
	get_referer();
	//从服务器刷新选择的数据,'libs/tinyscrollbar'
	function get_referer(){
		$.getJSON(util.ajaxurl('getvote'),{id:_id},function(result){
			if(result.status == true){
				setdata(result.data);
			}else{
				serverhalt(result);
			}
		})
	}
	//根据投票车的数据显示到右侧
	function setdata(data){
		var item = '';
		$('.item-checkbox').removeClass('checkbox-checked');
		$dom.find('.list').empty();
		$dom.find('.cart-title>span').text(data.length);
		for (var i =0;i<data.length; i++) {
			item = '<div class="item">'
					+'<a href="javascript:void(0);" class="item-close" data-id="'+data[i].id+'"></a>'
					+'<div class="item-img">'
						+'<img class="img-responsive" src="'+_path+data[i].thumb+'" />'
						+'<div class="item-controll">'
							+'<span class="item-title one-line-ellipsis">'+data[i].title+'</span>'
							+'<a href="'+getview(data[i].userid)+'" class="item-user one-line-ellipsis">'+data[i].nickname+'</a>'
						+'</div>'
					+'</div>'
					+'<div class="item-select">'
						+'<select class="select selectpicker" data-width="100%">'+_select+'</select>'
					+'</div>'
					+'</div>';
			$(item).appendTo($dom.find('.list'));
			var cls_item = $('.cls-item-'+data[i].id);
			if(cls_item.length > 0){
				cls_item.find('.item-checkbox').addClass('checkbox-checked');
			}
		}
		require('select');
		$('select').selectpicker();
		if(data.length == _votenum){
			$dom.find('.cart-controller').show();
			$dom.find('.item-select').show();
			$dom.find('select.select').change(function(){
				var fee = 0;
				$dom.find('select.select').each(function(){
					if($(this).val() != ""){
						fee = fee + Number($(this).val());
						//util.log(Number($(this).val()));
					}
				})
				$dom.find('.cart-controller>.cart-fee>span').text(fee);
				if(fee > _integral){
					$dom.find('.cart-controller>.cart-integral>font').show();
					$dom.find('.cart-controller>.cart-controller-btn').addClass('disable');
				}else{
					$dom.find('.cart-controller>.cart-integral>font').hide();
					$dom.find('.cart-controller>.cart-controller-btn').removeClass('disable');
				}
			});
		}else{
			$dom.find('.cart-controller').hide();
			$dom.find('.list>.item>.item-select').hide();
		}
	}
	//处理服务器返回数据提示.
	function serverhalt(result){
		if(result.status == false){
			if(typeof(result.data.url) == "undefined"){
				var alertdia = dialog({
					title:"提示",
					fixed:false,
					content:result.message,
					okValue:"确定",
					ok:function(){}
				});
				alertdia.show();
			}else{
				var alertdia = dialog({
					title:"提示",
					content:result.message,
					okValue:"前往",
					ok:function(){
						//location.href = result.data.url;
					}
				});
				alertdia.show()
			}
		}
	}
	//生成用户详情链接
	function getview(uid){
		return _viewurl.replace('_id_',uid);
	}
})