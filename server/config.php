<?php
namespace Autodesk\ForgeServices;
use Dotenv\Dotenv;

class ForgeConfig{
    private static $forge_id = null;
    private static $forge_secret = null;
    public static $prepend_bucketkey = true; //toggle client ID prefix to avoid conflict with existing buckets

    public static function getForgeID(){
      $forge_id = '';
      if(!array_key_exists('FORGE_CLIENT_ID', $_ENV)){
        // load the environment variable from .env into your application
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();
      }
      $forge_id = $_ENV['FORGE_CLIENT_ID'];
      return $forge_id;
    }

    public static function getForgeSecret(){
      $forge_secret = '';
      if(!array_key_exists('FORGE_CLIENT_SECRET', $_ENV)){
        // load the environment variable from .env into your application
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();
      }
      $forge_secret = $_ENV['FORGE_CLIENT_SECRET'];
      return $forge_secret;
    }

    // Required scopes for your application on server-side
    public static function getScopeInternal(){
      return ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'];
    }

    // Required scope of the token sent to the client
    public static function getScopePublic(){
      // Will update the scope to viewables:read when #13 of autodesk/forge-client is fixed
      return ['data:read'];
    }

}
