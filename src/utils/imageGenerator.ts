import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// OpenAI API 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 이미지 저장 위치 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// 이미지 디렉토리가 없으면 생성
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * OpenAI의 DALL-E를 사용하여 이미지를 생성하고 저장
 * @param prompt 이미지 생성을 위한 프롬프트
 * @param filename 저장할 파일 이름 (확장자 제외)
 * @returns 생성된 이미지의 경로
 */
export async function generateImage(prompt: string, filename: string): Promise<string> {
  try {
    // 이미지 생성
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
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
    // 오류 발생 시 기본 이미지 반환
    return '/images/default-image.png';
  }
}

/**
 * 블로그 포스트 관련 이미지 생성
 * @param title 블로그 포스트 제목
 * @param tags 블로그 포스트 태그
 * @returns 생성된 이미지의 경로
 */
export async function generateBlogImage(title: string, tags: string[] = []): Promise<string> {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
    .substring(0, 50); // 길이 제한
  
  const filename = `blog-${slug}-${Date.now()}`;
  
  // 태그를 이용하여 프롬프트 보강
  const tagString = tags.length > 0 ? `관련 키워드: ${tags.join(', ')}` : '';
  
  const prompt = `
    "${title}"에 어울리는 이미지를 생성해주세요. 
    ${tagString}
    밝은 색감과 깔끔한 구도로 한국인 미용과 건강 블로그에 적합한 이미지를 생성해주세요.
    사람의 얼굴이 나오지 않도록 하고, 텍스트는 포함하지 마세요.
    건강하고 아름다운 느낌의 이미지를 생성해주세요.
  `;
  
  return generateImage(prompt, filename);
} 