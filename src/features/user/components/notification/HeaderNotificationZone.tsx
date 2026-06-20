'use client'

import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationList from "./NotificationList";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function HeaderNotificationZone() {

    const [isOpen, setIsOpen] = useState(false);

    const [hoverOpen, setHoverOpen] = useState(false);

    const [notification, setNotification] = useState(4);

    const [loading, setLoading] = useState(false);
    const handleRead = async () => {
        setLoading(true);
        // 알림 읽음 처리 액션 함수 호출

        setLoading(false);
        setNotification(0); //나중엔 result값 따라서 변동시켜야함
    }

    return (
        <>
            <HoverCard
                open={!isOpen && hoverOpen}
                onOpenChange={setHoverOpen}
                openDelay={50}
                closeDelay={50}
            >
                <HoverCardTrigger asChild>
                    <button
                        type="button"
                        className="relative mr-5 mb-1 h-4 w-4 cursor-pointer text-slate-500 hover:text-slate-700"
                        onClick={() => {
                            setHoverOpen(false);
                            setIsOpen((prev) => !prev);
                            handleRead();
                        }}
                    >
                        <Bell />
                        {notification === 0 ? "" : (
                            <p className="absolute -top-2.5 left-3.5 h-4 w-4 rounded-full bg-red-500 flex justify-center items-center text-slate-200 text-xs">
                                4
                            </p>
                        )}
                    </button>
                </HoverCardTrigger>

                <HoverCardContent
                    side="bottom"
                    className="fixed top-4.5 -right-7 flex w-12 justify-center px-2 py-1"
                >
                    <div>
                        알림
                    </div>
                </HoverCardContent>
            </HoverCard>

            {isOpen && (
                <NotificationList
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
