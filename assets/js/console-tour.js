// 통합 관제 화면: 가상 사건 하나가 SSE → ZTNA → AI SOC → SOAR를 거쳐 가는 안내 투어
(function () {
  var STEPS = [
    { sel: '#capability', tech: 'SSE', href: '/sse/',
      t: '오후 2시, 재무팀 직원 계정이 개인 클라우드에 고객 명단을 올리려 합니다. SSE가 파일에서 주민등록번호 형식을 찾아 업로드를 막고 기록을 남깁니다. (가상 사건)' },
    { sel: '#policy', tech: 'ZTNA', href: '/ztna/',
      t: '10분 뒤 같은 계정이 해외에서 처음 보는 기기로 급여 시스템에 접속합니다. ZTNA는 기기와 위치가 평소와 달라 추가 인증을 요구하고, 통과하지 못하자 차단합니다.' },
    { sel: '#analytics', tech: 'AI SOC', href: '/ai-soc/',
      t: 'AI SOC가 업로드 차단과 해외 접속 경보를 하나의 사건으로 묶습니다. "계정 탈취 후 정보 유출 시도로 의심"이라는 요약과 근거를 붙여 담당자에게 넘깁니다.' },
    { sel: '#soar', tech: 'SOAR', href: '/soar/',
      t: '담당자가 제안을 검토하고 승인합니다. SOAR가 플레이북대로 세션 차단, 로그인 토큰 폐기, 처리 티켓 생성을 실행합니다. 영향이 큰 조치는 사람 승인 뒤에만 실행됩니다.' },
    { sel: '#flowcard', tech: '다시 ZTNA', href: '/ztna/',
      t: '대응 결과가 접근 정책에 반영됩니다. 이 계정은 본인 확인이 끝날 때까지 어느 앱에도 들어갈 수 없습니다. 이렇게 네 기술이 하나의 고리로 이어집니다.' }
  ];

  var start = document.getElementById('tour-start');
  var box = document.getElementById('tour');
  if (!start || !box) return;
  var stepEl = document.getElementById('tour-step');
  var textEl = document.getElementById('tour-text');
  var more = document.getElementById('tour-more');
  var prev = document.getElementById('tour-prev');
  var next = document.getElementById('tour-next');
  var close = document.getElementById('tour-close');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, current = null;

  function show() {
    var s = STEPS[i];
    if (current) current.classList.remove('tour-focus');
    current = document.querySelector(s.sel);
    if (current) {
      current.classList.add('tour-focus');
      current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    stepEl.textContent = (i + 1) + ' / ' + STEPS.length + ' · ' + s.tech;
    textEl.textContent = s.t;
    more.textContent = s.tech.replace('다시 ', '') + ' 자세히';
    more.href = s.href;
    prev.disabled = i === 0;
    next.textContent = i === STEPS.length - 1 ? '처음부터' : '다음';
  }

  function open() {
    i = 0; box.hidden = false; document.body.classList.add('touring'); show(); next.focus();
  }
  function end() {
    box.hidden = true; document.body.classList.remove('touring');
    if (current) current.classList.remove('tour-focus');
    start.focus();
  }

  start.addEventListener('click', open);
  next.addEventListener('click', function () { i = i === STEPS.length - 1 ? 0 : i + 1; show(); });
  prev.addEventListener('click', function () { if (i > 0) { i--; show(); } });
  close.addEventListener('click', end);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) end(); });
})();
