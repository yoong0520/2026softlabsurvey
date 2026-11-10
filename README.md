# 2026 AI 코스웨어 실증 수업 수강생 만족도 조사

한림대학교 에듀테크소프트랩사업단의 실증 참여 수강생 대상 만족도 조사 페이지입니다.

- 설문 페이지: https://yoong0520.github.io/2026softlabsurvey/
- 교과목별 링크 만들기(사업단용): 주소 뒤에 `#admin`
- 문항: 선택형 19문항 + 선택 서술 2문항, 약 3분, 무기명

## 응답 저장(구글 스프레드시트) 연결
1. 응답 스프레드시트에서 확장 프로그램 > Apps Script 를 열고 `relay/survey-receiver.gs` 내용을 붙여넣어 저장
2. `setupSummary` 함수를 한 번 실행(권한 승인) → 「요약」 탭 생성
3. 배포 > 새 배포 > 웹 앱(실행 주체: 나, 액세스: 모든 사용자)
4. 발급된 `.../exec` 주소를 `index.html` 의 `RECEIVER` 값에 넣고 main 에 push

코드를 고친 뒤에는 Apps Script 「배포 관리」에서 새 버전으로 배포해야 반영됩니다(주소 유지).

## 수정·배포
`index.html` 을 고쳐 main 브랜치에 push 하면 GitHub Actions 가 자동 배포합니다(Settings > Pages > Source: GitHub Actions).
