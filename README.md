# learn.forge.viewmodels (Go)

![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://developer.autodesk.com/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://developer.autodesk.com/)
[![Viewer](https://img.shields.io/badge/Viewer-v4.0-green.svg)](http://developer.autodesk.com/)

# Description

This sample is part of the [Learn Forge](http://learnforge.autodesk.io) tutorials.

# Setup

For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create) that uses Data Management and Model Derivative APIs. For this new app, use `http://localhost:3000/api/forge/callback/oauth` as Callback URL, although is not used on 2-legged flow. Finally take note of the **Client ID** and **Client Secret**.

## Run Locally

Before running the sample, you should set the client ID & secret
environment variables:

***Mac OSX/Linux (Terminal)***

```bash
export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
```

***Windows (Command Prompt)***

```bash
set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
```

## Usage

There are 2 ways to run this sample:

1. Download the go_sample.zip archive appropriate to your OS from
[releases](https://github.com/Autodesk-Forge/learn.forge.viewmodels/releases).
Unzip it and start the ***sample*** executable from unzipped folder.

2. Install [Go Programming Language](https://golang.org/).

Make sure you [$GOPATH](https://github.com/golang/go/wiki/GOPATH) environment variable is set, this is required for first time usage.
You can use a `/go/` folder under your user folder in case OSX and Linux OS:

```bash
// MacOS & Linux
export GOPATH=$HOME/go
```

In case of Windows, we recommend setting up the `GOPATH` into a simple location like `C:\GOPROJECTS`:

```cmd
// Windows
set GOPATH=C:\GOPROJECTS
```

After the Go language is set up, run:

```bash
go get github.com/autodesk-forge/forge.learning.viewmodels.go
```

and navigate to `$GOPATH/src/github.com/autodesk-forge/forge.learning.viewmodels.go` and run

```bash
go run main.go
```


Once your app is started, open the browser:
[http://localhost:3000](http://localhost:3000)
On the webpage, the **New Bucket** blue button allow create new buckets (as of now, minimum input validation is implemented). For any bucket, right-click to upload a file (objects). For demonstration, objects **are not** automatically translated, but right-click on a object and select **Translate**.

# License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Denis Grigor [@apprentice3d](https://twitter.com/apprentice3d),
[Forge Partner Development](http://forge.autodesk.com)
