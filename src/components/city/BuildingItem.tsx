import Image, { StaticImageData } from "next/image";
import school from '@/app/assets/img/school.png'
import art from '@/app/assets/img/arts.png'
import cook from '@/app/assets/img/cook.png'
import health from '@/app/assets/img/health.png'
import beauty from '@/app/assets/img/beauty.png'
import library from '@/app/assets/img/library.png'
import mypage from '@/app/assets/img/mypage.png'
import market from '@/app/assets/img/market.png'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import Link from "next/link";

interface BuildingItemProps { category: string, level?: number }

export default function BuildingItem({ category, level }: BuildingItemProps) {

    let image: StaticImageData;
    let label: string;
    let explain: string;
    let building: string;

    switch (category) {
        case 'study':
            image = school;
            label = '학습';
            building = '학교';
            explain = '학습 카테고리 관련 강의를 수강할 수 있는 페이지로 이동합니다.'
            break;

        case 'art':
            image = art;
            label = '예술';
            building = '아트홀';
            explain = '예술(음악, 미술 등) 카테고리 관련 강의를 수강할 수 있는 페이지로 이동합니다.'
            break;

        case 'cook':
            image = cook;
            label = '요리';
            building = '식당';
            explain = '요리 카테고리 관련 강의를 수강할 수 있는 페이지로 이동합니다.'
            break;

        case 'health':
            image = health;
            label = '운동';
            building = '헬스장';
            explain = '운동(헬스, 스포츠 등) 카테고리 관련 강의를 수강할 수 있는 페이지로 이동합니다.'
            break;

        case 'beauty':
            image = beauty;
            label = '뷰티';
            building = '백화점';
            explain = '뷰티(패션, 화장 등) 카테고리 관련 강의를 수강할 수 있는 페이지로 이동합니다.'
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

        case 'market':
            image = market;
            label = '상점';
            building = '포인트 상점';
            explain = '포인트를 사용할 수 있는 상점 페이지로 이동합니다.'
            break;

        default:
            image = school;
            label = '';
            building = '';
            explain = ''
    }

    return (
        <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>
                <Link href={`/student/${category}`}>
                    <div className="relative w-40 h-30  rounded-lg cursor-pointer hover:scale-[1.02] transition-all">
                        <Image
                            src={image}
                            alt="건물 이미지"
                            className="w-40 absolute bottom-5"
                            priority
                        />

                        <div
                            className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    bottom-0

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