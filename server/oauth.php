<?php
namespace Autodesk\ForgeServices;

use Autodesk\Auth\Configuration;
use Autodesk\Auth\OAuth2\TwoLeggedAuth;

include_once "config.php";

class AuthClientTwoLegged{
    private $twoLeggedAuthInternal = NULL;
    private $twoLeggedAuthPublic   = NULL;
    
    public function __construct( )
    {
        set_time_limit(0);
        Configuration::getDefaultConfiguration()
            ->setClientId(ForgeConfig::$forge_id)
            ->setClientSecret(ForgeConfig::$forge_secret);
    }    

    public function getTokenPublic(){
        if($this->twoLeggedAuthPublic != NULL )
            return $this->twoLeggedAuthPublic;

        $this->twoLeggedAuthPublic = new TwoLeggedAuth();
        $this->twoLeggedAuthPublic->setScopes(ForgeConfig::$scopePublic);
        $this->twoLeggedAuthPublic->fetchToken();
        return $this->twoLeggedAuthPublic;
    }

    public function getTokenInternal(){
        if($this->twoLeggedAuthInternal != NULL )
            return $this->twoLeggedAuthInternal;
                
        $this->twoLeggedAuthInternal = new TwoLeggedAuth();
        $this->twoLeggedAuthInternal->setScopes(ForgeConfig::$scopeInternal);
        $this->twoLeggedAuthInternal->fetchToken();
        return $this->twoLeggedAuthInternal;
    }
}

$twoLeggedAuth = new AuthClientTwoLegged();
