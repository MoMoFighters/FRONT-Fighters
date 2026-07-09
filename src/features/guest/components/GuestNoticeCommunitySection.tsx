import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Notice } from "@/features/notice/type";
import community from '@/app/assets/img/community.png'
import robot from '@/app/assets/img/robot.png'
import GuestInquiryCard from "./GuestInquiryCard";

const COMMUNITY_HREF = "/auth/login";

const notices: Notice[] = [
  {
    noticeId: 1,
    title: "서비스 정식 오픈 안내",
    content: "모모시티 서비스 정식 오픈 안내입니다.",
    isPinned: true,
    createdAt: "2026-07-08T09:00:00",
    updatedAt: "2026-07-08T09:00:00",
  },
  {
    noticeId: 2,
    title: "강의 카테고리 업데이트 예정",
    content: "강의 카테고리 업데이트 예정 안내입니다.",
    isPinned: false,
    createdAt: "2026-07-07T09:00:00",
    updatedAt: "2026-07-07T09:00:00",
  },
  {
    noticeId: 3,
    title: "커뮤니티 이용 가이드",
    content: "커뮤니티 이용 가이드 안내입니다.",
    isPinned: false,
    createdAt: "2026-07-05T09:00:00",
    updatedAt: "2026-07-05T09:00:00",
  },
  {
    noticeId: 4,
    title: "학습 기록 반영 기준 안내",
    content: "학습 기록 반영 기준 안내입니다.",
    isPinned: false,
    createdAt: "2026-07-03T09:00:00",
    updatedAt: "2026-07-03T09:00:00",
  },
];

const formatNoticeDate = (dateTime: string) => dateTime.slice(0, 10).replaceAll("-", ".");

export default function GuestNoticeCommunitySection() {
  return (
    <section className="bg-white pt-2 pb-10 sm:pt-4 sm:pb-12">
      <div className="grid grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-16">
        <div className="rounded-md border border-slate-200 bg-white p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold text-indigo-500">
                NOTICE
              </p>
              <h2 className="text-lg font-bold text-slate-950">
                공지사항
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 transition-colors hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-medium text-slate-900">1</span>
              <span>/</span>
              <span>3</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 transition-colors hover:bg-slate-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border-y border-slate-100">
            {notices.map((notice) => (
              <Link
                key={notice.noticeId}
                href="#"
                className={`group flex items-start justify-between gap-3 border-b border-slate-100 px-2 py-3.5 transition-colors last:border-b-0 sm:items-center sm:gap-5 ${notice.isPinned
                  ? "border-l-3 border-l-indigo-500 bg-indigo-50/50 hover:bg-indigo-50"
                  : "hover:bg-slate-50"
                  }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {notice.isPinned && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  )}
                  <p
                    className={`truncate text-xs font-semibold transition-colors group-hover:text-indigo-500 ${notice.isPinned ? "text-indigo-950" : "text-slate-800"
                      }`}
                  >
                    {notice.title}
                  </p>
                </div>
                <time
                  className={`shrink-0 pt-0.5 text-[11px] sm:pt-0 sm:text-xs ${notice.isPinned ? "font-medium text-indigo-400" : "text-slate-400"
                    }`}
                >
                  {formatNoticeDate(notice.createdAt)}
                </time>
              </Link>
            ))}
          </div>
        </div>

        <aside className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:block lg:space-y-5">
          <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-950">
                커뮤니티
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                다양한 사용자들과 학습 경험을 공유하세요.
              </p>
              <Link href={COMMUNITY_HREF}>
                <button className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-indigo-400 bg-white px-3.5 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50">
                  커뮤니티 보러가기
                </button>
              </Link>
            </div>
            <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={community}
                alt="커뮤니티 이미지"
                fill
                sizes="112px"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-slate-950">
                AI 학습 도우미
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                언제 어디서나 학습에 도움을 주기 위해 등장해요!
              </p>
            </div>
            <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={robot}
                alt="로봇 이미지"
                fill
                sizes="64px"
              />
            </div>
          </div>

          <GuestInquiryCard />
        </aside>
      </div>
    </section>
  );
}
