'use client'

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CircleDollarSign, FolderOpen, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {

    const pathname = usePathname();

    return (
        <aside className="w-48 h-full flex flex-col border-r border-slate-100 bg-white px-2.5 relative">
            <div className='flex gap-2 items-center justify-start mt-6 text-md text-slate-700 font-bold'>
                <ShieldCheck />
                <p>Admin Mode</p>
            </div>
            <Link href="/admin">
                <Button
                    variant="ghost"
                    className={`flex relative w-44 gap-2 justify-start mt-4 py-4 text-[14px] text-slate-900 font-semibold ${pathname === "/admin" && 'bg-slate-100'}`}>
                    <LayoutDashboard />
                    <p>대시보드</p>
                    {pathname === "/admin" && <div className='bg-slate-400 w-1 h-full absolute top-0 right-0'></div>}
                </Button>
            </Link>
            <Link href="/admin/users">
                <Button
                    variant="ghost"
                    className={`flex relative w-44 gap-2 justify-start mt-4 py-4 text-[14px] text-slate-900 font-semibold ${pathname === "/admin/users" && 'bg-slate-100'}`}>
                    <Users />
                    <p>회원 관리</p>
                    {pathname === "/admin/users" && <div className='bg-slate-400 w-1 h-full absolute top-0 right-0'></div>}
                </Button>
            </Link>
            <Link href="/admin/lectures">
                <Button
                    variant="ghost"
                    className={`flex relative w-44 gap-2 justify-start mt-4 py-4 text-[14px] text-slate-900 font-semibold ${pathname === "/admin/lectures" && 'bg-slate-100'}`}>
                    <FolderOpen />
                    <p>강의 관리</p>
                    {pathname === "/admin/lectures" && <div className='bg-slate-400 w-1 h-full absolute top-0 right-0'></div>}
                </Button>
            </Link>
            <Link href="/admin/sales">
                <Button
                    variant="ghost"
                    className={`flex relative w-44 gap-2 justify-start mt-4 py-4 text-[14px] text-slate-900 font-semibold ${pathname === "/admin/sales" && 'bg-slate-100'}`}>
                    <CircleDollarSign />
                    <p>매출 관리</p>
                    {pathname === "/admin/sales" && <div className='bg-slate-400 w-1 h-full absolute top-0 right-0'></div>}
                </Button>
            </Link>
        </aside>
    );
}