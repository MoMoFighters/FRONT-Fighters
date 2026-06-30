export interface OAuthClientConfig {
    googleAuthLink: string;
    kakaoRedirectUri: string;
    javascriptKey: string;
}

const createGoogleAuthLink = () => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? "",
        response_type: "code",
        scope: "openid email profile",
        prompt: "select_account",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const getOAuthClientConfig = (): OAuthClientConfig => ({
    googleAuthLink: createGoogleAuthLink(),
    kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI ?? "",
    javascriptKey: process.env.JAVASCRIPT_KEY ?? "",
});
