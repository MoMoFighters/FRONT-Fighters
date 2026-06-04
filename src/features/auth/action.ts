'use server'

import {
    authRefresh,
    AuthRefreshApiResponse,
    AuthRefreshResponse,
    emailVerifyService,
    googleLoginService,
    loginService,
    loginSuccessService,
    logoutService,
    nicknameRegistService,
    sendEmailCodeService,
    studentSignupService,
    teacherSignupService,
    tempPwService,
} from '@/app/services/auth/service';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';
import { LoginSuccessActionState, StudentSignupForm, TempPwActionState } from './type';


// 이메일 인증 액션
export const verifyEmailAction = async (
    prevState: any,
    formData: FormData
) => {

    try {

        const email = formData.get('email') as string;
        const code = formData.get('validationCode') as string;

        await emailVerifyService({
            email,
            code,
        });

        return {
            success: true,
            message: '이메일 인증이 완료되었습니다.',
        };

    } catch (error) {

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : '이메일 인증에 실패하였습니다.',
        };
    }
};


// 1. 학생 회원가입 액션
export const studentSignupAction = async (signupData: StudentSignupForm) => {
    try {
        // 이미 껍데기가 순수 JSON 객체이므로 서비스에 바로 주입 가능!
        await studentSignupService(signupData);
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '회원가입에 실패하였습니다.',
        };
    }
    redirect('/auth/login');
};

// 2. 강사 회원가입 액션
export const teacherSignupAction = async (formData: FormData) => {
    console.log('1a')
    try {
        await teacherSignupService(formData);
        console.log('2a')
    } catch (error) {
        console.log('3a error start')
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : '강사 회원가입에 실패하였습니다.',
        };
    }

    console.log('4a action end')
    redirect('/auth/login');
};

// 이메일 인증코드 발송 action

export const sendEmailCodeAction = async (
    prevState: any,
    formData: FormData
) => {

    try {

        const email = formData.get('email') as string;

        const result =
            await sendEmailCodeService({
                email,
            });

        return {
            success: true,
            message: result.data.message,
            expiresIn: result.data.expiresIn,
        };

    } catch (error) {

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : '이메일 인증코드 발송에 실패하였습니다.',
        };
    }
};







// 로그인 액션 함수
export interface LoginActionState {
    timestamp: string;
    status: number;
    code: string;
    message: string;
}

export const loginAction = async (
    email: string,
    password: string
): Promise<LoginActionState> => {

    try {

        const result =
            await loginService({
                email,
                password,
            });

        // 로그인 실패
        if (result.status !== 200) {
            return {
                timestamp:
                    result.timestamp,
                status:
                    result.status,
                code:
                    result.code,
                message:
                    result.message,
            };
        }

        const accessToken =
            result.data?.accessToken;

        const refreshToken =
            result.data?.refreshToken;

        const cookieStore =
            await cookies();

        if (accessToken) {

            cookieStore.set(
                'accessToken',
                accessToken,
                {
                    httpOnly: true,
                    path: '/',
                    maxAge:
                        result.data?.expiresIn,
                }
            );
        }

        if (refreshToken) {

            cookieStore.set(
                'refreshToken',
                refreshToken,
                {
                    httpOnly: true,
                    path: '/',
                    maxAge:
                        60 * 60 * 24 * 7,
                }
            );
        }

        return {
            timestamp:
                result.timestamp,
            status:
                result.status,
            code:
                result.code,
            message:
                result.message,
        };

    } catch (error) {

        return {
            timestamp:
                new Date().toISOString(),
            status: 500,
            code:
                'INTERNAL_SERVER_ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : '로그인에 실패하였습니다.',
        };
    }
};



// 로그인 성공 모달
export const loginSuccessAction = async (): Promise<LoginSuccessActionState> => {

    try {

        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;

        if (!accessToken) {
            return {
                timestamp:
                    new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message:
                    '다시 로그인 해주세요',
            };
        }

        return await loginSuccessService(
            accessToken
        );

    } catch (error) {

        return {
            timestamp:
                new Date().toISOString(),
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : '사용자 정보를 불러오는 데 실패하였습니다.',
        };
    }
};

export const tempPwAction = async (
    prevState: TempPwActionState,
    formData: FormData
): Promise<TempPwActionState> => {

    try {

        const email =
            formData.get('email') as string;


        const result =
            await tempPwService(email);


        return {
            success: true,
            message:
                result.message,
        };

    } catch (error) {

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : '임시 비밀번호 발급에 실패하였습니다.',
        };
    }
};


export type LogoutActionState = {
    success: boolean;
    message: string;
};
export const logoutAction = async (): Promise<LogoutActionState> => {

    try {
        const cookieStore = await cookies();

        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!accessToken || !refreshToken) {
            return {
                success: false,
                message: "다시 로그인 해주세요.",
            };
        }
        await logoutService(accessToken, refreshToken);
        // 쿠키 삭제
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return {
            success: true,
            message: "로그아웃 되었습니다.",
        };

    } catch (error) {

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "로그아웃에 실패하였습니다.",
        };
    }
};


// 로그인 연장 액션 함수
export const authRefreshAction = async (): Promise<AuthRefreshApiResponse> => {

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    // console.log(1)
    if (!refreshToken || !accessToken) {
        throw new Error('로그인 연장 실패');
    }
    // console.log(2)

    const refreshData = await authRefresh(refreshToken, accessToken);
    // console.log(3, refreshData)

    if (refreshData?.data) {
        // console.log(4)
        cookieStore.set('accessToken', refreshData.data.accessToken,
            {
                httpOnly: true,
                maxAge: 60 * 60,
                path: '/',
            }
        );
        // console.log(5)
    }
    // console.log(6)
    return refreshData;
}


// 카카오용 액션 함수
import { kakaoLogin } from "@/app/services/auth/service";

export const handleKakaoLoginCallback = async (code: string) => {
    if (!code) {
        throw new Error("인가 코드가 없습니다.");
    }

    // 1️⃣ 카카오 로그인 API 호출
    const resData = await kakaoLogin(code);

    console.log(resData);

    const cookieStore = await cookies();

    const accessToken = resData?.data?.accessToken;
    const refreshToken = resData?.data?.refreshToken;

    if (accessToken) {
        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60, // 1시간
        });
    }

    if (refreshToken) {
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30일
        });
    }

    // 2️⃣ Google이랑 동일한 응답 구조 유지
    return {
        success: true,
        data: resData.data,
    };
};


// 구글용 액션 함수
export const googleLoginAction = async (code: string) => {
    const response = await googleLoginService(code);

    const tokenData = response.data;

    if (!tokenData) {
        throw new Error('토큰 정보가 존재하지 않습니다.');
    }

    const cookieStore = await cookies();

    cookieStore.set(
        'accessToken',
        tokenData.accessToken,
        {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60,
        }
    );

    cookieStore.set(
        'refreshToken',
        tokenData.refreshToken,
        {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        }
    );

    return response; // 백엔드 응답 그대로
};

// 닉네임 입력모달에서 사용할 닉네임 등록 액션
export interface NicknameRegistResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: {
        nickname: string;
    };
}

export const nicknameRegistAction = async (
    nickname: string
): Promise<NicknameRegistResponse> => {

    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return {
            status: 401,
            message: '로그인이 필요합니다.',
            code: 'FAIL',
            timestamp: new Date().toISOString(),
        };
    }

    return await nicknameRegistService(
        nickname,
        accessToken
    );
};