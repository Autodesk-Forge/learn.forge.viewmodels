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

$(document).ready(function () {
  (window.sbServerless&&$('#accessTokenDialog').modal()&&$('#accessTokenControls').show())||initTree();
  $('#refreshBuckets').click(function () {
    $('#appBuckets').jstree(true).refresh();
  });

  $('#createNewBucket').click(function () {
    createNewBucket();
  });

  $('#createBucketModal').on('shown.bs.modal', function () {
    $("#newBucketKey").focus();
  });

  $('#hiddenUploadField').change(function () {

    var node = $('#appBuckets').jstree(true).get_selected(true)[0];
    var _this = this;
    if (_this.files.length == 0) return;
    var file = _this.files[0];

    if(window.sbAccessToken)
    {
      $("#loading").show();
      fetch('https://developer.api.autodesk.com/oss/v2/buckets/'+encodeURIComponent(node.id)+'/objects/'+encodeURIComponent(file.name),{method:'PUT',headers:{Authorization:'Bearer '+window.sbAccessToken},body:file}).then(()=>$('#appBuckets').jstree(true).refresh()).catch(err=>{alert("Error: "+err.message||err);console.log(err);}).finally(()=>  $("#loading").hide());
    } else {
    switch (node.type) {
      case 'bucket':
        var formData = new FormData();
        formData.append('fileToUpload', file);
        formData.append('bucketKey', node.id);

        $.ajax({
          url: window.sbAccessToken?'https://developer.api.autodesk.com/oss/v2/buckets':'/api/forge/oss/objects',
          headers:{Authorization:'Bearer '+window.sbAccessToken},
          data: formData,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function (data) {
            $('#appBuckets').jstree(true).refresh_node(node);
            _this.value = '';
          }
        });
        break;
    }
  }
  });
});

window.setDerivative=setDerivative;
function setDerivative(ele){
  window.currentDURN = $(ele).text();
  $('#derivatives button span').first().text(window.currentDURN);

}

function createNewBucket() {
  var bucketKey = $('#newBucketKey').val();
  var policyKey = $('#newBucketPolicyKey').val();
  jQuery.post({
    url: window.sbAccessToken?'https://developer.api.autodesk.com/oss/v2/buckets':'/api/forge/oss/buckets',
    headers:{Authorization:'Bearer '+window.sbAccessToken},
    contentType: 'application/json',
    data: JSON.stringify({ 'bucketKey': window.sbClientId.toLowerCase()+'-'+bucketKey, 'policyKey': policyKey||'persistent' }),
    success: function (res) {
      $('#appBuckets').jstree(true).refresh();
      $('#createBucketModal').modal('toggle');
    },
    error: function (err) {
      if (err.status == 409)
        alert('Bucket already exists - 409: Duplicated');
      console.log(err);
    }
  });
}

function prepareAppBucketTree() {
  $('#appBuckets').jstree({
    'core': {
      'themes': { "icons": true },
      'data': window.sbAccessToken?function(node,cb){
        $.ajax({
          url: 'https://developer.api.autodesk.com/oss/v2/buckets'+(node&&node.id&&node.id!='#'?`/${node.id}/objects?limit=100`:''),
          headers:{Authorization:'Bearer '+window.sbAccessToken},
          success: function (res) {
            cb(res.items.map(e=>({
              id: (e.objectKey&&btoa(e.objectId))||e.bucketKey,
              text: e.objectKey||e.bucketKey.replace(window.sbClientId.toLowerCase() + '-', ''),
              type: e.objectKey?'object':'bucket',
              children: !!!e.objectKey
            })));
          }
        });
      }:{
        "url": '/api/forge/oss/buckets',
        "dataType": "json",
        'multiple': false,
        "data": function (node) {
          return { "id": node.id };
        }
      }
    },
    'types': {
      'default': {
        'icon': 'glyphicon glyphicon-question-sign'
      },
      '#': {
        'icon': 'glyphicon glyphicon-cloud'
      },
      'bucket': {
        'icon': 'glyphicon glyphicon-folder-open'
      },
      'object': {
        'icon': 'glyphicon glyphicon-file'
      }
    },
    "plugins": ["types", "state", "sort", "contextmenu"],
    contextmenu: { items: autodeskCustomMenu }
  }).on('loaded.jstree', function () {
    $('#appBuckets').jstree('open_all');
  }).bind("activate_node.jstree", function (evt, data) {
    window.currentNode=data&&data.node;
    if (data != null && data.node != null && data.node.type == 'object') {
      getManifest(data.node.id);
    }
  });
}

function autodeskCustomMenu(autodeskNode) {
  var items;

  switch (autodeskNode.type) {
    case "bucket":
      items = {
        uploadFile: {
          label: "Upload file",
          action: function () {
            uploadFile();
          },
          icon: 'glyphicon glyphicon-cloud-upload'
        }
      };
      break;
    case "object":
      items = {
        translateFile: {
          label: "Translate",
          action: function () {
            var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
            translateObject(treeNode);
          },
          icon: 'glyphicon glyphicon-eye-open'
        }
      };
      break;
  }

  return items;
}

function uploadFile() {
  $('#hiddenUploadField').click();
}

function translateObject(node) {
  if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
  const bucketKey = node.parents[0];
  const objectKey = node.id;
  $("#loading").show();
  $("#initial").hide();
  jQuery.post({
    url: window.sbServerless?'https://developer.api.autodesk.com/modelderivative/v2/designdata/job':'/api/forge/modelderivative/jobs',
    headers:{Authorization:'Bearer '+window.sbAccessToken,'x-ads-force':true},
    contentType: 'application/json',
    data: JSON.stringify({
    "input": {
        "urn": objectKey
    },
    "output": {

        "formats": [
        {
            "type": "svf",
            "views": ["3d", "2d"]
        }],
        "advanced": {
                 "generateMasterViews": true
               }
    }}),
    success: function (res) {
      getManifest(objectKey);
    },
    error: function(err){
      alert('Error:'+err.responseText||err);
    }
  }).always(()=>{
    $("#loading").hide();
  });
}

window.download=download;
function download(urn, durn){
  if(urn&&durn){
  window.open(`${window.sbServerless?`/download.html?token=${encodeURIComponent(window.sbAccessToken)}&`:'/api/forge/modelderivative/download?'}urn=${urn}&durn=${encodeURIComponent(durn)}`);
}
}

function getManifest(urn){
  window.currentURN = urn;
  $("#initial").hide();
  $("#loading").show();
  $('#manifest, #manifest .component').hide();
    jQuery.ajax({

      url: window.sbServerless?`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`:('/api/forge/modelderivative/manifest?urn=' + urn) ,
      headers:{Authorization:'Bearer '+window.sbAccessToken},
      success: function (res) {
        if(res.status=='success'&&res.progress=='complete')
        {
          $('#manifest #controls').show();
          const ul = $('#derivatives ul').empty();
          const derivatives = [];
          (function getUrns(obj){ if(obj instanceof Array)obj.forEach(e=>getUrns(e)); else { if(obj.type=='resource'&&obj.urn)derivatives.push(obj.urn);obj.children&&getUrns(obj.children); if(obj.role=='graphics')$('#launchViewer').show();}})(res.derivatives);

          derivatives.forEach(e=>ul.append(`<li><a href="#" onclick="setDerivative(this)">${e}</a></li>`));
        }
        else $('#manifest #incomplete').show();
        $('#manifest #json').show();
        $('#manifest #json').jsonViewer(res);
      },
      error: function (err) {
        console.log(err);
        if(err.status==404){
          alert('Manifest absent - try translate the model first!');
        } else
        alert('Error:'+err.responseText||err);
      }
    }).always(()=>{
      $("#loading").hide();
      $('#manifest').show();
    });
}

function initTree(){
  prepareAppBucketTree();

}
