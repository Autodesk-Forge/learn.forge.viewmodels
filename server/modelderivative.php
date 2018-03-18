<?php

namespace Autodesk\ForgeServices;

use Autodesk\Forge\Client\Api\DerivativesApi;
use Autodesk\Forge\Client\Model\JobPayload;
use Autodesk\Forge\Client\Model\JobPayloadInput;
use Autodesk\Forge\Client\Model\JobPayloadOutput;
use Autodesk\Forge\Client\Model\JobPayloadItem;

class ModelDerivative{
    public function __construct(){
        set_time_limit(0);
    }    

    public function translateFile(){
        global $twoLeggedAuth;
        $accessToken = $twoLeggedAuth->getTokenInternal();

        $body = json_decode(file_get_contents('php://input', 'r'), true);
        $objectId = $body['objectName'];

        $apiInstance = new DerivativesApi($accessToken);
        $job         = new JobPayload(); 

        $jobInput    = new JobPayloadInput();
        $jobInput->setUrn($objectId);

        $jobOutputItem = new JobPayloadItem();
        $jobOutputItem->setType('svf');
        $jobOutputItem->setViews(array('2d','3d'));
        
        $jobOutput   = new JobPayloadOutput();
        $jobOutput->setFormats(array($jobOutputItem));

        $job->setInput($jobInput);
        $job->setOutput($jobOutput);

        $x_ads_force = false; 
        try {
            $result = $apiInstance->translate($job, $x_ads_force);
            print_r($result);
        } catch (Exception $e) {
            echo 'Exception when calling DerivativesApi->translate: ', $e->getMessage(), PHP_EOL;
        }
    }
}