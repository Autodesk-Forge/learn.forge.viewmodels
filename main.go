package main

import (
	"log"
	"os"

	"github.com/apprentice3d/learn.forge.viewmodels/server"
)

const (
	PORT = ":3000"
)

func main() {

	clientID := os.Getenv("FORGE_CLIENT_ID")
	clientSecret := os.Getenv("FORGE_CLIENT_SECRET")

	if clientID == "" || clientSecret == "" {
		log.Fatal("The FORGE_CLIENT_ID and FORGE_CLIENT_SECRET env vars are not set. \nExiting ...")
	}

	log.Println("Starting server on port ", PORT)
	server.StartServer(PORT, clientID, clientSecret)
}