"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BusFareErrorToastProps {
    message: string;
}

// 친구 도시 이동(버스비 1포인트 차감) 실패 시, 서버 컴포넌트에서 리다이렉트로 넘겨준
// 에러 메시지를 토스트로 띄우고 주소창의 쿼리 파라미터를 지운다.
export default function BusFareErrorToast({ message }: BusFareErrorToastProps) {
    const router = useRouter();

    useEffect(() => {
        toast.error(message);
        router.replace("/student");
    }, []);

    return null;
}
