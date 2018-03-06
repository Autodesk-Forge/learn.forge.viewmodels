/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict';

// web framework
var express = require('express');
var router = express.Router();

// Forge NPM
var forgeSDK = require('forge-apis');

// handle json requests
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// actually perform the token operation
var oauth = require('./oauth');

// Return list of buckets (id=#) or list of objects (id=bucketKey)
router.get('/api/forge/oss/buckets', function (req, res) {
    var id = req.query.id;
    if (id === '#') {// root
        // in this case, let's return all buckets
        var bucketsApi = new forgeSDK.BucketsApi();
        oauth.getTokenInternal().then(function (credentials) {
            bucketsApi.getBuckets({ limit: 100 }, oauth.OAuthClient(), credentials).then(function (buckets) {
                var list = [];
                buckets.body.items.forEach(function (bucket) {
                    list.push({
                        id: bucket.bucketKey,
                        text: bucket.bucketKey,
                        type: 'bucket',
                        children: true
                    })
                })
                res.json(list);
            });
        }).catch(function (error) {
            console.log('Error at Get Buckets:');
            console.log(error);
            res.status(500).json(error);
        });
    }
    else {
        // as we have the id (bucketKey), let's return all objects
        var objectsApi = new forgeSDK.ObjectsApi();
        oauth.getTokenInternal().then(function (credentials) {
            objectsApi.getObjects(id, {}, oauth.OAuthClient(), credentials).then(function (objects) {
                var list = [];
                objects.body.items.forEach(function (object) {
                    list.push({
                        id: object.objectId.toBase64(),
                        text: object.objectKey,
                        type: 'object',
                        children: false
                    })
                })
                res.json(list);
            });
        }).catch(function (error) {
            console.log('Error at Get Objects:');
            console.log(error);
            res.status(500).json(error);
        });
    }
});

// Create a new bucket 
router.post('/api/forge/oss/buckets', jsonParser, function (req, res) {
    oauth.getTokenInternal().then(function (credentials) {
        var bucketsApi = new forgeSDK.BucketsApi();
        var postBuckets = new forgeSDK.PostBucketsPayload();
        postBuckets.bucketKey = req.body.bucketKey;
        postBuckets.policyKey = "transient"; // expires in 24h

        bucketsApi.createBucket(postBuckets, {}, oauth.OAuthClient(), credentials).then(function (buckets) {
            res.status(200).end();
        }).catch(function (error) {
            if (error.statusCode && error.statusCode == 409)
                res.status(409).end();
            else {
                console.log('Error at OSS Create Bucket:');
                console.log(error);
                res.status(500).json(error);
            }
        });
    });
});

// handle file upload
var multer = require('multer')
var upload = multer({ dest: './tmp' })

// Receive a file from the client and upload to the bucket
router.post('/api/forge/oss/objects', upload.single('fileToUpload'), function (req, res) {
    oauth.getTokenInternal().then(function (credentials) {
        var bucketKey = req.body.bucketKey;
        var fs = require('fs');
        fs.readFile(req.file.path, function (err, filecontent) {
            var objects = new forgeSDK.ObjectsApi();
            objects.uploadObject(bucketKey, req.file.originalname, filecontent.length, filecontent, {}, oauth.OAuthClient(), credentials)
                .then(function (object) {
                    res.end();
                }).catch(function (error) {
                    console.log('Error at Upload Object:');
                    console.log(error);
                    res.status(500).end();
                });
        })
    });
});

String.prototype.toBase64 = function () {
    return new Buffer(this).toString('base64');
};

module.exports = router;