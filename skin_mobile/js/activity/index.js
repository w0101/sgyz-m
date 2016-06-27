define(function(require,exports){
	var $=require('jquery');
	if($('.activity-category-list').height()>50){
		$('#show-category').removeClass('hidden');
		$('#show-category').on('click',function(){
			$('.activity-category').toggleClass('slide');
			$('#show-category').toggleClass('show-down show-up');
		});
	}
})