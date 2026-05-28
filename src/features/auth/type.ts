// 카카오 api 용
export interface KakaoLoginResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}