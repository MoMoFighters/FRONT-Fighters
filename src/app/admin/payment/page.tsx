import ListPagination from "@/components/common/ListPagination";
import AdminPaymentList from "@/features/admin/payment/components/AdminPaymentList";
import AdminPaymentManageNav from "@/features/admin/payment/components/AdminPaymentManageNav";
import { AdminPayment } from "@/features/admin/payment/type";
// 백엔드 API 완성 전까지는 더미 데이터를 사용합니다. 완성되면 아래 import를 활성화하세요.
// import { getAdminPayment } from "@/app/services/payment/service";

interface AdminPaymentPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

const PAYMENTS_PER_PAGE = 10;

// 매출 관리 더미 데이터 (백엔드 API 완성 전 화면 확인용)
const DUMMY_PAYMENTS: AdminPayment[] = [
    { paymentId: 1, userName: "김민수", status: "SUCCESS", plan: "PRO", price: 29900, createdAt: "2026-07-14T10:20:00" },
    { paymentId: 2, userName: "이지영", status: "SUCCESS", plan: "PLUS", price: 19900, createdAt: "2026-07-14T09:10:00" },
    { paymentId: 3, userName: "박현우", status: "REFUND", plan: "BASIC", price: 9900, createdAt: "2026-07-13T18:40:00" },
    { paymentId: 4, userName: "최서연", status: "SUCCESS", plan: "BASIC", price: 9900, createdAt: "2026-07-13T15:05:00" },
    { paymentId: 5, userName: "강도현", status: "SUCCESS", plan: "PRO", price: 29900, createdAt: "2026-07-13T11:30:00" },
    { paymentId: 6, userName: "정대기", status: "REFUND", plan: "PLUS", price: 19900, createdAt: "2026-07-12T20:15:00" },
    { paymentId: 7, userName: "오대기", status: "SUCCESS", plan: "PLUS", price: 19900, createdAt: "2026-07-12T14:50:00" },
    { paymentId: 8, userName: "신유진", status: "SUCCESS", plan: "BASIC", price: 9900, createdAt: "2026-07-12T09:25:00" },
    { paymentId: 9, userName: "오승준", status: "SUCCESS", plan: "PRO", price: 29900, createdAt: "2026-07-11T19:40:00" },
    { paymentId: 10, userName: "김민수", status: "REFUND", plan: "PRO", price: 29900, createdAt: "2026-07-11T13:10:00" },
    { paymentId: 11, userName: "이지영", status: "SUCCESS", plan: "BASIC", price: 9900, createdAt: "2026-07-10T22:05:00" },
    { paymentId: 12, userName: "박현우", status: "SUCCESS", plan: "PLUS", price: 19900, createdAt: "2026-07-10T16:30:00" },
    { paymentId: 13, userName: "최서연", status: "SUCCESS", plan: "PRO", price: 29900, createdAt: "2026-07-10T10:00:00" },
    { paymentId: 14, userName: "강도현", status: "REFUND", plan: "BASIC", price: 9900, createdAt: "2026-07-09T21:20:00" },
    { paymentId: 15, userName: "정대기", status: "SUCCESS", plan: "PRO", price: 29900, createdAt: "2026-07-09T15:45:00" },
    { paymentId: 16, userName: "오대기", status: "SUCCESS", plan: "BASIC", price: 9900, createdAt: "2026-07-09T09:55:00" },
    { paymentId: 17, userName: "신유진", status: "SUCCESS", plan: "PLUS", price: 19900, createdAt: "2026-07-08T18:15:00" },
    { paymentId: 18, userName: "오승준", status: "REFUND", plan: "PLUS", price: 19900, createdAt: "2026-07-08T12:40:00" },
    { paymentId: 19, userName: "김민수", status: "SUCCESS", plan: "BASIC", price: 9900, createdAt: "2026-07-08T08:10:00" },
    { paymentId: 20, userName: "이지영", status: "SUCCESS", plan: "PRO", price: 29900, createdAt: "2026-07-07T20:30:00" },
    { paymentId: 21, userName: "박현우", status: "SUCCESS", plan: "PLUS", price: 19900, createdAt: "2026-07-07T14:05:00" },
    { paymentId: 22, userName: "최서연", status: "REFUND", plan: "PRO", price: 29900, createdAt: "2026-07-06T19:50:00" },
    { paymentId: 23, userName: "강도현", status: "SUCCESS", plan: "BASIC", price: 9900, createdAt: "2026-07-06T11:15:00" },
    { paymentId: 24, userName: "정대기", status: "SUCCESS", plan: "PLUS", price: 19900, createdAt: "2026-07-05T09:40:00" },
];

export default async function AdminPaymentPage({
    searchParams,
}: AdminPaymentPageProps) {
    const { page, status } = await searchParams;
    const currentView: "all" | "success" | "refund" =
        status === "success" ? "success" : status === "refund" ? "refund" : "all";
    const requestedPage = Math.max(Number(page) || 1, 1);

    // 백엔드 완성되면 아래 더미 필터링/페이지네이션 로직을 지우고 이 호출로 교체하세요.
    // const paymentResponse = await getAdminPayment({
    //     status: currentView === "all" ? undefined : currentView === "success" ? "SUCCESS" : "REFUND",
    //     page: requestedPage,
    //     size: PAYMENTS_PER_PAGE,
    // });

    const filteredPayments = DUMMY_PAYMENTS.filter((payment) => {
        if (currentView === "success") return payment.status === "SUCCESS";
        if (currentView === "refund") return payment.status === "REFUND";
        return true;
    });

    const totalPages = Math.max(Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE), 1);
    const currentPage = Math.min(requestedPage, totalPages);
    const payments = filteredPayments.slice(
        (currentPage - 1) * PAYMENTS_PER_PAGE,
        currentPage * PAYMENTS_PER_PAGE
    );

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
