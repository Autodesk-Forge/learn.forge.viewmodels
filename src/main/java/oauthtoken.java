import org.codehaus.jettison.json.JSONObject;
import org.joda.time.DateTime;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;

import com.autodesk.client.auth.OAuth2TwoLegged;

@WebServlet({ "/oauthtoken" })
public class oauthtoken extends HttpServlet {

	public oauthtoken() {
	}

	public void init() throws ServletException {

	}

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		resp.setCharacterEncoding("utf8");
		resp.setContentType("application/json");
		PrintWriter out = resp.getWriter();
		JSONObject obj = new JSONObject();

		try {
			// get oAuth of public, in order to get the token with limited permission
			OAuth2TwoLegged forgeOAuth = oauth.getOAuthPublic();
			String token = forgeOAuth.getCredentials().getAccessToken();
			// this is a timestamp, not the exact value of expires_in, so calculate back
			// client side will need this. though not necessary
			long expire_time_from_SDK = forgeOAuth.getCredentials().getExpiresAt();
			// because we do not know when the token is got, align to current time
			// which will be a bit less than what Forge sets (say 3599 seconds). This makes
			// sense.
			long expires_in = (long) (expire_time_from_SDK - DateTime.now().toDate().getTime()) / 1000;
			// send to client
			obj.put("access_token", token);
			obj.put("expires_in", expires_in);

			out.print(obj);
		} catch (Exception var2) {
			System.out.print("get token exception: " + var2.toString());
			resp.setStatus(500);
		}

	}

	public void destroy() {
		super.destroy();
	}
}