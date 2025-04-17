#!/usr/bin/env node

// 전문가 수준의 포스팅 생성기
// 풍부한 내용과 정확한 출처를 포함한 고품질 콘텐츠 생성

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const fetch = require('node-fetch'); // node-fetch 사용
const dotenv = require('dotenv'); // dotenv 추가

// 환경 변수 로드
dotenv.config();

// API 키 설정
const MODEL = 'gpt-3.5-turbo';

// OpenAI API 키 가져오기 - 환경 변수 사용
const apiKey = process.env.PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API 키가 설정되지 않았습니다.');
  console.error('환경 변수 PUBLIC_OPENAI_API_KEY 또는 OPENAI_API_KEY를 설정하세요.');
  process.exit(1);
}

// 현재 날짜 포맷팅
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 한글 제목에서 슬러그 생성
function createSlug(title) {
  // 한글을 영어 키워드로 변환 시도
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
    .replace(/효율/g, 'efficient')
    .replace(/주택/g, 'house')
    .replace(/담보/g, 'mortgage')
    .replace(/대출/g, 'loan')
    .replace(/현명/g, 'smart')
    .replace(/활용/g, 'utilization')
    .replace(/가격/g, 'price')
    .replace(/시장/g, 'market')
    .replace(/저금리/g, 'low-interest')
    .replace(/부동산/g, 'realestate')
    .replace(/하락기/g, 'downturn')
    .replace(/대응/g, 'response')
    .replace(/상승/g, 'rise')
    .replace(/변동성/g, 'volatility')
    .replace(/장기/g, 'long-term')
    .replace(/단기/g, 'short-term');
  
  // 슬러그 생성
  const slug = slugify(englishTitle, {
    lower: true,
    strict: true,
  });
  
  return slug || 'expert-blog-post';
}

// 파일 이름 생성
function createFileName(title) {
  const date = getCurrentDate();
  const slug = createSlug(title);
  return `${date}-${slug}.md`;
}

// 디렉토리 확인/생성
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Fetch API로 OpenAI API 호출
async function generateExpertBlogPost(topic) {
  console.log(`주제 "${topic}"에 대한 전문가 수준의 블로그 글을 생성하고 있습니다...`);
  
  const prompt = `
당신은 최고 수준의 금융/투자 전문가로서, 복잡한 금융 개념을 명확하게 설명하고 정확한 데이터와 출처를 바탕으로 분석을 제공합니다.
다음 주제에 대해 깊이 있고 전문적인 블로그 글을 작성해 주세요:

주제: ${topic}

작성 시 다음 요구사항을 반드시 준수해 주세요:

1. 형식: 다음 마크다운 형식으로 정확히 시작해 주세요:
---
title: "${topic}"
date: "${getCurrentDate()}"
description: "(주제에 맞는 SEO 최적화된 설명 - 50~160자 사이)"
tags: ["(주제 관련 태그 5개)"]
---

2. 콘텐츠 요구사항:
   - 글 길이: 1,500~2,000자 내외로 작성
   - 최신 데이터와 통계 포함 (정확한 출처 인용, 가능한 2023-2025년 데이터)
   - 금융/투자 전문가 수준의 깊이 있는 분석과 인사이트
   - 실제 사례와 구체적인 예시 포함
   - 초보자도 이해할 수 있지만 전문적 지식도 담아낼 것
   - 다양한 견해와 관점 제시 (균형 잡힌 시각)
   - 구체적인 실행 전략과 단계별 조언 제공

3. 구조:
   - 인상적인 도입부와 결론
   - 주요 섹션 3-4개로 나누어 작성
   - 각 섹션에는 소제목(H2)과 필요시 하위 제목(H3) 포함
   - <!-- AD_PLACE_1 --> 태그를 도입부 다음에 배치
   - <!-- AD_PLACE_2 --> 태그를 본문 중간에 배치

4. 전문성 표현:
   - 금융 분야 전문 용어 적절히 사용
   - 국내외 금융 기관이나 전문가 견해 인용 (최신 보고서 참조)
   - 통계와 데이터는 정확한 출처와 함께 제시 (한국은행, 통계청, 금융감독원 등)
   - 그래프/표 형태로 표현할 수 있는 데이터 설명 (마크다운 형식)
   - 다양한 투자 관점 비교 분석 (장단점, 리스크 고려)

5. 확실한 SEO 최적화:
   - 주요 키워드 자연스럽게 포함
   - 독자의 검색 의도에 맞는 내용 구성
   - 명확한 메타 설명과 태그 설정

6. 결론:
   - 핵심 내용 요약
   - 독자를 위한 실질적인 다음 단계 제안
   - 추가 학습 자료나 참고 리소스 추천

작성 시 전문가적 통찰과 정확한 데이터를 기반으로 작성하되, 독자가 실제 활용할 수 있는 정보를 제공하는 것이 중요합니다.
`;

  try {
    console.log("OpenAI API에 요청을 보내는 중...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: '당신은 한국의 금융 및 투자 분야의 최고 전문가입니다. 복잡한 금융 개념을 명확히 설명하고, 정확한 통계와 출처를 기반으로 신뢰할 수 있는 정보를 제공합니다. 최신 경제 동향과 투자 전략에 정통하며, 전문가적 통찰과 실질적인 조언을 제공합니다.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      })
    });
    
    // API 응답 상태 코드 확인
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 오류:", response.status, errorText);
      throw new Error(`API 요청 실패: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log("OpenAI API 응답 수신 완료!");
    
    // 응답 데이터 검증
    if (!data.choices || data.choices.length === 0) {
      console.error("API 응답에 선택지가 없습니다:", JSON.stringify(data));
      throw new Error("API 응답에 유효한 콘텐츠가 없습니다");
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("블로그 글 생성 중 오류 발생:", error);
    throw error;
  }
}

// 블로그 글 저장
function saveBlogPost(content, topic) {
  const fileName = createFileName(topic);
  const postsDir = path.join(__dirname, '..', 'src', 'posts');
  ensureDirectoryExists(postsDir);
  
  const filePath = path.join(postsDir, fileName);
  
  // 파일 존재 확인
  if (fs.existsSync(filePath)) {
    console.log(`경고: 파일 ${fileName}이(가) 이미 존재합니다. 덮어쓰지 않습니다.`);
    return false;
  }
  
  // 파일 저장
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`성공: 전문가 블로그 글이 ${filePath}에 저장되었습니다.`);
  return true;
}

// 메인 함수
async function main() {
  // 명령행 인수에서 주제 가져오기
  const topic = process.argv[2];
  
  if (!topic || topic.trim() === '') {
    console.log('사용법: node expert-post.js "블로그 글 주제"');
    process.exit(1);
  }
  
  try {
    console.log("==========================================================");
    console.log(`주제: "${topic}"`);
    console.log("모델: " + MODEL);
    console.log("==========================================================");
    
    // 블로그 글 생성
    console.log("1. OpenAI API를 통해 전문가 수준의 블로그 글 생성을 시작합니다...");
    const blogContent = await generateExpertBlogPost(topic);
    console.log("2. 전문가 블로그 글 생성 완료!");
    
    // 생성된 콘텐츠 미리보기 출력
    console.log("\n--- 생성된 콘텐츠 미리보기 (처음 300자) ---");
    console.log(blogContent.substring(0, 300) + "...");
    console.log("--- 미리보기 끝 ---\n");
    
    // 파일 저장
    console.log("3. 파일 저장 시작...");
    const saved = saveBlogPost(blogContent, topic);
    
    if (saved) {
      console.log("4. 프로세스 완료: 전문가 블로그 글이 성공적으로 생성되고 저장되었습니다!");
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