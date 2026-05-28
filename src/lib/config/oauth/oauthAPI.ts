// 구글 api 연동 로그인 관련
export const GOOGLE_AUTH_LINK =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=email profile`;


// 카카오 api 연동 로그인 관련
export const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
export const kakaoRedirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
export const kakaoAuthLink = ``;
export const javascriptkey = process.env.NEXT_PUBLIC_JAVASCRIPT_KEY;