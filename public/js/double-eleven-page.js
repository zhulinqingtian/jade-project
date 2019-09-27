require('./right-menu');

$(function () {
  var now = +new Date();
  var startTime = +new Date('2019-11-1 00:00');
  var middleTime = +new Date('2019-11-12 00:00');
  var endTime = +new Date('2019-11-24 00:00');

  if (now >= middleTime && now <= endTime) {
    $('body, html').animate({ scrollTop: 4350 });
    $('.stage-line.after').addClass('flex');
    $('.stage-line.before').removeClass('flex');
  } else {
    $('.stage-line.after').removeClass('flex');
    $('.stage-line.before').addClass('flex');
  }
});