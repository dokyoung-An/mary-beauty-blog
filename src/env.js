// src/env.js
// 환경 변수 관리

// 사이트 기본 정보
export const SITE_NAME = import.meta.env.PUBLIC_SITE_NAME || "메리의 미수다";
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321";
export const SITE_DESCRIPTION = import.meta.env.PUBLIC_SITE_DESCRIPTION || "중년 여성의 아름다움과 건강을 위한 정보";

// API 키
export const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || "";
export const PUBLIC_OPENAI_API_KEY = import.meta.env.PUBLIC_OPENAI_API_KEY || ""; 