"use client";

import { useEffect, useState } from "react";
import type { StudyMemberTimerMeta } from "@/features/study/type";

// startedAt이 있으면(STUDYING) 현재 시각과의 차이 + accumulatedSeconds로 계산하고,
// 없으면(RESTING/NONE) accumulatedSeconds 그대로 고정해서 보여준다.
const computeSeconds = ({ startedAt, accumulatedSeconds }: StudyMemberTimerMeta) => {
    if (!startedAt) {
        return accumulatedSeconds;
    }

    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);

    return accumulatedSeconds + Math.max(elapsed, 0);
};

export const useStudyCountUp = (meta: StudyMemberTimerMeta): number => {
    const { timerStatus, startedAt, accumulatedSeconds } = meta;
    const isStudying = timerStatus === "STUDYING" && Boolean(startedAt);

    // 실제 표시값은 상태로 들고 있지 않고 매 렌더마다 새로 계산한다.
    // 이 state는 초당 리렌더를 강제하기 위한 신호일 뿐이라 값 자체는 쓰지 않는다.
    const [, forceTick] = useState(0);

    useEffect(() => {
        if (!isStudying) {
            return;
        }

        const intervalId = window.setInterval(() => {
            forceTick((prev) => prev + 1);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isStudying]);

    return computeSeconds({ timerStatus, startedAt, accumulatedSeconds });
};
