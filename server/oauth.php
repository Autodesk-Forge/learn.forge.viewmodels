<?php
namespace Autodesk\ForgeServices;

use Autodesk\Auth\Configuration;
use Autodesk\Auth\OAuth2\TwoLeggedAuth;

class AuthClientTwoLegged{
    private $twoLeggedAuthInternal = null;
    private $twoLeggedAuthPublic   = null;
    
    public function __construct(){
        set_time_limit(0);
        Configuration::getDefaultConfiguration()
            ->setClientId(ForgeConfig::getForgeID())
            ->setClientSecret(ForgeConfig::getForgeSecret());

        $this->createTwoLeggedAuth();
    }    

    private function createTwoLeggedAuth(){
        if($this->twoLeggedAuthInternal == null ){
            $this->twoLeggedAuthInternal = new TwoLeggedAuth();
            $this->twoLeggedAuthInternal->setScopes(ForgeConfig::getScopeInternal());
            $this->twoLeggedAuthInternal->fetchToken();
        }
        
        if($this->twoLeggedAuthPublic == null ){
            $this->twoLeggedAuthPublic = new TwoLeggedAuth();
            $this->twoLeggedAuthPublic->setScopes(ForgeConfig::getScopePublic());
            $this->twoLeggedAuthPublic->fetchToken();
        }
    }

    public function getTokenPublic(){
        return $this->twoLeggedAuthPublic;
    }

    public function getTokenInternal(){
        return $this->twoLeggedAuthInternal;
    }
}

$twoLeggedAuth = new AuthClientTwoLegged();
