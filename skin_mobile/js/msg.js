define('msg',['jquery','util'],function (require) {
	var util = require('util'),$ = require('jquery');
	_time = parseInt(_time);
	if(_time > 0 && _url != "goback"){
		var i = _time;
		setInterval(function(){
			if(i>0){
			    document.getElementById("date_span").innerHTML = i;
			}else{
				location.href=_url;
			}
			i--;
		},1000);
    }
});
