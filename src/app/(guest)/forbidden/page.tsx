import Image from "next/image";

import errorImg from '@/app/assets/img/error.png'
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import Link from "next/link";

interface MomoJwtPayload {
    roles?: string;
}

export default async function Forbidden() {

    const cookie = await cookies();
    const token = cookie.get('accessToken')?.value;
    const getRole = () => {
        if (!token) {
            redirect('/auth/login');
        }
        if (token) {
            // 옵션 없이 사용하면 페이로드(내용)를 디코딩합니다.
            const decoded = jwtDecode<MomoJwtPayload>(token);
            const { roles } = decoded;
            if (!roles) {
                throw new Error('알 수 없는 에러가 발생했습니다.');
            }
            const parts = roles.split('_');
            const role = parts[1].toLowerCase();
            return role;
        }
    }
    const role = getRole();
    return (
        <div className='relative w-screen min-h-[calc(100vh-140px)] overflow-hidden'>
            <Image src={errorImg} alt='error' priority fill sizes="100vw" className='object-cover' />
            <h1 className='absolute top-60 left-20 text-6xl font-extrabold text-slate-700'>403</h1>
            <div className='absolute w-80 max-w-80 break-all top-80 left-20 text-lg text-slate-500 font-bold'>접근 권한 없음</div>
            <Link href={`/${role}`}>
                <Button
                    className="absolute top-110 left-70 bg-indigo-500 py-2 px-4 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] cursor-pointer transition-all hover:bg-indigo-600">
                    <CornerDownLeft /> 뒤로 가기
                </Button>
            </Link>
            <div className='absolute top-72 left-147 w-14 h-8 bg-[#3F4550] flex justify-center items-center text-white blur-[1px]'>403</div>
        </div>
    );
}
