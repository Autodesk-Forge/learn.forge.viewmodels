# forge.tutorial.viewmodel.php

[![PHP](https://img.shields.io/packagist/php-v/symfony/symfony.svg)](http://www.php.net/)
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

Now we need an IDE to write the code. There are many options, this sample will use [Visual Studio Code](https://code.visualstudio.com/).

> For this sample, use all default install options.

Next, install the extension of **PHP Server** for Visual Code, this can help serve your current workspace with PHP.

- Go to Visual Code extension manager (left side, bottom icon)
- Type `PHP` and install `PHP Server` plugin made by ***brapifra***.

### Run locally

Install [PHP](http://php.net/downloads.php).

Install [Composer](https://getcomposer.org/download/).


Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/autodesk-forge/forge.learning.viewmodels.php

To run it, follow the steps:

1. install the required packages by **composer install**;
2. set the $forge_id & $forge_secret in config.php file with your client ID & secret;
3. open the Command Palette from VS Code, and run the command **Serve Project With PHP**, it will start PHP server at port 3000.
4. open your browser and go to `http://localhost:3000/www/index.html`


## Deploy to Heroku
Define config vars from your Forge App Key with the following command in Heroku:
* heroku config:set FORGE_CLIENT_ID="YOUR CLIENT ID FROM DEVELOPER PORTAL"
* heroku config:set FORGE_CLIENT_SECRET="YOUR CLIENT SECRET FROM DEVELOPER PORTAL" 

 or change the $forge_id and $forge_secret to your Forge App Key, and deploy to heroku. Open the live demo at [https://forgeviewerphp.herokuapp.com/index.html](https://forgeviewerphp.herokuapp.com/index.html)

## Packages used

The [Autodesk Forge](https://packagist.org/packages/autodesk/forge-client) packages is included by default. Some other non-Autodesk packaged are used, including [klein](https://packagist.org/packages/klein/klein) for router.

# Tips & tricks

We rewrite the url to have a clean url. to config that: 
For Apache, .htaccess is added to do url rewrite.

If you want to work with Nginx, open nginx.conf, find the server, add the following code in server{ location/{ } } 
<pre><code>
    if (!-e $request_filename) {
        rewrite  ^(.*)$  /index.php?s=$1  last;
        break;
    }
</code></pre>

## Troubleshooting


# License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Zhong Wu [@JohnOnSoftware](https://twitter.com/JohnOnSoftware), [Forge Partner Development](http://forge.autodesk.com)