#!/usr/bin/env node

// 이 스크립트는 OpenAI API를 사용하여 블로그 포스트를 생성합니다.
// Astro 개발 서버와는 별도로 실행되어야 합니다.

const { exec } = require('child_process');
const readline = require('readline');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`실행 중: ${command}`);
    
    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`실행 오류: ${error}`);
        return reject(error);
      }
      
      return resolve({ stdout, stderr });
    });
    
    // 실시간 출력 로깅
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    childProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}

async function main() {
  // 사용자 입력 받기
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('블로그 포스트 주제를 입력하세요: ', async (topic) => {
    if (!topic || topic.trim() === '') {
      console.log('주제가 입력되지 않았습니다. 종료합니다.');
      rl.close();
      return;
    }
    
    try {
      // API 키를 직접 환경 변수로 전달하여 스크립트 실행
      await runCommand(`node generatePost.js "${topic}"`);
      
      console.log('\n작업이 완료되었습니다!');
    } catch (error) {
      console.error('오류가 발생했습니다:', error);
    } finally {
      rl.close();
    }
  });
}

main(); 