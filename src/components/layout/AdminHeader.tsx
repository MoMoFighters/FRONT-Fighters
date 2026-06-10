import Link from "next/link";
import LogoutBtn from "@/components/common/LogoutBtn";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from '@/app/assets/img/logo.png'


export default async function AdminHeader() {

    const cookieStore = await cookies();

    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        redirect('/auth/login')
    };

    return (
        <header className="h-14 border-b border-slate-100 bg-white opacity-90">
            <div className="flex h-full w-full justify-between items-center px-2">
                <Link href="/admin" className="flex items-center">
                    <Image
                        src={logo}
                        alt="로고"
                        width={100}
                    />
                </Link>
                <div className="flex justify-end mr-4 items-center">
                    <LogoutBtn />
                </div>
            </div>
        </header>
    );
}