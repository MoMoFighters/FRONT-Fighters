import Link from "next/link";
import { ArrowLeft, FileText, UserRound } from "lucide-react";

import AdminUserReportCount from "@/features/user/components/admin/AdminUserReportCount";
import AdminUserReportLog from "@/features/user/components/admin/AdminUserReportLog";
import AdminUserStatusBadge from "@/features/user/components/admin/AdminUserStatusBadge";
import PendingTeacherReviewPanel from "@/features/user/components/admin/PendingTeacherReviewPanel";

interface AdminUserDetailPageProps {
    params: Promise<{ userId: string }>;
    searchParams: Promise<{ status?: string }>;
}

const createDummyUser = (userId: number, isPendingTeacher: boolean, isDeletedUser: boolean) => ({
    id: userId,
    name: isPendingTeacher ? "승인 대기 강사" : isDeletedUser ? `탈퇴 회원 ${userId}` : `회원 ${userId}`,
    email: isPendingTeacher ? "pending.teacher@momocity.com" : isDeletedUser ? `deleted${userId}@momocity.com` : `member${userId}@momocity.com`,
    role: isPendingTeacher ? "TEACHER" : "STUDENT",
    status: isPendingTeacher ? "PENDING" : isDeletedUser ? "DELETED" : "ACTIVE",
    createdAt: "2026-06-18",
    category: isPendingTeacher ? "STUDY" : undefined,
    proof: isPendingTeacher ? "/dummy-teacher-proof.pdf" : undefined,
});

const DUMMY_REPORTS = [
    { id: 1, type: "커뮤니티 댓글" as const, content: "초보면 이런 강의는 듣지 마세요. 시간 낭비입니다.", reportedAt: "2026-06-18 15:12", isProcessed: false },
    { id: 2, type: "커뮤니티 댓글" as const, content: "초보면 이런 강의는 듣지 마세요. 시간 낭비입니다.", reportedAt: "2026-06-18 15:14", isProcessed: false },
    { id: 3, type: "수강평" as const, content: "설명이 너무 불친절해서 다시는 수강하고 싶지 않습니다.", reportedAt: "2026-06-12 11:05", isProcessed: true },
];

export default async function AdminUserDetailPage({ params, searchParams }: AdminUserDetailPageProps) {
    const { userId } = await params;
    const { status } = await searchParams;
    const isPendingTeacher = status === "pending";
    const isDeletedUser = status === "deleted";
    // TODO: 회원 상세 및 신고 로그 API가 정의되면 더미 회원/신고 데이터를 해당 응답값으로 교체한다.
    const user = createDummyUser(Number(userId), isPendingTeacher, isDeletedUser);

    return (
        <div className="mx-auto w-full max-w-300 pb-10">
            <Link href={isPendingTeacher ? "/admin/users?status=pending" : isDeletedUser ? "/admin/users?status=deleted" : "/admin/users"} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"><ArrowLeft className="size-4" />회원 관리로 돌아가기</Link>
            <div className="mt-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"><UserRound className="size-5" /></div>
                    <div><div className="flex items-center gap-2.5"><h1 className="text-2xl font-bold text-slate-950">{user.name}</h1><AdminUserStatusBadge status={user.status} /></div><p className="mt-1 text-sm font-medium text-slate-500">회원 상세 정보 및 운영 이력</p></div>
                </div>
            </div>
            <section className="mt-7 grid grid-cols-2 gap-x-10 gap-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div><p className="text-xs font-bold text-slate-400">이메일</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.email}</p></div>
                <div><p className="text-xs font-bold text-slate-400">사용자 유형</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.role === "TEACHER" ? "강사" : "수강생"}</p></div>
                <div><p className="text-xs font-bold text-slate-400">가입일</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.createdAt}</p></div>
                <div><p className="text-xs font-bold text-slate-400">활동 카테고리</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.category ?? "-"}</p></div>
            </section>
            {isPendingTeacher ? (
                <>
                    <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5"><FileText className="size-5 text-indigo-600" /><div><h2 className="text-base font-bold text-slate-950">증빙 서류</h2><p className="mt-1 text-sm font-medium text-slate-500">PDF 형식의 강사 증빙 서류 미리보기</p></div></div><div className="m-6 flex h-72 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-center"><div><FileText className="mx-auto size-10 text-slate-400" /><p className="mt-3 text-sm font-bold text-slate-600">강사 증빙 서류 PDF</p><p className="mt-1 text-xs text-slate-400">상세 API의 proofUrl을 받아 PDF 뷰어로 교체합니다.</p></div></div></section>
                    <div className="mt-6"><PendingTeacherReviewPanel userId={user.id} proofUrl={user.proof} /></div>
                </>
            ) : (
                <>
                    <div className="mt-6"><AdminUserReportLog reports={DUMMY_REPORTS} /></div>
                    {!isDeletedUser && <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-6"><div><h2 className="text-base font-bold text-slate-950">신고 횟수 조정</h2><p className="mt-1 text-sm font-medium text-slate-500">미처리 신고를 검토한 뒤 신고 점수를 조정합니다.</p></div><AdminUserReportCount initialCount={1} /></div></section>}
                </>
            )}
        </div>
    );
}
