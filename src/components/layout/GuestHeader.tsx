import Image from "next/image";
import Link from "next/link";
import logo from '@/app/assets/img/logo.png'
import { Button } from "@/components/ui/button";

const guestNavItems = [
    {
        label: "소개",
        href: "/about",
    },
    {
        label: "강의",
        href: "/lectures",
    },
    {
        label: "커뮤니티",
        href: "/auth/login",
    },
];

export default function GuestHeader() {
    return (
        <header className="w-full h-14 border-b border-slate-200 bg-white fixed top-0 left-0 z-40">
            <div className="flex h-full w-full items-center justify-between px-2">
                <div className="flex items-center gap-10">
                    <Link href='/' className="relative ml-6 h-4 w-24">
                        <Image
                            src={logo}
                            alt="MOMOCITY 로고"
                            fill
                            priority
                        />
                    </Link>

                    <nav className="flex items-center gap-7">
                        {guestNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-500"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mr-4 flex items-center gap-2">
                    <Link href="/auth/login">
                        <Button variant="ghost" className="h-9 px-4 text-xs font-semibold">로그인</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button className="h-9 rounded-lg bg-indigo-500/90 px-4 text-xs font-semibold text-white hover:bg-indigo-500">회원가입</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
