import Image from "next/image";
import Link from "next/link";
import logo from '@/app/assets/img/header_logo.png'
import EmailInputModal from "@/features/auth/components/EmailInputModal";
import LoginForm from "@/features/auth/components/LoginForm";

export default function Login() {
    return (
        <>
            <div className="p-4 flex flex-col gap-4 justify-center align-middle max-w-md mx-auto mt-20 ">
                <div className="flex justify-center">
                    <Image src={logo} width={180} alt="MOMOCITY 로고" priority />
                </div>

                <LoginForm />

                {/* <hr className="border-0.5 border-slate-300" />
                <div className="flex flex-row justify-center gap-7">
                    <EmailInputModal />
                    <Link href='/auth/signup'>
                        <p className="text-left text-slate-400">회원가입</p>
                    </Link>
                </div> */}
            </div>
        </>
    );
}