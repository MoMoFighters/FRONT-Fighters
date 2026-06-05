import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutBtn from "@/components/common/LogoutBtn";
import AuthRefreshArea from "@/features/auth/components/AuthRefreshArea";
import { cookies } from "next/headers";
import { jwtDecode } from 'jwt-decode';
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from '@/app/assets/img/logo.png'


export default async function AUthHeader({ role }: { role: string }) {

    const cookieStore = await cookies();

    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        redirect('/auth/login')
    };

    const payload = jwtDecode<{ exp: number }>(token);

    const initialTime = Math.max(
        0,
        payload.exp - Math.floor(Date.now() / 1000)
    );

    return (
        <header className="h-14 border-b border-slate-200 bg-slate-50 opacity-90">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href={`/${role}`} className="flex items-center">
                    <Image
                        src={logo}
                        alt="로고"
                        width={100}
                    />
                </Link>
                <div className="flex justify-end mr-4 items-center">
                    <AuthRefreshArea initialTime={initialTime} />
                    <Link href={`/${role}`}>
                        <Button variant="ghost" className="text-xs">홈</Button>
                    </Link>
                    {role === "student" && <Link href={`/${role}/mypage`}>
                        <Button variant="ghost" className="text-xs">마이페이지</Button>
                    </Link>}
                    <LogoutBtn />
                </div>
            </div>
        </header>
    );
}