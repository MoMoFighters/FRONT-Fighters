'use client'

import { Button } from "@/components/ui/button";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { logoutAction } from "../action";

export default function DeleteAccountBtn({ userName }: { userName: string }) {
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [input, setInput] = useState("");
    const router = useRouter();

    const deleteAccount = async () => {
        toast("회원 탈퇴", {
            duration: 1000,
        });
        // 이거 아래에 나중에 연결할 것은
        // 1. 회원탈퇴
        // 2. 쿠키 삭제
        // 3. redirect 루트
        logoutAction();
        router.push("/");
    };

    return (
        <>
            <Button
                className="cursor-pointer text-xs bg-red-500 hover:bg-red-600"
                onClick={() => setIsModal(true)}
            >
                회원 탈퇴
            </Button>

            <TwoButtonModal
                open={isConfirmModal}
                onOpenChange={setIsConfirmModal}
                title="정말 탈퇴하시겠습니까?"
                description="한 번 탈퇴하면 되돌릴 수 없습니다."
                onConfirm={async () => {
                    await deleteAccount();
                    setIsConfirmModal(false);
                    setIsModal(false);
                }}
            />

            {isModal && (
                <div
                    className="fixed inset-0 z-50 flex h-screen w-screen bg-black/50"
                    onClick={() => setIsModal(false)}
                >
                    <div
                        className="mx-auto my-auto flex h-90 w-120 flex-col gap-2 rounded-xl bg-slate-50 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex w-full justify-end">
                            <X
                                className="cursor-pointer"
                                onClick={() => setIsModal(false)}
                            />
                        </div>

                        <div className="flex justify-center text-xl font-bold">
                            <h3>회원탈퇴</h3>
                        </div>

                        <div className="my-3 flex flex-col items-center gap-2 flex-1">
                            <p className="text-sm text-slate-500 w-[90%]">회원탈퇴 시 3개월의 기간 동안 동일 이메일 또는 소셜 로그인 정보로 회원가입이 불가능합니다.
                                탈퇴 후 계정 복구를 원하시는 경우 3개월 이내에 <span className="font-bold text-black underline">yourmomocity@gmail.com</span> 로 문의 부탁드립니다.</p>
                            <p className="mt-7">
                                회원탈퇴를 하시려면 "
                                <span className="font-bold underline">{userName}</span>
                                " 을 입력해주세요.
                            </p>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                type="text"
                                placeholder={userName}
                                className="w-[90%] rounded-md border border-black p-2 px-3"
                            />
                        </div>

                        <Button
                            className="mx-auto cursor-pointer bg-red-500 px-4 hover:bg-red-600 disabled:bg-red-300"
                            disabled={input !== userName}
                            onClick={() => setIsConfirmModal(true)}
                        >
                            회원 탈퇴
                        </Button>
                    </div >
                </div >
            )
            }
        </>
    );
}
