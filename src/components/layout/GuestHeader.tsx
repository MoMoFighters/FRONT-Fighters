import Image from "next/image";
import Link from "next/link";
import logo from '@/app/assets/img/header_logo.png'
import { Button } from "@/components/ui/button";

export default function GuestHeader() {
    return (
        <header className="h-12 border-b border-slate-200 bg-slate-50">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href='/'>
                    <Image
                        src={logo}
                        alt="MOMOCITY 로고"
                        className="mt-2 ml-6 opacity-80"
                        width={110}
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