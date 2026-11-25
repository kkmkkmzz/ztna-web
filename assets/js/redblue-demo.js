// 레드팀 vs 블루팀 연습 경기 (가상 시나리오, 네트워크 요청 없음)
(function () {
  var form = document.getElementById('rb-demo');
  if (!form) return;
  var out = document.getElementById('rb-out');
  var run = document.getElementById('rb-run');

  // 공격 단계별로 어떤 방어가 잡아내는지 (가상 규칙)
  var STAGES = [
    { name: '① 첫 침투', red: '가짜 로그인 페이지로 직원 비밀번호를 빼냄', by: 'mfa', blue: '다중 인증(MFA)이 걸려 있어 비밀번호만으로는 로그인 실패' },
    { name: '② 내부 이동', red: '빼낸 계정으로 정상 원격 접속 기능을 써서 다른 서버에 로그인', by: 'net', blue: '계정·네트워크 이상 탐지가 평소 쓰지 않던 서버 간 로그인을 잡아냄' },
    { name: '③ 도구 설치', red: '서버에 공격 도구를 내려받아 실행', by: 'edr', blue: '단말 탐지(EDR)가 처음 보는 공격 도구 실행을 잡아냄' },
    { name: '④ 정보 유출', red: '고객 데이터를 압축해 외부 저장소로 전송', by: 'dlp', blue: '정보 유출 방지(DLP)가 대량 개인정보 전송을 차단' }
  ];
  var LABEL = { mfa: '다중 인증(MFA)', edr: '단말 탐지(EDR)', net: '네트워크·계정 이상 탐지', dlp: '정보 유출 방지(DLP)' };

  function on(k) { var el = form.querySelector('input[value="' + k + '"]'); return el && el.checked; }

  run.addEventListener('click', function () {
    var html = '<ol class="playbook">';
    var stopped = -1;
    STAGES.forEach(function (s, idx) {
      if (stopped >= 0) {
        html += '<li class="pb todo"><span class="pb-state">진행 못 함</span><strong>' + s.name + '</strong><span>앞 단계에서 막혀 공격이 끝났습니다.</span></li>';
        return;
      }
      if (on(s.by)) {
        stopped = idx;
        html += '<li class="pb done"><span class="pb-state">블루팀 방어</span><strong>' + s.name + '</strong><span>레드팀: ' + s.red + '<br>블루팀: ' + s.blue + '</span></li>';
      } else {
        html += '<li class="pb now"><span class="pb-state" style="color:var(--deny);border-color:rgba(251,113,133,.5)">공격 성공</span><strong>' + s.name + '</strong><span>레드팀: ' + s.red + '<br>블루팀: 이 단계를 잡을 방어(' + LABEL[s.by] + ')가 꺼져 있어 알아채지 못함</span></li>';
      }
    });
    html += '</ol>';

    var missing = STAGES.filter(function (s) { return !on(s.by); }).map(function (s) { return LABEL[s.by]; });
    var verdict;
    if (stopped === 0) {
      verdict = '<div class="verdict allow">첫 단계에서 막았습니다<small>그래도 퍼플팀은 "MFA가 뚫리면 그다음은?"을 묻습니다. 다른 방어도 켜 두고 다시 해 보세요.</small></div>';
    } else if (stopped > 0) {
      verdict = '<div class="verdict stepup">' + STAGES[stopped].name.slice(2) + ' 단계에서 막았습니다<small>막기 전까지 ' + stopped + '단계가 뚫렸습니다. 퍼플팀은 뚫린 지점마다 탐지 규칙을 보완합니다.</small></div>';
    } else {
      verdict = '<div class="verdict deny">끝까지 막지 못했습니다<small>고객 데이터가 밖으로 나갔습니다. 실제 회사라면 이 결과가 개선 목록의 1순위가 됩니다.</small></div>';
    }
    var purple = missing.length
      ? '<div class="card" style="margin-top:12px"><span class="tag">퍼플팀 개선 목록</span><p>이번 연습에서 비어 있던 방어: <strong>' + missing.join(', ') + '</strong>. 레드팀이 쓴 공격 방법을 블루팀과 공유해 탐지 규칙을 만들고, 같은 공격으로 다시 시험합니다.</p></div>'
      : '<div class="card" style="margin-top:12px"><span class="tag">퍼플팀 개선 목록</span><p>네 방어가 모두 켜져 있습니다. 실제로는 레드팀이 다른 공격 방법으로 다시 시도하며, 방어가 계속 통하는지 주기적으로 확인합니다.</p></div>';
    out.innerHTML = verdict + html + purple;
    out.focus();
  });
})();
