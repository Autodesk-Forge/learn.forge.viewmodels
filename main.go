package main

import (
	"log"
	"os"

	"github.com/apprentice3d/learn.forge.viewmodels/server"
	"io/ioutil"
	"encoding/json"
	"errors"
	"fmt"
)


type configuration struct {
	ClientID	string `json:"FORGE_CLIENT_ID"`
	ClientSecret string `json:"FORGE_CLIENT_SECRET"`
	Port string	`json:"PORT"`
}

func main() {


	config, err := prepareCredentials("config.json")
	if err != nil {
		log.Fatalf("Failed to setup forge credentials: %s \nExiting ...", err.Error())

	}

	log.Printf("Starting server on port %s, with ClientID = %s", config.Port, config.ClientID)
	server.StartServer(config.Port, config.ClientID, config.ClientSecret)
}


func prepareCredentials(configFile string) (configs configuration, err error) {
	file, err := ioutil.ReadFile(configFile)
	if err != nil {
		return
	}
	err = json.Unmarshal(file, &configs)
	if err != nil {
		log.Println("Could not read the config file: ", err.Error())
	}

	if configs.ClientID == "" || configs.ClientSecret == ""{
		log.Println("Could not get credentials from config file")
		log.Println("Reading Forge secrets from Environment ...")
		configs.ClientID = os.Getenv("FORGE_CLIENT_ID")
		configs.ClientSecret = os.Getenv("FORGE_CLIENT_SECRET")
	}

	if configs.Port == "" {
		log.Println("No port found in config, defaulting to 3000")
		configs.Port = "3000"
	}

	if configs.ClientID == "" || configs.ClientSecret == ""{
		errorReport := fmt.Sprintf("could not setup using config or env vars: \nClientID=%s ClientSecret=%s Port=%s",
			configs.ClientID, configs.ClientSecret, configs.Port)
		err = errors.New(errorReport)
	}


	return
}
