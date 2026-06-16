'use client'

import { Button } from "@/components/ui/button";
import { authRefreshAction } from "../action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";



export default function AuthRefreshArea({
    initialTime,
}: { initialTime: number }) {

    const [timer, setTimer] = useState(initialTime);

    const handleRefreshClick = async () => {
        const refreshData = await authRefreshAction();

        if (!refreshData.data) {
            toast.error(refreshData.message, {
                duration: 1000
            });
        }
        if (refreshData.data) {
            setTimer(refreshData.data.expiresIn);
            toast.success("로그아웃 시간이 연장되었습니다.", {
                duration: 1000
            });
        }
    }

    useEffect(() => {

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const timerCount =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex gap-1 items-center mt-1 cursor-pointer">
                        <Clock className="text-slate-500 w-3 h-3" />
                        <span className="text-slate-500 text-xs mr-2">{timerCount}</span>
                        <Button
                            onClick={handleRefreshClick}
                            variant="outline"
                            className="rounded-none text-slate-500 text-[10px] h-5 mr-4 cursor-pointer">연장</Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-center font-mediaum text-slate-50 text-[10px]">로그아웃까지 남은 시간</div>
                </TooltipContent>
            </Tooltip >
        </>
    );
}
