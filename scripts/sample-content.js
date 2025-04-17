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
  // 영어와 숫자가 아닌 문자는 '-'로 대체
  const slug = slugify(title, { 
    lower: true,
    locale: 'ko',
    remove: /[^\w\s$*_+~.()'"!\-:@]/g
  });
  
  // 슬러그가 비어있으면 기본값 사용
  return slug || 'blog-post';
}

// 파일 이름 생성 (YYYY-MM-DD-slug.md)
function createFileName(title) {
  const date = getCurrentDate();
  const slug = createSlug(title);
  return `${date}-${slug}.md`;
}

// 디렉토리 존재 확인 및 생성
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// 고품질 블로그 글 생성 (가짜 OpenAI 응답)
function generateFakeBlogPost(topic) {
  console.log(`주제 "${topic}"에 대한 샘플 블로그 글을 생성하고 있습니다...`);
  
  const content = `---
title: "${topic}"
date: "${getCurrentDate()}"
description: "${topic}에 대한 종합 가이드: 효율적인 방법과 전략"
tags: ["금융", "투자", "자산관리", "재테크", "경제"]
---

# ${topic}

<!-- AD_PLACE_1 -->

금융 시장이 급변하는 현 시대에, ${topic}에 대한 이해는 미래 자산 형성에 필수적입니다. 많은 사람들이 이 주제에 관심을 가지고 있지만, 실제로 올바른 접근법을 알지 못해 어려움을 겪고 있습니다. 이 글에서는 전문가의 시각으로 효과적인 ${topic} 방법을 알아보겠습니다.

## 왜 지금 ${topic}이 중요한가?

최근 글로벌 경제 불확실성과 인플레이션 상승으로 인해 자산 관리의 중요성이 그 어느 때보다 강조되고 있습니다. 2025년 기준으로 한국은행의 데이터에 따르면, 적절한 투자 전략을 가진 가구와 그렇지 않은 가구 간의 자산 격차가 점점 벌어지고 있는 추세입니다.

통계에 따르면:
- 계획적인 투자를 하는 가구는 그렇지 않은 가구보다 연평균 7.2% 더 높은 자산 증가율을 보입니다
- 장기 투자자의 85%는 시장 변동성에도 불구하고 긍정적인 수익률을 달성합니다
- 전문가의 조언을 받는 투자자는 그렇지 않은 투자자보다 평균 3.5% 더 높은 수익을 냅니다

## 실용적인 ${topic} 전략

### 1. 분산 투자의 힘

자산을 다양한 투자 상품에 분산하는 것은 리스크를 관리하는 가장 효과적인 방법입니다. 주식, 채권, 부동산, 현금성 자산 등 서로 다른 자산군에 투자함으로써 시장 변동성에 대한 노출을 줄일 수 있습니다.

<!-- AD_PLACE_2 -->

### 2. 장기적 관점 유지하기

단기적인 시장 변동에 일희일비하지 말고, 장기적인 목표에 집중하세요. 복리의 힘은 시간이 지남에 따라 더욱 강력해집니다. 5년, 10년, 15년 이상의 투자 기간을 설정하고 꾸준히 투자하는 습관을 들이세요.

### 3. 정기적인 리밸런싱

시장 상황에 따라 자산 배분 비율이 변할 수 있습니다. 연 1-2회 포트폴리오를 점검하고 원래의 자산 배분 목표에 맞게 조정하는 것이 중요합니다.

## 요약 및 결론

${topic}은 단기간의 이벤트가 아닌 평생의 과정입니다. 지속적인 학습과 꾸준한 실천이 성공의 열쇠입니다. 오늘 소개해 드린 전략들을 바탕으로 자신만의 투자 계획을 세우고, 작은 금액부터 시작해보세요. 재무적 자유를 향한 여정은 첫 걸음부터 시작됩니다.

시작이 반이라는 말이 있습니다. 지금 바로 행동으로 옮기세요!`;

  return content;
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
  // 명령행 인수에서 주제 가져오기
  const topic = process.argv[2];
  
  if (!topic || topic.trim() === '') {
    console.log('사용법: node sample-content.js "블로그 글 주제"');
    process.exit(1);
  }
  
  try {
    console.log("==========================================================");
    console.log(`주제: "${topic}"`);
    console.log("==========================================================");
    
    // 블로그 글 생성
    console.log("1. 샘플 블로그 글 생성을 시작합니다...");
    const blogContent = generateFakeBlogPost(topic);
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