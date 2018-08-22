const fs = require('fs');
const express = require('express');
const multer  = require('multer');
const { BucketsApi, ObjectsApi, PostBucketsPayload } = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');

let router = express.Router();

// Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

// GET /api/forge/oss/buckets - expects a query param 'id'; if the param is '#' or empty,
// returns a JSON with list of buckets, otherwise returns a JSON with list of objects in bucket with given name.
router.get('/buckets', async (req, res, next) => {
    const bucket_name = req.query.id;
    if (!bucket_name || bucket_name === '#') {
        try {
            const buckets = await new BucketsApi().getBuckets({ limit: 64 }, req.oauth_client, req.oauth_token);
            res.json(buckets.body.items.map((bucket) => {
                return {
                    id: bucket.bucketKey,
                    text: bucket.bucketKey,
                    type: 'bucket',
                    children: true
                };
            }));
        } catch(err) {
            next(err);
        }
    } else {
        try {
            const objects = await new ObjectsApi().getObjects(bucket_name, {}, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((object) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch(err) {
            next(err);
        }
    }
});

// POST /api/forge/oss/buckets - creates a new bucket.
// Request body must be a valid JSON in the form of { "bucketKey": "<new_bucket_name>" }.
router.post('/buckets', async (req, res, next) => {
    let payload = new PostBucketsPayload();
    payload.bucketKey = req.body.bucketKey;
    payload.policyKey = 'transient'; // expires in 24h
    try {
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
});

// POST /api/forge/oss/objects - uploads new object to given bucket.
// Request body must be structured as 'form-data' dictionary
// with the uploaded file under "fileToUpload" key, and the bucket name under "bucketKey".
router.post('/objects', multer({ dest: 'uploads/' }).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) {
            next(err);
        }
        try {
            const api = new ObjectsApi()
            await api.uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            res.status(200).end();
        } catch(err) {
            next(err);
        }
    });
});

module.exports = router;
