"use client";

import Image from "next/image";
import Link from "next/link";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import message from "@/app/assets/img/phone-message.png";
import calendar from "@/app/assets/img/phone-calendar.png";
import tutorial from "@/app/assets/img/phone-tutorial.png";
import community from "@/app/assets/img/phone-community.png";
import { NoticeAppCountsData } from "@/features/user/components/notification/type";

interface PhoneAppGridProps {
    notification: NoticeAppCountsData;
}

const formatCount = (count: number) => (count > 99 ? "99+" : count);

const Badge = ({ count }: { count: number }) => {
    if (count <= 0) {
        return null;
    }

    return (
        <div className="relative z-5 ml-auto h-4 w-4 items-center rounded-full bg-red-500 text-center text-xs text-white">
            {formatCount(count)}
        </div>
    );
};

export default function PhoneAppGrid({ notification }: PhoneAppGridProps) {
    return (
        <div className="grid grid-cols-2 gap-8">
            <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Link
                        href="/student/phone/friends"
                        aria-label="메신저"
                        className="relative h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Image src={message} alt="메신저" fill sizes="56px" />
                        <Badge count={notification.totalMsgFriendCount} />
                    </Link>
                </HoverCardTrigger>

                <HoverCardContent side="left" className="w-auto px-3 py-2">
                    메신저
                </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Link
                        href="/student/phone/calendar"
                        aria-label="캘린더"
                        className="relative h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Image src={calendar} alt="캘린더" fill sizes="56px" />
                        <Badge count={notification.calendarCount} />
                    </Link>
                </HoverCardTrigger>

                <HoverCardContent side="right" className="w-auto px-3 py-2">
                    캘린더
                </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Link
                        href="/student/tutorial"
                        aria-label="튜토리얼"
                        className="relative h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Image src={tutorial} alt="튜토리얼" fill sizes="56px" />
                    </Link>
                </HoverCardTrigger>

                <HoverCardContent side="left" className="w-auto px-3 py-2">
                    튜토리얼
                </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Link
                        href="/student/phone/community"
                        aria-label="커뮤니티"
                        className="relative h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Image src={community} alt="커뮤니티" fill sizes="56px" />
                        <Badge count={notification.communityCount} />
                    </Link>
                </HoverCardTrigger>

                <HoverCardContent side="right" className="w-auto px-3 py-2">
                    커뮤니티
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
