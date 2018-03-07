package server

import (
	"net/http"
	"io/ioutil"
	"log"
	"encoding/binary"
)

// manageObjects uploads an object given a file and bucketKey as a multipart/form-data.
// For simplicity, non-resumable.
func (service ForgeServices) manageObjects(writer http.ResponseWriter, request *http.Request) {

	if request.Method != http.MethodPost {
		http.Error(writer, "Unsupported request method", http.StatusMethodNotAllowed)
		return
	}

	// read the form data
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
