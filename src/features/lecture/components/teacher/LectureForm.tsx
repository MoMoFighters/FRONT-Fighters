'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LectureFormChapterItem from "./LectureFormChapterItem";
import LectureEditChapterItem from "./LectureEditChapterItem";
import { UploadCloud } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useLectureCreateUpload } from "./LectureCreateUploadContext";
import { getLectureCreateAccessTokenAction } from "./action";
import { updateChapterAction, updateLectureAction } from "@/features/lecture/action";
import { Category } from "@/features/lecture/type";

type LectureEditChapter = {
    chapterId: number;
    orderNo: number;
    title: string;
    chapterThumbnailUrl?: string;
};

type EditChapterState = LectureEditChapter & {
    initialTitle: string;
};

type LectureFormProps = {
    mode: 'create' | 'edit';
    onUploadStart?: () => void;
    lectureId?: string;
    initialLecture?: {
        title: string;
        description: string;
        thumbnailUrl: string;
        category: Category;
        chapters: LectureEditChapter[];
    };
}

type Chapter = {
    id: number;
    index: number;
    title: string;
    video: string;
}

const MAX_CHAPTER_COUNT = 10;

type LectureCreateTokenPayload = {
    category?: string;
    Category?: string;
    userCategory?: string;
};

type LectureCategory = "STUDY" | "BEAUTY" | "FITNESS" | "COOK" | "ART";

const LECTURE_CATEGORY_OPTIONS: {
    value: LectureCategory;
    label: string;
}[] = [
        { value: "STUDY", label: "학습" },
        { value: "BEAUTY", label: "뷰티" },
        { value: "FITNESS", label: "피트니스" },
        { value: "COOK", label: "요리" },
        { value: "ART", label: "예술" },
    ];

const isLectureCategory = (value: string): value is LectureCategory =>
    LECTURE_CATEGORY_OPTIONS.some((category) => category.value === value);

const isSelectedFile = (value: FormDataEntryValue | null): value is File =>
    value instanceof File && value.size > 0;

export default function LectureForm({ mode, onUploadStart, lectureId, initialLecture }: LectureFormProps) {
    const router = useRouter();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [category, setCategory] = useState<LectureCategory | "">("");
    const [isCategoryLocked, setIsCategoryLocked] = useState(false);
    const { startUpload } = useLectureCreateUpload();

    const [title, setTitle] = useState(initialLecture?.title ?? "");
    const [description, setDescription] = useState(initialLecture?.description ?? "");
    const [editChapters, setEditChapters] = useState<EditChapterState[]>(
        () => (initialLecture?.chapters ?? []).map((chapter) => ({
            ...chapter,
            initialTitle: chapter.title,
        }))
    );

    const addChapterItem = () => {
        if (chapters.length >= MAX_CHAPTER_COUNT) {
            return;
        }

        setChapters(prev => [
            ...prev,
            {
                id: Date.now(),
                index: prev.length + 1,
                title: '',
                video: ''
            }
        ]);
    };

    const removeChapterItem = (index: number) => {
        const filtered = chapters.filter(chapter => chapter.index !== index);
        const reordered = filtered.map((chapter, idx) => ({
            ...chapter,
            index: idx + 1
        }));
        setChapters(reordered);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const preventUpload = mode === "create" && chapters.length === 0;

    useEffect(() => {
        if (mode !== "create") {
            return;
        }

        const applyTokenCategory = async () => {
            try {
                const accessToken = await getLectureCreateAccessTokenAction();
                const decoded = jwtDecode<LectureCreateTokenPayload>(accessToken);
                const tokenCategory =
                    decoded.category ?? decoded.Category ?? decoded.userCategory;

                if (tokenCategory && isLectureCategory(tokenCategory)) {
                    setCategory(tokenCategory);
                    setIsCategoryLocked(true);
                }
            } catch {
                setCategory("");
                setIsCategoryLocked(false);
            }
        };

        void applyTokenCategory();
    }, [mode]);

    const isTitleChanged = mode === 'edit' && title.trim() !== (initialLecture?.title ?? "");
    const isDescriptionChanged = mode === 'edit' && description.trim() !== (initialLecture?.description ?? "");
    const isLectureInfoChanged = isTitleChanged || isDescriptionChanged;

    const changedChapters = mode === 'edit'
        ? editChapters.filter((chapter) => {
            const trimmed = chapter.title.trim();
            return trimmed.length > 0 && trimmed !== chapter.initialTitle;
        })
        : [];

    const hasEditChanges = isLectureInfoChanged || changedChapters.length > 0;

    const handleUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isPending || !lectureId || !initialLecture || !hasEditChanges) {
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (isLectureInfoChanged && (!trimmedTitle || !trimmedDescription)) {
            setStatusMessage("제목과 설명을 모두 입력해주세요.");
            setStatusCode(null);
            return;
        }

        setIsPending(true);
        setStatusMessage("");

        try {
            let hasError = false;

            if (isLectureInfoChanged) {
                const result = await updateLectureAction(lectureId, {
                    title: trimmedTitle,
                    description: trimmedDescription,
                    category: initialLecture.category,
                });

                if (!result.success) {
                    hasError = true;
                    toast.error(result.message || "강의 수정에 실패했습니다.");
                }
            }

            for (const chapter of changedChapters) {
                const result = await updateChapterAction(lectureId, String(chapter.chapterId), {
                    title: chapter.title.trim(),
                    orderNo: chapter.orderNo,
                });

                if (!result.success) {
                    hasError = true;
                    toast.error(result.message || `챕터 ${chapter.orderNo} 수정에 실패했습니다.`);
                }
            }

            if (hasError) {
                return;
            }

            toast.success("강의를 수정했습니다.");
            router.push(`/teacher/lectures/${lectureId}`);
            router.refresh();
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (preventUpload || isPending || mode !== "create") {
            return;
        }

        const formData = new FormData(event.currentTarget);

        if (category) {
            formData.set("category", category);
        }

        if (!isSelectedFile(formData.get("thumbnail"))) {
            setStatusMessage("강의 썸네일을 등록해주세요.");
            setStatusCode(null);
            return;
        }

        for (const chapter of chapters) {
            if (!isSelectedFile(formData.get(`chapterThumbnail_${chapter.index}`))) {
                setStatusMessage(`${chapter.index}번 챕터 썸네일을 등록해주세요.`);
                setStatusCode(null);
                return;
            }

            if (!isSelectedFile(formData.get(`video_${chapter.index}`))) {
                setStatusMessage(`${chapter.index}번 챕터 동영상을 등록해주세요.`);
                setStatusCode(null);
                return;
            }
        }

        setIsPending(true);
        setStatusMessage("강의 등록을 시작했습니다.");
        setStatusCode(202);
        onUploadStart?.();

        try {
            await startUpload(formData);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-300">
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-indigo-500 px-8 py-7 text-white">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-100">
                            Teacher Studio
                        </p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            {mode === 'create' ? "강의 등록" : "강의 수정"}
                        </h1>
                        <p className="mt-2 text-sm font-bold text-indigo-100">
                            {mode === 'create'
                                ? "강의 기본 정보와 챕터 영상을 순서대로 등록하세요."
                                : "강의 정보와 챕터 제목을 수정하세요."}
                        </p>
                    </div>
                </div>

                <form
                    className="flex flex-col gap-6 p-8"
                    onSubmit={mode === 'create' ? handleSubmit : handleUpdateSubmit}
                >

                    {mode === 'create' && (
                        /* 챕터 수 hidden input */
                        <input type="hidden" name="chapterCount" value={chapters.length} />
                    )}

                    {mode === 'edit' && initialLecture && (
                        /* 강의 카테고리는 수정 불가 -> hidden으로 기존 값 그대로 전달 */
                        <input type="hidden" name="category" value={initialLecture.category} />
                    )}

                    {/* 썸네일 */}
                    <div className="grid grid-cols-[120px_1fr] gap-4">
                        <label className="pt-2 text-sm font-black text-slate-700">
                            강의 썸네일{mode === 'create' ? ' *' : ''}
                        </label>
                        {mode === 'create' ? (
                            <label className="flex h-52 max-w-110 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/40 transition-colors hover:bg-indigo-50">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="썸네일 미리보기"
                                        width={440}
                                        height={208}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <>
                                        <UploadCloud className="mb-2 h-10 w-10 text-slate-400" aria-hidden="true" />
                                        <p className="text-sm font-black text-slate-500">이미지 업로드</p>
                                        <p className="mt-1 text-xs font-bold text-slate-400">최대 5MB</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    name="thumbnail"
                                    onChange={handleChange}
                                />
                            </label>
                        ) : (
                            <div className="flex h-52 max-w-110 flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                                {initialLecture?.thumbnailUrl ? (
                                    <Image
                                        src={initialLecture.thumbnailUrl}
                                        alt="등록된 썸네일"
                                        width={440}
                                        height={208}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-400">등록된 썸네일이 없습니다.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 카테고리 */}
                    {mode === 'create' && (
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label className="text-sm font-black text-slate-700">
                                카테고리 *
                            </label>
                            <select
                                name="category"
                                value={category}
                                onChange={(event) => {
                                    if (isCategoryLocked) {
                                        return;
                                    }

                                    const nextCategory = event.target.value;

                                    if (isLectureCategory(nextCategory)) {
                                        setCategory(nextCategory);
                                    }
                                }}
                                disabled={isCategoryLocked}
                                className="h-11 w-44 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500"
                                required
                            >
                                <option value="" disabled hidden>카테고리 선택</option>
                                {LECTURE_CATEGORY_OPTIONS.map((category) => (
                                    <option
                                        key={category.value}
                                        value={category.value}
                                    >
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* 강의 제목 */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-black text-slate-700">
                            제목 *
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="강의 제목을 입력하세요"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* 강의 설명 */}
                    <div className="grid grid-cols-[120px_1fr] gap-4">
                        <label className="pt-3 text-sm font-black text-slate-700">
                            강의 설명 *
                        </label>
                        <textarea
                            name="description"
                            placeholder="강의에 대한 설명을 입력하세요"
                            rows={7}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                            className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-7 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    <hr className="border-slate-100" />

                    {/* 챕터 목록 헤더 */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-lg font-black text-slate-950">챕터 목록</p>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                                {mode === 'create'
                                    ? `최대 ${MAX_CHAPTER_COUNT}개까지 등록할 수 있습니다. 현재 ${chapters.length}개`
                                    : `챕터 제목 수정 및 삭제가 가능합니다. 현재 ${editChapters.length}개`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {mode === 'create' && chapters.length >= MAX_CHAPTER_COUNT && (
                                <p className="text-xs font-black text-rose-500">
                                    최대 챕터 수에 도달했습니다.
                                </p>
                            )}
                            {mode === 'create' && (
                                <Button
                                    type='button'
                                    onClick={addChapterItem}
                                    disabled={chapters.length >= MAX_CHAPTER_COUNT}
                                    className="rounded-2xl bg-indigo-500 px-5 font-black text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                    챕터 추가
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 챕터 아이템 루프 렌더링 */}
                    {mode === 'create' ? (
                        <>
                            {chapters.map((chapter) => (
                                <LectureFormChapterItem
                                    key={chapter.id}
                                    chapter={chapter}
                                    mode={mode}
                                    onDelete={removeChapterItem}
                                />
                            ))}

                            {chapters.length === 0 && (
                                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-black text-rose-500">
                                    *챕터는 최소 1개 이상이어야 합니다.*
                                </p>
                            )}
                        </>
                    ) : (
                        lectureId && editChapters.map((chapter) => (
                            <LectureEditChapterItem
                                key={chapter.chapterId}
                                lectureId={lectureId}
                                chapterId={chapter.chapterId}
                                orderNo={chapter.orderNo}
                                title={chapter.title}
                                thumbnailUrl={chapter.chapterThumbnailUrl}
                                onTitleChange={(value) => {
                                    setEditChapters((prev) => prev.map((item) =>
                                        item.chapterId === chapter.chapterId
                                            ? { ...item, title: value }
                                            : item
                                    ));
                                }}
                                onDeleted={() => {
                                    setEditChapters((prev) => prev.filter((item) =>
                                        item.chapterId !== chapter.chapterId
                                    ));
                                }}
                            />
                        ))
                    )}

                    {/* 알림 메시지 분기 처리 */}
                    {statusMessage && (
                        <p className={`text-center text-sm font-bold ${statusCode === 202 ? 'text-green-600' : 'text-red-500'}`}>
                            {statusMessage}
                        </p>
                    )}

                    {/* 하단 제어 버튼 조절부 */}
                    <div className="flex flex-row gap-2">
                        <div className="flex-1" />
                        <Button type="button" asChild className="h-11 cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-700 hover:bg-slate-50">
                            <Link href={mode === 'create' ? "/teacher/lectures" : `/teacher/lectures/${lectureId}`}>취소</Link>
                        </Button>
                        <Button
                            type="submit"
                            className={`h-11 cursor-pointer rounded-2xl px-6 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${
                                mode === 'create'
                                    ? 'bg-slate-900 hover:bg-indigo-500'
                                    : 'bg-blue-400 hover:bg-blue-500'
                            }`}
                            disabled={mode === 'create' ? (preventUpload || isPending) : (isPending || !hasEditChanges)}
                        >
                            {isPending
                                ? (mode === 'create' ? "등록 중..." : "수정 중...")
                                : (mode === 'create' ? "강의 등록" : "수정하기")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
