'use client'

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { logoutAction, teacherSignupAction } from "@/features/auth/action";
import { clearLectureUploadTasksStorage } from "@/features/lecture/components/teacher/LectureCreateUploadContext";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";

interface TeacherRegistModalProps {
    isModal: boolean;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    nickName: string;
    isReApply?: boolean;
    closeResultModal?: (a: boolean) => void;
}

export default function TeacherRegistModal({ isModal, setIsModal, nickName, isReApply, closeResultModal }: TeacherRegistModalProps) {

    const [category, setCategory] = useState("");
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setPreviewFile(null);
            setPreviewUrl(null);
            return;
        }

        const isPdf = file.type === "application/pdf";
        const isMp4 = file.type === "video/mp4";

        if (!isPdf && !isMp4) {
            e.target.value = "";
            setPreviewFile(null);
            setPreviewUrl(null);
            alert("PDF ?먮뒗 MP4 ?뚯씪留??낅줈?쒗븷 ???덉뒿?덈떎.");
            return;
        }

        setPreviewFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const currentNickname = String(
            formData.get("currentNickname") ?? nickName
        ).trim();
        const nickname = String(formData.get("teacherName") ?? "").trim();

        if (!currentNickname || !nickname || !category || !previewFile) {
            toast.error("?꾩닔 媛믪쓣 紐⑤몢 ?낅젰?댁＜?몄슂.", { duration: 1000 });
            return;
        }

        const requestFormData = new FormData();
        requestFormData.append("currentNickname", currentNickname);
        requestFormData.append("nickname", nickname);
        requestFormData.append("category", category);
        requestFormData.append("proof", previewFile);

        setIsSubmitting(true);

        try {
            const response = await teacherSignupAction(requestFormData);

            if (response.status !== 200) {
                toast.error(response.message, { duration: 1000 });
                return;
            }

            toast.success(response.message, { duration: 1000 });
            setIsModal(false);
            await logoutAction();
            clearLectureUploadTasksStorage();
            if (closeResultModal ?
                closeResultModal(false) : ""
            )
                redirect("/auth/login");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isModal) return (
        <div
            className='pr-2 px-1 pb-4 text-sm font-bold transition border-transparent text-slate-500 hover:text-slate-900 cursor-pointer'
            onClick={() => {
                if (!isSubmitting) {
                    setIsModal(true);
                }
            }}
        >
            媛뺤궗 ?깅줉
        </div>)

    return (
        <>
            <div
                className='pr-2 px-1 pb-4 text-sm font-bold transition border-transparent text-slate-500 hover:text-slate-900 cursor-pointer'
                onClick={() => {
                    if (!isSubmitting) {
                        setIsModal(false);
                    }
                }}
            >
                媛뺤궗 ?깅줉
            </div>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => {
                    if (!isSubmitting) {
                        setIsModal(false);
                    }
                }}
            >
                <div
                    className="flex flex-col w-[60vw] h-[85vh] rounded-2xl border border-slate-200 bg-white px-6 pt-7 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row items-center">
                        <h2 className="text-2xl font-bold text-slate-900">
                            媛뺤궗 ?깅줉
                        </h2>
                        <div className="flex-1" />
                        {!isReApply &&
                            <button
                                type="button"
                                className="text-slate-500 hover:text-slate-900 cursor-pointer"
                                disabled={isSubmitting}
                                onClick={() => setIsModal(false)}>
                                <X />
                            </button>}

                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        媛뺤궗 ?쒕룞???ъ슜???대쫫怨?媛뺤쓽 遺꾩빞, ?몄쬆 ?먮즺瑜??깅줉??二쇱꽭??
                    </p>
                    <form
                        className="mt-7 flex min-h-0 flex-1 flex-col overflow-hidden"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="hidden"
                            name="currentNickname"
                            value={nickName}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col justify-between gap-1">
                                <label
                                    htmlFor="teacherName"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    媛뺤궗 ?쒕룞紐?
                                </label>
                                <input
                                    type="text"
                                    id="teacherName"
                                    name="teacherName"
                                    defaultValue={nickName}
                                    placeholder="강사 활동명을 입력해주세요"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-mauve-400 focus:bg-white focus:ring-4 focus:ring-mauve-100"
                                />
                            </div>

                            <div className="flex flex-col justify-between gap-1">
                                <label
                                    htmlFor="category"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    移댄뀒怨좊━
                                </label>

                                <Select
                                    value={category}
                                    onValueChange={setCategory}
                                    name="category"
                                >
                                    <SelectTrigger
                                        id="category"
                                        className="!h-10 min-h-10 w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-0 text-sm text-slate-700 shadow-none focus:border-mauve-400 focus:bg-white focus:ring-4 focus:ring-mauve-100 [&>span]:leading-none"
                                    >
                                        <SelectValue placeholder="?좏깮" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="FITNESS" className="!h-10">?쇳듃?덉뒪</SelectItem>
                                        <SelectItem value="ART" className="!h-10">?덉닠</SelectItem>
                                        <SelectItem value="COOK" className="!h-10">?붾━</SelectItem>
                                        <SelectItem value="STUDY" className="!h-10">?숈뒿</SelectItem>
                                        <SelectItem value="BEAUTY" className="!h-10">酉고떚</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <input
                            type="file"
                            id="proofFile"
                            name="proofFile"
                            accept="application/pdf,video/mp4"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden mt-2">
                            <label className="text-sm font-semibold text-slate-700">
                                ?몄쬆 ?뚯씪
                            </label>

                            {!previewFile || !previewUrl ? (
                                <label
                                    htmlFor="proofFile"
                                    className="flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition-colors hover:border-mauve-300 hover:bg-mauve-50/50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                                        <span className="text-xl font-bold text-mauve-500">
                                            +
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        ?뚯씪 ?낅줈?쒗븯湲?
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        PDF ?먮뒗 MP4 ?뚯씪 1媛쒕쭔 ?깅줉?????덉뒿?덈떎.
                                    </p>
                                </label>
                            ) : (
                                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
                                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-slate-700">
                                                ?뚯씪 誘몃━蹂닿린
                                            </p>

                                            <p className="max-w-64 truncate text-xs font-medium text-slate-400">
                                                {previewFile.name}
                                            </p>
                                        </div>

                                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-50 text-sm text-slate-400">
                                            {previewFile.type === "application/pdf" ? (
                                                <iframe
                                                    src={previewUrl}
                                                    title="PDF 誘몃━蹂닿린"
                                                    className="h-full w-full rounded-xl border-0"
                                                />
                                            ) : (
                                                <video
                                                    src={previewUrl}
                                                    controls
                                                    className="h-full w-full rounded-xl object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex-1" />
                                        <label
                                            htmlFor="proofFile"
                                            className="mr-2 flex shrink-0 cursor-pointer items-center justify-center text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
                                        >
                                            ?뚯씪 諛붽씀湲?
                                        </label>
                                    </div>

                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="my-4 flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting && (
                                <Spinner className="size-5" />
                            )}
                            {isSubmitting ? "요청 중..." : "?깅줉 ?붿껌?섍린"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
