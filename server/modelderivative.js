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

// Create a new bucket 
router.post('/api/forge/modelderivative/jobs', jsonParser, function (req, res) {
    oauth.getTokenInternal().then(function (credentials) {
        // prepare the translation job payload
        var postJob = new forgeSDK.JobPayload();
        postJob.input = new forgeSDK.JobPayloadInput();
        postJob.input.urn = req.body.objectName;
        postJob.output = new forgeSDK.JobPayloadOutput(
            [new forgeSDK.JobSvfOutputPayload()]
        );
        postJob.output.formats[0].type = 'svf';
        postJob.output.formats[0].views = ['2d', '3d'];

        // create the derivative API 
        var derivativesApi = new forgeSDK.DerivativesApi();
        // post the job
        derivativesApi.translate(postJob, {}, oauth.OAuthClient(), credentials)
            .then(function (data) {
                res.status(200).end();
            }).catch(function (e) {
                console.log('Error at Model Derivative job:');
                console.log(e);
                res.status(500).json({ error: e.error.body })
            });
    });
});

module.exports = router;