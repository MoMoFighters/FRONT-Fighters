"use client";

import { useState } from "react";

import FortuneModal from "@/components/city/FortuneModal";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function FortuneSpot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <HoverCard openDelay={50} closeDelay={50}>
                <HoverCardTrigger asChild>
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="absolute top-[44%] right-[11.5%] z-10 h-40 w-40 cursor-pointer border-0 p-0 bg-transparent"
                        aria-label="운세 보기"
                    />
                </HoverCardTrigger>
                <HoverCardContent side="top" align="center" sideOffset={8}>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">
                            운세
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            5포인트를 사용하여 운세를 봅니다.
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>

            <FortuneModal open={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}
