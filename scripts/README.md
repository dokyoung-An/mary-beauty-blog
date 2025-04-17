# GPT 자동 블로그 글 생성 스크립트

이 스크립트는 OpenAI API를 사용하여 주어진 주제에 대한 블로그 글을 자동으로 생성하고 마크다운 파일로 저장합니다.

## 기능

- OpenAI GPT 모델을 사용하여 고품질 블로그 글 생성
- 광고 위치 주석 자동 포함 (`<!-- AD_PLACE_1 -->`, `<!-- AD_PLACE_2 -->`)
- 마크다운 메타데이터 포함 (title, date, description, tags)
- 파일명을 `YYYY-MM-DD-슬러그.md` 형식으로 저장
- 이미 존재하는 파일을 덮어쓰지 않도록 보호

## 설정

1. `.env` 파일에 OpenAI API 키 설정
```
OPENAI_API_KEY=your_openai_api_key_here
GPT_MODEL=gpt-3.5-turbo  # 또는 gpt-4
```

2. 필요한 패키지 설치
```bash
npm install openai dotenv slugify
```

## 사용법

### 1. 특정 주제로 글 생성
```bash
node scripts/generatePost.js "주제"
```

예시:
```bash
node scripts/generatePost.js "오늘의 국내외 경제 뉴스 요약"
```

### 2. 키워드 목록에서 무작위로 주제 선택하여 글 생성
```bash
node scripts/generatePost.js
```

## 키워드 관리

`scripts/keywords.json` 파일에 블로그 주제 목록을 관리할 수 있습니다. 형식은 다음과 같습니다:

```json
[
  "주제1",
  "주제2",
  "주제3"
]
```

## 출력 결과

생성된 블로그 글은 `src/posts/` 디렉토리에 저장됩니다. 파일명은 `YYYY-MM-DD-slug.md` 형식입니다.

## 자동화 팁

이 스크립트를 GitHub Actions이나 cron 작업으로 설정하여 매일 자동으로 새 블로그 글을 생성할 수 있습니다. 