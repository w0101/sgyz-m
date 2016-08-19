/*
Uploadify v3.2.1
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/

define('libs/uploadmatch',['jquery','libs/swfobject'],function(require,exports,module){
    var $ = require('jquery');
    (function(c) {
        var b = { init: function(d, e) {
                return this.each(function() {
                    var n = c(this);
                    var m = n.clone();
                    var j = c.extend({ id: n.attr("id"), swf: "uploadify.swf", uploader: "uploadify.php", auto: true, buttonClass: "", buttonCursor: "hand", buttonImage: null, buttonText: "SELECT FILES", checkExisting: false, debug: false, fileObjName: "Filedata", fileSizeLimit: 0, fileTypeDesc: "All Files", fileTypeExts: "*.*", height: 30, itemTemplate: false, method: "post", multi: true, formData: {}, preventCaching: true, progressData: "percentage", queueID: false, queueSizeLimit: 999, removeCompleted: true, removeTimeout: 3, requeueErrors: false, successTimeout: 30, uploadLimit: 0, width: 120, overrideEvents: [] }, d);
                    var g = { assume_success_timeout: j.successTimeout, button_placeholder_id: j.id, button_width: j.width, button_height: j.height, button_text: null, button_text_style: null, button_text_top_padding: 0, button_text_left_padding: 0, button_action: (j.multi ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE), button_disabled: false, button_cursor: (j.buttonCursor == "arrow" ? SWFUpload.CURSOR.ARROW : SWFUpload.CURSOR.HAND), button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT, debug: j.debug, requeue_on_error: j.requeueErrors, file_post_name: j.fileObjName, file_size_limit: j.fileSizeLimit, file_types: j.fileTypeExts, file_types_description: j.fileTypeDesc, file_queue_limit: j.queueSizeLimit, file_upload_limit: j.uploadLimit, flash_url: j.swf, prevent_swf_caching: j.preventCaching, post_params: j.formData, upload_url: j.uploader, use_query_string: (j.method == "get"), file_dialog_complete_handler: a.onDialogClose, file_dialog_start_handler: a.onDialogOpen, file_queued_handler: a.onSelect, file_queue_error_handler: a.onSelectError, swfupload_loaded_handler: j.onSWFReady, upload_complete_handler: a.onUploadComplete, upload_error_handler: a.onUploadError, upload_progress_handler: a.onUploadProgress, upload_start_handler: a.onUploadStart, upload_success_handler: a.onUploadSuccess };
                    if (e) { g = c.extend(g, e); }
                    g = c.extend(g, j);
                    var o = swfobject.getFlashPlayerVersion();
                    var h = (o.major >= 9);
                    if (h) { window["uploadify_" + j.id] = new SWFUpload(g);
                        var i = window["uploadify_" + j.id];
                        n.data("uploadify", i);
                        var l = c("<div />", { id: j.id, "class": "uploadify", });
                        c("#" + i.movieName).wrap(l);
                        l = c("#" + j.id);
                        l.data("uploadify", i);
                        var f = c("<div />", { id: j.id + "-button", "class": "uploadify-button " + j.buttonClass });
                        if (j.buttonImage) { f.css({ "background-image": "url('" + j.buttonImage + "')", "text-indent": "-9999px" }); }
                        f.html('<span class="uploadify-button-text">' + j.buttonText + "</span>");
                        l.append(f);
                        c("#" + i.movieName).css({ position: "absolute", "z-index": 1 });
                        if (!j.queueID) {
                            var k = c("<div />", { id: j.id + "-queue", "class": "uploadify-queue" });
                            l.before(k);
                            i.settings.queueID = j.id + "-queue";
                            i.settings.defaultQueue = true; }
                        i.queueData = { files: {}, filesSelected: 0, filesQueued: 0, filesReplaced: 0, filesCancelled: 0, filesErrored: 0, uploadsSuccessful: 0, uploadsErrored: 0, averageSpeed: 0, queueLength: 0, queueSize: 0, uploadSize: 0, queueBytesUploaded: 0, uploadQueue: [], errorMsg: "以下文件没有添加到队列中：" };
                        i.original = m;
                        i.wrapper = l;
                        i.button = f;
                        i.queue = k;
                        if (j.onInit) { j.onInit.call(n, i); } } else {
                        if (j.onFallback) { j.onFallback.call(n); } } }); }, cancel: function(d, f) {
                var e = arguments;
                this.each(function() {
                    var l = c(this),
                        i = l.data("uploadify"),
                        j = i.settings,
                        h = -1;
                    if (e[0]) {
                        if (e[0] == "*") {
                            var g = i.queueData.queueLength;
                            c("#" + j.queueID).find(".uploadify-queue-item").each(function() { h++;
                                if (e[1] === true) { i.cancelUpload(c(this).attr("id"), false); } else { i.cancelUpload(c(this).attr("id")); }
                                c(this).find(".data").removeClass("data").html(" - Cancelled");
                                c(this).find(".uploadify-progress-bar").remove();
                                c(this).delay(1000 + 100 * h).fadeOut(500, function() { c(this).remove(); }); });
                            i.queueData.queueSize = 0;
                            i.queueData.queueLength = 0;
                            if (j.onClearQueue) { j.onClearQueue.call(l, g); } } else {
                            for (var m = 0; m < e.length; m++) { i.cancelUpload(e[m]);
                                c("#" + e[m]).find(".data").removeClass("data").html(" - Cancelled");
                                c("#" + e[m]).find(".uploadify-progress-bar").remove();
                                c("#" + e[m]).delay(1000 + 100 * m).fadeOut(500, function() { c(this).remove(); }); } } } else {
                        var k = c("#" + j.queueID).find(".uploadify-queue-item").get(0);
                        $item = c(k);
                        i.cancelUpload($item.attr("id"));
                        $item.find(".data").removeClass("data").html(" - Cancelled");
                        $item.find(".uploadify-progress-bar").remove();
                        $item.delay(1000).fadeOut(500, function() { c(this).remove(); }); } }); }, destroy: function() { this.each(function() {
                    var f = c(this),
                        d = f.data("uploadify"),
                        e = d.settings;
                    d.destroy();
                    if (e.defaultQueue) { c("#" + e.queueID).remove(); }
                    c("#" + e.id).replaceWith(d.original);
                    if (e.onDestroy) { e.onDestroy.call(this); }
                    delete d; }); }, disable: function(d) { this.each(function() {
                    var g = c(this),
                        e = g.data("uploadify"),
                        f = e.settings;
                    if (d) { e.button.addClass("disabled");
                        if (f.onDisable) { f.onDisable.call(this); } } else { e.button.removeClass("disabled");
                        if (f.onEnable) { f.onEnable.call(this); } }
                    e.setButtonDisabled(d); }); }, settings: function(e, g, h) {
                var d = arguments;
                var f = g;
                this.each(function() {
                    var k = c(this),
                        i = k.data("uploadify"),
                        j = i.settings;
                    if (typeof(d[0]) == "object") {
                        for (var l in g) { setData(l, g[l]); } }
                    if (d.length === 1) { f = j[e]; } else {
                        switch (e) {
                            case "uploader":
                                i.setUploadURL(g);
                                break;
                            case "formData":
                                if (!h) { g = c.extend(j.formData, g); }
                                i.setPostParams(j.formData);
                                break;
                            case "method":
                                if (g == "get") { i.setUseQueryString(true); } else { i.setUseQueryString(false); }
                                break;
                            case "fileObjName":
                                i.setFilePostName(g);
                                break;
                            case "fileTypeExts":
                                i.setFileTypes(g, j.fileTypeDesc);
                                break;
                            case "fileTypeDesc":
                                i.setFileTypes(j.fileTypeExts, g);
                                break;
                            case "fileSizeLimit":
                                i.setFileSizeLimit(g);
                                break;
                            case "uploadLimit":
                                i.setFileUploadLimit(g);
                                break;
                            case "queueSizeLimit":
                                i.setFileQueueLimit(g);
                                break;
                            case "buttonImage":
                                console.log(g);
                                i.button.css("background-image", "url(" + g + ")");
                                break;
                            case "buttonCursor":
                                if (g == "arrow") { i.setButtonCursor(SWFUpload.CURSOR.ARROW); } else { i.setButtonCursor(SWFUpload.CURSOR.HAND); }
                                break;
                            case "buttonText":
                                c("#" + j.id + "-button").find(".uploadify-button-text").html(g);
                                break;
                            case "width":
                                i.setButtonDimensions(g, j.height);
                                break;
                            case "height":
                                i.setButtonDimensions(j.width, g);
                                break;
                            case "multi":
                                if (g) { i.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES); } else { i.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE); }
                                break; }
                        j[e] = g; } });
                if (d.length === 1) {
                    return f; } }, stop: function() { this.each(function() {
                    var e = c(this),
                        d = e.data("uploadify");
                    d.queueData.averageSpeed = 0;
                    d.queueData.uploadSize = 0;
                    d.queueData.bytesUploaded = 0;
                    d.queueData.uploadQueue = [];
                    d.stopUpload(); }); }, upload: function() {
                var d = arguments;
                this.each(function() {
                    var f = c(this),
                        e = f.data("uploadify");
                    e.queueData.averageSpeed = 0;
                    e.queueData.uploadSize = 0;
                    e.queueData.bytesUploaded = 0;
                    e.queueData.uploadQueue = [];
                    if (d[0]) {
                        if (d[0] == "*") { e.queueData.uploadSize = e.queueData.queueSize;
                            e.queueData.uploadQueue.push("*");
                            e.startUpload(); } else {
                            for (var g = 0; g < d.length; g++) { e.queueData.uploadSize += e.queueData.files[d[g]].size;
                                e.queueData.uploadQueue.push(d[g]); }
                            e.startUpload(e.queueData.uploadQueue.shift()); } } else { e.startUpload(); } }); } };
        var a = { 
            onDialogOpen: function() {
                var d = this.settings;
                this.queueData.errorMsg = "Some files were not added to the queue:";
                this.queueData.filesReplaced = 0;
                this.queueData.filesCancelled = 0;
                if (d.onDialogOpen) { d.onDialogOpen.call(this); } 
            }, 
            onDialogClose: function(d, f, g) {
                var e = this.settings;
                this.queueData.filesErrored = d - f;
                this.queueData.filesSelected = d;
                this.queueData.filesQueued = f - this.queueData.filesCancelled;
                this.queueData.queueLength = g;
                if (c.inArray("onDialogClose", e.overrideEvents) < 0) {
                    if (this.queueData.filesErrored > 0) { alert(this.queueData.errorMsg); } }
                if (e.onDialogClose) { e.onDialogClose.call(this, this.queueData); }
                if (e.auto) { c("#" + e.id).uploadmatch("upload", "*"); } 
            }, 
            onSelect: function(h) {
                var i = this.settings;
                var f = {};
                for (var g in this.queueData.files) { 
                    f = this.queueData.files[g];
                    if (f.uploaded != true && f.name == h.name) {
                        var e = confirm('The file named "' + h.name + '" is already in the queue.\nDo you want to replace the existing item in the queue?');
                        if (!e) { 
                            this.cancelUpload(h.id);
                            this.queueData.filesCancelled++;
                            return false; 
                        } else { 
                            c("#" + f.id).remove();
                            this.cancelUpload(f.id);
                            this.queueData.filesReplaced++; 
                        } 
                    } 
                }
                var j = Math.round(h.size / 1024);
                var o = "KB";
                if (j > 1000) { 
                    j = Math.round(j / 1000);
                    o = "MB"; 
                }
                var l = j.toString().split(".");
                j = l[0];
                if (l.length > 1) { j += "." + l[1].substr(0, 2); }
                j += o;
                var k = h.name;
                if (k.length > 25) { k = k.substr(0, 25) + "..."; }
                itemData = { fileID: h.id, instanceID: i.id, fileName: k, fileSize: j };
                if (i.itemTemplate == false) { 
                    i.itemTemplate = '<div id="${fileID}" class="uploadify-queue-item">                  <div class="cancel">                        <a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')"></a>                   </div>  <table><tr><td><img src="'+_assets+'images/loading_2.gif" class="preview_img" /></td></tr></table>                <span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>                   <div class="uploadify-progress">                        <div class="uploadify-progress-bar"><!--Progress Bar--></div>                   </div>              </div>'; 
                }
                //console.log(h);
                if (c.inArray("onSelect", i.overrideEvents) < 0) { 
                    itemHTML = i.itemTemplate;
                    for (var m in itemData) { 
                        itemHTML = itemHTML.replace(new RegExp("\\$\\{" + m + "\\}", "g"), itemData[m]); 
                    }
                    c("#" + i.queueID).append(itemHTML); 
                    //var reader=new FileReader();
                    //reader.onload=function(){
                    //    var url=reader.result;
                    //    c("#" + i.queueID).find(".preview_img").attr('src',url);
                    //};
                    //reader.readAsDataURL(h.name);
                }

                this.queueData.queueSize += h.size;
                this.queueData.files[h.id] = h;
                if (i.onSelect) { i.onSelect.apply(this, arguments); } 
            }, 
            onSelectError: function(d, g, f) {
                var e = this.settings;
                if (c.inArray("onSelectError", e.overrideEvents) < 0) {
                    switch (g) {
                        case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                            if (e.queueSizeLimit > f) { this.queueData.errorMsg += "\n最多选择" + f + "个文件."; } else { this.queueData.errorMsg += "\nThe number of files selected exceeds the queue size limit (" + e.queueSizeLimit + ")."; }
                            break;
                        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                            this.queueData.errorMsg += '\nThe file "' + d.name + '" exceeds the size limit (' + e.fileSizeLimit + ").";
                            break;
                        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                            this.queueData.errorMsg += '\n"' + d.name + '"是一个空文件';
                            break;
                        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                            this.queueData.errorMsg += '\n"' + d.name + '" 类型不允许,只允许上传(' + e.fileTypeDesc + ")格式的文件";
                            break; } }
                if (g != SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) { delete this.queueData.files[d.id]; }
                if (e.onSelectError) { e.onSelectError.apply(this, arguments); } 
            }, 
            onQueueComplete: function() {
                if (this.settings.onQueueComplete) { this.settings.onQueueComplete.call(this, this.settings.queueData); } }, onUploadComplete: function(f) {
                var g = this.settings,
                    d = this;
                var e = this.getStats();
                this.queueData.queueLength = e.files_queued;
                if (this.queueData.uploadQueue[0] == "*") {
                    if (this.queueData.queueLength > 0) { this.startUpload(); } else { this.queueData.uploadQueue = [];
                        if (g.onQueueComplete) { g.onQueueComplete.call(this, this.queueData); } } } else {
                    if (this.queueData.uploadQueue.length > 0) { this.startUpload(this.queueData.uploadQueue.shift()); } else { this.queueData.uploadQueue = [];
                        if (g.onQueueComplete) { g.onQueueComplete.call(this, this.queueData); } } }
                if (c.inArray("onUploadComplete", g.overrideEvents) < 0) {
                    if (g.removeCompleted) {
                        switch (f.filestatus) {
                            case SWFUpload.FILE_STATUS.COMPLETE:
                            	
                                setTimeout(function() {
                                    if (c("#" + f.id)) { 
                                    	d.queueData.queueSize -= f.size;
                                        d.queueData.queueLength -= 1;
                                        delete d.queueData.files[f.id];
                                        
                                        	c("#" + f.id).fadeOut(500, function() { c(this).remove(); }); 
                                        } 
                                    }, g.removeTimeout * 1000);
                                break;
                            case SWFUpload.FILE_STATUS.ERROR:
                                if (!g.requeueErrors) { setTimeout(function() {
                                        if (c("#" + f.id)) { d.queueData.queueSize -= f.size;
                                            d.queueData.queueLength -= 1;
                                            delete d.queueData.files[f.id];
                                            c("#" + f.id).fadeOut(500, function() { c(this).remove(); }); } }, g.removeTimeout * 1000); }
                                break; } } else { f.uploaded = true; } }
                if (g.onUploadComplete) { g.onUploadComplete.call(this, f); } 
            }, 
            onUploadError: function(e, i, h) {
                var f = this.settings;
                var g = "Error";
                switch (i) {
                    case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                        g = "HTTP Error (" + h + ")";
                        break;
                    case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                        g = "Missing Upload URL";
                        break;
                    case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                        g = "IO Error";
                        break;
                    case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                        g = "Security Error";
                        break;
                    case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                        alert("The upload limit has been reached (" + h + ").");
                        g = "Exceeds Upload Limit";
                        break;
                    case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                        g = "Failed";
                        break;
                    case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                        break;
                    case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                        g = "Validation Error";
                        break;
                    case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                        g = "Cancelled";
                        this.queueData.queueSize -= e.size;
                        this.queueData.queueLength -= 1;
                        if (e.status == SWFUpload.FILE_STATUS.IN_PROGRESS || c.inArray(e.id, this.queueData.uploadQueue) >= 0) { this.queueData.uploadSize -= e.size; }
                        if (f.onCancel) { f.onCancel.call(this, e); }
                        delete this.queueData.files[e.id];
                        break;
                    case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                        g = "Stopped";
                        break; }
                if (c.inArray("onUploadError", f.overrideEvents) < 0) {
                    if (i != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED && i != SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) { c("#" + e.id).addClass("uploadify-error"); }
                    c("#" + e.id).find(".uploadify-progress-bar").css("width", "1px");
                    if (i != SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND && e.status != SWFUpload.FILE_STATUS.COMPLETE) { c("#" + e.id).find(".data").html(" - " + g); } }
                var d = this.getStats();
                this.queueData.uploadsErrored = d.upload_errors;
                if (f.onUploadError) { f.onUploadError.call(this, e, i, h, g); } 
            }, 
            onUploadProgress: function(g, m, j) {
                var h = this.settings;
                var e = new Date();
                var n = e.getTime();
                var k = n - this.timer;
                if (k > 500) { this.timer = n; }
                var i = m - this.bytesLoaded;
                this.bytesLoaded = m;
                var d = this.queueData.queueBytesUploaded + m;
                var p = Math.round(m / j * 100);
                var o = "KB/s";
                var l = 0;
                var f = (i / 1024) / (k / 1000);
                f = Math.floor(f * 10) / 10;
                if (this.queueData.averageSpeed > 0) { this.queueData.averageSpeed = Math.floor((this.queueData.averageSpeed + f) / 2); } else { this.queueData.averageSpeed = Math.floor(f); }
                if (f > 1000) { l = (f * 0.001);
                    this.queueData.averageSpeed = Math.floor(l);
                    o = "MB/s"; }
                if (c.inArray("onUploadProgress", h.overrideEvents) < 0) {
                    if (h.progressData == "percentage") { 
                        c("#" + g.id).find(".data").html(" - " + p + "%"); 
                    } else {
                        if (h.progressData == "speed" && k > 500) { 
                            c("#" + g.id).find(".data").html(" - " + this.queueData.averageSpeed + o); 
                        } 
                    }
                    c("#" + g.id).find(".uploadify-progress-bar").css("width", p + "%");
                    if(p == 100){
                        c("#" + g.id).find(".uploadify-progress").hide();
                    }
                }
                if (h.onUploadProgress) { 
                    h.onUploadProgress.call(this, g, m, j, d, this.queueData.uploadSize); 
                } 
            }, 
            onUploadStart: function(d) {
                var e = this.settings;
                var f = new Date();
                this.timer = f.getTime();
                this.bytesLoaded = 0;
                if (this.queueData.uploadQueue.length == 0) { this.queueData.uploadSize = d.size; }
                if (e.checkExisting) { 
                    c.ajax({ type: "POST", async: false, url: e.checkExisting, data: { filename: d.name }, success: function(h) {
                            if (h == 1) {
                                var g = confirm('A file with the name "' + d.name + '" already exists on the server.\nWould you like to replace the existing file?');
                                if (!g) { 
                                    this.cancelUpload(d.id);
                                    c("#" + d.id).remove();
                                    if (this.queueData.uploadQueue.length > 0 && this.queueData.queueLength > 0) {
                                        if (this.queueData.uploadQueue[0] == "*") { 
                                            this.startUpload(); 
                                        } else { 
                                            this.startUpload(this.queueData.uploadQueue.shift()); 
                                        } 
                                    } 
                                } 
                            } 
                        } 
                    }); 
                }
                if (e.onUploadStart) { e.onUploadStart.call(this, d); } 
            }, 
            onUploadSuccess: function(f, h, d) {
                var g = this.settings;
                var e = this.getStats();
                this.queueData.uploadsSuccessful = e.successful_uploads;
                this.queueData.queueBytesUploaded += f.size;
                if (c.inArray("onUploadSuccess", g.overrideEvents) < 0) { c("#" + f.id).find(".data").html(" - Complete"); }
                if (g.onUploadSuccess) { g.onUploadSuccess.call(this, f, h, d); } 
            } 
        };
        c.fn.uploadmatch = function(d) {
            if (b[d]) {
                return b[d].apply(this, Array.prototype.slice.call(arguments, 1)); } else {
                if (typeof d === "object" || !d) {
                    return b.init.apply(this, arguments); 
                } else { 
                	c.error("The method " + d + " does not exist in $.uploadmatch"); 
                } 
            } 
        }; 
    })($);
    module.exports = $.uploadmatch;
});