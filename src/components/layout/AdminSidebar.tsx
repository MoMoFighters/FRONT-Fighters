import Image from 'next/image';
import logo from '../assets/img/header_logo.png'
import admin from '@/app/assets/img/admin.svg'
import dashboard from '@/app/assets/img/layout-dashboard.svg'
import community from '@/app/assets/img/users.svg'
import folder from '@/app/assets/img/folder-open.svg'
import money from '@/app/assets/img/receipt.svg'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminSidebar() {
    return (
        <aside className="w-60 h-full flex flex-col border-r border-slate-200 bg-slate-50 px-2.5 relative">
            {/* <Image
                src={logo}
                alt="MOMOCITY 로고"
                className="mt-10"
                width={100}
                height={20}
                priority
            /> */}
            <div className='flex gap-2.5 justify-start mt-6'>
                <Image
                    src={admin}
                    alt="대시보드 아이콘"
                    priority
                />
                <h2 className='text-xl text-green-400 font-bold'>Admin Mode</h2>
            </div>
            <Link href="/admin">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={dashboard}
                        alt="대시보드 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>대시보드</p>
                </Button>
            </Link>
            <Link href="/admin/users">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={community}
                        alt="회원 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>회원 관리</p>
                </Button>
            </Link>
            <Link href="/admin/lectures">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={folder}
                        alt="폴더 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>강의 관리</p>
                </Button>
            </Link>
            <Link href="/admin/sales">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={money}
                        alt="달러 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px]  text-slate-900 font-semibold'>매출 관리</p>
                </Button>
            </Link>

        </aside>
    );
}