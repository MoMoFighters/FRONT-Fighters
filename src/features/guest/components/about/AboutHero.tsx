export default function AboutHero() {
    return (
        <section className="border-b border-slate-200 bg-white py-12 sm:py-14">
            <div className="px-5 text-center sm:px-8 lg:px-16">
                <p className="text-[11px] font-semibold text-indigo-500">
                    ABOUT MOMOCITY
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    학습으로 성장하는 나만의 도시,{" "}
                    <span className="text-indigo-500">모모시티</span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
                    자주 묻는 질문을 통해 모모시티의 이용 방법을 알아보세요.
                    <br />
                    수강생과 강사, 궁금한 화면에 맞는 탭을 선택해서 확인할 수 있어요.
                </p>
            </div>
        </section>
    );
}
