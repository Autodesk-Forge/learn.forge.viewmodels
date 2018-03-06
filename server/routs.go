package server

import (
	"encoding/binary"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/apprentice3d/forge-api-go-client/dm"
	"github.com/apprentice3d/forge-api-go-client/md"
	"github.com/apprentice3d/forge-api-go-client/oauth"
)

// ForgeServices holds reference to all services required in this server
type ForgeServices struct {
	oauth.TwoLeggedAuth
	dm.BucketAPI
	md.ModelDerivativeAPI
}

// AccessTokenResponse reflects the data expected by frontend when asking for a token
type AccessTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int32  `json:"expires_in"`
}

// BucketCreateInput reflects the expected body when processing the POST request to bucket managing endpoint
type BucketCreateInput struct {
	BucketKey string `json:"bucketKey"`
}

// TranslationInput reflects the expected body when processing the POST request to bucket managing endpoint
type TranslationInput struct {
	BucketKey  string `json:"bucketKey"`
	ObjectName string `json:"objectName"`
}

type Node struct {
	ID       string `json:"id"`
	Text     string `json:"text"`
	Type     string `json:"type"`
	Children bool   `json:"children"`
}

// getAccessToken returns a valid access token in the form of {'access_token':value, 'expires_in':value}
func (service ForgeServices) getAccessToken(writer http.ResponseWriter, request *http.Request) {

	if request.Method != http.MethodGet {
		http.Error(writer, "Unsupported request method", http.StatusMethodNotAllowed)
		return
	}

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

// manageBuckets performs depending on the request method:
// 	case POST: creates a new bucket, receive input in the form of {'bucketKey': 'theKey'} and return 200.
//	case GET: return all buckets or objects in form of list of nodes
func (service ForgeServices) manageBuckets(writer http.ResponseWriter, request *http.Request) {
	if request.Method == http.MethodPost {
		decoder := json.NewDecoder(request.Body)
		defer request.Body.Close()

		createBucketRequest := &BucketCreateInput{}
		err := decoder.Decode(createBucketRequest)
		if err != nil {
			http.Error(writer, "Could not parse body: "+err.Error(), http.StatusBadRequest)
		}

		log.Println("Request for creating a bucket with key = ", createBucketRequest.BucketKey)

		//TODO: enable this to work with real data
		_, err = service.CreateBucket(createBucketRequest.BucketKey, "transient")
		if err != nil {
			http.Error(writer, "Could not create bucket: "+err.Error(), http.StatusInternalServerError)
			return
		}

		writer.WriteHeader(http.StatusOK)
		return
	}

	if request.Method == http.MethodGet {
		encoder := json.NewEncoder(writer)
		var result []Node

		id := request.URL.Query().Get("id")
		log.Println("Received listing request with id=", id)
		if id != "#" {
			log.Printf("Got bucketKey=%s, returning list of object in that bucket", id)
			objectList, err := service.ListObjects(id, "", "", "")
			if err != nil {
				http.Error(writer, "Could not get the object list: "+err.Error(), http.StatusInternalServerError)
				return
			}

			for _, item := range objectList.Items {
				result = append(result, Node{
					ID:   item.ObjectID,
					Text: item.ObjectKey,
					Type: "object",
				})
			}

		} else {
			log.Println("Returning list of buckets")
			bucketList, err := service.ListBuckets("", "", "")
			if err != nil {
				http.Error(writer, "Could not get the bucket list: "+err.Error(), http.StatusInternalServerError)
				return
			}

			for _, bucket := range bucketList.Items {
				result = append(result, Node{
					ID:   bucket.BucketKey,
					Text: bucket.BucketKey,
					Type: "bucket",
				})
			}

		}

		writer.Header().Add("Content-Type", "application/json")
		err := encoder.Encode(result)
		if err != nil {
			http.Error(writer,
				"Could not encode bucket/object list into response body: "+err.Error(),
				http.StatusInternalServerError)
			return
		}

		return
	}

	http.Error(writer, "Unsupported request method", http.StatusMethodNotAllowed)
	return
}

// manageObjects uploads an object given a file and bucketKey as a multipart/form-data.
// For simplicity, non-resumable.
func (service ForgeServices) manageObjects(writer http.ResponseWriter, request *http.Request) {

	if request.Method != http.MethodPost {
		http.Error(writer, "Unsupported request method", http.StatusMethodNotAllowed)
		return
	}

	request.ParseMultipartForm(32 << 20)
	bucketKey := request.FormValue("bucketKey")

	file, header, err := request.FormFile("fileToUpload")
	if err != nil {
		http.Error(writer, "Could not get the file from form: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(writer, "Problem reading the file content: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer request.Body.Close()

	log.Printf("Received request to upload a file of size %v to bucket %s\n", binary.Size(data), bucketKey)

	_, err = service.UploadObject(bucketKey, header.Filename, data)
	if err != nil {
		http.Error(writer, "Could not upload file: "+err.Error(), http.StatusBadRequest)
		return
	}

	return
}

// translate Object translates the file, given input in the form of {'bucketKey': 'theKey', 'objectName': 'theName'}
func (service ForgeServices) translateObject(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		http.Error(writer, "Unsupported request method", http.StatusMethodNotAllowed)
		return
	}

	decoder := json.NewDecoder(request.Body)
	defer request.Body.Close()

	translationRequest := &TranslationInput{}
	err := decoder.Decode(translationRequest)
	if err != nil {
		http.Error(writer, "Could not parse body: "+err.Error(), http.StatusBadRequest)
	}

	log.Printf("Request for translating object %s from bucket %s",
		translationRequest.ObjectName,
		translationRequest.BucketKey)

	//TODO: enable this to work with real data
	response, err := service.TranslateToSVF(translationRequest.ObjectName)
	if err != nil {
		http.Error(writer, "Could not translate object: "+err.Error(), http.StatusInternalServerError)
		return
	}
	//log.Println("Translation result: ", response.Result)
	log.Printf("Translation result: %#v", response)
	writer.WriteHeader(http.StatusOK)
	return
}
