define(function(require,exports){
	var $=require("jquery");
	require("bootstrap")($);
	$("#BannerCarousel").carousel();
	$('.ranking-list-item').click(function(){
		if(!$(this).hasClass('first')){
			var showItem = $(this).parent().find('.first').data('item');
			$('.ranking-list-item.hidden.item-' + showItem).removeClass('hidden').addClass('others');
			$('.ranking-list-item.first.item-' + showItem).removeClass('first').addClass('hidden');
			var thisItem = $(this).data('item');
			$('.ranking-list-item.hidden.item-' + thisItem).removeClass('hidden').addClass('first');
			$(this).removeClass('others').addClass('hidden');
		}
	});
})