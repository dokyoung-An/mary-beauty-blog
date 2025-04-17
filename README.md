# 메리의 머니수다 (Mary's Money Talk)

Astro 기반 금융 정보 블로그 프로젝트

## 📝 프로젝트 개요

- 블로그 이름: 메리의 머니수다
- 목적: 금융 정보와 투자 팁을 제공하는 정적 블로그
- 기술 스택: Astro, TailwindCSS, MDX
- 배포: Vercel

## 🚀 주요 기능

- Markdown 파일 기반 블로그 게시물 시스템
- 태그 기반 게시물 분류
- 반응형 디자인
- SEO 최적화 (메타 태그, 사이트맵, robots.txt)

## 🛠️ 설치 및 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/mary-money-talk.git
cd mary-money-talk

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📂 파일 구조

```
mary-money-talk/
├─ public/             # 정적 파일
├─ posts/              # 블로그 게시물 (.md, .mdx)
├─ src/
│  ├─ components/      # 재사용 가능한 컴포넌트
│  ├─ layouts/         # 페이지 레이아웃
│  ├─ pages/           # 라우팅 페이지
│  ├─ styles/          # 글로벌 스타일
│  ├─ utils/           # 유틸리티 함수
├─ astro.config.mjs    # Astro 설정
├─ tailwind.config.js  # Tailwind CSS 설정
└─ package.json
```

## 📝 블로그 게시물 작성 방법

`posts` 디렉토리에 마크다운(.md) 또는 MDX(.mdx) 파일을 추가합니다. 각 파일은 다음과 같은 프론트매터를 포함해야 합니다:

```markdown
---
title: "게시물 제목"
date: "YYYY-MM-DD"
description: "게시물에 대한 간단한 설명"
tags: ["태그1", "태그2"]
---

게시물 내용을 여기에 작성합니다...
```

## 🌐 SEO 최적화

- 각 페이지에 메타 태그 설정
- 사이트맵 자동 생성 (sitemap.xml)
- robots.txt 설정

## 📱 반응형 디자인

- 모바일, 태블릿, 데스크톱 화면 지원
- TailwindCSS를 활용한 반응형 UI

## 🔜 향후 계획

- GPT 자동 포스팅 스크립트 구현
- 댓글 시스템 추가
- 다크 모드 지원

## 📄 라이센스

MIT License 

## 📄 자동 포스트 생성 및 배포

이 블로그는 OpenAI API를 사용하여 자동으로 블로그 포스트를 생성하고 배포하는 시스템을 갖추고 있습니다.

### 수동으로 포스트 생성하기

```bash
# 블로그 포스트 생성
npm run generate-post

# 생성된 포스트 GitHub에 발행
npm run publish-post
```

### 자동 포스트 생성 설정

블로그 포스트는 GitHub Actions를 통해 3시간마다 자동으로 생성되고 배포됩니다. 이 기능을 사용하려면 다음 환경 변수를 설정해야 합니다:

1. GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 비밀 변수를 추가합니다:
   - `OPENAI_API_KEY`: OpenAI API 키 