package forgesample;

import java.util.ArrayList;

public class config {

    // set environment variables or hard-code here 
    public static class credentials{
        public static String client_id = System.getenv("FORGE_CLIENT_ID");
        public static String client_secret = System.getenv("FORGE_CLIENT_SECRET");
    }; 

    // Required scopes for your application on server-side
    public static ArrayList<String> scopeInternal = new ArrayList<String>() {{
        add("bucket:create");
        add("bucket:read");
        add("data:read");
        add("data:create");
        add("data:write");
    }};

    // Required scope of the token sent to the client
    public static ArrayList<String> scopePublic = new ArrayList<String>() {{
        add("viewables:read");
    }};

}