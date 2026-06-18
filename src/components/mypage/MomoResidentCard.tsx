import Image from "next/image";
import momocityLogo from '@/app/assets/img/header_logo.png'
import momo from '@/app/assets/img/momo.png'
import Link from "next/link";
import { UserRound } from "lucide-react";

interface ResidentCardProps {
    data: {
        name: string;
        nickname: string;
        createdAt: string;
        profileImageUrl: string;
    }
}

const formatResidentCreatedAt = (createdAt: string) => {
    const digits = createdAt.replace(/\D/g, "");

    if (digits.length >= 8) {
        return digits.slice(2, 8);
    }

    if (digits.length >= 6) {
        return digits.slice(0, 6);
    }

    return createdAt;
};

export default function MomoResidentCard({ data }: ResidentCardProps) {
    const residentNumberPrefix = formatResidentCreatedAt(data.createdAt);
    const isBlobProfileImage = data.profileImageUrl.startsWith("blob:");

    return (
        <div className="flex flex-col w-145 h-93.5 border border-slate-300 rounded-xl bg-mauve-50 shadow-2xl">
            {/* 헤더 */}
            <div className="p-4 flex flex-row border-b border-slate-300">
                <div className="flex-1 flex justify-start">
                    <Image src={momocityLogo} alt='모모시티' className="h-10 w-26 ml-2" />
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col justify-end">
                    <p className="text-right text-sm text-slate-700 font-semibold">주민등록증</p>
                    <p className="text-right text-sm text-slate-400 font-semibold">RESIDENT CARD</p>
                </div>
            </div>
            {/* 메인 */}
            <div className="flex flex-row h-51 border-b border-slate-300 px-6 py-4.5">
                <div className="flex justify-center items-center">
                    {/* 💡 기존 빈 박스 자리에 실제 유저 프로필 이미지 예외처리 바인딩 */}
                    <div className="relative w-27 h-34.5 border border-slate-400 rounded-md mr-6 overflow-hidden bg-slate-200">
                        {data.profileImageUrl ? (
                            <Image
                                src={data.profileImageUrl}
                                alt="프로필 사진"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <UserRound className="h-14 w-14" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    <div className="gap-3 flex flex-col">
                        <div className="flex flex-row gap-1 items-end">
                            <p className="text-[19px] font-bold text-slate-900">{data.name}</p>
                            <p className="text-[16px] font-semibold text-slate-400">({data.nickname || '닉네임 없음'})</p>
                        </div>
                        <div className="flex flex-col gap-[2.5px]">
                            <p className="text-[11px] text-slate-400">모모등록번호</p>
                            <p className="text-[19px] text-slate-900 font-bold">{residentNumberPrefix}-xxxxxx</p>
                        </div>
                        <div className="flex flex-col gap-[2.5px]">
                            <p className="text-[11px] text-slate-400">주소</p>
                            <p className="text-[12px] text-slate-900 font-bold">대한민국 모모시 모모구 모모동 모모로 44길</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* 푸터 */}
            <div className="flex flex-row p-4 items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 mt-auto">모모시티 구청장</p>
                <div className="h-17 w-17 border-3 border-slate-300 rounded-full p-0.5 bg-slate-300/30">
                    <div className="w-full h-full border border-slate-300 rounded-full overflow-hidden">
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
