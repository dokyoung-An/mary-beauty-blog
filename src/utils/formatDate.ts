export function formatDate(dateString: string): string {
  // 유효한 날짜인지 확인
  if (!dateString) {
    return '날짜 없음';
  }
  
  try {
    // 날짜 포맷으로 변환 시도
    const date = new Date(dateString);
    
    // 유효하지 않은 날짜인 경우
    if (isNaN(date.getTime())) {
      return '유효하지 않은 날짜';
    }
    
    // 한국 날짜 형식으로 변환
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('날짜 형식 오류:', error);
    return '유효하지 않은 날짜 형식';
  }
} 