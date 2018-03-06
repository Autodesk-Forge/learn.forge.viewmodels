package server

import (
	"log"
	"net/http"

	"github.com/apprentice3d/forge-api-go-client/dm"
	"github.com/apprentice3d/forge-api-go-client/md"
	"github.com/apprentice3d/forge-api-go-client/oauth"
)

func StartServer(port, clientID, clientSecret string) {

	service := ForgeServices{
		oauth.NewTwoLeggedClient(clientID, clientSecret),
		dm.NewBucketAPIWithCredentials(clientID, clientSecret),
		md.NewAPIWithCredentials(clientID, clientSecret),
	}

	// serving static files
	static := http.FileServer(http.Dir("www"))
	http.Handle("/", static)

	// defining other endpoints
	http.HandleFunc("/api/forge/oauth/token", service.getAccessToken)
	http.HandleFunc("/api/forge/oss/buckets", service.manageBuckets)
	http.HandleFunc("/api/forge/oss/objects", service.manageObjects)
	http.HandleFunc("/api/forge/modelderivative/jobs", service.translateObject)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err.Error())
	}

}
