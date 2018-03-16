<?php
session_start();
include_once "./server/vendor/autoload.php";
include_once "./server/oauthtoken.php";
include_once "./server/modelderivative.php";
include_once "./server/oss.php";
include_once "./server/config.php";
include_once "./server/oauth.php";

use Klein\Klein;
use Autodesk\ForgeServices\AccessToken;
use Autodesk\ForgeServices\ModelDerivative;
use Autodesk\ForgeServices\DataManagement;

$klein = new Klein();

// Get the access token
$klein->respond('GET', '/api/forge/oauth/token', function () {
    $accessToken = new AccessToken();
    return $accessToken->getAccessToken();
});

// Get all the buckets & objects
$klein->respond('GET', '/api/forge/oss/buckets', function () {
    $dataManagement = new DataManagement();
    return $dataManagement->getBucketsAndObjects();
});

// Create a new bucket
$klein->respond('POST', '/api/forge/oss/buckets', function(){
    $dataManagement = new DataManagement();
    return $dataManagement->createOneBucket();
});

// Upload a file to a bucket
$klein->respond('POST', '/api/forge/oss/objects', function () {
    $dataManagement = new DataManagement();
    return $dataManagement->uploadFile();
});

// Start translate the model
$klein->respond('POST', '/api/forge/modelderivative/jobs', function () {
    $modelDerivative = new ModelDerivative();
    return $modelDerivative->translateFile();
});

$klein->dispatch();

