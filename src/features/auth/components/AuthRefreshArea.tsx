'use client'

import { Button } from "@/components/ui/button";
import { authRefreshAction } from "../action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";



const REFRESH_ENABLED_THRESHOLD_SEC = 20 * 60;

export default function AuthRefreshArea({
    initialTime,
}: { initialTime: number }) {

    const [timer, setTimer] = useState(initialTime);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const canRefresh = timer <= REFRESH_ENABLED_THRESHOLD_SEC;

    const handleRefreshClick = async () => {
        if (isRefreshing) {
            return;
        }

        setIsRefreshing(true);

        try {
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
        } finally {
            setIsRefreshing(false);
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
                    <div className="flex gap-1 items-center mt-1 mr-1 cursor-pointer sm:mr-4">
                        <Clock className="text-slate-500 w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="text-slate-500 text-[10px] mr-1 sm:mr-2 sm:text-xs">{timerCount}</span>
                        <Button
                            onClick={handleRefreshClick}
                            disabled={isRefreshing || !canRefresh}
                            variant="outline"
                            className="rounded-none text-slate-500 text-[9px] h-4 px-2 cursor-pointer sm:text-[10px] sm:h-5 sm:px-3 disabled:cursor-not-allowed disabled:opacity-60">연장</Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-center font-mediaum text-slate-50 text-[10px]">
                        {canRefresh
                            ? "로그아웃까지 남은 시간"
                            : "20분 이내로 남았을 때 연장할 수 있어요"}
                    </div>
                </TooltipContent>
            </Tooltip >
        </>
    );
}
