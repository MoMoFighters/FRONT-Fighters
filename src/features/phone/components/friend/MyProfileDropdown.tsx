'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BlockUserListModal from "./BlockUserListModal";

interface MyProfileDropdownProps {
    myRole?: 'STUDENT' | "TEACHER";
    myChatRoomId: number | undefined;
}

export default function MyProfileDropdown({ myChatRoomId }: MyProfileDropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [blockModal, setBlockModal] = useState(false);

    const router = useRouter();

    return (
        <>
            <DropdownMenu
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
            >
                <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer text-xl select-none">
                        ...
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-30">
                    <DropdownMenuItem
                        onClick={() => {
                            setDropdownOpen(false);
                            router.push(`/student/phone/friends/?roomId=${myChatRoomId}`);
                        }}
                    >
                        나와의 채팅
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            setDropdownOpen(false);
                            setBlockModal(true);
                        }}
                    >
                        차단 목록
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 🔥 핵심: dropdown 밖으로 빼기 */}
            <BlockUserListModal
                open={blockModal}
                setOpen={setBlockModal}
            />
        </>
    );
}