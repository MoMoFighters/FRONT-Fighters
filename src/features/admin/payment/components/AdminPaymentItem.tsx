import { AdminPayment } from "@/features/admin/payment/type";

interface AdminPaymentItemProps {
    payment: AdminPayment;
}

const STATUS_STYLE: Record<AdminPayment["status"], string> = {
    SUCCESS: "border-blue-200 bg-blue-50 text-blue-600",
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
        <div className="grid min-w-[900px] grid-cols-[1.2fr_.9fr_3fr] items-center gap-x-6 px-6 py-4 text-sm">
            <span className="font-medium text-slate-700">
                {payment.userName}
            </span>

            <span className="font-medium text-slate-950">
                {payment.plan}
            </span>

            {/* justify-between: 유형-가격 간격과 가격-결제/환불일 간격이 항상 동일하게 유지됩니다. 헤더와 폭을 맞추기 위해 각 항목에 고정 width를 지정하고, 그 안에서는 왼쪽 정렬합니다. */}
            <div className="flex items-center justify-between">
                <div className="flex w-16 items-center justify-center">
                    <span className={`rounded-md border px-2 py-1 text-xs font-bold ${STATUS_STYLE[payment.status]}`}>
                        {STATUS_LABEL[payment.status]}
                    </span>
                </div>

                <span className={`w-24 font-bold ${PRICE_STYLE[payment.status]}`}>
                    {sign}{payment.price.toLocaleString()}원
                </span>

                <time className="w-40 text-slate-500">
                    {formatAdminDateTime(payment.createdAt)}
                </time>
            </div>
        </div>
    );
}
