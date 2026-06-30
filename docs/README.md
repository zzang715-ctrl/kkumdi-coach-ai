# 꿈디코치 AI 강사비서 문서 목차

이 폴더는 앱 실행, 설정, 서버 저장, 배포, QA, 보안 문서를 모아둔 곳입니다.

## 처음 볼 문서

1. `environment-setup.md`
   - OpenAI, Supabase 환경변수 설정 방법
   - `.env.local`을 어디에 만들고 어떻게 수정하는지 설명

2. `supabase-rls.md`
   - Supabase `projects` 테이블 생성 SQL
   - RLS 보안 정책 설명

3. `deployment-guide.md`
   - Vercel 배포 전 확인할 것
   - Vercel 환경변수와 배포 후 테스트 순서

## 출시 전 확인 문서

4. `qa-checklist.md`
   - 화면, 프로젝트, 다운로드, 설정을 직접 눌러보는 QA 체크리스트

5. `security-checklist.md`
   - OpenAI API Key, Supabase Key 보호 방법
   - `.env.local`과 `.env.example` 차이

6. `release-notes.md`
   - 현재 버전에서 되는 기능
   - 공개 전 남은 일
   - 추천 진행 순서

7. `handoff.md`
   - 현재 상태와 다음 개발 순서
   - 다른 작업자에게 넘길 때 필요한 핵심 정보

8. `go-live-checklist.md`
   - 실제 사용자에게 공개하기 전 마지막 확인 항목

## 앱에서 보는 안내 화면

- 사용 도움말: `http://localhost:3000/help`
- 완성도 확인: `http://localhost:3000/roadmap`
- 설정 점검: `http://localhost:3000/settings`
- Supabase 안내: `http://localhost:3000/supabase-guide`
- 비밀키 보호: `http://localhost:3000/security-guide`
- 배포 안내: `http://localhost:3000/deploy-guide`
- 최종 QA: `http://localhost:3000/qa-guide`
- 출시 요약: `http://localhost:3000/release-notes`
- 완료 화면: `http://localhost:3000/finish`
- 인수인계: `http://localhost:3000/handoff`
- 공개 전 체크: `http://localhost:3000/go-live`

## 자주 쓰는 명령어

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```
