import java.io.*;
import java.util.Iterator;
import java.util.List;
import java.util.regex.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.autodesk.client.auth.OAuth2TwoLegged;  
import com.autodesk.client.ApiException;
import com.autodesk.client.ApiResponse;
import com.autodesk.client.api.ObjectsApi;
import com.autodesk.client.model.ObjectDetails;

@WebServlet({ "/ossuploads" })
public class ossuploads extends HttpServlet {

	public ossuploads() {
	}

	public void init() throws ServletException {

	}

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

	}

	private String filename(String contentTxt) throws UnsupportedEncodingException {
		Pattern pattern = Pattern.compile("filename=\"(.*)\"");
		Matcher matcher = pattern.matcher(contentTxt);
		matcher.find();
		return matcher.group(1);
	}

	private byte[] bodyContent(HttpServletRequest request) throws IOException {
		try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
			InputStream in = request.getInputStream();
			byte[] buffer = new byte[1024];
			int length = -1;
			while ((length = in.read(buffer)) != -1) {
				out.write(buffer, 0, length);
			}
			return out.toByteArray();
		}
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException, FileNotFoundException {

		// for uploading file

		try {
			// from
			// https://stackoverflow.com/questions/13048939/file-upload-with-servletfileuploads-parserequest
			if (!ServletFileUpload.isMultipartContent(req)) {
				// not multiparts/formdata
				res.setStatus(500);
			} else {
				// bucket name to store the file
				String bucketKey = "";
				// name of the new file
				String filename = "";
				// path on server to store the new file temporarily
				String serverFilesPath = "/fileuploads";

				// from
				// https://stackoverflow.com/questions/3831680/httpservletrequest-get-json-post-data/3831791

				List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(req);
				Iterator iter = items.iterator();

				File fileToUpload = null;

				// get post body to extract file name and bucket name
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();

					if (!item.isFormField()) {
						filename = item.getName();

						String root = getServletContext().getRealPath("/");
						File path = new File(root + serverFilesPath);
						if (!path.exists()) {
							boolean status = path.mkdirs();
						}

						// store the file stream on server
						String thisFilePathOnServer = path + "/" + filename;
						fileToUpload = new File(thisFilePathOnServer);
						item.write(fileToUpload);
					} else {
						// get bucket name
						if (item.getFieldName().equals("bucketKey")) {
							bucketKey = item.getString();
						}
					}
				}

				ObjectsApi objectsApi = new ObjectsApi();

				// get oAuth of internal, in order to get the token with higher permissions

				OAuth2TwoLegged forgeOAuth = oauth.getOAuthInternal();

				ApiResponse<ObjectDetails> response = objectsApi.uploadObject(bucketKey, filename,
						(int) fileToUpload.length(), fileToUpload, null, null, forgeOAuth, forgeOAuth.getCredentials());

				res.setStatus(response.getStatusCode());
			}

		} catch (ApiException adskexp) {

		} catch (FileNotFoundException fileexp) {
			System.out.print("get buckets & objects exception: " + fileexp.toString());

		}

		catch (Exception exp) {
			System.out.print("get buckets & objects exception: " + exp.toString());

		}
	}

	public void destroy() {
		super.destroy();
	}
}