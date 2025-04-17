import { useState, useRef } from 'react';

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImagePath, setGeneratedImagePath] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleGenerateImage = async () => {
    if (!title) {
      setMessage({ text: '이미지를 생성하려면 제목을 입력하세요.', type: 'error' });
      return;
    }
    
    try {
      setIsGeneratingImage(true);
      setMessage({ text: '이미지를 생성 중입니다...', type: 'info' });
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedImagePath(data.imagePath);
        setMessage({ text: '이미지가 성공적으로 생성되었습니다!', type: 'success' });
      } else {
        setMessage({ text: data.error || '이미지 생성 실패', type: 'error' });
      }
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      setMessage({ text: '이미지 생성 중 오류가 발생했습니다.', type: 'error' });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage({ text: '제목과 내용은 필수 입력 항목입니다.', type: 'error' });
      return;
    }
    
    try {
      // 블로그 포스트 생성 API 호출
      // 여기에 포스트 저장 로직 구현
      setMessage({ text: '포스트가 성공적으로 저장되었습니다!', type: 'success' });
    } catch (error) {
      console.error('포스트 저장 오류:', error);
      setMessage({ text: '포스트 저장 중 오류가 발생했습니다.', type: 'error' });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary-700">새 블로그 포스트 작성</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 
          message.type === 'success' ? 'bg-green-100 text-green-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="블로그 포스트 제목을 입력하세요"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="포스트에 대한 짧은 설명을 입력하세요"
          />
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            태그
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 다이어트,건강,운동)"
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !title}
              className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isGeneratingImage ? '이미지 생성 중...' : '특성 이미지 자동 생성'}
            </button>
          </div>
          
          {generatedImagePath && (
            <div className="flex items-center">
              <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden mr-2">
                <img 
                  src={generatedImagePath} 
                  alt="생성된 이미지" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-sm text-gray-600">이미지가 생성되었습니다!</span>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="마크다운 형식으로 내용을 작성하세요"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            포스트 저장
          </button>
        </div>
      </form>
    </div>
  );
} 