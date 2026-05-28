'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPageNav() {

    const pathName = usePathname();
    const [navSelect, setNavSelect] = useState(pathName.split('/').pop())
    // mypage, lectures, reports
    useEffect(() => {
        setNavSelect(pathName.split('/').pop())
    }, [])
    const selectedStyle = "text-slate-900 border-b-2 border-slate-900";
    const defaultStyle = "text-slate-500"

    return (
        <div className="border-b border-slate-200 flex flex-row gap-1">
            <div className="w-3"></div>
            <Link
                href='/student/mypage'
                className={`text-lg font-bold p-3 ${navSelect === 'mypage' ? selectedStyle : defaultStyle}`}
            >
                내 정보
            </Link>
            <Link
                href='/student/mypage/lectures'
                className={`text-lg font-bold p-3 ${navSelect === 'lectures' ? selectedStyle : defaultStyle}`}
            >
                내 강의
            </Link>
            <Link
                href='/student/mypage/reports'
                className={`text-lg font-bold p-3 ${navSelect === 'reports' ? selectedStyle : defaultStyle}`}
            >
                신고 내역
            </Link>
        </div>
    );
}