import { ArrowRight, BookOpen, Star, Users } from "lucide-react";
import cityImage from "@/app/assets/img/homeCityImg.png";
import Image from "next/image";
import Link from "next/link";

const LECTURE_LIST_HREF = "/lectures";

const heroStats = [
  {
    value: "12,000+",
    label: "함께하는 사용자",
    icon: Users,
    className: "bg-indigo-50 text-indigo-500",
  },
  {
    value: "739+",
    label: "진행중인 강의",
    icon: BookOpen,
    className: "bg-sky-50 text-sky-500",
  },
  {
    value: "4.8점",
    label: "수강 만족도",
    icon: Star,
    className: "bg-violet-50 text-violet-500",
  },
];

export default function GuestHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[50%] lg:block">
        <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.5)_10%,#000_20%)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
          <Image
            src={cityImage}
            alt="도시 배경"
            fill
            sizes="50vw"
            className="object-cover object-right opacity-55 saturate-90 contrast-95"
            priority
          />
        </div>
      </div>

      <div className="relative px-16">
        <div className="max-w-xl">
          <h1 className="text-[2.75rem] font-bold leading-tight tracking-tight text-slate-950 pt-12">
            원하는 분야를 학습하고
            <br />
            <span className="text-indigo-500">나만의 도시를 꾸며보세요!</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-6 text-slate-600">
            모모시티는 오늘의 공부를 눈에 보이는 변화로 바꾸어 성장 동기를 부여하는 학습 플랫폼입니다.
            관심 카테고리를 고르고 강의를 수강하면 카테고리에 맞는 건물이 생겨나고, 여러 강의를 추가로 수강하면 건물이 성장합니다.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link href={LECTURE_LIST_HREF}>
              <button className="group flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-500/90 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/25">
                강의 둘러보기
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 pt-7">
            {heroStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
