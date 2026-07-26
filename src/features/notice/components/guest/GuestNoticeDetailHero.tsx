import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Notice } from "@/features/notice/type";

interface GuestNoticeDetailHeroProps {
    notice: Notice;
}

const formatNoticeDateTime = (dateTime: string) =>
    dateTime.slice(0, 10).replaceAll("-", ".");

export default function GuestNoticeDetailHero({
    notice,
}: GuestNoticeDetailHeroProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm [container-type:inline-size]">
            <div className="relative bg-linear-to-br from-indigo-500 to-indigo-700 p-[4cqw] text-white">
                <Link
                    href="/"
                    className="inline-flex h-[clamp(1.75rem,6cqw,2.5rem)] items-center gap-[clamp(0.25rem,1cqw,0.375rem)] rounded-full bg-white/15 px-[clamp(0.5rem,2.5cqw,1rem)] text-[clamp(0.75rem,1.6cqw,0.75rem)] font-bold backdrop-blur transition-colors hover:bg-white/25"
                >
                    <ChevronLeft className="h-[clamp(0.75rem,2.5cqw,1rem)] w-[clamp(0.75rem,2.5cqw,1rem)]" />
                    홈으로
                </Link>

                <div className="mt-[3cqw]">
                    <span className="rounded-full bg-white/15 px-[clamp(0.5rem,2cqw,0.75rem)] py-[clamp(0.2rem,0.8cqw,0.25rem)] text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold backdrop-blur">
                        NOTICE
                    </span>
                    <h1 className="mt-[1.5cqw] max-w-3xl text-[clamp(1.125rem,4cqw,2.25rem)] font-bold tracking-tight">
                        {notice.title}
                    </h1>
                    <p className="mt-[1cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-medium text-white/80">
                        {formatNoticeDateTime(notice.createdAt)}
                    </p>
                </div>
            </div>

            <div className="min-h-[48vh] whitespace-pre-wrap p-[4cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] leading-7 text-slate-700">
                {notice.content}
            </div>
        </section>
    );
}
