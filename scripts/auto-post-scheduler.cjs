const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { execSync } = require('child_process');
const schedule = require('node-schedule');

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
  }
];

// 디렉토리 경로 설정
const postsDir = path.join(__dirname, '../src/posts');
const imagesDir = path.join(__dirname, '../public/images/posts');

// 디렉토리가 없으면 생성
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
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

// 이미지 생성 함수
function createImage(title, slug) {
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
}

// 포스트 내용 생성 (예시 콘텐츠)
function generatePostContent(topic) {
  return `# ${topic.title}

중년기에 접어들면 신체적 변화와 함께 영양소 요구량의 변화도 찾아옵니다. 이 시기에는 건강한 생활 습관을 통해 활력을 유지하고 만성질환 위험을 줄이는 것이 중요합니다.

## 첫 번째 핵심 포인트

<!-- AD_PLACE_1 -->

중년기에는 신체 변화에 따른 적절한 관리가 필수적입니다. 꾸준한 관리와 올바른 정보를 통해 건강한 중년을 보낼 수 있습니다.

- 첫 번째 팁을 실천해 보세요.
- 두 번째 팁은 일상에서 쉽게 적용할 수 있습니다.
- 세 번째 팁은 장기적인 건강에 도움이 됩니다.

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

// 포스트 생성 함수
function createPost() {
  // 랜덤 토픽 선택
  const randomIndex = Math.floor(Math.random() * postTopics.length);
  const topic = postTopics[randomIndex];
  
  // 날짜 포맷팅
  const formattedDate = getFormattedDate();
  
  // 파일명 설정
  const postFileName = `${formattedDate}-${topic.slug}.md`;
  const postFilePath = path.join(postsDir, postFileName);
  
  // 이미지 생성
  const imagePath = createImage(topic.title, topic.slug);
  
  // 포스트 frontmatter 생성
  const frontmatter = `---
title: '${topic.title}'
description: '${topic.description}'
date: '${formattedDate}'
tags: [${topic.tags.map(tag => `'${tag}'`).join(', ')}]
image: '${imagePath}'
---`;

  // 포스트 내용 생성
  const postContent = `${frontmatter}

${generatePostContent(topic)}`;

  // 파일에 포스트 내용 작성
  fs.writeFileSync(postFilePath, postContent);
  console.log(`포스트가 생성되었습니다: ${postFilePath}`);
  
  // 운영체제에 따라 개발 서버 재시작 (선택적)
  try {
    console.log('개발 서버를 재시작합니다...');
    // 실제 환경에서는 이 부분을 적절히 수정하세요
    // execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('서버 재시작 중 오류 발생:', error);
  }
  
  return {
    title: topic.title,
    path: postFilePath,
    imagePath: imagePath
  };
}

// 즉시 한 번 실행
console.log('첫 번째 포스트를 생성합니다...');
const result = createPost();
console.log(`포스트 "${result.title}" 생성 완료`);

// 3시간마다 스케줄링
console.log('3시간마다 새 포스트를 자동 생성하도록 스케줄링합니다...');
const job = schedule.scheduleJob('0 */3 * * *', function() {
  console.log(`스케줄된 시간에 도달했습니다: ${new Date().toLocaleString()}`);
  const result = createPost();
  console.log(`자동 생성된 포스트: "${result.title}"`);
});

console.log(`다음 포스트 생성 예정 시간: ${job.nextInvocation().toLocaleString()}`);
console.log('포스트 자동 생성 스케줄러가 시작되었습니다. 종료하려면 Ctrl+C를 누르세요.');

// 프로세스 종료 처리
process.on('SIGINT', function() {
  console.log('포스트 자동 생성 스케줄러를 종료합니다...');
  job.cancel();
  process.exit(0);
}); 