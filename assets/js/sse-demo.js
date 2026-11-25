// SSE 트래픽 경로 시뮬레이션 (가상 시나리오, 네트워크 요청 없음)
(function () {
  var root = document.getElementById('sse-demo');
  if (!root) return;
  var out = document.getElementById('sse-out');

  var S = {
    web: {
      label: '뉴스 사이트 접속',
      engine: 'SWG',
      checks: [
        ['ok', '목적지 구분: 일반 인터넷 사이트 → 웹 접속 검사(SWG)로 보냄'],
        ['ok', '사이트 평판: 알려진 뉴스 사이트, 악성 기록 없음'],
        ['ok', '내려받는 파일: 없음']
      ],
      verdict: ['allow', '허용', '안전한 사이트라 그대로 연결합니다. 접속 기록만 남깁니다.']
    },
    phish: {
      label: '메일 속 가짜 로그인 링크 클릭',
      engine: 'SWG',
      checks: [
        ['ok', '목적지 구분: 일반 인터넷 사이트 → 웹 접속 검사(SWG)로 보냄'],
        ['bad', '사이트 평판: 만들어진 지 하루 된 주소, 회사 로그인 화면을 흉내 냄'],
        ['warn', '입력 양식: 비밀번호 입력란이 있음']
      ],
      verdict: ['deny', '차단', '피싱으로 의심되는 사이트라 접속을 막고, 사용자에게 안내 화면을 보여 줍니다.']
    },
    upload: {
      label: '개인 클라우드에 고객 명단 업로드',
      engine: 'CASB',
      checks: [
        ['ok', '목적지 구분: 클라우드 저장 앱 → 클라우드 앱 통제(CASB)로 보냄'],
        ['warn', '계정 구분: 회사 계정이 아닌 개인 계정'],
        ['bad', '파일 내용 검사(DLP): 주민등록번호 형식 120건 발견 (가상 데이터)']
      ],
      verdict: ['deny', '업로드 차단', '회사 밖 개인 계정으로 민감 정보가 나가는 것을 막고, 회사 저장소를 쓰라고 안내합니다.']
    },
    app: {
      label: '사내 인사 시스템 접속',
      engine: 'ZTNA',
      checks: [
        ['ok', '목적지 구분: 사내 앱 → 사내 앱 접근(ZTNA)으로 보냄'],
        ['ok', '신원과 다중 인증 통과'],
        ['ok', '회사 관리 기기, 보안 업데이트 최신']
      ],
      verdict: ['allow', '허용', '인사 시스템 한 곳에만 연결합니다. 다른 사내 서버는 보이지 않습니다.']
    }
  };

  var MARK = { ok: ['✓', '정상', 'ok'], warn: ['!', '주의', 'warn'], bad: ['✕', '위험', 'bad'] };

  function render(key) {
    var s = S[key];
    root.querySelectorAll('[data-sse]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-sse') === key ? 'true' : 'false');
    });
    var engines = ['SWG', 'CASB', 'ZTNA'].map(function (e) {
      return '<span class="chip' + (e === s.engine ? ' chip-on' : ' chip-dim') + '">' + e + '</span>';
    }).join('');
    out.innerHTML =
      '<h3>지나가는 길</h3>' +
      '<div class="path"><span class="chip">사용자 기기</span><span class="path-arrow" aria-hidden="true">→</span>' +
      '<span class="path-box"><span class="path-title">SSE 검문소</span>' + engines + '</span>' +
      '<span class="path-arrow" aria-hidden="true">→</span><span class="chip">' + s.label + '</span></div>' +
      '<h3>검사한 것</h3><ul class="checks">' +
      s.checks.map(function (c) {
        var m = MARK[c[0]];
        return '<li><span class="mark ' + m[2] + '" aria-label="' + m[1] + '">' + m[0] + '</span><span>' + c[1] + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="verdict ' + s.verdict[0] + '">판단 결과: ' + s.verdict[1] + '<small>' + s.verdict[2] + '</small></div>';
  }

  root.querySelectorAll('[data-sse]').forEach(function (b) {
    b.addEventListener('click', function () { render(b.getAttribute('data-sse')); });
  });
  render('web');
})();
