<?php

namespace Autodesk\Controller;
use Autodesk\Auth\Configuration;
use Autodesk\Auth\OAuth2\TwoLeggedAuth;

use Autodesk\Forge\Client\Api\BucketsApi;
use Autodesk\Forge\Client\Model\PostBucketsPayload;

use Autodesk\Forge\Client\Api\ObjectsApi;

use Autodesk\Forge\Client\Model\JobPayload;
use Autodesk\Forge\Client\Model\JobPayloadInput;
use Autodesk\Forge\Client\Model\JobPayloadOutput;
use Autodesk\Forge\Client\Model\JobPayloadItem;
use Autodesk\Forge\Client\Api\DerivativesApi;

class ForgeServices
{
    const CLIENTID = 'z8fGD7sOz27dGsiG1g3df2nelkXchTAV';
    const CLIENTSECRET = '7BxtA1m7Y3NAuhPv';
    private $twoLeggedAuth;

    public function __construct()
    {
        set_time_limit(0);

        Configuration::getDefaultConfiguration()
            ->setClientId(self::CLIENTID)
            ->setClientSecret(self::CLIENTSECRET);
        $this->twoLeggedAuth = new TwoLeggedAuth();
        $this->twoLeggedAuth->setScopes(['bucket:read','data:read','bucket:create','data:create','data:write','account:read','account:write']);
        $this->twoLeggedAuth->fetchToken();
    }    

    public function getAccessToken()
    {
        $tokenInfo = array(
            'access_token'  => $this->twoLeggedAuth->getAccessToken(),
            'expires_in'    => $this->twoLeggedAuth->getExpiresIn(),
        );
        echo json_encode($tokenInfo);
    }


    public function createOneBucket(){
        // get the request body
        $body = json_decode(file_get_contents('php://input', 'r'), true);
        
        $bucketKey = $body['bucketKey'];
        // $policeKey = $body['policyKey'];
        $policeKey = "transient";

        $apiInstance = new BucketsApi($this->twoLeggedAuth);
        $post_bucket = new PostBucketsPayload(); 
        $post_bucket->setBucketKey($bucketKey);
        $post_bucket->setPolicyKey($policeKey);

        try {
            $result = $apiInstance->createBucket($post_bucket);
            print_r($result);
        } catch (Exception $e) {
            echo 'Exception when calling BucketsApi->createBucket: ', $e->getMessage(), PHP_EOL;
        }   
     }


     /////////////////////////////////////////////////////////////////////////
     public function getAllBuckets()
     {
        $id = $_GET['id'];
        if ($id === '#') {// root
            $apiInstance = new BucketsApi($this->twoLeggedAuth);
            try{
                $result = $apiInstance->getBuckets();
                $resultArray = json_decode($result, true);
                $buckets = $resultArray['items'];
                $bucketsLength = count($buckets);
                $bucketlist = array();
                for($i=0; $i< $bucketsLength; $i++){
                    $bucketInfo = array('id'=>$buckets[$i]['bucketKey'],
                                        'text'=>$buckets[$i]['bucketKey'],
                                        'type'=>'bucket',
                                        'children'=>true
                    );
                    array_push($bucketlist, $bucketInfo);
                }
                echo json_encode($bucketlist);
                die; 
            }catch (Exception $e) {
                echo 'Exception when calling BucketsApi->getBuckets: ', $e->getMessage(), PHP_EOL;
            }
        }
        else{
            $apiInstance = new ObjectsApi($this->twoLeggedAuth);
            $bucket_key = $id; 
            try {
                $result = $apiInstance->getObjects($bucket_key);
                $resultArray = json_decode($result, true);
                $objects = $resultArray['items'];

                $objectsLength = count($objects);
                $objectlist = array();
                for($i=0; $i< $objectsLength; $i++){
                    
                    $objectInfo = array('id'=>base64_encode($objects[$i]['objectId']),
                                        'text'=>$objects[$i]['objectKey'],
                                        'type'=>'object',
                                        'children'=>false
                    );
                    array_push($objectlist, $objectInfo);
                }
                echo json_encode($objectlist);
                die; 
            } catch (Exception $e) {
                echo 'Exception when calling ObjectsApi->getObjects: ', $e->getMessage(), PHP_EOL;
            }
        }
     }
 

    public function translateFile(){
        $body = json_decode(file_get_contents('php://input', 'r'), true);
        $objectId = $body['objectName'];

        $apiInstance = new DerivativesApi($this->twoLeggedAuth);
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


    public function uploadFile()
    {
        // $apiInstance 
        // $body = file_get_contents('php://input', 'r');
        // var_dump($body);
        
        // var_dump(($_POST));
        // die;

        $body = $_POST;
        $file = $_FILES;
        // $_SESSION['file'] = $file;
        // var_dump($_SESSION['file']);die;
        // var_dump($_FILES);die;
        // die;

        $apiInstance = new ObjectsApi($this->twoLeggedAuth);
        $bucket_key  = $body['bucketKey']; 
        $fileToUpload    = $file['fileToUpload'];
        $filePath = $fileToUpload['tmp_name'];
        $content_length = filesize($filePath); 

        // $fileRead = fread($filePath, $content_length);
        
        try {
            $result = $apiInstance->uploadObject($bucket_key, $fileToUpload['name'], $content_length, $filePath );
            print_r($result);
        } catch (Exception $e) {
            echo 'Exception when calling ObjectsApi->uploadObject: ', $e->getMessage(), PHP_EOL;
        }
    }  
}