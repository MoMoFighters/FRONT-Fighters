"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import {
    createCommunityPostAction,
    createCommunityPostContentsAction,
    uploadCommunityPostImageAction,
} from "@/features/community/action";
import {
    CommunityCategory,
    CreateCommunityPostContentItem,
} from "@/features/community/type";

type CommunityPostFormMode = "CREATE" | "EDIT";

interface CommunityPostFormProps {
    mode: CommunityPostFormMode;
    data?: {
        postId?: number | string;
    };
    role?: "TEACHER" | "ADMIN"
}

interface PostContentBlock {
    id: string;
    file: File;
    previewUrl: string;
    content: string;
}

const CATEGORY_OPTIONS: { value: CommunityCategory; label: string; }[] = [
    { value: "STUDY", label: "학습", },
    { value: "ART", label: "예술", },
    { value: "BEAUTY", label: "뷰티", },
    { value: "FITNESS", label: "피트니스", },
    { value: "COOK", label: "요리", },
    { value: "FREE", label: "자유", },
];

const MAX_IMAGE_COUNT = 5;

const isSuccessResponse = (status: number) =>
    status >= 200 && status < 300;

const createPostContentBlock = (file: File): PostContentBlock => ({
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    content: "",
});

const mergeContent = (prevContent: string, nextContent: string) => {
    return [prevContent, nextContent]
        .map((content) => content.trim())
        .filter(Boolean)
        .join("\n");
};

const getCommunityListHref = (role?: CommunityPostFormProps["role"]) => {
    if (role === "TEACHER") return "/teacher/community";
    if (role === "ADMIN") return "/admin/community";
    return "/student/phone/community";
};

export default function CommunityPostForm({ mode, data, role }: CommunityPostFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<CommunityCategory>("FREE");
    const [mainContent, setMainContent] = useState("");
    const [postContents, setPostContents] = useState<PostContentBlock[]>([]);
    const [thumbnailId, setThumbnailId] = useState<string | null>(null);
    const [createdPostId, setCreatedPostId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mainContentRef = useRef(mainContent);
    const postContentsRef = useRef(postContents);

    const canAddImage = postContents.length < MAX_IMAGE_COUNT;
    const hasImage = postContents.length > 0;
    const isSubmitDisabled =
        isSubmitting ||
        title.trim().length === 0 ||
        (hasImage && thumbnailId === null);
    const backHref = (() => {
        const getBaseUrl = () => {
            // role이 'TEACHER'나 'ADMIN'이 아니면(undefined 포함) 학생 경로 반환
            if (role === "TEACHER") return "/teacher/community";
            if (role === "ADMIN") return "/admin/community";
            return "/student/phone/community";
        };

        const baseUrl = getBaseUrl();

        if (mode === "EDIT" && data?.postId) {
            return `${baseUrl}/${data.postId}`;
        }

        return baseUrl;
    })();

    useEffect(() => {
        mainContentRef.current = mainContent;
    }, [mainContent]);

    useEffect(() => {
        postContentsRef.current = postContents;
    }, [postContents]);

    useEffect(() => {
        return () => {
            postContentsRef.current.forEach((postContent) => {
                URL.revokeObjectURL(postContent.previewUrl);
            });
        };
    }, []);

    const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file || !canAddImage) {
            return;
        }

        setPostContents((prev) => [
            ...prev,
            createPostContentBlock(file),
        ]);
    };

    const handleChangeImage = (
        id: string,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) {
            return;
        }

        setPostContents((prev) =>
            prev.map((postContent) => {
                if (postContent.id !== id) {
                    return postContent;
                }

                URL.revokeObjectURL(postContent.previewUrl);

                return {
                    ...postContent,
                    file,
                    previewUrl: URL.createObjectURL(file),
                };
            })
        );
    };

    const handleChangePostContent = (id: string, content: string) => {
        setPostContents((prev) =>
            prev.map((postContent) =>
                postContent.id === id
                    ? {
                        ...postContent,
                        content,
                    }
                    : postContent
            )
        );
    };

    const handleRemoveImage = (id: string) => {
        const currentMainContent = mainContentRef.current;
        const currentPostContents = postContentsRef.current;
        const removeIndex = currentPostContents.findIndex((postContent) => postContent.id === id);
        const removeTarget = currentPostContents[removeIndex];

        if (!removeTarget) {
            return;
        }

        URL.revokeObjectURL(removeTarget.previewUrl);

        if (thumbnailId === id) {
            setThumbnailId(null);
        }

        if (removeIndex === 0) {
            const nextMainContent = mergeContent(currentMainContent, removeTarget.content);
            const nextPostContents = currentPostContents.filter((postContent) => postContent.id !== id);

            mainContentRef.current = nextMainContent;
            postContentsRef.current = nextPostContents;
            setMainContent(nextMainContent);
            setPostContents(nextPostContents);
            return;
        }

        const nextPostContents = currentPostContents
            .filter((postContent) => postContent.id !== id)
            .map((postContent, index) => {
                if (index !== removeIndex - 1) {
                    return postContent;
                }

                return {
                    ...postContent,
                    content: mergeContent(postContent.content, removeTarget.content),
                };
            });

        postContentsRef.current = nextPostContents;
        setPostContents(nextPostContents);
    };

    const uploadImages = async () => {
        const imageUrlById = new Map<string, string>();

        for (const postContent of postContents) {
            const formData = new FormData();
            formData.append("image", postContent.file);

            const response =
                await uploadCommunityPostImageAction(formData);

            if (!isSuccessResponse(response.status) || !response.data) {
                throw new Error(response.message || "이미지 업로드에 실패했습니다.");
            }

            imageUrlById.set(postContent.id, response.data);
        }

        return imageUrlById;
    };

    const createContentsPayload = (
        imageUrlById: Map<string, string>
    ) => {
        const contents: CreateCommunityPostContentItem[] = [];

        if (mainContent.trim()) {
            contents.push({
                type: "TEXT",
                content: mainContent.trim(),
                imageUrl: null,
            });
        }

        postContents.forEach((postContent) => {
            const imageUrl = imageUrlById.get(postContent.id);

            if (!imageUrl) {
                throw new Error("업로드된 이미지 URL을 찾을 수 없습니다.");
            }

            contents.push({
                type: "IMAGE",
                content: null,
                imageUrl,
            });

            if (postContent.content.trim()) {
                contents.push({
                    type: "TEXT",
                    content: postContent.content.trim(),
                    imageUrl: null,
                });
            }
        });

        const thumbnailImageUrl =
            thumbnailId
                ? imageUrlById.get(thumbnailId) ?? null
                : null;

        return {
            thumbnailImageUrl,
            contents,
        };
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (mode !== "CREATE") {
            toast.error("게시글 수정 기능은 아직 연결되지 않았습니다.");
            return;
        }

        const hasMainContent = mainContent.trim().length > 0;

        if (hasImage && !thumbnailId) {
            toast.error("이미지가 있는 게시글은 썸네일을 하나 지정해야 합니다.");
            return;
        }

        if (!hasImage && !hasMainContent) {
            toast.error("이미지가 없는 게시글은 본문을 입력해야 합니다.");
            return;
        }

        try {
            setIsSubmitting(true);

            const postResponse =
                await createCommunityPostAction({
                    title: title.trim(),
                    category,
                });

            const postId =
                postResponse.data?.postId;

            if (!isSuccessResponse(postResponse.status) || !postId) {
                throw new Error(postResponse.message || "게시글 등록에 실패했습니다.");
            }

            setCreatedPostId(postId);

            const imageUrlById =
                await uploadImages();

            const contentsPayload =
                createContentsPayload(imageUrlById);

            const contentsResponse =
                await createCommunityPostContentsAction(
                    postId,
                    contentsPayload
                );

            if (!isSuccessResponse(contentsResponse.status)) {
                throw new Error(contentsResponse.message || "게시글 본문 등록에 실패했습니다.");
            }

            toast.success("게시글이 등록되었습니다.");
            router.push(getCommunityListHref(role));
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message.split("|").at(-1) ?? error.message
                    : "게시글 등록에 실패했습니다.";

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex h-full min-h-0 flex-col rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur ${role === 'TEACHER' || role === 'ADMIN' ? "min-h-[calc(100vh-170px)]" : ""}`}
        >
            <input
                type="hidden"
                name="mode"
                value={mode}
            />
            <input
                type="hidden"
                name="createdPostId"
                value={createdPostId ?? ""}
            />

            <Link
                href={backHref}
                className="-ml-1 mb-2 inline-flex h-7 w-7 shrink-0 items-center justify-center text-slate-400 transition hover:text-indigo-500"
                aria-label="뒤로가기"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_180px] gap-3">
                <input
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="제목"
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />

                <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as CommunityCategory)}
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

            <section className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="sticky top-0 z-10 flex h-11 shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur">
                    <div className="leading-none">
                        <p className="text-xs font-black text-slate-900">
                            본문 영역
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                            사진은 최대 {MAX_IMAGE_COUNT}개까지 추가할 수 있습니다.
                        </p>
                    </div>

                    {canAddImage && (
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-indigo-500 px-3 py-1 text-xs font-black text-white transition hover:bg-indigo-600">
                            <ImagePlus className="h-3.5 w-3.5" />
                            사진 추가
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAddImage}
                            />
                        </label>
                    )}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <AutoResizeTextarea
                        value={mainContent}
                        onChange={setMainContent}
                        className="w-full bg-transparent px-2 py-2 text-sm font-medium leading-7 text-slate-700 outline-none transition placeholder:text-slate-400"
                        placeholder="내용 입력..."
                    />

                    {postContents.map((postContent, index) => (
                        <PostContentFieldset
                            key={postContent.id}
                            postContent={postContent}
                            orderNo={index + 1}
                            isThumbnail={thumbnailId === postContent.id}
                            onSelectThumbnail={setThumbnailId}
                            onChangeImage={handleChangeImage}
                            onChangeContent={handleChangePostContent}
                            onRemove={handleRemoveImage}
                        />
                    ))}
                </div>
            </section>

            <button
                type="submit"
                disabled={isSubmitDisabled}
                className="mt-5 h-11 shrink-0 rounded-2xl bg-indigo-400 text-sm font-black text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {isSubmitting
                    ? "등록 중..."
                    : mode === "CREATE"
                        ? "게시글 등록"
                        : "게시글 수정"}
            </button>
        </form>
    );
}

function PostContentFieldset({
    postContent,
    orderNo,
    isThumbnail,
    onSelectThumbnail,
    onChangeImage,
    onChangeContent,
    onRemove,
}: {
    postContent: PostContentBlock;
    orderNo: number;
    isThumbnail: boolean;
    onSelectThumbnail: (id: string) => void;
    onChangeImage: (id: string, e: ChangeEvent<HTMLInputElement>) => void;
    onChangeContent: (id: string, content: string) => void;
    onRemove: (id: string) => void;
}) {
    return (
        <fieldset className="py-4">
            <input
                type="hidden"
                name={`postContentOrderNo_${orderNo}`}
                value={orderNo}
            />
            <input
                type="hidden"
                name={`postContentIsThumbnail_${orderNo}`}
                value={String(isThumbnail)}
            />

            <div className="mx-[30%] w-[40%]">
                <div className="relative overflow-hidden rounded-2xl bg-slate-50 shadow-sm ring-1 ring-slate-100">
                    <img
                        src={postContent.previewUrl}
                        alt={`게시글 첨부 이미지 ${orderNo}`}
                        className="aspect-[4/3] w-full object-cover"
                    />

                    <label className="absolute left-2 top-2 cursor-pointer rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm transition hover:bg-indigo-500 hover:text-white">
                        사진 변경
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onChangeImage(postContent.id, e)}
                        />
                    </label>

                    <button
                        type="button"
                        onClick={() => onRemove(postContent.id)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-rose-500 hover:text-white"
                        aria-label="이미지 삭제"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onSelectThumbnail(postContent.id)}
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-xs font-black shadow-sm transition ${isThumbnail
                            ? "bg-indigo-500 text-white"
                            : "bg-white/90 text-slate-500 hover:bg-indigo-500 hover:text-white"
                            }`}
                    >
                        {isThumbnail ? "썸네일 지정됨" : "썸네일로 지정"}
                    </button>
                </div>
            </div>

            <AutoResizeTextarea
                value={postContent.content}
                onChange={(content) => onChangeContent(postContent.id, content)}
                className="mt-3 w-full bg-transparent px-2 py-2 text-sm font-medium leading-7 text-slate-700 outline-none transition placeholder:text-slate-400"
                placeholder="이미지 아래에 이어질 내용을 입력하세요..."
            />
        </fieldset>
    );
}

function AutoResizeTextarea({
    value,
    onChange,
    className,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    className: string;
    placeholder: string;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const rows = value.split("\n").length + 1;

    useEffect(() => {
        if (!textareaRef.current) {
            return;
        }

        const lineHeight = 28;
        textareaRef.current.style.height = `${rows * lineHeight}px`;
    }, [rows]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            className={className}
            style={{
                resize: "none",
                overflow: "hidden",
            }}
            placeholder={placeholder}
        />
    );
}
