"use client";

import { useCallback, useRef, useState } from "react";

interface ModelProgressEvent {
    status: string;
    file?: string;
    progress?: number;
}

// 모델이 여러 파일(config/tokenizer/모델 가중치 등)로 나뉘어 동시에 다운로드되면
// 파일별 progress_callback이 뒤섞여 호출되어, 실제 진행률을 그대로 노출하면 수치가 요동친다.
// 그래서 실제 진행률과 무관하게 0.8초마다 2~8%씩 랜덤으로 올라가는 "가짜" 진행률을 보여주다가
// 90%에서 멈춰 대기하고, 실제 다운로드(pipeline 완료)가 끝나는 순간 100%로 점프시킨다.
// 90%에 오래 머무르면 isFinalizing으로 화면에서 숫자 대신 안내 문구를 보여줄 수 있게 한다.
const PROGRESS_CAP = 90;
const TICK_INTERVAL_MS = 800;
const TICK_MIN_STEP = 2;
const TICK_MAX_STEP = 8;
const FINALIZING_DELAY_MS = 2000;
// 모델 다운로드가 이 시간 넘게 안 끝나면 "지연되고 있다" 안내로 전환한다.
// transformers.js는 다운로드 중단 기능이 없어서, 안내 후에도 실제 다운로드는
// 백그라운드에서 계속 진행되고 완료된 파일은 브라우저 캐시에 남는다 — 그래서
// 사용자가 나중에 다시 시도하면 이미 받아둔 만큼 건너뛰어 체감 속도가 빨라진다.
const TIMEOUT_MS = 90_000;

export function useModelDownloadProgress() {
    const [progress, setProgress] = useState(0);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [hasTimedOut, setHasTimedOut] = useState(false);
    const progressRef = useRef(0);
    const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const finalizingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTickTimer = useCallback(() => {
        if (tickTimerRef.current) {
            clearInterval(tickTimerRef.current);
            tickTimerRef.current = null;
        }
    }, []);

    const clearFinalizingTimer = useCallback(() => {
        if (finalizingTimerRef.current) {
            clearTimeout(finalizingTimerRef.current);
            finalizingTimerRef.current = null;
        }
    }, []);

    const clearTimeoutTimer = useCallback(() => {
        if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
            timeoutTimerRef.current = null;
        }
    }, []);

    const dismissTimeout = useCallback(() => {
        setHasTimedOut(false);
    }, []);

    const reset = useCallback(() => {
        progressRef.current = 0;
        setProgress(0);
        setIsFinalizing(false);
        setHasTimedOut(false);
        clearTickTimer();
        clearFinalizingTimer();
        clearTimeoutTimer();

        tickTimerRef.current = setInterval(() => {
            const step = TICK_MIN_STEP + Math.floor(Math.random() * (TICK_MAX_STEP - TICK_MIN_STEP + 1));
            const next = Math.min(PROGRESS_CAP, progressRef.current + step);

            progressRef.current = next;
            setProgress(next);

            if (next >= PROGRESS_CAP) {
                clearTickTimer();

                if (!finalizingTimerRef.current) {
                    finalizingTimerRef.current = setTimeout(() => {
                        setIsFinalizing(true);
                    }, FINALIZING_DELAY_MS);
                }
            }
        }, TICK_INTERVAL_MS);

        timeoutTimerRef.current = setTimeout(() => {
            setHasTimedOut(true);
        }, TIMEOUT_MS);
    }, [clearTickTimer, clearFinalizingTimer, clearTimeoutTimer]);

    // 실제 파일별 진행률은 화면 표시에 더 이상 쓰지 않지만(가짜 진행률로 대체),
    // pipeline() 호출부에 progress_callback 옵션으로 그대로 전달되니 시그니처는 유지한다.
    const handleProgressEvent = useCallback((_data: ModelProgressEvent) => {
        void _data;
    }, []);

    const complete = useCallback(() => {
        clearTickTimer();
        clearFinalizingTimer();
        clearTimeoutTimer();
        progressRef.current = 100;
        setProgress(100);
        setIsFinalizing(false);
    }, [clearTickTimer, clearFinalizingTimer, clearTimeoutTimer]);

    return { progress, isFinalizing, hasTimedOut, dismissTimeout, handleProgressEvent, reset, complete };
}
