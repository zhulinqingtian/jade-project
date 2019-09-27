/**
 * 联系客服 右侧边栏
 */

var Common = require('./components/common');
var Services = require('./components/services');

var $areaFeedback = $('#area-feedback'),
  $phoneContact = $('.phone-contact'),
  $feedbackModal = $('#feedback-modal'),
  $feedbackContent = $('#feedback-content'),
  $feedbackSubmit = $('#feedback-submit'),
  $modalPanel1 = $('.modal-panel-1'),
  $closeTime = $('.modal-panel-2 em');
var timeoutId, timeoutIdFeedback, timeoutIdWang, timeoutIdDesktopShortcut, timeoutIdCollection;

$feedbackContent.focus();

$('.phone-contact-hover').hover(function () {
  $(this).parent().siblings('.hover-hide').hide();
  clearTimeout(timeoutId);
  $phoneContact.show();
},function () {
  timeoutId = setTimeout(function() {
    $phoneContact.hide();
  },500);
});

// 春节提醒
$('.newYear-service-contact-hover').hover(function () {
  $(this).parent().siblings('.hover-hide').hide();
  clearTimeout(timeoutId);
  $('.newYear-service-contact').show();
},function () {
  timeoutId = setTimeout(function() {
    $('.newYear-service-contact').hide();
  },500);
});

$areaFeedback.on('click', function () {
  $modalPanel1.show();
  $closeTime.text(3);
  $('textarea', $feedbackModal).val('');
  $feedbackModal.modal({backdrop: 'static'});
  $('.notice-badge').hide();
});

// 提交反馈
$feedbackSubmit.on('click', function () {
  var suggestion = $feedbackContent.val();
  if (!suggestion) {
    $feedbackContent.addClass('has-error');
    return Common.flashAjaxInfo('请填写您的反馈建议！', 'error', 2000);
  }
  console.log('Common:', Common);
  console.log('suggestion.length:', suggestion.length);
  if (suggestion) {
    if (suggestion.length < 20) {
      console.log('吐槽内容不要少于20个字');
      return Common.flashAjaxInfo('吐槽内容不要少于20个字。', 'info', 2000);
    }
    Services.ajaxPost('/addSuggestion', {suggestion: suggestion, contact: ''}, function (err, data) {
      if (err) {
        return Common.flashAjaxInfo(err.message, 'error');
      }

      $('textarea', $feedbackModal).val('');
      Common.flashAjaxInfo('提交成功，感谢您的意见！', 'success', 1000);
      $feedbackModal.modal('hide');
      $('.notice-badge').show();
    });
  }
});

$feedbackModal.on('click', '.close', function () {
  $feedbackModal.modal('hide');
  $('.notice-badge').show();
});

$feedbackContent.on('focus', function () {
  $(this).removeClass('has-error');
});

/*
 * title hover
 */
var $areaTitleWang = $('#area-title-wang');
var $areaCollection = $('#area-collection');
var $areaTitleDesktopShortcut = $('#area-title-desktop-shortcut');
var $areaTitleCollection = $('#area-title-collection');
var $areaTitleFeedback = $('#area-title-feedback');
$('.wang-contact-hover').hover(function () {
  $(this).parent().siblings('.hover-hide').hide();
  $qrCodeSideTip.hide();
  clearTimeout(timeoutIdWang);
  $areaTitleWang.show();
},function () {
  timeoutIdWang = setTimeout(function() {
    $areaTitleWang.hide();
  },500);
});

$('.desktop-shortcut-hover').hover(function () {
  $(this).parent().siblings('.hover-hide').hide();
  clearTimeout(timeoutIdDesktopShortcut);
  $areaTitleDesktopShortcut.show();
},function () {
  timeoutIdDesktopShortcut = setTimeout(function() {
    $areaTitleDesktopShortcut.hide();
  },500);
});

$('.collection-hover').hover(function () {
  $(this).parent().siblings('.hover-hide').hide();
  clearTimeout(timeoutIdCollection);
  $areaTitleCollection.show();
},function () {
  timeoutIdCollection = setTimeout(function() {
    $areaTitleCollection.hide();
  },500);
});

$('.feedback-hover').hover(function () {
  $(this).parent().siblings('.hover-hide').hide();
  clearTimeout(timeoutIdFeedback);
  $areaTitleFeedback.show();
},function () {
  timeoutIdFeedback = setTimeout(function() {
    $areaTitleFeedback.hide();
  },500);
});

var $qrCodeHover = $('.qr-code-hover');
var $qrCodeSideTip = $('.qr-code-side-tip');
var timeoutIdQrCode;
$qrCodeHover.hover(function () {
  $('.hover-hide').hide();
  clearTimeout(timeoutIdWang);
  clearTimeout(timeoutIdQrCode);
  $qrCodeSideTip.show();
}, function () {
  timeoutIdQrCode = setTimeout(function() {
    $qrCodeSideTip.hide();
  },500);
});

/*
 * 加入收藏夹
 */
$areaCollection.on('click', function () {
  var url = 'http:crm3.shomop.com/login';
  var title = '夏猫短信';
  addToFavorite(url, title);
});

function addToFavorite(url, title) {
  try {
    window.external.addFavorite(url, title);
  } catch (e) {
    try {
      window.sidebar.addPanel(title, url, '');
    } catch (e) {
      alert('加入收藏失败，请使用Ctrl+D进行添加');
    }
  }
}

/*
 * 生成快捷方式
 */
var $areaDesktopShortcut = $('#area-desktop-shortcut');
$areaDesktopShortcut.on('click', function () {
  location.href='/downloadDesktopShortcut/';
});