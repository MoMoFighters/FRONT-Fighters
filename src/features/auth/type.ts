// 카카오 api 용
export interface KakaoLoginResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

// 로그인 성공 모달에서 api 호출 시 응답값
export interface LoginSuccessResponse {
    success: boolean;

    data?: {
        role: string;
        is_temp: boolean;
        nickname: string | null;
    };

    message?: string;
}

// 로그인 시도 시 보낼 값
export interface LoginRequest {
    email: string;
    password: string;
}
// 로그인 시도 시 응답 값
export interface LoginResponse {
    data?: {
        accessToken: string;
        refreshToken: string;
        status: string;
        expiresIn: number;
        is_temp?: boolean;
    };
    message: string;
    timestamp: string;
    status: number;
    code: 'PENDING' | "REJECTED" | "BANNED" | "DELETED" | "ACTIVE" | "BLACK"
}

// 이메일 인증 코드 발송
export interface SendEmailCodeForm {
    email: string;
}

// 이메일 인증 코드 발송 시 응답값
export interface SendEmailCodeResponse {
    success: boolean;
    data: {
        isDuplicated: boolean;
        message: string;
        expiresIn: number;
    };
}

// 강사 회원가입 입력값
export interface StudentSignupForm {
    email: string;
    password: string;
    name: string;
}

// 강사 회원가입 입력값
export interface TeacherSignupForm {
    email: string;
    password: string;
    name: string;
    category: string;
    proof?: File;
}

// 이메일 인증코드 검증 입력값
export interface EmailVerifyForm {
    email: string;
    code: string;
}

// 로그인 성공 모달에서 클릭 시 응답값
export interface LoginSuccessActionState {
    success: boolean;
    message: string;

    data?: {
        role: string;
        is_temp: boolean;
        nickname: string | null;
    };
}

// 로그인 시도 시 입력값
export interface LoginActionState {
    success: boolean;
    message: string;
}

// 임시 비번 응답값
export interface TempPwResponse {
    success: boolean;
    message: string;
}

// 임시 비번 발급 시 응답값
export interface TempPwActionState {
    success: boolean;
    message: string;
}