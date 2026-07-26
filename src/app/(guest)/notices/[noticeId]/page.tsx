import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getNoticeByIdForGuest } from "@/app/services/notice/service";
import GuestNoticeAside from "@/features/notice/components/guest/GuestNoticeAside";
import GuestNoticeDetailHero from "@/features/notice/components/guest/GuestNoticeDetailHero";

interface GuestNoticeDetailPageProps {
    params: Promise<{
        noticeId: string;
    }>;
}

export const generateMetadata = async ({
    params,
}: GuestNoticeDetailPageProps): Promise<Metadata> => {
    const { noticeId } = await params;

    try {
        const notice = await getNoticeByIdForGuest(noticeId);

        return {
            title: `${notice.title} | 모모시티 공지사항`,
            description: notice.content?.slice(0, 100),
        };
    } catch {
        return {
            title: "공지사항 | 모모시티",
            description: "모모시티 공지사항 상세 페이지입니다.",
        };
    }
};

export default async function GuestNoticeDetailPage({
    params,
}: GuestNoticeDetailPageProps) {
    const { noticeId } = await params;

    if (!/^\d+$/.test(noticeId)) {
        notFound();
    }

    const notice = await getNoticeByIdForGuest(noticeId);

    if (!notice) {
        notFound();
    }

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] md:px-16">
            <section className="min-w-0">
                <GuestNoticeDetailHero notice={notice} />
            </section>

            <GuestNoticeAside />
        </main>
    );
}
