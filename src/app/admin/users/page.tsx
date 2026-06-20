import { getUsers } from "@/app/services/user/service";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import AdminUsersList from "@/features/user/components/admin/AdminUsersList";
import PendingTeacherTable from "@/features/user/components/admin/PendingTeacherTable";
import UserManageNav from "@/features/user/components/admin/UserManageNav";
import UserManageSearchbar from "@/features/user/components/admin/UserManageSearchbar";

interface UserManagePageProps {
    searchParams: Promise<{
        role?: string;
        status?: string;
        keyword?: string;
        page?: string;
    }>
}

const DUMMY_PENDING_TEACHERS = [
    // TODO: 승인 대기 강사 조회 API 또는 회원 전체 조회 응답에 PENDING 강사가 포함되면 제거한다.
    {
        id: -101,
        name: "김하나",
        role: "TEACHER",
        email: "hana.teacher@momocity.com",
        createdAt: "2026-06-18",
        status: "PENDING",
        proof: "/dummy-teacher-proof.pdf",
    },
    {
        id: -102,
        name: "이준호",
        role: "TEACHER",
        email: "junho.teacher@momocity.com",
        createdAt: "2026-06-17",
        status: "PENDING",
        proof: "/dummy-teacher-proof.pdf",
    },
];

const DUMMY_DELETED_USERS = [
    // TODO: 탈퇴 회원 조회 API 응답이 준비되면 제거한다.
    {
        id: -201,
        name: "탈퇴회원 예시",
        role: "STUDENT",
        email: "deleted.member@momocity.com",
        createdAt: "2026-04-18",
        deletedAt: "2026-06-19",
        status: "DELETED",
    },
];

export default async function UserManagePage({
    searchParams
}: UserManagePageProps) {

    const { role, status, keyword, page } = await searchParams;
    const currentView = status === "pending"
        ? "pending"
        : status === "deleted"
            ? "deleted"
            : "all";

    const payload = {
        role: currentView === "all" ? role?.toUpperCase() : undefined,
        status: undefined,
        keyword,
        page
    };

    const usersData = await getUsers(payload);

    const currentPage =
        usersData.page;

    // 현재 회원 목록 API가 상태 필터를 지원하지 않아, 응답 데이터를 탭 목적에 맞게 화면에서 분리한다.
    const displayedUsers = usersData.users.filter((user) => {
        if (currentView === "pending") {
            return user.role === "TEACHER" && user.status === "PENDING";
        }

        if (currentView === "deleted") {
            return user.status === "DELETED";
        }

        return user.status !== "PENDING" && user.status !== "DELETED";
    });
    const pendingUsers = currentView === "pending" && displayedUsers.length === 0
        ? DUMMY_PENDING_TEACHERS
        : displayedUsers;
    const deletedUsers = currentView === "deleted" && displayedUsers.length === 0
        ? DUMMY_DELETED_USERS
        : displayedUsers;

    const totalPages =
        usersData.totalPages;
    const shouldShowPagination = totalPages > 1;

    const createPageHref = (
        pageNumber: number
    ) => {

        const params =
            new URLSearchParams();

        if (role) {
            params.set(
                "role",
                role
            );
        }

        if (status) {
            params.set(
                "status",
                status
            );
        }

        if (keyword) {
            params.set(
                "keyword",
                keyword
            );
        }

        params.set(
            "page",
            String(pageNumber)
        );

        return `?${params.toString()}`;
    };

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-950">회원 관리</h1>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                    회원 상태와 신고 이력을 검토하고 필요한 운영 조치를 처리합니다.
                </p>
            </div>

            <UserManageNav />

            <UserManageSearchbar
                role={role}
                status={status}
                keyword={keyword}
            />

            {currentView === "pending" ? (
                <PendingTeacherTable users={pendingUsers} />
            ) : (
                <AdminUsersList
                    users={currentView === "deleted" ? deletedUsers : displayedUsers}
                    view={currentView === "deleted" ? "deleted" : "all"}
                />
            )}

            {shouldShowPagination && (

                <Pagination className="mt-10">
                    <div className="relative">
                        <div className="relative mx-auto w-fit">
                            {currentPage > 1 && (
                                <PaginationPrevious
                                    href={createPageHref(currentPage - 1)}
                                    className="absolute right-full top-0 mr-1 w-fit"
                                />
                            )}

                            <PaginationContent>
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;

                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={createPageHref(pageNumber)}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>

                            {currentPage < totalPages && (
                                <PaginationNext
                                    href={createPageHref(currentPage + 1)}
                                    className="absolute left-full top-0 ml-1 w-fit"
                                />
                            )}
                        </div>
                    </div>

                </Pagination>
            )}

        </div>
    );
}
