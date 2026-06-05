import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CreateReportBtn from '@/features/report/components/buttons/CreateReportBtn';
import { CalendarCheck, CreditCard, House, MessageCircleMore, Users } from 'lucide-react';

export default function StudentSidebar() {

    return (
        <aside className="w-48 h-full flex flex-col border-r border-slate-200 bg-slate-50 px-2.5 relative">
            <Link href="/student">
                <Button variant="ghost" className='flex w-43 gap-2 justify-start mt-6 mb-4 py-5'>
                    <House />
                    <p className='text-[14px] text-slate-900'>홈</p>
                </Button>
            </Link>
            <Link href="/student/community">
                <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-4 py-5'>
                    <Users />
                    <p className='text-[14px] text-slate-900'>커뮤니티</p>
                </Button>
            </Link>
            <Link href="/student/phone/friends">
                <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-4 py-5'>
                    <MessageCircleMore />
                    <p className='text-[14px] text-slate-900'>채팅</p>
                </Button>
            </Link>
            <Link href="/student/phone/calendar">
                <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-4 py-5'>
                    <CalendarCheck />
                    <p className='text-[14px] text-slate-900'>일정</p>
                </Button>
            </Link>
            <Link href="/student/payments">
                <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-4 py-5'>
                    <CreditCard />
                    <p className='text-[14px] text-slate-900'>멤버십</p>
                </Button>
            </Link>
            <CreateReportBtn />
        </aside>
    );
}