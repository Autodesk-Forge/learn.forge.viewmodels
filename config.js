module.exports = {
    credentials: {
        client_id: process.env.FORGE_CLIENT_ID,
        client_secret: process.env.FORGE_CLIENT_SECRET,
        callback_url: process.env.FORGE_CALLBACK_URL
    },
    scopes: {
        internal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
        public: ['viewables:read']
    }
};
