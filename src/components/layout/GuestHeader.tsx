import Image from "next/image";
import Link from "next/link";
import logo from '@/app/assets/img/logo.png'
import { Button } from "@/components/ui/button";

export default function GuestHeader() {
    return (
        <header className="w-full h-14 border-b border-slate-200 bg-white fixed top-0 left-0 z-40">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href='/' className="relative ml-6 w-24 h-4">
                    <Image
                        src={logo}
                        alt="MOMOCITY 로고"
                        fill
                        priority
                    />
                </Link>
                <div className="flex gap-1 mr-4">
                    <Link href="/auth/login">
                        <Button variant="ghost" className="text-xs">로그인</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button variant="ghost" className="text-xs">회원가입</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}