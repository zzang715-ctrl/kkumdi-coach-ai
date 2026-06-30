# 비밀키 보호 체크리스트

이 문서는 OpenAI API Key, Supabase Key 같은 비밀 값을 안전하게 관리하기 위한 안내입니다.

## 안전한 방법

- 실제 키는 `.env.local`에 넣습니다.
- GitHub에는 `.env.local`을 올리지 않습니다.
- `.env.example`에는 가짜 예시 값만 넣습니다.
- Vercel 배포 시에는 Vercel의 Environment Variables에 값을 넣습니다.
- Supabase `anon public key`는 브라우저에서 사용할 수 있지만, RLS 정책과 함께 사용해야 합니다.
- Supabase `service_role key`는 브라우저 코드에 넣으면 안 됩니다.

## 절대 하지 않기

- OpenAI API Key를 화면 코드에 직접 쓰기
- Supabase service_role key를 브라우저 코드에 넣기
- `.env.local` 파일을 GitHub에 올리기
- 카카오톡, 이메일, 블로그에 실제 API Key 공유하기

## 현재 .gitignore 보호

현재 프로젝트는 아래 설정으로 실제 환경변수 파일을 막고 있습니다.

```gitignore
.env*
!.env.example
```

뜻:

- `.env.local` 같은 실제 키 파일은 GitHub에 올라가지 않게 막습니다.
- `.env.example` 파일은 예시 파일이라 공유할 수 있게 허용합니다.

## 앱에서 보기

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000/security-guide
```
