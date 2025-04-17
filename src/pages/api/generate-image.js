import { generateBlogImage } from '../../utils/imageGenerator';

export async function post({ request }) {
  try {
    const data = await request.json();
    const { title, tags = [] } = data;
    
    // 타이틀과 태그는 필수 입력
    if (!title) {
      return new Response(JSON.stringify({
        success: false,
        error: '이미지 생성을 위한 제목이 필요합니다.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // OpenAI를 이용한 이미지 생성
    const imagePath = await generateBlogImage(title, tags);
    
    return new Response(JSON.stringify({
      success: true,
      imagePath
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('이미지 생성 API 오류:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || '이미지 생성 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// 옵션 메소드 핸들러 (CORS 처리)
export function options() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 