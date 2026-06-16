import { Clock3 } from "lucide-react";

export default function ChapterStudyInfoCard() {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <Clock3 className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-base font-bold text-slate-950">
                        학습 기록은 자동 저장됩니다
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                        잠시 나가더라도 이어서 학습할 수 있어요.
                    </p>
                </div>
            </div>
        </section>
    );
}
