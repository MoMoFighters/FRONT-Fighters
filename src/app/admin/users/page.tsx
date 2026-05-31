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

    const payload = {
        role: role?.toUpperCase(),
        status: status?.toUpperCase(),
        keyword,
        page
    };
    console.log(payload);

    const usersData = await getUsers(payload);

    const currentPage =
        usersData.page;

    const totalPages =
        usersData.totalPages;

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
        <div>

            <div className="flex items-center gap-3 mb-6">

                <div className="w-2 h-7 bg-slate-500 rounded-full" />

                <h2 className="text-2xl font-bold text-slate-900">
                    회원 관리
                </h2>

            </div>

            <UserManageNav />

            <UserManageSearchbar
                role={role}
                status={status}
                keyword={keyword}
            />

            <AdminUsersList
                users={usersData.users}
                status={status}
            />

            {totalPages > 1 && (

                <Pagination className="mt-10">

                    <PaginationContent>

                        {currentPage > 1 && (
                            <PaginationItem>

                                <PaginationPrevious
                                    href={createPageHref(
                                        currentPage - 1
                                    )}
                                />

                            </PaginationItem>
                        )}

                        {Array.from(
                            { length: totalPages },
                            (_, index) => {

                                const pageNumber =
                                    index + 1;

                                return (
                                    <PaginationItem
                                        key={pageNumber}
                                    >

                                        <PaginationLink
                                            href={createPageHref(
                                                pageNumber
                                            )}
                                            isActive={
                                                currentPage ===
                                                pageNumber
                                            }
                                        >
                                            {pageNumber}
                                        </PaginationLink>

                                    </PaginationItem>
                                );
                            }
                        )}

                        {currentPage < totalPages && (
                            <PaginationItem>

                                <PaginationNext
                                    href={createPageHref(
                                        currentPage + 1
                                    )}
                                />

                            </PaginationItem>
                        )}

                    </PaginationContent>

                </Pagination>
            )}

        </div>
    );
}