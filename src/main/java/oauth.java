package forgesample;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.joda.time.Instant;
import org.json.simple.JSONObject;

import com.autodesk.client.auth.Credentials;
import com.autodesk.client.auth.OAuth2TwoLegged;

public class oauth {

	private static Credentials twoLeggedCredentials = null;

	//build the oAuth object with public scope
	public static OAuth2TwoLegged getOAuthPublic() throws Exception {
		return OAuthRequest(config.scopePublic, "public");
	}

	//build the oAuth object with internal scope 
	public static OAuth2TwoLegged getOAuthInternal() throws Exception {
		return OAuthRequest(config.scopeInternal, "internal");
	}

	private static Map<String, OAuth2TwoLegged> _cached = new HashMap<String, OAuth2TwoLegged>();

	private static OAuth2TwoLegged OAuthRequest(ArrayList<String> scopes, String cache) throws Exception {

		// API call of Forge SDK will refresh credentials (token etc) automatically
		// so, store the oauth objects only
		// public scope and internal scope separately
		if (_cached.containsKey(cache)) {
			return (OAuth2TwoLegged) _cached.get(cache);
		} else {
			String client_id = config.credentials.client_id;
			String client_secret = config.credentials.client_secret;
			OAuth2TwoLegged forgeOAuth = OAuthClient(scopes);
			// in the first time, call authenticate once to initialize the credentials
			forgeOAuth.authenticate();
			_cached.put(cache, forgeOAuth);
			return forgeOAuth;
		}
	}

	public static OAuth2TwoLegged OAuthClient(ArrayList<String> scopes) throws Exception {

		String client_id = config.credentials.client_id;
		String client_secret = config.credentials.client_secret;
		if (scopes == null)
			scopes = config.scopeInternal;

		// by the 3rd parameter, the oAuth object will refresh credentials (token etc)
		// automatically
		return new OAuth2TwoLegged(client_id, client_secret, scopes, Boolean.valueOf(true));

	}
}