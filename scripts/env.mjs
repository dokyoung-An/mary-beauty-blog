// 환경 변수 정의
export const env = {
  PUBLIC_SITE_NAME: "메리의 미수다",
  PUBLIC_SITE_URL: "http://localhost:4321",
  PUBLIC_SITE_DESCRIPTION: "중년 여성의 아름다움과 건강을 위한 실용적인 정보를 제공하는 블로그",
  PUBLIC_OPENAI_API_KEY: process.env.PUBLIC_OPENAI_API_KEY || "",
  PUBLIC_GPT_MODEL: process.env.PUBLIC_GPT_MODEL || "gpt-3.5-turbo",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
}; 