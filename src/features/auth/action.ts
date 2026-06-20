"use server";

import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api";

import {
    studentSignupService,
    teacherSignupService,
    sendEmailCodeService,
    emailVerifyService,
    loginService,
    loginSuccessService,
    changePasswordService,
    tempPwService,
    authRefresh,
    logoutService,
    nicknameRegistService,
    kakaoLoginService,
    googleLoginService,
} from "@/app/services/auth/service";


const createErrorResponse = <T>(
    error: unknown,
    fallbackMessage: string
): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message:
        error instanceof Error
            ? error.message
            : fallbackMessage,
});

const createUnauthorizedResponse = <T>(): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 401,
    code: "UNAUTHORIZED",
    message: "로그인이 필요합니다.",
});


// ==========================================
// 1-1. 학생 회원가입
// ==========================================

interface StudentSignupData {
    userId: number;
    email: string;
    name: string;
    role: string;
    status: string;
}

export const studentSignupAction = async (
    signupData: {
        email: string;
        password: string;
        name: string;
    }
): Promise<ApiResponse<StudentSignupData>> => {
    try {
        return await studentSignupService(signupData);
    } catch (error) {
        return createErrorResponse<StudentSignupData>(
            error,
            "학생 회원가입에 실패하였습니다."
        );
    }
};


// ==========================================
// 1-2. 강사 회원가입
// ==========================================

interface TeacherSignupData {
    userId: number;
    email: string;
    name: string;
    role: string;
    category: string;
    proof: string | null;
    status: string;
}

export const teacherSignupAction = async (
    formData: FormData
): Promise<ApiResponse<TeacherSignupData>> => {
    try {
        return await teacherSignupService(formData);
    } catch (error) {
        return createErrorResponse<TeacherSignupData>(
            error,
            "강사 회원가입에 실패하였습니다."
        );
    }
};


// ==========================================
// 1-n-1. 이메일 인증코드 발송
// ==========================================

interface SendEmailCodeData {
    isDuplicated: boolean;
    expiresIn: number;
}

export const sendEmailCodeAction = async (
    email: string
): Promise<ApiResponse<SendEmailCodeData>> => {
    try {
        return await sendEmailCodeService({
            email,
        });
    } catch (error) {
        return createErrorResponse<SendEmailCodeData>(
            error,
            "이메일 인증코드 발송에 실패하였습니다."
        );
    }
};


// ==========================================
// 1-n-2. 이메일 인증하기
// ==========================================

type EmailVerifyData = null;

export const verifyEmailAction = async (
    email: string,
    code: string
): Promise<ApiResponse<EmailVerifyData>> => {
    try {
        return await emailVerifyService({
            email,
            code,
        });
    } catch (error) {
        return createErrorResponse<EmailVerifyData>(
            error,
            "이메일 인증에 실패하였습니다."
        );
    }
};


// ==========================================
// 2-1. 로그인
// 성공 시 토큰을 쿠키에 저장
// ==========================================

interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: string;
    expiresIn: number;
}

export const loginAction = async (
    email: string,
    password: string
): Promise<ApiResponse<LoginData>> => {
    try {
        const result = await loginService({
            email,
            password,
        });

        if (!result.data) {
            return result;
        }

        const cookieStore = await cookies();

        cookieStore.set(
            "accessToken",
            result.data.accessToken,
            {
                httpOnly: true,
                path: "/",
                maxAge: result.data.expiresIn,
                sameSite: "lax",
            }
        );

        cookieStore.set(
            "refreshToken",
            result.data.refreshToken,
            {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            }
        );

        return result;
    } catch (error) {
        return createErrorResponse<LoginData>(
            error,
            "로그인에 실패하였습니다."
        );
    }
};


// ==========================================
// 2-2. 로그인 완료 정보 조회
// ==========================================

interface LoginCompletedData {
    role: "STUDENT" | "TEACHER" | "ADMIN";
    is_tempPwd: boolean;
    nickname: string | null;
}

export const loginSuccessAction = async (): Promise<
    ApiResponse<LoginCompletedData>
> => {
    try {
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return createUnauthorizedResponse<LoginCompletedData>();
        }

        return await loginSuccessService(accessToken);
    } catch (error) {
        return createErrorResponse<LoginCompletedData>(
            error,
            "로그인 정보를 불러오지 못했습니다."
        );
    }
};


// ==========================================
// 3. 비밀번호 변경
// ==========================================

interface ChangePasswordData {
    isPwdChanged: boolean;
}

export const changePasswordAction = async (
    currentPassword: string,
    password: string
): Promise<ApiResponse<ChangePasswordData>> => {
    try {
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return createUnauthorizedResponse<ChangePasswordData>();
        }

        return await changePasswordService({
            accessToken,
            currentPassword,
            password,
        });
    } catch (error) {
        return createErrorResponse<ChangePasswordData>(
            error,
            "비밀번호 변경에 실패하였습니다."
        );
    }
};


// ==========================================
// 4. 임시 비밀번호 발급
// ==========================================

type TempPasswordData = null;

export const tempPwAction = async (
    email: string
): Promise<ApiResponse<TempPasswordData>> => {
    try {
        return await tempPwService(email);
    } catch (error) {
        return createErrorResponse<TempPasswordData>(
            error,
            "임시 비밀번호 발급에 실패하였습니다."
        );
    }
};


// ==========================================
// 5. 자동 로그아웃 연장
// 새 accessToken을 쿠키에 저장
// ==========================================

interface AuthRefreshData {
    accessToken: string;
    expiresIn: number;
}

export const authRefreshAction = async (): Promise<
    ApiResponse<AuthRefreshData>
> => {
    try {
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get("accessToken")?.value;

        const refreshToken =
            cookieStore.get("refreshToken")?.value;

        if (!accessToken || !refreshToken) {
            return createUnauthorizedResponse<AuthRefreshData>();
        }

        const result = await authRefresh(
            refreshToken,
            accessToken
        );

        if (result.data?.accessToken) {
            cookieStore.set(
                "accessToken",
                result.data.accessToken,
                {
                    httpOnly: true,
                    path: "/",
                    maxAge: result.data.expiresIn,
                    sameSite: "lax",
                }
            );
        }

        return result;
    } catch (error) {
        return createErrorResponse<AuthRefreshData>(
            error,
            "로그인 연장에 실패하였습니다."
        );
    }
};


// ==========================================
// 6. 로그아웃
// 성공 시 인증 쿠키 삭제
// ==========================================

type LogoutData = null;

export const logoutAction = async (): Promise<
    ApiResponse<LogoutData>
> => {
    try {
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get("accessToken")?.value;

        const refreshToken =
            cookieStore.get("refreshToken")?.value;

        if (!accessToken || !refreshToken) {
            return createUnauthorizedResponse<LogoutData>();
        }

        const result = await logoutService(
            accessToken,
            refreshToken
        );

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return result;
    } catch (error) {
        return createErrorResponse<LogoutData>(
            error,
            "로그아웃에 실패하였습니다."
        );
    }
};


// ==========================================
// 7. 닉네임 등록
// accessToken은 쿠키에서 조회
// ==========================================

interface NicknameRegistData {
    nickname: string;
}

export const nicknameRegistAction = async (
    nickname: string
): Promise<ApiResponse<NicknameRegistData>> => {
    try {
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: "UNAUTHORIZED",
                message: "로그인이 필요합니다.",
            };
        }

        return await nicknameRegistService(
            nickname,
            accessToken
        );
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "INTERNAL_SERVER_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "닉네임 등록에 실패하였습니다.",
        };
    }
};

// ==========================================
// 8. 카카오, 구글 로그인 api
// accessToken은 쿠키에서 조회
// ==========================================

interface OAuthLoginData {
    accessToken: string;
    refreshToken: string;
    status: string;
    expiresIn: number;
}

const setOAuthCookies = async (data: OAuthLoginData) => {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: data.expiresIn,
        sameSite: "lax",
    });

    cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
    });
};

export const handleKakaoLoginCallback = async (
    code: string
): Promise<ApiResponse<OAuthLoginData>> => {
    if (!code) {
        throw new Error("카카오 인가 코드가 없습니다.");
    }

    const result = await kakaoLoginService(code);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};

export const googleLoginAction = async (
    code: string
): Promise<ApiResponse<OAuthLoginData>> => {
    if (!code) {
        throw new Error("구글 인가 코드가 없습니다.");
    }

    const result = await googleLoginService(code);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};

export const naverLoginAction = async (
    code: string
): Promise<ApiResponse<OAuthLoginData>> => {
    if (!code) {
        throw new Error("구글 인가 코드가 없습니다.");
    }

    const result = await googleLoginService(code);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};