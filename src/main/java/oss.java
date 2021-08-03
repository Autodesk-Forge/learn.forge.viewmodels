package forgesample;

import java.io.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.xml.bind.DatatypeConverter;

import org.json.*;

import com.autodesk.client.auth.OAuth2TwoLegged; 
import com.autodesk.client.ApiException;
import com.autodesk.client.ApiResponse;
import com.autodesk.client.api.*;
import com.autodesk.client.model.*;


@WebServlet(name = "oss", 
			urlPatterns = {"/api/forge/oss/buckets", "/oss"})
public class oss extends HttpServlet {

    private static final long serialVersionUID = 1L;

	public oss() {
	}

	public void init() throws ServletException {

	}

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		// for get buckets info

		String id = req.getParameter("id");
		resp.setCharacterEncoding("utf8");
		resp.setContentType("application/json");
		try {
			// get oAuth of internal, in order to get the token with higher permissions
			OAuth2TwoLegged forgeOAuth = oauth.getOAuthInternal();
			if (id.equals("#")) {// root
				BucketsApi bucketsApi = new BucketsApi();

				//replace the first param with other values if it is other region, such as 'emea'
				ApiResponse<Buckets> buckets = bucketsApi.getBuckets("us", 100, null, forgeOAuth,
						forgeOAuth.getCredentials());

				JSONArray bucketsArray = new JSONArray();
				PrintWriter out = resp.getWriter();

				// iterate buckets
				for (int i = 0; i < buckets.getData().getItems().size(); i++) {

					// get bucker info
					BucketsItems eachItem = buckets.getData().getItems().get(i);
					JSONObject obj = new JSONObject();

					obj.put("id", eachItem.getBucketKey());
					obj.put("text", eachItem.getBucketKey());
					obj.put("type", "bucket");
					obj.put("children", true);

					bucketsArray.put(obj);

				}

				out.print(bucketsArray);

			} else {

				// as we have the id (bucketKey), let's return all objects
				ObjectsApi objectsApi = new ObjectsApi();

				ApiResponse<BucketObjects> objects = objectsApi.getObjects(id, 100, null, null, forgeOAuth,
						forgeOAuth.getCredentials());

				JSONArray objectsArray = new JSONArray();
				PrintWriter out = resp.getWriter();

				// iterate each items of the bucket
				for (int i = 0; i < objects.getData().getItems().size(); i++) {

					// make a note with the base64 urn of the item
					ObjectDetails eachItem = objects.getData().getItems().get(i);
					String base64Urn = DatatypeConverter.printBase64Binary(eachItem.getObjectId().getBytes());

					JSONObject obj = new JSONObject();

					obj.put("id", base64Urn);
					obj.put("text", eachItem.getObjectKey());
					obj.put("type", "object");
					obj.put("children", false);

					objectsArray.put(obj);

				}

				out.print(objectsArray);

			}
		} catch (ApiException autodeskExp) {
			System.out.print("get buckets & objects exception: " + autodeskExp.toString());
			resp.setStatus(500);

		} catch (Exception exp) {
			System.out.print("get buckets & objects exception: " + exp.toString());
			resp.setStatus(500);
		}

	}

	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		// for create bucket

		try {

			// from
			// https://stackoverflow.com/questions/3831680/httpservletrequest-get-json-post-data/3831791
			StringBuffer jb = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = req.getReader();
				while ((line = reader.readLine()) != null)
					jb.append(line);
			} catch (Exception e) {
				/* report an error */ }

			// Create a new bucket
			try {
				// get oAuth of internal, in order to get the token with higher permissions
				OAuth2TwoLegged forgeOAuth = oauth.getOAuthInternal();

				JSONObject jsonObject = new JSONObject(jb.toString());
				String bucketKey = jsonObject.getString("bucketKey");

				// build the payload of the http request
				BucketsApi bucketsApi = new BucketsApi();
				PostBucketsPayload postBuckets = new PostBucketsPayload();
				postBuckets.setBucketKey(bucketKey);
				// expires in 24h
				postBuckets.setPolicyKey(PostBucketsPayload.PolicyKeyEnum.TRANSIENT);

				ApiResponse<Bucket> newbucket = bucketsApi.createBucket(postBuckets, null, forgeOAuth,
						forgeOAuth.getCredentials());

				resp.setStatus(200);

			} catch (ApiException autodeskExp) {
				System.out.print("get buckets & objects exception: " + autodeskExp.toString());
				resp.setStatus(500);

			} catch (Exception exp) {
				System.out.print("get buckets & objects exception: " + exp.toString());
				resp.setStatus(500);

			}

		} catch (JSONException e) {
			// crash and burn
			throw new IOException("Error parsing JSON request string");
		}

	}

	public void destroy() {
		super.destroy();
	}
}