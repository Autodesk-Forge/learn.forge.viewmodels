package server

import (
	"log"
	"net/http"
	"encoding/json"
	"encoding/base64"
)

// BucketCreateInput reflects the expected body when processing the POST request to bucket managing endpoint
type BucketCreateInput struct {
	BucketKey string `json:"bucketKey"`
}


type Node struct {
	ID       string `json:"id"`
	Text     string `json:"text"`
	Type     string `json:"type"`
	Children bool   `json:"children"`
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
					ID:   base64.RawStdEncoding.EncodeToString([]byte(item.ObjectID)),
					Text: item.ObjectKey,
					Type: "object",
					Children: false,
				})
			}

		} else {
			log.Println("Returning list of buckets")
			bucketList, err := service.ListBuckets("", "", "")
			if err != nil {
				http.Error(writer, "Could not get the bucket list: "+err.Error(), http.StatusInternalServerError)
				return
			}

			//TODO: parallelize this part: goroutine with accumulating channel.
			for _, bucket := range bucketList.Items {
				children := false
				objectList, err := service.ListObjects(bucket.BucketKey, "", "", "")
				if err == nil && len(objectList.Items) > 0 {
					children = true
				}

				result = append(result, Node{
					ID:   bucket.BucketKey,
					Text: bucket.BucketKey,
					Type: "bucket",
					Children: children,
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



