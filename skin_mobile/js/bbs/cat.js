define(function(require){
	var $ = require('jquery'),util=require('util'),dialog=require('dialog/dialog');
	//配置评论回复
	$('.theme-select>.diyselect').change(function(){
		var fid=$(this).val(),oid=$('.order-select>.diyselect').val();
		if(oid !="" && oid!=0){
			_changurl = _changurl.replace('_order',oid);
		}else{
			_changurl = _changurl.replace('&order=_order','');
		}
		if(fid !="" && fid != 0){
			_changurl = _changurl.replace('_fid',fid);
			location.href = _changurl;
		}
	});
	$('.order-select>.diyselect').change(function(){
		var oid=$(this).val(),fid=$('.theme-select>.diyselect').val();
		if(fid !="" && fid != 0){
			_changurl = _changurl.replace('_fid',fid);
		}else{
			_changurl = _changurl.replace('&fid=_fid','');
		}
		if(oid !="" && oid!=0){
			_changurl = _changurl.replace('_order',oid);
			location.href = _changurl;
		}
	});
	//$('.diyselect').chosen({disable_search_threshold:1000});
	//挂一个定时任务
	taskobj = setInterval('task();',30 * 1000);
	window.task = function(){
		$.getJSON(util.ajaxurl('bbsmore'),{id:_catid},function(result){
			if(result.status == true){
				if(result.data.total > _total){
					$('.bbs-list-header>.header-right>p').empty().html('<i></i> <a href="'+showurl(result.data.id)+'">有新的主题，点击回复</a>');
				}
			}else{
				clearInterval(taskobj);
			}
		})
	};
	function showurl(id){
		return _showurl.replace('_id.html',id+'.html');
	}
});