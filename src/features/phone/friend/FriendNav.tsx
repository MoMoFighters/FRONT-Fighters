import Link from "next/link";

interface friendStatus {
    mode: 'friend' | 'recieved' | 'sent' | 'search' | 'blacklist';
}

export default function FriendNav({ mode }: friendStatus) {

    return (
        <div className="flex flex-row">
            <div className="w-3 py-2 bg-slate-200"></div>
            <div className={`px-6 py-2 ${mode === 'friend' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
                <Link href='/student/phone/friends' className={mode === 'friend' ? 'font-bold' : ''}>내 친구</Link>
            </div>
            <div className={`px-6 py-2 ${mode === 'recieved' ? 'border-b-black border-b-3 bg-slate-300' : ' bg-slate-200'}`}>
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
            </div>
            <div className="flex-1 py-2 bg-slate-200"></div>
        </div>
    );
}