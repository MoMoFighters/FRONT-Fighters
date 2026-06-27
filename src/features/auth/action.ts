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
    naverLoginService,
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
    message: "濡쒓렇?몄씠 ?꾩슂?⑸땲??",
});


// ==========================================
// 1-1. ?숈깮 ?뚯썝媛??
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
            "?숈깮 ?뚯썝媛?낆뿉 ?ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 1-2. 媛뺤궗 ?뚯썝媛??
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
            "媛뺤궗 ?뚯썝媛?낆뿉 ?ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 1-n-1. ?대찓???몄쬆肄붾뱶 諛쒖넚
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
            "?대찓???몄쬆肄붾뱶 諛쒖넚???ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 1-n-2. ?대찓???몄쬆?섍린
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
            "?대찓???몄쬆???ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 2-1. 濡쒓렇??
// ?깃났 ???좏겙??荑좏궎?????
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
            "濡쒓렇?몄뿉 ?ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 2-2. 濡쒓렇???꾨즺 ?뺣낫 議고쉶
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
            "濡쒓렇???뺣낫瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲??"
        );
    }
};


// ==========================================
// 3. 鍮꾨?踰덊샇 蹂寃?
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
            "鍮꾨?踰덊샇 蹂寃쎌뿉 ?ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 4. ?꾩떆 鍮꾨?踰덊샇 諛쒓툒
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
            "?꾩떆 鍮꾨?踰덊샇 諛쒓툒???ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 5. ?먮룞 濡쒓렇?꾩썐 ?곗옣
// ??accessToken??荑좏궎?????
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
            "濡쒓렇???곗옣???ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 6. 濡쒓렇?꾩썐
// ?깃났 ???몄쬆 荑좏궎 ??젣
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
            "濡쒓렇?꾩썐???ㅽ뙣?섏??듬땲??"
        );
    }
};


// ==========================================
// 7. ?됰꽕???깅줉
// accessToken? 荑좏궎?먯꽌 議고쉶
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
                message: "濡쒓렇?몄씠 ?꾩슂?⑸땲??",
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
                    : "?됰꽕???깅줉???ㅽ뙣?섏??듬땲??",
        };
    }
};

// ==========================================
// 8. 移댁뭅?? 援ш? 濡쒓렇??api
// accessToken? 荑좏궎?먯꽌 議고쉶
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
        throw new Error("移댁뭅???멸? 肄붾뱶媛 ?놁뒿?덈떎.");
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
        throw new Error("援ш? ?멸? 肄붾뱶媛 ?놁뒿?덈떎.");
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
        throw new Error("네이버 인가 코드가 없습니다.");
    }

    const result = await naverLoginService(code);

    if (result.data) {
        await setOAuthCookies(result.data);
    }

    return result;
};
