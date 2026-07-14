import Image from "next/image";
import momocityLogo from '@/app/assets/img/logo.png'
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

export default function MomoResidentCard({ data }: ResidentCardProps) {
    const residentNumber = formatResidentNumber(data.createdAt);

    return (
        <div className="flex aspect-[145/93.5] w-full flex-col rounded-xl border border-slate-300 bg-mauve-50 shadow-2xl [container-type:inline-size]">
            {/* 헤더 */}
            <div className="flex flex-row border-b border-slate-300 p-[2.76cqw]">
                <div className="flex flex-1 items-center justify-start">
                    <Image
                        src={momocityLogo}
                        alt='모모시티'
                        width={100}
                        className="ml-[1.38cqw] h-auto w-[17.24cqw]"
                    />
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col justify-end">
                    <p className="text-right font-bold text-slate-700 text-[2.41cqw]">주민등록증</p>
                    <p className="text-right font-bold text-slate-400 text-[2.41cqw]">RESIDENT CARD</p>
                </div>
            </div>
            {/* 메인 */}
            <div className="flex flex-1 flex-row border-b border-slate-300 px-[4.14cqw] py-[3.10cqw]">
                <div className="flex items-center justify-center">
                    {/* 💡 기존 빈 박스 자리에 실제 유저 프로필 이미지 예외처리 바인딩 */}
                    <div className="relative mr-[4.14cqw] w-[18.62cqw] aspect-[27/34.5] overflow-hidden rounded-md border border-slate-400 bg-slate-200">
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
                    <div className="flex flex-col gap-[2.07cqw]">
                        <div className="flex flex-row items-end gap-[0.69cqw]">
                            <p className="font-bold text-slate-900 text-[3.28cqw]">{data.name}</p>
                            <p className="font-bold text-slate-400 text-[2.76cqw]">({data.nickname || '닉네임 없음'})</p>
                        </div>
                        <div className="flex flex-col gap-[0.43cqw]">
                            <p className="text-slate-400 text-[1.90cqw]">모모등록번호</p>
                            <p className="font-bold text-slate-900 text-[3.28cqw]">{residentNumber}</p>
                        </div>
                        <div className="flex flex-col gap-[0.43cqw]">
                            <p className="text-slate-400 text-[1.90cqw]">주소</p>
                            <p className="font-bold text-slate-900 text-[2.07cqw]">대한민국 모모시 모모구 모모동 모모로 44길</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* 푸터 */}
            <div className="flex flex-row items-center justify-between p-[2.76cqw]">
                <p className="mt-auto font-bold text-slate-400 text-[1.72cqw]">모모시티 구청장</p>
                <div className="h-[11.72cqw] w-[11.72cqw] rounded-full border-3 border-slate-300 bg-slate-300/30 p-0.5">
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
    );
}
