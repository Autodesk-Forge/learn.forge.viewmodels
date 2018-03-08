<?php

include_once "./server/vendor/autoload.php";
include_once "./server/apis.php";

use Klein\Klein;
use Autodesk\Controller\ForgeServices;

$klein = new Klein();

// Get the access token
$klein->respond('GET', '/api/forge/oauth/token', function () {
    $forgeServices = new ForgeServices();
    return $forgeServices->getAccessToken();
});

// Get all the buckets
$klein->respond('GET', '/api/forge/oss/buckets', function () {
    $forgeServices = new ForgeServices();
    return $forgeServices->getAllBuckets();
});

// Create a new bucket
$klein->respond('POST', '/api/forge/oss/buckets', function(){
    $forgeServices = new ForgeServices();
    return $forgeServices->createOneBucket();
});

// Upload a file to a bucket
$klein->respond('POST', '/api/forge/oss/objects', function () {
    $forgeServices = new ForgeServices();
    return $forgeServices->uploadFile();
});

// Start translate the model
$klein->respond('POST', '/api/forge/modelderivative/jobs', function () {
    $forgeServices = new ForgeServices();
    return $forgeServices->translateFile();
});


$klein->dispatch();

