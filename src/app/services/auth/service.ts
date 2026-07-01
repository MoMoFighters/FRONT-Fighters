import { UserRole, UserStatus } from "@/features/user/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";

const BASE_SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;

const createForwardedForHeaders = (
    forwardedFor?: string
): HeadersInit => {
    if (!forwardedFor) {
        return {};
    }

    return {
        "X-Forwarded-For": forwardedFor,
    };
};


/*
  1-1. 학생 회원가입
  1-2. 강사 회원가입 -> 강사 전환
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
        `${BASE_SERVER_URL}/api/v1/auth/signup`,
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
            "회원가입에 실패하였습니다."
        );
    }

    return result;
};


// ==========================================
// 1-2-1. 강사 전환
// POST /api/v1/teacherApply
// ==========================================

export type TeacherSignupData = null;

export const teacherSignupService = async (
    formData: FormData,
    accessToken: string
): Promise<ApiResponse<TeacherSignupData>> => {
    const response = await fetch(`${BASE_SERVER_URL}/api/v1/teacherApply`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        const result = await response.json()
        throw new Error(
            result.message ||
            "강사 전환에 실패하였습니다."
        );
    }

    const result: ApiResponse<TeacherSignupData> =
        await response.json();



    return result;
};

// ==========================================
// 1-2-2. 강사 포기하기
// POST /api/v1/application-giveup
// ==========================================

export const teacherGiveupService = async (): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth("/api/v1/application-giveup", {
        method: 'POST'
    });
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
            errorData.message ||
            "알 수 없는 문제가 발생했습니다."
        );
    }
    return response.json();
}



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
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

export const loginService = async (
    loginData: {
        email: string;
        password: string;
    },
    forwardedFor?: string
): Promise<ApiResponse<LoginData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...createForwardedForHeaders(forwardedFor),
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
    refreshToken: string,
    forwardedFor?: string
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
                ...createForwardedForHeaders(forwardedFor),
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
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

export const kakaoLoginService = async (
    code: string,
    forwardedFor?: string
): Promise<ApiResponse<KakaoLoginData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/kakaologin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...createForwardedForHeaders(forwardedFor),
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
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

export type GoogleLoginData = ApiResponse<GoogleLoginTokenData>;

export const googleLoginService = async (
    code: string,
    forwardedFor?: string
): Promise<GoogleLoginData> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/googlelogin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...createForwardedForHeaders(forwardedFor),
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

// ==========================================
// 8-3. 네이버 로그인
// POST /api/v1/auth/naverlogin
// ==========================================

export interface NaverLoginTokenData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

export type NaverLoginData = ApiResponse<NaverLoginTokenData>;

export const naverLoginService = async (
    code: string,
    forwardedFor?: string
): Promise<NaverLoginData> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/auth/naverlogin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...createForwardedForHeaders(forwardedFor),
            },
            body: JSON.stringify({ code }),
        }
    );

    const result: NaverLoginData = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "네이버 로그인에 실패하였습니다.");
    }

    return result;
};
