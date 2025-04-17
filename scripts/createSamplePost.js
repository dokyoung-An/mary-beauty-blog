#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

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
    // 간단한 한글->영문 변환 예시 (실제로는 더 복잡하게 구현해야 함)
    const englishTitle = title
      .replace(/소액/g, 'small-amount')
      .replace(/투자/g, 'investment')
      .replace(/전략/g, 'strategy')
      .replace(/분산/g, 'diversification')
      .replace(/시작/g, 'start');
    
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

// 샘플 블로그 글 생성
function generateSamplePost(topic) {
  const date = getCurrentDate();
  
  return `---
title: "${topic}"
date: "${date}"
description: "${topic}에 대한 상세 가이드"
tags: ["투자", "재테크", "금융", "초보자"]
---

# ${topic}

<!-- AD_PLACE_1 -->

## 왜 ${topic}이 중요한가?

금융 시장이 복잡해지는 요즘, 효율적인 투자 전략은 필수입니다. 특히 ${topic}은 초보 투자자들에게 매우 중요한 개념입니다.

### 주요 포인트

1. 리스크 관리의 중요성
2. 장기적 관점에서의 투자
3. 정기적인 포트폴리오 리밸런싱

## 실전 전략

<!-- AD_PLACE_2 -->

### 초보자를 위한 팁

- 소액으로 시작하세요
- 꾸준함이 중요합니다
- 감정적 결정을 피하세요

## 결론

${topic}은 성공적인 투자의 핵심입니다. 오늘부터 실천해보세요!`;
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
function main() {
  try {
    // 명령행 인수에서 주제 가져오기
    let topic = process.argv[2];
    
    if (!topic) {
      topic = "소액으로 시작하는 분산 투자 전략";
    }
    
    console.log(`주제 "${topic}"에 대한 샘플 블로그 글을 생성하고 있습니다...`);
    
    // 블로그 글 생성
    const blogContent = generateSamplePost(topic);
    
    // 생성된 글 저장
    saveBlogPost(blogContent, topic);
    
  } catch (error) {
    console.error('오류가 발생했습니다:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 