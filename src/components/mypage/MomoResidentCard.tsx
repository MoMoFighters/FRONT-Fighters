import Image from "next/image";
import momocityLogo from '@/app/assets/img/header_logo.png'
import momo from '@/app/assets/img/momo.png'
import { Upload } from "lucide-react";

export default function MomoResidentCard({ data }: {
    data: {
        name: string;
        nickname: string;
        createdAt: number;
        address: string;
        issueDate: string;
        email: string;
        points: number
        buildings: number;
    }
}) {

    const USER_DATA = data

    return (
        <>
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
                    <div className="flex justify-center align-middle ">
                        <div className="w-27 h-34.5 border border-slate-500 rounded-md mr-6">

                        </div>
                        <div className="gap-3 flex flex-col">
                            <div className="flex flex-row gap-1 items-end">
                                <p className="text-[19px] font-bold text-slate-900">
                                    {USER_DATA.name}
                                </p>
                                <p className="text-[16px] font-semibold text-slate-400">
                                    ({USER_DATA.nickname})
                                </p>
                            </div>
                            <div className="flex flex-col gap-[2.5px]">
                                <p className="text-[11px] text-slate-400">모모등록번호</p>
                                <p className="text-[19px] text-slate-900 font-bold">{USER_DATA.createdAt}-xxxxxx</p>
                            </div>
                            <div className="flex flex-col gap-[2.5px]">
                                <p className="text-[11px] text-slate-400">주소</p>
                                <p className="text-[12px] text-slate-900 font-bold">대한민국 모모시 모모구 모모동 모모로 44길</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-900 font-bold">
                                    {USER_DATA.issueDate}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
                {/* 푸터 */}
                <div className="flex flex-row p-4">
                    <div className="flex flex-col">
                        <div className="flex-1"></div>
                        <p className="text-[10px] font-bold text-slate-400">모모시티 구청장</p>
                    </div>
                    <div className="flex-1"></div>
                    <div
                        className="h-17 w-17 border-3 border-slate-300 rounded-full p-0.5 bg-slate-300/30"
                    >
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


        </>
    );
}