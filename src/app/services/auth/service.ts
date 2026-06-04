const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { EmailVerifyForm, KakaoLoginResponse, LoginRequest, LoginResponse, LoginSuccessActionState, SendEmailCodeForm, SendEmailCodeResponse, StudentSignupForm, TeacherSignupForm, TempPwResponse } from "@/features/auth/type";

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



// 이메일 인증코드 발송
export const sendEmailCodeService = async (
    emailData: SendEmailCodeForm
): Promise<SendEmailCodeResponse> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/email/send`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        }
    );

    const result = await response.json();

    if (!response.ok) {

        throw new Error(
            result.message ||
            '이메일 인증코드 발송에 실패하였습니다.'
        );
    }

    return result;
};


// 학생 회원가입
export const studentSignupService = async (
    signupData: StudentSignupForm
) => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/signup/student`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            '학생 회원가입에 실패하였습니다.'
        );
    }

    return result;
};

// 강사 회원가입
export const teacherSignupService = async (
    formData: FormData
) => {
    console.log('1s')
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/signup/teacher`,
        {
            method: 'POST',
            body: formData, // 👈 그대로
        }
    );
    console.log('2s', response)

    const result = await response.json();

    console.log('3s', result)
    if (!response.ok) {
        throw new Error(
            result.message ||
            '강사 회원가입에 실패하였습니다.'
        );
    }

    console.log('4 service 끝')
    return result;
};


// 이메일 인증
export const emailVerifyService = async (
    verifyData: EmailVerifyForm
) => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/email/verify`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyData),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            '이메일 인증에 실패하였습니다.'
        );
    }

    return result;
};




// 로그인 서비스

export const loginService = async ({
    email,
    password,
}: LoginRequest): Promise<LoginResponse> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const result: LoginResponse =
        await response.json();

    // 서버 에러만 throw
    if (response.status >= 500) {
        throw new Error(
            result.message ||
            '서버 오류가 발생했습니다.'
        );
    }

    return result;
};



// 로그인 성공 모달(결과 띄우는것)
export const loginSuccessService = async (
    accessToken: string
): Promise<LoginSuccessActionState> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/login/completed`,
        {
            method: 'GET',
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
            },
        }
    );

    const result:
        LoginSuccessActionState =
        await response.json();

    // 500은 글로벌 에러
    if (response.status >= 500) {
        throw new Error(
            result.message ||
            '서버 오류'
        );
    }

    return result;
};


//임시비번 발급 서비스

export const tempPwService = async (
    email: string
): Promise<TempPwResponse> => {

    try {

        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/auth/password/temp`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',
                },

                body: JSON.stringify({
                    email,
                }),
            }
        );


        const result:
            TempPwResponse =
            await response.json();


        if (
            response.ok &&
            result.success
        ) {

            return result;
        }


        throw new Error(
            result.message ||
            '임시 비밀번호 발급에 실패하였습니다.'
        );

    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알수없는 오류가 발생했습니다.'
        );
    }
};



// 로그아웃서비스
export type LogoutServiceResponse = {
    success: boolean;
    message: string;
};

export const logoutService = async (
    accessToken: string,
    refreshToken: string
): Promise<LogoutServiceResponse> => {

    const res = await fetch(`${BASE_SERVER_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Refresh-Token": refreshToken,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "로그아웃 실패");
    }

    return data;
};


// 토큰 재발급 ( 헤더 - 연장 버튼 )

export interface AuthRefreshApiResponse {
    success: boolean;
    message: string;
    data?: AuthRefreshResponse;
}

export interface AuthRefreshResponse {
    accessToken: string;
    expiresIn: number;
}

export const authRefresh = async (
    refreshToken: string,
    accessToken: string
): Promise<AuthRefreshApiResponse> => {
    // console.log(1)
    const response = await fetch(`${BASE_SERVER_URL}/api/v1/auth/newtoken`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Refresh-Token': `${refreshToken}`,
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
    // console.log(2, response)
    if (!response.ok) {
        // console.log(3, 'no ok')
        return response.json();
    }
    // console.log(4, 'ok')
    return response.json();
}



// 카카오 API 관련 서비스 함수
export const kakaoLogin = async (
    code: string
): Promise<KakaoLoginResponse> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/kakaologin`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                code
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        // console.log(response.status);
        // console.log(response.statusText);
        throw new Error(
            result.message ||
            '카카오 로그인에 실패하였습니다.'
        );
    }

    return result;
};

export interface GoogleLoginData {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: {
        accessToken: string;
        refreshToken: string;
        status: string;
        expiresIn: number;
    }
}



// 구글 API 관련 서비스 함수
// 추후 김태완이 알아서 정의할 예정
export const googleLoginService = async (
    code: string
): Promise<GoogleLoginData> => {
    const res = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/googlelogin`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        }
    );

    const response: GoogleLoginData =
        await res.json();

    if (!res.ok) {
        throw new Error(
            response.message ||
            `서버 통신 에러 (${res.status})`
        );
    }

    return response;
};


// 닉네임 입력모달에서 사용할 닉네임 등록 서비스
export interface NicknameRegistResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: {
        nickname: string;
    };
}

export const nicknameRegistService = async (
    nickname: string,
    accessToken: string
): Promise<NicknameRegistResponse> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/user/register/nickname`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname,
            }),
        }
    );

    return await response.json();
};