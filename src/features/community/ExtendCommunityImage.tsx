"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ExtendCommunityImage({ imageUrl }: { imageUrl: string }) {
    const [isModal, setIsModal] = useState(false);

    useEffect(() => {
        if (!isModal) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsModal(false);
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModal]);

    const modal =
        isModal && typeof document !== "undefined"
            ? createPortal(
                <div
                    className="fixed inset-0 z-[999999] flex h-dvh w-dvw items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm"
                    onClick={() => setIsModal(false)}
                >
                    <img
                        src={imageUrl}
                        alt="확대 이미지"
                        className="max-h-[calc(100dvh-48px)] max-w-[calc(100dvw-48px)] rounded-2xl object-contain shadow-2xl ring-1 ring-white/20"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>,
                document.body
            )
            : null;

    return (
        <>
            <Image
                onClick={() => setIsModal(true)}
                src={imageUrl}
                alt="이미지"
                width={720}
                height={448}
                className="h-auto w-[40%] cursor-zoom-in rounded-2xl object-cover shadow-sm ring-1 ring-slate-100"
                unoptimized
            />
            {modal}
        </>
    );
}
