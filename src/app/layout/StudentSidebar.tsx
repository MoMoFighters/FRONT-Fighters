import Image from 'next/image';
import logo from '../assets/img/header_logo.png'
import profile from '../assets/img/user.svg'
import credit from '../assets/img/credit-card.svg'
import community from '../assets/img/users.svg'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentSidebar() {
    return (
        <aside className="w-60 flex flex-col border-r border-slate-200 bg-slate-50 px-2.5">
            <Image
                src={logo}
                alt="MOMOCITY 로고"
                className="mt-10"
                width={100}
                height={20}
                priority
            />
            <h2 className='text-xl pl-2 text-mauve-500 font-bold'>홍길동 님의 도시</h2>
            <Link href="/student/mypage">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={profile}
                        alt="프로필 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>Profile</p>
                </Button>
            </Link>
            <Link href="/student/payments">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={credit}
                        alt="카드 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>Payments</p>
                </Button>
            </Link>
            <Link href="/student/library">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={community}
                        alt="커뮤니티 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>Community</p>
                </Button>
            </Link>

        </aside>
    );
}