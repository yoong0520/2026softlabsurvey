/**
 * 2026 소프트랩 실증 참여 수강생 만족도 조사 - 응답 수신기 (Google Apps Script)
 * 설치: 응답 스프레드시트 > 확장 프로그램 > Apps Script > 이 코드 붙여넣기 > 저장
 *   1) 함수 setupSummary 를 한 번 실행(권한 승인) -> 「요약」 탭 생성
 *   2) 배포 > 새 배포 > 유형: 웹 앱 > 실행 주체: 나 / 액세스: 모든 사용자 > 배포
 *   3) 발급된 웹 앱 URL(.../exec)을 index.html 의 RECEIVER 에 붙여넣기
 */
const SHEET_ID = '1NJvXhROL2y7huaAqZLnOqpbM-TbMxpnvPqCF30um7bw';
const SUMMARY = '요약';

function sheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheets().filter(function (s) { return s.getName() !== SUMMARY; })[0];
}
function safe_(v) { // 수식 삽입 방지 + 길이 제한
  v = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function num_(v, min, max) {
  const n = parseInt(v, 10);
  return (isNaN(n) || n < min || n > max) ? '' : n;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    const q = [];
    for (let i = 1; i <= 13; i++) q.push(num_(d['q' + i], 1, 7));
    const ans = q.filter(function (v) { return v !== ''; });
    const mean = ans.length ? ans.reduce(function (a, b) { return a + b; }, 0) / ans.length : '';
    const score = mean === '' ? '' : Math.round((mean - 1) / 6 * 1000) / 10; // 7점 -> 100점 환산
    const row = [new Date(), safe_(d.univ), safe_(d.course), safe_(d.prof), safe_(d.track), safe_(d.cw),
      safe_(d.grade), safe_(d.major), safe_(d.freq), safe_(d.prior)]
      .concat(q)
      .concat([num_(d.nps, 0, 10), safe_(d.tags), safe_(d.best), safe_(d.improve), score, safe_(d.device)]);
    sheet_().appendRow(row);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
function doGet() { return out_({ ok: true, msg: 'receiver alive' }); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** 「요약」 탭 생성: 응답이 쌓이면 수치가 자동 갱신됨 */
function setupSummary() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const R = "'" + sheet_().getName().replace(/'/g, "''") + "'!";
  let s = ss.getSheetByName(SUMMARY);
  if (!s) s = ss.insertSheet(SUMMARY); else s.clear();
  const to100 = function (rng) { return '=IFERROR(ROUND((AVERAGE(' + R + rng + ')-1)/6*100,1),"-")'; };
  const rate = function (rng) { return '=IFERROR(ROUND(COUNT(' + R + rng + ')/COUNTA(' + R + 'A2:A)*100,1),"-")'; };
  const rows = [
    ['구분', '값', '비고'],
    ['응답 수(명)', '=COUNTA(' + R + 'A2:A)', ''],
    ['종합 만족도(100점)', '=IFERROR(ROUND(AVERAGE(' + R + 'AB2:AB),1),"-")', '13문항 평균의 100점 환산, 2026 목표 88.2점'],
    ['전반 만족 단일문항 Q12(100점)', to100('V2:V'), ''],
    ['영역: 사용 편의(Q1-2)', to100('K2:L'), ''],
    ['영역: 적응형 학습(Q3-6)', to100('M2:P'), '경험자만 평균'],
    ['영역: 학습 효과(Q7-10)', to100('Q2:T'), ''],
    ['영역: 교수자 지원(Q11)', to100('U2:U'), ''],
    ['영역: 종합·지속 의향(Q12-13)', to100('V2:W'), ''],
    ['NPS(순추천지수)', '=IFERROR(ROUND((COUNTIF(' + R + 'X2:X,">=9")-COUNTIF(' + R + 'X2:X,"<=6"))/COUNT(' + R + 'X2:X)*100,1),"-")', '추천(9-10) 비율 - 비추천(0-6) 비율'],
    ['적응형 경험률: 사전 진단(%)', rate('M2:M'), ''],
    ['적응형 경험률: 맞춤형 학습(%)', rate('N2:N'), ''],
    ['적응형 경험률: 개별 피드백(%)', rate('O2:O'), ''],
    ['적응형 경험률: 사후 진단(%)', rate('P2:P'), ''],
    ['', '', ''],
    ['Track별', '응답 수', '종합 만족도(100점)']
  ];
  ['Track 1 신규 개발', 'Track 2 신규 심화', 'Track 2 기개발 심화', '기타 에듀테크'].forEach(function (t) {
    rows.push([t, '=COUNTIF(' + R + 'E2:E,"' + t + '")', '=IFERROR(ROUND(AVERAGEIF(' + R + 'E2:E,"' + t + '",' + R + 'AB2:AB),1),"-")']);
  });
  s.getRange(1, 1, rows.length, 3).setValues(rows);
  s.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#e9eef7');
  s.getRange(16, 1, 1, 3).setFontWeight('bold').setBackground('#e9eef7');
  s.setColumnWidth(1, 260); s.setColumnWidth(3, 320);
}
