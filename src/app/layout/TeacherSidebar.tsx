import Image from 'next/image';
import logo from '../assets/img/header_logo.png'
import home from '../assets/img/house.svg'
import folder from '../assets/img/folder-open.svg'
import community from '../assets/img/users.svg'
import chat from '../assets/img/message-circle.svg'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TeacherSidebar() {
    return (
        <aside className="w-60 flex flex-col border-r border-slate-200 bg-slate-50 px-2.5 relative">
            <Image
                src={logo}
                alt="MOMOCITY 로고"
                className="mt-10"
                width={100}
                height={20}
                priority
            />
            <h2 className='text-xl pl-2 text-mauve-500 font-bold'>홍길동 강사님</h2>
            <Link href="/teacher">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={home}
                        alt="홈 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>홈</p>
                </Button>
            </Link>
            <Link href="/teacher/lectures">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={folder}
                        alt="폴더 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>내 강의</p>
                </Button>
            </Link>
            <Link href="/teacher/community">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={community}
                        alt="커뮤니티 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>커뮤니티</p>
                </Button>
            </Link>
            <Link href="/teacher/ask">
                <Button variant="ghost" className='flex w-55 gap-2.5 justify-start mt-5 py-5'>
                    <Image
                        src={chat}
                        alt="채팅 아이콘"
                        className="my-2.5"
                        priority
                    />
                    <p className='text-lg text-slate-900 font-semibold'>1:1 문의</p>
                </Button>
            </Link>
            <Button variant="destructive" className='absolute w-15 bottom-5 right-5'>신고</Button>

        </aside>
    );
}