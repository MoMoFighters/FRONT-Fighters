import AuthPageShell from "@/features/auth/components/AuthPageShell";
import LoginForm from "@/features/auth/components/LoginForm";
import { getOAuthClientConfig } from "@/lib/config/oauth/oauthAPI";

export default function Login() {
    const oauthConfig = getOAuthClientConfig();

    return (
        <AuthPageShell
            title="모모시티 로그인"
            description="로그인 후 강의를 수강하고 나만의 도시를 성장시켜보세요."
        >
            <LoginForm
                oauthConfig={oauthConfig}
            />
        </AuthPageShell>
    );
}
