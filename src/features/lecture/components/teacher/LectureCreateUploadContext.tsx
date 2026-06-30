"use client";

import axios from "axios";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";
import { createLectureWithChapters } from "@/app/services/lecture/create/service";
import {
    getLectureCreateAccessTokenAction,
    revalidateTeacherLectureCreateAction,
} from "./action";

export interface LectureUploadTask {
    id: string;
    title: string;
    progress: number;
    status: "uploading" | "completed" | "failed";
    lectureId?: number;
    errorMessage?: string;
    completedAt?: number;
}

interface LectureCreateUploadContextValue {
    tasks: LectureUploadTask[];
    startUpload: (formData: FormData) => Promise<void>;
    cancelUpload: (taskId: string) => void;
    removeTask: (taskId: string) => void;
}

const LectureCreateUploadContext =
    createContext<LectureCreateUploadContextValue | null>(null);

const LECTURE_UPLOAD_TASKS_STORAGE_KEY = "momo-lecture-upload-tasks";
const LECTURE_UPLOAD_TASK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const clearLectureUploadTasksStorage = () => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(LECTURE_UPLOAD_TASKS_STORAGE_KEY);
};

const createUploadTaskId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const markInterruptedStoredTasks = (tasks: LectureUploadTask[]) =>
    tasks.map((task) =>
        task.status === "uploading"
            ? {
                ...task,
                status: "failed" as const,
                errorMessage: "새로고침으로 업로드가 중단되었습니다.",
            }
            : task
    );

const normalizeStoredTasks = (tasks: LectureUploadTask[]) => {
    const now = Date.now();

    return markInterruptedStoredTasks(tasks)
        .map((task) => {
            if (
                (task.status === "completed" || task.status === "failed") &&
                !task.completedAt
            ) {
                return {
                    ...task,
                    completedAt: now,
                };
            }

            return task;
        })
        .filter((task) => {
            if (task.status !== "completed" && task.status !== "failed") {
                return true;
            }

            if (!task.completedAt) {
                return true;
            }

            return now - task.completedAt <= LECTURE_UPLOAD_TASK_TTL_MS;
        });
};

const loadStoredTasks = () => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedValue = window.localStorage.getItem(LECTURE_UPLOAD_TASKS_STORAGE_KEY);

        if (!storedValue) {
            return [];
        }

        const parsedTasks = JSON.parse(storedValue) as LectureUploadTask[];

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return normalizeStoredTasks(parsedTasks);
    } catch {
        return [];
    }
};

export function LectureCreateUploadProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [tasks, setTasks] = useState<LectureUploadTask[]>(loadStoredTasks);
    const abortControllerByTaskIdRef = useRef(new Map<string, AbortController>());

    useEffect(() => {
        window.localStorage.setItem(
            LECTURE_UPLOAD_TASKS_STORAGE_KEY,
            JSON.stringify(tasks)
        );
    }, [tasks]);

    const startUpload = useCallback(async (formData: FormData) => {
        const title = String(formData.get("title") ?? "").trim();
        const taskId = createUploadTaskId();
        const abortController = new AbortController();

        abortControllerByTaskIdRef.current.set(taskId, abortController);

        setTasks((prev) => [
            {
                id: taskId,
                title: title || "새 강의",
                progress: 0,
                status: "uploading",
            },
            ...prev,
        ]);

        try {
            const accessToken = await getLectureCreateAccessTokenAction();
            const result = await createLectureWithChapters({
                formData,
                accessToken,
                signal: abortController.signal,
                onProgress: (progress) => {
                    setTasks((prev) =>
                        prev.map((task) =>
                            task.id === taskId
                                ? {
                                    ...task,
                                    progress,
                                }
                                : task
                        )
                    );
                },
            });

            const lectureId = result.data?.lectureId;
            const lectureTitle = result.data?.title ?? title;

            if (!lectureId) {
                throw new Error("업로드된 강의 id를 찾을 수 없습니다.");
            }

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? {
                            id: task.id,
                            title: lectureTitle,
                            progress: 100,
                            status: "completed",
                            lectureId,
                            completedAt: Date.now(),
                        }
                        : task
                )
            );
            toast.success(result.message, { duration: 1000 });
            await revalidateTeacherLectureCreateAction(lectureId);
        } catch (error) {
            const isCanceled =
                axios.isCancel(error) ||
                (error instanceof Error && error.name === "CanceledError");
            const message = isCanceled
                ? "업로드가 취소되었습니다."
                : error instanceof Error
                    ? error.message
                    : "강의 등록에 실패했습니다.";

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? {
                            ...task,
                            status: "failed",
                            errorMessage: message,
                            completedAt: Date.now(),
                        }
                        : task
                )
            );

            if (isCanceled) {
                toast.info(message, { duration: 1500 });
            } else {
                toast.error(message, { duration: 1500 });
            }
        } finally {
            abortControllerByTaskIdRef.current.delete(taskId);
        }
    }, []);

    const cancelUpload = useCallback((taskId: string) => {
        abortControllerByTaskIdRef.current.get(taskId)?.abort();
    }, []);

    const removeTask = useCallback((taskId: string) => {
        abortControllerByTaskIdRef.current.get(taskId)?.abort();
        abortControllerByTaskIdRef.current.delete(taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }, []);

    const value = useMemo(
        () => ({
            tasks,
            startUpload,
            cancelUpload,
            removeTask,
        }),
        [tasks, startUpload, cancelUpload, removeTask]
    );

    return (
        <LectureCreateUploadContext.Provider value={value}>
            {children}
        </LectureCreateUploadContext.Provider>
    );
}

export const useLectureCreateUpload = () => {
    const context = useContext(LectureCreateUploadContext);

    if (!context) {
        throw new Error(
            "useLectureCreateUpload must be used within LectureCreateUploadProvider."
        );
    }

    return context;
};
