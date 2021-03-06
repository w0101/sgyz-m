<?php

    date_default_timezone_set('Asia/Shanghai');

    $config = json_decode(file_get_contents('./config.json'), true);

    $smartyRoot = $config['smarty'];

    require_once "$smartyRoot/Smarty.class.php";

    $smarty = new Smarty();

    $smarty->setCompileDir('/tmp/smarty/templates_c');
    $smarty->setCacheDir('/tmp/smarty/cache');
    $smarty->setConfigDir('/tmp/smarty/configs');
    $smarty->setTemplateDir('../skin_mobile');
    $smarty->left_delimiter = '<{';
    $smarty->right_delimiter = '}>';
    $smarty->registerPlugin("function","url", "url");
    function url($c = 'main', $a = 'index', $param = array()){
        //$url="www.baidu.com";
        $a='index';
        if(is_array($c)){
            $param = $c;
            $c = $param['c']; unset($param['c']);
            if(isset($param['a'])){
                $a = $param['a']; unset($param['a']);
            }
        }
        $params = empty($param) ? '' : '&'.http_build_query($param);
        if(strpos($c, '/') !== false){
            list($m, $c) = explode('/', $c);
            $route = "$m/$c/$a";
            $url = $_SERVER["SCRIPT_NAME"]."?m=$m&c=$c&a=$a$params";
        }else{
            $m = '';
            $route = "$c/$a";
            $url = $_SERVER["SCRIPT_NAME"]."?c=$c&a=$a$params";
        }

        if(!empty($GLOBALS['rewrite'])){
            static $urlArray=array();
            if(!isset($urlArray[$url])){
                foreach($GLOBALS['rewrite'] as $rule => $mapper){
                    $mapper = '/'.str_ireplace(array('/', '<a>', '<c>', '<m>'), 
                        array('\/', '(?<a>\w+)', '(?<c>\w+)', '(?<m>\w+)'), $mapper).'/i';
                    if(preg_match($mapper, $route, $matchs)){
                        $urlArray[$url] = str_ireplace(array('<a>', '<c>', '<m>'), array($a, $c, $m), $rule);
                        if(!empty($param)){
                            $_args = array();
                            foreach($param as $argkey => $arg){
                                $count = 0;
                                $urlArray[$url] = str_ireplace('<'.$argkey.'>', $arg, $urlArray[$url], $count);
                                if(!$count)$_args[$argkey] = $arg;
                            }
                            $urlArray[$url] = preg_replace('/<\w+>/', '', $urlArray[$url]).
                                (!empty($_args) ? '?'.http_build_query($_args) : '');
                        }
                        
                        if(0!==stripos($urlArray[$url], 'http://')) 
                            $urlArray[$url] = 'http://'.$_SERVER['HTTP_HOST'].rtrim(dirname($_SERVER["SCRIPT_NAME"]), '/\\') .'/'.$urlArray[$url];
                        $rule = str_ireplace(array('<m>', '<c>', '<a>'), '', $rule);
                        if(count($param) == preg_match_all('/<\w+>/is', $rule, $_match)){
                            return $urlArray[$url];
                        }
                        break;
                    }
                }
                return isset($urlArray[$url]) ? $urlArray[$url] : $url;
            }
            return $urlArray[$url];
        }
        return $url;
    }

    if (!isset($_GET['pathname'])
        || $_GET['pathname'] == '/mock/index.php'
    ) {
        // $smarty->assign('name', 'test');
        $smarty->display('./index.tpl');
        return;
    }

    $pathname = preg_replace('/\/$/', '', $_GET['pathname']);

    // echo($pathname . '<br>');
    // print_r(__DIR__);

    $route = json_decode(file_get_contents(__DIR__ . "/route.json"), true);

    // var_dump($route);
    // echo('<br>');
    // var_dump($pathname);
    // echo('<br>');

    if (!isset($route[$pathname])) {
        echo($pathname . ' 不存在');
        exit();
    }

    $actionConfig = $route[$pathname];
    $actionPath = $actionConfig['action'];

    // echo(__DIR__ . "/$actionPath");

    require_once __DIR__ . "/$actionPath";

    $data = execute();
    $type = isset($actionConfig['responseType']) ? $actionConfig['responseType'] : getResponseType();

    // var_dump($data);

    if ($type == 'smarty') {

        foreach ($data as $key => $value) {
            $smarty->assign($key, $value);
        }

        $smarty->display($actionConfig['tpl']);

        return;
    }



    // echo json_encode($data);

?>
