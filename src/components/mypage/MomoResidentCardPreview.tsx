import MomoResidentCard from "@/components/mypage/MomoResidentCard";

interface MomoResidentCardPreviewProps {
    data: {
        name: string;
        nickname: string;
        createdAt: string;
        profileImageUrl: string;
    };
}

export default function MomoResidentCardPreview({
    data,
}: MomoResidentCardPreviewProps) {
    return (
        <div className="flex h-full w-full flex-col items-center">
            <h3 className="mb-6 text-lg font-black text-slate-900">
                주민등록증 미리보기
            </h3>

            <div className="h-[292px] w-[452px] overflow-visible">
                <div className="w-145 origin-top-left scale-[0.78]">
                    <MomoResidentCard data={data} />
                </div>
            </div>
        </div>
    );
}
