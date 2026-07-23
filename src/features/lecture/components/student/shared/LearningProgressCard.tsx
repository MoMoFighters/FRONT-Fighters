interface LearningProgressCardProps {
    categoryLabel: string;
    progress: number;
}

export default function LearningProgressCard({
    categoryLabel,
    progress,
}: LearningProgressCardProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
            <h2 className="text-[clamp(0.875rem,4cqw,1rem)] font-bold text-slate-950">
                나의 학습 현황
            </h2>

            <div className="mt-5 flex flex-col items-center">
                <div
                    className="relative flex h-[clamp(6rem,40cqw,9rem)] w-[clamp(6rem,40cqw,9rem)] items-center justify-center rounded-full"
                    style={{
                        background: `conic-gradient(rgb(129 140 248) ${progress * 3.6}deg, rgb(226 232 240) 0deg)`,
                    }}
                >
                    <div className="flex h-[clamp(4.5rem,31cqw,7rem)] w-[clamp(4.5rem,31cqw,7rem)] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                        <span className="text-[clamp(1.25rem,7cqw,1.875rem)] font-black text-slate-950">
                            {progress}%
                        </span>

                        <span className="mt-1 text-[clamp(0.625rem,1.6cqw,0.75rem)] font-bold text-slate-400">
                            전체 진도율
                        </span>
                    </div>
                </div>

                <p className="mt-5 text-center text-[clamp(0.7rem,1.8cqw,0.875rem)] font-medium leading-6 text-slate-500">
                    {categoryLabel} 건물의 전체 강의 기준
                    <br />
                    총 학습 진행률입니다.
                </p>
            </div>
        </section>
    );
}
