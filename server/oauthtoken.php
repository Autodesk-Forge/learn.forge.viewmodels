<?php
namespace Autodesk\ForgeServices;

class AccessToken{
    public function __construct(){
        set_time_limit(0);
    }    

    public function getAccessToken(){
        global $twoLeggedAuth;
        try{
            $accessToken = $twoLeggedAuth->getTokenPublic();
            print_r( json_encode($accessToken));
        }catch (Exception $e) {
            echo 'Exception when calling twoLeggedAuth->getTokenPublic: ', $e->getMessage(), PHP_EOL;
        }
    }
}