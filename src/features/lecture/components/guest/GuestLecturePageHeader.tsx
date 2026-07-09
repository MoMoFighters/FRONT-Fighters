import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GuestLecturePageHeader() {
    return (
        <section className="border-b border-slate-200 bg-white px-16 py-6">
            <div className="max-w-3xl">
                <p className="mb-3 text-xs font-bold text-indigo-500">
                    LECTURES
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    관심 있는 강의를 둘러보세요
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                    모모시티의 강의는 카테고리별로 구성되어 있습니다. 원하는 분야의 강의를
                    확인하고, 로그인 후 수강을 시작하면 학습 기록이 나만의 도시 성장으로 이어집니다.
                </p>

                <div className="mt-6 flex items-center gap-3">
                    <Link
                        href="/auth/login"
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-500 px-4 text-xs font-bold text-white transition-colors hover:bg-indigo-600"
                    >
                        무료로 시작하기
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
