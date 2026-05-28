// 자체 로그인,회원가입 관련

/*
  1-1. 학생 회원가입
  1-2. 강사 회원가입
  1-n-1. 이메일 인증코드 발송
  1-n-2. 이메일 인증하기(인증코드 기반)
  2. 로그인
  3. 비밀번호 변경
  4. 임시비밀번호 발급
  5. 자동 로그아웃 연장
  6. 로그아웃
 */






// 카카오 API 관련 서비스 함수

import { KakaoLoginResponse } from "@/features/auth/type";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const kakaoLogin = async (
    code: string
): Promise<KakaoLoginResponse> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/auth/kakao/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                code, // searchParameter
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            '카카오 로그인에 실패하였습니다.'
        );
    }

    return result;
};



// 구글 API 관련 서비스 함수
// 추후 김태완이 알아서 정의할 예정