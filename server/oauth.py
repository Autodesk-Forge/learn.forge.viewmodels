#
# Copyright(c) Autodesk, Inc. All rights reserved
# Written by Forge Partner Development
#
# Permission to use, copy, modify, and distribute this software in
# object code form for any purpose and without fee is hereby granted,
# provided that the above copyright notice appears in all copies and
# that both that copyright notice and the limited warranty and
# restricted rights notice below appear in all supporting
# documentation.
#
# AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
# AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
# MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
# DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
# UNINTERRUPTED OR ERROR FREE.
#

# Forge config information, such as client ID and Secret
from server import config

# Cache of the access tokens
_cached = []


class oauth ():

    def getTokenPublic (self):
        return (self.OAuthRequest (config.scopePublic, 'public'))

    def getTokenInternal (self):
        return (self.OAuthRequest (config.scopeInternal, 'internal'))

    def OAuthRequest (self, scopes, cache):
        client_id =config.credentials.client_id
        client_secret =config.credentials.client_secret
        #forgeOAuth = this.OAuthClient(scopes)

    def OAuthClient (self, scopes):
        client_id =config.credentials.client_id
        client_secret =config.credentials.client_secret
        if ( scopes == None )
		    scopes =config.scopeInternal

