"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateFriendStatus } from "@/features/friend/action";

interface CommunityUserFriendButtonProps {
    userId: number;
}

export default function CommunityUserFriendButton({
    userId,
}: CommunityUserFriendButtonProps) {
    const router = useRouter();

    const handleAddFriend = async () => {
        const response = await updateFriendStatus("SEND", userId);

        if (response.status < 200 || response.status >= 300) {
            toast.error(response.message, { duration: 1500 });
            return;
        }

        toast.success(response.message, { duration: 1500 });
        router.refresh();
    };

    return (
        <button
            type="button"
            onClick={handleAddFriend}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-500 px-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md"
        >
            <UserPlus className="h-3.5 w-3.5" />
            친구추가
        </button>
    );
}
