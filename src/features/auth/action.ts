'use server'

import {
    authRefresh,
    AuthRefreshResponse,
    emailVerifyService,
    loginService,
    loginSuccessService,
    logoutService,
    sendEmailCodeService,
    studentSignupService,
    teacherSignupService,
    tempPwService,
} from '@/app/services/auth/service';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';
import { LoginActionState, LoginSuccessActionState, StudentSignupForm, TempPwActionState } from './type';


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


// 1. 학생 회원가입 액션 (JSON 데이터를 직접 매개변수로 수신)
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

// 2. 강사 회원가입 액션 (기존 FormData를 그대로 수신)
export const teacherSignupAction = async (formData: FormData) => {
    try {
        const signupData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            proof: formData.get('proof') as File, // 파일 객체 파싱
        };

        await teacherSignupService(signupData);
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '강사 회원가입에 실패하였습니다.',
        };
    }
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








export const loginAction = async (
    prevState: LoginActionState,
    formData: FormData
): Promise<LoginActionState> => {

    try {

        const email =
            formData.get('email') as string;

        const password =
            formData.get('password') as string;


        const result = await loginService({
            email,
            password,
        });

        const accessToken =
            result.data?.accessToken;

        const refreshToken =
            result.data?.refreshToken;


        const cookieStore =
            await cookies();
        console.log(accessToken)

        // access token 저장
        if (accessToken) {

            cookieStore.set('accessToken', accessToken,
                {
                    httpOnly: true,
                    path: '/',
                    maxAge:
                        result.data?.expiresIn,
                }
            );
        }


        // refresh token 저장
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


        // 성공 메시지만 반환
        return {
            success: true,
            message:
                result.message ||
                '로그인에 성공하였습니다.',
        };

    } catch (error) {

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : '로그인에 실패하였습니다.',
        };
    }
};

// 로그인 성공 모달
// actions/auth/auth-action.ts








export const loginSuccessAction = async (): Promise<LoginSuccessActionState> => {

    try {
        const cookieStore =
            await cookies();
        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;
        // 토큰 없음
        if (!accessToken) {
            return {
                success: false,
                message:
                    '다시 로그인 해주세요',
            };
        }
        const result = await loginSuccessService(accessToken);
        console.log(result)
        return {
            success: true,

            message:
                '사용자 정보를 불러왔습니다.',

            data: {
                role:
                    result.data!.role,

                is_temp:
                    result.data!.is_temp,

                nickname:
                    result.data!.nickname,
            },
        };

    } catch (error) {

        return {
            success: false,
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

        console.log("1. ACTION START");
        console.log("2. tokens:", accessToken, refreshToken);

        // 토큰 없으면 바로 처리
        if (!accessToken || !refreshToken) {
            return {
                success: false,
                message: "다시 로그인 해주세요.",
            };
        }
        console.log("3. BEFORE SERVICE");
        // 서버 로그아웃 요청
        await logoutService(accessToken, refreshToken);
        console.log("4. AFTER SERVICE");
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

export const authRefreshAction = async (): Promise<AuthRefreshResponse> => {

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
        throw new Error('로그인 연장 실패!');
    }

    const refreshData = await authRefresh(refreshToken);

    if (refreshData) {
        cookieStore.delete('accessToken');
        cookieStore.set('accessToken', refreshData.accessToken, {
            httpOnly: true,     // 자바스크립트 접근 불가 (XSS 방지)
            maxAge: 60 * 60,    // 1시간
            path: '/'
        })
    }
    return refreshData;
}