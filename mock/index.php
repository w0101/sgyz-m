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
    $smarty->registerPlugin("function","dsubstr", "dsubstr");
    $smarty->registerPlugin("function","format_date", "format_date");
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
           // $url = $_SERVER["SCRIPT_NAME"]."?c=$c&a=$a$params";
            $url = "http://localhost:8848/".$route.".html";
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
    function dsubstr($string, $length, $suffix = '', $start = 0) {
        if($start) {
            $tmp = dsubstr($string, $start);
            $string = substr($string, strlen($tmp));
        }
        $strlen = strlen($string);
        if($strlen <= $length) return $string;
        $string = str_replace(array('&quot;', '&lt;', '&gt;'), array('"', '<', '>'), $string);
        $length = $length - strlen($suffix);
        $str = '';
        if(CHARSET == 'utf-8') {
            $n = $tn = $noc = 0;
            while($n < $strlen) {
                $t = ord($string{$n});
                if($t == 9 || $t == 10 || (32 <= $t && $t <= 126)) {
                    $tn = 1; $n++; $noc++;
                } elseif(194 <= $t && $t <= 223) {
                    $tn = 2; $n += 2; $noc += 2;
                } elseif(224 <= $t && $t <= 239) {
                    $tn = 3; $n += 3; $noc += 2;
                } elseif(240 <= $t && $t <= 247) {
                    $tn = 4; $n += 4; $noc += 2;
                } elseif(248 <= $t && $t <= 251) {
                    $tn = 5; $n += 5; $noc += 2;
                } elseif($t == 252 || $t == 253) {
                    $tn = 6; $n += 6; $noc += 2;
                } else {
                    $n++;
                }
                if($noc >= $length) break;
            }
            if($noc > $length) $n -= $tn;
            $str = substr($string, 0, $n);
        } else {
            for($i = 0; $i < $length; $i++) {
                $str .= ord($string{$i}) > 127 ? $string{$i}.$string{++$i} : $string{$i};
            }
        }
        $str = str_replace(array('"', '<', '>'), array('&quot;', '&lt;', '&gt;'), $str);
        return $str == $string ? $str : $str.$suffix;
    }
    function format_date($time,$start_time = TIME){
        $t=$time-$start_time;
        $f=array(
            '31536000'=>'年',
            '2592000'=>'个月',
            //'604800'=>'星期',
            '86400'=>'天',
            '3600'=>'小时',
            '60'=>'分钟',
            '1'=>'秒'
        );
        $fix = $t > 0 ? "前" : "后";
        $t = abs($t);
        foreach ($f as $k=>$v)    {
            if (0 !=$c=floor($t/(int)$k)) {
                return $c.$v.$fix;
            }
        }
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
