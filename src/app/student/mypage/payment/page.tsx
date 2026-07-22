import Link from "next/link";
import { Receipt } from "lucide-react";

import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import MembershipBadge, {
    formatMembershipUntil,
} from "@/components/common/MembershipBadge";
import { getMyInfo } from "@/features/user/action";
import { getUserPaymentListAction } from "@/features/payment/action";
import { UserPaymentStatus } from "@/features/payment/type";
import CancelSubscriptionButton from "@/features/payment/components/CancelSubscriptionButton";
import RenewMembershipButton from "@/features/payment/components/RenewMembershipButton";
import { MEMBERSHIP_PLANS } from "@/features/membership/membershipInfo";

const REFUND_WINDOW_MS = 72 * 60 * 60 * 1000;
const RENEWAL_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const formatActivationTime = (date: Date) => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hours24 = date.getHours();
    const ampm = hours24 >= 12 ? "pm" : "am";
    const hours12 = hours24 % 12 || 12;
    const hh = String(hours12).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}${ampm}`;
};

interface PaymentHistoryPageProps {
    searchParams: Promise<{
        status?: string;
    }>;
}

const STATUS_LABEL: Record<UserPaymentStatus, string> = {
    SUCCESS: "결제 완료",
    REFUND: "환불 완료",
    PENDING: "결제 대기",
    FAILED: "결제 실패",
};

const STATUS_STYLE: Record<UserPaymentStatus, string> = {
    SUCCESS: "bg-indigo-50 text-indigo-500",
    REFUND: "bg-rose-50 text-rose-500",
    PENDING: "bg-amber-50 text-amber-500",
    FAILED: "bg-slate-100 text-slate-500",
};

const STATUS_FILTERS: { label: string; value?: "SUCCESS" | "REFUND" }[] = [
    { label: "전체", value: undefined },
    { label: "결제 완료", value: "SUCCESS" },
    { label: "환불", value: "REFUND" },
];

const formatDateTime = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return createdAt;
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
};

export default async function PaymentHistoryPage({
    searchParams,
}: PaymentHistoryPageProps) {
    const { status } = await searchParams;
    const normalizedStatus =
        status === "SUCCESS" || status === "REFUND" ? status : undefined;

    // 구독 취소/갱신 카드는 탭 필터(전체/결제완료/환불)와 무관하게 항상 최신 SUCCESS 건을 기준으로 판단해야 하므로,
    // 화면에 뿌릴 목록과는 별개로 SUCCESS 목록을 항상 따로 조회한다.
    const [myInfoResponse, paymentListResponse, successPaymentListResponse] = await Promise.all([
        getMyInfo(),
        getUserPaymentListAction(normalizedStatus),
        normalizedStatus === "SUCCESS"
            ? Promise.resolve(null)
            : getUserPaymentListAction("SUCCESS"),
    ]);

    const membership = myInfoResponse.data?.membership ?? "BASIC";
    const membershipUntil = myInfoResponse.data?.membershipUntil ?? null;
    const formattedUntil = formatMembershipUntil(membershipUntil);
    const payments = paymentListResponse.data?.payments ?? [];
    const totalElements =
        paymentListResponse.data?.totalElements ?? payments.length;
    const hasError = paymentListResponse.status >= 400;

    const successPayments = successPaymentListResponse?.data?.payments ?? payments;
    const latestSuccessPayment = successPayments.find(
        (payment) => payment.status === "SUCCESS"
    );

    // 서버 컴포넌트라 요청마다 새로 렌더링되므로, 요청 시점의 서버 시각을 그대로 사용해도 안전하다.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    const cancelDisabledReason = !latestSuccessPayment
        ? "결제 내역을 확인할 수 없습니다."
        : now - new Date(latestSuccessPayment.createdAt).getTime() > REFUND_WINDOW_MS
            ? "환불 가능 기간이 지났습니다."
            : null;

    const membershipUntilDate = membershipUntil ? new Date(membershipUntil) : null;
    const canRenew =
        membershipUntilDate !== null &&
        membershipUntilDate.getTime() - now <= RENEWAL_WINDOW_MS;
    const renewActivationDate = membershipUntilDate
        ? new Date(membershipUntilDate.getTime() - RENEWAL_WINDOW_MS)
        : null;
    const renewDisabledReason = canRenew
        ? null
        : renewActivationDate
            ? `${formatActivationTime(renewActivationDate)}부터 갱신이 가능합니다.`
            : "구독 정보를 확인할 수 없습니다.";
    const currentPlan = MEMBERSHIP_PLANS.find((plan) => plan.tier === membership);

    return (
        <main className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
            <StudentPageHeader
                backHref="/student/mypage"
                breadcrumbs={[
                    {
                        label: "홈",
                        href: "/student",
                    },
                    {
                        label: "마이페이지",
                        href: "/student/mypage",
                    },
                    {
                        label: "결제 내역",
                    },
                ]}
                title="결제 내역"
            />

            <section className="mt-8 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                    현재 구독
                                </h1>
                                <MembershipBadge
                                    membership={membership}
                                    membershipUntil={membershipUntil}
                                />
                            </div>

                            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                                {membership === "BASIC"
                                    ? "현재 무료 BASIC 플랜을 이용 중입니다."
                                    : formattedUntil
                                        ? `${formattedUntil}까지 이용 가능합니다.`
                                        : "구독 정보를 불러오는 중입니다."}
                            </p>
                        </div>

                        {membership !== "BASIC" && (
                            <div className="flex items-center gap-2">
                                {currentPlan && (
                                    <RenewMembershipButton
                                        plan={currentPlan}
                                        disabledReason={renewDisabledReason}
                                        membershipStart={myInfoResponse.data?.membershipStart}
                                    />
                                )}
                                <CancelSubscriptionButton
                                    paymentId={latestSuccessPayment?.paymentId}
                                    disabledReason={cancelDisabledReason}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-black text-slate-900">
                                결제 내역
                            </h2>
                            <p className="mt-1 text-xs font-medium text-slate-400">
                                총 {totalElements.toLocaleString()}건의 결제 내역
                            </p>
                        </div>

                        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
                            {STATUS_FILTERS.map((filter) => (
                                <Link
                                    key={filter.label}
                                    href={
                                        filter.value
                                            ? `/student/mypage/payment?status=${filter.value}`
                                            : "/student/mypage/payment"
                                    }
                                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${normalizedStatus === filter.value
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {filter.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {hasError ? (
                            <div className="px-5 py-10 text-center text-sm font-bold text-rose-500">
                                {paymentListResponse.message}
                            </div>
                        ) : payments.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                결제 내역이 없습니다.
                            </div>
                        ) : (
                            payments.map((payment, index) => (
                                <div
                                    key={`${payment.createdAt}-${index}`}
                                    className="grid grid-cols-1 items-center gap-2 px-5 py-3 transition-colors hover:bg-slate-50 sm:grid-cols-[160px_minmax(0,1fr)_120px] sm:gap-4"
                                >
                                    <p className="text-xs font-bold text-slate-500">
                                        {formatDateTime(payment.createdAt)}
                                    </p>

                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                                            <Receipt className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {payment.plan} 플랜
                                            </p>
                                            <p
                                                className={`mt-0.5 inline-flex w-fit rounded px-1.5 py-0.5 text-[11px] font-bold ${STATUS_STYLE[payment.status] ?? "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                {STATUS_LABEL[payment.status] ?? payment.status}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-right text-base font-black text-slate-900">
                                        ₩{payment.price.toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
