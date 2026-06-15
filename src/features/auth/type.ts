import { UserCategory, UserRole, UserStatus } from "../user/type";

// 카카오 api 용
export interface KakaoLoginResponse {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    expiresIn: number;
}

// 로그인 성공 모달에서 api 호출 시 응답값
export interface LoginSuccessResponse {
    role: UserRole;
    is_tempPwd: boolean;
    nickname: string | null;

    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
    //아래꺼랑 합쳐라
}
// 로그인 시도 시 응답 값
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    expiresIn: number;
}

// 로그인 시도 시 보낼 값
export interface LoginRequest {
    email: string;
    password: string;
}

// // 이메일 인증 코드 발송
// export interface SendEmailCodeRe {
//     email: string;
// }


// 이메일 인증 코드 발송 시 응답값
export interface SendEmailCodeResponse {
    isDuplicated: boolean;
    expiresIn: number;
}

// 이메일 인증코드 검증 입력값
export interface EmailVerifyRequest {
    email: string;
    code: string;
}

// 학생 회원가입 입력값
export interface StudentSignupFormRequest {
    email: string;
    password: string;
    name: string;
}

// 강사 회원가입 입력값
export interface TeacherSignupForm {
    email: string;
    password: string;
    name: string;
    category: UserCategory;
    proof: File[];
}