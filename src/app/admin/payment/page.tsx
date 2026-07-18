import ListPagination from "@/components/common/ListPagination";
import AdminPaymentList from "@/features/admin/payment/components/AdminPaymentList";
import AdminPaymentManageNav from "@/features/admin/payment/components/AdminPaymentManageNav";
import { getAdminPayment } from "@/app/services/payment/service";

interface AdminPaymentPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

const PAYMENTS_PER_PAGE = 10;

export default async function AdminPaymentPage({
    searchParams,
}: AdminPaymentPageProps) {
    const { page, status } = await searchParams;
    const currentView: "all" | "success" | "refund" =
        status === "success" ? "success" : status === "refund" ? "refund" : "all";
    const requestedPage = Math.max(Number(page) || 1, 1);

    const paymentResponse = await getAdminPayment({
        status: currentView === "all" ? undefined : currentView === "success" ? "SUCCESS" : "REFUND",
        page: requestedPage,
        size: PAYMENTS_PER_PAGE,
    });

    const payments = paymentResponse.payments;
    const currentPage = paymentResponse.page;
    const totalPages = paymentResponse.totalPages;

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (currentView !== "all") {
            params.set("status", currentView);
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-950">매출 관리</h1>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                    전체 결제·환불 내역을 확인합니다.
                </p>
            </div>

            <AdminPaymentManageNav currentView={currentView} />

            <AdminPaymentList payments={payments} />

            <ListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                createHref={createPageHref}
            />
        </div>
    );
}
