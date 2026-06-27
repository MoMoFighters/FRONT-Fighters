import { redirect } from "next/navigation";

export function GET() {
    const clientId = process.env.NAVER_CLIENT_ID;
    const redirectUri = process.env.NAVER_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        throw new Error("네이버 OAuth 환경 변수가 설정되지 않았습니다.");
    }

    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri,
        state: crypto.randomUUID(),
    });

    redirect(`https://nid.naver.com/oauth2.0/authorize?${params.toString()}`);
}
