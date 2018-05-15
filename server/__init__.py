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

import os
from flask import Flask, render_template, send_from_directory  # , session, g
from server import config

app =Flask (__name__, static_url_path=None)
app.config.from_object (config)
app.static_url_path ='/www'
app.static_folder =os.path.abspath (app.root_path + '/..' + app.static_url_path)
app.template_folder =os.path.abspath (app.root_path + '/views')

@app.errorhandler (404)
def not_found (error):
    #return (render_template ('404.html'), 404)
    return (app.send_static_file ('404.html'), 404)

# @app.teardown_request
# def remove_db_session (exception):
#     db_session.remove ()



@app.route ('/', methods=[ 'GET' ])
@app.route ('/<path:path>', methods=[ 'GET' ])
def index (path ='index.html'):
    #return (render_template ('index.html'))
    return (app.send_static_file (path))


# @app.route('/css/<path:path>', methods=['GET'])
# def send_css (path):
#     return (send_from_directory ('css', path))


# @app.route('/js/<path:path>', methods=['GET'])
# def send_js (path):
#     return (send_from_directory ('js', path))
