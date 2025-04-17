const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 이미지 경로 설정
const imagesDir = path.join(__dirname, '../public/images/posts');

// 디렉토리가 없으면 생성
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 간단한 이미지 생성 함수
function createImage(filename, title) {
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
  const imagePath = path.join(imagesDir, filename);
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(imagePath, buffer);

  console.log(`이미지가 생성되었습니다: ${imagePath}`);
  return `/images/posts/${filename}`;
}

// 실행
const imagePath = createImage('healthy-eating-cover.jpg', '중년 여성을 위한 건강한 식습관');
console.log(`이미지 경로: ${imagePath}`); 