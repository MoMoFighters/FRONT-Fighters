import { Clock3 } from "lucide-react";

export default function ChapterStudyInfoCard() {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
            <div className="flex items-center gap-4">
                <div className="flex h-[clamp(2.5rem,11cqw,3rem)] w-[clamp(2.5rem,11cqw,3rem)] shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <Clock3 className="h-[clamp(1rem,5cqw,1.25rem)] w-[clamp(1rem,5cqw,1.25rem)]" />
                </div>

                <div className="min-w-0">
                    <h2 className="text-[clamp(0.9375rem,4cqw,1rem)] font-bold text-slate-950">
                        학습 기록은 자동 저장됩니다
                    </h2>

                    <p className="mt-1 text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-medium text-slate-500">
                        잠시 나가더라도 이어서 학습할 수 있어요.
                    </p>
                </div>
            </div>
        </section>
    );
}
