// SOAR 플레이북 단계 재생 (가상 시나리오, 네트워크 요청 없음)
(function () {
  var root = document.getElementById('soar-demo');
  if (!root) return;
  var list = document.getElementById('soar-steps');
  var ctrl = document.getElementById('soar-ctrl');
  var live = document.getElementById('soar-live');

  var STEPS = [
    { t: '경보 접수', d: '"김민수(가상) 계정이 평소와 다른 나라에서 로그인 성공" 경보가 들어왔습니다.' },
    { t: '정보 자동 수집', d: '접속 IP: 해외 호스팅 업체, 과거 공격 기록 있음 · 사용자: 오늘 국내 사무실에서도 로그인 · 기기: 처음 보는 기기' },
    { t: '규칙으로 판단', d: '규칙 "같은 날 국내와 해외에서 동시 로그인 + 평판 나쁜 IP" 에 해당 → 위험도 높음' },
    { t: '사람 승인 필요', d: '계정 잠금은 업무에 영향이 커서 담당자 승인을 기다립니다.', approval: true },
    { t: '조치와 기록', d: '' }
  ];
  var i = 0, decision = null;

  function stepText(idx) {
    var d = STEPS[idx].d;
    if (idx === 4) {
      d = decision === 'approve'
        ? '계정을 잠그고 모든 로그인 세션을 끊었습니다. 사용자에게 비밀번호 재설정 안내를 보내고, 처리 티켓을 남겼습니다.'
        : decision === 'reject'
          ? '잠그지 않고 사용자 본인에게 확인 요청을 보냈습니다. 24시간 동안 이 계정을 집중 감시하고, 티켓에 반려 사유를 남겼습니다.'
          : '승인 결과에 따라 달라집니다.';
    }
    return d;
  }

  function stepHtml(s, idx) {
    var state = (idx < i || (idx === 4 && decision)) ? 'done' : idx === i ? 'now' : 'todo';
    var label = state === 'done' ? '완료' : state === 'now' ? '진행 중' : '대기';
    var d = stepText(idx);
    return '<li class="pb ' + state + '"><span class="pb-state">' + label + '</span><strong>' + s.t + '</strong>' +
      (idx <= i ? '<span>' + d + '</span>' : '') + '</li>';
  }

  function render(announce) {
    list.innerHTML = STEPS.map(stepHtml).join('');
    var cur = STEPS[i];
    if (i === 3 && !decision) {
      ctrl.innerHTML = '<button class="btn primary" type="button" data-a="approve">승인: 계정 잠금</button>' +
        '<button class="btn" type="button" data-a="reject">반려: 본인 확인만</button>';
    } else if (i < STEPS.length - 1) {
      ctrl.innerHTML = '<button class="btn primary" type="button" data-a="next">다음 단계 (' + (i + 2) + '/5)</button>';
    } else {
      ctrl.innerHTML = '<button class="btn" type="button" data-a="reset">처음부터 다시</button>';
    }
    if (announce) live.textContent = (i + 1) + '단계 ' + cur.t + '. ' + stepText(i);
  }

  ctrl.addEventListener('click', function (e) {
    var a = e.target.getAttribute('data-a');
    if (!a) return;
    if (a === 'next') i++;
    else if (a === 'approve' || a === 'reject') { decision = a; i = 4; }
    else if (a === 'reset') { i = 0; decision = null; }
    render(true);
    var b = ctrl.querySelector('button');
    if (b) b.focus();
  });
  render(false);
})();
