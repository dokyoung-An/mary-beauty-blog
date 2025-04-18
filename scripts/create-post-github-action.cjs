const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { OpenAI } = require('openai');

// OpenAI API 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 환경 변수 확인 및 로깅
console.log('GitHub Actions에서 실행 중입니다...');
console.log(`SITE_URL: ${process.env.PUBLIC_SITE_URL || 'http://localhost:4321'}`);
console.log(`SITE_NAME: ${process.env.PUBLIC_SITE_NAME || '메리의 미수다'}`);
console.log(`OPENAI_API_KEY가 설정되었는지 확인: ${process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음'}`);

// 포스트 주제 목록
const postTopics = [
  {
    slug: 'healthy-diet-habits',
    title: '중년 여성을 위한 건강한 식습관',
    description: '중년 여성의 건강을 위한 균형 잡힌 식단과 식습관 가이드',
    tags: ['건강', '식단', '다이어트']
  },
  {
    slug: 'skincare-after-40', 
    title: '40대 이후 피부 관리의 핵심',
    description: '나이가 들어도 건강하고 아름다운 피부를 유지하는 방법',
    tags: ['뷰티', '스킨케어', '안티에이징']
  },
  {
    slug: 'menopause-management',
    title: '폐경기 관리와 대처 방법',
    description: '폐경기 증상 완화와 건강한 삶을 위한 종합 가이드',
    tags: ['건강', '폐경기', '호르몬']
  },
  {
    slug: 'stress-reduction-techniques',
    title: '중년 여성을 위한 스트레스 관리법',
    description: '일상에서 실천할 수 있는 효과적인 스트레스 해소 방법',
    tags: ['정신건강', '스트레스', '명상']
  },
  {
    slug: 'bone-health-improvement',
    title: '뼈 건강을 지키는 생활 습관',
    description: '골다공증 예방과 뼈 건강 향상을 위한 식이요법과 운동법',
    tags: ['건강', '골다공증', '운동']
  },
  {
    slug: 'healthy-lifestyle-habits',
    title: '중년 여성을 위한 건강한 생활 습관',
    description: '중년기에 활력을 유지하고 건강을 증진하는 생활 습관',
    tags: ['건강', '생활습관', '웰빙']
  },
  {
    slug: 'anti-aging-nutrition',
    title: '노화 방지를 위한 영양소와 식품',
    description: '노화 과정을 늦추고 젊음을 유지하는 데 도움이 되는 영양소와 식품',
    tags: ['건강', '영양', '안티에이징']
  },
  {
    slug: 'middle-age-exercise',
    title: '중년을 위한 효과적인 운동법',
    description: '중년기에 맞는 효과적이고 안전한 운동 방법과 루틴',
    tags: ['건강', '운동', '피트니스']
  },
  {
    slug: 'hormonal-balance',
    title: '호르몬 균형을 위한 자연적인 방법',
    description: '중년 여성의 호르몬 균형을 자연적으로 유지하는 방법',
    tags: ['건강', '호르몬', '자연요법']
  },
  {
    slug: 'mind-body-wellness',
    title: '중년 여성의 심신 건강',
    description: '중년기에 신체와 정신의 균형을 유지하는 방법',
    tags: ['건강', '명상', '웰빙']
  }
];

// 디렉토리 경로 설정
const postsDir = path.join(__dirname, '../src/posts');
const imagesDir = path.join(__dirname, '../public/images/posts');

// 디렉토리가 없으면 생성
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
  console.log(`포스트 디렉토리를 생성했습니다: ${postsDir}`);
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`이미지 디렉토리를 생성했습니다: ${imagesDir}`);
}

// 현재 날짜 포맷팅
function getFormattedDate() {
  // 서울 시간대 기준으로 현재 날짜 가져오기
  const now = new Date();
  // UTC+9 (한국 시간) 적용
  const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  
  const year = koreanTime.getUTCFullYear();
  const month = String(koreanTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getUTCDate()).padStart(2, '0');
  
  console.log(`현재 한국 시간: ${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
}

// 이미 사용된 주제 확인 (최근 10개 파일 확인)
function getUsedTopics() {
  try {
    // 디렉토리가 존재하는지 확인
    if (!fs.existsSync(postsDir)) {
      console.log(`${postsDir} 디렉토리가 존재하지 않습니다.`);
      return [];
    }
    
    // 최근 파일 가져오기
    const files = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)) // 최신순 정렬
      .slice(0, 10); // 최근 10개
    
    console.log(`최근 포스트 파일 확인: ${files.length}개 발견`);
    
    // 파일명에서 slug 추출
    return files.map(file => {
      const match = file.match(/\d{4}-\d{2}-\d{2}-(.*?)\.md$/);
      return match ? match[1] : null;
    }).filter(Boolean);
  } catch (error) {
    console.error('최근 주제 확인 중 오류 발생:', error);
    return [];
  }
}

// 이미지 생성 함수
function createImage(title, slug) {
  try {
    // 캔버스 생성 (1200x630은 소셜 미디어에 최적화된 크기)
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    // 배경 색상 설정 (랜덤 파스텔 색상)
    const colors = [
      '#4CAF50', // 초록
      '#2196F3', // 파랑
      '#9C27B0', // 보라
      '#FF9800', // 주황
      '#E91E63'  // 분홍
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = randomColor;
    ctx.fillRect(0, 0, 1200, 630);

    // 텍스트 스타일 설정
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 텍스트 그리기 (여러 줄로 분리)
    const words = title.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 1000 && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine !== '') lines.push(currentLine);

    // 여러 줄 텍스트 그리기
    const lineHeight = 70;
    const startY = 315 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, i) => {
      ctx.fillText(line, 600, startY + i * lineHeight);
    });

    // 파일명 설정 및 저장
    const imageFileName = `${slug}-cover.jpg`;
    const imageFilePath = path.join(imagesDir, imageFileName);
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(imageFilePath, buffer);

    console.log(`이미지가 생성되었습니다: ${imageFilePath}`);
    return `/images/posts/${imageFileName}`;
  } catch (error) {
    console.error('이미지 생성 중 오류 발생:', error);
    // 오류 발생 시 기본 이미지 경로 반환
    return '/images/default-cover.jpg';
  }
}

// DALL-E로 이미지 생성하는 함수 추가
async function generateDallEImage(prompt, slug) {
  try {
    console.log(`DALL-E로 이미지 생성 중: ${prompt}`);
    
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
      return null;
    }
    
    // 이미지 파일명 설정
    const imageFileName = `${slug}-dalle-${Date.now()}.png`;
    const imageFilePath = path.join(imagesDir, imageFileName);
    
    // 이미지 저장
    fs.writeFileSync(imageFilePath, Buffer.from(imageData, 'base64'));
    console.log(`DALL-E 이미지가 생성되었습니다: ${imageFilePath}`);
    
    // 상대 경로 반환
    return `/images/posts/${imageFileName}`;
  } catch (error) {
    console.error('DALL-E 이미지 생성 오류:', error);
    // 오류 발생 시 캔버스로 생성한 이미지 사용
    return createImage(prompt, slug);
  }
}

// 포스트 내용 생성 함수 수정 - 이미지 마커 추가
function generatePostContent(topic) {
  return `# ${topic.title}

중년기에 접어들면 신체적 변화와 함께 영양소 요구량의 변화도 찾아옵니다. 이 시기에는 건강한 생활 습관을 통해 활력을 유지하고 만성질환 위험을 줄이는 것이 중요합니다.

<!-- IMAGE_PLACE_MAIN -->

## 첫 번째 핵심 포인트

<!-- AD_PLACE_1 -->

중년기에는 신체 변화에 따른 적절한 관리가 필수적입니다. 꾸준한 관리와 올바른 정보를 통해 건강한 중년을 보낼 수 있습니다.

- 첫 번째 팁을 실천해 보세요.
- 두 번째 팁은 일상에서 쉽게 적용할 수 있습니다.
- 세 번째 팁은 장기적인 건강에 도움이 됩니다.

<!-- IMAGE_PLACE_1 -->

## 두 번째 핵심 포인트

건강한 중년기를 위해서는 신체뿐만 아니라 정신적 건강도 중요합니다. 스트레스 관리와 충분한 휴식이 필요합니다.

- 규칙적인 생활 패턴을 유지하세요.
- 취미 활동을 통해 스트레스를 해소하세요.
- 가족, 친구와의 관계를 소중히 하세요.

## 세 번째 핵심 포인트

<!-- AD_PLACE_2 -->

전문가들은 중년기에 더욱 신경써야 할 건강 습관들을 강조합니다. 정기적인 건강 검진과 예방적 관리가 중요합니다.

- 정기적인 건강 검진을 받으세요.
- 연령에 맞는 영양소를 섭취하세요.
- 적절한 운동을 꾸준히 하세요.

<!-- IMAGE_PLACE_2 -->

## 네 번째 핵심 포인트

건강한 중년을 위한 생활 습관은 일상에서의 작은 변화로부터 시작됩니다. 점진적으로 개선해 나가는 것이 중요합니다.

- 수분을 충분히 섭취하세요.
- 금연, 절주 등 나쁜 습관을 개선하세요.
- 충분한 수면을 취하세요.

## 요약 및 결론

건강한 중년기는 하루아침에 만들어지는 것이 아닙니다. 꾸준한 관리와 올바른 생활 습관을 통해 활력 있는 중년을 보낼 수 있습니다.

1. 균형 잡힌 식습관과 규칙적인 운동이 기본입니다.
2. 정신 건강 관리도 소홀히 하지 마세요.
3. 정기적인 건강 검진으로 질병을 예방하세요.
4. 작은 습관부터 개선해 나가세요.

건강한 중년을 위한 첫걸음은 바로 오늘 시작됩니다.`;
}

// 포스트 생성 함수 수정 - DALL-E 이미지 생성 추가
async function createPost() {
  try {
    // 최근 사용된 주제 가져오기
    const usedTopics = getUsedTopics();
    console.log(`최근 사용된 주제: ${usedTopics.join(', ')}`);
    
    // 사용 가능한 주제 필터링
    const availableTopics = postTopics.filter(topic => !usedTopics.includes(topic.slug));
    console.log(`사용 가능한 주제 수: ${availableTopics.length}`);
    
    // 사용 가능한 주제가 없으면 모든 주제 사용
    const topics = availableTopics.length > 0 ? availableTopics : postTopics;
    
    // 랜덤 토픽 선택
    const randomIndex = Math.floor(Math.random() * topics.length);
    const topic = topics[randomIndex];
    console.log(`선택된 주제: ${topic.title} (${topic.slug})`);
    
    // 날짜 포맷팅
    const formattedDate = getFormattedDate();
    console.log(`포스트 날짜: ${formattedDate}`);
    
    // 파일명 설정
    const postFileName = `${formattedDate}-${topic.slug}.md`;
    const postFilePath = path.join(postsDir, postFileName);
    
    // 포스트 내용 생성
    let postContent = generatePostContent(topic);
    
    // 커버 이미지 생성 (fallback으로 canvas 사용)
    let coverImage = await createImage(topic.title, topic.slug);
    
    // DALL-E 이미지 생성 (API 키가 있는 경우)
    if (process.env.OPENAI_API_KEY) {
      try {
        // 커버 이미지 생성
        const coverPrompt = `"${topic.title}"에 어울리는 커버 이미지. 한국 중년 여성의 건강과 관련된 밝고 긍정적인 이미지. 키워드: ${topic.tags.join(', ')}. 텍스트 없이, 깨끗하고 전문적인 스타일로 만들어주세요.`;
        const dalleImage = await generateDallEImage(coverPrompt, `${topic.slug}-cover`);
        if (dalleImage) {
          coverImage = dalleImage;
        }
        
        // 첫 번째 추가 이미지
        const prompt1 = `"${topic.title}"에 관련된 실용적인 팁이나 방법을 시각화한 이미지. 한국 중년 여성에게 적합한 건강 관련 이미지. 키워드: ${topic.tags.join(', ')}. 텍스트 없이, 밝고 명확한 스타일로 제작해주세요.`;
        const image1 = await generateDallEImage(prompt1, `${topic.slug}-content1`);
        if (image1) {
          postContent = postContent.replace('<!-- IMAGE_PLACE_1 -->', `\n\n![${topic.title} 관련 이미지](${image1})\n\n`);
        }
        
        // 두 번째 추가 이미지
        const prompt2 = `"${topic.title}"의 효과나 결과를 보여주는 이미지. 한국 중년 여성을 위한 건강한 라이프스타일. 키워드: ${topic.tags.join(', ')}. 텍스트 없이, 고품질 사진 스타일로 만들어주세요.`;
        const image2 = await generateDallEImage(prompt2, `${topic.slug}-content2`);
        if (image2) {
          postContent = postContent.replace('<!-- IMAGE_PLACE_2 -->', `\n\n![${topic.title} 효과 이미지](${image2})\n\n`);
        }
        
        // 메인 이미지
        const mainPrompt = `"${topic.title}"에 대한 메인 개념을 시각화한 이미지. 한국 중년 여성의 건강과 웰빙을 강조. 키워드: ${topic.tags.join(', ')}. 텍스트 없이, 깔끔하고 전문적인 스타일로 만들어주세요.`;
        const mainImage = await generateDallEImage(mainPrompt, `${topic.slug}-main`);
        if (mainImage) {
          postContent = postContent.replace('<!-- IMAGE_PLACE_MAIN -->', `\n\n![${topic.title} 메인 이미지](${mainImage})\n\n`);
        }
      } catch (error) {
        console.error('DALL-E 이미지 생성 중 오류:', error);
        // 오류 발생 시 이미지 마커 제거
        postContent = postContent.replace(/<!-- IMAGE_PLACE_\w+ -->/g, '');
      }
    } else {
      console.log('OpenAI API 키가 설정되지 않아 DALL-E 이미지를 생성하지 않습니다.');
      // 이미지 마커 제거
      postContent = postContent.replace(/<!-- IMAGE_PLACE_\w+ -->/g, '');
    }
    
    // 포스트 frontmatter 생성
    const frontmatter = `---
title: '${topic.title}'
description: '${topic.description}'
date: '${formattedDate}'
tags: [${topic.tags.map(tag => `'${tag}'`).join(', ')}]
image: '${coverImage}'
---`;

    // 최종 포스트 내용 생성
    const finalContent = `${frontmatter}

${postContent}`;

    // 파일에 포스트 내용 작성
    fs.writeFileSync(postFilePath, finalContent);
    console.log(`포스트가 생성되었습니다: ${postFilePath}`);
    
    return {
      title: topic.title,
      path: postFilePath,
      imagePath: coverImage
    };
  } catch (error) {
    console.error('포스트 생성 중 오류 발생:', error);
    throw error; // GitHub Actions에서 오류가 발생하면 워크플로우 실패
  }
}

// 실행 함수를 async로 변경
async function run() {
  try {
    console.log('GitHub Actions에서 새 포스트를 생성합니다...');
    const result = await createPost();
    console.log(`포스트 "${result.title}" 생성 완료`);
  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
    process.exit(1); // 오류 발생 시 종료 코드 1로 종료
  }
}

// 스크립트 실행
run(); 