import Image from "next/image";
import Link from "next/link";
import user from '@/app/assets/img/user.svg'

interface friendStatus {
    mode: 'friend' | 'recieved' | 'sent' | 'search' | 'blacklist' | 'request';
}

export default function FriendNav({ mode }: friendStatus) {

    return (
        <div className="flex flex-row">
            <div className="w-3 py-2 bg-slate-200"></div>
            <div className={`px-6 py-2 ${mode === 'friend' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends' className={mode === 'friend' ? 'font-bold' : ''}>내 친구</Link>
            </div>
            {/* <div className={`px-6 py-2 ${mode === 'recieved' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends/recieved' className={mode === 'recieved' ? 'font-bold' : ''}>받은 요청</Link>
            </div>
            <div className={`px-6 py-2 ${mode === 'sent' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends/sent' className={mode === 'sent' ? 'font-bold' : ''}>보낸 요청</Link>
            </div>
            <div className={`px-6 py-2 ${mode === 'search' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends/search' className={mode === 'search' ? 'font-bold' : ''}>친구 찾기</Link>
            </div>
            <div className={`px-6 py-2 ${mode === 'blacklist' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends/blacklist' className={mode === 'blacklist' ? 'font-bold' : ''}>블랙리스트</Link>
            </div> */}
            <div className={`px-6 py-2 ${mode === 'request' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends/request' className={mode === 'request' ? 'font-bold' : ''}>요청 관리</Link>
            </div>
            <div className="flex-1 py-2 bg-slate-200"></div>
            <div className="bg-slate-200 pr-2 py-auto flex justify-center">
                <Image src={user} alt='친구추가'></Image>
                <p className="font-bold">+</p>
            </div>
            {/* <div className="fixed w-259 h-123 bg-gray-700/70 flex justify-center align-middle ">
                <div className="flex w-120 h-80 bg-white flex-col p-4 gap-1 my-auto">
                    <div className="flex flex-row">
                        <h1>친구 찾기</h1>
                        <div className="flex-1"></div>
                        <p>x</p>
                    </div>
                    <input type="text" placeholder="닉네임으로 검색" className="border border-black rounded" />
                </div>
            </div> */}
        </div>
    );
}