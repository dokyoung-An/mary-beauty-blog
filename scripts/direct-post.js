#!/usr/bin/env node

// 간단한 독립 블로그 포스트 생성기
// Astro 개발 서버와 분리해서 실행

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const slugify = require('slugify');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

// OpenAI API 키 설정
const MODEL = 'gpt-3.5-turbo';

// OpenAI API 키 가져오기 - 환경 변수 사용
const apiKey = process.env.PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API 키가 설정되지 않았습니다.');
  console.error('환경 변수 PUBLIC_OPENAI_API_KEY 또는 OPENAI_API_KEY를 설정하세요.');
  process.exit(1);
}

// OpenAI API 클라이언트 초기화
const openai = new OpenAI({
  apiKey: apiKey,
});

// 현재 날짜를 YYYY-MM-DD 형식으로 반환
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 제목에서 슬러그 생성
function createSlug(title) {
  // 한글 제목을 위한 기본 슬러그 처리
  const slug = slugify(title, {
    lower: true,      // 소문자로 변환
    strict: true,     // 특수문자 제거
    locale: 'ko',     // 한국어 설정
  });
  
  // 슬러그가 비어있으면 (한글이 모두 제거된 경우) 영문으로 변환
  if (!slug || slug === '') {
    // 간단한 한글->영문 변환
    const englishTitle = title
      .replace(/소액/g, 'small-amount')
      .replace(/투자/g, 'investment')
      .replace(/전략/g, 'strategy')
      .replace(/분산/g, 'diversification')
      .replace(/시작/g, 'start')
      .replace(/초보자/g, 'beginner')
      .replace(/금융/g, 'finance')
      .replace(/경제/g, 'economy')
      .replace(/주식/g, 'stock')
      .replace(/기초/g, 'basic')
      .replace(/퇴직/g, 'retirement')
      .replace(/연금/g, 'pension')
      .replace(/방법/g, 'method')
      .replace(/효율/g, 'efficient');
    
    return slugify(englishTitle, {
      lower: true,
      strict: true,
    }) || 'blog-post'; // 마지막 대안
  }
  
  return slug;
}

// 파일 이름 생성 (YYYY-MM-DD-slug.md)
function createFileName(title) {
  const date = getCurrentDate();
  const slug = createSlug(title);
  return `${date}-${slug}.md`;
}

// 파일 경로 확인 및 생성
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// GPT를 사용하여 고품질 블로그 글 생성
async function generateBlogPost(topic) {
  console.log(`주제 "${topic}"에 대한 블로그 글을 생성하고 있습니다...`);
  
  const prompt = `
당신은 최고의 금융/투자 전문가로, 복잡한 개념을 쉽게 설명하고 실용적인 조언을 제공합니다.
아래 주제에 대해 고품질의 블로그 글을 작성해 주세요.

주제: ${topic}

다음 요구사항을 지켜주세요:
1. 글 길이는 1,000~1,500자 내외로 작성
2. 쉽고 친근한 문체로 작성 (초보자도 이해할 수 있게)
3. 최신 데이터와 트렌드를 반영
4. 실제 사례와 통계를 포함
5. 실용적인 팁과 액션 아이템 제공
6. SEO를 위한 키워드를 자연스럽게 포함
7. 형식은 다음과 같이 작성:

---
title: "${topic}"
date: "${getCurrentDate()}"
description: "(주제에 맞는 SEO 최적화된 설명 - 50~160자 사이)"
tags: ["(주제 관련 태그 5개)"]
---

# ${topic}

<!-- AD_PLACE_1 -->

(인트로: 독자의 관심을 끄는 흥미로운 시작)

## (주요 섹션 1)

(본문)

## (주요 섹션 2)

(본문)

<!-- AD_PLACE_2 -->

## (주요 섹션 3)

(본문)

## 요약 및 결론

(핵심 포인트 요약 및 다음 단계 제안)
`;

  try {
    console.log("================================================");
    console.log("OpenAI API에 요청 중...");
    console.log("사용 모델:", MODEL);
    console.log("타임아웃 설정:", openai.timeout + "ms");
    console.log("================================================");
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: '당신은 경제 및 투자 전문가입니다. 복잡한 금융 개념을 쉽게 설명하는 능력이 있으며, 정확하고 유용한 정보를 제공합니다.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    console.log("OpenAI 응답 수신 완료!");
    console.log("응답 ID:", response.id);
    console.log("사용 토큰:", response.usage ? JSON.stringify(response.usage) : "정보 없음");
    console.log("================================================");
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error.message);
    throw error;
  }
}

// 생성된 블로그 글을 파일로 저장
function saveBlogPost(content, topic) {
  const fileName = createFileName(topic);
  const postsDir = path.join(__dirname, '..', 'src', 'posts');
  ensureDirectoryExists(postsDir);
  
  const filePath = path.join(postsDir, fileName);
  
  // 파일이 이미 존재하는지 확인
  if (fs.existsSync(filePath)) {
    console.log(`경고: 파일 ${fileName}이(가) 이미 존재합니다. 덮어쓰지 않습니다.`);
    return false;
  }
  
  // 파일 저장
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`성공: 블로그 글이 ${filePath}에 저장되었습니다.`);
  return true;
}

// 메인 함수
async function main() {
  // 명령행 인수에서 주제 가져오기
  const topic = process.argv[2];
  
  if (!topic || topic.trim() === '') {
    console.log('사용법: node direct-post.js "블로그 글 주제"');
    process.exit(1);
  }
  
  try {
    console.log("==========================================================");
    console.log(`주제: "${topic}"`);
    console.log("==========================================================");
    
    // 블로그 글 생성
    console.log("1. OpenAI API를 통해 블로그 글 생성을 시작합니다...");
    const blogContent = await generateBlogPost(topic);
    console.log("2. 블로그 글 생성 완료!");
    
    // 생성된 콘텐츠 미리보기 출력
    console.log("\n--- 생성된 콘텐츠 미리보기 (처음 300자) ---");
    console.log(blogContent.substring(0, 300) + "...");
    console.log("--- 미리보기 끝 ---\n");
    
    // 파일 저장
    console.log("3. 파일 저장 시작...");
    const saved = saveBlogPost(blogContent, topic);
    
    if (saved) {
      console.log("4. 프로세스 완료: 블로그 글이 성공적으로 생성되고 저장되었습니다!");
    } else {
      console.log("4. 프로세스 완료: 블로그 글이 생성되었지만 저장되지 않았습니다.");
    }
    
  } catch (error) {
    console.error('\n\n오류가 발생했습니다:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 