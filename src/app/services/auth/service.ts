import { ApiResponse } from "@/lib/api";

const BASE_SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;


/*
  1-1. 학생 회원가입
  1-2. 강사 회원가입
  1-n-1. 이메일 인증코드 발송
  1-n-2. 이메일 인증하기
  2-1. 로그인
  2-2. 로그인 완료 정보 조회
  3. 비밀번호 변경
  4. 임시 비밀번호 발급
  5. 자동 로그아웃 연장
  6. 로그아웃
*/


// ==========================================
// 1-1. 학생 회원가입
// POST /api/v1/auth/signup/student
// ==========================================

export interface StudentSignupData {
    userId: number;
    email: string;
    name: string;
    role: string;
    status: string;
}

export const studentSignupService = async (
    signupData: {
        email: string;
        password: string;
        name: string;
    }
): Promise<ApiResponse<StudentSignupData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/signup/student`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        }
    );

    const result: ApiResponse<StudentSignupData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "학생 회원가입에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 1-2. 강사 회원가입
// POST /api/v1/auth/signup/teacher
// ==========================================

export interface TeacherSignupData {
    userId: number;
    email: string;
    name: string;
    role: string;
    category: string;
    proof: string | null;
    status: string;
}

export const teacherSignupService = async (
    formData: FormData
): Promise<ApiResponse<TeacherSignupData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/signup/teacher`,
        {
            method: "POST",
            body: formData,
        }
    );

    const result: ApiResponse<TeacherSignupData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "강사 회원가입에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 1-n-1. 이메일 인증코드 발송
// POST /api/v1/auth/email/send
// ==========================================

export interface SendEmailCodeData {
    isDuplicated: boolean;
    expiresIn: number;
}

export const sendEmailCodeService = async (
    emailData: {
        email: string;
    }
): Promise<ApiResponse<SendEmailCodeData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/email/send`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        }
    );

    const result: ApiResponse<SendEmailCodeData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "이메일 인증코드 발송에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 1-n-2. 이메일 인증하기
// POST /api/v1/auth/email/verify
// ==========================================

export type EmailVerifyData = null;

export const emailVerifyService = async (
    verifyData: {
        email: string;
        code: string;
    }
): Promise<ApiResponse<EmailVerifyData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/email/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(verifyData),
        }
    );

    const result: ApiResponse<EmailVerifyData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "이메일 인증에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 2-1. 로그인
// POST /api/v1/auth/login
// ==========================================

export interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: string;
    expiresIn: number;
}

export const loginService = async (
    loginData: {
        email: string;
        password: string;
    }
): Promise<ApiResponse<LoginData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        }
    );

    const result: ApiResponse<LoginData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "로그인에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 2-2. 로그인 완료 정보 조회
// GET /api/v1/auth/login/completed
// ==========================================

export interface LoginCompletedData {
    role: "STUDENT" | "TEACHER" | "ADMIN";
    is_tempPwd: boolean;
    nickname: string | null;
}

export const loginSuccessService = async (
    accessToken: string
): Promise<ApiResponse<LoginCompletedData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/login/completed`,
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
            },
        }
    );

    const result: ApiResponse<LoginCompletedData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "로그인 정보를 불러오지 못했습니다."
        );
    }

    return result;
};


// ==========================================
// 3. 비밀번호 변경
// PATCH /api/v1/user/update
// ==========================================

export interface ChangePasswordData {
    isPwdChanged: boolean;
}

export const changePasswordService = async (
    passwordData: {
        accessToken: string;
        currentPassword: string;
        password: string;
    }
): Promise<ApiResponse<ChangePasswordData>> => {
    const {
        accessToken,
        currentPassword,
        password,
    } = passwordData;

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/user/update`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                currentPassword,
                password,
            }),
        }
    );

    const result: ApiResponse<ChangePasswordData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "비밀번호 변경에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 4. 임시 비밀번호 발급
// POST /api/v1/auth/password/temp
// ==========================================

export type TempPasswordData = null;

export const tempPwService = async (
    email: string
): Promise<ApiResponse<TempPasswordData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/password/temp`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        }
    );

    const result: ApiResponse<TempPasswordData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "임시 비밀번호 발급에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 5. 자동 로그아웃 연장
// POST /api/v1/auth/newtoken
// ==========================================

export interface AuthRefreshData {
    accessToken: string;
    expiresIn: number;
}

export const authRefresh = async (
    refreshToken: string,
    accessToken: string
): Promise<ApiResponse<AuthRefreshData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/newtoken`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Refresh-Token": refreshToken,
                Authorization:
                    `Bearer ${accessToken}`,
            },
        }
    );

    const result: ApiResponse<AuthRefreshData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "로그인 연장에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 6. 로그아웃
// POST /api/v1/auth/logout
// ==========================================

export type LogoutData = null;

export const logoutService = async (
    accessToken: string,
    refreshToken: string
): Promise<ApiResponse<LogoutData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/logout`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
                "Refresh-Token":
                    refreshToken,
            },
        }
    );

    const result: ApiResponse<LogoutData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "로그아웃에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 7. 닉네임 등록
// PATCH /api/v1/user/register/nickname
// ==========================================

export interface NicknameRegistData {
    nickname: string;
}

export const nicknameRegistService = async (
    nickname: string,
    accessToken: string
): Promise<ApiResponse<NicknameRegistData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/user/register/nickname`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                nickname,
            }),
        }
    );

    const result: ApiResponse<NicknameRegistData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "닉네임 등록에 실패하였습니다."
        );
    }

    return result;
};

// ==========================================
// 8-1. 카카오 로그인
// POST /api/v1/auth/kakaologin
// ==========================================

export interface KakaoLoginData {
    accessToken: string;
    refreshToken: string;
    status: string;
    expiresIn: number;
}

export const kakaoLoginService = async (
    code: string
): Promise<ApiResponse<KakaoLoginData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/kakaologin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        }
    );

    const result: ApiResponse<KakaoLoginData> = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "카카오 로그인에 실패하였습니다.");
    }

    return result;
};


// ==========================================
// 8-2. 구글 로그인
// POST /api/v1/auth/googlelogin
// ==========================================

export interface GoogleLoginTokenData {
    accessToken: string;
    refreshToken: string;
    status: string;
    expiresIn: number;
}

export type GoogleLoginData = ApiResponse<GoogleLoginTokenData>;

export const googleLoginService = async (
    code: string
): Promise<GoogleLoginData> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/googlelogin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        }
    );

    const result: GoogleLoginData = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "구글 로그인에 실패하였습니다.");
    }

    return result;
};