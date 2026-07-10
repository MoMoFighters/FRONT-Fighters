import Image from "next/image";
import momocityLogo from '@/app/assets/img/logo.png'
import momo from '@/app/assets/img/momo.png'
import { UserRound } from "lucide-react";
import { getMyInfo } from "@/features/user/action";

interface ResidentCardProps {
    data: {
        name: string;
        nickname: string;
        createdAt: string;
        profileImageUrl: string;
    }
}

const formatResidentNumber = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "000000-xxxxxxx";
    }

    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}${month}${day}-xxxxxxx`;
};

type Membership = "BASIC" | "PLUS" | "PRO";

const MEMBERSHIP_THEME: Record<Membership, {
    card: string;
    divider: string;
    heading: string;
    subheading: string;
    label: string;
    value: string;
    stampRing: string;
    stampBg: string;
}> = {
    BASIC: {
        card: "bg-mauve-50",
        divider: "border-slate-300",
        heading: "text-slate-700",
        subheading: "text-slate-400",
        label: "text-slate-400",
        value: "text-slate-900",
        stampRing: "border-slate-300",
        stampBg: "bg-slate-300/30",
    },
    PLUS: {
        card: "bg-[linear-gradient(135deg,#ffffff_0%,#e5e7eb_25%,#9ca3af_50%,#e5e7eb_75%,#ffffff_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.7),0_1px_2px_rgba(0,0,0,.12)]",
        divider: "border-zinc-500/50",
        heading: "text-zinc-800",
        subheading: "text-zinc-600",
        label: "text-zinc-600",
        value: "text-zinc-900",
        stampRing: "border-zinc-500/60",
        stampBg: "bg-white/50",
    },
    PRO: {
        card: "bg-[linear-gradient(135deg,#fff7cc_0%,#fcd34d_25%,#f59e0b_50%,#fcd34d_75%,#fff7cc_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.6),0_1px_2px_rgba(0,0,0,.12)]",
        divider: "border-amber-800/50",
        heading: "text-amber-950",
        subheading: "text-amber-900/70",
        label: "text-amber-900/70",
        value: "text-amber-950",
        stampRing: "border-amber-800/60",
        stampBg: "bg-white/50",
    },
};

export default async function MomoResidentCard({ data }: ResidentCardProps) {
    const residentNumber = formatResidentNumber(data.createdAt);
    const myInfo = await getMyInfo();
    const membership = myInfo.data?.membership ?? "BASIC";
    const theme = MEMBERSHIP_THEME[membership];

    return (
        <div className={`relative isolate flex h-93.5 w-145 flex-col overflow-hidden rounded-xl border ${theme.divider} ${theme.card}`}>
            {/* 헤더 */}
            <div className={`p-4 flex flex-row border-b ${theme.divider}`}>
                <div className="flex-1 flex justify-start items-center">
                    <Image src={momocityLogo} alt='모모시티' width={100} className="ml-2" />
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col justify-end">
                    <p className={`text-right text-sm font-semibold ${theme.heading}`}>주민등록증</p>
                    <p className={`text-right text-sm font-semibold ${theme.subheading}`}>RESIDENT CARD</p>
                </div>
            </div>
            {/* 메인 */}
            <div className={`flex flex-row h-51 border-b px-6 py-4.5 ${theme.divider}`}>
                <div className="flex justify-center items-center">
                    <div className={`relative z-0 mr-6 h-34.5 w-27 overflow-hidden rounded-md border bg-slate-200 ${theme.divider}`}>
                        {data.profileImageUrl ? (
                            <Image
                                src={data.profileImageUrl}
                                alt="프로필 사진"
                                fill
                                className="object-cover"
                                sizes="108px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <UserRound className="h-14 w-14" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    <div className="gap-3 flex flex-col">
                        <div className="flex flex-row gap-1 items-end">
                            <p className={`text-[19px] font-bold ${theme.value}`}>{data.name}</p>
                            <p className={`text-[16px] font-semibold ${theme.subheading}`}>({data.nickname || '닉네임 없음'})</p>
                        </div>
                        <div className="flex flex-col gap-[2.5px]">
                            <p className={`text-[11px] ${theme.label}`}>모모등록번호</p>
                            <p className={`text-[19px] font-bold ${theme.value}`}>{residentNumber}</p>
                        </div>
                        <div className="flex flex-col gap-[2.5px]">
                            <p className={`text-[11px] ${theme.label}`}>주소</p>
                            <p className={`text-[12px] font-bold ${theme.value}`}>대한민국 모모시 모모구 모모동 모모로 44길</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* 푸터 */}
            <div className="flex flex-row p-4 items-center justify-between">
                <p className={`text-[10px] font-bold mt-auto ${theme.subheading}`}>모모시티 구청장</p>
                <div className={`relative z-0 h-17 w-17 rounded-full border-3 p-0.5 ${theme.stampRing} ${theme.stampBg}`}>
                    <div className={`w-full h-full border rounded-full overflow-hidden ${theme.divider}`}>
                        <Image
                            src={momo}
                            alt="모모시 도장"
                            className="w-full h-full opacity-50 -rotate-20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
