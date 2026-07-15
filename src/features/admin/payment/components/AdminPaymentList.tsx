import { AdminPayment } from "@/features/admin/payment/type";
import AdminPaymentItem from "./AdminPaymentItem";

interface AdminPaymentListProps {
    payments: AdminPayment[];
}

export default function AdminPaymentList({ payments }: AdminPaymentListProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="grid min-w-[900px] grid-cols-[1.4fr_.8fr_.9fr_1.2fr] gap-x-6 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500">
                <span>이름</span>
                <span className="text-center">유형</span>
                <span className="text-center">멤버십</span>
                <div className="flex items-center justify-end gap-10">
                    <span className="w-24">가격</span>
                    <span className="w-36">결제/환불일</span>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm font-bold text-slate-400">
                        결제 내역이 없습니다.
                    </div>
                ) : (
                    payments.map((payment) => (
                        <AdminPaymentItem key={payment.paymentId} payment={payment} />
                    ))
                )}
            </div>
        </section>
    );
}
