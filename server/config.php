<?php
namespace Autodesk\ForgeServices;

class ForgeConfig{
    private static $forge_id = null;
    private static $forge_secret = null;

    public static function getForgeID(){
      $forge_id = getenv('FORGE_CLIENT_ID');
      return $forge_id? $forge_id : "<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>";
    }

    public static function getForgeSecret(){
      $forge_secret = getenv('FORGE_CLIENT_SECRET');
      return $forge_secret? $forge_secret : "<<YOUR CLIENT SECRET FROM DEVELOPER PORTAL>>";
    }

    // Required scopes for your application on server-side
    public static function getScopeInternal(){
      return ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'];
    }

    // Required scope of the token sent to the client
    public static function getScopePublic(){
      return ['data:read'];
    }
  
}

