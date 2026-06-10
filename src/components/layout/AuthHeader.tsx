import Link from "next/link";
import AuthRefreshArea from "@/features/auth/components/AuthRefreshArea";
import { cookies } from "next/headers";
import { jwtDecode } from 'jwt-decode';
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from '@/app/assets/img/logo.png'
import { getMyInfo } from "@/features/user/action";
import HeaderProfileCard from "./HeaderProfileCard";


export default async function AuthHeader({ role }: { role: string }) {

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

    const myInfo = await getMyInfo();

    return (
        <header className="z-50 h-14 border-b border-slate-200 bg-white">
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
                    <HeaderProfileCard
                        role={role}
                        profileImageUrl={myInfo.data?.profileImageUrl}
                        nickname={myInfo.data?.nickname ?? "모모시민"}
                        isPaid={myInfo.data?.isPaid ?? false}
                    />
                </div>
            </div>
        </header>
    );
}