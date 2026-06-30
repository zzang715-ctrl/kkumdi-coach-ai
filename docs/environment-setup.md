# 꿈디코치 AI 강사비서 환경설정하기

이 문서는 AI 생성, 로그인, 서버 저장을 켜기 위한 설정 방법입니다.

## 1. 설정 파일 위치

프로젝트 폴더는 아래 위치입니다.

```text
C:\Users\user\Documents\꿈디코치웹앱
```

이 폴더 안에 아래 파일이 있어야 합니다.

```text
.env.local
```

없다면 `.env.example` 파일을 복사해서 `.env.local` 이름으로 만들면 됩니다.

## 2. OpenAI 설정

AI 글 생성을 사용하려면 `.env.local`에 아래 값을 넣습니다.

```env
OPENAI_API_KEY=여기에_OpenAI_API_Key
OPENAI_MODEL=gpt-4.1-mini
```

주의:

- `OPENAI_API_KEY`는 비밀 열쇠입니다.
- 다른 사람에게 보여주거나 보내면 안 됩니다.
- 이 앱은 화면에 실제 키 값을 보여주지 않게 만들었습니다.
- OpenAI 결제 또는 사용 한도가 없으면 연결은 되어도 생성 오류가 날 수 있습니다.

## 3. Supabase 설정

로그인, 회원가입, 서버 저장을 사용하려면 `.env.local`에 아래 값도 넣습니다.

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_Supabase_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_Supabase_Anon_Key
```

Supabase에서 찾는 위치:

1. Supabase 프로젝트 접속
2. Project Settings 클릭
3. API 클릭
4. Project URL 복사
5. anon public key 복사

중요:

- `service_role key`는 브라우저 앱에 넣으면 안 됩니다.
- 현재 앱은 `anon public key`만 사용합니다.
- Supabase 설정 전에도 브라우저 저장소로 프로젝트를 저장하고 테스트할 수 있습니다.

## 4. 서버 다시 시작

`.env.local`을 바꾼 뒤에는 개발 서버를 다시 켜야 합니다.

터미널에서 먼저 서버 끄기:

```text
Ctrl + C
Y
Enter
```

다시 실행:

```powershell
npm.cmd run dev
```

브라우저에서 확인:

```text
http://localhost:3000/settings
```

## 5. 결제 전 테스트 방법

OpenAI 결제 전에는 AI 생성 버튼이 quota 또는 billing 오류를 보여줄 수 있습니다.

그럴 때는 각 단계에서 아래 기능을 사용하세요.

- 샘플 초안 만들기
- 기본 요약 만들기

이 기능만으로도 프로젝트 만들기, 저장, 복사, 다운로드 흐름을 테스트할 수 있습니다.

## 6. 설정 상태 확인

앱에서 아래 화면으로 이동합니다.

```text
http://localhost:3000/settings
```

여기에서 다음 항목이 준비되었는지 확인할 수 있습니다.

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 7. 문제 검사 명령어

코드 검사:

```powershell
npm.cmd run lint
```

빌드 검사:

```powershell
npm.cmd run build
```
