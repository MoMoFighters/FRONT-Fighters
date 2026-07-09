import Image from "next/image";
import logo from '@/app/assets/img/logo.png'
import LoginForm from "@/features/auth/components/LoginForm";
import { getOAuthClientConfig } from "@/lib/config/oauth/oauthAPI";

export default function Login() {
    const oauthConfig = getOAuthClientConfig();

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="flex w-full max-w-100 flex-col justify-center gap-4 p-4">
                <div className="flex justify-center mb-4">
                    <Image src={logo} width={160} alt="MOMOCITY 로고" priority />
                </div>

                <LoginForm
                    oauthConfig={oauthConfig}
                />
            </div>
        </div>
    );
}
