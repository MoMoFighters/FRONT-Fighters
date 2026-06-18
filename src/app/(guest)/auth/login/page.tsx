import Image from "next/image";
import logo from '@/app/assets/img/logo.png'
import LoginForm from "@/features/auth/components/LoginForm";

export default function Login() {
    return (
        <>
            <div className="p-4 flex flex-col gap-4 justify-center align-middle max-w-100 mx-auto mt-30 ">
                <div className="flex justify-center mb-4">
                    <Image src={logo} width={160} alt="MOMOCITY 로고" priority />
                </div>

                <LoginForm />
            </div>
        </>
    );
}