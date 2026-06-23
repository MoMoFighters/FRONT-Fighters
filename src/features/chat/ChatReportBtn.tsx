'use client'

import { useState } from "react";

export default function ChatReportBtn() {

    // 신고 접수 중 상태 관리
    const [isSending, setIsSending] = useState(false);

    // 신고 모달 창 상태 관리
    const [isModal, setIsModal] = useState(false);

    return (
        <>
            {/* 버튼 영역 */}
            <button
                className=""
                onClick={() => setIsModal(true)}
            >

            </button >

            {/* 모달 영역 */}
            <div
                className="fixed w-[100vw] h-[100vh] bg-gray-500/30"
                onClick={() => setIsModal(false)
                }
            >
                <div className="rounded-lg bg-slate-100 mx-auto my-auto w-[60vw] h-50 flex flex-col">
                    <div className="w-full p-3">
                        <h3 className="font-bold text-lg">메시지 신고</h3>
                    </div>
                </div>
            </div>
        </>
    );
}