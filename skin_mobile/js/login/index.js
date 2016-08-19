define(function(require){
	var $ = require('jquery');
	var h = $(window).height();
	$('.login').height(h+'px');
	$('.login-big').height(h+'px');
	$('.login-save').click(function(){
		$(this).toggleClass('login-active');
	});
	$(window).resize(function(){
		var h = $(window).height();
		$('.login').height(h+'px');
		$('.login-big').height(h+'px');
	});
});