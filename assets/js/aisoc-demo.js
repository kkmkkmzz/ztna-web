// AI SOC 경보 묶음 시뮬레이션: 미리 작성한 시나리오 재생, 실제 AI 호출 없음
(function () {
  var root = document.getElementById('aisoc-demo');
  if (!root) return;
  var alertsEl = document.getElementById('aisoc-alerts');
  var outEl = document.getElementById('aisoc-out');
  var btn = document.getElementById('aisoc-run');

  var ALERTS = [
    '09:02 해외 IP에서 이수진(가상) 계정 로그인 실패 5회',
    '09:04 해외 IP에서 이수진 계정 로그인 성공',
    '09:06 이수진 계정으로 메일 자동 전달 규칙 생성',
    '09:10 개발 서버에서 처음 보는 프로그램 실행',
    '09:11 같은 개발 서버가 외부 주소로 대용량 전송',
    '09:15 백신 정의 파일 업데이트 실패 (회계팀 PC)',
    '09:20 프린터 서버 디스크 사용량 90%',
    '09:31 박준호(가상) 계정이 업무 시간에 해외 쇼핑몰 접속'
  ];

  var GROUPS = [
    {
      level: 'deny', lvl: '높음', title: '사건 1: 계정 탈취 의심 (경보 1~3)',
      sum: '해외에서 비밀번호를 여러 번 틀린 뒤 로그인에 성공했고, 곧바로 메일을 밖으로 자동 전달하는 규칙이 만들어졌습니다.',
      why: '근거: 실패 후 성공 순서, 처음 보는 IP, 로그인 2분 뒤 메일 전달 규칙 생성은 계정 탈취의 흔한 순서입니다.',
      act: '제안: 계정 잠금, 메일 전달 규칙 삭제, 사용자 본인 확인'
    },
    {
      level: 'stepup', lvl: '중간', title: '사건 2: 서버 정보 유출 가능성 (경보 4~5)',
      sum: '개발 서버에서 처음 보는 프로그램이 실행되고 1분 뒤 외부로 많은 데이터가 나갔습니다.',
      why: '근거: 두 경보가 같은 서버, 1분 간격. 다만 개발팀의 정상 배포 작업일 수도 있어 확신도는 중간입니다.',
      act: '제안: 서버 담당자에게 배포 여부 확인, 확인 전까지 외부 전송 일시 제한',
      caveat: 'AI가 틀릴 수 있는 사례입니다. 실제로 정상 배포였다면 제한 조치가 업무를 막습니다. 그래서 사람이 확인합니다.'
    },
    {
      level: 'allow', lvl: '낮음', title: '사건 3: 보안과 무관하거나 낮은 위험 (경보 6~8)',
      sum: '백신 업데이트 실패, 디스크 용량 경고, 쇼핑몰 접속은 서로 관련이 없고 공격 징후로 보기 어렵습니다.',
      why: '근거: 서로 다른 기기와 사용자, 알려진 악성 주소 없음.',
      act: '제안: 운영팀 티켓으로 넘기고 보안 대응 대상에서는 제외'
    }
  ];

  alertsEl.innerHTML = ALERTS.map(function (a, n) { return '<li><span class="num">' + (n + 1) + '</span>' + a + '</li>'; }).join('');

  function decide(e) {
    var b = e.target.closest('button[data-d]');
    if (!b) return;
    var card = b.closest('.group');
    var st = card.querySelector('.group-status');
    st.textContent = b.getAttribute('data-d') === 'ok'
      ? '사람이 승인함 → 제안된 조치를 실행합니다 (시뮬레이션)'
      : '사람이 보류함 → 추가 조사 후 다시 판단합니다';
    card.querySelectorAll('button[data-d]').forEach(function (x) { x.disabled = true; });
  }

  btn.addEventListener('click', function () {
    btn.disabled = true;
    btn.textContent = '분류 완료';
    outEl.innerHTML = '<p class="note" style="margin-top:0">경보 8개를 사건 3개로 묶었습니다. 위험이 높은 순서입니다.</p>' +
      GROUPS.map(function (g) {
        return '<div class="group card">' +
          '<span class="tag level-' + g.level + '">위험도 ' + g.lvl + '</span>' +
          '<h3>' + g.title + '</h3><p>' + g.sum + '</p><p class="why">' + g.why + '</p><p><strong>' + g.act + '</strong></p>' +
          (g.caveat ? '<p class="note">' + g.caveat + '</p>' : '') +
          '<div class="btn-row" style="margin-top:8px"><button class="btn primary" type="button" data-d="ok">승인</button><button class="btn" type="button" data-d="hold">보류</button></div>' +
          '<p class="group-status" aria-live="polite"></p></div>';
      }).join('');
    outEl.focus();
  });
  outEl.addEventListener('click', decide);
})();
