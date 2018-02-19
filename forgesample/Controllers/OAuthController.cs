/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

using Autodesk.Forge;
using System;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;

namespace forgesample.Controllers
{
  public class OAuthController : ApiController
  {
    // As both internal & public tokens are used for all visitors
    // we don't need to request a new token on every request, so let's
    // cache them using static variables. Note we still need to refresh
    // them after the expires_in time (in seconds)
    private static dynamic InternalToken { get; set; }
    private static dynamic PublicToken { get; set; }

    /// <summary>
    /// Get access token with public (viewables:read) scope
    /// </summary>
    [HttpGet]
    [Route("api/forge/oauth/token")]
    public async Task<dynamic> GetPublicAsync()
    {
      if (PublicToken == null || PublicToken.ExpiresAt < DateTime.UtcNow)
      {
        PublicToken = await Get2LeggedTokenAsync(new Scope[] { Scope.ViewablesRead });
        PublicToken.ExpiresAt = DateTime.UtcNow.AddSeconds(PublicToken.expires_in);
      }
      return PublicToken;
    }

    /// <summary>
    /// Get access token with internal (write) scope
    /// </summary>
    public static async Task<dynamic> GetInternalAsync()
    {
      if (InternalToken == null || InternalToken.ExpiresAt < DateTime.UtcNow)
      {
        InternalToken = await Get2LeggedTokenAsync(new Scope[] { Scope.BucketCreate, Scope.BucketRead, Scope.DataRead, Scope.DataCreate });
        InternalToken.ExpiresAt = DateTime.UtcNow.AddSeconds(InternalToken.expires_in);
      }

      return InternalToken;
    }

    /// <summary>
    /// Get the access token from Autodesk
    /// </summary>
    private static async Task<dynamic> Get2LeggedTokenAsync(Scope[] scopes)
    {
      TwoLeggedApi oauth = new TwoLeggedApi();
      string grantType = "client_credentials";
      dynamic bearer = await oauth.AuthenticateAsync(
        GetAppSetting("FORGE_CLIENT_ID"),
        GetAppSetting("FORGE_CLIENT_SECRET"),
        grantType,
        scopes);
      return bearer;
    }

    /// <summary>
    /// Reads appsettings from web.config
    /// </summary>
    private static string GetAppSetting(string settingKey)
    {
      return WebConfigurationManager.AppSettings[settingKey];
    }
  }
}
