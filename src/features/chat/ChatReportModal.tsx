"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface MessageReportData {
    id: number;
    message: string;
    setIsModal: (open: boolean) => void;
}

export default function ChatReportModal({
    id,
    message,
    setIsModal,
}: MessageReportData) {
    const [isSending, setIsSending] = useState(false);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
            onClick={() => setIsModal(false)}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-5 shadow-2xl shadow-slate-950/25"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            메시지 신고
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            문제가 있는 메시지를 신고할 수 있습니다.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="rounded-full text-xl p-1 leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        onClick={() => setIsModal(false)}
                        aria-label="닫기"
                    >
                        <X />
                    </button>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-400">
                        신고 대상 메시지
                    </p>
                    <p className="mt-1 max-h-28 overflow-y-auto whitespace-pre-wrap break-words text-sm text-slate-700">
                        {message}
                    </p>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        onClick={() => setIsModal(false)}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
                        disabled={isSending}
                        onClick={() => setIsSending(true)}
                    >
                        {isSending ? "처리 중" : "신고하기"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
