import Link from "next/link";
import { ArrowLeft, FileText, UserRound } from "lucide-react";

import { getPendingTeacherById, getUserById } from "@/app/services/user/service";
import AdminUserReportCount from "@/features/user/components/admin/AdminUserReportCount";
import AdminUserReportLog from "@/features/user/components/admin/AdminUserReportLog";
import PendingTeacherReviewPanel from "@/features/user/components/admin/PendingTeacherReviewPanel";
import { USER_ROLE_LABEL } from "@/features/user/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";

interface AdminUserDetailPageProps {
    params: Promise<{ userId: string }>;
    searchParams: Promise<{
        source?: string;
        from?: string;
        status?: string;
    }>;
}

const formatAdminDateTime = (dateTime?: string | null) => {
    // 관리자 화면의 날짜는 T를 공백으로 바꾸고 분 단위까지만 보여준다.
    if (!dateTime) {
        return "-";
    }

    return dateTime.replace("T", " ").slice(0, 16);
};

export default async function AdminUserDetailPage({ params, searchParams }: AdminUserDetailPageProps) {
    const { userId } = await params;
    const { source, from, status } = await searchParams;
    const isPendingTeacher = source === "pending-teacher" || status === "pending";
    const isFromAllList = from === "all";
    const isDeletedUser = status === "deleted";
    const backHref = isPendingTeacher && !isFromAllList
        ? "/admin/users?status=pending"
        : isDeletedUser
            ? "/admin/users?status=deleted"
            : "/admin/users";

    if (isPendingTeacher) {
        const user = await getPendingTeacherById(userId);
        const categoryMeta = getCategoryMeta(user.category);

        return (
            <div className="mx-auto w-full max-w-300 pb-10">
                <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"><ArrowLeft className="size-4" />회원 관리로 돌아가기</Link>
                <div className="mt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"><UserRound className="size-5" /></div>
                        <div><h1 className="text-2xl font-bold text-slate-950">{user.name}</h1><p className="mt-1 text-sm font-medium text-slate-500">승인 대기 강사 상세 정보</p></div>
                    </div>
                </div>
                <section className="mt-7 grid grid-cols-2 gap-x-10 gap-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div><p className="text-xs font-bold text-slate-400">이메일</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.email}</p></div>
                    <div><p className="text-xs font-bold text-slate-400">사용자 유형</p><p className="mt-2 text-sm font-semibold text-slate-800">{USER_ROLE_LABEL[user.role]}</p></div>
                    <div><p className="text-xs font-bold text-slate-400">가입일</p><p className="mt-2 text-sm font-semibold text-slate-800">{formatAdminDateTime(user.createdAt)}</p></div>
                    <div><p className="text-xs font-bold text-slate-400">활동 카테고리</p><p className="mt-2 text-sm font-semibold text-slate-800">{categoryMeta.label}</p></div>
                    <div><p className="text-xs font-bold text-slate-400">닉네임</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.nickname}</p></div>
                </section>

                <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5"><FileText className="size-5 text-indigo-600" /><div><h2 className="text-base font-bold text-slate-950">증빙 서류</h2><p className="mt-1 text-sm font-medium text-slate-500">강사 증빙 자료를 확인합니다.</p></div></div>
                    <div className="m-6 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        {user.fileType === "mp4" ? (
                            <video src={user.proof} controls className="aspect-video w-full bg-black object-contain" />
                        ) : (
                            <iframe src={user.proof} title={`${user.name} 증빙 서류 PDF 미리보기`} className="h-[30rem] w-full bg-white" />
                        )}
                    </div>
                </section>

                <div className="mt-6">
                    <PendingTeacherReviewPanel
                        userId={user.userId}
                        successHref={backHref}
                    />
                </div>
            </div>
        );
    }

    const user = await getUserById(userId);
    const categoryMeta = user.category ? getCategoryMeta(user.category) : null;

    return (
        <div className="mx-auto w-full max-w-300 pb-10">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"><ArrowLeft className="size-4" />회원 관리로 돌아가기</Link>
            <div className="mt-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"><UserRound className="size-5" /></div>
                    <div><h1 className="text-2xl font-bold text-slate-950">{user.name}</h1><p className="mt-1 text-sm font-medium text-slate-500">회원 상세 정보 및 운영 이력</p></div>
                </div>
            </div>
            <section className="mt-7 grid grid-cols-2 gap-x-10 gap-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div><p className="text-xs font-bold text-slate-400">이메일</p><p className="mt-2 text-sm font-semibold text-slate-800">{user.email}</p></div>
                <div><p className="text-xs font-bold text-slate-400">사용자 유형</p><p className="mt-2 text-sm font-semibold text-slate-800">{USER_ROLE_LABEL[user.role]}</p></div>
                <div><p className="text-xs font-bold text-slate-400">가입일</p><p className="mt-2 text-sm font-semibold text-slate-800">{formatAdminDateTime(user.createdAt)}</p></div>
                <div><p className="text-xs font-bold text-slate-400">활동 카테고리</p><p className="mt-2 text-sm font-semibold text-slate-800">{categoryMeta?.label ?? "-"}</p></div>
            </section>

            <div className="mt-6"><AdminUserReportLog reports={user.reports} /></div>
            {!isDeletedUser && <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-6"><div><h2 className="text-base font-bold text-slate-950">제재 누적 횟수 조정</h2><p className="mt-1 text-sm font-medium text-slate-500">미처리 신고를 검토한 뒤 제재 누적 횟수를 조정합니다.</p></div><AdminUserReportCount userId={Number(userId)} initialCount={user.suspensionCount ?? 0} /></div></section>}
        </div>
    );
}
