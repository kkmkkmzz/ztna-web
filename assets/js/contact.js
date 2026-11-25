// 문의 이메일: HTML 원문에 평문 주소를 두지 않고 로드 후 조합한다.
(function () {
  var parts = ['admin', 'ztna.co.kr'];
  var addr = parts[0] + '@' + parts[1];

  document.querySelectorAll('[data-mail]').forEach(function (el) {
    el.textContent = addr;
    el.setAttribute('href', 'mai' + 'lto:' + addr);
    el.removeAttribute('aria-disabled');
  });

  document.querySelectorAll('[data-copy-mail]').forEach(function (btn) {
    btn.hidden = false;
    var original = btn.textContent;
    btn.addEventListener('click', function () {
      var done = function () {
        btn.textContent = '복사됨';
        setTimeout(function () { btn.textContent = original; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(addr).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = addr; t.setAttribute('readonly', '');
        t.style.position = 'absolute'; t.style.left = '-9999px';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* 복사 실패 시 주소는 화면에 그대로 보임 */ }
        document.body.removeChild(t);
      }
    });
  });

  // 모바일에서 가로로 넘치는 메뉴: 현재 페이지 메뉴가 보이도록 이동
  var cur = document.querySelector('.nav [aria-current="page"]');
  if (cur && cur.parentNode.scrollWidth > cur.parentNode.clientWidth) {
    cur.parentNode.scrollLeft = Math.max(0, cur.offsetLeft - cur.parentNode.offsetLeft - 8);
  }
})();
