import Image from "next/image";
import Link from "next/link";

import community from "@/app/assets/img/community.png";
import robot from "@/app/assets/img/robot.png";
import GuestInquiryCard from "@/features/guest/components/GuestInquiryCard";

const COMMUNITY_HREF = "/community";

export default function GuestNoticeAside() {
    return (
        <aside className="sticky top-20 grid grid-cols-1 gap-5 self-start">
            <section className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
                <div className="min-w-0 flex-1">
                    <h2 className="text-[clamp(0.9375rem,4cqw,1rem)] font-bold text-slate-950">
                        커뮤니티
                    </h2>
                    <p className="mt-2 text-[clamp(0.75rem,3cqw,0.75rem)] leading-5 text-slate-600">
                        다양한 사용자들과 학습 경험을 공유하세요.
                    </p>
                    <Link href={COMMUNITY_HREF}>
                        <button className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-indigo-400 bg-white px-3.5 py-2 text-[clamp(0.75rem,3cqw,0.75rem)] font-bold text-indigo-600 transition-colors hover:bg-indigo-50">
                            커뮤니티 보러가기
                        </button>
                    </Link>
                </div>
                <div className="relative h-[clamp(4.5rem,20cqw,6rem)] w-[clamp(5.25rem,23cqw,7rem)] shrink-0 overflow-hidden rounded-xl">
                    <Image src={community} alt="커뮤니티 이미지" fill sizes="112px" />
                </div>
            </section>

            <section className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
                <div className="min-w-0 flex-1">
                    <h2 className="text-[clamp(0.9375rem,4cqw,1rem)] font-bold text-slate-950">
                        AI 학습 도우미
                    </h2>
                    <p className="mt-2 text-[clamp(0.75rem,3cqw,0.75rem)] text-slate-500">
                        언제 어디서나 학습에 도움을 주기 위해 등장해요!
                    </p>
                </div>
                <div className="relative h-[clamp(2.5rem,11cqw,2.75rem)] w-[clamp(3.5rem,16cqw,4rem)] shrink-0 overflow-hidden rounded-lg">
                    <Image src={robot} alt="로봇 이미지" fill sizes="64px" />
                </div>
            </section>

            <GuestInquiryCard />
        </aside>
    );
}
