'use client'

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createChatRoomAction } from "@/features/chat/action";

// 임시 가상 친구 데이터 (원래는 백엔드에서 받아와야 합니다)
interface FriendInfo {
    userId: number;
    nickname: string;
    role: 'student' | 'teacher';
}

const mockFriends: FriendInfo[] = [
    { userId: 10, nickname: "홍길동", role: "student" },
    { userId: 11, nickname: "이순신", role: "teacher" },
    { userId: 12, nickname: "강감찬", role: "student" },
];

interface FriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FriendModal({ isOpen, onClose }: FriendModalProps) {
    const router = useRouter();

    const createChatRoomFormAction = async (
        _prevState: Awaited<ReturnType<typeof createChatRoomAction>>,
        formData: FormData,
    ) => {
        const userId = Number(formData.get("userId"));
        return createChatRoomAction(userId);
    };

    // Server Action 바인딩
    const [state, formAction, isPending] = useActionState(createChatRoomFormAction, {
        timestamp: "",
        status: 0,
        code: "",
        message: "",
    });

    // 액션 수행 결과 감지 후 리다이렉트 처리
    useEffect(() => {
        if (state.status >= 200 && state.status < 300 && state.data?.roomId) {
            onClose(); // 모달 닫기

            // 현재 주소가 강사 페이지인지 학생 페이지인지 판별하여 리다이렉트
            const isTeacherPage = window.location.pathname.startsWith('/teacher');
            if (isTeacherPage) {
                router.push(`/teacher/ask?roomId=${state.data.roomId}`);
            } else {
                router.push(`/student/phone/friends?status=friend&roomId=${state.data.roomId}`);
            }
        } else if (state.status >= 400 && state.message) {
            // 명세서에 명시된 에러 메시지(예: "자기 자신과는 대화창을 개설할 수 없습니다.") 노출
            alert(state.message);
        }
    }, [state, router, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-96 max-h-96 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">새 대화 시작하기 (+버튼 목록)</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">닫기</button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                    {mockFriends.map((friend) => (
                        <div key={friend.userId} className="flex items-center justify-between p-3 border border-slate-100 rounded-sm bg-slate-50">
                            <div>
                                <span className="font-semibold text-slate-800">{friend.nickname}</span>
                                <span className="text-xs text-slate-500 ml-1">
                                    {friend.role === 'teacher' ? '(강사)' : '(학생)'}
                                </span>
                            </div>

                            {/* Server Action 연동 Form */}
                            <form action={formAction}>
                                <input type="hidden" name="userId" value={friend.userId} />
                                <Button type="submit" disabled={isPending} size="sm">
                                    {isPending ? "연결중..." : "채팅하기"}
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
