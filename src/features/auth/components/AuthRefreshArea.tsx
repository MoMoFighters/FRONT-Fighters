'use client'

import { Button } from "@/components/ui/button";
import { authRefreshAction } from "../action";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function AuthRefreshArea({
    expiresAt,
}: { expiresAt: number }) {

    const [timer, setTimer] = useState(
        Math.max(
            0,
            expiresAt - Math.floor(Date.now() / 1000)
        )
    );

    const handleRefreshClick = async () => {
        const refreshData = await authRefreshAction();

        if (!refreshData.success) {
            toast.error(refreshData.message, {
                duration: 1000
            });
        }
        if (refreshData.data) {
            setTimer(refreshData.data.expiresIn);
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
    }, [timer]);

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const timerCount =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div>
            <span className="text-slate-500 text-xs mr-4">자동 로그아웃 시간 :</span>
            <span className="text-slate-500 text-xs mr-4">{timerCount}</span>
            <Button
                onClick={handleRefreshClick}
                variant="outline"
                className="rounded-none text-slate-500 text-xs h-6 mr-4">연장</Button>
        </div>
    );
}