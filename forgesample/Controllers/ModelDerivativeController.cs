using Autodesk.Forge;
using Autodesk.Forge.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace forgesample.Controllers
{
  public class ModelDerivativeController : ApiController
  {
    public class TranslateObjectModel
    {
      public string bucketKey { get; set; }
      public string objectName { get; set; }
    }

    [HttpPost]
    [Route("api/forge/modelderivative/jobs")]
    public async Task<dynamic> TranslateObject([FromBody]TranslateObjectModel objModel)
    {
      dynamic oauth = await OAuthController.GetInternalAsync();

      List<JobPayloadItem> outputs = new List<JobPayloadItem>()
      {
       new JobPayloadItem(
         JobPayloadItem.TypeEnum.Svf,
         new List<JobPayloadItem.ViewsEnum>()
         {
           JobPayloadItem.ViewsEnum._2d,
           JobPayloadItem.ViewsEnum._3d
         })
      };
      JobPayload job;
      job = new JobPayload(new JobPayloadInput(objModel.objectName), new JobPayloadOutput(outputs));

      DerivativesApi derivative = new DerivativesApi();
      derivative.Configuration.AccessToken = oauth.access_token;
      dynamic jobPosted = await derivative.TranslateAsync(job);
      return jobPosted;
    }
  }
}
