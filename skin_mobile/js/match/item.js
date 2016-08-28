define(function(require){
	var $ = require('jquery'),
	util=require('util'),
	dialog=require('dialog/dialog');
	var cityData = require('libs/citydata');
	$('.match-detail-folder').click(function(){
		$(this).parents('.item').find('.item-intro').css("top","0");
	})
	$('.item-intro').click(function(){
		$('.item-intro').css("top","100%");
	})
	//图片预览的处理
	var _mask = '<div class="preview-mask"></div>',
		_html = $('#htmltpl').html(),
		styleEl = $('<style type="text/css" id="styleID"></style>');
	var h,bh,w,ul_w,index;
	var BASESCORE = 1;
	styleEl.appendTo($('head'));
	$(_mask).appendTo($('body'));
	$(_html).appendTo($('body'));
	setWh();
	var id = 0,
		el = $('.preview-images'),
		maskel = $('.preview-mask'),
		eltag = el.find('.images-intro>.intro-tag'),
		elimg = el.find('.images-box>ul'),
		elimgbtn = el.find('.images-box>.btnbig'),
		picpath = _upload_url.replace('ticket.html',''),
		len=0
	$('.prod-list .item-img').click(function(){
		$('body').addClass('ovh').css('height',h+'px');
		id = $(this).data('id');
		maskel.show();
		$.getJSON(util.ajaxurl('preview'),{id:parseInt(id)},function(result){
			maskel.hide();
			if(result.status == true){
				var data  = result.data;
				var provinceId = data.item.province,
					cityId = data.item.city;
				var procince = '', city = '';
				for(var i = 0; i < cityData.length; i++){
					if(cityData[i].id == provinceId){
						province = cityData[i].name;
						var cities = cityData[i].cities;
						for(var j = 0; j < cities.length; j++){
							if(cities[j].id == cityId){
								city = cities[j].name;
								break;
							}
						}
						break;
					}
				}
				eltag.empty();
				elimg.empty();
				elimgbtn.empty();
				el.find('.icon-view').text(data.item.hit);
				el.find('.user-img>img').attr('src',_path + data.user.avatar);
				el.find('.user-name').text(data.user.nickname);
				el.find('.user-fans').text(data.user.fans);
				el.find('.user-match').text(data.user.match);
				el.find('.item-title').text(data.item.title);
				el.find('.item-total').text('1/'+data.item.images.length);
				el.find('.intro-location').text(province + ' ' + city + ' ' + data.item.place);
				el.find('.intro-text').text(data.item.intro);
				$.each(data.item.tag,function(index,item){
					if(item != ""){
						$('<span></span>').text(item).appendTo(eltag);
					}
				});
				$.each(data.item.images,function(index,item){
					$('<li><img class="img-responsive" src="'+(picpath + item)+'" alt="'+data.item.title+'" /></li>').appendTo(elimg);
					$('<span></span>').appendTo(elimgbtn);
				});
				//显示票数
				var all_votes = 0;
				all_votes = parseFloat(data.item.origin/10) + parseFloat(data.item.story/10) + parseFloat(data.item.tech/10) + BASESCORE;
				el.find('.all_pf').html(all_votes + '分');
				el.find('.story>.detail-vote').text((data.item.story/10) + '分');
				el.find('.story>.detail-star').removeClass().addClass('detail-star').addClass('star-'+(data.item.story));
				el.find('.origin>.detail-vote').text((data.item.origin/10) + '分');
				el.find('.origin>.detail-star').removeClass().addClass('detail-star').addClass('star-'+(data.item.origin));
				el.find('.tech>.detail-vote').text((data.item.tech/10) + '分');
				el.find('.tech>.detail-star').removeClass().addClass('detail-star').addClass('star-'+(data.item.tech));
				displayComment(data);
				if(data.item.votes != false){
					el.find('.truevotes').show().find('.info-value').text(data.item.votes+'票');
					if(all_votes > 0){
						el.find('.allvotes').show().find('.info-value').text((data.item.votes * all_votes)+'票');
					}else{
						el.find('.allvotes').show().find('.info-value').text(data.item.votes+'票');
					}
					el.find('.vote-desc').show();
				}else{
					el.find('.truevotes').hide();
					el.find('.allvotes').hide();
					el.find('.vote-desc').hide();
				}
				//绑定控制动画.
				$(".preview-images>.images-box>.btnbig>span").mouseenter(function() {
					index = $(".preview-images>.images-box>.btnbig>span").index(this);
					showPics(index);
				})
				$(".preview-images>.images-box>.btnbig>span").eq(0).addClass('on');
				len = data.item.images.length;
				elimg.css({"width":ul_w * len});
				index = 0;
				maskel.hide();
				el.show();
			}else{
				var tip = dialog({title:"提示",content:result.message,width:300,fixed:true,modal:true,ok:function(){}});
            	tip.show();
				$('body').removeClass('ovh').css('height',bh+'px'); //显示滚动条
			}
		});
	});
	$(".preview-images>.images-box>.prev").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});
	//下一页按钮
	$(".preview-images>.images-box>.next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});
	//绑定关闭事件
	el.find('.icon-close').click(function(){
		$('body').removeClass('ovh').css('height',bh+'px'); //显示滚动条
		el.hide();

	});
	//绑定查看exif信息
	el.find('.intro-exif').click(function(){
		var img_ticket= '';
		var img = $(".preview-images>.images-box>ul>li").eq(index).find('img').attr('src');
		img_ticket = img.replace(picpath,'');
		$.getJSON(util.ajaxurl('exif'),{ticket:img_ticket},function(result){
			if(result.status == true){
				var tip = dialog({
					title:"图片exif信息",
					content:result.data.html,fixed:true,modal:true,ok:function(){}});
            	tip.show();
			}else{
				var tip = dialog({title:"提示",content:result.message,fixed:true,modal:true,ok:function(){}});
            	tip.show();
			}
		});

	});
	//绑定查看投票信息
	el.find('.vote-desc').click(function(){
		$.getJSON(util.ajaxurl('getvotes'),{id:id},function(result){
			var html = [];
			if(result.status == true){
				if(result.data.vote.length>0){
					var vote = result.data.vote;
					$.each(vote,function(index,item){
						html.push('<div class="vote-item col-sm-4 col-xs-12"><div class="row"><div class="item-img col-xs-3 col-sm-3"><img class="img-responsive" src="'+_path + item.avatar+'" /></div><div class="item-intro col-sm-9 col-xs-9"><div class="item-name one-line-ellipsis">'+item.nickname+'</div><span class="item-vote">'+item.vote+'票</span> </div> </div></div>');
					});
				}
				var all_html = '<div class="vote-list row">'+html.join('')+'</div>';
				var tip = dialog({
					title:"投票详情",
					content:all_html,
					width: 0.8*w,
					fixed: true,
					modal:true,ok:function(){}});
            	tip.show();
			}else{
				var tip = dialog({title:"提示",content:result.message,fixed:true,modal:true,ok:function(){}});
            	tip.show();
			}
		});

	});
	el.find('.vote-cal').click(function(){
		var tip = dialog({
			title:"综合得票计算方式",
			content:'<p>综合得票由官方评分*用户投票分数得出。其中官方评分中故事3倍、创意3倍、构图3倍、得票基数1倍共10倍。</p>',
			width: 0.8*w,
			fixed: true,
			modal:true,ok:function(){}});
    	tip.show();
	});
	//绑定回复事件
	el.find('.intro-btn').click(function(){
		var intro = el.find('#comment_intro').val();
		if(intro == '' || intro == '评论一下') {
			var tip = dialog({title:"提示",content:'输入点有意义的评论吧!作者期待中..',width:300,fixed:true,modal:true});
            tip.show();
            return false;
		}
		var replyid = parseInt($('#replyid',el).val());
		var post_data = {id:id,intro:intro,replyid:replyid};
		$.post(util.ajaxurl('sendmatchcomment'),post_data,function(result){
 			sendcode = 0;
 			if(result.status == true){
 				el.find('#comment_intro').val('');
				var alertdt = dialog({title:"提示",content:result.message,fixed:true,width:200,modal:true,ok:function(){
 					$.getJSON(util.ajaxurl('getmatchcomment'),{id:id},function(result){
 						if(result.status == true){
 							displayComment(result.data);
 						}else{
 							var tip = dialog({title:"提示",content:result.message,width:300,fixed:true,modal:true,ok:function(){}});
            				tip.show();
 						}
 					});
 				}});
        		alertdt.show();		
 			}else{	
				var alertdt = dialog({title:"错误",content:result.message,fixed:true,width:200,modal:true,ok:function(){}});
        		alertdt.show();		
 			}
 		},'json');
	});
	//绑定评论显示回复
	el.on('mouseover','.comment-list .item-text',function(){
		$(this).find('.reply').show();
	});
	el.on('mouseout','.comment-list .item-text',function(){
		$(this).find('.reply').hide();
	});
	el.on('click','.comment-list .reply',function(){
		var parid = $(this).parent().parent().parent();
		var id = parid.data('id');
		if(id){
			var text = '回复 '+parid.find('.item-name').text() + " : ";
			var thtml = parid.find('.item-text').html();
			text += thtml.replace('<span class="reply" style="display: inline;">回复</span>','');

			$('#replyid',el).val(id);
			el.find('.comment-text .reply-text p').empty().html(text).parent().show();
		}
	});
	el.on('click','.comment-text .clear-reply',function(){
		$(this).parent().find('p').empty();
		$('#replyid').val(0);
		$(this).parent().hide();
	});
	//绑定缩放重置
	$(window).resize(function(){
		//setWh();
	});
	function showPics(index) { //普通切换
		var nowLeft = -index*ul_w; //根据index值计算ul元素的left值
		$(".preview-images>.images-box>ul").stop(true,false).animate({"left":nowLeft},300); //通过animate()调整ul元素滚动到计算出的position
		$(".preview-images>.images-box>.btnbig>span").removeClass("on").eq(index).addClass("on"); //为当前的按钮切换到选中的效果
	}
	//封装设置宽高;
	function setWh(){
		h = $(window).height(),bh = $('body').height();
		$('body').addClass('ovh').css('height',h+'px'); //隐藏滚动条
		w = $(window).width();
		$('body').removeClass('ovh').css('height',bh+'px');
		$('.preview-mask').css({'width':w+'px','height':h+'px'});
		var ul_h = h;
		if(w >= 768) {
			$('.preview-images>.images-box').css({'height':h+'px','padding':'0px'});
			$('.preview-images>.images-box>.prev,.preview-images>.images-box>.next').css({'top':((h-53)/2)+'px'});
			$('.preview-images>.images-intro').css({'height':h+'px'});

		}else{
			$('.preview-images>.images-box').css({'height':h/2+'px','padding':'0px'});
			$('.preview-images>.images-box>.prev,.preview-images>.images-box>.next').css({'top':((h/2-53)/2)+'px'});
			$('.preview-images>.images-intro').css({'height':h/2+'px'});
			ul_h = h/2;
		}
		ul_w = $('.preview-images>.images-box').width()/100 * w;
		styleEl.html('.preview-images .images-box ul li{width:'+ul_w+'px; height:'+ul_h+'px;line-height:'+ul_h+'px;}');
	};
	//显示评论
	function displayComment(data){
		//官方评语
		el.find('.comment-list').empty();
		el.find('.comment-admin').empty();
		if(data.top_comment){
			el.find('.comment-admin').html('<span>官方评语：</span><p>'+data.top_comment.intro+'</p>');
		}
		//正常评论
		if(data.comment.length > 0){
			var html = '';
			$.each(data.comment,function(index,item){
				html += ('<div class="item row" data-id="'+item.id+'">'
							+'<div class="item-img user-img col-xs-2 col-sm-2"><img class="img-responsive" src="'+_path+item.avatar+'" /></div>'
							+'<div class="item-intro col-sm-10 col-xs-10">'
								+'<div class="item-name-date">'+
									'<span class="item-name">'+item.nickname+'</span>'+
									'<span class="item-date">'+item.addtime+(item.level == "1" ? "<span class='leve'>[精华]</span>" : " ") +'</span>'
								+'</div>'
								+'<div class="item-text">'+(item.replyname == "" ? "" : "回复 "+item.replyname + "：")+ item.intro +'<span class="reply">回复</span></div>'
							+'</div>'
						+'</div>');
			})
			el.find('.comment-list').html(html);
		}
	}
})

/*
$(function() {
	var sWidth = $("#focus").width(); //获取焦点图的宽度（显示面积）
	var len = $("#focus ul li").length; //获取焦点图个数
	var index = 0;
	var picTimer;
	
	//以下代码添加数字按钮和按钮后的半透明条，还有上一页、下一页两个按钮
	var btn = "<div class='btnBg'></div><div class='btn'>";
	for(var i=0; i < len; i++) {
		btn += "<span></span>";
	}
	btn += "</div><div class='preNext pre'></div><div class='preNext next'></div>";
	$("#focus").append(btn);
	$("#focus .btnBg").css("opacity",0.5);

	//为小按钮添加鼠标滑入事件，以显示相应的内容
	$("#focus .btn span").css("opacity",0.4).mouseenter(function() {
		index = $("#focus .btn span").index(this);
		showPics(index);
	}).eq(0).trigger("mouseenter");

	//上一页、下一页按钮透明度处理
	$("#focus .preNext").css("opacity",0.2).hover(function() {
		$(this).stop(true,false).animate({"opacity":"0.5"},300);
	},function() {
		$(this).stop(true,false).animate({"opacity":"0.2"},300);
	});

	//上一页按钮
	$("#focus .pre").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});

	//下一页按钮
	$("#focus .next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});

	//本例为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
	$("#focus ul").css("width",sWidth * (len));
	
	//鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
	$("#focus").hover(function() {
		clearInterval(picTimer);
	},function() {
		picTimer = setInterval(function() {
			showPics(index);
			index++;
			if(index == len) {index = 0;}
		},4000); //此4000代表自动播放的间隔，单位：毫秒
	}).trigger("mouseleave");
	
	//显示图片函数，根据接收的index值显示相应的内容
	function showPics(index) { //普通切换
		var nowLeft = -index*sWidth; //根据index值计算ul元素的left值
		$("#focus ul").stop(true,false).animate({"left":nowLeft},300); //通过animate()调整ul元素滚动到计算出的position
		//$("#focus .btn span").removeClass("on").eq(index).addClass("on"); //为当前的按钮切换到选中的效果
		$("#focus .btn span").stop(true,false).animate({"opacity":"0.4"},300).eq(index).stop(true,false).animate({"opacity":"1"},300); //为当前的按钮切换到选中的效果
	}
});
*/