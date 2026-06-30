# Vercel 배포 안내

이 문서는 꿈디코치 AI 강사비서를 인터넷 주소로 배포하기 전 확인할 내용을 정리한 문서입니다.

## 배포 전 확인

1. 터미널에서 `npm.cmd run build`를 실행합니다.
2. 오류 없이 빌드가 끝나는지 확인합니다.
3. OpenAI와 Supabase 환경변수를 준비합니다.
4. Supabase `projects` 테이블과 RLS 정책을 확인합니다.
5. OpenAI 실제 생성 기능을 쓰려면 OpenAI 결제와 사용량 한도를 확인합니다.

## Vercel 배포 순서

1. GitHub에 프로젝트 코드를 올립니다.
2. Vercel에 로그인합니다.
3. New Project를 누릅니다.
4. GitHub 저장소를 선택합니다.
5. Environment Variables에 필요한 값을 넣습니다.
6. Deploy를 누릅니다.
7. 배포 주소에서 로그인, 프로젝트 저장, 다운로드를 다시 테스트합니다.

## Vercel에 넣을 환경변수

| 이름 | 설명 |
| --- | --- |
| `OPENAI_API_KEY` | AI 초안 생성을 위한 OpenAI 비밀 키 |
| `OPENAI_MODEL` | 사용할 OpenAI 모델 이름 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 주소 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 브라우저용 공개 키 |

## 중요한 보안 주의

- `.env.local` 파일은 GitHub에 올리면 안 됩니다.
- OpenAI API Key는 클라이언트 화면에 보여주면 안 됩니다.
- Supabase `service_role key`는 브라우저 코드나 공개 환경변수에 넣으면 안 됩니다.
- Supabase RLS를 켜서 사용자가 자기 프로젝트만 보게 해야 합니다.

## 배포 후 테스트

1. 첫 화면이 열리는지 확인합니다.
2. 회원가입과 로그인이 되는지 확인합니다.
3. 새 프로젝트를 만들고 저장합니다.
4. 저장된 프로젝트 목록에 다시 보이는지 확인합니다.
5. 다운로드 화면에서 Markdown, Word, PDF 저장 흐름을 확인합니다.
6. OpenAI 결제 전이라면 AI 생성 버튼에서 quota 오류가 날 수 있습니다.

## 앱 안에서 체크하기

`http://localhost:3000/deploy-guide` 화면에서 배포 준비 항목을 직접 체크할 수 있습니다. 체크 상태는 이 브라우저에 저장됩니다.

같은 화면에서 `배포 준비 결과 내보내기` 버튼을 누르면 Markdown 파일로 준비 결과를 저장할 수 있습니다.
