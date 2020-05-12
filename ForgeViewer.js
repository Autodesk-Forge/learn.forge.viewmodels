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
window.launchViewer = launchViewer;
function launchViewer(urn) {
  let title=urn;
  try{
    title=atob(urn);
  }catch(err){}
  const options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  let viewer;
  layx.html(new Date().getTime(),title,document.getElementById('forgeViewer'),{
  event:{
      onresize:{after:()=>viewer&&viewer.resize()},
      onload:{
          after: function (layxWindow, winform) {

            Autodesk.Viewing.Initializer(options, () => {
              viewer = new Autodesk.Viewing.GuiViewer3D($(layxWindow).find('#forgeViewer div')[0],{extensions:["Autodesk.DocumentBrowser"]});

              var documentId = 'urn:' + urn;
              Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
            });


          function onDocumentLoadSuccess(doc) {
            viewer.start();
            const viewables = doc.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(doc, viewables).then(i => {
              // documented loaded, any action?
            });
          }

          function onDocumentLoadFailure(viewerErrorCode) {
            alert('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
          }


          }
      }
  }
});

function getForgeToken(callback) {
  if(window.sbAccessToken) callback(window.sbAccessToken);
  else
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}


}
