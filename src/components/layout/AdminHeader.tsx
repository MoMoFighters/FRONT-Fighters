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
        <header className="h-14 border-b border-slate-100 bg-white">
            <div className="flex h-full w-full items-center justify-between pl-4 pr-8">
                <Link href="/admin" className="flex items-center">
                    <Image
                        src={logo}
                        alt="MOMOCITY 로고"
                        width={100}
                    />
                </Link>
                <div className="flex items-center justify-end">
                    <LogoutBtn iconOnly />
                </div>
            </div>
        </header>
    );
}
