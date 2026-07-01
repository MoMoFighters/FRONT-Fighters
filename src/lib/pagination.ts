export const getVisiblePageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisiblePages = 5,
) => {
    const safeTotalPages = Math.max(totalPages, 1);
    const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
    const visibleCount = Math.min(maxVisiblePages, safeTotalPages);
    const sideCount = Math.floor(visibleCount / 2);

    let startPage = safeCurrentPage - sideCount;
    let endPage = startPage + visibleCount - 1;

    if (startPage < 1) {
        startPage = 1;
        endPage = visibleCount;
    }

    if (endPage > safeTotalPages) {
        endPage = safeTotalPages;
        startPage = Math.max(1, endPage - visibleCount + 1);
    }

    return Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index,
    );
};
