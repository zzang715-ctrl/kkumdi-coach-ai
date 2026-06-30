# 꿈디코치 AI 강사비서

교육 강사, 코치, 교회 교육 담당자, 워크숍 진행자가 강의 전·중·후 업무를 하나의 프로젝트 흐름 안에서 처리하도록 돕는 AI 강사비서 웹앱입니다.

현재 코드는 v1.0 기본 버전 기준으로 준비되었습니다. 실제 공개 전에는 OpenAI 결제, Supabase 서버 저장, Vercel 배포 테스트를 확인하세요.

## 현재 가능한 기능

- 새 프로젝트 만들기, 수정, 삭제, 복제
- 저장된 프로젝트 보기, 검색, 상태 필터, 정렬
- 첫 화면에서 최근 프로젝트 이어서 작업
- 프로젝트별 전체 진행률 확인
- 제안서, 강의 기획서, 자료수집, 결과보고서, 인터뷰, 블로그, 마케팅 작성
- 저장 상태 표시: 저장 전, 저장됨, 저장 필요
- Ctrl+S 빠른 저장
- 결과물 미리보기, 복사, 전체 복사
- Markdown, Word, PDF 인쇄 저장
- 로그인과 회원가입 화면
- Supabase 서버 저장 준비
- Supabase 테이블과 RLS 보안 안내
- Vercel 배포 준비 안내
- 최종 QA 체크리스트
- 출시 요약 화면
- 비밀키 보호 안내
- 최종 완료 화면
- 인수인계 안내
- 공개 전 체크리스트
- OpenAI API 연결 준비
- OpenAI 결제 전 샘플 초안으로 테스트

## 실행 방법

터미널에서 프로젝트 폴더로 이동합니다.

```powershell
cd C:\Users\user\Documents\꿈디코치웹앱
```

개발 서버를 실행합니다.

```powershell
npm.cmd run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000
```

## 서버를 다시 켜야 할 때

`.env.local` 파일을 바꿨거나 화면이 이상하게 보이면 서버를 껐다가 다시 켭니다.

터미널에서 먼저 멈추기:

```text
Ctrl + C
Y
Enter
```

다시 실행:

```powershell
npm.cmd run dev
```

## 결제 전 테스트 방법

OpenAI API 결제를 아직 하지 않아도 앱 흐름은 테스트할 수 있습니다.

각 단계 화면에서 아래 버튼을 사용하세요.

- 샘플 초안 만들기
- 기본 요약 만들기

OpenAI 결제가 없는 상태에서 `AI로 생성`을 누르면 quota 또는 billing 오류가 날 수 있습니다. 앱 문제가 아니라 OpenAI 계정 결제 상태 문제입니다.

## 자주 쓰는 명령어

문제 검사:

```powershell
npm.cmd run lint
```

빌드 검사:

```powershell
npm.cmd run build
```

개발 서버 실행:

```powershell
npm.cmd run dev
```

## 환경설정

AI 생성, 로그인, 서버 저장을 사용하려면 `.env.local` 파일에 값이 필요합니다.

자세한 방법은 아래 문서를 확인하세요.

```text
docs/environment-setup.md
```

전체 문서 목차는 아래 파일에서 확인할 수 있습니다.

```text
docs/README.md
```

앱에서도 설정 상태를 확인할 수 있습니다.

```text
http://localhost:3000/settings
```

Supabase 서버 저장 준비와 RLS 보안 규칙은 아래 화면에서 확인할 수 있습니다.

```text
http://localhost:3000/supabase-guide
```

같은 내용은 문서 파일로도 볼 수 있습니다.

```text
docs/supabase-rls.md
```

Vercel 배포 준비는 아래 화면에서 확인할 수 있습니다.

```text
http://localhost:3000/deploy-guide
```

문서 파일로도 볼 수 있습니다.

```text
docs/deployment-guide.md
```

최종 QA 체크리스트는 아래 화면에서 확인할 수 있습니다.

```text
http://localhost:3000/qa-guide
```

문서 파일로도 볼 수 있습니다.

```text
docs/qa-checklist.md
```

출시 요약은 아래 화면에서 확인할 수 있습니다.

```text
http://localhost:3000/release-notes
```

문서 파일로도 볼 수 있습니다.

```text
docs/release-notes.md
```

비밀키 보호 안내는 아래 화면에서 확인할 수 있습니다.

```text
http://localhost:3000/security-guide
```

문서 파일로도 볼 수 있습니다.

```text
docs/security-checklist.md
```

최종 완료 화면은 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:3000/finish
```

인수인계 안내는 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:3000/handoff
```

공개 전 마지막 체크리스트는 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:3000/go-live
```

## 앞으로 남은 작업

- OpenAI 결제와 실제 AI 생성 최종 확인
- Supabase 실제 로그인과 서버 저장 최종 연결
- Vercel 배포 설정
- 전체 화면 최종 QA
- 실제 사용자 테스트와 UI 다듬기

## 주의

- `.env.local`에는 실제 API Key가 들어갑니다.
- `.env.local`은 다른 사람에게 보내면 안 됩니다.
- `.env.example`은 예시 파일이라 공유해도 됩니다.
- OpenAI API Key는 화면에 직접 보여주지 않고 서버에서만 사용합니다.
