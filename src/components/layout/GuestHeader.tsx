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
        href: "/community",
    },
    {
        label: "멤버십",
        href: "/membership",
    },
];

export default function GuestHeader() {
    return (
        <header className="w-full h-14 border-b border-slate-200 bg-white fixed top-0 left-0 z-40">
            <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-6 lg:gap-10">
                    <Link href='/' className="relative h-4 w-24 shrink-0">
                        <Image
                            src={logo}
                            alt="MOMOCITY 로고"
                            fill
                            priority
                        />
                    </Link>

                    <nav className="hidden items-center gap-7 md:flex">
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

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <Link href="/auth/login">
                        <Button variant="ghost" className="h-9 px-2.5 text-xs font-semibold sm:px-4">로그인</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button className="h-9 rounded-lg bg-indigo-500/90 px-2.5 text-xs font-semibold text-white hover:bg-indigo-500 sm:px-4">회원가입</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
