import Link from "next/link";

export default function BuildGuideCard() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                MoMoCITY 시작하기
            </h2>

            <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                강의를 신청하면 해당 카테고리의 건물을 세울 수 있습니다.
                관심 있는 분야를 선택하고 첫 번째 건물을 만들어보세요.
            </p>

            <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                <p className="text-sm font-bold text-indigo-500">
                    건물 생성 흐름
                </p>

                <ol className="mt-3 space-y-2 text-sm font-medium text-slate-600">
                    <li>1. 원하는 카테고리 강의 선택</li>
                    <li>2. 강의 수강 신청</li>
                    <li>3. 내 도시에 건물 생성</li>
                    <li>4. 학습 진행률에 따라 건물 성장</li>
                </ol>
            </div>

            <Link
                href="/student"
                className="mt-5 flex h-11 items-center justify-center rounded-xl border border-indigo-300 text-sm font-bold text-indigo-500 transition hover:bg-indigo-50"
            >
                내 도시 보기
            </Link>
        </section>
    );
}
