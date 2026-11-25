// ZTNA 접근 판단 시뮬레이터 (가상 규칙, 네트워크 요청 없음)
(function () {
  var form = document.getElementById('ztna-demo');
  if (!form) return;

  var APPS = {
    dev: { name: '개발자', apps: ['코드 저장소', '배포 도구', '사내 위키'] },
    finance: { name: '재무팀', apps: ['급여 시스템', '회계 시스템', '사내 위키'] }
  };

  var checksEl = document.getElementById('ztna-checks');
  var verdictEl = document.getElementById('ztna-verdict');
  var appsEl = document.getElementById('ztna-apps');

  function val(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  function render() {
    var role = val('role'), device = val('device'), place = val('place'), time = val('time');
    var checks = [
      { s: 'ok', t: '신원 확인: 계정 비밀번호와 다중 인증 통과' },
      device === 'managed'
        ? { s: 'ok', t: '기기 상태: 회사가 관리하는 노트북, 보안 업데이트 최신' }
        : { s: 'warn', t: '기기 상태: 회사가 관리하지 않는 개인 기기' },
      place === 'office'
        ? { s: 'ok', t: '위치: 평소 접속하던 국내 사무실' }
        : { s: 'warn', t: '위치: 평소와 다른 해외 접속' },
      time === 'work'
        ? { s: 'ok', t: '시간: 업무 시간' }
        : { s: 'warn', t: '시간: 평소 접속하지 않는 심야' }
    ];
    var warns = checks.filter(function (c) { return c.s === 'warn'; }).length;
    var sensitiveBlock = role === 'finance' && device === 'unmanaged';

    var result;
    if (sensitiveBlock && warns >= 1) {
      result = { k: 'deny', t: '차단', d: '급여처럼 민감한 앱은 관리되지 않는 기기에서 열 수 없다는 정책에 걸렸습니다.' };
    } else if (warns === 0) {
      result = { k: 'allow', t: '허용', d: '모든 조건이 정상이라 업무에 필요한 앱만 연결합니다. 접속 중에도 조건이 바뀌면 다시 판단합니다.' };
    } else if (warns === 1) {
      result = { k: 'stepup', t: '추가 인증 요청', d: '평소와 다른 조건이 하나 있어, 휴대폰 확인 같은 추가 인증을 통과하면 접속을 허용합니다.' };
    } else {
      result = { k: 'deny', t: '차단', d: '평소와 다른 조건이 ' + warns + '개 겹쳐 위험이 높다고 보고 접속을 막습니다. 보안 담당자에게 기록이 남습니다.' };
    }

    checksEl.innerHTML = checks.map(function (c) {
      var mark = c.s === 'ok' ? '✓' : '!';
      var label = c.s === 'ok' ? '정상' : '주의';
      return '<li><span class="mark ' + (c.s === 'ok' ? 'ok' : 'warn') + '" aria-label="' + label + '">' + mark + '</span><span>' + c.t + '</span></li>';
    }).join('');
    if (sensitiveBlock) {
      checksEl.innerHTML += '<li><span class="mark bad" aria-label="정책">✕</span><span>정책: 급여 시스템은 회사 관리 기기에서만 접속 가능</span></li>';
    }

    verdictEl.className = 'verdict ' + result.k;
    verdictEl.innerHTML = '판단 결과: ' + result.t + '<small>' + result.d + '</small>';

    var apps = APPS[role].apps;
    appsEl.innerHTML = apps.map(function (a) {
      var on = result.k === 'allow' || (result.k === 'stepup' && a === '사내 위키');
      var note = on ? '' : (result.k === 'stepup' ? ' (추가 인증 후)' : ' (차단)');
      return '<li class="' + (on ? 'on' : 'off') + '">' + a + note + '</li>';
    }).join('') + '<li class="off">그 밖의 사내 서버 (항상 보이지 않음)</li>';
  }

  form.addEventListener('change', render);
  var presets = document.querySelectorAll('[data-preset]');
  presets.forEach(function (b) {
    b.addEventListener('click', function () {
      b.getAttribute('data-preset').split(',').forEach(function (pair) {
        var kv = pair.split('=');
        var el = form.querySelector('input[name="' + kv[0] + '"][value="' + kv[1] + '"]');
        if (el) el.checked = true;
      });
      render();
    });
  });
  render();
})();
