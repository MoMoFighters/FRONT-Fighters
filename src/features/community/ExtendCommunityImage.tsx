"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ExtendCommunityImageProps {
    imageUrl: string;
}

export default function ExtendCommunityImage({
    imageUrl,
}: ExtendCommunityImageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeModal, isModalOpen]);

    return (
        <>
            <Image
                onClick={() => setIsModalOpen(true)}
                src={imageUrl}
                alt="게시글 이미지"
                width={720}
                height={448}
                className="h-auto w-[40%] cursor-zoom-in rounded-2xl object-cover shadow-sm ring-1 ring-slate-100"
                unoptimized
            />

            {isModalOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <Image
                            src={imageUrl}
                            alt="게시글 이미지 확대"
                            width={1440}
                            height={960}
                            className="max-h-[calc(100vh-48px)] max-w-[calc(100vw-48px)] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
                            onClick={(event) => event.stopPropagation()}
                            unoptimized
                        />
                    </div>,
                    document.body
                )}
        </>
    );
}
