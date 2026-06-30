# 꿈디코치 AI 강사비서 인수인계

## 현재 상태

| 항목 | 내용 |
| --- | --- |
| 현재 단계 | v1.0 기본 버전 |
| 앱 완성도 | 100% 기본 준비 |
| 저장 방식 | 브라우저 저장소 우선, Supabase 서버 저장 준비 완료 |
| AI 생성 | OpenAI API 연결 준비 완료, 결제/사용량 확인 필요 |
| 배포 | Vercel 배포 안내와 체크리스트 준비 완료 |

## 중요 파일

- `README.md`: 프로젝트 전체 설명과 실행 방법
- `docs/README.md`: 문서 목차
- `docs/environment-setup.md`: 환경변수 설정
- `docs/supabase-rls.md`: Supabase 테이블과 RLS
- `docs/deployment-guide.md`: Vercel 배포
- `docs/qa-checklist.md`: 최종 QA
- `docs/security-checklist.md`: 비밀키 보호
- `docs/release-notes.md`: 출시 요약

## 다음 개발 순서

1. Supabase 프로젝트를 실제로 만들고 SQL을 실행합니다.
2. `.env.local`에 Supabase URL과 anon key를 넣고 서버를 다시 켭니다.
3. 회원가입/로그인 후 프로젝트 서버 저장을 테스트합니다.
4. OpenAI 결제와 사용량 한도를 확인합니다.
5. 실제 AI 생성 결과를 강의 예시로 점검합니다.
6. GitHub에 올리고 Vercel에 배포합니다.
7. 배포 주소에서 QA 체크리스트를 다시 진행합니다.

## 앱에서 보기

```text
http://localhost:3000/handoff
```
