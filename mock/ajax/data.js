
exports.response = function (require) {
    var postArgs = arguments[2];
    return {
        "status": 0,
        "data": {
            "extData": {
                "serverTime": 1403756151406,
                "pvid": "1403756136609318"
            },
            "tplData": {
                "feData": {
                    "isLeftImageMode": true
                },
                "imgPath": "http://pic.cnblogs.com/face/u277886.jpg",
                "ajaxUrl": "/ecomui/life?controller=hunshasheying&action=ajax&wd=",
                "mpAjaxUrl": "/ajax/data",
                "feRoot": "http://172.20.132.119:8848",
                "headerPath": "http://s1.bdstatic.com/r/www/cache/biz/ecom/onesite/20140929/site",
                "hotSearchs": [
                    {
                        "link": "http://www.baidu.com",
                        "text": "Java"
                    },
                    {
                        "link": "http://www.baidu.com",
                        "text": "PHP"
                    },
                    {
                        "link": "http://www.baidu.com",
                        "text": "Android"
                    },
                    {
                        "link": "http://www.baidu.com",
                        "text": "产品经理"
                    },
                    {
                        "link": "http://www.baidu.com",
                        "text": "运营"
                    }
                ],
                "pageSize": 6,
                "total": 100,
                "signtime": 12
            }
        }

    };
};
