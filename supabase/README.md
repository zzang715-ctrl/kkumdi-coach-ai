# Supabase 설정 안내

이 폴더의 SQL은 꿈디코치 AI 강사비서 프로젝트를 Supabase DB에 저장하기 위한 준비 파일입니다.

## 적용 방법

1. Supabase 프로젝트에 접속합니다.
2. 왼쪽 메뉴에서 `SQL Editor`를 엽니다.
3. `supabase/migrations/001_create_projects.sql` 내용을 복사해서 실행합니다.
4. `.env.local`에 아래 값을 넣습니다.

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon key
```

`service_role key`는 브라우저 코드에 넣으면 안 됩니다.

## RLS 정책

`projects` 테이블은 Row Level Security가 켜져 있습니다.
로그인한 사용자는 자기 `user_id`와 일치하는 프로젝트만 읽고, 만들고, 수정하고, 삭제할 수 있습니다.
