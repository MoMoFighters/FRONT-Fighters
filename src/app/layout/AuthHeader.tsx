import Image from "next/image";
import Link from "next/link";
import logo from '../assets/img/header_logo.png'
import { Button } from "@/components/ui/button";

export default function AUthHeader({ role }: { role: string }) {
    return (
        <header className="h-16 border-b border-slate-200 bg-slate-50">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href={`/${role}`} className="flex items-center">
                    <Image
                        src={logo}
                        alt="MOMOCITY 로고"
                        className="mt-3"
                        width={180}
                        height={40}
                        priority
                    />
                </Link>
                <div className="flex gap-2 mr-4">
                    <Link href={`/${role}`}>
                        <Button variant="ghost">홈</Button>
                    </Link>
                    <Button variant="ghost">로그아웃</Button>
                </div>
            </div>
        </header>
    );
}