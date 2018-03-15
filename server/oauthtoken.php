<?php

namespace Autodesk\ForgeServices;
include_once "oauth.php";

class AccessToken
{
    public function __construct()
    {
        set_time_limit(0);
    }    

    public function getAccessToken()
    {
        global $twoLeggedAuth;
        $accessToken = $twoLeggedAuth->getTokenInternal();
        $tokenInfo = array(
            'access_token'  => $accessToken->getAccessToken(),
            'expires_in'    => $accessToken->getExpiresIn(),
        );
        print_r( json_encode($tokenInfo));
    }

}