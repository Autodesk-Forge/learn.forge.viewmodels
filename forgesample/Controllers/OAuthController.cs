using Autodesk.Forge;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;

namespace forgesample.Controllers
{
  public class OAuthController : ApiController
  {
    /// <summary>
    /// Get access token with public (viewables:read) scope
    /// </summary>
    [HttpGet]
    [Route("api/forge/oauth/token")]
    public async Task<dynamic> GetPublicAsync()
    {
      return await Get2LeggedTokenAsync(new Scope[] { Scope.ViewablesRead });
    }

    /// <summary>
    /// Get access token with internal (write) scope
    /// </summary>
    public static async Task<dynamic> GetInternalAsync()
    {
      return await Get2LeggedTokenAsync(new Scope[] { Scope.BucketCreate, Scope.BucketRead, Scope.DataRead, Scope.DataCreate });
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
