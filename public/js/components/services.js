/**
 *
 * @author twang
 */
var AJAX_TIMEOUT = 3600000;

function ajax(type, url, data, callback) {
  $.ajax({
    type:type,
    url:url,
    data:data,
    timeout:AJAX_TIMEOUT,
    success:function (data) {
      if (data.status) {
        if (data.status === 'OK') {
          callback(null, data.data, data.message);
          return;
        }
        callback(data);
        return;
      }
      callback(null, data);
    },
    error:function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown);
    }
  });
}
function ajaxGet(url, data, callback) {
  if (arguments.length == 2) {
    callback = data;
    data = undefined;
  }
  ajax('GET', url, data, callback);
}
exports.ajaxGet = ajaxGet;

function ajaxPost(url, data, callback) {
  //return callback({status:'ERR_TRY',message:'演示版本无法操作！'});
  if (arguments.length == 2) {
    callback = data;
    data = undefined;
  }
  ajax('POST', url, data, callback);
}
exports.ajaxPost = ajaxPost;

function ajaxPut(url, data, callback) {
  ajax('PUT', url, data, callback);
}
exports.ajaxPut = ajaxPut;

function ajaxDelete(url, callback) {
  ajax('DELETE', url, undefined, callback);
}
exports.ajaxDelete = ajaxDelete;

var trackedAjax = {}; // id -> jqXHR
function abortAndAjax(requestId, type, url, data, callback) {
  var currentJqXHR = trackedAjax[requestId];
  if (currentJqXHR) {
    currentJqXHR.abort();
  }
  var thisJqXHR = trackedAjax[requestId] = $.ajax({
    type: type,
    url: url,
    data: data,
    timeout: AJAX_TIMEOUT,
    success: function (data) {
      if (thisJqXHR === trackedAjax[requestId]) {
        delete trackedAjax[requestId];
      }
      if (data.status) {
        if (data.status === 'OK') {
          callback(null, data.data, data.message);
          return;
        }
        callback(data);
        return;
      }
      callback(null, data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (thisJqXHR === trackedAjax[requestId]) {
        delete trackedAjax[requestId];
      }
      callback(errorThrown);
    }
  });
}

function abortAndAjaxGet(requestId, url, data, callback) {
  if (arguments.length == 2) {
    callback = data;
    data = undefined;
  }
  abortAndAjax(requestId, 'GET', url, data, callback);
}
exports.abortAndAjaxGet = abortAndAjaxGet;

function ajaxJsonp(type, url, data, callback) {
  $.ajax({
    type:type,
    url:url,
    dataType: "jsonp",
    data:data,
    timeout:AJAX_TIMEOUT,
    success:function (data) {
      if (data.status) {
        if (data.status === 'OK') {
          callback(null, data.data, data.message);
          return;
        }
        callback(data);
        return;
      }
      callback(null, data);
    },
    error:function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown);
    }
  });
}

function ajaxJsonpGet(url, data, callback) {
  if (arguments.length == 2) {
    callback = data;
    data = undefined;
  }
  ajaxJsonp('GET', url, data, callback);
}
exports.ajaxJsonpGet = ajaxJsonpGet;

function ajaxJson(type, url, data, callback) {
  $.ajax({
    type:type,
    url:url,
    contentType: "application/json",
    data:data,
    timeout:AJAX_TIMEOUT,
    success:function (data) {
      if (data.status) {
        if (data.status === 'OK') {
          callback(null, data.data, data.message);
          return;
        }
        callback(data);
        return;
      }
      callback(null, data);
    },
    error:function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown);
    }
  });
}

function ajaxPostJson(url, data, callback) {
  //return callback({status:'ERR_TRY',message:'演示版本无法操作！'});
  if (arguments.length == 2) {
    callback = data;
    data = undefined;
  }
  ajaxJson('POST', url, data, callback);
}
exports.ajaxPostJson = ajaxPostJson;