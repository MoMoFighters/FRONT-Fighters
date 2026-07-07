"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatRoomListData } from "@/app/services/phone/chat/service";
import { ChatMemberResponse } from "@/features/chat/type";
import {
    createChatRoomAction,
    inviteChatRoomMembersAction,
    leaveChatroomAction,
    modifyChatRoomTitleAction,
} from "@/features/chat/action";
import { getStudentFriendListAction } from "@/features/friend/action";
import { StudentFriendData } from "@/features/friend/type";

interface ChatRoomOptionsMenuProps {
    room: ChatRoomListData;
    isMyRoom: boolean;
}

type SelectableMember = {
    userId: number;
    nickname: string;
    profileImageUrl?: string | null;
    locked: boolean;
};

const getMemberName = (member: ChatMemberResponse | StudentFriendData) =>
    member.nickname?.trim() || "이름 없음";

const getChatBaseHref = (pathname: string) =>
    pathname.startsWith("/teacher")
        ? "/teacher/ask"
        : "/student/phone/friends?status=chat";

export default function ChatRoomOptionsMenu({
    room,
    isMyRoom,
}: ChatRoomOptionsMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isGroupRoom = Boolean(room.roomTitle?.trim());
    const lockedMemberIds = useMemo(
        () => new Set(room.memberInfo.map((member) => member.userId)),
        [room.memberInfo]
    );

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [friends, setFriends] = useState<StudentFriendData[]>([]);
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
    const [inviteRoomTitle, setInviteRoomTitle] = useState("");
    const [renameRoomTitle, setRenameRoomTitle] = useState(room.roomTitle ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFriendLoading, setIsFriendLoading] = useState(false);

    const selectableMembers = useMemo<SelectableMember[]>(() => {
        const lockedMembers = room.memberInfo.map((member) => ({
            userId: member.userId,
            nickname: getMemberName(member),
            profileImageUrl: member.profileImageUrl,
            locked: true,
        }));
        const lockedIds = new Set(lockedMembers.map((member) => member.userId));
        const friendMembers = friends
            .filter((friend) => !lockedIds.has(friend.userId))
            .map((friend) => ({
                userId: friend.userId,
                nickname: getMemberName(friend),
                profileImageUrl: friend.profileImageUrl,
                locked: false,
            }));

        return [...lockedMembers, ...friendMembers];
    }, [friends, room.memberInfo]);

    if (isMyRoom) {
        return null;
    }

    const openInviteDialog = async () => {
        setSelectedFriendIds(room.memberInfo.map((member) => member.userId));
        setInviteRoomTitle(isGroupRoom ? room.roomTitle ?? "" : "");
        setIsInviteDialogOpen(true);
        setIsFriendLoading(true);

        const response = await getStudentFriendListAction();

        if (response.status >= 400) {
            toast.error(response.message || "친구 목록을 불러오지 못했습니다.");
            setFriends([]);
            setIsFriendLoading(false);
            return;
        }

        setFriends(response.data ?? []);
        setIsFriendLoading(false);
    };

    const openRenameDialog = () => {
        setRenameRoomTitle(room.roomTitle ?? "");
        setIsRenameDialogOpen(true);
    };

    const toggleFriend = (userId: number) => {
        if (lockedMemberIds.has(userId)) {
            return;
        }

        setSelectedFriendIds((prev) =>
            prev.includes(userId)
                ? prev.filter((selectedId) => selectedId !== userId)
                : [...prev, userId]
        );
    };

    const closeInviteDialog = () => {
        setIsInviteDialogOpen(false);
        setFriends([]);
        setSelectedFriendIds([]);
        setInviteRoomTitle("");
        setIsSubmitting(false);
        setIsFriendLoading(false);
    };

    const handleInviteSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        const newMemberIds = selectedFriendIds.filter(
            (userId) => !lockedMemberIds.has(userId)
        );

        if (isGroupRoom && newMemberIds.length === 0) {
            toast.error("초대할 대상을 선택해주세요.");
            return;
        }

        if (!isGroupRoom && inviteRoomTitle.trim().length === 0) {
            toast.error("채팅방 이름을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = isGroupRoom
                ? await inviteChatRoomMembersAction({
                    roomId: room.roomId,
                    chatMember: newMemberIds,
                })
                : await createChatRoomAction({
                    chatMember: selectedFriendIds,
                    roomTitle: inviteRoomTitle.trim(),
                });

            if (response.status !== 200 && response.status !== 201) {
                toast.error(response.message, { duration: 1000 });
                return;
            }

            toast.success(response.message, { duration: 1000 });
            closeInviteDialog();

            if (!isGroupRoom) {
                const roomId =
                    response.data && "roomInfo" in response.data
                        ? response.data.roomInfo.roomId
                        : undefined;

                if (roomId) {
                    router.push(`${getChatBaseHref(pathname)}&roomId=${roomId}`);
                }
            }

            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLeaveRoom = async () => {
        const response = await leaveChatroomAction(room.roomId);

        if (response.status !== 200) {
            toast.error(response.message, { duration: 1000 });
            return;
        }

        toast(response.message);
        router.push(getChatBaseHref(pathname));
        router.refresh();
    };

    const handleRenameSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await modifyChatRoomTitleAction({
                roomId: room.roomId,
                roomTitle: renameRoomTitle.trim(),
            });

            if (response.status !== 200 && response.status !== 201) {
                toast.error(response.message, { duration: 1000 });
                return;
            }

            toast.success(response.message, { duration: 1000 });
            setIsRenameDialogOpen(false);
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        aria-label="채팅방 메뉴"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => void openInviteDialog()}>
                        초대하기
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => void handleLeaveRoom()}
                    >
                        나가기
                    </DropdownMenuItem>
                    {isGroupRoom && (
                        <DropdownMenuItem onClick={openRenameDialog}>
                            방 이름 변경
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={isInviteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeInviteDialog();
                    }
                }}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isGroupRoom ? "멤버 초대" : "단체 채팅방 만들기"}
                        </DialogTitle>
                        <DialogDescription>
                            기존 채팅방 멤버는 기본 선택되며 해제할 수 없습니다.
                        </DialogDescription>
                    </DialogHeader>

                    {!isGroupRoom && (
                        <input
                            value={inviteRoomTitle}
                            onChange={(event) => setInviteRoomTitle(event.target.value)}
                            maxLength={20}
                            placeholder="채팅방 이름을 입력해주세요."
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />
                    )}

                    <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        {isFriendLoading ? (
                            <div className="py-10 text-center text-sm font-bold text-slate-400">
                                친구 목록을 불러오는 중입니다.
                            </div>
                        ) : selectableMembers.length > 0 ? (
                            selectableMembers.map((member) => {
                                const isSelected = selectedFriendIds.includes(member.userId);

                                return (
                                    <button
                                        key={member.userId}
                                        type="button"
                                        disabled={member.locked}
                                        onClick={() => toggleFriend(member.userId)}
                                        className={`mb-2 flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition ${
                                            isSelected
                                                ? "border-indigo-200 bg-indigo-50"
                                                : "border-slate-100 hover:border-slate-200"
                                        } ${member.locked ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                                    >
                                        <span
                                            className={`h-4 w-4 rounded border ${
                                                isSelected
                                                    ? "border-indigo-500 bg-indigo-500"
                                                    : "border-slate-300 bg-white"
                                            }`}
                                        />
                                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-indigo-50">
                                            {member.profileImageUrl ? (
                                                <Image
                                                    src={member.profileImageUrl}
                                                    alt="프로필"
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-500">
                                                    {member.nickname.slice(0, 1)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-slate-800">
                                                {member.nickname}
                                            </p>
                                            {member.locked && (
                                                <p className="text-xs font-medium text-slate-400">
                                                    기존 멤버
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-10 text-center text-sm font-bold text-slate-400">
                                초대할 수 있는 친구가 없습니다.
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeInviteDialog}
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            disabled={isSubmitting || isFriendLoading}
                            onClick={handleInviteSubmit}
                            className="bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                            {isSubmitting ? "처리 중" : "확인"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>방 이름 변경</DialogTitle>
                        <DialogDescription>
                            단체 채팅방 이름은 최대 20자까지 가능합니다.
                        </DialogDescription>
                    </DialogHeader>

                    <input
                        value={renameRoomTitle}
                        onChange={(event) => setRenameRoomTitle(event.target.value)}
                        maxLength={20}
                        placeholder="변경할 방 이름"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsRenameDialogOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleRenameSubmit}
                            className="bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                            {isSubmitting ? "변경 중" : "변경"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
