import Image, { StaticImageData } from "next/image";
import ART from '@/app/assets/img/ART.png'
import STUDY from '@/app/assets/img/STUDY.png'
import COOK from '@/app/assets/img/COOK2.png'
import HEALTH from '@/app/assets/img/HEALTH1.png'
import BEAUTY from '@/app/assets/img/BEAUTY1.png'
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LectureCategoryListPage({ params }: { params: Promise<{ category: string }> }) {

    const { category } = await params;

    let image: StaticImageData;
    let building: string;

    switch (category) {
        case 'study':
            image = STUDY;
            building = '학교';
            break;

        case 'art':
            image = ART;
            building = '아트홀';
            break;

        case 'cook':
            image = COOK;
            building = '식당';
            break;

        case 'fitness':
            image = HEALTH;
            building = '헬스장';
            break;

        case 'beauty':
            image = BEAUTY;
            building = '백화점';
            break;

        default:
            image = STUDY;
            building = '';
    }

    return (
        <>
            <div className="w-full h-full relative">
                <Image
                    src={image}
                    alt="이미지"
                    fill
                    priority
                />
                <div className="absolute top-10 left-5 w-60 h-15 p-2 bg-black/50 flex flex-col gap-2">
                    <h3 className="text-slate-50 text-md font-semibold">
                        {building} Lv.1
                    </h3>
                    <HoverCard openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <Progress value={66} id="progress-upload" className="cursor-pointer" />
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className="text-center font-mediaum text-slate-700 text-[12px]">건물 업그레이드까지 남은 강의 수: 3/5</div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
                <Link href={`/student/${category}/lectures`}>
                    <Button className="absolute top-28 left-5 px-6 py-5 bg-blue-400 text-white text-lg cursor-pointer transition-all duration-300 hover:bg-blue-500 hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(0,0,0,0.18)]">
                        강의실 가기
                    </Button>
                </Link>
            </div>
        </>
    );
}