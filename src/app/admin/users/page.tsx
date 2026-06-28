import { getPendingTeachers, getUsers } from "@/app/services/user/service";
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

export default async function UserManagePage({
    searchParams
}: UserManagePageProps) {
    const { role, status, keyword, page } = await searchParams;
    const currentView = status === "pending"
        ? "pending"
        : status === "deleted"
            ? "deleted"
            : "all";

    const usersData = currentView === "pending"
        ? undefined
        : await getUsers({
            role: currentView === "all" ? role?.toUpperCase() : undefined,
            status: currentView === "deleted" ? "DELETED" : undefined,
            keyword,
            page,
        });

    const pendingTeachersData = currentView === "pending"
        ? await getPendingTeachers({
            keyword,
            page,
        })
        : undefined;

    const currentPage = pendingTeachersData?.page ?? usersData?.page ?? 1;
    const totalPages = pendingTeachersData?.totalPages ?? usersData?.totalPages ?? 1;
    const currentViewUsers = currentView === "pending"
        ? pendingTeachersData?.applications ?? []
        : usersData?.users ?? [];
    console.log(currentViewUsers);
    const currentPageSize = pendingTeachersData?.size ?? usersData?.size ?? 0;
    const shouldShowPagination = totalPages > 1 && (
        currentPage > 1 ||
        currentViewUsers.length >= currentPageSize
    );

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
                <PendingTeacherTable users={pendingTeachersData?.applications ?? []} />
            ) : (
                <AdminUsersList
                    users={usersData?.users ?? []}
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
