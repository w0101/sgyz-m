/**
 * @file config edp-webserver
 * @author EFE
 */

/* globals home, redirect, content, empty, autocss, file, less, stylus, proxyNoneExists */


exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
exports.getLocations = function () {
    return [
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
