// 云码

var $wangwangBtn = $('.ask-btn')

$wangwangBtn.on('click',function () {
  window.open('http://amos.alicdn.com/getcid.aw?v=2&uid=夏猫科技&site=cntaobao&s=1&groupid=0&charset=utf-8')
})

var $caseUl = $('.case-ul');
var timer = setInterval(caseChange,2500);
$caseUl.hover(function () {
  clearInterval(timer)
},function () {
  timer = setInterval(caseChange,2500);
})
function caseChange() {
  $caseUl.animate({left:'-836px'},function () {
    $caseUl.css({left:'-298px'}).find("li:first").appendTo($caseUl);
  })
}