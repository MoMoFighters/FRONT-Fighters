'use client'

export default function AddMemoModal({ setIsMemoModalOpen }: { setIsMemoModalOpen: (a: boolean) => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setIsMemoModalOpen(false)}
        >
            <div
                className="w-90 rounded-2xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-slate-900">
                    메모 추가하기
                </h2>

                <textarea
                    className="mt-4 h-32 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-300"
                    placeholder="메모를 입력하세요"
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMemoModalOpen(false)}
                        className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500"
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white"
                    >
                        추가하기
                    </button>
                </div>
            </div>
        </div>
    );
}