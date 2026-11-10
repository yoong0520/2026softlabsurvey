# 2026 AI 코스웨어 실증 수업 수강생 만족도 조사

한림대학교 에듀테크소프트랩사업단의 실증 참여 수강생 대상 만족도 조사 페이지입니다.

- 설문 페이지: https://yoong0520.github.io/2026softlabsurvey/
- 교과목별 링크 만들기(사업단용): 주소 뒤에 `#admin`
- 문항: 선택형 19문항 + 선택 서술 2문항, 약 3분, 무기명

## 응답 저장(구글 스프레드시트) — 연결 완료(2026-11-10)
- 응답은 사업단 구글 스프레드시트의 첫 번째 탭에 한 줄씩 기록되고, 「요약」 탭에서 종합 만족도·영역별 점수·NPS·Track별 수치가 자동 계산됩니다.
- 수신기: Apps Script 웹 앱(실행 주체: 소유자, 액세스: 모든 사용자). 코드는 `relay/survey-receiver.gs` 와 동일합니다.
- 「요약」 탭을 다시 만들려면 Apps Script 에서 `setupSummary` 를 실행합니다.

코드를 고친 뒤에는 Apps Script 「배포 관리」에서 새 버전으로 배포해야 반영됩니다(주소 유지).

## 수정·배포
`index.html` 을 고쳐 main 브랜치에 push 하면 GitHub Actions 가 자동 배포합니다(Settings > Pages > Source: GitHub Actions).
