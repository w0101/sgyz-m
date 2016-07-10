define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	$('.item-help').click(function(){
		var alertdia = dialog({
			title:"投票须知",
			content:'<div class="vote-tips"><p>每名会员每次比赛限投票1次，每次投票需选中3幅作品，投票分免费投票和付费投票两种，3幅作品可分别选择是否付费投票，具体情况如下:</p>'+_vote_html+'<p>比赛期间投票会员无法看到票数，参赛会员可以看到自己的作品票数，比赛结束后展示每幅作品投票人员的详细名单.</p></div>',
			okValue:"确定",
			modal : true,
			ok:function(){}
		});
		alertdia.show();
	});
})