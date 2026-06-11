import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ListPaginationProps {
    currentPage: number;
    totalPages: number;
    createHref: (pageNumber: number) => string;
}

export default function ListPagination({
    currentPage,
    totalPages,
    createHref,
}: ListPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={createHref(currentPage - 1)}
                            text=""
                            className="h-9 w-9 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                        />
                    </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href={createHref(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className={
                                    currentPage === pageNumber
                                        ? "border-indigo-300 bg-indigo-50 text-indigo-500 hover:bg-indigo-50"
                                        : "text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                }
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href={createHref(currentPage + 1)}
                            text=""
                            className="h-9 w-9 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
