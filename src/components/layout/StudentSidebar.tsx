import Image from 'next/image';
import profile from '@/app/assets/img/user-round-pen.svg'
import credit from '@/app/assets/img/credit-card.svg'
import community from '@/app/assets/img/users.svg'
import chat from '@/app/assets/img/message-square-more.svg'
import calendar from '@/app/assets/img/calendar-check.svg'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CreateReportBtn from '@/features/report/components/buttons/CreateReportBtn';
import { getMyInfo } from '@/features/user/action';

export default async function StudentSidebar() {

    const myInfo = await getMyInfo();

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
            <Link href="/student"><h2 className='text-xl pl-2 text-mauve-500 font-bold cursor-pointer mt-6'>{myInfo.data?.nickname || "알수없음"} 님의 도시</h2></Link>
            <Link href="/student/mypage">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={profile}
                        alt="프로필 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>Profile</p>
                </Button>
            </Link>
            <Link href="/student/payments">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={credit}
                        alt="카드 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>Payments</p>
                </Button>
            </Link>
            <Link href="/student/community">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={community}
                        alt="커뮤니티 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>Community</p>
                </Button>
            </Link>
            <Link href="/student/phone/friends">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={chat}
                        alt="채팅 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>Chat</p>
                </Button>
            </Link>
            <Link href="/student/phone/calendar">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-3 py-5'>
                    <Image
                        src={calendar}
                        alt="달력 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-[16px] text-slate-900 font-semibold'>Calendar</p>
                </Button>
            </Link>
            <CreateReportBtn />
        </aside>
    );
}