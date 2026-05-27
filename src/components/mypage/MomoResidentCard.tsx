import Image from "next/image";
import momocityLogo from '@/app/assets/img/header_logo.png'
import momo from '@/app/assets/img/momo.png'
import { Upload } from "lucide-react";

export default function MomoResidentCard({ data }: {
    data: {
        name: string;
        nickname: string;
        idNumber: number;
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
            <div className="flex flex-col w-145 h-91.5 border border-slate-300 rounded-xl bg-slate-100">
                <div className="p-4 flex flex-row">
                    <div className="flex-1"></div>
                    <div className=""></div>
                </div>
            </div>







            <div className="shrink-0">
                <div
                    className="relative rounded-xl overflow-hidden shadow-2xl"
                    style={{
                        width: '580px',
                        height: '366px',
                        background: 'linear-gradient(140deg, #f8fafc 0%, #f1f5f9 55%, #e2e8f0 100%)',
                        border: '1.5px solid #cbd5e1',
                    }}
                >
                    {/* Subtle dot pattern */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.06]"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
                            backgroundSize: '14px 14px',
                        }}
                    />

                    {/* Top header bar */}
                    <div
                        className="relative flex items-center justify-between px-6 pt-4 pb-3"
                        style={{ borderBottom: '1px solid #cbd5e1' }}
                    >
                        <Image
                            src={momocityLogo}
                            alt="MOMOCITY"
                            className="h-9 object-contain"
                        />
                        <div className="text-right">
                            <div className="text-[11px] font-bold text-slate-700 tracking-[0.2em]">주민등록증</div>
                            <div className="text-[9px] text-slate-400 tracking-widest mt-0.5">RESIDENT CARD</div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="relative flex gap-6 px-6 pt-5 pb-4">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="profile-upload"
                            />
                            <label
                                htmlFor="profile-upload"
                                className="block cursor-pointer overflow-hidden rounded"
                                style={{
                                    width: '110px',
                                    height: '140px',
                                    border: '1px solid #94a3b8',
                                    background: '#e2e8f0',
                                }}
                                title="클릭하여 사진 변경"
                            >
                                {/* {profileImage ? (
                                <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                            ) : ( */}
                                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                    <Upload className="w-6 h-6 text-slate-400" />
                                    <span className="text-[10px] text-slate-400">사진</span>
                                </div>
                                {/* )} */}
                            </label>
                        </div>

                        {/* Info fields */}
                        <div className="flex-1 space-y-3 pt-1">
                            {/* Name */}
                            <div>
                                <div className="text-[19px] font-bold text-slate-900 tracking-wide">
                                    {USER_DATA.name}
                                    <span className="text-sm font-normal text-slate-400 ml-2">({USER_DATA.nickname})</span>
                                </div>
                            </div>

                            {/* ID Number */}
                            <div>
                                <div className="text-[9px] text-slate-400 tracking-widest mb-1 uppercase">주민등록번호</div>
                                <div className="text-base font-bold text-slate-800 tracking-[0.15em] font-mono">
                                    {USER_DATA.idNumber}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <div className="text-[9px] text-slate-400 tracking-widest mb-1 uppercase">주소</div>
                                <div className="text-[12px] text-slate-700 leading-relaxed">
                                    {USER_DATA.address}
                                </div>
                            </div>

                            {/* Issue date */}
                            <div className="pt-1">
                                <div className="text-[11px] text-slate-500">{USER_DATA.issueDate}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div
                        className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pb-4 pt-3"
                        style={{ borderTop: '1px solid #e2e8f0' }}
                    >
                        <div className="text-[10px] font-semibold text-slate-500 tracking-widest">
                            모모특별시 모모구청장
                        </div>

                        {/* Stamp */}
                        <div className="relative w-[68px] h-[68px]">
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{ border: '2.5px solid #94a3b8', opacity: 0.7, transform: 'rotate(-12deg)' }}
                            />
                            <div
                                className="absolute inset-[5px] rounded-full"
                                style={{ border: '1px solid #94a3b8', opacity: 0.45, transform: 'rotate(-12deg)' }}
                            />
                            <div
                                className="absolute inset-[8px] rounded-full overflow-hidden"
                                style={{ transform: 'rotate(-12deg)', opacity: 0.82 }}
                            >
                                <Image
                                    src={momo}
                                    alt="모모시 도장"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle, rgba(148,163,184,0.06) 0%, rgba(100,116,139,0.14) 100%)',
                                    transform: 'rotate(-12deg)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom edge stripe */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ background: 'linear-gradient(90deg, #cbd5e1, #94a3b8, #cbd5e1)' }}
                    />
                </div>

                <p className="text-[11px] text-slate-400 text-center mt-2">
                    사진을 클릭하면 변경할 수 있습니다
                </p>
            </div>
        </>
    );
}