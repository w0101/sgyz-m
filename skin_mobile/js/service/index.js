define(function(require,exports){
	var $=require('jquery');
	$('.service-category-list').each(function(){
		if($(this).height()>50){
			var $btn = $(this).parent().find('#show-category')
			$btn.removeClass('hidden');
			$btn.on('click', function(){
				$btn.parents('.service-category').toggleClass('slide');
				$btn.toggleClass('show-down show-up');
			})
		}
	});
})