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
                <div className="flex justify-end gap-2 mr-4 items-center">
                    <Link href={`/${role}`}>
                        <span className="text-slate-500 text-xs mr-4">자동 로그아웃 시간 :</span>
                        <span className="text-slate-500 text-xs mr-1">59:59</span>
                        <Button variant="outline" className="rounded-none text-slate-500 text-xs h-6 mr-4">연장</Button>
                        <Button variant="ghost">홈</Button>
                    </Link>
                    <Button variant="ghost">로그아웃</Button>
                </div>
            </div>
        </header>
    );
}