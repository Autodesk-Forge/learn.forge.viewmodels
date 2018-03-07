package server

import (
	"net/http"
	"encoding/json"
)

// AccessTokenResponse reflects the data expected by frontend when asking for a token
type AccessTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int32  `json:"expires_in"`
}



// getAccessToken returns a valid access token in the form of {'access_token':value, 'expires_in':value}
func (service ForgeServices) getAccessToken(writer http.ResponseWriter, request *http.Request) {

	if request.Method != http.MethodGet {
		http.Error(writer, "Unsupported request method", http.StatusMethodNotAllowed)
		return
	}

	writer.Header().Add("Content-Type", "application/json")
	encoder := json.NewEncoder(writer)
	bearer, err := service.Authenticate("viewables:read")

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	err = encoder.Encode(AccessTokenResponse{
		bearer.AccessToken,
		bearer.ExpiresIn,
	})

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
	}

}