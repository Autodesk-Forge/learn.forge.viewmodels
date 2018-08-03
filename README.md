# forge.tutorial.viewmodels.nodejs

[![JDK8](https://img.shields.io/badge/JDK-8-green.svg)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
[![Apache Tomcat](https://img.shields.io/badge/Tomcat-9.0-yellow.svg)](https://tomcat.apache.org/download-90.cgi)
[![Eclipse](https://img.shields.io/badge/Eclipse-Oxygen-orange.svg)](http://www.eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/oxygen3) 
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://developer.autodesk.com/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://developer.autodesk.com/)

# Description

This sample is part of the [Learn Forge](http://learnforge.autodesk.io) tutorials.

# Setup

For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL, although is not used on 2-legged flow. Finally take note of the **Client ID** and **Client Secret**.

### Run locally

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone -b java https://github.com/autodesk-forge/forge.learning.viewmodels

To run it, install the required packages, set the enviroment variables with your client ID & secret (or input manually to [config.java](/src/main/java/config.java). In [Eclipse](http://www.eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/oxygen3), right click project, locate [Run As], then [Maven Install]. And follow the steps to [configure the server](http://learnforge.autodesk.io/#/environment/rundebug/java) and finally start it. 

Open the browser: [http://localhost:3000](http://localhost:3000).

## Packages used

The [Autodesk Forge](https://github.com/Autodesk-Forge/forge-api-java-client) packages is included by default. Some other non-Autodesk packaged are used, including [WebServlet](https://docs.oracle.com/javaee/6/api/javax/servlet/annotation/WebServlet.html) and [commons-fileupload](https://mvnrepository.com/artifact/commons-fileupload/commons-fileupload/1.3) for upload file.

# Tips & tricks


## Troubleshooting

If Tomcat throws an error (org.apache.catalina.LifecycleException) when running the sample, it might be the mismatch of Tomcat version and project JSE version, you can follow the article to [check Tomcat JSE version](http://www.codejava.net/ides/eclipse/how-to-change-java-runtime-environment-for-tomcat-in-eclipse).  

# License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Xiaodong Liang [@coldwood](https://twitter.com/coldwood) and Jaime Rosales Duque [@AfroJme](https://twitter.com/AfroJme), [Forge Partner Development](http://forge.autodesk.com)