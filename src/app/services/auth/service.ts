const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { EmailVerifyForm, KakaoLoginResponse, LoginRequest, LoginResponse, LoginSuccessResponse, SendEmailCodeForm, SendEmailCodeResponse, StudentSignupForm, TeacherSignupForm, TempPwResponse } from "@/features/auth/type";

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
    signupData: TeacherSignupForm
) => {

    const formData = new FormData();

    formData.append('email', signupData.email);
    formData.append('password', signupData.password);
    formData.append('name', signupData.name);
    formData.append('category', signupData.category);

    if (signupData.proof) {
        formData.append('proof', signupData.proof);
    }

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/signup/teacher`,
        {
            method: 'POST',
            body: formData,
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            '강사 회원가입에 실패하였습니다.'
        );
    }

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




// 로그인

export const loginService = async ({
    email,
    password,
}: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );
        const result: LoginResponse = await response.json();

        if (response.status === 400) {
            throw new Error(
                result.message ||
                "이메일 또는 비밀번호를 입력해주세요."
            );
        }

        if (response.status === 401) {
            throw new Error(
                result.message ||
                "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        return result;

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("알수없는 오류가 발생했습니다.");
    }


};





export const loginSuccessService = async (
    accessToken: string
): Promise<LoginSuccessResponse> => {

    try {
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

        // 토큰 만료
        if (response.status === 401) {
            const result:
                LoginSuccessResponse =
                await response.json();
            throw new Error(
                result.message ||
                '다시 로그인 해주세요'
            );
        }

        if (!response.ok) {
            const result:
                LoginSuccessResponse =
                await response.json();
            throw new Error(result.message || 'zplkppl');
        }

        const result:
            LoginSuccessResponse =
            await response.json();


        return result;


    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알수없는 오류가 발생했습니다.'
        );
    }
};



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

export interface AuthRefreshResponse {
    accessToken: string;
    expiresIn: number;
}

export const authRefresh = async (refreshToken: string): Promise<AuthRefreshResponse> => {
    const response = await fetch(`${BASE_SERVER_URL}/api/v1/auth/newtoken`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Refresh-Token': `${refreshToken}`
            }
        }
    )
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '알 수 없는 이유로 로그인 연장에 실패했습니다.');
    }
    const data = await response.json();
    return data?.data;
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
        console.log(response.status); // 400, 401, 404, 500 등 그대로 나옴
        console.log(response.statusText);
        throw new Error(
            result.message ||
            '카카오 로그인에 실패하였습니다.'
        );
    }

    return result;
};



// 구글 API 관련 서비스 함수
// 추후 김태완이 알아서 정의할 예정
export const googleLoginService = async (code: string) => {
    const res = await fetch(
        `${BASE_SERVER_URL}/api/auth/google`, // 명세서의 그 주소
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        }
    );

    // 1. 네트워크 통신 자체나 백엔드 서버(500 등)가 터졌을 때 방어
    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error(`❌ 백엔드 통신 실패 (${res.status}):`, errorText);
        throw new Error(`서버 통신 에러 (${res.status})`);
    }

    const data = await res.json();

    // 2. ⚠️ 핵심 버그 수정: data.success가 false(실패)일 때만 에러를 던져야 합니다!
    // 기존에 조건문이 잘못 꼬여서 success가 true인데도 이 안으로 들어와 에러를 던졌던 것입니다.
    if (data.success === false) {
        console.error("❌ 백엔드 비즈니스 로직 실패:", data.message);
        throw new Error(data.message || "로그인에 실패하였습니다.");
    }

    // 3. 성공 시 백엔드가 준 { accessToken, refreshToken }을 안전하게 리턴
    return data.data;
};