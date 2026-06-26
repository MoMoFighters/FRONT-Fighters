import { CalendarDays, KeyRound, Mail, WalletCards } from "lucide-react";

interface MyInfoTableProps {
    data: {
        email: string;
        points: number;
        createdAt: string;
        isTempPwd: boolean;
    }
}

const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export default function MyInfoTable({ data }: MyInfoTableProps) {
    const infoItems = [
        {
            label: "이메일",
            value: data.email,
            icon: Mail,
        },
        {
            label: "가입일",
            value: formatDate(data.createdAt),
            icon: CalendarDays,
        },
        {
            label: "보유 포인트",
            value: `${data.points.toLocaleString()} P`,
            icon: WalletCards,
        },
        {
            label: "비밀번호 상태",
            value: data.isTempPwd ? "임시 비밀번호 사용 중" : "일반 비밀번호",
            icon: KeyRound,
        },
    ];

    return (
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-base font-black text-slate-900">
                        계정 정보
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-slate-400">
                        내 계정의 기본 정보를 확인해요.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {infoItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                        >
                            <div className="mb-3 flex size-8 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm ring-1 ring-slate-100">
                                <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-[11px] font-black text-slate-400">
                                {item.label}
                            </p>
                            <p className="mt-1 truncate text-sm font-black text-slate-800">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
