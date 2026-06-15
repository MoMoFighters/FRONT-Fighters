import LectureItem from "@/components/common/LectureItem";
import { getLectures } from "@/app/services/lecture/service";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import LectureManageNav from "@/features/lecture/components/admin/LectureManageNav";
import LectureFilterBtn from "@/features/lecture/components/buttons/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import { CategoryApiUrl, CategoryUrl, GetLecturesRequest } from "@/features/lecture/type";
import { SearchX } from "lucide-react";

const CATEGORY_MAP: Record<CategoryUrl, CategoryApiUrl> = {
    study: "STUDY",
    fitness: "FITNESS",
    cook: "COOK",
    beauty: "BEAUTY",
    art: "ART",
};

interface AdminLectureListPageProps {
    searchParams: Promise<{
        status?: string;
        category?: CategoryUrl;
        keyword?: string;
        page?: string;
    }>;
}

export default async function AdminLectureListPage({
    searchParams,
}: AdminLectureListPageProps) {
    const { status, keyword, category, page } = await searchParams;

    const payload: GetLecturesRequest = {
        category: category ? CATEGORY_MAP[category] : undefined,
        keyword,
        status,
        page: Number(page) || 1,
    };

    const responseData = await getLectures(payload);
    const totalPages = responseData.totalPages;
    const currentPage = Number(page) || 1;

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (status) {
            params.set("status", status);
        }

        if (category) {
            params.set("category", category);
        }

        if (keyword) {
            params.set("keyword", keyword);
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <div>
            <div className="mb-10 flex items-center gap-3">
                <div className="h-7 w-2 rounded-full bg-slate-500" />
                <h2 className="text-2xl font-bold text-slate-900">
                    강의 관리
                </h2>
            </div>

            <LectureManageNav />

            <div className="mb-4 flex items-center gap-3">
                <LectureSearchbar
                    status={status}
                    keyword={keyword}
                    category={category}
                />
                <LectureFilterBtn />
            </div>

            <div className="mb-4 border-t border-slate-400" />

            {responseData.content.length > 0 ? (
                <>
                    <div className="space-y-3">
                        {responseData.content.map((lecture) => (
                            <LectureItem
                                key={lecture.lectureId}
                                lecture={lecture}
                                role="admin"
                                mode="list"
                                href={`/admin/lectures/${lecture.lectureId}`}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination className="mt-10">
                            <PaginationContent>
                                {currentPage > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={createPageHref(currentPage - 1)}
                                        />
                                    </PaginationItem>
                                )}

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

                                {currentPage < totalPages && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={createPageHref(currentPage + 1)}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            ) : (
                <div className="flex h-60 flex-col items-center justify-center gap-5 text-2xl font-bold text-slate-300">
                    <SearchX className="h-12 w-12 text-slate-300" />
                    <span>찾으시는 강의가 존재하지 않습니다.</span>
                </div>
            )}
        </div>
    );
}