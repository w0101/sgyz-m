/**
 * @file config edp-webserver
 * @author EFE
 */

/* globals home, redirect, content, empty, autocss, file, less, stylus, proxyNoneExists */
var fs = require('fs');
var path = require('path');
var queryString = require('querystring');

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

function requestHandler(req) {
    var pathName = req.pathname || '';

    pathName = pathName.substr(0,pathName.length-5);
     console.log('Request Path: ' + pathName);
    var mockFilePath = process.cwd() + '/mock' + pathName;
    if (!fs.existsSync(mockFilePath + '.js')) {
        return false;
    }
    console.log("end");
    // writeLogFile(req, 'Request Path: ' + pathName, 'INFO');
    
    delete require.cache[require.resolve(mockFilePath)];
    var mockDataHandler = require(mockFilePath);
    return mockDataHandler;
}

exports.getLocations = function () {
    return [
        {
            location:/\/ajax/,
            handler:
            /*json({
                "status":"success"
            })*/
            [
                function (context) {
                    try {
                        context.stop();
                        var request = context.request;
                        var mockDataHandler = requestHandler(request);
                        if (mockDataHandler) {

                            var query = queryString.parse(
                                request.search.substr(1)
                            );

                            var postData = request.bodyBuffer || '';
                            var reqBody = queryString.parse(
                                postData.toString()
                            );

                            var data = mockDataHandler.response(
                                query, request, reqBody, context
                            );

                            var contentType = context.header['Content-Type'];

                            // 返回值未指定内容类型，默认按JSON格式处理返回
                            if (!contentType) {
                                contentType = 'application/json;charset=UTF-8';
                                context.content = JSON.stringify(data || {});
                            }

                            var timeout = mockDataHandler.timeout;

                            if (timeout) {
                                setTimeout(function () {
                                    context.start();
                                }, timeout);
                            }
                            else {
                                context.start();
                            }
                        }
                        else {
                            error404(context);
                        }
                    }
                    catch (e) {
                        error500(context, e);
                    }
                }
            ]
        },
        {
            // location: /.php$/,
            location: /\.php($|\?)|^\/index|\.html($|\?)/,
            handler: [
                php(
                    'php-cgi',
                    '',
                    function (context) {
                        var req = context.request;
                        var search = req.search || '';
                        return {
                            pathname: '/mock/index.php',
                            search: search
                                + (search.indexOf('?') === -1 ? '?' : '&')
                                + 'pathname='
                                + req.pathname
                        }
                    }
                )
            ]
        },
        {
            location: /\/$/,
            handler: home('index.html')
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

/* eslint-disable guard-for-in */
exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};
