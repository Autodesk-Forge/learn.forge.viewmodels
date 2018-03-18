<?php
namespace Autodesk\ForgeServices;

class AccessToken{
    public function __construct(){
        set_time_limit(0);
    }    

    public function getAccessToken(){
        global $twoLeggedAuth;
        try{
            $accessToken = $twoLeggedAuth->getTokenInternal();
            $tokenInfo = array(
                'access_token'  => $accessToken->getAccessToken(),
                'expires_in'    => $accessToken->getExpiresIn(),
            );
            print_r( json_encode($tokenInfo));
        }catch (Exception $e) {
            echo 'Exception when calling twoLeggedAuth->getTokenInternal: ', $e->getMessage(), PHP_EOL;
        }
    }
}