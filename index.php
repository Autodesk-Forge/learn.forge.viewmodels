<?php
/**
 * Created by PhpStorm.
 * User: zhongwu
 * Date: 2018/3/6
 * Time: 下午3:30
 */

include_once "./server/vendor/autoload.php";
include_once "./server/apis.php";

$klein = new \Klein\Klein();

$klein->respond('GET', '/', function () {
    $c = new \server\Controller\Demo();
    return $c->test();
});

$klein->respond('GET', '/api/forge/oss/buckets', function () {
    $c = new \server\Controller\Demo();
    return $c->getAllBuckets();
});

$klein->respond('POST', '/api/forge/oss/buckets', function(){
    $c = new \server\Controller\Demo();
    return $c->createOneBucket();

});

$klein->respond('GET', '/api/token', function () {
    $c = new \server\Controller\Demo();
    return $c->getAccessToken();
});

$klein->respond('POST', '/api/token', function () {
    $c = new \server\Controller\Demo();
    return $c->test();
});

$klein->dispatch();

