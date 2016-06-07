define(function(require,exports){
	var $=require('jquery');
	if($('.gallery-category-list').height()>102){
		$('#show-category').removeClass('hidden');
		$('#show-category').on('tap',function(){
			$('.gallery-category').toggleClass('slide');
			$('#show-category').toggleClass('show-down show-up');
		});
	}

})