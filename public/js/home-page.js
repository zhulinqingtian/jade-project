$(function () {
  var $openPosition = $('.open-position'),
    $positionTitle = $('.position-title'),
    $imgDetail = $('.img-detail');

  $openPosition.on('click', function () {
    var $this = $(this),
      index = $this.index();
    $openPosition.removeClass('active');
    $openPosition.eq(index).addClass('active');

    $positionTitle.removeClass('active');
    $positionTitle.eq(index).addClass('active');

    $imgDetail.removeClass('active');
    $imgDetail.eq(index).addClass('active');
  });

  // 锚点链接之间的平滑滚动
  $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body').animate({
            scrollTop: targetOffset
          },
          500);
        return false;
      }
    }
  });

  console.log("\n" + "　　 へ　　　　　／|\n 　　/＼7　　　 ∠＿/\n 　 /　│　　 ／　／ \n 　│　Z ＿,＜　／　　 /`ヽ\n" +
    "   │　　　　　ヽ　　 /　　〉\n 　 Y　　　　　`　 /　　/\n 　ｲ●　､　●　　⊂⊃〈　　/\n 　()　 へ　　　　|　＼〈\n" +
    " 　　>ｰ ､_　 ィ　 │ ／／\n 　 / へ　　 /　ﾉ＜| ＼＼\n 　 ヽ_ﾉ　　(_／　 │／／\n 　　7　　　　　　　|／\n 　　＞―r￣￣`ｰ―＿  \n\n" +
    " 想加入夏猫吗？快把简历(邮件标题后面再加上'from console')邮件到 %c twsharp@gmail.com \n", "color:red");

});
