import Image from "next/image";
import building from "@/app/assets/img/building.png"
import resume from "@/app/assets/img/resume.png"
import find from "@/app/assets/img/find.svg"

const growthSteps = [
  {
    image: find,
    title: "카테고리 선택",
    description: "관심 분야를 고르고 학습을 시작합니다.",
  },
  {
    image: resume,
    title: "강의 수강",
    description: "수강을 신청하고 학습을 진행합니다.",
  },
  {
    image: building,
    title: "도시 성장",
    description: "수강하고 있는 강의 수에 따라 건물이 성장합니다.",
  },
];

export default function GuestGrowthStepsSection() {
  return (
    <section className="bg-white py-10">
      <div className="px-16">
        <div className="mb-5">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-slate-950">
              모모시티 성장 가이드
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_46px_1fr_46px_1fr] items-center gap-3">
          {growthSteps.map((step, index) => {
            const showArrow = index < growthSteps.length - 1;

            return (
              <div key={step.title} className="contents">
                <div
                  className="flex min-h-20 items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex justify-center items-center h-13 w-13 shrink-0 overflow-hidden rounded-full bg-indigo-50">
                    <div className="w-8 h-6 relative">
                      <Image
                        src={step.image}
                        alt={step.title}
                        className="object-contain"
                        fill
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-950">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs leading-5 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
                {showArrow && (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center whitespace-nowrap text-lg font-light tracking-widest text-slate-300"
                  >
                    ---&gt;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
