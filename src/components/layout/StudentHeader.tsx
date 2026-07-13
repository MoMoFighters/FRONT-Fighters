import Link from "next/link";
import AuthRefreshArea from "@/features/auth/components/AuthRefreshArea";
import { cookies } from "next/headers";
import { jwtDecode } from 'jwt-decode';
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from '@/app/assets/img/logo.png'
import { getMyInfo } from "@/features/user/action";
import HeaderProfileCard from "./HeaderProfileCard";
import HeaderNotificationZone from "@/features/user/components/notification/HeaderNotificationZone";


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
        <header className="fixed top-0 left-0 z-50 h-14 w-screen border-b border-slate-200 bg-white">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href={`/${role}`} className="relative ml-6 w-24 h-4">
                    <Image
                        src={logo}
                        alt="MOMOCITY 로고"
                        fill
                        priority
                        sizes="96px"
                    />
                </Link>
                <div className="flex justify-end mr-4 items-center">
                    <AuthRefreshArea initialTime={initialTime} />
                    <HeaderNotificationZone accessToken={token} />
                    <HeaderProfileCard
                        role={role}
                        profileImageUrl={myInfo.data?.profileImageUrl}
                        nickname={myInfo.data?.nickname ?? "모모시민"}
                        membership={myInfo.data?.membership || 'BASIC'}
                        mode='student'
                    />
                </div>
            </div>
        </header>
    );
}
