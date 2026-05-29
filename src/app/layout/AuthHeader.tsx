import Image from "next/image";
import Link from "next/link";
import logo from '../assets/img/header_logo.png'
import { Button } from "@/components/ui/button";
import LogoutBtn from "@/components/common/LogoutBtn";
import AuthRefreshArea from "@/features/auth/components/AuthRefreshArea";
import { cookies } from "next/headers";
import { jwtDecode } from 'jwt-decode';


export default async function AUthHeader({ role }: { role: string }) {

    const cookieStore = await cookies();

    const token = cookieStore.get('accessToken')?.value;

    if (!token) return null;

    const payload = jwtDecode<{ exp: number }>(token);

    return (
        <header className="h-16 border-b border-slate-200 bg-slate-50">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href={`/${role}`} className="flex items-center">
                    <Image
                        src={logo}
                        alt="MOMOCITY 로고"
                        className="mt-3"
                        width={150}
                        height={20}
                        priority
                    />
                </Link>
                <div className="flex justify-end gap-2 mr-4 items-center">
                    <AuthRefreshArea expiresAt={payload.exp} />
                    <Link href={`/${role}`}>
                        <Button variant="ghost">홈</Button>
                    </Link>
                    <LogoutBtn />
                </div>
            </div>
        </header>
    );
}