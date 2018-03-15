<?php


namespace Autodesk\ForgeServices;

class ForgeConfig{

    public static $forge_id     = "z8fGD7sOz27dGsiG1g3df2nelkXchTAV";
    public static $forge_secret = "7BxtA1m7Y3NAuhPv";
    // public static $forge_id      = getenv("FORGE_CLIENT_ID");
    // public static $forge_secret  = getenv("FROGE_CLIENT_SECRET");

  // Required scopes for your application on server-side
  public static $scopeInternal = ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'];

  // Required scope of the token sent to the client
  public static $scopePublic = ['viewables:read'];
  
}

