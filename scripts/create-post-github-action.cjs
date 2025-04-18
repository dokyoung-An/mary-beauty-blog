const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { OpenAI } = require('openai');
const { execSync } = require('child_process');

// OpenAI API 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 환경 변수 확인 및 로깅
console.log('GitHub Actions에서 실행 중입니다...');
console.log(`SITE_URL: ${process.env.PUBLIC_SITE_URL || 'http://localhost:4321'}`);
console.log(`SITE_NAME: ${process.env.PUBLIC_SITE_NAME || '메리의 미수다'}`);
console.log(`OPENAI_API_KEY가 설정되었는지 확인: ${process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음'}`);

// 게시물 저장 경로
const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');

// 이미지 저장 경로
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'posts');

// 현재 날짜 정보
const now = new Date();
const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

// 다양한 주제와 키워드 세트 정의
const contentTopics = [
  {
    category: '건강',
    topics: [
      {
        title: '중년 여성을 위한 맞춤형 영양 가이드: 50대에 꼭 필요한 영양소',
        description: '50대 여성의 건강 유지를 위한 필수 영양소와 식품 선택 가이드, 영양 결핍 예방법을 알아봅니다.',
        tags: ['건강', '영양', '50대여성', '폐경기건강', '식이요법'],
        keywords: ['50대 여성 영양소', '폐경기 식단', '중년 여성 건강 식품', '골다공증 예방 식품', '갱년기 영양 관리'],
        slug: 'nutrition-guide-for-50s-women'
      },
      {
        title: '갱년기 증상 완화를 위한 자연요법: 40대 후반 여성의 호르몬 균형 찾기',
        description: '호르몬 변화로 인한 불편함을 자연적인 방법으로 완화하는 방법, 식이 요법, 생활 습관 개선책을 소개합니다.',
        tags: ['건강', '갱년기', '호르몬', '자연요법', '중년여성'],
        keywords: ['갱년기 증상 완화', '자연 호르몬 조절', '40대 여성 건강', '갱년기 자연요법', '호르몬 균형 식품'],
        slug: 'natural-remedies-menopause-symptoms'
      },
      {
        title: '중년 여성의 관절 건강: 40대부터 시작하는 관절 보호 운동과 영양',
        description: '관절 건강을 유지하기 위한 맞춤형 저강도 운동과 관절 강화 영양소, 일상 생활 속 관절 보호 수칙을 알아봅니다.',
        tags: ['건강', '관절', '운동', '중년여성', '골관절염예방'],
        keywords: ['40대 관절 건강', '무릎 관절 보호 운동', '중년 여성 관절염 예방', '관절에 좋은 음식', '퇴행성 관절염 예방'],
        slug: 'joint-health-for-middle-aged-women'
      }
    ]
  },
  {
    category: '뷰티',
    topics: [
      {
        title: '40대 이후 피부를 위한 안티에이징 스킨케어 루틴: 단계별 가이드',
        description: '중년 여성의 피부 변화에 맞춘 효과적인 스킨케어 단계와 꼭 필요한 성분, 연령대별 제품 선택 방법을 소개합니다.',
        tags: ['뷰티', '스킨케어', '안티에이징', '중년여성', '피부관리'],
        keywords: ['40대 스킨케어 루틴', '중년 안티에이징', '성숙 피부 관리', '레티놀 사용법', '피부 탄력 개선'],
        slug: 'anti-aging-skincare-routine-40plus'
      },
      {
        title: '중년 여성의 염색과 헤어 케어: 새치 커버와 모발 건강 동시에 지키는 방법',
        description: '건강한 모발을 유지하면서 새치를 자연스럽게 커버하는 방법, 염색 후 손상된 모발 관리법, 염색 주기에 대해 알아봅니다.',
        tags: ['뷰티', '헤어케어', '염색', '모발건강', '새치관리'],
        keywords: ['새치 염색 방법', '모발 손상 최소화 염색', '중년 여성 헤어 케어', '염색 후 관리', '저자극 새치 커버'],
        slug: 'hair-coloring-care-middle-aged-women'
      },
      {
        title: '50대 메이크업 가이드: 자연스러운 화장법과 피해야 할 실수',
        description: '성숙한 피부를 돋보이게 하는 메이크업 테크닉과 도구 선택법, 피해야 할 일반적인 메이크업 실수를 정리했습니다.',
        tags: ['뷰티', '메이크업', '50대여성', '화장법', '파운데이션'],
        keywords: ['50대 메이크업 방법', '성숙 피부 화장법', '자연스러운 메이크업', '중년 여성 파운데이션', '처진 눈매 메이크업'],
        slug: 'makeup-guide-for-50s-women'
      }
    ]
  },
  {
    category: '라이프스타일',
    topics: [
      {
        title: '중년 여성의 스트레스 관리: 번아웃 예방을 위한 실용적인 방법',
        description: '가정과 직장에서의 스트레스를 효과적으로 관리하는 방법, 자가 회복 테크닉, 번아웃 징후와 대처법을 알아봅니다.',
        tags: ['라이프스타일', '멘탈케어', '스트레스관리', '중년여성', '번아웃'],
        keywords: ['중년 스트레스 관리', '번아웃 예방법', '직장 스트레스 대처', '명상법', '자기 돌봄 방법'],
        slug: 'stress-management-for-middle-aged-women'
      },
      {
        title: '45+ 여성을 위한 미니멀 라이프: 물건 줄이고 행복 더하는 정리 방법',
        description: '중년 이후 삶의 질을 높이는 미니멀 라이프 접근법, 단계별 정리 방법, 불필요한 소유물을 줄이는 심리적 전략을 소개합니다.',
        tags: ['라이프스타일', '미니멀라이프', '정리수납', '중년여성', '시니어라이프'],
        keywords: ['미니멀 라이프 시작법', '중년 여성 정리법', '불필요한 물건 정리', '심플라이프', '물건 줄이기 팁'],
        slug: 'minimal-life-for-45plus-women'
      },
      {
        title: '40대 이후 여성의 자기 성장: 늦은 나이에 시작하는 새로운 취미와 배움',
        description: '중년 이후 삶을 풍요롭게 하는 취미 활동과 배움의 기회, 실제 사례와 시작하는 방법에 대해 알아봅니다.',
        tags: ['라이프스타일', '자기계발', '중년여성', '취미생활', '평생교육'],
        keywords: ['중년 여성 취미', '40대 새로운 시작', '늦은 나이 배움', '성인 교육 프로그램', '자기 성장 방법'],
        slug: 'self-growth-for-40plus-women'
      }
    ]
  },
  {
    category: '피트니스',
    topics: [
      {
        title: '중년 여성을 위한 저충격 유산소 운동: 관절 부담 없이 체중 관리하기',
        description: '40대 이상 여성에게 적합한 관절 부담이 적은 유산소 운동법, 효과적인 운동 시간과 강도, 자세한 운동 계획을 제공합니다.',
        tags: ['피트니스', '운동', '유산소', '중년여성', '체중관리'],
        keywords: ['중년 여성 유산소 운동', '관절 부담 없는 운동', '걷기 운동 효과', '수영 효능', '저충격 유산소 운동 종류'],
        slug: 'low-impact-cardio-for-middle-aged-women'
      },
      {
        title: '50대 근력 운동 가이드: 쉽게 따라할 수 있는 홈 트레이닝 루틴',
        description: '근육량 유지와 근력 강화를 위한 맞춤형 홈 트레이닝 방법, 필요한 장비와 점진적 강도 높이기 전략을 소개합니다.',
        tags: ['피트니스', '근력운동', '홈트레이닝', '50대여성', '근감소증예방'],
        keywords: ['50대 근력 운동', '홈 트레이닝 방법', '중년 여성 근육 유지', '덤벨 운동 루틴', '근감소증 예방 운동'],
        slug: 'strength-training-guide-for-50s-women'
      },
      {
        title: '중년 여성의 자세 교정: 거북목과 골반 불균형 개선을 위한 스트레칭',
        description: '오랜 좌식 생활과 스마트폰 사용으로 인한 자세 불균형을 개선하는 스트레칭과 교정 운동법을 단계별로 알아봅니다.',
        tags: ['피트니스', '자세교정', '스트레칭', '중년여성', '거북목'],
        keywords: ['중년 여성 자세 교정', '거북목 스트레칭', '골반 불균형 교정', '일자목 개선 운동', '바른 자세 만들기'],
        slug: 'posture-correction-for-middle-aged-women'
      }
    ]
  }
];

// 포스팅 생성 함수
function createPost() {
  // posts 디렉토리가 없으면 생성
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
  
  // 이미지 디렉토리가 없으면 생성
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  // 랜덤하게 카테고리 선택
  const randomCategoryIndex = Math.floor(Math.random() * contentTopics.length);
  const selectedCategory = contentTopics[randomCategoryIndex];
  
  // 선택된 카테고리에서 랜덤하게 주제 선택
  const randomTopicIndex = Math.floor(Math.random() * selectedCategory.topics.length);
  const selectedTopic = selectedCategory.topics[randomTopicIndex];
  
  const { title, description, tags, keywords, slug } = selectedTopic;
  
  // 파일명 생성 (날짜-슬러그.md)
  const fileName = `${formattedDate}-${slug}.md`;
  const filePath = path.join(POSTS_DIR, fileName);
  
  // 이미지 파일명
  const imageFileName = `${slug}.jpg`;
  const imagePath = path.join(IMAGES_DIR, imageFileName);
  
  // 이미지가 없는 경우 랜덤 이미지 다운로드
  if (!fs.existsSync(imagePath)) {
    try {
      // Picsum Photos에서 랜덤 이미지 다운로드
      const randomId = Math.floor(Math.random() * 1000);
      execSync(`curl -o "${imagePath}" "https://picsum.photos/id/${randomId}/800/400"`, { stdio: 'ignore' });
      console.log(`이미지 다운로드 완료: ${imageFileName}`);
    } catch (error) {
      console.error('이미지 다운로드 실패:', error.message);
      // 기본 이미지 사용
    }
  }
  
  // 포스트 내용 생성
  const keywordsString = keywords.join(', ');
  
  // SEO 최적화된 마크다운 포스트 생성
  const postContent = `---
title: "${title}"
description: "${description}"
date: "${formattedDate}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
image: "/images/posts/${imageFileName}"
keywords: [${keywords.map(keyword => `"${keyword}"`).join(', ')}]
---

# ${title}

${description} 이 글에서는 ${keywords[0]}와(과) ${keywords[1]}에 대한 실용적인 정보를 공유합니다.

## 왜 ${keywords[0]}이(가) 중요한가?

중년 여성에게 ${keywords[0]}은(는) 단순한 선택이 아닌 필수적인 요소입니다. 나이가 들수록 ${selectedCategory.category.toLowerCase()}에 대한 접근 방식을 재고하고 자신의 상황에 맞는 전략을 세우는 것이 중요합니다.

### ${keywords[0]}의 주요 이점

- 신체적, 정신적 건강 개선
- 자신감과 삶의 질 향상
- 나이 관련 문제의 예방 및 관리
- 일상생활의 에너지와 활력 증가
- 장기적인 건강 문제 예방

## ${keywords[1]} 시작하기: 초보자를 위한 가이드

${keywords[1]}을(를) 처음 시작하는 분들을 위해 단계별 접근법을 소개합니다.

### 1. 기초부터 시작하기

처음에는 무리하지 말고 기본적인 것부터 시작하세요. 작은 변화와 일관성이 중요합니다.

### 2. 전문가의 조언 구하기

가능하다면 ${selectedCategory.category.toLowerCase()} 전문가의 조언을 구하는 것이 좋습니다. 개인 상담을 통해 자신에게 맞는 맞춤형 접근법을 찾을 수 있습니다.

### 3. 지속적인 학습과 적응

${keywords[1]}은(는) 계속해서 발전하고 있으므로, 최신 정보를 학습하고 자신의 방식을 업데이트하는 것이 중요합니다.

## 중년 여성을 위한 ${keywords[2]} 팁

### 일상생활에 통합하기

${keywords[2]}을(를) 일상생활에 쉽게 통합할 수 있는 방법을 찾아보세요. 예를 들어:

1. 아침 루틴에 ${keywords[2]} 관련 활동 포함하기
2. 주간 계획을 세우고 작은 목표 설정하기
3. 가족이나 친구와 함께하여 동기부여 받기

### 자주 하는 실수 피하기

${keywords[2]}에 관한 일반적인 오해와 실수를 알아보고 이를 피하는 방법을 알아봅니다.

## ${keywords[3]}의 실제 사례

실제로 ${keywords[3]}을(를) 통해 변화를 경험한 중년 여성들의 사례를 통해 실질적인 통찰력을 얻을 수 있습니다.

### 사례 1: 45세 직장인 김미경 씨

김미경 씨는 ${keywords[3]}을(를) 일상에 도입한 후 6개월 만에 눈에 띄는 변화를 경험했습니다. 그녀의 사례에서 배울 수 있는 핵심 포인트는:

- 꾸준함의 중요성
- 작은 성공의 축하
- 유연한 접근 방식

## 결론: ${keywords[4]}로 더 건강한 중년 시작하기

${keywords[4]}은(는) 중년 여성의 삶을 크게 향상시킬 수 있는 중요한 요소입니다. 오늘부터 작은 변화를 시작하여 장기적인 혜택을 누리세요.

이 글이 ${keywords[0]}와(과) ${keywords[1]}에 대한 이해를 높이는 데 도움이 되었길 바랍니다. 다음 글에서는 ${selectedCategory.category}의 또 다른 중요한 측면에 대해 자세히 알아보겠습니다.
`;

  // 파일 작성
  fs.writeFileSync(filePath, postContent);
  
  console.log(`포스트 생성 완료: ${fileName}`);
  console.log(`제목: ${title}`);
  console.log(`키워드: ${keywordsString}`);
  
  return { fileName, title, description };
}

// 메인 함수 실행
try {
  const result = createPost();
  
  // GitHub Actions에서 출력
  console.log(`::set-output name=post_file::${result.fileName}`);
  console.log(`::set-output name=post_title::${result.title}`);
} catch (error) {
  console.error('포스트 생성 중 오류 발생:', error);
  process.exit(1);
} 