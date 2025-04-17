# 메리의 미수다 블로그

중년 여성의 아름다움과 건강을 위한 실용적인 정보를 제공하는 블로그입니다.

## 기능

- Astro 기반의 빠른 정적 웹사이트
- SEO 최적화 (Open Graph, Twitter 카드 등)
- 반응형 디자인
- 마크다운 기반 콘텐츠 관리
- 자동 이미지 생성 기능
- GitHub Actions를 이용한 자동 포스팅 시스템

## 자동 포스팅 시스템

이 블로그는 다음과 같은 자동화 시스템을 갖추고 있습니다:

1. **GitHub Actions 스케줄링**: 3시간마다 새로운 블로그 포스트를 자동으로 생성하고 배포합니다.
2. **자동 이미지 생성**: 각 포스트의 제목에 맞는 커버 이미지를 자동으로 생성합니다.
3. **주제 중복 방지**: 최근 게시된 주제와 중복되지 않도록 관리합니다.

## 로컬에서 실행하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 수동으로 테스트 포스트 생성
npm run create-test-post-with-image

# 자동 포스팅 스케줄러 실행 (로컬)
npm run auto-post
```

## 스크립트 설명

- `npm run dev`: 개발 서버를 실행합니다.
- `npm run build`: 프로덕션용 빌드를 생성합니다.
- `npm run preview`: 빌드된 사이트를 미리 봅니다.
- `npm run create-test-post`: 테스트 블로그 포스트를 생성합니다.
- `npm run generate-image`: 테스트 이미지를 생성합니다.
- `npm run create-test-post-with-image`: 이미지가 포함된 테스트 포스트를 생성합니다.
- `npm run auto-post`: 자동 포스팅 스케줄러를 시작합니다 (3시간마다 실행).

## 주요 파일 및 디렉토리

- `src/`: 소스 코드
  - `src/pages/`: 페이지 컴포넌트
  - `src/layouts/`: 레이아웃 템플릿
  - `src/components/`: 재사용 가능한 컴포넌트
  - `src/posts/`: 마크다운 형식의 블로그 포스트
- `public/`: 정적 파일 (이미지, 아이콘 등)
- `scripts/`: 자동화 스크립트
  - `auto-post-scheduler.cjs`: 자동 포스팅 스케줄러
  - `create-test-post-with-image.cjs`: 테스트 포스트 및 이미지 생성
  - `create-post-github-action.cjs`: GitHub Actions용 포스트 생성 스크립트
- `.github/workflows/`: GitHub Actions 워크플로우
  - `auto-post.yml`: 자동 포스팅 워크플로우

## 환경 변수

`.env` 파일에 다음 변수들을 설정할 수 있습니다:

```
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME="메리의 미수다"
PUBLIC_SITE_DESCRIPTION="중년 여성의 아름다움과 건강을 위한 실용적인 정보를 제공하는 블로그"
```

## GitHub Actions 설정 방법

1. 이 저장소를 GitHub에 푸시합니다.
2. GitHub 저장소 설정에서 Actions 권한이 활성화되어 있는지 확인합니다.
3. GitHub 저장소의 Settings > Secrets and variables > Actions에서 필요한 시크릿을 설정합니다:
   - `OPENAI_API_KEY`: (선택) OpenAI API 키
   - `PUBLIC_SITE_URL`: 사이트 URL (기본값: http://localhost:4321)
   - `PUBLIC_SITE_NAME`: 사이트 이름 (기본값: 메리의 미수다)
   - `PUBLIC_SITE_DESCRIPTION`: 사이트 설명
4. 워크플로우는 자동으로 3시간마다 실행되며, GitHub 저장소의 Actions 탭에서 수동으로도 실행할 수 있습니다.

## 워크플로우 수동 실행

자동화된 포스팅을 즉시 트리거하려면:
1. GitHub 저장소의 Actions 탭으로 이동합니다.
2. "자동 블로그 포스트 생성" 워크플로우를 선택합니다.
3. "Run workflow" 버튼을 클릭합니다.
4. "Run workflow" 버튼을 다시 클릭하여 실행을 시작합니다.

---

메리의 미수다 블로그 © 2025 