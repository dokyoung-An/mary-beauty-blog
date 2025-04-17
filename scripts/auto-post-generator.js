#!/usr/bin/env node
/**
 * 자동 블로그 포스트 생성기
 * 
 * 이 스크립트는 다음을 수행합니다:
 * 1. OpenAI API를 사용하여 블로그 포스트 내용 생성
 * 2. DALL-E를 사용하여 관련 이미지 생성
 * 3. 마크다운 형식으로 블로그 포스트 저장
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import slugify from 'slugify';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 현재 스크립트 위치 기반으로 디렉토리 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_DIR = path.join(__dirname, '../src/posts');
const IMAGES_DIR = path.join(__dirname, '../public/images');

// 필요한 디렉토리가 없으면 생성
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// OpenAI API 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 토픽 목록 (자동 생성할 블로그 주제)
const TOPICS = [
  '중년 여성을 위한 효과적인 다이어트 방법',
  '50대를 위한 피부 관리 비법',
  '중년에 시작하는 운동, 어떤 것이 좋을까?',
  '갱년기 증상 완화를 위한 자연 요법',
  '노화방지 식품 톱 10',
  '쉽게 따라할 수 있는 주름 관리 마사지',
  '중년 여성을 위한 건강한 식단 계획',
  '기미와 잡티 관리하는 법',
  '미세먼지로부터 피부 보호하는 방법',
  '탈모 예방 및 관리 비법'
];

/**
 * 블로그 포스트 내용 생성 함수
 * @param {string} topic 블로그 주제
 * @returns {Promise<Object>} 생성된 내용 객체
 */
async function generatePostContent(topic) {
  console.log(`"${topic}" 주제로 블로그 포스트 생성 중...`);
  
  const prompt = `
    당신은 중년 여성을 위한 건강과 뷰티에 관한 전문가입니다. 
    "${topic}"에 관한 전문적이고 유익한 블로그 포스트를 작성해주세요.
    
    포스트는 다음 구조를 따라야 합니다:
    - 소개: 주제에 대한 간단한 소개와 글의 목적
    - 본문: 다양한 섹션으로 구성된 상세한 정보 (최소 5개 섹션)
    - 결론: 요약 및 실천 권장사항
    
    중년 여성(50-70대)들이 쉽게 이해하고 따라 할 수 있도록 작성해주세요.
    각 섹션마다 구체적인 팁이나 방법을 포함해야 합니다.
    한국어로 작성해주세요.
    
    응답은 마크다운 형식으로 제공해주세요. 단, frontmatter는 제외하고 본문 내용만 작성해주세요.
    이미지 삽입 위치는 <!-- IMAGE_1 -->, <!-- IMAGE_2 --> 등의 형식으로 표시해주세요.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 중년 여성을 위한 건강과 뷰티 분야의 전문가입니다. 복잡한 개념을 명확하고 간결하게 설명할 수 있습니다." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    const content = response.choices[0].message.content.trim();
    
    // 태그 추출 (키워드 기반)
    const keywordSets = {
      '다이어트': ['다이어트', '체중', '살빼기', '체중관리', '비만'],
      '피부관리': ['피부', '주름', '미용', '안티에이징', '스킨케어'],
      '건강': ['건강', '영양', '면역', '질병', '예방'],
      '운동': ['운동', '요가', '필라테스', '스트레칭', '걷기'],
      '식단': ['식단', '음식', '영양소', '건강식', '식이'],
      '미용': ['미용', '화장품', '메이크업', '헤어', '네일'],
      '정신건강': ['스트레스', '명상', '힐링', '정신건강', '우울']
    };
    
    const tags = [];
    for (const [category, keywords] of Object.entries(keywordSets)) {
      for (const keyword of keywords) {
        if (content.includes(keyword) || topic.includes(keyword)) {
          tags.push(category);
          break;
        }
      }
    }
    
    // 제목과 설명 생성
    const title = topic;
    const description = `${topic}에 관한 전문적인 가이드. 최신 정보와 실천 가능한 팁을 담았습니다.`;
    
    return {
      title,
      description,
      content,
      tags: [...new Set(tags)], // 중복 제거
    };
  } catch (error) {
    console.error('포스트 생성 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 이미지 생성 함수
 * @param {string} prompt 이미지 생성 프롬프트
 * @param {string} filename 저장할 파일 이름
 * @returns {Promise<string>} 생성된 이미지 경로
 */
async function generateImage(prompt, filename) {
  try {
    console.log(`이미지 생성 중: ${prompt}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json"
    });
    
    // 응답에서 base64 이미지 데이터 추출
    const imageData = response.data[0].b64_json;
    if (!imageData) {
      throw new Error('이미지 데이터가 없습니다.');
    }
    
    // 이미지 저장
    const imagePath = path.join(IMAGES_DIR, `${filename}.png`);
    fs.writeFileSync(imagePath, Buffer.from(imageData, 'base64'));
    
    // 상대 경로 반환
    return `/images/${filename}.png`;
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return null;
  }
}

/**
 * 블로그 포스트에 필요한 이미지들 생성
 * @param {string} title 포스트 제목
 * @param {Array<string>} tags 포스트 태그
 * @returns {Promise<Array<string>>} 생성된 이미지 경로 배열
 */
async function generateImagesForPost(title, tags) {
  const tagString = tags.join(', ');
  const baseSlug = slugify(title, { lower: true, strict: true }).substring(0, 30);
  const timestamp = Date.now();
  
  // 3개의 이미지 생성
  const imagePrompts = [
    `${title}에 관한 메인 이미지. 50-60대 한국 여성을 대상으로 한 밝고 긍정적인 분위기의 사실적 이미지. 태그: ${tagString}. 텍스트는 포함하지 마세요.`,
    `${title}과 관련된 구체적인 활동이나 방법을 보여주는 이미지. 한국인 중년 여성에게 적합한 모습. 태그: ${tagString}. 텍스트는 포함하지 마세요.`,
    `${title}의 효과나 결과를 시각화한 이미지. 50-60대 한국 여성에게 적합한 모습. 태그: ${tagString}. 텍스트는 포함하지 마세요.`
  ];
  
  const imagePaths = [];
  
  for (let i = 0; i < imagePrompts.length; i++) {
    const filename = `${baseSlug}-img${i+1}-${timestamp}`;
    const imagePath = await generateImage(imagePrompts[i], filename);
    if (imagePath) {
      imagePaths.push(imagePath);
    }
  }
  
  return imagePaths;
}

/**
 * 블로그 포스트 저장 함수
 * @param {Object} postData 포스트 데이터
 * @param {Array<string>} imagePaths 이미지 경로 배열
 */
function savePost(postData, imagePaths) {
  const { title, description, content, tags } = postData;
  
  // 현재 날짜 (YYYY-MM-DD 형식)
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  // 파일명 생성
  const slug = slugify(title, { lower: true, strict: true });
  const filename = `${dateStr}-${slug}.md`;
  const filepath = path.join(POSTS_DIR, filename);
  
  // 이미지 태그 교체
  let processedContent = content;
  imagePaths.forEach((path, index) => {
    const placeholder = `<!-- IMAGE_${index + 1} -->`;
    const imageMarkdown = `\n![${title} 관련 이미지 ${index + 1}](${path})\n`;
    processedContent = processedContent.replace(placeholder, imageMarkdown);
  });
  
  // 메인 이미지가 없거나 첫 번째 이미지 태그가 교체되지 않았다면 본문 시작 부분에 추가
  if (imagePaths.length > 0 && !processedContent.includes(imagePaths[0])) {
    const lines = processedContent.split('\n');
    // 첫 번째 제목 다음에 이미지 삽입
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        lines.splice(i + 1, 0, '', `![${title} 메인 이미지](${imagePaths[0]})`, '');
        break;
      }
    }
    processedContent = lines.join('\n');
  }
  
  // frontmatter 생성
  const frontmatter = `---
title: '${title}'
description: '${description}'
date: '${dateStr}'
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
image: '${imagePaths.length > 0 ? imagePaths[0] : ''}'
---

`;
  
  // 최종 콘텐츠 생성 및 저장
  const finalContent = frontmatter + processedContent;
  fs.writeFileSync(filepath, finalContent);
  
  console.log(`포스트가 성공적으로 저장되었습니다: ${filepath}`);
}

/**
 * 메인 함수 - 스크립트 실행
 */
async function main() {
  try {
    // 테스트 모드 확인 (--test 인자가 있는 경우)
    const isTestMode = process.argv.includes('--test');
    
    // 랜덤 토픽 선택
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    const selectedTopic = TOPICS[randomIndex];
    
    // 블로그 포스트 내용 생성
    const postData = await generatePostContent(selectedTopic);
    
    // 테스트 모드인 경우 이미지 생성 건너뛰기
    let imagePaths = [];
    if (!isTestMode) {
      // 블로그 포스트 이미지 생성
      imagePaths = await generateImagesForPost(postData.title, postData.tags);
    }
    
    // 블로그 포스트 저장
    savePost(postData, imagePaths);
    
    console.log('블로그 포스트 생성 완료!');
    return 0;
  } catch (error) {
    console.error('오류 발생:', error);
    return 1;
  }
}

// 스크립트가 직접 실행된 경우 메인 함수 호출
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(exitCode => {
    process.exit(exitCode);
  });
}

export { generatePostContent, generateImagesForPost, savePost, main }; 