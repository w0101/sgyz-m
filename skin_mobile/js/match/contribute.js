define(function(require){
	var $ = require('jquery'),
		util = require('util'),
		dialog = require('dialog/dialog');
	if(document.getElementById('voteChart')){
		var myChart = echarts.init(document.getElementById('voteChart'));
		var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b} : {c} ({d}%)"
		    },
		    series : [
		        {
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '40%'],
		            data:[
		                {value:_vote, name:'我的票数'},
		                {value:_allVotes-_vote, name:'剩余票数'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(option);
	    function getNewVote () {
	    	$.get(util.ajaxurl('refreshvotes'),{itemid: _id}).done(function (data) {
	    	    myChart.setOption({
	    	        tooltip : {
	    	        	        trigger: 'item',
	    	        	        formatter: "{b} : {c} ({d}%)"
	    	        },
	        	    series : [
	        	        {
	        	            type: 'pie',
	        	            radius : '55%',
	        	            center: ['50%', '40%'],
	        	            data:[
	        	                {value:parseInt(data.data.votes), name:'我的票数'},
	        	                {value:parseInt(data.data.total_votes) - parseInt(data.data.votes), name:'剩余票数'}
	        	            ],
	        	            itemStyle: {
	        	                emphasis: {
	        	                    shadowBlur: 10,
	        	                    shadowOffsetX: 0,
	        	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	        	                }
	        	            }
	        	        }
	        	    ]
	    	    });
	    	});
	    }
	    setInterval(getNewVote, 600000);
	}
	$('.remove-contri').click(function(){
		var alertRemove = dialog({
			title: "删除投稿确认",
			content: "<p>您将要删除当前比赛本次投稿的所有作品和投票信息，删除后可再次投稿。确定要删除投稿？<p>",
			fix: true,
			modal: true,
			ok: function(){
				$.get(util.ajaxurl('delcontribution'),{itemid: _id},function(data){
					if(data.status == true){
						alert("作品删除成功！");
						location.reload();
					}else{
						alert(data.message);
					}
				}, 'json');
			}
		});
		alertRemove.show();
	})
})
