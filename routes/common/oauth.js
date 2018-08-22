const { AuthClientTwoLegged } = require('forge-apis');

const config = require('../../config');

function getClient(scopes) {
    const { client_id, client_secret } = config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal);
}

let cache = {};
async function getToken(scopes) {
    const key = scopes.join('+');
    if (cache[key]) {
        return cache[key];
    }
    const client = getClient(scopes);
    let credentials = await client.authenticate();
    cache[key] = credentials;
    setTimeout(() => { delete cache[key]; }, credentials.expires_in * 1000);
    return credentials;
}

async function getPublicToken() {
    return getToken(config.scopes.public);
}

async function getInternalToken() {
    return getToken(config.scopes.internal);
}

module.exports = {
    getClient,
    getToken,
    getPublicToken,
    getInternalToken
};
