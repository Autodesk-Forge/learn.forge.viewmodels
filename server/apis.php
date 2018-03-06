<?php
/**
 * Created by PhpStorm.
 * User: zhongwu
 * Date: 2018/3/6
 * Time: 下午3:55
 */
namespace server\Controller;
use Autodesk\Auth\Configuration;
use Autodesk\Auth\OAuth2\TwoLeggedAuth;


use Autodesk\Forge\Client\Api\BucketsApi;
use Autodesk\Forge\Client\Model\PostBucketsPayload;
// use Autodesk\Forge\Client\Model\JobIgesOutputPayload;

class Demo
{
    const CLIENTID = 'z8fGD7sOz27dGsiG1g3df2nelkXchTAV';
    const CLIENTSECRET = '7BxtA1m7Y3NAuhPv';
    private $twoLeggedAuth;



    public function getAccessToken()
    {
     
        Configuration::getDefaultConfiguration()
            ->setClientId(self::CLIENTID)
            ->setClientSecret(self::CLIENTSECRET);
        $this->twoLeggedAuth = new TwoLeggedAuth();
        $this->twoLeggedAuth->setScopes(['bucket:read']);
        $this->twoLeggedAuth->fetchToken();
        $tokenInfo = [
            'applicationToken' => $this->twoLeggedAuth->getAccessToken(),
            'expiry'           => time() + $this->twoLeggedAuth->getExpiresIn(),
        ];
        // echo json_encode($tokenInfo);
    }


    public function createOneBucket(){
        // print_r($_POST);
        // print_r($_GET);
        
        $this->getAccessToken();
        $apiInstance = new BucketsApi($this->twoLeggedAuth);
        $post_buckets = new PostBucketsPayload(); 

        try {
            $result = $apiInstance->createBucket($post_buckets, $x_ads_region);
            print_r($result);
        } catch (Exception $e) {
            echo 'Exception when calling BucketsApi->createBucket: ', $e->getMessage(), PHP_EOL;
        }   
     }


     /////////////////////////////////////////////////////////////////////////
     public function getAllBuckets()
     {
        //  echo  'getAllBuckets';
         $this->getAccessToken();
         $apiInstance = new BucketsApi($this->twoLeggedAuth);
         try {
             $result = $apiInstance->getBuckets();
            //  print_r($result);
             echo $result;
             die; 
         } catch (Exception $e) {
             echo 'Exception when calling BucketsApi->getBuckets: ', $e->getMessage(), PHP_EOL;
         }
     }
 

    public function test()
    {
        //print_r($_SERVER);
        print_r($_POST);
        print_r($_GET);
    }
}