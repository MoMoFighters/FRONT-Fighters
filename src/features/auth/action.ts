"use server";

import { cookies, headers } from "next/headers";
import { ApiResponse } from "@/lib/api";

import {
    studentSignupService,
    teacherSignupService,
    sendEmailCodeService,
    emailVerifyService,
    loginService,
    changePasswordService,
    tempPwService,
    authRefresh,
    logoutService,
    nicknameRegistService,
    kakaoLoginService,
    googleLoginService,
    naverLoginService,
    teacherGiveupService,
} from "@/app/services/auth/service";
import { UserRole, UserStatus } from "../user/type";
import { killTokenAction } from "../user/action";


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
    message: "다시 로그인 해주세요.",
});

const getForwardedForHeader = async (): Promise<string> => {
    const headerStore = await headers();

    return (
        headerStore.get("x-forwarded-for") ??
        headerStore.get("x-real-ip") ??
        ""
    );
};


// ==========================================
// 1-1. 회원가입
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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 1-2. 강사 전환
// ==========================================

type TeacherSignupData = null;

export const teacherSignupAction = async (
    formData: FormData
): Promise<ApiResponse<TeacherSignupData>> => {
    try {
        const cookieStore = await cookies();
        const accessToken =
            cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return createUnauthorizedResponse<TeacherSignupData>();
        }

        const result = await teacherSignupService(
            formData,
            accessToken
        );

        return result;
    } catch (error) {
        return createErrorResponse<TeacherSignupData>(
            error,
            "알 수 없는 문제가 발생했습니다."
        );
    }
};

// ==========================================
// 1-3. 강사 포기
// ==========================================

export const teacherGiveupAction = async (): Promise<ApiResponse<null>> => {
    try {
        const cookieStore = await cookies();
        const accessToken =
            cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return createUnauthorizedResponse<null>();
        }

        return await teacherGiveupService();
    } catch (error) {
        return createErrorResponse<null>(
            error,
            "강사 전환 포기에 실패했습니다."
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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 1-n-2. 이메일 인증
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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 2-1. 로그인
// ==========================================

interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

export const loginAction = async (
    email: string,
    password: string
): Promise<ApiResponse<LoginData>> => {
    try {
        const forwardedFor = await getForwardedForHeader();
        const result = await loginService({
            email,
            password,
        }, forwardedFor);

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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};

// ==========================================
// 3. 비번 변경
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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 4. 임시 비번 발송
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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 5. 토큰 재발급
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
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 6. 로그아웃
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

        const forwardedFor = await getForwardedForHeader();
        const result = await logoutService(
            accessToken,
            refreshToken,
            forwardedFor
        );

        killTokenAction()

        return result;
    } catch (error) {
        return createErrorResponse<LogoutData>(
            error,
            "알 수 없는 문제가 발생했습니다."
        );
    }
};


// ==========================================
// 7. 닉네임 등록
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

        const refreshToken =
            cookieStore.get("refreshToken")?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: "UNAUTHORIZED",
                message: "다시 로그인해주세요.",
            };
        }

        const result = await nicknameRegistService(
            nickname,
            accessToken
        );

        if (result.status === 200 && refreshToken) {
            try {
                const refreshResult = await authRefresh(
                    refreshToken,
                    accessToken
                );

                if (refreshResult.data?.accessToken) {
                    cookieStore.set(
                        "accessToken",
                        refreshResult.data.accessToken,
                        {
                            httpOnly: true,
                            path: "/",
                            maxAge: refreshResult.data.expiresIn,
                            sameSite: "lax",
                        }
                    );
                }
            } catch {
                // 닉네임 등록 자체는 성공했으므로 토큰 갱신 실패는 무시하고 다음 요청에서 다시 검사한다.
            }
        }

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "INTERNAL_SERVER_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "알 수 없는 문제가 발생했습니다.",
        };
    }
};

// ==========================================
// 8. 외부 api 로그인
// ==========================================

interface OAuthLoginData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
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
        throw new Error("코드가 존재하지 않습니다.");
    }

    const forwardedFor = await getForwardedForHeader();
    const result = await kakaoLoginService(code, forwardedFor);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};

export const googleLoginAction = async (
    code: string
): Promise<ApiResponse<OAuthLoginData>> => {
    if (!code) {
        throw new Error("코드가 존재하지 않습니다.");
    }

    const forwardedFor = await getForwardedForHeader();
    const result = await googleLoginService(code, forwardedFor);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};

export const naverLoginAction = async (
    code: string
): Promise<ApiResponse<OAuthLoginData>> => {
    if (!code) {
        throw new Error("네이버 인가 코드가 없습니다.");
    }

    const forwardedFor = await getForwardedForHeader();
    const result = await naverLoginService(code, forwardedFor);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};
