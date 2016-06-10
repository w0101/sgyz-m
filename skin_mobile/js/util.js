/*工具类*/
define(function(require,exports,module){
	var  util = {},$=require('jquery');
	var scope = this;
    
	$.extend(util, {
		ajaxurl : function(action){
			return ajax_base.replace('/index.html','/'+action+'.html');
		},
		log: function (a,n) {
            window.console && console.log(a);
        }
	});
	module.exports=util;
})