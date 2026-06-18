"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type CommunityPostFormMode = "CREATE" | "EDIT";
type CommunityCategory =
    | "STUDY"
    | "FASHION"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

type EditorBlock =
    | {
        id: string;
        type: "TEXT";
        value: string;
    }
    | {
        id: string;
        type: "IMAGE";
        file: File | null;
        previewUrl: string;
    };

interface CommunityPostFormProps {
    mode: CommunityPostFormMode;
    data?: unknown;
}

const CATEGORY_OPTIONS: {
    value: CommunityCategory;
    label: string;
}[] = [
        {
            value: "STUDY",
            label: "학습",
        },
        {
            value: "FASHION",
            label: "패션",
        },
        {
            value: "BEAUTY",
            label: "뷰티",
        },
        {
            value: "FITNESS",
            label: "피트니스",
        },
        {
            value: "COOK",
            label: "요리",
        },
        {
            value: "FREE",
            label: "자유",
        },
    ];

const MAX_IMAGE_COUNT = 5;
const MAX_BLOCK_COUNT = 11;

const createTextBlock = (): EditorBlock => ({
    id: crypto.randomUUID(),
    type: "TEXT",
    value: "",
});

const createImageBlock = (file: File): EditorBlock => ({
    id: crypto.randomUUID(),
    type: "IMAGE",
    file,
    previewUrl: URL.createObjectURL(file),
});

const normalizeEditorBlocks = (blocks: EditorBlock[]) => {
    return blocks.reduce<EditorBlock[]>((acc, block) => {
        const prevBlock = acc[acc.length - 1];

        if (prevBlock?.type === "TEXT" && block.type === "TEXT") {
            const mergedText = [prevBlock.value, block.value]
                .filter(Boolean)
                .join("\n");

            return [
                ...acc.slice(0, -1),
                {
                    ...prevBlock,
                    value: mergedText,
                },
            ];
        }

        return [...acc, block];
    }, []);
};

export default function CommunityPostForm({
    mode,
    data,
}: CommunityPostFormProps) {
    const [blocks, setBlocks] = useState<EditorBlock[]>([createTextBlock()]);
    const blocksRef = useRef(blocks);
    const imageCount = blocks.filter((block) => block.type === "IMAGE").length;

    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks]);

    useEffect(() => {
        return () => {
            blocksRef.current.forEach((block) => {
                if (block.type === "IMAGE" && block.previewUrl) {
                    URL.revokeObjectURL(block.previewUrl);
                }
            });
        };
    }, []);

    const handleResizeHeight = (element: HTMLTextAreaElement) => {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    };

    const canInsertTextBlock = (insertIndex: number) => {
        const prevBlock = blocks[insertIndex - 1];
        const nextBlock = blocks[insertIndex];

        return (
            blocks.length < MAX_BLOCK_COUNT
            && prevBlock?.type !== "TEXT"
            && nextBlock?.type !== "TEXT"
        );
    };

    const canInsertImageBlock = () => {
        return blocks.length < MAX_BLOCK_COUNT && imageCount < MAX_IMAGE_COUNT;
    };

    const addTextBlock = (insertIndex: number) => {
        if (!canInsertTextBlock(insertIndex)) {
            return;
        }

        setBlocks((prevBlocks) => {
            const nextBlocks = [...prevBlocks];
            nextBlocks.splice(
                insertIndex,
                0,
                createTextBlock()
            );

            return normalizeEditorBlocks(nextBlocks).slice(0, MAX_BLOCK_COUNT);
        });
    };

    const addImageBlock = (
        insertIndex: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file || imageCount >= MAX_IMAGE_COUNT || blocks.length >= MAX_BLOCK_COUNT) {
            return;
        }

        setBlocks((prevBlocks) => {
            const nextBlocks = [...prevBlocks];
            nextBlocks.splice(insertIndex, 0, createImageBlock(file));

            return normalizeEditorBlocks(nextBlocks).slice(0, MAX_BLOCK_COUNT);
        });
    };

    const updateTextBlock = (
        blockId: string,
        value: string
    ) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === blockId && block.type === "TEXT"
                    ? {
                        ...block,
                        value,
                    }
                    : block
            )
        );
    };

    const updateImageBlock = (
        blockId: string,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setBlocks((prevBlocks) =>
            prevBlocks.map((block) => {
                if (block.id !== blockId || block.type !== "IMAGE") {
                    return block;
                }

                if (block.previewUrl) {
                    URL.revokeObjectURL(block.previewUrl);
                }

                return {
                    ...block,
                    file,
                    previewUrl: URL.createObjectURL(file),
                };
            })
        );
    };

    const removeImageBlock = (blockId: string) => {
        setBlocks((prevBlocks) => {
            const removeIndex = prevBlocks.findIndex((block) => block.id === blockId);
            const removeTarget = prevBlocks[removeIndex];

            if (!removeTarget || removeTarget.type !== "IMAGE") {
                return prevBlocks;
            }

            if (removeTarget.previewUrl) {
                URL.revokeObjectURL(removeTarget.previewUrl);
            }

            const prevBlock = prevBlocks[removeIndex - 1];
            const nextBlock = prevBlocks[removeIndex + 1];

            if (prevBlock?.type === "TEXT" && nextBlock?.type === "TEXT") {
                const mergedText = [prevBlock.value, nextBlock.value]
                    .filter(Boolean)
                    .join("\n");

                return normalizeEditorBlocks([
                    ...prevBlocks.slice(0, removeIndex - 1),
                    {
                        ...prevBlock,
                        value: mergedText,
                    },
                    ...prevBlocks.slice(removeIndex + 2),
                ]);
            }

            return normalizeEditorBlocks(
                prevBlocks.filter((block) => block.id !== blockId)
            );
        });
    };

    return (
        <form
            action=""
            className="flex h-full min-h-0 flex-col rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur"
        >
            <input
                type="hidden"
                name="mode"
                value={mode}
            />

            <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_180px] gap-3 ">
                <input
                    name="title"
                    placeholder="제목"
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />

                <Select
                    name="category"
                    defaultValue="FREE"
                >
                    <SelectTrigger className="h-11! w-full rounded-2xl border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">
                        <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORY_OPTIONS.map((category) => (
                            <SelectItem
                                className="h-11!"
                                key={category.value}
                                value={category.value}
                            >
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-2xl border border-slate-200 mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {blocks.map((block, index) => (
                    <div key={block.id}>
                        <InsertBlockButtons
                            canAddText={canInsertTextBlock(index)}
                            canAddImage={canInsertImageBlock()}
                            onAddText={() => addTextBlock(index)}
                            onAddImage={(e) => addImageBlock(index, e)}
                        />

                        {block.type === "TEXT" ? (
                            <textarea
                                name="contents"
                                value={block.value}
                                onChange={(e) => {
                                    updateTextBlock(block.id, e.target.value);
                                    handleResizeHeight(e.target);
                                }}
                                onInput={(e) => handleResizeHeight(e.currentTarget)}
                                className="min-h-36 w-full bg-transparent px-3 py-2 text-sm font-medium leading-7 text-slate-700 outline-none transition placeholder:text-slate-400"
                                style={{
                                    resize: "none",
                                    overflow: "hidden",
                                }}
                                placeholder="내용 입력..."
                            />
                        ) : (
                            <div className="py-3">
                                <div className="mx-[30%] w-[40%]">
                                    <div className="relative overflow-hidden rounded-2xl bg-slate-50 shadow-sm ring-1 ring-slate-100">
                                        <img
                                            src={block.previewUrl}
                                            alt="게시글 첨부 이미지 미리보기"
                                            className="aspect-[4/3] w-full object-cover"
                                        />

                                        <label className="absolute left-2 top-2 cursor-pointer rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm transition hover:bg-indigo-500 hover:text-white">
                                            사진 변경
                                            <input
                                                type="file"
                                                name="images"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => updateImageBlock(block.id, e)}
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => removeImageBlock(block.id)}
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-rose-500 hover:text-white"
                                            aria-label="이미지 삭제"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <InsertBlockButtons
                    canAddText={canInsertTextBlock(blocks.length)}
                    canAddImage={canInsertImageBlock()}
                    onAddText={() => addTextBlock(blocks.length)}
                    onAddImage={(e) => addImageBlock(blocks.length, e)}
                />
            </div>

            <button
                type="submit"
                className="mt-5 h-11 shrink-0 rounded-2xl bg-indigo-400 text-sm font-black text-white transition hover:bg-indigo-500"
            >
                게시글 등록
            </button>
        </form>
    );
}

function InsertBlockButtons({
    canAddText,
    canAddImage,
    onAddText,
    onAddImage,
}: {
    canAddText: boolean;
    canAddImage: boolean;
    onAddText: () => void;
    onAddImage: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    if (!canAddText && !canAddImage) {
        return null;
    }

    return (
        <div className="flex justify-center gap-2 py-3">
            {canAddText && (
                <button
                    type="button"
                    onClick={onAddText}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500"
                >
                    <Plus className="h-3.5 w-3.5" />
                    글 추가
                </button>
            )}

            {canAddImage && (
                <label
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500"
                >
                    <ImagePlus className="h-3.5 w-3.5" />
                    사진 추가
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        className="hidden"
                        onChange={onAddImage}
                    />
                </label>
            )}
        </div>
    );
}
