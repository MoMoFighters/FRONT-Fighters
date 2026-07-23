"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface MobileSidebarToggleProps {
    children: React.ReactNode;
}

// 모바일에서는 우측 하단 플로팅 버튼으로 접혀있다가, 누르면 본문 위로 떠서 덮는 오버레이 사이드바가 되고
// md 이상에서는 기존처럼 sticky 사이드바로 항상 보인다.
export default function MobileSidebarToggle({ children }: MobileSidebarToggleProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "마이페이지 메뉴 닫기" : "마이페이지 메뉴 열기"}
                className="fixed left-4 top-[72px] z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-600 md:hidden"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* [변경] 어두운 배경 딤 처리 제거 — 대신 바깥 클릭 감지용 투명 레이어만 유지 (드롭다운 느낌) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    z-20 w-48 rounded-3xl border border-slate-200 bg-white shadow-xl
                    fixed left-4 top-[132px] max-h-[65vh] overflow-y-auto transition-all duration-200
                    ${isOpen
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-4 opacity-0"
                    }
                    md:sticky md:top-22 md:z-20 md:inset-auto md:mb-auto md:w-[187px] md:max-h-none
                    md:translate-y-0 md:overflow-visible md:opacity-100 md:pointer-events-auto
                `}
            >
                {children}
            </aside>
        </>
    );
}
