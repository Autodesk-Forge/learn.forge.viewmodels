var viewerApp;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  var documentId = 'urn:' + urn;
  Autodesk.Viewing.Initializer(options, function onInitialized() {
    viewerApp = new Autodesk.Viewing.ViewingApplication('forgeViewer');
    viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
    viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  // We could still make use of Document.getSubItemsWithProperties()
  // However, when using a ViewingApplication, we have access to the **bubble** attribute,
  // which references the root node of a graph that wraps each object from the Manifest JSON.
  var viewables = viewerApp.bubble.search({ 'type': 'geometry' });
  if (viewables.length === 0) {
    console.error('Document contains no viewables.');
    return;
  }

  // Choose any of the avialble viewables
  viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onItemLoadSuccess(viewer, item) {
  // item loaded, any custom action?
}

function onItemLoadFail(errorCode) {
  console.error('onItemLoadFail() - errorCode:' + errorCode);
}

function getForgeToken(callback) {
  jQuery.ajax({
    url: '/api/forge/oauth/token',
    success: function (res) {
      callback(res.access_token, res.expires_in)
    }
  });
}