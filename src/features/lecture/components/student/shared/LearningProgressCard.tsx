interface LearningProgressCardProps {
    categoryLabel: string;
    progress: number;
}

export default function LearningProgressCard({
    categoryLabel,
    progress,
}: LearningProgressCardProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                나의 학습 현황
            </h2>

            <div className="mt-5 flex flex-col items-center">
                <div
                    className="relative flex h-36 w-36 items-center justify-center rounded-full"
                    style={{
                        background: `conic-gradient(rgb(129 140 248) ${progress * 3.6}deg, rgb(226 232 240) 0deg)`,
                    }}
                >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                        <span className="text-3xl font-black text-slate-950">
                            {progress}%
                        </span>

                        <span className="mt-1 text-xs font-bold text-slate-400">
                            전체 진도율
                        </span>
                    </div>
                </div>

                <p className="mt-5 text-center text-sm font-medium leading-6 text-slate-500">
                    {categoryLabel} 건물의 전체 강의 기준
                    <br />
                    총 학습 진행률입니다.
                </p>
            </div>
        </section>
    );
}
