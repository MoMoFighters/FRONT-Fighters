import Image from "next/image";
import Link from "next/link";
import icon from "@/app/icon.png";

const serviceLinks = [
    {
        label: "마이페이지",
        href: "/student/mypage",
    },
    {
        label: "커뮤니티",
        href: "/student/community",
    },
    {
        label: "일정",
        href: "/student/calendar",
    },
];

const policyLinks = [
    "회사소개",
    "이용약관",
    "개인정보처리방침",
];

export default function StudentFooter() {
    return (
        <footer className="shrink-0 bg-indigo-900">
            <div className="px-5 py-10 sm:px-8 lg:px-16 lg:py-12">
                <div className="grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_0.8fr]">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/student" className="inline-flex items-center gap-3">
                            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white">
                                <Image
                                    src={icon}
                                    alt="MoMoCITY 아이콘"
                                    fill
                                    sizes="36px"
                                    className="object-contain"
                                />
                            </span>
                            <span className="text-xl font-bold tracking-tight text-white">
                                MoMo<span className="text-indigo-400">CITY</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-72 text-sm font-medium leading-6 text-slate-300">
                            학습 기록을 도시 성장으로 연결해 꾸준한 배움을 더 즐겁게 만드는 온라인 학습 플랫폼입니다.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-white">
                            서비스
                        </h2>
                        <nav className="mt-5 flex flex-col gap-3">
                            {serviceLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="w-fit text-sm font-medium text-slate-300 transition-colors hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-white">
                            문의
                        </h2>
                        <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-slate-300">
                            <span>
                                yourmomocity@gmail.com
                            </span>
                            <span>
                                02-123-4567
                            </span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-white">
                            소셜
                        </h2>
                        <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-slate-300">
                            <a
                                href="https://github.com/MoMoFighters"
                                target="_blank"
                                rel="noreferrer"
                                className="w-fit transition-colors hover:text-white"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 max-w-6xl border-t border-white/20 pt-7">
                    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {policyLinks.map((label) => (
                            <span
                                key={label}
                                className="text-xs font-semibold text-slate-300"
                            >
                                {label}
                            </span>
                        ))}
                    </nav>

                    <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
                        경기도 성남시 수정구 산성대로 553 박애관 421호/624호
                    </p>

                    <p className="mt-2 text-xs font-medium text-slate-400">
                        © 2026 MomoCity. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
