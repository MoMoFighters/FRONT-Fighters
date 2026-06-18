import Image, { StaticImageData } from "next/image";
import library from '@/app/assets/img/library.png'
import mypage from '@/app/assets/img/mypage.png'
import market from '@/app/assets/img/market.png'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import Link from "next/link";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { Category } from "@/features/lecture/type";

interface BuildingItemProps { category: string, level?: number }

export default function BuildingItem({ category, level }: BuildingItemProps) {

    let image: StaticImageData;
    let label: string;
    let explain: string;
    let building: string;

    switch (category) {
        case 'study':
        case 'art':
        case 'cook':
        case 'fitness':
        case 'beauty':
            const categoryMeta = getCategoryMeta(category.toUpperCase() as Category);
            image = categoryMeta.buildingImage;
            label = categoryMeta.label;
            building = categoryMeta.buildingName;
            explain = categoryMeta.description;
            break;

        case 'community':
            image = library;
            label = '도서관';
            building = '도서관';
            explain = '모모시티의 커뮤니티 페이지로 이동합니다.'
            break;

        case 'mypage':
            image = mypage;
            label = '집';
            building = '집';
            explain = '마이 페이지로 이동합니다.'
            break;

        case 'payments':
            image = market;
            label = '상점';
            building = '포인트 상점';
            explain = '포인트를 사용할 수 있는 상점 페이지로 이동합니다.'
            break;

        default:
            const defaultCategoryMeta = getCategoryMeta("STUDY");
            image = defaultCategoryMeta.buildingImage;
            label = '';
            building = '';
            explain = ''
    }

    const moveHref = (category === "community" && '/student/community')
        || (category === "mypage" && '/student/mypage')
        || (category === "payments" && '/student/payments')
        || `/student/${category}`

    return (
        <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>
                <Link href={moveHref}>
                    <div className="relative w-45 h-30 rounded-lg cursor-pointer hover:scale-[1.02] transition-all">
                        <Image
                            src={image}
                            alt="건물 이미지"
                            fill
                            sizes="10vw"
                            className="w-45 absolute bottom-5"
                        />

                        <div
                            className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    -bottom-2

                    px-4
                    py-1.5

                    rounded-lg

                    bg-slate-50/90

                    shadow-sm

                    text-sm
                    font-bold
                    text-slate-900
                "
                        >
                            {label}
                        </div>
                    </div>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
                <div className="font-semibold text-slate-700 text-[14px]">{building} {level ? `Lv.${level}` : ""}</div>
                <div className="text-slate-500 text-[12px]">{explain}</div>
            </HoverCardContent>
        </HoverCard>

    );
}
