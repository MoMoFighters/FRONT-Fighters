import AdminMembershipBadge from "@/features/user/components/admin/AdminMembershipBadge";
import { AdminPayment } from "@/features/admin/payment/type";

interface AdminPaymentItemProps {
    payment: AdminPayment;
}

const STATUS_STYLE: Record<AdminPayment["status"], string> = {
    SUCCESS: "border-slate-200 bg-slate-50 text-slate-600",
    REFUND: "border-rose-200 bg-rose-50 text-rose-600",
};

const STATUS_LABEL: Record<AdminPayment["status"], string> = {
    SUCCESS: "결제",
    REFUND: "환불",
};

const PRICE_STYLE: Record<AdminPayment["status"], string> = {
    SUCCESS: "text-blue-600",
    REFUND: "text-rose-600",
};

const formatAdminDateTime = (dateTime: string) => {
    return dateTime.replace("T", " ").slice(0, 16);
};

export default function AdminPaymentItem({ payment }: AdminPaymentItemProps) {
    const sign = payment.status === "SUCCESS" ? "+" : "-";

    return (
        <div className="grid min-w-[900px] grid-cols-[1.4fr_.8fr_.9fr_1.2fr] items-center gap-x-6 px-6 py-4 text-sm">
            <span className="font-medium text-slate-700">
                {payment.userName}
            </span>

            <div className="flex items-center justify-center">
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${STATUS_STYLE[payment.status]}`}>
                    {STATUS_LABEL[payment.status]}
                </span>
            </div>

            <div className="flex items-center justify-center">
                <AdminMembershipBadge membership={payment.plan} />
            </div>

            <div className="flex items-center justify-end gap-10">
                <span className={`w-24 font-bold ${PRICE_STYLE[payment.status]}`}>
                    {sign}{payment.price.toLocaleString()}원
                </span>

                <time className="w-36 text-slate-500">
                    {formatAdminDateTime(payment.createdAt)}
                </time>
            </div>
        </div>
    );
}
