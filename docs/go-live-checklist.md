# 공개 직전 체크리스트

이 문서는 꿈디코치 AI 강사비서를 실제 사용자에게 공개하기 바로 전에 확인할 마지막 항목입니다.

## 현재 결론

앱 기능은 준비되었습니다. 실제 공개 전에는 결제, 서버 저장, 배포 주소 테스트가 반드시 필요합니다.

## 공개 전 필수 확인

1. OpenAI 결제와 사용량 한도 확인
2. Supabase 프로젝트 생성과 SQL/RLS 적용
3. `.env.local`에 Supabase URL과 anon key 입력
4. Vercel Environment Variables 입력
5. Vercel 배포 주소에서 회원가입/로그인 테스트
6. 프로젝트 서버 저장 테스트
7. 비밀키가 GitHub에 올라가지 않았는지 확인

## 권장 확인

1. 실제 강의 프로젝트 1개를 넣고 끝까지 테스트
2. QA 체크리스트 완료
3. QA 결과 파일 저장
4. 배포 준비 결과 파일 저장
5. 강사 1-2명에게 사용 테스트 요청

## 마지막 실행 순서

```powershell
npm.cmd run lint
npm.cmd run build
```

그 다음 Supabase, OpenAI, Vercel 설정을 확인하고 실제 배포 주소에서 다시 QA를 진행합니다.

## 앱에서 보기

```text
http://localhost:3000/go-live
```
