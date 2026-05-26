import Image from "next/image";
import logo from '@/app/assets/img/header_logo.png'
import SignupForm from "@/features/auth/SignupForm";

export default function Signup() {
    return (
        <div className="flex items-center justify-center min-h-max">
            <div className="p-4 flex flex-col gap-4 justify-center align-middle max-w-md w-full mx-auto">
                <div className="flex justify-center">
                    <Image src={logo} width={180} alt="MOMOCITY 로고" priority />
                </div>

                <SignupForm />
            </div>
        </div>
    );
}