#!/usr/bin/env node
/**
 * 자동 포스트 생성 및 GitHub 푸시 스크립트
 * 
 * 이 스크립트는 다음을 수행합니다:
 * 1. auto-post-generator.js를 실행하여 새 블로그 포스트 생성
 * 2. 생성된 포스트를 GitHub에 커밋 및 푸시
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 스크립트 위치 기반으로 디렉토리 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('==== 자동 블로그 포스트 생성 및 게시 시작 ====');
const timestamp = new Date().toLocaleString('ko-KR');
console.log(`실행 시간: ${timestamp}`);

try {
  // 1. 새 블로그 포스트 생성
  console.log('\n1. 새 블로그 포스트 생성 중...');
  execSync('node scripts/auto-post-generator.js', { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
  
  // 2. Git에 변경사항 추가
  console.log('\n2. Git에 변경사항 추가 중...');
  execSync('git add src/posts/ public/images/', { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
  
  // 3. 변경사항 커밋
  console.log('\n3. 변경사항 커밋 중...');
  const commitMessage = `자동 블로그 포스트 추가 (${timestamp})`;
  execSync(`git commit -m "${commitMessage}"`, { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
  
  // 4. GitHub에 푸시
  console.log('\n4. GitHub에 푸시 중...');
  execSync('git push origin main', { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
  
  console.log('\n==== 자동 블로그 포스트 생성 및 게시 완료 ====');
} catch (error) {
  console.error('\n오류 발생:', error.message);
  process.exit(1);
} 