import Image from "next/image";
import momo from '@/app/assets/img/momo.png'
import { UserRound } from "lucide-react";

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

const formatIssueDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}.`;
};

export default function MomoResidentCard({ data }: ResidentCardProps) {
    const residentNumber = formatResidentNumber(data.createdAt);
    const issueDate = formatIssueDate(new Date());

    return (
        <div className="relative flex aspect-[145/82] w-full flex-col overflow-hidden rounded-xl border border-slate-300 bg-slate-50 p-[1.6cqw] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_16px_-6px_rgba(15,23,42,0.15)] [container-type:inline-size]">

            {/* 배경 워터마크 */}
            <div className="pointer-events-none absolute inset-0 z-0 flex -rotate-12 flex-wrap content-around justify-around gap-x-[6cqw] gap-y-[4cqw] select-none opacity-[0.06]">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} className="whitespace-nowrap text-[3cqw] font-black text-slate-400">
                        MoMoCITY
                    </span>
                ))}
            </div>

            <div className="relative z-10 flex flex-1 flex-col">
                {/* 메인: 헤더+이름+번호+주소를 한 컬럼(왼쪽)에 묶고, 사진은 오른쪽 컬럼으로 분리 */}
                <div className="mt-[1cqw] flex flex-row items-start justify-between gap-[2.4cqw]">
                    <div className="flex flex-col gap-[1.6cqw]">
                        <div className="flex items-center justify-between gap-[1.4cqw]">
                            <p className="font-bold text-slate-700 text-[6.2cqw]">모모시민증</p>
                            <p className="font-bold text-slate-400 text-[2.4cqw]">RESIDENT CARD</p>
                        </div>

                        <div className="flex flex-row items-end gap-[0.9cqw]">
                            <p className="font-bold text-slate-900 text-[4.8cqw]">{data.name}</p>
                            <p className="font-bold text-slate-400 text-[3.2cqw]">({data.nickname || '닉네임 없음'})</p>
                        </div>
                        <p className="font-bold text-slate-900 text-[4cqw]">{residentNumber}</p>
                        <div className="flex flex-col text-slate-500 text-[3cqw] leading-snug">
                            <p>대한민국 모모시 모모구 모모동 모모로 44길</p>
                        </div>
                    </div>

                    <div className="relative flex w-[26cqw] aspect-[27/34.5] shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-400 bg-white shadow-sm mb-2">
                        <div className="relative w-full aspect-square">
                            {data.profileImageUrl ? (
                                <Image
                                    src={data.profileImageUrl}
                                    alt="프로필 사진"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <UserRound className="h-[9.66cqw] w-[9.66cqw]" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-end justify-end gap-4 mt-2">
                    <div className="flex flex-col gap-[0.4cqw] text-slate-400 text-[2.8cqw]">
                        <p>{issueDate}</p>
                        <p className="font-bold">모모시티 구청장</p>
                    </div>
                    <div className="h-[10cqw] w-[10cqw] rounded-full border-2 border-slate-300 bg-slate-300/30 p-0.5">
                        <div className="h-full w-full overflow-hidden rounded-full border border-slate-300">
                            <Image
                                src={momo}
                                alt="모모시 도장"
                                className="h-full w-full opacity-50 -rotate-20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
