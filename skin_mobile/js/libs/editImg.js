define(function(require){
	var $ = require('jquery'), dialog = require('dialog/dialog');
	
	var _canvasWidth = 500;
	var _config = {
		imgPreview: null,
		imgWidth: 0,
		imgHeight: 0,
		canvas: null,
		ctx: null
	};
	var editParam = {
		rotation: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		operation: []
	};
	var cropParams = {
		left: 0,
		top: 0,
		width:0,
		height:0,
		currentX: 0,
		currentY: 0,
		flag: false,
		kind: "drag"
	};
	function roll(rotation) {
		var temp = _config.imgWidth;
		_config.imgWidth = _config.imgHeight;
		_config.imgHeight = temp;
		_config.canvas.width = _config.imgWidth;
		_config.canvas.height = _config.imgHeight;
		_config.ctx.save();
		_config.ctx.clearRect(0,0,_config.imgWidth, _config.imgHeight);
		_config.ctx.translate(_config.imgWidth, 0);
	    _config.ctx.rotate(rotation * Math.PI / 180); 
	    _config.ctx.drawImage(_config.imgPreview[0], 0, 0);
	    _config.ctx.setTransform(1, 0, 0, 1, 0, 0);
	    _config.ctx.restore();
	    editParam.rotation += rotation;
	    editParam.operation.push(1);

	}
	//point是拉伸点，target是被拉伸的目标，kind是拉伸的类型
	function startDrag(point, target, kind){	
		cropParams.width = target.css('width');
		cropParams.height = target.css('height');
		//初始化坐标
		if(target.css('left') !== "auto"){
			cropParams.left = target.css('left');
		}
		if(target.css('top') !== "auto"){
			cropParams.top = target.css('top');
		}
		//target是移动对象
		point.on('mousedown', function(event){
			cropParams.kind = kind;
			cropParams.flag = true;
			if(!event){
				event = window.event;
			}
			var e = event;
			cropParams.currentX = e.clientX;
			cropParams.currentY = e.clientY;
			//防止IE文字选中，有助于拖拽平滑
			point.on('selectstart', function(){
				return false;
			});  
		});
	}
	function crop() {
		var curWidth = $(_config.canvas).width(), curHeight = $(_config.canvas).height();
		var scaleX = curWidth / _config.imgWidth, scaleY = curHeight / _config.imgHeight;
		var cropH = 80, cropW = 80, posX = (curWidth - cropW) / 2, posY = (curHeight - cropH) / 2;
		if($('.crop-overlay').length == 0){
			$('.imgControl').append('<div class="crop-overlay" style="position:absolute; width:'+curWidth+'px;height:'+curHeight+'px;background-color:rgba(0,0,0,0.5);top:50px;left:0">'
										+'<div class="crop-content" style="position:absolute;width:' + cropW + 'px; height:' + cropH + 'px; border:1px solid #555; top:' + posY + 'px; left:' + posX + 'px;">'
											+'<div id="DragBg" style="height:100%; background:white; opacity:0.3; filter:alpha(opacity=30); cursor:move;"></div>'
											+'<div id="dragLeftTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:-3px; cursor:nw-resize;"></div>'
											+'<div id="dragLeftBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; bottom:-3px; cursor:sw-resize;"></div>'
											+'<div id="dragRightTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:-3px; cursor:ne-resize;"></div>'
											+'<div id="dragRightBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; bottom:-3px; cursor:se-resize;"></div>'
											+'<div id="dragTopCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; top:-3px; left:50%; margin-left:-3px; cursor:n-resize;"></div>'
											+'<div id="dragBotCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; bottom:-3px; left:50%; margin-left:-3px; cursor:s-resize;"></div>'
											+'<div id="dragRightCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:50%; margin-top:-3px; cursor:e-resize;"></div>'
											+'<div id="dragLeftCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:50%; margin-top:-3px; cursor:w-resize;"></div>'
										+'</div>'
									+'</div>');
			var target = $('.crop-content'), overlay = $('.crop-overlay');
			overlay.on('mousemove', function(event){
				var e = event ? event: window.event;
				if(cropParams.flag){
					var nowX = e.clientX, nowY = e.clientY;
					var disX = nowX - cropParams.currentX, disY = nowY - cropParams.currentY;
					if(cropParams.kind === "n"){
						//上拉伸
						//高度增加或减小，位置上下移动
						target.css('top', parseInt(cropParams.top) + disY + 'px');
						target.css('height', parseInt(cropParams.height) - disY + 'px');
					}else if(cropParams.kind === "w"){//左拉伸
						target.css('left', parseInt(cropParams.left) + disX + 'px');
						target.css('width', parseInt(cropParams.width) - disX + 'px');
					}else if(cropParams.kind === "e"){//右拉伸
						target.css('width', parseInt(cropParams.width) + disX + 'px');
					}else if(cropParams.kind === "s"){//下拉伸
						target.css('height', parseInt(cropParams.height) + disY + 'px');
					}else if(cropParams.kind === "nw"){//左上拉伸
						target.css('left', parseInt(cropParams.left) + disX + 'px');
						target.css('width', parseInt(cropParams.width) - disX + 'px');
						target.css('top', parseInt(cropParams.top) + disY + 'px');
						target.css('height', parseInt(cropParams.height) - disY + 'px');
					}else if(cropParams.kind === "ne"){//右上拉伸
						target.css('top', parseInt(cropParams.top) + disY + 'px');
						target.css('height', parseInt(cropParams.height) - disY + 'px');
						//右
						target.css('width', parseInt(cropParams.width) + disX + 'px');
					}else if(cropParams.kind === "sw"){//左下拉伸
						target.css('left', parseInt(cropParams.left) + disX + 'px');
						target.css('width', parseInt(cropParams.width) - disX + 'px');
						//下
						target.css('height', parseInt(cropParams.height) + disY + 'px');
					}else if(cropParams.kind === "se"){//右下拉伸
						target.css('width', parseInt(cropParams.width) + disX + 'px');
						target.css('height', parseInt(cropParams.height) + disY + 'px');
					}else{//移动
						target.css('left', parseInt(cropParams.left) + disX + 'px');
						target.css('top', parseInt(cropParams.top) + disY + 'px');
					}
				}
			});
			overlay.on('mouseup', function(){
				cropParams.flag = false;	
				if(target.css('left') !== "auto"){
					cropParams.left = target.css('left');
				}
				if(target.css('top') !== "auto"){
					cropParams.top = target.css('top');
				}
				cropParams.width = target.css('width');
				cropParams.height = target.css('height');
				
				//给隐藏文本框赋值
				posX = parseInt(target[0].style.left);
				posY = parseInt(target[0].style.top);
				cropW = parseInt(target[0].style.width);
				cropH = parseInt(target[0].style.height);
				if(posX < 0){
					posX = 0;	
				}
				if(posY < 0){
					posY = 0;
				}
				if((posX + cropW) > curWidth){
					cropW = iCurWidth - posX;	
				}
				if((posY + cropH) > curHeight){
					cropH = iCurHeight - posY;	
				}
				//比例计算
				editParam.x = posX / scaleX;
				editParam.y = posY / scaleY;
				editParam.width = cropW / scaleX;
				editParam.height = cropH / scaleY;
			});
			//绑定拖拽
			startDrag($("#DragBg"), target, "drag");
			//绑定拉伸
			startDrag($("#dragLeftTop"), target, "nw");
			startDrag($("#dragLeftBot"), target, "sw");
			startDrag($("#dragRightTop"), target, "ne");
			startDrag($("#dragRightBot"), target, "se");
			startDrag($("#dragTopCenter"), target, "n");
			startDrag($("#dragBotCenter"), target, "s");
			startDrag($("#dragRightCenter"), target, "e");
			startDrag($("#dragLeftCenter"), target, "w");
		}	
	}

	function init(imgPreview) {
		_config.imgPreview = imgPreview;
		var editImg = dialog({
			title: '编辑照片',
			content: '<div class="imgControl" style="position:relative">'
						+'<div class="edit-bar">'
							+'<i id="roll-left"></i>'
							//+'<i id="roll-right"></i>'
							+'<i id="crop"></i>'
							+'<i class="edit-save"></i>'
						+'</div>'
						+'<canvas id="canvas" style="width:500px;"></canvas>'
					+'</div>',
			width: 500,
			fix: true,
			modal: true

		});
		editImg.show();
		_config.canvas = $('#canvas')[0];
		_config.ctx = _config.canvas.getContext('2d');
		var imgData = _config.imgPreview.attr('src');
		var image = new Image();
		image.onload = function(){
			_config.imgWidth = image.naturalWidth ? image.naturalWidth : image.width;
			_config.imgHeight = image.naturalHeight ? image.naturalHeight : image.height;
			_config.canvas.width = _config.imgWidth;
			_config.canvas.height = _config.imgHeight;
			_config.ctx.drawImage(image, 0, 0);
			editParam.width = _config.imgWidth;
			editParam.height = _config.imgHeight;
		}
		image.src = imgData;

		$('#roll-left').on('click', function(){
			var arr = _config.imgPreview.attr('src').split(','), mime = arr[0].match(/:(.*?);/)[1];
			roll(90);
			var data = _config.canvas.toDataURL(mime);
	    	_config.imgPreview.attr('src', data);
		});
		$("#crop").on('click', crop);
		$('.edit-save').on('click', function(){
			var arr = _config.imgPreview.attr('src').split(','), mime = arr[0].match(/:(.*?);/)[1];
			if(editParam.width != 0 && editParam.height != 0) {
				var canvas = document.createElement('canvas');
				canvas.width = editParam.width;
				canvas.height = editParam.height;
				var cropCtx = canvas.getContext('2d');
				cropCtx.drawImage(_config.imgPreview[0], editParam.x, editParam.y, editParam.width, editParam.height, 0, 0, editParam.width, editParam.height);
				var data = canvas.toDataURL(mime);
				_config.imgPreview.attr('src', data);
				editParam.operation.push(2);
				editImg.close();
			}
		})
	}
	return init;	
})