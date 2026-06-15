import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getCategoryMeta from "@/features/lecture/components/student/category";
import { CategoryUrl } from "@/features/lecture/type";

export default async function LectureCategoryListPage({ params }: { params: Promise<{ category: CategoryUrl }> }) {

    const { category } = await params;
    const categoryMeta = getCategoryMeta(category);

    return (
        <>
            <div className="w-full h-full relative overflow-hidden">
                <Image
                    src={categoryMeta.backgroundImage}
                    alt={`${categoryMeta.buildingName} 이미지`}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute top-10 left-5 w-60 h-15 p-2 bg-black/50 flex flex-col gap-2">
                    <h3 className="text-slate-50 text-md font-semibold">
                        {categoryMeta.buildingName} Lv.1
                    </h3>
                    <HoverCard openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <Progress value={66} className="cursor-pointer" />
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className="text-center font-mediaum text-slate-700 text-[12px]">건물 업그레이드까지 남은 강의 수: 3/5</div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
                <Link href={`/student/${category}/lectures`}>
                    <Button className="absolute top-28 left-5 px-6 py-5 bg-indigo-200 text-slate-700 text-md font-semibold cursor-pointer transition-all duration-300 hover:bg-indigo-300 hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(0,0,0,0.18)]">
                        강의실 가기
                    </Button>
                </Link>
            </div>
        </>
    );
}   
