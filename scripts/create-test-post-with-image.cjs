const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

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
const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

// 파일명 설정
const slug = 'healthy-eating-for-middle-aged-women';
const postFileName = `${formattedDate}-${slug}.md`;
const postFilePath = path.join(postsDir, postFileName);
const imageFileName = `${slug}-cover.jpg`;
const imageFilePath = path.join(imagesDir, imageFileName);

// 이미지 생성 함수
function createImage(title) {
  // 캔버스 생성 (1200x630은 소셜 미디어에 최적화된 크기)
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // 배경 색상 설정
  ctx.fillStyle = '#4CAF50'; // 초록색 배경
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

  // 파일로 저장
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(imageFilePath, buffer);

  console.log(`이미지가 생성되었습니다: ${imageFilePath}`);
  return `/images/posts/${imageFileName}`;
}

// 이미지 생성
const postTitle = '중년 여성을 위한 건강한 식습관';
const imagePath = createImage(postTitle);

// 포스트 내용
const postContent = `---
title: '${postTitle}'
description: '중년 여성의 건강을 위한 균형 잡힌 식단과 식습관 가이드'
date: '${formattedDate}'
tags: ['건강', '식단', '다이어트']
image: '${imagePath}'
---

# ${postTitle}

중년기에 접어들면 신체적 변화와 함께 영양소 요구량의 변화도 찾아옵니다. 이 시기에는 건강한 식습관을 통해 활력을 유지하고 만성질환 위험을 줄이는 것이 중요합니다.

## 단백질 섭취의 중요성

<!-- AD_PLACE_1 -->

중년기에는 근육량 유지를 위해 양질의 단백질 섭취가 필수적입니다. 하루에 체중 1kg당 1.0-1.2g의 단백질을 섭취하는 것이 이상적입니다.

- 살코기, 생선, 계란, 두부 등의 식품을 매 끼니 포함시키세요.
- 식물성 단백질 소스를 다양하게 활용하면 건강에 더 좋습니다.
- 단백질은 포만감을 주어 체중 관리에도 도움이 됩니다.

## 뼈 건강을 위한 칼슘과 비타민 D

중년 여성에게 골다공증은 주요 건강 위험요소입니다. 충분한 칼슘과 비타민 D 섭취가 필요합니다.

- 저지방 유제품, 두부, 뼈째 먹는 생선 등으로 칼슘을 보충하세요.
- 햇빛 노출과 함께 버섯, 계란 노른자 등으로 비타민 D를 섭취하세요.
- 필요 시 의사와 상담 후 보충제를 고려해볼 수 있습니다.

## 건강한 지방 선택하기

<!-- AD_PLACE_2 -->

모든 지방이 나쁜 것은 아닙니다. 오메가-3 지방산과 같은 건강한 지방은 심장 건강과 염증 감소에 도움이 됩니다.

- 올리브 오일, 아보카도, 견과류를 식단에 포함하세요.
- 등 푸른 생선을 주 2회 이상 섭취하세요.
- 트랜스 지방과 포화 지방은 제한하는 것이 좋습니다.

## 식이섬유 충분히 섭취하기

식이섬유는 소화 건강과 콜레스테롤 관리에 도움이 됩니다.

- 다양한 채소와 과일을 매일 5접시 이상 섭취하세요.
- 통곡물을 정제된 탄수화물 대신 선택하세요.
- 물을 충분히 마셔 식이섬유의 효과를 높이세요.

## 수분 섭취의 중요성

나이가 들수록 갈증을 느끼는 감각이 둔화될 수 있습니다. 의식적으로 수분을 충분히 섭취하는 것이 중요합니다.

- 하루 8잔 이상의 물을 마시는 습관을 들이세요.
- 카페인과 알코올은 탈수를 유발할 수 있으니 제한하세요.
- 수분이 풍부한 과일과 채소도 수분 섭취에 도움이 됩니다.

## 요약 및 실천 방법

건강한 식습관은 하루아침에 형성되지 않습니다. 작은 변화부터 시작하여 꾸준히 실천하는 것이 중요합니다.

1. 매 끼니 단백질, 통곡물, 채소를 균형 있게 섭취하세요.
2. 가공식품과 단순당은 줄이고 자연식품 위주로 식단을 구성하세요.
3. 식사 일지를 기록하면 식습관 개선에 도움이 됩니다.
4. 무리한 다이어트보다는 지속 가능한 건강한 식습관을 목표로 하세요.

건강한 중년기를 위한 첫걸음은 바로 오늘 식탁에서 시작됩니다.`;

// 파일에 포스트 내용 작성
fs.writeFileSync(postFilePath, postContent);
console.log(`테스트 포스트가 생성되었습니다: ${postFilePath}`);
console.log(`이미지 경로: ${imagePath}`); 