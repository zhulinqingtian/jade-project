/**
 *
 * @author twang
 */

if (typeof console === "undefined") {
  console = {};
}
if (typeof console.log === "undefined") {
  console.log = function() {};
}

exports.IE6 = !-[1, ] && !window.XMLHttpRequest;
/**
 *  ajaxInfo type :
 *  --------------------------------------
 *  class        background-color
 *  --------------------------------------
 *  ''           #5bc0de  (blue)
 *  'error'      #d9534f  (red)
 *  'warning'    #f0ad4e  (orange)
 *  'success'    #5cb85c  (green)
 *
 */
var DEFAULT_TIME = 1000;
var ajaxInfoTimer;
var ajaxInfoDelay = {'':1000, 'success':3000, 'warning':3000, 'error':3000};
var $ajaxInfo = $('#ajax-info');

$('.close-ajax-info', $ajaxInfo).on('click', function () {
  hideAjaxInfo();
});

function showAjaxInfo(info, type) {
  $ajaxInfo.attr('class', type || 'info').fadeIn('fast').find('span').text(info);
}
exports.showAjaxInfo = showAjaxInfo;

function hideAjaxInfo() {
  $ajaxInfo.fadeOut('fast');
}
exports.hideAjaxInfo = hideAjaxInfo;

function showLoading() {
  $ajaxInfo.attr('class', 'info').fadeIn('fast').find('span').text('正在加载...');
}
exports.showLoading = showLoading;

function flashAjaxInfo(info, type, time) {
  type = type || 'info';
  $ajaxInfo.attr('class', type).fadeIn('fast').find('span').html(info);
  $ajaxInfo.find('i').removeClass('icon-tishi').removeClass('icon-shibai').removeClass('icon-chenggong').removeClass('icon-jingshi');
  if (type === 'info') {
    $ajaxInfo.find('i').addClass('icon-tishi');
  } else if (type === 'error') {
    $ajaxInfo.find('i').addClass('icon-shibai');
  } else if (type === 'success') {
    $ajaxInfo.find('i').addClass('icon-chenggong');
  } else if (type === 'warning') {
    $ajaxInfo.find('i').addClass('icon-jingshi');
  }

  clearTimeout(ajaxInfoTimer);
  ajaxInfoTimer = setTimeout(function () {
    $ajaxInfo.fadeOut('fast');
  }, time || ajaxInfoDelay[type || '']);
}
exports.flashAjaxInfo = flashAjaxInfo;

exports.clearSelection = function () {
  var sel;
  if (document.selection && document.selection.empty) {
    document.selection.empty();
  } else if (window.getSelection) {
    sel = window.getSelection();
    if (sel && sel.removeAllRanges)
      sel.removeAllRanges();
  }
};

exports.highlight = function ($element) {
  $element.animate({ opacity:0.3 }).animate({ opacity:1 });
};

exports.doAjaxWithInfo = function (command, options) {
  if (options && options.loadingUI) {
    showLoadingUI(options.loadingUI);
  } else if (options && options.waitMessage) {
    if (!$ajaxLoading.is(':visible')) {
      showAjaxInfo(options.waitMessage);
    }
  } else {
    showLoading();
  }
  command(function (err) {
    if (options && options.loadingUI) {
      hideLoadingUI();
    }
    if (err) {
      if(typeof err === 'string' && err === 'timeout'){
        return flashAjaxInfo('请求超时，请重试！', 'error', 10000);
      }
      if(typeof err === 'string' && err==='abort'){
        return;
      }
      return flashAjaxInfo(err.message, 'error', 10000);
    }
    if (options && options.successMessage) {
      if (options.timeout) {
        return flashAjaxInfo(options.successMessage, 'info', options.timeout);
      } else {
        return flashAjaxInfo(options.successMessage);
      }
    }
    hideAjaxInfo();
  });
};

var $ajaxLoading = $('.ajax-loading');

function showLoadingUI(id) {
  var $ele = $(typeof id === 'string' ? ('#' + id) : '#content');
  if (!$ele.length) {
    $ele = $('#content');
  }
  var height = $ele.css('height');
  $ajaxLoading.css('height', height).show()
    .find('.loading-content').css('margin-top', (parseInt(height) - 80) / 2 + 'px');
}

function hideLoadingUI() {
  if (/MSIE 8.0/.test(navigator.userAgent)) {
    $ajaxLoading.hide();
  } else {
    $ajaxLoading.fadeOut();
  }
}

/**
 * 处理 IE9 textarea撤销、回退等无法触发propertychange (未处理鼠标操作)
 * key: backspace, delete, x, z
 */
exports.fixIE9SmsTextAreaPropertychangeEvent = function () {
  if (navigator.userAgent.indexOf('MSIE 9.0') !== -1) {
    $('.sms-textarea').on('keyup', function (e) {
      var keyCode = e.keyCode;
      if (keyCode === 8 || keyCode === 46 || keyCode === 88 || keyCode === 90) {
        $(this).trigger('propertychange');
      }
    });
  }
};

$.fn.selectRange = function(start, end) {
  if(!end) end = start;
  return this.each(function() {
    if (this.setSelectionRange) {
      this.focus();
      this.setSelectionRange(start, end);
    } else if (this.createTextRange) {
      var range = this.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  });
};

$.fn.getCursorPosition = function() {
  var el = $(this).get(0);
  var pos = 0;
  if('selectionStart' in el) {
    pos = el.selectionStart;
  } else if('selection' in document) {
    el.focus();
    var Sel = document.selection.createRange();
    var SelLength = document.selection.createRange().text.length;
    Sel.moveStart('character', -el.value.length);
    pos = Sel.text.length - SelLength;
  }
  return pos;
};

function updateRealCid(callback) {
  $.getScript('//amos.alicdn.com/getRealCid.aw?fromId=cntaobao&toId=cntaobao%E5%A4%8F%E7%8C%AB%E7%A7%91%E6%8A%80&charset=utf-8', callback);
}
$("a[href='aliim:sendmsg?touid=cntaobao夏猫科技']").on('click', function (e) {
  e.preventDefault();
  updateRealCid(function () {
    if (typeof realcid === 'undefined') {
      realcid = 'cntaobao夏猫科技';
    }
    window.open("aliim:sendmsg?touid=" + realcid, '_self');
  });
});
